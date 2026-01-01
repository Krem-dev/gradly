export const WASSCE_GRADES = [
  { grade: 'A1', points: 1, label: 'Excellent' },
  { grade: 'B2', points: 2, label: 'Very Good' },
  { grade: 'B3', points: 3, label: 'Good' },
  { grade: 'C4', points: 4, label: 'Credit' },
  { grade: 'C5', points: 5, label: 'Credit' },
  { grade: 'C6', points: 6, label: 'Credit' },
  { grade: 'D7', points: 7, label: 'Pass' },
  { grade: 'E8', points: 8, label: 'Pass' },
  { grade: 'F9', points: 9, label: 'Fail' }
]

export const WASSCE_CORE_SUBJECTS = [
  'English Language',
  'Core Mathematics',
  'Integrated Science',
  'Social Studies'
]

export const WASSCE_ELECTIVE_SUBJECTS = {
  science: [
    'Elective Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Elective ICT'
  ],
  business: [
    'Business Management',
    'Financial Accounting',
    'Economics',
    'Costing',
    'Elective ICT'
  ],
  arts: [
    'Literature in English',
    'History',
    'Government',
    'Economics',
    'French',
    'Akan',
    'Ewe',
    'Ga',
    'Dagbani'
  ],
  general: [
    'Geography',
    'Religious Studies',
    'Graphic Design',
    'Visual Arts',
    'Music'
  ],
  technical: [
    'Technical Drawing',
    'Metalwork',
    'Woodwork',
    'Building Construction',
    'Electronics'
  ],
  vocational: [
    'Catering',
    'Textiles',
    'Basketry',
    'Leatherwork',
    'Clothing & Textiles'
  ],
  agricultural: [
    'General Agriculture',
    'Animal Husbandry',
    'Crop Husbandry'
  ]
}

export interface GhanaUniversity {
  id: string
  name: string
  location: string
  programs: {
    name: string
    category: string
    cutoff: number
    requirements?: string[]
  }[]
}

