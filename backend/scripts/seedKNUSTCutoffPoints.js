const { pool } = require('../config/database')
require('dotenv').config()

const knustPrograms = [
  // College of Agriculture and Natural Resources
  { name: 'BSc. Agriculture', minAggregate: 20 },
  { name: 'BSc. Agricultural Biotechnology', minAggregate: 17 },
  { name: 'BSc. Agribusiness Management', minAggregate: 15 },
  { name: 'BSc. Landscape Design and Management', minAggregate: 17 },
  { name: 'BSc. Natural Resources Management', minAggregate: 18 },
  { name: 'BSc. Forest Resources Technology', minAggregate: 24 },
  { name: 'BSc. Aquaculture and Water Resources Management', minAggregate: 20 },
  { name: 'BSc. Packaging Technology', minAggregate: 15 },

  // College of Art and Built Environment
  { name: 'BSc. Architecture', minAggregate: 7 },
  { name: 'BSc. Construction Technology and Management', minAggregate: 9 },
  { name: 'BSc. Quantity Surveying and Construction Economics', minAggregate: 9 },
  { name: 'BSc. Development Planning', minAggregate: 9 },
  { name: 'BSc. Human Settlement Planning', minAggregate: 10 },
  { name: 'BSc. Land Economy', minAggregate: 8 },
  { name: 'BSc. Real Estate', minAggregate: 9 },
  { name: 'BFA. Fine Art and Curatorial Practice', minAggregate: 16 },
  { name: 'BA. Communication Design (Graphic Design)', minAggregate: 11 },
  { name: 'BA. Integrated Rural Art and Industry', minAggregate: 15 },
  { name: 'BA. Publishing Studies', minAggregate: 12 },
  { name: 'BSc. Metal Product Design Technology', minAggregate: 16 },
  { name: 'BSc. Textile Design and Technology', minAggregate: 13 },
  { name: 'BSc. Fashion Design', minAggregate: 11 },
  { name: 'BSc. Ceramics Technology', minAggregate: 23 },
  { name: 'B.Ed. Junior High School Specialism', minAggregate: 15 },

  // College of Engineering
  { name: 'BSc. Aerospace Engineering', minAggregate: 7 },
  { name: 'BSc. Agricultural Engineering', minAggregate: 13 },
  { name: 'BSc. Automobile Engineering', minAggregate: 10 },
  { name: 'BSc. Biomedical Engineering', minAggregate: 7 },
  { name: 'BSc. Chemical Engineering', minAggregate: 7 },
  { name: 'BSc. Civil Engineering', minAggregate: 7 },
  { name: 'BSc. Computer Engineering', minAggregate: 6 },
  { name: 'BSc. Electrical/Electronic Engineering', minAggregate: 6 },
  { name: 'BSc. Geological Engineering', minAggregate: 8 },
  { name: 'BSc. Geomatic (Geodetic) Engineering', minAggregate: 9 },
  { name: 'BSc. Industrial Engineering', minAggregate: 10 },
  { name: 'BSc. Marine Engineering', minAggregate: 9 },
  { name: 'BSc. Materials Engineering', minAggregate: 10 },
  { name: 'BSc. Mechanical Engineering', minAggregate: 7 },
  { name: 'BSc. Metallurgical Engineering', minAggregate: 11 },
  { name: 'BSc. Petrochemical Engineering', minAggregate: 7 },
  { name: 'BSc. Petroleum Engineering', minAggregate: 6 },
  { name: 'BSc. Telecommunication Engineering', minAggregate: 9 },

  // College of Health Sciences
  { name: 'Bachelor of Dental Surgery (BDS)', minAggregate: 6 },
  { name: 'Doctor of Veterinary Medicine (DVM)', minAggregate: 10 },
  { name: 'BSc. Disability and Rehabilitation Studies', minAggregate: 13 },
  { name: 'Bachelor of Herbal Medicine (BHM)', minAggregate: 14 },
  { name: 'BSc. Human Biology (Medicine)', minAggregate: 6 },
  { name: 'BSc. Medical Laboratory Science', minAggregate: 7 },
  { name: 'BSc. Medical Imaging', minAggregate: 7 },
  { name: 'BSc. Midwifery', minAggregate: 8 },
  { name: 'BSc. Nursing', minAggregate: 7 },
  { name: 'BSc. Physiotherapy and Sports Science', minAggregate: 12 },
  { name: 'Pharm D (Doctor of Pharmacy)', minAggregate: 6 },

  // College of Humanities and Social Sciences
  { name: 'BA. Akan Language and Culture', minAggregate: 15 },
  { name: 'BA. Economics', minAggregate: 10 },
  { name: 'BA. English', minAggregate: 13 },
  { name: 'BA. French and Francophone Studies', minAggregate: 14 },
  { name: 'BA. Geography and Rural Development', minAggregate: 10 },
  { name: 'BA. History', minAggregate: 15 },
  { name: 'BA. Linguistics', minAggregate: 15 },
  { name: 'BA. Media and Communication Studies', minAggregate: 9 },
  { name: 'BA. Political Studies', minAggregate: 9 },
  { name: 'BA. Religious Studies', minAggregate: 20 },
  { name: 'BA. Sociology', minAggregate: 11 },
  { name: 'BA. Social Work', minAggregate: 11 },
  { name: 'BSc. Business Administration (HRM/Management)', minAggregate: 7 },
  { name: 'BSc. Business Administration (Marketing/International Business)', minAggregate: 9 },
  { name: 'BSc. Business Administration (Accounting/Banking and Finance)', minAggregate: 7 },
  { name: 'BSc. Business Administration (Logistics & Supply Chain Mgt)', minAggregate: 8 },
  { name: 'BSc. Hospitality and Tourism Management', minAggregate: 10 },
  { name: 'LLB', minAggregate: 6 },

  // College of Science
  { name: 'BSc. Biochemistry', minAggregate: 9 },
  { name: 'BSc. Food Science and Technology', minAggregate: 11 },
  { name: 'BSc. Biological Science', minAggregate: 9 },
  { name: 'BSc. Environmental Sciences', minAggregate: 12 },
  { name: 'BSc. Chemistry', minAggregate: 15 },
  { name: 'BSc. Computer Science', minAggregate: 7 },
  { name: 'BSc. Mathematics', minAggregate: 15 },
  { name: 'BSc. Actuarial Science', minAggregate: 10 },
  { name: 'BSc. Statistics', minAggregate: 12 },
  { name: 'BSc. Physics', minAggregate: 16 },
  { name: 'BSc. Meteorology and Climate Science', minAggregate: 17 },
  { name: 'Doctor of Optometry', minAggregate: 6 },

  // Obuasi Campus
  { name: 'BSc. Civil Engineering (Obuasi Campus)', minAggregate: 11 },
  { name: 'BSc. Electrical/Electronic Engineering (Obuasi Campus)', minAggregate: 10 },
  { name: 'BSc. Geological Engineering (Obuasi Campus)', minAggregate: 14 },
  { name: 'BSc. Geomatic (Geodetic) Engineering (Obuasi Campus)', minAggregate: 15 },
  { name: 'BSc. Materials Engineering (Obuasi Campus)', minAggregate: 15 },
  { name: 'BSc. Mechanical Engineering (Obuasi Campus)', minAggregate: 12 },
  { name: 'BSc. Metallurgical Engineering (Obuasi Campus)', minAggregate: 16 },
  { name: 'BSc. Medical Laboratory Science (Obuasi Campus)', minAggregate: 9 },
  { name: 'BSc. Midwifery (Obuasi Campus)', minAggregate: 13 },
  { name: 'BSc. Nursing (Obuasi Campus)', minAggregate: 12 },
  { name: 'BBA (HRM/Management) (Obuasi Campus)', minAggregate: 15 },
  { name: 'BBA (Marketing/International Business) (Obuasi Campus)', minAggregate: 16 },
  { name: 'BBA (Accounting/Banking and Finance) (Obuasi Campus)', minAggregate: 12 },
  { name: 'BBA (Logistics & Supply Chain Mgt) (Obuasi Campus)', minAggregate: 15 },
  { name: 'BSc. Environmental Sciences (Obuasi Campus)', minAggregate: 19 }
]

