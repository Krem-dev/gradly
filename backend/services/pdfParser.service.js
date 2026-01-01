const pdfParse = require('pdf-parse')
const formatDetector = require('./transcriptFormatDetector')

class PDFParserService {
  constructor() {
    this.gradePatterns = [
      /^[A-F][+-]?$/,
      /^(A|B|C|D|E|F)$/,
      /^\d{1,3}(\.\d{1,2})?$/
    ]
  }

  async parseTranscript(pdfBuffer) {
    try {
      const data = await pdfParse(pdfBuffer)
      const text = data.text
      
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      
      const format = formatDetector.detectFormat(text)
      
      let courses = []
      
      if (format === 'KNUST') {
        courses = this.extractCoursesKNUST(lines)
      } else if (format === 'GENERIC') {
        courses = this.extractCoursesGeneric(lines)
      } else {
        courses = this.extractCoursesGeneric(lines)
      }
      
      return {
        success: true,
        courses: courses,
        format: format,
        rawText: text,
        lineCount: lines.length,
        courseCount: courses.length
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        courses: [],
        format: 'UNKNOWN'
      }
    }
  }

  extractCoursesKNUST(lines) {
    const courses = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (this.isKNUSTCourseLine(line)) {
        const course = this.parseKNUSTCourse(line)
        
        if (course && this.isValidCourse(course)) {
          courses.push(course)
        }
      }
    }
    
    return courses
  }

  extractCoursesGeneric(lines) {
    const courses = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (this.isGenericCourseLine(line)) {
        const course = this.parseGenericCourse(line)
        
        if (course && this.isValidCourse(course)) {
          courses.push(course)
        }
      }
    }
    
    return courses
  }

  isKNUSTCourseLine(line) {
    if (line.length < 10) return false
    if (this.isHeaderOrFooter(line)) return false
    if (this.isGradeDistribution(line)) return false
    if (this.isUniversityInfo(line)) return false
    if (this.isSummaryLine(line)) return false
    
    const courseCodeMatch = line.match(/^[A-Z]{2,4}\s*\d{3,4}/)
    const hasGrade = /[A-F][+-]?$/.test(line)
    const hasCredits = /\d[A-F][+-]?$/.test(line)
    
    return courseCodeMatch && hasGrade && hasCredits
  }

  parseKNUSTCourse(line) {
    const courseCodeMatch = line.match(/^([A-Z]{2,4}\s*\d{3,4})/)
    
    if (!courseCodeMatch) return null
    
    const courseCode = courseCodeMatch[1].trim()
    const remaining = line.substring(courseCodeMatch[0].length)
    
    const gradeMatch = remaining.match(/([A-F][+-]?)\s*$/)
    if (!gradeMatch) return null
    
    const grade = gradeMatch[1]
    const beforeGrade = remaining.substring(0, remaining.length - gradeMatch[0].length).trim()
    
    const scoreMatch = beforeGrade.match(/(\d{2})$/)
    if (!scoreMatch) return null
    
    const score = parseInt(scoreMatch[1])
    const beforeScore = beforeGrade.substring(0, beforeGrade.length - scoreMatch[0].length).trim()
    
    const creditMatch = beforeScore.match(/(\d)$/)
    if (!creditMatch) return null
    
    const credits = parseInt(creditMatch[1])
    const courseName = beforeScore.substring(0, beforeScore.length - creditMatch[0].length).trim()
    
    if (!courseName || courseName.length < 2) return null
    
    return {
      courseName: courseName,
      courseCode: courseCode,
      credits: credits,
      grade: grade,
      score: score,
      rawLine: line
    }
  }

  isGenericCourseLine(line) {
    if (line.length < 10) return false
    if (this.isHeaderOrFooter(line)) return false
    if (this.isSummaryLine(line)) return false
    
    const hasCode = /[A-Z]{2,4}\s*\d{3,4}/.test(line)
    const hasGrade = /[A-F][+-]?/.test(line)
    const hasNumber = /\d/.test(line)
    
    return hasCode && hasGrade && hasNumber
  }

  parseGenericCourse(line) {
    const codeMatch = line.match(/^([A-Z]{2,4}\s*\d{3,4})/)
    if (!codeMatch) return null
    
    const courseCode = codeMatch[1].trim()
    const remaining = line.substring(codeMatch[0].length).trim()
    
    const gradeMatch = remaining.match(/([A-F][+-]?)\s*$/)
    const grade = gradeMatch ? gradeMatch[1] : null
    
    if (!grade) return null
    
    const beforeGrade = gradeMatch 
      ? remaining.substring(0, remaining.length - gradeMatch[0].length).trim()
      : remaining
    
    const scoreMatch = beforeGrade.match(/(\d{1,3})(?:\.\d+)?/)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null
    
    const creditMatch = beforeGrade.match(/(\d)(?:\s|$)/)
    const credits = creditMatch ? parseInt(creditMatch[1]) : 3
    
    const courseName = beforeGrade
      .replace(/\d{1,3}(?:\.\d+)?/, '')
      .replace(/\d(?:\s|$)/, '')
      .trim()
    
    if (!courseName || courseName.length < 2) return null
    
    return {
      courseName: courseName,
      courseCode: courseCode,
      credits: credits,
      grade: grade,
      score: score || 0,
      rawLine: line
    }
  }

  gradeToScore(grade) {
    const baseGrade = grade.charAt(0)
    const modifier = grade.length > 1 ? grade.charAt(1) : ''
    
    let score = 0
    switch(baseGrade) {
      case 'A': score = 90; break
      case 'B': score = 80; break
      case 'C': score = 70; break
      case 'D': score = 60; break
      case 'E': score = 50; break
      case 'F': score = 0; break
      default: score = 0
    }
    
    if (modifier === '+') score += 3
    if (modifier === '-') score -= 3
    
    return Math.max(0, Math.min(100, score))
  }


  isValidCourse(course) {
    const hasName = course.courseName && course.courseName.length > 2
    const hasGradeOrScore = course.grade || course.score !== null
    const hasCredits = course.credits !== null && course.credits > 0
    
    return hasName && hasGradeOrScore && hasCredits
  }

  isHeaderOrFooter(line) {
    const headerFooterKeywords = [
      'page', 'transcript', 'university', 'institution', 'student',
      'semester', 'term', 'academic', 'gpa', 'cumulative', 'total',
      'date', 'signature', 'registrar', 'official'
    ]
    
    const lowerLine = line.toLowerCase()
    return headerFooterKeywords.some(keyword => lowerLine.includes(keyword))
  }

  isGradeDistribution(line) {
    return /grade\s*distribution|distribution\s*of\s*grades/i.test(line)
  }

  isUniversityInfo(line) {
    return /address|phone|email|website|contact/i.test(line)
  }

  isSummaryLine(line) {
    return /summary|total|cumulative|overall|final/i.test(line) && 
           !/^[A-Z]/.test(line.trim())
  }
}

module.exports = new PDFParserService()
