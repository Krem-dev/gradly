const { pool } = require('../config/database')
require('dotenv').config()

const ugPrograms = [
  // College of Basic & Applied Sciences
  { name: 'BSc. Agricultural Engineering', minAggregate: 15, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Biomedical Engineering', minAggregate: 6, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Computer Engineering', minAggregate: 7, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Food Process Engineering', minAggregate: 12, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Materials Science & Engineering', minAggregate: 13, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Biological Sciences', minAggregate: 14, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Psychology', minAggregate: 15, college: 'Basic & Applied Sciences' },
  { name: 'Doctor of Veterinary Medicine', minAggregate: 14, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Actuarial Science', minAggregate: 11, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Computer Science', minAggregate: 7, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Information Technology', minAggregate: 10, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Earth Science', minAggregate: 15, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Physical Sciences', minAggregate: 24, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Mathematical Sciences', minAggregate: 15, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Agriculture Science', minAggregate: 22, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Family and Consumer Sciences (Family & Child Studies)', minAggregate: 16, college: 'Basic & Applied Sciences' },
  { name: 'BSc. Family and Consumer Sciences (Food & Clothing)', minAggregate: 20, college: 'Basic & Applied Sciences' },
  
  // College of Health Sciences
  { name: 'Bachelor of Medicine and Bachelor of Surgery', minAggregate: 8, college: 'Health Sciences' },
  { name: 'Bachelor of Dental Surgery', minAggregate: 10, college: 'Health Sciences' },
  { name: 'Doctor of Pharmacy', minAggregate: 10, college: 'Health Sciences' },
  { name: 'BSc. Nursing', minAggregate: 15, college: 'Health Sciences' },
  { name: 'BSc. Midwifery', minAggregate: 15, college: 'Health Sciences' },
  { name: 'BSc. Medical Laboratory Sciences', minAggregate: 12, college: 'Health Sciences' },
  { name: 'BSc. Physiotherapy', minAggregate: 14, college: 'Health Sciences' },
  { name: 'BSc. Dietetics', minAggregate: 14, college: 'Health Sciences' },
  { name: 'BSc. Diagnostic Radiography', minAggregate: 13, college: 'Health Sciences' },
  { name: 'BSc. Occupational Therapy', minAggregate: 14, college: 'Health Sciences' },
  { name: 'BSc. Respiratory Therapy', minAggregate: 14, college: 'Health Sciences' },
  { name: 'Bachelor of Public Health', minAggregate: 9, college: 'Health Sciences' },
  
  // College of Education
  { name: 'Bachelor of Education in Social Studies', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in English', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in Mathematics', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in Science (Physics)', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in Science (Chemistry)', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in Science (Biology)', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education (Early Grade Specialism)', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education (JHS Specialism)', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education (Upper Grade Specialism)', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Arts in Sports and Physical Culture', minAggregate: 24, college: 'Education' },
  { name: 'BSc. Administration - (Kumasi and Takoradi City Campuses)', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in French', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in Spanish', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in Performing Arts', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in Information and Communication Technology', minAggregate: 12, college: 'Education' },
  { name: 'Bachelor of Education in Consumer Sciences', minAggregate: 20, college: 'Education' },
  { name: 'Bachelor of Education in Arabic', minAggregate: 24, college: 'Education' },
  { name: 'Bachelor of Education in Computer Science', minAggregate: 9, college: 'Education' },
  
  // Distance Education
  { name: 'Bachelor of Arts (Distance)', minAggregate: 30, college: 'Distance Education' },
  { name: 'BSc. Administration (Distance)', minAggregate: 30, college: 'Distance Education' },
  { name: 'BSc. Information Technology (Distance)', minAggregate: 24, college: 'Distance Education' },
  
  // College of Humanities
  { name: 'Bachelor of Laws', minAggregate: 7, college: 'Humanities' },
  { name: 'BSc. Administration', minAggregate: 9, college: 'Humanities' },
  { name: 'BSc. Administration - (Full-Fee Paying)', minAggregate: 12, college: 'Humanities' },
  { name: 'Bachelor of Arts (General Arts Background)', minAggregate: 16, college: 'Humanities' },
  { name: 'Bachelor of Arts (Full-Fee Paying)', minAggregate: 20, college: 'Humanities' },
  { name: 'Bachelor of Arts (Bouquets with a Business Subject)', minAggregate: 12, college: 'Humanities' },
  { name: 'Bachelor of Fine Arts', minAggregate: 20, college: 'Humanities' },
  { name: 'Bachelor of Music', minAggregate: 20, college: 'Humanities' },
  
  // Accra City Campus
  { name: 'Bachelor of Arts (Accra City Campus)', minAggregate: 24, college: 'Accra City Campus' },
  { name: 'BSc. Administration (Accra City Campus)', minAggregate: 24, college: 'Accra City Campus' }
]

async function seedUGCutoffPoints() {
  try {
    console.log('Seeding UG cutoff points for 2025/2026...\n')

    const [university] = await pool.query(
      'SELECT id FROM ghana_universities WHERE abbreviation = ?',
      ['UG']
    )

    if (university.length === 0) {
      console.error('UG university not found in database')
      process.exit(1)
    }

    const universityId = university[0].id
    let saved = 0
    let updated = 0

    for (const program of ugPrograms) {
      const [existingProgram] = await pool.query(
        'SELECT id FROM programs WHERE university_id = ? AND name = ?',
        [universityId, program.name]
      )

      let programId
      if (existingProgram.length > 0) {
        programId = existingProgram[0].id
      } else {
        const [result] = await pool.query(
          'INSERT INTO programs (university_id, universityId, name, category, maxCutoff) VALUES (?, ?, ?, ?, ?)',
          [universityId, universityId, program.name, program.college, program.minAggregate]
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
        [programId, '2025/2026', program.minAggregate, 'UG Official Website']
      )

      if (result.affectedRows === 1) {
        saved++
        console.log(`✓ ${program.name} - Aggregate: ${program.minAggregate}`)
      } else {
        updated++
        console.log(`↻ ${program.name} - Aggregate: ${program.minAggregate} (updated)`)
      }
    }

    console.log(`\n✓ Seeding completed!`)
    console.log(`  - New programs: ${saved}`)
    console.log(`  - Updated programs: ${updated}`)
    console.log(`  - Total: ${ugPrograms.length}`)

    process.exit(0)

  } catch (error) {
    console.error('Error seeding UG cutoff points:', error)
    process.exit(1)
  }
}

seedUGCutoffPoints()
