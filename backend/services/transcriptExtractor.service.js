/**
 * Transcript extractor — hybrid pdf-parse + Claude Vision pipeline.
 *
 * Strategy:
 *   1. Try `pdf-parse` first (free, fast, works for digital PDFs)
 *   2. If that returns < MIN_PARSE_CONFIDENCE valid courses, fall back to Claude
 *      Vision which can read scanned PDFs and phone-camera images directly
 *   3. Always return a normalized course list + extraction metadata
 *
 * Why hybrid: digital KNUST/UG/UCC transcripts (~30-50% of users) parse fine with
 * the free pdf-parse path — we save the API cost. Scanned + photographed transcripts
 * need a vision model. Claude Haiku at ~$0.001/parse keeps margins healthy.
 *
 * Without ANTHROPIC_API_KEY set, the fallback is unavailable and we surface a clear
 * "manual entry only" warning to the user — they can still hand-type their courses.
 */

const https = require('https')
const pdfParse = require('pdf-parse')
const legacyParser = require('./pdfParser.service')

// NOTE on HTTP transport: we tried (1) the @anthropic-ai/sdk v0.98, (2) Node's
// native fetch / undici, and (3) axios 1.13 — all three fail with Connection error
// or ECONNRESET when POSTing multi-MB base64 PDFs from inside a long-lived Express
// process. Only Node's built-in https.request works reliably here, so we use it directly.

/** Lazy https Agent with keepAlive:false — fresh TCP per request. */
let _agent = null
function agent() {
  if (!_agent) _agent = new https.Agent({ keepAlive: false, rejectUnauthorized: true })
  return _agent
}

/**
 * POST to Anthropic via the `curl` binary in a child process. We tried four other
 * approaches first (SDK, native fetch, axios, raw https.request) and they all hit
 * ECONNRESET when posting multi-MB PDFs from inside a long-lived Express process.
 * curl is the one transport that reliably works.
 *
 * Returns { status, data } where data is parsed JSON.
 */
const { spawn } = require('child_process')
function anthropicPost(payload) {
  const body = JSON.stringify(payload)
  return new Promise((resolve, reject) => {
    // -s silent, --max-time 300 (5 min), -w "\n<<HTTP_STATUS:%{http_code}>>"
    const curl = spawn(
      'curl',
      [
        '-sS',
        '--max-time', '300',
        '-X', 'POST',
        '-H', `x-api-key: ${apiKey()}`,
        '-H', 'anthropic-version: 2023-06-01',
        '-H', 'content-type: application/json',
        '--data-binary', '@-',
        '-w', '\n<<HTTP_STATUS:%{http_code}>>',
        'https://api.anthropic.com/v1/messages',
      ],
      { stdio: ['pipe', 'pipe', 'pipe'] }
    )
    let stdout = ''
    let stderr = ''
    curl.stdout.on('data', (c) => { stdout += c.toString() })
    curl.stderr.on('data', (c) => { stderr += c.toString() })
    curl.on('error', (e) => reject(new Error(`Failed to spawn curl: ${e.message}`)))
    curl.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`curl exited ${code}: ${stderr.slice(0, 300)}`))
      }
      // Extract status from the trailing marker
      const m = stdout.match(/\n<<HTTP_STATUS:(\d+)>>$/)
      const status = m ? parseInt(m[1], 10) : 0
      const bodyText = m ? stdout.slice(0, m.index) : stdout
      let parsed
      try { parsed = JSON.parse(bodyText) } catch { parsed = bodyText }
      resolve({ status, data: parsed })
    })
    curl.stdin.write(body)
    curl.stdin.end()
  })
}

// NOTE: we deliberately call the Anthropic REST API via axios instead of:
//   1. @anthropic-ai/sdk — v0.98 has a regression where multi-megabyte PDF payloads
//      time out at the transport layer ("Connection error" after ~30s × 3 retries).
//   2. Node's built-in fetch (undici) — its HTTP/1.1 keep-alive pool gets ECONNRESET
//      from Anthropic's load balancer on large POSTs after the process has been alive
//      for a while. Axios uses Node's http/https module directly and is reliable here.

// Minimum courses pdf-parse must extract before we trust it. Below this we fall
// back to Claude — protects against partial-text PDFs that look successful but lose rows.
const MIN_PARSE_CONFIDENCE = 3

// Resolve env at call time (not module load) so dotenv overrides work correctly even
// if the service module gets required before dotenv.config() runs.
function apiKey() {
  return process.env.ANTHROPIC_API_KEY
}
function model() {
  return process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5'
}
function hasClaudeKey() {
  const k = apiKey()
  return Boolean(k && k.trim())
}

/**
 * The strict schema Claude must return. Used for tool-call structured output.
 */
