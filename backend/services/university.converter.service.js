const gradeConfigService = require('./gradeConversionConfig.service')
const { pool } = require('../config/database')

let GRADING_SYSTEMS_CACHE = null
let CACHE_TIMESTAMP = null
const CACHE_TTL = 5 * 60 * 1000

async function getGradingSystems() {
  const now = Date.now()
  
  if (GRADING_SYSTEMS_CACHE && CACHE_TIMESTAMP && (now - CACHE_TIMESTAMP < CACHE_TTL)) {
    return GRADING_SYSTEMS_CACHE
  }
  
  const result = await gradeConfigService.getGradingSystems()
  
  if (result.success && result.data) {
    GRADING_SYSTEMS_CACHE = result.data.reduce((acc, system) => {
      acc[system.id] = {
        id: system.id,
        name: system.name,
        country: system.country,
        scale: { min: system.scale_min, max: system.scale_max },
        type: system.type
      }
      return acc
    }, {})
    CACHE_TIMESTAMP = now
    return GRADING_SYSTEMS_CACHE
  }
  
  return {}
}

async function scoreToLetterGrade(gradingSystemId, score) {
  const result = await gradeConfigService.scoreToLetterGrade(gradingSystemId, score)
  return result
}

const GRADING_SYSTEMS = {
  ghana_gpa: {
    id: 'ghana_gpa',
    name: 'GPA (4.0 Scale)',
    country: 'Ghana',
    scale: { min: 0, max: 4.0 },
    type: 'gpa'
  },
  ghana_cwa: {
    id: 'ghana_cwa',
    name: 'CWA (Percentage)',
    country: 'Ghana',
    scale: { min: 0, max: 100 },
    type: 'percentage'
  },
  nigeria_cgpa_5: {
    id: 'nigeria_cgpa_5',
    name: 'CGPA (5.0 Scale)',
    country: 'Nigeria',
    scale: { min: 0, max: 5.0 },
    type: 'cgpa'
  },
  nigeria_cgpa_4: {
    id: 'nigeria_cgpa_4',
    name: 'CGPA (4.0 Scale)',
    country: 'Nigeria',
    scale: { min: 0, max: 4.0 },
    type: 'cgpa'
  }
}

const CONVERSION_RULES = {
  ghana_gpa: (gpa) => ({
    usaGpa: gpa,
    ukPercentage: (gpa / 4.0) * 100
  }),
  ghana_cwa: (cwa) => {
    const usGrade = ghanaPercentageToUSGrade(cwa)
    const usaGpa = usGradeToPoints(usGrade)
    return {
      usaGpa: usaGpa,
      ukPercentage: cwa
    }
  },
  nigeria_cgpa_5: (cgpa) => ({
    usaGpa: (cgpa / 5.0) * 4.0,
    ukPercentage: (cgpa / 5.0) * 100
  }),
  nigeria_cgpa_4: (cgpa) => ({
    usaGpa: cgpa,
    ukPercentage: (cgpa / 4.0) * 100
  })
}

function validateScore(score, systemId) {
  const system = GRADING_SYSTEMS[systemId]
  
  if (!system) {
    throw new Error(`Invalid grading system: ${systemId}`)
  }
  
  const numScore = parseFloat(score)
  
  if (isNaN(numScore)) {
    throw new Error('Score must be a valid number')
  }
  
  if (numScore < system.scale.min || numScore > system.scale.max) {
    throw new Error(
      `Score must be between ${system.scale.min} and ${system.scale.max} for ${system.name}`
    )
  }
  
  return numScore
}

function calculateWeightedAverage(courses) {
  if (!courses || courses.length === 0) {
    throw new Error('Must provide at least one course')
  }
  
  let totalWeightedScore = 0
  let totalCredits = 0
  
  for (const course of courses) {
    const score = parseFloat(course.score)
    const credits = parseFloat(course.creditHours)
    
    if (isNaN(score)) {
      throw new Error(`Invalid score for course: ${course.name}`)
    }
    
    if (isNaN(credits) || credits <= 0) {
      throw new Error(`Invalid credit hours for course: ${course.name}`)
    }
    
    totalWeightedScore += score * credits
    totalCredits += credits
  }
  
  if (totalCredits === 0) {
    throw new Error('Total credits must be greater than 0')
  }
  
  const weightedAverage = totalWeightedScore / totalCredits
  return Math.round(weightedAverage * 100) / 100
}