async function seedKNUSTCutoffPoints() {
  try {
    console.log('Seeding KNUST cutoff points for 2025/2026...\n')

    const [university] = await pool.query(
      'SELECT id FROM ghana_universities WHERE abbreviation = ?',
      ['KNUST']
    )

    if (university.length === 0) {
      console.error('KNUST university not found in database')
      process.exit(1)
    }

    const universityId = university[0].id
    let saved = 0
    let updated = 0

    for (const program of knustPrograms) {
      const [existingProgram] = await pool.query(
        'SELECT id FROM programs WHERE university_id = ? AND name = ?',
        [universityId, program.name]
      )

      let programId
      if (existingProgram.length > 0) {
        programId = existingProgram[0].id
      } else {
        const [result] = await pool.query(
          'INSERT INTO programs (university_id, universityId, name, maxCutoff) VALUES (?, ?, ?, ?)',
          [universityId, universityId, program.name, program.minAggregate]
        )
        programId = result.insertId
      }

      const [result] = await pool.query(
        `INSERT INTO shs_cutoff_points 
         (program_id, academic_year, min_aggregate, data_source) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         min_aggregate = VALUES(min_aggregate), 
         data_source = VALUES(data_source)`,
        [programId, '2025/2026', program.minAggregate, 'KNUST Official Website']
      )

      if (result.affectedRows === 1) {
        saved++
      } else {
        updated++
      }
    }

    console.log(`✓ Seeding completed!`)
    console.log(`  - New programs: ${saved}`)
    console.log(`  - Updated programs: ${updated}`)
    console.log(`  - Total: ${knustPrograms.length}`)

    process.exit(0)

  } catch (error) {
    console.error('Error seeding KNUST cutoff points:', error)
    process.exit(1)
  }
}

seedKNUSTCutoffPoints()