export const GHANA_UNIVERSITIES: GhanaUniversity[] = [
  {
    id: 'ug',
    name: 'University of Ghana',
    location: 'Legon, Accra',
    programs: [
      { name: 'Medicine and Surgery', category: 'Medical Sciences', cutoff: 6, requirements: ['Biology', 'Chemistry', 'Physics'] },
      { name: 'Pharmacy', category: 'Medical Sciences', cutoff: 8, requirements: ['Chemistry', 'Biology'] },
      { name: 'Nursing', category: 'Medical Sciences', cutoff: 12, requirements: ['Biology', 'Chemistry'] },
      { name: 'Computer Science', category: 'Computing', cutoff: 10, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Information Technology', category: 'Computing', cutoff: 12 },
      { name: 'Business Administration', category: 'Business', cutoff: 15 },
      { name: 'Accounting', category: 'Business', cutoff: 12, requirements: ['Elective Mathematics'] },
      { name: 'Economics', category: 'Social Sciences', cutoff: 14 },
      { name: 'Law', category: 'Law', cutoff: 8 },
      { name: 'Engineering (General)', category: 'Engineering', cutoff: 10, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Civil Engineering', category: 'Engineering', cutoff: 12, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Electrical Engineering', category: 'Engineering', cutoff: 10, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Psychology', category: 'Social Sciences', cutoff: 14 },
      { name: 'Political Science', category: 'Social Sciences', cutoff: 16 }
    ]
  },
  {
    id: 'knust',
    name: 'Kwame Nkrumah University of Science and Technology',
    location: 'Kumasi',
    programs: [
      { name: 'Medicine and Surgery', category: 'Medical Sciences', cutoff: 6, requirements: ['Biology', 'Chemistry', 'Physics'] },
      { name: 'Pharmacy', category: 'Medical Sciences', cutoff: 8, requirements: ['Chemistry', 'Biology'] },
      { name: 'Nursing', category: 'Medical Sciences', cutoff: 12, requirements: ['Biology', 'Chemistry'] },
      { name: 'Computer Science', category: 'Computing', cutoff: 12, requirements: ['Elective Mathematics'] },
      { name: 'Computer Engineering', category: 'Engineering', cutoff: 10, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Civil Engineering', category: 'Engineering', cutoff: 12, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Mechanical Engineering', category: 'Engineering', cutoff: 12, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Electrical Engineering', category: 'Engineering', cutoff: 10, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Architecture', category: 'Engineering', cutoff: 10, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Quantity Surveying', category: 'Engineering', cutoff: 14 },
      { name: 'Business Administration', category: 'Business', cutoff: 15 },
      { name: 'Accounting', category: 'Business', cutoff: 14 },
      { name: 'Agricultural Engineering', category: 'Agriculture', cutoff: 14, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Agribusiness', category: 'Agriculture', cutoff: 16 }
    ]
  },
  {
    id: 'ucc',
    name: 'University of Cape Coast',
    location: 'Cape Coast',
    programs: [
      { name: 'Medicine and Surgery', category: 'Medical Sciences', cutoff: 6, requirements: ['Biology', 'Chemistry', 'Physics'] },
      { name: 'Nursing', category: 'Medical Sciences', cutoff: 12, requirements: ['Biology', 'Chemistry'] },
      { name: 'Computer Science', category: 'Computing', cutoff: 12 },
      { name: 'Information Technology', category: 'Computing', cutoff: 14 },
      { name: 'Business Administration', category: 'Business', cutoff: 15 },
      { name: 'Accounting', category: 'Business', cutoff: 14 },
      { name: 'Education (Science)', category: 'Education', cutoff: 18, requirements: ['Any Science Subject'] },
      { name: 'Education (Arts)', category: 'Education', cutoff: 18 },
      { name: 'Psychology', category: 'Social Sciences', cutoff: 15 },
      { name: 'Hospitality Management', category: 'Hospitality', cutoff: 16 },
      { name: 'Tourism Management', category: 'Hospitality', cutoff: 18 }
    ]
  },
  {
    id: 'uew',
    name: 'University of Education, Winneba',
    location: 'Winneba',
    programs: [
      { name: 'Education (Science)', category: 'Education', cutoff: 18 },
      { name: 'Education (Mathematics)', category: 'Education', cutoff: 18, requirements: ['Elective Mathematics'] },
      { name: 'Education (Arts)', category: 'Education', cutoff: 20 },
      { name: 'Education (Social Studies)', category: 'Education', cutoff: 20 },
      { name: 'Physical Education', category: 'Education', cutoff: 20 },
      { name: 'Music Education', category: 'Education', cutoff: 22 },
      { name: 'Accounting Education', category: 'Business', cutoff: 16 },
      { name: 'Management Education', category: 'Business', cutoff: 18 }
    ]
  },
  {
    id: 'umat',
    name: 'University of Mines and Technology',
    location: 'Tarkwa',
    programs: [
      { name: 'Mining Engineering', category: 'Engineering', cutoff: 12, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Geological Engineering', category: 'Engineering', cutoff: 14, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Geomatic Engineering', category: 'Engineering', cutoff: 14, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Petroleum Engineering', category: 'Engineering', cutoff: 10, requirements: ['Elective Mathematics', 'Physics', 'Chemistry'] },
      { name: 'Environmental Engineering', category: 'Engineering', cutoff: 14, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Computer Science', category: 'Computing', cutoff: 14 }
    ]
  },
  {
    id: 'uds',
    name: 'University for Development Studies',
    location: 'Tamale',
    programs: [
      { name: 'Medicine and Surgery', category: 'Medical Sciences', cutoff: 8, requirements: ['Biology', 'Chemistry', 'Physics'] },
      { name: 'Nursing', category: 'Medical Sciences', cutoff: 14, requirements: ['Biology', 'Chemistry'] },
      { name: 'Agriculture', category: 'Agriculture', cutoff: 18 },
      { name: 'Agribusiness', category: 'Agriculture', cutoff: 18 },
      { name: 'Computer Science', category: 'Computing', cutoff: 14 },
      { name: 'Business Administration', category: 'Business', cutoff: 18 },
      { name: 'Community Development', category: 'Social Sciences', cutoff: 20 }
    ]
  },
  {
    id: 'gimpa',
    name: 'Ghana Institute of Management and Public Administration',
    location: 'Accra',
    programs: [
      { name: 'Business Administration', category: 'Business', cutoff: 14 },
      { name: 'Accounting', category: 'Business', cutoff: 12 },
      { name: 'Public Administration', category: 'Public Administration', cutoff: 16 },
      { name: 'Law', category: 'Law', cutoff: 10 },
      { name: 'Information Technology', category: 'Computing', cutoff: 14 },
      { name: 'Marketing', category: 'Business', cutoff: 16 }
    ]
  },
  {
    id: 'atu',
    name: 'Accra Technical University',
    location: 'Accra',
    programs: [
      { name: 'Computer Science', category: 'Computing', cutoff: 16 },
      { name: 'Information Technology', category: 'Computing', cutoff: 18 },
      { name: 'Electrical Engineering', category: 'Engineering', cutoff: 16, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Mechanical Engineering', category: 'Engineering', cutoff: 16, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Hospitality Management', category: 'Hospitality', cutoff: 18 },
      { name: 'Fashion Design', category: 'Arts', cutoff: 20 }
    ]
  },
  {
    id: 'ashesi',
    name: 'Ashesi University',
    location: 'Berekuso',
    programs: [
      { name: 'Computer Science', category: 'Computing', cutoff: 8 },
      { name: 'Computer Engineering', category: 'Engineering', cutoff: 8, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Electrical Engineering', category: 'Engineering', cutoff: 8, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Mechanical Engineering', category: 'Engineering', cutoff: 8, requirements: ['Elective Mathematics', 'Physics'] },
      { name: 'Business Administration', category: 'Business', cutoff: 10 },
      { name: 'Management Information Systems', category: 'Computing', cutoff: 10 }
    ]
  }
]

export interface GlobalUniversity {
  id: string
  name: string
  country: string
  region: string
  minCGPA: number
  maxCGPA: number
  programs: string[]
  tuitionRange: string
  scholarships: boolean
}

export const GLOBAL_UNIVERSITIES: GlobalUniversity[] = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    country: 'USA',
    region: 'North America',
    minCGPA: 3.7,
    maxCGPA: 4.0,
    programs: ['Computer Science', 'Engineering', 'Business', 'Sciences'],
    tuitionRange: '$50,000 - $60,000/year',
    scholarships: true
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    country: 'USA',
    region: 'North America',
    minCGPA: 3.7,
    maxCGPA: 4.0,
    programs: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
    tuitionRange: '$55,000 - $65,000/year',
    scholarships: true
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    country: 'USA',
    region: 'North America',
    minCGPA: 3.8,
    maxCGPA: 4.0,
    programs: ['Law', 'Business', 'Medicine', 'Arts & Sciences'],
    tuitionRange: '$50,000 - $60,000/year',
    scholarships: true
  },
  {
    id: 'oxford',
    name: 'University of Oxford',
    country: 'UK',
    region: 'Europe',
    minCGPA: 3.7,
    maxCGPA: 4.0,
    programs: ['Law', 'Medicine', 'Engineering', 'Arts & Humanities'],
    tuitionRange: '£25,000 - £35,000/year',
    scholarships: true
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    country: 'UK',
    region: 'Europe',
    minCGPA: 3.7,
    maxCGPA: 4.0,
    programs: ['Engineering', 'Sciences', 'Medicine', 'Arts'],
    tuitionRange: '£25,000 - £35,000/year',
    scholarships: true
  },
  {
    id: 'imperial',
    name: 'Imperial College London',
    country: 'UK',
    region: 'Europe',
    minCGPA: 3.5,
    maxCGPA: 4.0,
    programs: ['Engineering', 'Medicine', 'Business', 'Sciences'],
    tuitionRange: '£30,000 - £40,000/year',
    scholarships: true
  },
  {
    id: 'toronto',
    name: 'University of Toronto',
    country: 'Canada',
    region: 'North America',
    minCGPA: 3.3,
    maxCGPA: 4.0,
    programs: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
    tuitionRange: 'CAD 45,000 - 55,000/year',
    scholarships: true
  },
  {
    id: 'ubc',
    name: 'University of British Columbia',
    country: 'Canada',
    region: 'North America',
    minCGPA: 3.2,
    maxCGPA: 4.0,
    programs: ['Engineering', 'Business', 'Sciences', 'Arts'],
    tuitionRange: 'CAD 40,000 - 50,000/year',
    scholarships: true
  },
  {
    id: 'melbourne',
    name: 'University of Melbourne',
    country: 'Australia',
    region: 'Oceania',
    minCGPA: 3.0,
    maxCGPA: 4.0,
    programs: ['Engineering', 'Business', 'Medicine', 'Law'],
    tuitionRange: 'AUD 35,000 - 45,000/year',
    scholarships: true
  },
  {
    id: 'anu',
    name: 'Australian National University',
    country: 'Australia',
    region: 'Oceania',
    minCGPA: 3.0,
    maxCGPA: 4.0,
    programs: ['Sciences', 'Engineering', 'Arts', 'Business'],
    tuitionRange: 'AUD 35,000 - 45,000/year',
    scholarships: true
  },
  {
    id: 'nus',
    name: 'National University of Singapore',
    country: 'Singapore',
    region: 'Asia',
    minCGPA: 3.5,
    maxCGPA: 4.0,
    programs: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
    tuitionRange: 'SGD 30,000 - 40,000/year',
    scholarships: true
  },
  {
    id: 'ntu',
    name: 'Nanyang Technological University',
    country: 'Singapore',
    region: 'Asia',
    minCGPA: 3.4,
    maxCGPA: 4.0,
    programs: ['Engineering', 'Business', 'Computer Science', 'Sciences'],
    tuitionRange: 'SGD 30,000 - 40,000/year',
    scholarships: true
  },
  {
    id: 'tum',
    name: 'Technical University of Munich',
    country: 'Germany',
    region: 'Europe',
    minCGPA: 3.0,
    maxCGPA: 4.0,
    programs: ['Engineering', 'Computer Science', 'Sciences', 'Business'],
    tuitionRange: '€0 - €3,000/year',
    scholarships: true
  },
  {
    id: 'eth',
    name: 'ETH Zurich',
    country: 'Switzerland',
    region: 'Europe',
    minCGPA: 3.5,
    maxCGPA: 4.0,
    programs: ['Engineering', 'Computer Science', 'Sciences', 'Architecture'],
    tuitionRange: 'CHF 1,500 - 2,000/year',
    scholarships: false
  },
  {
    id: 'mcgill',
    name: 'McGill University',
    country: 'Canada',
    region: 'North America',
    minCGPA: 3.0,
    maxCGPA: 4.0,
    programs: ['Medicine', 'Engineering', 'Business', 'Arts'],
    tuitionRange: 'CAD 40,000 - 50,000/year',
    scholarships: true
  }
]

export const GRADING_SYSTEMS = [
  { id: 'usa', label: 'USA (4.0 Scale)', scoreMax: 4.0 },
  { id: 'uk', label: 'UK (1-7 Scale)', scoreMax: 7 },
  { id: 'india', label: 'India (10 Scale)', scoreMax: 10 },
  { id: 'australia', label: 'Australia (7 Scale)', scoreMax: 7 },
  { id: 'canada', label: 'Canada (4.0 Scale)', scoreMax: 4.0 },
  { id: 'europe', label: 'Europe (ECTS)', scoreMax: 100 }
]
