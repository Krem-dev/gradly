const { pool } = require('../config/database')
require('dotenv').config()

const uewPrograms = [
  { name: 'Business Administration In Accounting Studies', minAggregate: 36 },
  { name: 'Business Administration In Human Resource Management', minAggregate: 36 },
  { name: 'BA Early Childhood Education', minAggregate: 36 },
  { name: 'BBA. Accounting', minAggregate: 15 },
  { name: 'BSc. Integrated Home Economics Education', minAggregate: 36 },
  { name: 'BBA. Banking and Finance', minAggregate: 36 },
  { name: 'BBA. Human Resources', minAggregate: 36 },
  { name: 'BA Political Science Education', minAggregate: 36 },
  { name: 'BA Applied Linguistics', minAggregate: 36 },
  { name: 'BA Economics Education', minAggregate: 36 },
  { name: 'BA Ewe Education', minAggregate: 36 },
  { name: 'BA Geography Education', minAggregate: 36 },
  { name: 'BA Graphic Design', minAggregate: 36 },
  { name: 'BA History Education', minAggregate: 36 },
  { name: 'BA Media and Communication', minAggregate: 36 },
  { name: 'BA Music Education', minAggregate: 36 },
  { name: 'BA Political Science Education (Alt)', minAggregate: 18 },
  { name: 'BSc. Sports Coaching', minAggregate: 36 },
  { name: 'BSc Environmental Health and Sanitation Education', minAggregate: 36 },
  { name: 'BBA. Marketing', minAggregate: 36 },
  { name: 'BBA. Procurement and Supply Chain Management', minAggregate: 36 },
  { name: 'B. Ed. Early Childhood Education', minAggregate: 36 },
  { name: 'B.Ed. Special English Education', minAggregate: 36 },
  { name: 'Bachelor of Music', minAggregate: 36 },
  { name: 'BSc. Family Life Management Education', minAggregate: 36 },
  { name: 'Bachelor of Fine Art in Animation', minAggregate: 36 },
  { name: 'B.Sc. Biology Education', minAggregate: 36 },
  { name: 'Bachelor of Counselling Psychology', minAggregate: 36 },
  { name: 'Bachelor of Business Administration in Business Information System', minAggregate: 36 },
  { name: 'BA. English Language Education', minAggregate: 36 },
  { name: 'B.A IN COMMUNICATION STUDIES', minAggregate: 36 },
  { name: 'B.A Strategic Communication (Public Relations and Advertising)', minAggregate: 36 },
  { name: 'BA Art Education', minAggregate: 36 },
  { name: 'BSc. Health Administration and Education', minAggregate: 36 },
  { name: 'B.A. Linguistics Education', minAggregate: 36 },
  { name: 'B.Ed Community-Based Rehabilitation and Disability Studies', minAggregate: 36 },
  { name: 'BSc. Mathematics Education', minAggregate: 36 },
  { name: 'Bachelor of Art in Religious and Moral Studies Education', minAggregate: 36 },
  { name: 'BSc. Chemistry Education', minAggregate: 36 },
  { name: 'BSc. Information and Communication Technology Education', minAggregate: 36 },
  { name: 'BSc. Integrated Science Education', minAggregate: 36 },
  { name: 'B.Ed Basic Education (Upper Primary P4 - P6)', minAggregate: 36 },
  { name: 'BSc. Home Economics Education', minAggregate: 18 },
  { name: 'B.Sc. Physics Education', minAggregate: 36 },
  { name: 'B. Ed. Early Childhood Education KG-P3', minAggregate: 36 },
  { name: 'Theatre Arts', minAggregate: 36 }
]

async function seedUEWCutoffPoints() {
  try {
    console.log('Seeding UEW cutoff points for 2025/2026...\n')

    const [university] = await pool.query(
      'SELECT id FROM ghana_universities WHERE abbreviation = ?',
      ['UEW']
    )

    if (university.length === 0) {
      console.error('UEW university not found in database')
      process.exit(1)
    }

    const universityId = university[0].id
    let saved = 0
    let updated = 0

    for (const program of uewPrograms) {
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
        [programId, '2025/2026', program.minAggregate, 'UEW Official Website']
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
    console.log(`  - Total: ${uewPrograms.length}`)

    process.exit(0)

  } catch (error) {
    console.error('Error seeding UEW cutoff points:', error)
    process.exit(1)
  }
}

seedUEWCutoffPoints()