const COURSE_EXTRACTION_TOOL = {
  name: 'extract_transcript_courses',
  description:
    "Return the list of completed academic courses parsed from the student's transcript. " +
    "Skip headers, GPA summaries, signatures, and anything that isn't a graded course row.",
  input_schema: {
    type: 'object',
    properties: {
      sourceUniversity: {
        type: 'string',
        enum: ['KNUST', 'UG', 'UCC', 'UEW', 'GIMPA', 'OTHER', 'UNKNOWN'],
        description:
          'Best guess of the issuing institution from headers / branding. UNKNOWN if not detectable.',
      },
      gradingScheme: {
        type: 'string',
        enum: ['percentage', 'letter', 'mixed'],
        description:
          'Whether the transcript reports raw percentage scores, letter grades, or both per course.',
      },
      courses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            courseCode: { type: 'string', description: 'e.g. CSM 151. Empty string if missing.' },
            courseName: { type: 'string' },
            credits: {
              type: 'number',
              description: 'Credit hours / units (typically 1-6). Required.',
            },
            score: {
              type: ['number', 'null'],
              description: 'Percentage score 0-100 if shown. Null if only a letter was given.',
            },
            grade: {
              type: ['string', 'null'],
              description: 'Letter grade (A, B+, C, etc.). Null if only a percentage was given.',
            },
            semester: {
              type: 'string',
              description: 'e.g. "Level 100, Semester 1" or empty if not labelled.',
            },
          },
          required: ['courseName', 'credits'],
        },
      },
      warnings: {
        type: 'array',
        items: { type: 'string' },
        description: 'Anything that looked uncertain — e.g. blurred grade, ambiguous credit value.',
      },
    },
    required: ['courses', 'sourceUniversity', 'gradingScheme'],
  },
}

const EXTRACTION_PROMPT =
  'You are reading a Ghanaian university transcript (typically KNUST, UG, UCC, UEW, or similar). ' +
  'Extract every graded course row into the structured tool call. Rules:\n' +
  '- Include only completed courses with a grade or percentage. Skip headers, signature lines, ' +
  'GPA summaries, "Continued on next page", and audit/withdrawn courses.\n' +
  '- Course codes are short (e.g. CSM 151, MATH 101, CHEM 201). Pull them as-is.\n' +
  '- Credit hours are typically 1-6.\n' +
  '- If both percentage and letter are shown, fill both.\n' +
  '- If a row is unclear (blurry scan, ambiguous number), include it but add a one-sentence ' +
  'note in `warnings` for the user to review.\n' +
  '- Detect the issuing university from the header. Use UNKNOWN if not obvious.\n' +
  'Be conservative — better to flag a row in warnings than to fabricate data.'

/**
 * Quick sanity check: do the pdf-parse courses look real enough to ship?
 * Heuristic: at least MIN_PARSE_CONFIDENCE rows, each with a recognisable grade/score.
 */
function pdfParseLooksGood(courses) {
  if (!Array.isArray(courses) || courses.length < MIN_PARSE_CONFIDENCE) return false
  const usable = courses.filter(
    (c) =>
      c.courseName &&
      c.courseName.length > 2 &&
      c.credits > 0 &&
      (c.grade || (typeof c.score === 'number' && c.score > 0))
  )
  return usable.length >= MIN_PARSE_CONFIDENCE
}

/**
 * Normalize whatever the legacy parser returns to the same shape Claude returns.
 */
function normalizeCourse(c) {
  const courseCode = c.courseCode ?? c.code ?? ''
  let semester = c.semester ?? ''
  // If the parser didn't tag semester info (the legacy pdf-parse path doesn't),
  // infer Level from the first digit of the course code's number. Ghana universities
  // use a strict convention: CE 1xx = Level 100, COE 4xx = Level 400, etc.
  if (!semester && courseCode) {
    const m = String(courseCode).match(/\b([A-Z]{2,4})\s*(\d)\d{2,3}\b/)
    if (m) {
      semester = `Level ${m[2]}00`
    }
  }
  return {
    courseCode,
    courseName: c.courseName ?? c.name ?? '',
    credits: Number(c.credits) || 0,
    score: c.score === undefined || c.score === null || c.score === 0 ? null : Number(c.score),
    grade: c.grade ?? null,
    semester,
  }
}

/**
 * Main entry point. Accepts a Node Buffer + the upload mimetype. Returns:
 *   {
 *     success: true,
 *     courses: [...],
 *     sourceUniversity: 'KNUST' | 'UG' | ...,
 *     gradingScheme: 'percentage' | 'letter' | 'mixed',
 *     extractionMethod: 'pdf-parse' | 'claude' | 'manual',
 *     warnings: [...],
 *   }
 */