async function calculateScholaroGPA(courses, systemId) {
  if (!courses || courses.length === 0) {
    throw new Error('Must provide at least one course')
  }
  
  if (systemId !== 'ghana_cwa') {
    return null
  }
  
  let totalPoints = 0
  let totalCredits = 0
  
  for (const course of courses) {
    const percentage = parseFloat(course.score)
    const credits = parseFloat(course.creditHours)
    
    if (isNaN(percentage)) {
      throw new Error(`Invalid score for course: ${course.name}`)
    }
    
    if (isNaN(credits) || credits <= 0) {
      throw new Error(`Invalid credit hours for course: ${course.name}`)
    }
    
    const gradeInfo = await scoreToLetterGrade(systemId, percentage)
    
    if (!gradeInfo) {
      throw new Error(`Could not convert score ${percentage} for system ${systemId}`)
    }
    
    totalPoints += gradeInfo.points * credits
    totalCredits += credits
  }
  
  if (totalCredits === 0) {
    throw new Error('Total credits must be greater than 0')
  }
  
  const gpa = totalPoints / totalCredits
  return Math.round(gpa * 100) / 100
}

function convertGrade(systemId, score) {
  if (!CONVERSION_RULES[systemId]) {
    throw new Error(`Unsupported grading system: ${systemId}`)
  }
  
  const validatedScore = validateScore(score, systemId)
  const result = CONVERSION_RULES[systemId](validatedScore)
  
  return {
    sourceSystem: systemId,
    sourceScore: validatedScore,
    usaGpa: Math.round(result.usaGpa * 100) / 100,
    ukPercentage: Math.round(result.ukPercentage * 100) / 100,
    degreeClassification: getDegreeClassification(systemId, validatedScore)
  }
}

function getDegreeClassification(systemId, score) {
  const classifications = {
    ghana_gpa: [
      { min: 3.60, max: 4.00, class: 'First Class', usaEquiv: 'Summa/Magna Cum Laude', ukEquiv: 'First Class (70%+)' },
      { min: 3.00, max: 3.59, class: 'Second Class Upper', usaEquiv: 'Cum Laude', ukEquiv: 'Upper Second (60-69%)' },
      { min: 2.00, max: 2.99, class: 'Second Class Lower', usaEquiv: 'Good Standing', ukEquiv: 'Lower Second (50-59%)' },
      { min: 1.50, max: 1.99, class: 'Third Class', usaEquiv: 'Pass', ukEquiv: 'Third Class (40-49%)' },
      { min: 0, max: 1.49, class: 'Fail', usaEquiv: 'Fail', ukEquiv: 'Fail' }
    ],
    ghana_cwa: [
      { min: 70, max: 100, class: 'First Class', usaEquiv: 'A (3.5-4.0)', ukEquiv: 'First Class (70%+)' },
      { min: 60, max: 69, class: 'Second Class Upper', usaEquiv: 'B+ (3.0-3.4)', ukEquiv: 'Upper Second (60-69%)' },
      { min: 50, max: 59, class: 'Second Class Lower', usaEquiv: 'B (2.5-2.9)', ukEquiv: 'Lower Second (50-59%)' },
      { min: 40, max: 49, class: 'Third Class', usaEquiv: 'C (2.0-2.4)', ukEquiv: 'Third Class (40-49%)' },
      { min: 0, max: 39, class: 'Fail', usaEquiv: 'F', ukEquiv: 'Fail' }
    ],
    nigeria_cgpa_5: [
      { min: 4.50, max: 5.00, class: 'First Class', usaEquiv: 'A (3.6-4.0)', ukEquiv: 'First Class (70%+)' },
      { min: 3.50, max: 4.49, class: 'Second Class Upper', usaEquiv: 'B+ (2.8-3.5)', ukEquiv: 'Upper Second (60-69%)' },
      { min: 2.40, max: 3.49, class: 'Second Class Lower', usaEquiv: 'B (1.9-2.7)', ukEquiv: 'Lower Second (50-59%)' },
      { min: 1.50, max: 2.39, class: 'Third Class', usaEquiv: 'C (1.2-1.8)', ukEquiv: 'Third Class (40-49%)' },
      { min: 0, max: 1.49, class: 'Fail', usaEquiv: 'F', ukEquiv: 'Fail' }
    ],
    nigeria_cgpa_4: [
      { min: 3.50, max: 4.00, class: 'First Class', usaEquiv: 'A (3.5-4.0)', ukEquiv: 'First Class (70%+)' },
      { min: 2.40, max: 3.49, class: 'Second Class Upper', usaEquiv: 'B+ (2.4-3.4)', ukEquiv: 'Upper Second (60-69%)' },
      { min: 1.50, max: 2.39, class: 'Second Class Lower', usaEquiv: 'B (1.5-2.3)', ukEquiv: 'Lower Second (50-59%)' },
      { min: 1.00, max: 1.49, class: 'Third Class', usaEquiv: 'C (1.0-1.4)', ukEquiv: 'Third Class (40-49%)' },
      { min: 0, max: 0.99, class: 'Fail', usaEquiv: 'F', ukEquiv: 'Fail' }
    ]
  }
  
  const systemClassifications = classifications[systemId]
  if (!systemClassifications) {
    return null
  }
  
  for (const classification of systemClassifications) {
    if (score >= classification.min && score <= classification.max) {
      return {
        sourceClassification: classification.class,
        usaEquivalent: classification.usaEquiv,
        ukEquivalent: classification.ukEquiv
      }
    }
  }
  
  return null
}

