/**
 * Ghana SHS (Senior High School) subjects per WAEC / WASSCE — old curriculum.
 *
 * This is what 2026 WASSCE candidates sit (the ~99% of schools outside the 33-school
 * Common Core pilot). When the new NaCCA curriculum rolls out nationwide (~2027+),
 * we'll add an additional set of new-curriculum subjects behind a feature flag.
 *
 * Sources cross-checked May 2026:
 *  - examcenter.com.gh / ghanahighschools.com (per-stream elective lists)
 *  - asetenapa.com / wassceexams.com (aggregate calculation rules)
 *  - knust.edu.gh admissions (cutoff structure, 2025/26)
 */

export interface Subject {
  id: string
  name: string
  streams: string[]      // which streams a student in this stream typically takes this
  category: 'core' | 'elective'
}

export type StreamId =
  | 'science'
  | 'business'
  | 'agricultural-science'
  | 'arts'
  | 'home-economics'
  | 'visual-arts'
  | 'technical'

export const STREAM_NAMES: Record<StreamId, string> = {
  science: 'General Science',
  business: 'Business',
  'agricultural-science': 'Agricultural Science',
  arts: 'General Arts',
  'home-economics': 'Home Economics',
  'visual-arts': 'Visual Arts',
  technical: 'Technical',
}

const ALL_STREAMS = Object.keys(STREAM_NAMES) as StreamId[]

/**
 * The 4 mandatory cores. Every Ghanaian SHS student SITS all four (English Language,
 * Core Mathematics, Integrated Science, Social Studies) — this is a WAEC sitting rule.
 *
 * For ADMISSIONS aggregate purposes, universities count only 3 of the 4: English +
 * Core Mathematics + (Integrated Science OR Social Studies). The third-core choice
 * depends on the programme:
 *   - Science / engineering / nursing / agriculture / technical programmes → Integrated Science
 *   - Arts / humanities / business / visual arts programmes → Social Studies
 *
 * This is an admissions counting convention used by the universities (UG, KNUST, UCC,
 * UEW), NOT a WAEC sitting rule. Source: WAEC + UG/KNUST admissions handbooks.
 */
