export interface GradingSystem {
  id: string
  name: string
  country: string
  scale: {
    min: number
    max: number
  }
  type: 'percentage' | 'gpa' | 'cgpa' | 'wam'
  description: string
  conversionFormula?: string
  isPremium: boolean
}

export interface Institution {
  id: string
  name: string
  country: string
  gradingSystemId: string
}

export const GRADING_SYSTEMS: Record<string, GradingSystem> = {
  ghana_gpa: {
    id: 'ghana_gpa',
    name: 'GPA (4.0 Scale)',
    country: 'Ghana',
    scale: { min: 0, max: 4.0 },
    type: 'gpa',
    description: 'Ghana university system (UG, Legon) using 4.0 scale. A=4.0 (80-100), B+=3.5 (75-79), B=3.0 (70-74). First Class: 3.6-4.0',
    conversionFormula: 'GPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours)',
    isPremium: false
  },
  ghana_cwa: {
    id: 'ghana_cwa',
    name: 'CWA (Percentage)',
    country: 'Ghana',
    scale: { min: 0, max: 100 },
    type: 'percentage',
    description: 'Ghana university system (KNUST) using weighted average marks (0-100). First Class: 70+, Second Upper: 60-69',
    conversionFormula: 'CWA = Σ(Mark × Credit Hours) / Σ(Credit Hours)',
    isPremium: false
  },
  nigeria_cgpa_5: {
    id: 'nigeria_cgpa_5',
    name: 'CGPA (5.0 Scale)',
    country: 'Nigeria',
    scale: { min: 0, max: 5.0 },
    type: 'cgpa',
    description: 'Nigerian university system using 5.0 scale. A=4.5-5.0 (First Class), B=3.5-4.49 (Second Upper), C=2.4-3.49 (Second Lower)',
    conversionFormula: 'CGPA = Σ(Grade Points × Credit Units) / Σ(Credit Units)',
    isPremium: false
  },
  nigeria_cgpa_4: {
    id: 'nigeria_cgpa_4',
    name: 'CGPA (4.0 Scale)',
    country: 'Nigeria',
    scale: { min: 0, max: 4.0 },
    type: 'cgpa',
    description: 'Nigerian university system using 4.0 scale. A=3.5-4.0 (First Class), B=2.4-3.49 (Second Upper), C=1.5-2.39 (Second Lower)',
    conversionFormula: 'CGPA = Σ(Grade Points × Credit Units) / Σ(Credit Units)',
    isPremium: false
  },
  usa_gpa: {
    id: 'usa_gpa',
    name: 'GPA (4.0 Scale)',
    country: 'USA',
    scale: { min: 0, max: 4.0 },
    type: 'gpa',
    description: 'US university system using 4.0 scale. A=4.0, B=3.0, C=2.0, D=1.0, F=0.0',
    conversionFormula: 'GPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours)',
    isPremium: true
  },
  uk_percentage: {
    id: 'uk_percentage',
    name: 'Percentage (0-100)',
    country: 'UK',
    scale: { min: 0, max: 100 },
    type: 'percentage',
    description: 'UK university system using percentage marks. First Class: 70%+, Upper Second: 60-69%, Lower Second: 50-59%',
    conversionFormula: 'Mark = Course Score',
    isPremium: true
  },
  india_cgpa: {
    id: 'india_cgpa',
    name: 'CGPA (10-point scale)',
    country: 'India',
    scale: { min: 0, max: 10 },
    type: 'cgpa',
    description: 'Indian university system using 10-point scale. O=10, A+=9, A=8, B+=7, B=6',
    conversionFormula: 'CGPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours)',
    isPremium: true
  },
  canada_gpa: {
    id: 'canada_gpa',
    name: 'GPA (4.0 Scale)',
    country: 'Canada',
    scale: { min: 0, max: 4.0 },
    type: 'gpa',
    description: 'Canadian university system using 4.0 scale. A+=4.0, A=4.0, B+=3.3, B=3.0',
    conversionFormula: 'GPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours)',
    isPremium: true
  },
  australia_wam: {
    id: 'australia_wam',
    name: 'WAM (Weighted Average Mark)',
    country: 'Australia',
    scale: { min: 0, max: 100 },
    type: 'wam',
    description: 'Australian university system using weighted average marks (0-100)',
    conversionFormula: 'WAM = Σ(Mark × Credit Points) / Σ(Credit Points)',
    isPremium: true
  }
}