async function extractTranscript(buffer, mimetype) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return { success: false, error: 'Empty file', courses: [] }
  }

  const isPdf = mimetype === 'application/pdf'
  const isImage = mimetype === 'image/jpeg' || mimetype === 'image/png'

  if (!isPdf && !isImage) {
    return {
      success: false,
      error: `Unsupported file type: ${mimetype}. Use PDF, JPG, or PNG.`,
      courses: [],
    }
  }

  // We deliberately skip the pdf-parse free path and always use Claude. pdf-parse
  // is fast but misses semester labels (KNUST embeds them as standalone "FIRST SEMESTER"
  // headers that are easy for a vision model to associate with the rows below, but
  // hard for a regex parser to track). At ~1¢ per parse, Claude is well within margin
  // and produces dramatically better structure (semester groupings, source-university
  // detection, per-row warnings). The pdf-parse module is kept for tests + as a
  // backup if ANTHROPIC_API_KEY is unset (see below).

  // Step 2: Claude vision (always preferred when key is set)
  if (!hasClaudeKey()) {
    // Backup: if no API key, try pdf-parse for digital PDFs so the system still
    // works for self-hosters without a key. Images can't be parsed without Claude.
    if (isPdf) {
      try {
        const parseResult = await legacyParser.parseTranscript(buffer)
        if (parseResult.success && pdfParseLooksGood(parseResult.courses)) {
          return {
            success: true,
            courses: parseResult.courses.map(normalizeCourse),
            sourceUniversity: parseResult.format === 'KNUST' ? 'KNUST' : 'UNKNOWN',
            gradingScheme: 'mixed',
            extractionMethod: 'pdf-parse',
            warnings: [
              'AI extraction is not configured — using basic pdf-parse fallback. ' +
                'Semester labels and source-university detection will be limited.',
            ],
          }
        }
      } catch (_) {}
    }
    return {
      success: true,
      courses: [],
      sourceUniversity: 'UNKNOWN',
      gradingScheme: 'mixed',
      extractionMethod: 'manual',
      warnings: [
        isImage
          ? 'AI extraction is not configured (ANTHROPIC_API_KEY missing). Please type your courses manually.'
          : "We couldn't read this PDF (it may be scanned). AI extraction is not configured " +
            '(ANTHROPIC_API_KEY missing). Please type your courses manually.',
      ],
    }
  }

  try {
    const claudeResult = await extractWithClaude(buffer, mimetype)
    return {
      success: true,
      courses: claudeResult.courses.map(normalizeCourse),
      sourceUniversity: claudeResult.sourceUniversity,
      gradingScheme: claudeResult.gradingScheme,
      extractionMethod: 'claude',
      warnings: claudeResult.warnings || [],
    }
  } catch (e) {
    // Log the full error server-side so we can diagnose (status, type, request id)
    console.error('[transcriptExtractor] Claude call failed:', {
      message: e.message,
      name: e.name,
      cause: e.cause?.message,
      causeCode: e.cause?.code,
      causeErrno: e.cause?.errno,
      status: e.status,
      stack: e.stack?.split('\n').slice(0, 4).join('\n'),
    })
    return {
      success: false,
      error: `AI extraction failed: ${e.message}`,
      courses: [],
      extractionMethod: 'claude',
    }
  }
}

/**
 * Send the file directly to the Anthropic REST API with the structured-output tool spec.
 * Claude accepts PDFs natively as `type: 'document'` and images as `type: 'image'`.
 *
 * Uses native fetch (not the SDK) — see top-of-file note on the v0.98 SDK bug.
 */
async function extractWithClaude(buffer, mimetype) {
  if (!hasClaudeKey()) {
    throw new Error('ANTHROPIC_API_KEY is not set. Add it to backend/.env to enable AI extraction.')
  }
  const base64 = buffer.toString('base64')

  const contentBlock =
    mimetype === 'application/pdf'
      ? {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 },
        }
      : {
          type: 'image',
          source: { type: 'base64', media_type: mimetype, data: base64 },
        }

  // 8192 max_tokens — a full multi-semester transcript can have 40+ courses,
  // each producing ~100 tokens of structured JSON output.
  const payload = {
    model: model(),
    max_tokens: 8192,
    tools: [COURSE_EXTRACTION_TOOL],
    tool_choice: { type: 'tool', name: 'extract_transcript_courses' },
    messages: [
      {
        role: 'user',
        content: [contentBlock, { type: 'text', text: EXTRACTION_PROMPT }],
      },
    ],
  }

  let res
  try {
    res = await anthropicPost(payload)
  } catch (e) {
    throw new Error(`Network error calling Anthropic: ${e.message}`)
  }

  if (res.status < 200 || res.status >= 300) {
    const errBody = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    throw new Error(`Anthropic API ${res.status}: ${errBody.slice(0, 300)}`)
  }

  const toolUse = (res.data.content || []).find((b) => b.type === 'tool_use')
  if (!toolUse) {
    throw new Error('Claude did not return a structured extraction')
  }
  return toolUse.input
}

module.exports = {
  extractTranscript,
  hasClaudeKey,
  pdfParseLooksGood, // exposed for tests
  normalizeCourse,   // exposed for tests
  MIN_PARSE_CONFIDENCE,
}