async function convertUniversityGrades(data) {
  try {
    const { sourceSystem, courses, targetSystem } = data
    
    if (!sourceSystem) {
      throw new Error('Source grading system is required')
    }
    
    if (!GRADING_SYSTEMS[sourceSystem]) {
      throw new Error(`Invalid source grading system: ${sourceSystem}`)
    }
    
    if (!courses || courses.length === 0) {
      throw new Error('At least one course is required')
    }
    
    if (courses.length > 100) {
      throw new Error('Maximum 100 courses allowed per conversion')
    }
    
    const validTargetSystems = ['usa_gpa', 'uk_percentage']
    const finalTargetSystem = targetSystem || 'usa_gpa'
    
    if (!validTargetSystems.includes(finalTargetSystem)) {
      throw new Error('Target system must be either usa_gpa or uk_percentage')
    }
    
    const weightedAverage = calculateWeightedAverage(courses)
    
    let usaGpa, ukPercentage
    
    if (sourceSystem === 'ghana_cwa') {
      usaGpa = await calculateScholaroGPA(courses, sourceSystem)
      ukPercentage = weightedAverage
    } else {
      const conversion = convertGrade(sourceSystem, weightedAverage)
      usaGpa = conversion.usaGpa
      ukPercentage = conversion.ukPercentage
    }
    
    const degreeClassification = getDegreeClassification(sourceSystem, weightedAverage)
    
    const targetScore = finalTargetSystem === 'usa_gpa' 
      ? usaGpa 
      : ukPercentage
    
    return {
      success: true,
      data: {
        sourceSystem: sourceSystem,
        sourceScore: weightedAverage,
        weightedAverage: weightedAverage,
        usaGpa: usaGpa,
        ukPercentage: ukPercentage,
        targetSystem: finalTargetSystem,
        targetScore: targetScore,
        degreeClassification: degreeClassification,
        totalCourses: courses.length,
        totalCredits: courses.reduce((sum, c) => sum + parseFloat(c.creditHours), 0),
        courses: courses
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function saveConversion(userId, conversionData) {
  try {
    console.log('💾 [SaveConversion] Starting save:', {
      userId,
      sourceSystem: conversionData?.sourceSystem,
      usaGpa: conversionData?.usaGpa,
      targetSystem: conversionData?.targetSystem
    })
    
    if (!userId || isNaN(parseInt(userId))) {
      throw new Error('Valid user ID is required')
    }
    
    if (!conversionData || typeof conversionData !== 'object') {
      throw new Error('Valid conversion data is required')
    }
    
    const requiredFields = ['sourceSystem', 'sourceScore', 'usaGpa', 'ukPercentage', 'targetSystem', 'courses']
    for (const field of requiredFields) {
      if (conversionData[field] === undefined || conversionData[field] === null) {
        throw new Error('All required fields must be provided')
      }
    }
    
    const query = `
      INSERT INTO university_conversions 
      (user_id, source_system, source_score, usa_gpa, uk_percentage, target_system, courses, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `
    
    const coursesJson = typeof conversionData.courses === 'string' 
      ? conversionData.courses 
      : JSON.stringify(conversionData.courses)
    
    const params = [
      parseInt(userId),
      conversionData.sourceSystem,
      parseFloat(conversionData.sourceScore),
      parseFloat(conversionData.usaGpa),
      parseFloat(conversionData.ukPercentage),
      conversionData.targetSystem,
      coursesJson
    ]
    
    console.log('💾 [SaveConversion] Query params:', {
      userId: params[0],
      sourceSystem: params[1],
      sourceScore: params[2],
      usaGpa: params[3],
      ukPercentage: params[4],
      targetSystem: params[5],
      courseCount: conversionData.courses.length,
      coursesJson: coursesJson.substring(0, 100) + '...'
    })
    
    const [result] = await pool.query(query, params)
    
    console.log('✅ [SaveConversion] Successfully saved:', {
      conversionId: result.insertId,
      affectedRows: result.affectedRows
    })
    
    return {
      success: true,
      data: {
        conversionId: result.insertId,
        ...conversionData
      }
    }
  } catch (error) {
    console.error('❌ [SaveConversion] Error:', {
      message: error.message,
      code: error.code,
      userId,
      sourceSystem: conversionData?.sourceSystem
    })
    return {
      success: false,
      error: error.message || 'Failed to save conversion'
    }
  }
}

async function getUserConversions(userId) {
  try {
    if (!userId || isNaN(parseInt(userId))) {
      throw new Error('Valid user ID is required')
    }
    
    console.log('📥 [GetConversions] Fetching conversions for user:', userId)
    
    const query = `
      SELECT * FROM university_conversions 
      WHERE user_id = ? 
      ORDER BY created_at DESC
      LIMIT 100
    `
    
    const [conversions] = await pool.query(query, [parseInt(userId)])
    
    console.log('📥 [GetConversions] Retrieved', conversions.length, 'conversions from database')
    
    const parsedConversions = conversions.map(conv => {
      try {
        let courses = []
        
        if (conv.courses) {
          if (typeof conv.courses === 'string') {
            courses = JSON.parse(conv.courses)
          } else if (Array.isArray(conv.courses)) {
            courses = conv.courses
          } else if (typeof conv.courses === 'object') {
            courses = Array.isArray(conv.courses) ? conv.courses : []
          }
        }
        
        const formattedConv = {
          ...conv,
          courses: courses,
          created_at: conv.created_at ? new Date(conv.created_at).toISOString() : null
        }
        
        console.log('📥 [GetConversions] Parsed conversion', conv.id, ':', {
          sourceSystem: conv.source_system,
          usaGpa: conv.usa_gpa,
          created_at: formattedConv.created_at,
          courseCount: courses.length
        })
        
        return formattedConv
      } catch (parseError) {
        console.error(`❌ [GetConversions] Error parsing courses for conversion ${conv.id}:`, parseError)
        return {
          ...conv,
          courses: [],
          created_at: conv.created_at ? new Date(conv.created_at).toISOString() : null,
          parseError: true
        }
      }
    })
    
    console.log('✅ [GetConversions] Successfully parsed', parsedConversions.length, 'conversions')
    
    return {
      success: true,
      data: parsedConversions
    }
  } catch (error) {
    console.error('❌ [GetConversions] Error fetching conversions:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch conversions'
    }
  }
}

module.exports = {
  convertUniversityGrades,
  saveConversion,
  getUserConversions,
  calculateWeightedAverage,
  calculateScholaroGPA,
  convertGrade,
  getDegreeClassification,
  scoreToLetterGrade,
  getGradingSystems,
  GRADING_SYSTEMS,
  CONVERSION_RULES
}
