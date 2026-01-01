class TranscriptFormatDetector {
  detectFormat(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    const detectors = [
      { name: 'KNUST', detect: () => this.isKNUSTFormat(lines) },
      { name: 'GENERIC', detect: () => this.isGenericFormat(lines) }
    ]
    
    for (const detector of detectors) {
      if (detector.detect()) {
        return detector.name
      }
    }
    
    return 'UNKNOWN'
  }

  isKNUSTFormat(lines) {
    const hasKNUSTHeader = lines.some(line => 
      line.includes('KWAME NKRUMAH') || 
      line.includes('KNUST') ||
      line.includes('University of Science and Technology')
    )
    
    const hasTranscriptHeader = lines.some(line => 
      line.includes('ACADEMIC TRANSCRIPT') ||
      line.includes('Course Code') && line.includes('Grade')
    )
    
    const hasCoursePattern = lines.some(line => 
      /^[A-Z]{2,4}\s*\d{3,4}/.test(line) &&
      /\d{2}[A-F][+-]?$/.test(line)
    )
    
    return hasKNUSTHeader && hasTranscriptHeader && hasCoursePattern
  }

  isGenericFormat(lines) {
    let courseCount = 0
    
    for (const line of lines) {
      if (this.looksLikeCourse(line)) {
        courseCount++
      }
    }
    
    return courseCount >= 5
  }

  looksLikeCourse(line) {
    const hasCode = /[A-Z]{2,4}\s*\d{3,4}/.test(line)
    const hasGrade = /[A-F][+-]?/.test(line)
    const hasNumber = /\d/.test(line)
    
    return hasCode && hasGrade && hasNumber && line.length > 15
  }
}

module.exports = new TranscriptFormatDetector()