export const INSTITUTIONS: Institution[] = [
  { id: 'ug', name: 'University of Ghana (Legon)', country: 'Ghana', gradingSystemId: 'ghana_gpa' },
  { id: 'knust', name: 'Kwame Nkrumah University of Science and Technology (KNUST)', country: 'Ghana', gradingSystemId: 'ghana_cwa' },
  { id: 'ucc', name: 'University of Cape Coast (UCC)', country: 'Ghana', gradingSystemId: 'ghana_gpa' },
  { id: 'uew', name: 'University of Education, Winneba (UEW)', country: 'Ghana', gradingSystemId: 'ghana_gpa' },
  { id: 'uds', name: 'University for Development Studies (UDS)', country: 'Ghana', gradingSystemId: 'ghana_gpa' },
  { id: 'atu', name: 'Accra Technical University (ATU)', country: 'Ghana', gradingSystemId: 'ghana_cwa' },
  { id: 'gtuc', name: 'Ghana Technology University College (GTUC)', country: 'Ghana', gradingSystemId: 'ghana_gpa' },
  { id: 'ashesi', name: 'Ashesi University', country: 'Ghana', gradingSystemId: 'ghana_gpa' },
  
  { id: 'unilag', name: 'University of Lagos (UNILAG)', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_5' },
  { id: 'unn', name: 'University of Nigeria, Nsukka (UNN)', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_5' },
  { id: 'ui', name: 'University of Ibadan (UI)', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_5' },
  { id: 'abu', name: 'Ahmadu Bello University (ABU)', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_5' },
  { id: 'unical', name: 'University of Calabar (UNICAL)', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_5' },
  { id: 'uniport', name: 'University of Port Harcourt (UNIPORT)', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_5' },
  { id: 'oau', name: 'Obafemi Awolowo University (OAU)', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_4' },
  { id: 'covenant', name: 'Covenant University', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_5' },
  { id: 'babcock', name: 'Babcock University', country: 'Nigeria', gradingSystemId: 'nigeria_cgpa_5' },
  
  { id: 'oxford', name: 'University of Oxford', country: 'UK', gradingSystemId: 'uk_percentage' },
  { id: 'cambridge', name: 'University of Cambridge', country: 'UK', gradingSystemId: 'uk_percentage' },
  { id: 'harvard', name: 'Harvard University', country: 'USA', gradingSystemId: 'usa_gpa' },
  { id: 'mit', name: 'Massachusetts Institute of Technology (MIT)', country: 'USA', gradingSystemId: 'usa_gpa' },
  { id: 'iit', name: 'Indian Institute of Technology (IIT)', country: 'India', gradingSystemId: 'india_cgpa' },
  { id: 'unimelb', name: 'University of Melbourne', country: 'Australia', gradingSystemId: 'australia_wam' },
  { id: 'ubc', name: 'University of British Columbia', country: 'Canada', gradingSystemId: 'canada_gpa' }
]

export const GRADE_POINT_SCALES: Record<string, Record<string, number>> = {
  ghana_gpa: {
    'A': 4.0,
    'B+': 3.5,
    'B': 3.0,
    'C+': 2.5,
    'C': 2.0,
    'D+': 1.5,
    'D': 1.0,
    'F': 0.0
  },
  nigeria_cgpa_5: {
    'A': 5.0,
    'AB': 4.5,
    'B': 4.0,
    'BC': 3.5,
    'C': 3.0,
    'CD': 2.5,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0
  },
  nigeria_cgpa_4: {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
  },
  usa_gpa: {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0
  },
  india_cgpa: {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'P': 4,
    'F': 0
  },
  canada_gpa: {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
  }
}

export const CONVERSION_RULES: Record<string, (value: number) => { usaGpa: number; ukPercentage: number }> = {
  'ghana_cwa': (cwa: number) => ({
    usaGpa: (cwa / 100) * 4.0,
    ukPercentage: cwa
  }),
  'ghana_gpa': (gpa: number) => ({
    usaGpa: gpa,
    ukPercentage: (gpa / 4.0) * 100
  }),
  'nigeria_cgpa_5': (cgpa: number) => ({
    usaGpa: (cgpa / 5.0) * 4.0,
    ukPercentage: (cgpa / 5.0) * 100
  }),
  'nigeria_cgpa_4': (cgpa: number) => ({
    usaGpa: cgpa,
    ukPercentage: (cgpa / 4.0) * 100
  })
}
