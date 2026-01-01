export interface Subject {
  id: string
  name: string
  streams: string[]
  category: 'core' | 'elective'
}

export const SHS_SUBJECTS: Subject[] = [
  // Core Subjects (All streams)
  { id: 'english', name: 'English Language', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'core' },
  { id: 'math', name: 'Core Mathematics', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'core' },
  { id: 'integrated-science', name: 'Integrated Science', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'core' },
  { id: 'social-studies', name: 'Social Studies', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'core' },

  // Science Stream
  { id: 'physics', name: 'Physics', streams: ['science', 'agricultural-science'], category: 'elective' },
  { id: 'chemistry', name: 'Chemistry', streams: ['science', 'agricultural-science'], category: 'elective' },
  { id: 'biology', name: 'Biology', streams: ['science', 'agricultural-science'], category: 'elective' },
  { id: 'additional-math', name: 'Additional Mathematics', streams: ['science', 'business', 'agricultural-science'], category: 'elective' },
  { id: 'computing', name: 'Computing', streams: ['science'], category: 'elective' },
  { id: 'engineering', name: 'Engineering', streams: ['science'], category: 'elective' },
  { id: 'aviation', name: 'Aviation and Aerospace Engineering', streams: ['science'], category: 'elective' },
  { id: 'manufacturing', name: 'Manufacturing Engineering', streams: ['science'], category: 'elective' },
  { id: 'robotics', name: 'Robotics', streams: ['science'], category: 'elective' },
  { id: 'biomedical', name: 'Biomedical Science', streams: ['science'], category: 'elective' },

  // Business Stream
  { id: 'accounting', name: 'Accounting', streams: ['business'], category: 'elective' },
  { id: 'business-management', name: 'Business Management', streams: ['business'], category: 'elective' },
  { id: 'economics', name: 'Economics', streams: ['business', 'arts'], category: 'elective' },
  { id: 'ict', name: 'Information Communication Technology (ICT)', streams: ['business', 'science'], category: 'elective' },

  // Agricultural Science Stream
  { id: 'agriculture', name: 'Agriculture', streams: ['agricultural-science'], category: 'elective' },
  { id: 'agricultural-science-subject', name: 'Agricultural Science', streams: ['agricultural-science'], category: 'elective' },

  // Arts Stream
  { id: 'history', name: 'History', streams: ['arts'], category: 'elective' },
  { id: 'government', name: 'Government', streams: ['arts'], category: 'elective' },
  { id: 'literature', name: 'Literature-in-English', streams: ['arts'], category: 'elective' },
  { id: 'ghanaian-lang', name: 'Ghanaian Language', streams: ['arts'], category: 'elective' },
  { id: 'french', name: 'French', streams: ['arts'], category: 'elective' },
  { id: 'spanish', name: 'Spanish', streams: ['arts'], category: 'elective' },
  { id: 'arabic', name: 'Arabic', streams: ['arts'], category: 'elective' },
  { id: 'geography', name: 'Geography', streams: ['arts', 'agricultural-science'], category: 'elective' },
  { id: 'religious-studies', name: 'Religious Studies', streams: ['arts'], category: 'elective' },

  // Home Economics Stream
  { id: 'home-economics', name: 'Home Economics', streams: ['home-economics'], category: 'elective' },
  { id: 'food-nutrition', name: 'Food and Nutrition', streams: ['home-economics'], category: 'elective' },
  { id: 'clothing-textiles', name: 'Clothing and Textiles', streams: ['home-economics'], category: 'elective' },
  { id: 'management-living', name: 'Management in Living', streams: ['home-economics'], category: 'elective' },

  // Visual Arts Stream
  { id: 'art-design', name: 'Art and Design Foundation', streams: ['visual-arts'], category: 'elective' },
  { id: 'arts-design-studio', name: 'Arts and Design Studio', streams: ['visual-arts'], category: 'elective' },
  { id: 'design-comm-tech', name: 'Design and Communication Technology', streams: ['visual-arts'], category: 'elective' },
  { id: 'music', name: 'Music', streams: ['visual-arts'], category: 'elective' },
  { id: 'performing-arts', name: 'Performing Arts', streams: ['visual-arts'], category: 'elective' },

  // Physical Education & Health
  { id: 'core-peh', name: 'Core Physical Education and Health (PEH)', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'core' },
  { id: 'elective-peh', name: 'Elective Physical Education and Health (PEH)', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'elective' },

  // Religious Studies
  { id: 'christian-religious', name: 'Christian Religious Studies', streams: ['arts'], category: 'elective' },
  { id: 'islamic-religious', name: 'Islamic Religious Studies', streams: ['arts'], category: 'elective' },
  { id: 'religious-moral', name: 'Religious and Moral Education', streams: ['arts'], category: 'elective' },

  // Technology Subjects
  { id: 'automotive-metal', name: 'Automotive and Metal Technology', streams: ['science'], category: 'elective' },
  { id: 'building-construction', name: 'Building Construction and Wood Technology', streams: ['science'], category: 'elective' },
  { id: 'electrical-electronic', name: 'Electrical and Electronic Technology', streams: ['science'], category: 'elective' },
  { id: 'applied-tech', name: 'Applied Technology', streams: ['science'], category: 'elective' },

  // Intervention Subjects
  { id: 'intervention-english', name: 'Intervention English', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'elective' },
  { id: 'intervention-math', name: 'Intervention Mathematics', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'elective' },

  // General Science
  { id: 'general-science', name: 'General Science', streams: ['science', 'business', 'agricultural-science', 'arts', 'home-economics', 'visual-arts'], category: 'core' },

  // Business Studies
  { id: 'business-studies', name: 'Business Studies', streams: ['business'], category: 'elective' },
]

export function getSubjectsByStream(stream: string): Subject[] {
  return SHS_SUBJECTS.filter(subject => subject.streams.includes(stream))
}

export function getSubjectName(subjectId: string): string | undefined {
  return SHS_SUBJECTS.find(s => s.id === subjectId)?.name
}

export function getStreamsForSubject(subjectId: string): string[] {
  const subject = SHS_SUBJECTS.find(s => s.id === subjectId)
  return subject?.streams || []
}
