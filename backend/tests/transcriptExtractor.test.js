/**
 * transcriptExtractor tests — mock fetch so we never hit the live API.
 *
 * We verify:
 *  - Empty / wrong-mimetype files are rejected
 *  - pdf-parse path returns courses when the legacy parser succeeds
 *  - Falls back to Claude when pdf-parse returns < MIN_PARSE_CONFIDENCE
 *  - Returns "manual" mode when Claude key is missing AND pdf-parse can't extract
 *  - pdfParseLooksGood heuristic
 *  - normalizeCourse shape
 */

// Mock child_process.spawn — the service shells out to curl because every other
// HTTP client we tried (SDK / native fetch / axios / raw https.request) hits
// ECONNRESET when posting multi-MB PDFs from a long-lived Express process.
//
// The mock simulates curl: stdin gets the body (captured in `mockLastBodySent` so
// tests can inspect what was POSTed), stdout emits the JSON response plus a
// trailing "<<HTTP_STATUS:NNN>>" marker, then close fires.
//
// Jest hoists `jest.mock()` above all imports, so the factory cannot reference
// out-of-scope variables. Variables prefixed with `mock` are an explicit exception.
const mockFetch = jest.fn() // returns { status, data }
const mockState = { lastBodySent: null, lastSpawnArgs: null }

jest.mock('child_process', () => {
  const { EventEmitter } = require('events')
  return {
    spawn: jest.fn((cmd, args) => {
      mockState.lastSpawnArgs = { cmd, args }
      const proc = new EventEmitter()
      let bodyBuf = ''
      proc.stdin = {
        write: (chunk) => { bodyBuf += chunk.toString() },
        end: () => { mockState.lastBodySent = bodyBuf },
      }
      proc.stdout = new EventEmitter()
      proc.stderr = new EventEmitter()
      setImmediate(async () => {
        let result
        try {
          result = await mockFetch()
        } catch (e) {
          proc.stderr.emit('data', Buffer.from(e.message))
          proc.emit('close', 1)
          return
        }
        const body = JSON.stringify(result.data)
        const marker = `\n<<HTTP_STATUS:${result.status}>>`
        proc.stdout.emit('data', Buffer.from(body + marker))
        proc.emit('close', 0)
      })
      return proc
    }),
  }
})

function mockClaudeResponse(input) {
  return {
    status: 200,
    data: {
      content: [{ type: 'tool_use', name: 'extract_transcript_courses', input }],
    },
  }
}

function mockClaudeError(status, message) {
  return {
    status,
    data: { error: { message } },
  }
}

// Mock pdf-parse so we can control what the "free path" returns
const mockPdfParse = jest.fn()
jest.mock('pdf-parse', () => (...args) => mockPdfParse(...args))

const PDF_BUFFER = Buffer.from('%PDF-1.4 fake pdf bytes')
const PNG_BUFFER = Buffer.from('\x89PNG\r\n\x1a\nfake png bytes')

beforeEach(() => {
  mockFetch.mockReset()
  mockPdfParse.mockReset()
  mockState.lastBodySent = null
  mockState.lastSpawnArgs = null
  jest.resetModules()
})

function loadModule({ withKey = true } = {}) {
  if (withKey) process.env.ANTHROPIC_API_KEY = 'test-key-not-real'
  else delete process.env.ANTHROPIC_API_KEY
  return require('../services/transcriptExtractor.service')
}

describe('transcriptExtractor — input validation', () => {
  test('empty buffer → success:false', async () => {
    const { extractTranscript } = loadModule()
    const r = await extractTranscript(Buffer.alloc(0), 'application/pdf')
    expect(r.success).toBe(false)
    expect(r.error).toMatch(/empty/i)
  })

  test('unsupported mimetype → success:false', async () => {
    const { extractTranscript } = loadModule()
    const r = await extractTranscript(PDF_BUFFER, 'application/zip')
    expect(r.success).toBe(false)
    expect(r.error).toMatch(/Unsupported file type/i)
  })
})

