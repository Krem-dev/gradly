const pdfParserService = require('../services/pdfParser.service')

class TranscriptController {
  static async parseTranscript(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        })
      }

      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({
          success: false,
          error: 'File must be a PDF'
        })
      }

      const parseResult = await pdfParserService.parseTranscript(req.file.buffer)

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: parseResult.error || 'Failed to parse PDF'
        })
      }

      const cleanedCourses = TranscriptController.cleanAndValidateCourses(parseResult.courses)

      return res.status(200).json({
        success: true,
        courses: cleanedCourses,
        totalCourses: cleanedCourses.length,
        message: `Successfully extracted ${cleanedCourses.length} courses from transcript`
      })
    } catch (error) {
      console.error('Transcript parsing error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to process transcript',
        details: error.message
      })
    }
  }

  static cleanAndValidateCourses(courses) {
    return courses
      .filter(course => {
        const hasValidName = course.courseName && course.courseName.length > 2
        const hasValidGrade = course.grade && /^[A-F][+-]?$/.test(course.grade)
        const hasValidCredits = course.credits && course.credits > 0 && course.credits <= 12

        return hasValidName && (hasValidGrade || course.score !== null) && hasValidCredits
      })
      .map(course => ({
        name: course.courseName,
        code: course.courseCode,
        credits: parseFloat(course.credits),
        grade: course.grade,
        score: course.score,
        semester: this.inferSemester(course)
      }))
      .filter((course, index, self) => 
        index === self.findIndex(c => 
          c.name.toLowerCase() === course.name.toLowerCase() &&
          c.credits === course.credits
        )
      )
  }

  static inferSemester(course) {
    if (course.courseCode) {
      const codeNum = parseInt(course.courseCode.match(/\d+/)?.[0] || '0')
      if (codeNum >= 100 && codeNum < 200) return 'Semester 1'
      if (codeNum >= 200 && codeNum < 300) return 'Semester 2'
      if (codeNum >= 300 && codeNum < 400) return 'Semester 3'
      if (codeNum >= 400 && codeNum < 500) return 'Semester 4'
    }
    return 'Unknown'
  }

  static cleanAndValidateCourses(courses) {
    return courses
      .filter(course => {
        const hasValidName = course.courseName && course.courseName.length > 2
        const hasValidGrade = course.grade && /^[A-F][+-]?$/.test(course.grade)
        const hasValidCredits = course.credits && course.credits > 0 && course.credits <= 12

        return hasValidName && (hasValidGrade || course.score !== null) && hasValidCredits
      })
      .map(course => ({
        name: course.courseName,
        code: course.courseCode,
        credits: parseFloat(course.credits),
        grade: course.grade,
        score: course.score,
        semester: TranscriptController.inferSemester(course)
      }))
      .filter((course, index, self) => 
        index === self.findIndex(c => 
          c.name.toLowerCase() === course.name.toLowerCase() &&
          c.credits === course.credits
        )
      )
  }
}

module.exports = TranscriptController