export const SHS_SUBJECTS: Subject[] = [
  // ─── Cores (all streams) ─────────────────────────────────────────────
  { id: 'english',            name: 'English Language',   streams: ALL_STREAMS, category: 'core' },
  { id: 'core-mathematics',   name: 'Core Mathematics',   streams: ALL_STREAMS, category: 'core' },
  { id: 'integrated-science', name: 'Integrated Science', streams: ALL_STREAMS, category: 'core' },
  { id: 'social-studies',     name: 'Social Studies',     streams: ALL_STREAMS, category: 'core' },

  // ─── General Science ────────────────────────────────────────────────
  { id: 'physics',                name: 'Physics',                streams: ['science', 'agricultural-science', 'home-economics', 'technical'], category: 'elective' },
  { id: 'chemistry',              name: 'Chemistry',              streams: ['science', 'agricultural-science', 'home-economics', 'technical'], category: 'elective' },
  { id: 'biology',                name: 'Biology',                streams: ['science', 'agricultural-science', 'home-economics'],               category: 'elective' },
  { id: 'elective-mathematics',   name: 'Elective Mathematics',   streams: ['science', 'business', 'agricultural-science', 'arts', 'technical'], category: 'elective' },
  { id: 'elective-ict',           name: 'Elective ICT',           streams: ['science', 'business', 'arts', 'technical'],                         category: 'elective' },

  // ─── General Arts ───────────────────────────────────────────────────
  { id: 'literature',                 name: 'Literature-in-English',          streams: ['arts', 'visual-arts'],   category: 'elective' },
  { id: 'geography',                  name: 'Geography',                      streams: ['arts', 'science'],       category: 'elective' },
  { id: 'history',                    name: 'History',                        streams: ['arts'],                  category: 'elective' },
  { id: 'government',                 name: 'Government',                     streams: ['arts'],                  category: 'elective' },
  { id: 'christian-religious-studies',name: 'Christian Religious Studies',    streams: ['arts'],                  category: 'elective' },
  { id: 'islamic-religious-studies',  name: 'Islamic Religious Studies',      streams: ['arts'],                  category: 'elective' },
  { id: 'french',                     name: 'French',                         streams: ['arts', 'business', 'home-economics', 'visual-arts'], category: 'elective' },
  { id: 'ghanaian-language',          name: 'Ghanaian Language',              streams: ['arts'],                  category: 'elective' },
  { id: 'music',                      name: 'Music',                          streams: ['arts'],                  category: 'elective' },

  // ─── Business ───────────────────────────────────────────────────────
  // Note: students typically choose EITHER Cost Accounting OR Elective Maths, not both.
  { id: 'financial-accounting', name: 'Financial Accounting', streams: ['business'],                          category: 'elective' },
  { id: 'cost-accounting',      name: 'Cost Accounting',      streams: ['business'],                          category: 'elective' },
  { id: 'business-management',  name: 'Business Management',  streams: ['business'],                          category: 'elective' },
  { id: 'economics',            name: 'Economics',            streams: ['business', 'arts', 'home-economics', 'visual-arts'], category: 'elective' },

  // ─── Agricultural Science ───────────────────────────────────────────
  { id: 'general-agriculture',           name: 'General Agriculture',            streams: ['agricultural-science'], category: 'elective' },
  { id: 'crop-husbandry-horticulture',   name: 'Crop Husbandry and Horticulture',streams: ['agricultural-science'], category: 'elective' },
  { id: 'animal-husbandry',              name: 'Animal Husbandry',               streams: ['agricultural-science'], category: 'elective' },
  { id: 'fisheries',                     name: 'Fisheries',                      streams: ['agricultural-science'], category: 'elective' },
  { id: 'forestry',                      name: 'Forestry',                       streams: ['agricultural-science'], category: 'elective' },

  // ─── Home Economics ─────────────────────────────────────────────────
  // Biology + Chemistry ARE valid Home Economics electives — required for Nursing,
  // Nutrition & Dietetics, Food Science applications. (Source: examcenter.com.gh)
  { id: 'food-and-nutrition',     name: 'Food and Nutrition',     streams: ['home-economics'], category: 'elective' },
  { id: 'management-in-living',   name: 'Management in Living',   streams: ['home-economics'], category: 'elective' },
  { id: 'clothing-and-textiles',  name: 'Clothing and Textiles',  streams: ['home-economics'], category: 'elective' },
  { id: 'general-knowledge-art',  name: 'General Knowledge in Art', streams: ['home-economics', 'visual-arts'], category: 'elective' },

  // ─── Visual Arts ────────────────────────────────────────────────────
  { id: 'graphic-design',    name: 'Graphic Design',    streams: ['visual-arts'], category: 'elective' },
  { id: 'picture-making',    name: 'Picture Making',    streams: ['visual-arts'], category: 'elective' },
  { id: 'ceramics',          name: 'Ceramics',          streams: ['visual-arts'], category: 'elective' },
  { id: 'sculpture',         name: 'Sculpture',         streams: ['visual-arts'], category: 'elective' },
  { id: 'textiles',          name: 'Textiles',          streams: ['visual-arts'], category: 'elective' },
  { id: 'leatherwork',       name: 'Leatherwork',       streams: ['visual-arts'], category: 'elective' },
  { id: 'basketry',          name: 'Basketry',          streams: ['visual-arts'], category: 'elective' },
  { id: 'jewellery',         name: 'Jewellery',         streams: ['visual-arts'], category: 'elective' },

  // ─── Technical ──────────────────────────────────────────────────────
  // Note: WAEC's Technical basket is broad — most Technical SHSs offer a SUBSET
  // (typically 4–5) of these per cohort, not all of them. We list every officially
  // recognised Technical elective so the calculator can match any school's actual
  // offering. Source: GhanaHighSchools.com SHS courses; WAEC syllabus.
  { id: 'technical-drawing',     name: 'Technical Drawing',     streams: ['technical'], category: 'elective' },
  { id: 'building-construction', name: 'Building Construction', streams: ['technical'], category: 'elective' },
  { id: 'woodwork',              name: 'Woodwork',              streams: ['technical'], category: 'elective' },
  { id: 'metalwork',             name: 'Metalwork',             streams: ['technical'], category: 'elective' },
  { id: 'auto-mechanics',        name: 'Auto Mechanics',        streams: ['technical'], category: 'elective' },
  { id: 'applied-electricity',   name: 'Applied Electricity',   streams: ['technical'], category: 'elective' },
  { id: 'electronics',           name: 'Electronics',           streams: ['technical'], category: 'elective' },
]

/**
 * Returns every subject (core + relevant electives) available to a student in `stream`.
 * Cores are always included — they're mandatory for every stream.
 */
export function getSubjectsByStream(stream: string): Subject[] {
  return SHS_SUBJECTS.filter(
    (s) => s.category === 'core' || s.streams.includes(stream)
  )
}

export function getElectivesByStream(stream: string): Subject[] {
  return SHS_SUBJECTS.filter(
    (s) => s.category === 'elective' && s.streams.includes(stream)
  )
}

export function getCoreSubjects(): Subject[] {
  return SHS_SUBJECTS.filter((s) => s.category === 'core')
}

export function getSubjectName(subjectId: string): string | undefined {
  return SHS_SUBJECTS.find((s) => s.id === subjectId)?.name
}

export function getStreamsForSubject(subjectId: string): string[] {
  return SHS_SUBJECTS.find((s) => s.id === subjectId)?.streams || []
}