describe('transcriptExtractor — pdf-parse backup path (no Claude key)', () => {
  test('uses pdf-parse when key is missing AND ≥3 valid courses are extracted', async () => {
    const fakeKnustText = `
KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY
ACADEMIC TRANSCRIPT
Course Code Title Credits Score Grade
CSM 151 Computer Programming 1 3 75A
MATH 161 Calculus 1 3 72A
PHYS 153 Physics 1 4 68B
ENG 159 English 2 65B
`
    mockPdfParse.mockResolvedValue({ text: fakeKnustText })

    const { extractTranscript } = loadModule({ withKey: false })
    const r = await extractTranscript(PDF_BUFFER, 'application/pdf')

    expect(r.success).toBe(true)
    expect(r.extractionMethod).toBe('pdf-parse')
    expect(r.courses.length).toBeGreaterThanOrEqual(3)
    expect(r.warnings[0]).toMatch(/AI extraction is not configured/i)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  test('with key set, always uses Claude (skips pdf-parse entirely)', async () => {
    mockPdfParse.mockResolvedValue({ text: 'no course data here at all' })
    mockFetch.mockResolvedValue(
      mockClaudeResponse({
        sourceUniversity: 'KNUST',
        gradingScheme: 'mixed',
        courses: [
          { courseName: 'Calc I', credits: 3, score: 75, grade: 'A', semester: 'L100 S1' },
          { courseName: 'Physics', credits: 4, score: 68, grade: 'B', semester: 'L100 S1' },
          { courseName: 'Prog', credits: 3, score: 80, grade: 'A', semester: 'L100 S1' },
        ],
        warnings: [],
      })
    )

    const { extractTranscript } = loadModule()
    const r = await extractTranscript(PDF_BUFFER, 'application/pdf')

    expect(r.success).toBe(true)
    expect(r.extractionMethod).toBe('claude')
    expect(r.sourceUniversity).toBe('KNUST')
    expect(r.courses).toHaveLength(3)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    // Verify curl was invoked with the right URL + headers and that the body we
    // POSTed (via stdin) has the correct tool + document content block.
    expect(mockState.lastSpawnArgs.cmd).toBe('curl')
    expect(mockState.lastSpawnArgs.args).toContain('https://api.anthropic.com/v1/messages')
    expect(mockState.lastSpawnArgs.args).toContain('anthropic-version: 2023-06-01')
    expect(mockState.lastSpawnArgs.args.some((a) => a.startsWith('x-api-key:'))).toBe(true)
    const sentBody = JSON.parse(mockState.lastBodySent)
    expect(sentBody.tools[0].name).toBe('extract_transcript_courses')
    expect(sentBody.messages[0].content[0].type).toBe('document')
  })

  test('handles encrypted/corrupt PDF (Claude still tries to read it)', async () => {
    // pdf-parse would throw on this PDF, but we don't even call it when key is set
    mockPdfParse.mockRejectedValue(new Error('encrypted'))
    mockFetch.mockResolvedValue(
      mockClaudeResponse({
        sourceUniversity: 'UG',
        gradingScheme: 'percentage',
        courses: [{ courseName: 'X', credits: 3, score: 80, grade: null, semester: '' }],
        warnings: [],
      })
    )
    const { extractTranscript } = loadModule()
    const r = await extractTranscript(PDF_BUFFER, 'application/pdf')
    expect(r.success).toBe(true)
    expect(r.extractionMethod).toBe('claude')
    expect(mockPdfParse).not.toHaveBeenCalled() // pdf-parse skipped entirely
  })
})

describe('transcriptExtractor — image uploads (phone photos)', () => {
  test('PNG goes straight to Claude (no pdf-parse step)', async () => {
    mockFetch.mockResolvedValue(
      mockClaudeResponse({
        sourceUniversity: 'KNUST',
        gradingScheme: 'percentage',
        courses: [
          { courseName: 'Calc I', credits: 3, score: 75, grade: 'A', semester: '' },
          { courseName: 'Physics', credits: 4, score: 68, grade: 'B', semester: '' },
        ],
        warnings: ['Bottom-right grade was partially blurred'],
      })
    )

    const { extractTranscript } = loadModule()
    const r = await extractTranscript(PNG_BUFFER, 'image/png')

    expect(r.success).toBe(true)
    expect(r.extractionMethod).toBe('claude')
    expect(mockPdfParse).not.toHaveBeenCalled()
    expect(r.warnings).toContain('Bottom-right grade was partially blurred')

    // Verify the API was called with image (not document) content type
    const sentBody = JSON.parse(mockState.lastBodySent)
    const block = sentBody.messages[0].content[0]
    expect(block.type).toBe('image')
    expect(block.source.media_type).toBe('image/png')
  })

  test('JPG also routes through Claude', async () => {
    mockFetch.mockResolvedValue(
      mockClaudeResponse({
        sourceUniversity: 'UNKNOWN',
        gradingScheme: 'letter',
        courses: [{ courseName: 'A', credits: 3, score: null, grade: 'B', semester: '' }],
        warnings: [],
      })
    )
    const { extractTranscript } = loadModule()
    const r = await extractTranscript(PNG_BUFFER, 'image/jpeg')
    expect(r.success).toBe(true)
    const sentBody = JSON.parse(mockState.lastBodySent)
    expect(sentBody.messages[0].content[0].source.media_type).toBe('image/jpeg')
  })
})

describe('transcriptExtractor — missing API key', () => {
  test('image upload without key → returns manual mode with helpful warning', async () => {
    const { extractTranscript } = loadModule({ withKey: false })
    const r = await extractTranscript(PNG_BUFFER, 'image/png')

    expect(r.success).toBe(true)
    expect(r.extractionMethod).toBe('manual')
    expect(r.courses).toEqual([])
    expect(r.warnings[0]).toMatch(/manually/i)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  test('PDF that pdf-parse cannot read, without key → returns manual mode', async () => {
    mockPdfParse.mockResolvedValue({ text: '' })
    const { extractTranscript } = loadModule({ withKey: false })
    const r = await extractTranscript(PDF_BUFFER, 'application/pdf')
    expect(r.success).toBe(true)
    expect(r.extractionMethod).toBe('manual')
  })
})

describe('transcriptExtractor — Claude failure handling', () => {
  test('fetch rejects (network error) → success:false with helpful error', async () => {
    mockPdfParse.mockResolvedValue({ text: '' })
    mockFetch.mockRejectedValue(new Error('rate limited'))

    const { extractTranscript } = loadModule()
    const r = await extractTranscript(PDF_BUFFER, 'application/pdf')

    expect(r.success).toBe(false)
    expect(r.error).toMatch(/AI extraction failed/i)
  })

  test('non-200 status → success:false with API status surfaced', async () => {
    mockPdfParse.mockResolvedValue({ text: '' })
    mockFetch.mockResolvedValue(mockClaudeError(429, 'rate_limit_error'))
    const { extractTranscript } = loadModule()
    const r = await extractTranscript(PDF_BUFFER, 'application/pdf')
    expect(r.success).toBe(false)
    expect(r.error).toMatch(/429/)
  })

  test('response with no tool_use block → success:false', async () => {
    mockPdfParse.mockResolvedValue({ text: '' })
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ content: [{ type: 'text', text: 'I cannot read this' }] }),
      text: async () => '',
    })
    const { extractTranscript } = loadModule()
    const r = await extractTranscript(PDF_BUFFER, 'application/pdf')
    expect(r.success).toBe(false)
  })
})

describe('transcriptExtractor — helpers', () => {
  test('pdfParseLooksGood requires ≥3 valid rows (course name length > 2)', () => {
    const { pdfParseLooksGood } = loadModule()
    expect(pdfParseLooksGood([])).toBe(false)
    expect(pdfParseLooksGood([{ courseName: 'Math', credits: 3, grade: 'A' }])).toBe(false)
    expect(
      pdfParseLooksGood([
        { courseName: 'Math', credits: 3, grade: 'A' },
        { courseName: 'Physics', credits: 3, grade: 'B' },
        { courseName: 'Chemistry', credits: 3, score: 75 },
      ])
    ).toBe(true)
  })

  test('pdfParseLooksGood rejects rows with single-character names (likely OCR noise)', () => {
    const { pdfParseLooksGood } = loadModule()
    expect(
      pdfParseLooksGood([
        { courseName: 'X', credits: 3, grade: 'A' },
        { courseName: 'Y', credits: 3, grade: 'B' },
        { courseName: 'Z', credits: 3, score: 75 },
      ])
    ).toBe(false)
  })

  test('pdfParseLooksGood rejects rows with no grade AND no score', () => {
    const { pdfParseLooksGood } = loadModule()
    expect(
      pdfParseLooksGood([
        { courseName: 'Math', credits: 3 },
        { courseName: 'Physics', credits: 3 },
        { courseName: 'Chemistry', credits: 3 },
      ])
    ).toBe(false)
  })

  test('normalizeCourse normalizes legacy + claude shapes to one schema', () => {
    const { normalizeCourse } = loadModule()
    expect(normalizeCourse({ name: 'X', code: 'M1', credits: '3', score: 75, grade: 'A' })).toEqual({
      courseCode: 'M1',
      courseName: 'X',
      credits: 3,
      score: 75,
      grade: 'A',
      semester: '',
    })
    expect(
      normalizeCourse({ courseName: 'Y', courseCode: 'P1', credits: 4, score: 0, grade: 'B', semester: 'S1' })
    ).toEqual({
      courseCode: 'P1',
      courseName: 'Y',
      credits: 4,
      score: null, // score: 0 normalises to null (no real percentage given)
      grade: 'B',
      semester: 'S1',
    })
  })
})
