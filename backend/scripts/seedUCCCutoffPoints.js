const { pool } = require('../config/database')
require('dotenv').config()

const uccPrograms = [
  // Bachelor of Arts
  { name: 'Bachelor of Arts', minAggregate: 22 },
  { name: 'Bachelor of Arts (African Studies)', minAggregate: 19 },
  { name: 'Bachelor of Arts (Anthropology)', minAggregate: 22 },
  { name: 'Bachelor of Arts (Chinese)', minAggregate: 25 },
  { name: 'Bachelor of Arts (Communication Studies)', minAggregate: 17 },
  { name: 'Bachelor of Arts (Film Studies)', minAggregate: 25 },
  { name: 'Bachelor of Arts (Information Science)', minAggregate: 22 },
  { name: 'Bachelor of Arts (Linguistics)', minAggregate: 20 },
  { name: 'Bachelor of Arts (Population and Health)', minAggregate: 20 },
  { name: 'Bachelor of Arts (Social Sciences)', minAggregate: 20 },
  { name: 'Bachelor of Arts (Theatre Studies)', minAggregate: 23 },

  // Bachelor of Commerce
  { name: 'Bachelor of Commerce (Accounting)', minAggregate: 15 },
  { name: 'Bachelor of Commerce (Entrepreneurship with Graphic Design)', minAggregate: 18 },
  { name: 'Bachelor of Commerce (Finance)', minAggregate: 16 },
  { name: 'Bachelor of Commerce (Human Resource Management)', minAggregate: 17 },
  { name: 'Bachelor of Commerce (Management)', minAggregate: 22 },
  { name: 'Bachelor of Commerce (Marketing)', minAggregate: 20 },
  { name: 'Bachelor of Commerce (Procurement and Supply Chain Management)', minAggregate: 20 },
  { name: 'Bachelor of Commerce (Entrepreneurship with International Business)', minAggregate: 18 },

  // Bachelor of Education
  { name: 'Bachelor of Education (Economics)', minAggregate: 18 },
  { name: 'Bachelor of Education (English)', minAggregate: 20 },
  { name: 'Bachelor of Education (Geography)', minAggregate: 19 },
  { name: 'Bachelor of Education (Ghanaian Language and Culture)', minAggregate: 20 },
  { name: 'Bachelor of Education (History)', minAggregate: 19 },
  { name: 'Bachelor of Education (Religious and Moral Studies)', minAggregate: 19 },
  { name: 'Bachelor of Education (Accounting)', minAggregate: 18 },
  { name: 'Bachelor of Education (Accounting with Management)', minAggregate: 20 },
  { name: 'Bachelor of Education (Agriculture)', minAggregate: 22 },
  { name: 'Bachelor of Education (Automobile and Metal Technology)', minAggregate: 18 },
  { name: 'Bachelor of Education (Clothing and Textiles with Management in Living)', minAggregate: 20 },
  { name: 'Bachelor of Education (Communication Design)', minAggregate: 17 },
  { name: 'Bachelor of Education (Construction and Woodwork Technology)', minAggregate: 18 },
  { name: 'Bachelor of Education (Early Childhood Education)', minAggregate: 20 },
  { name: 'Bachelor of Education (Electrical and Electronic Engineering)', minAggregate: 19 },
  { name: 'Bachelor of Education (Food and Nutrition with Management in Living)', minAggregate: 20 },
  { name: 'Bachelor of Education (French)', minAggregate: 19 },
  { name: 'Bachelor of Education (Government)', minAggregate: 19 },
  { name: 'Bachelor of Education (Health, Physical Education and Recreation)', minAggregate: 23 },
  { name: 'Bachelor of Education (Inclusive Education)', minAggregate: 23 },
  { name: 'Bachelor of Education (Information and Communication Technology)', minAggregate: 20 },
  { name: 'Bachelor of Education (Integrated Arts)', minAggregate: 19 },
  { name: 'Bachelor of Education (Junior High School Education)', minAggregate: 22 },
  { name: 'Bachelor of Education (Management)', minAggregate: 20 },
  { name: 'Bachelor of Education (Management with Accounting)', minAggregate: 18 },
  { name: 'Bachelor of Education (Mathematics)', minAggregate: 18 },
  { name: 'Bachelor of Education (Primary Education)', minAggregate: 21 },
  { name: 'Bachelor of Education (Robotics and Intelligent Systems)', minAggregate: 22 },
  { name: 'Bachelor of Education (Science)', minAggregate: 22 },
  { name: 'Bachelor of Education (Social Studies)', minAggregate: 18 },

  // Bachelor of Fine Art and Music
  { name: 'Bachelor of Fine Art Education (Painting and Sculpture)', minAggregate: 19 },
  { name: 'Bachelor of Music', minAggregate: 21 },

  // Bachelor of Laws
  { name: 'Bachelor of Laws (LLB)', minAggregate: 12 },

  // Bachelor of Medicine and Surgery
  { name: 'Bachelor of Medicine and Bachelor of Surgery', minAggregate: 8 },

  // Bachelor of Science
  { name: 'Bachelor of Science (Actuarial Science)', minAggregate: 16 },
  { name: 'Bachelor of Science (Agribusiness)', minAggregate: 20 },
  { name: 'Bachelor of Science (Agricultural Engineering)', minAggregate: 20 },
  { name: 'Bachelor of Science (Agricultural Extension)', minAggregate: 20 },
  { name: 'Bachelor of Science (Agricultural Extension and Community Development)', minAggregate: 21 },
  { name: 'Bachelor of Science (Agriculture)', minAggregate: 18 },
  { name: 'Bachelor of Science (Agro Processing)', minAggregate: 20 },
  { name: 'Bachelor of Science (Biochemistry)', minAggregate: 16 },
  { name: 'Bachelor of Science (Biomedical Sciences)', minAggregate: 16 },
  { name: 'Bachelor of Science (Chemical Engineering)', minAggregate: 18 },
  { name: 'Bachelor of Science (Chemistry)', minAggregate: 18 },
  { name: 'Bachelor of Science (Computer Science)', minAggregate: 15 },
  { name: 'Bachelor of Science (Conservation Biology and Entomology)', minAggregate: 25 },
  { name: 'Bachelor of Science (Diagnostic Imaging Technology)', minAggregate: 14 },
  { name: 'Bachelor of Science (Diagnostic Medical Sonography)', minAggregate: 14 },
  { name: 'Bachelor of Science (Dietetics)', minAggregate: 14 },
  { name: 'Bachelor of Science (Dispensing Opticianry)', minAggregate: 18 },
  { name: 'Bachelor of Science (Economics)', minAggregate: 16 },
  { name: 'Bachelor of Science (Economics with Finance)', minAggregate: 17 },
  { name: 'Bachelor of Science (Engineering Physics)', minAggregate: 18 },
  { name: 'Bachelor of Science (Environmental Science)', minAggregate: 19 },
  { name: 'Bachelor of Science (Fisheries and Aquatic Sciences)', minAggregate: 20 },
  { name: 'Bachelor of Science (Food Chemistry)', minAggregate: 16 },
  { name: 'Bachelor of Science (Forensic Science)', minAggregate: 17 },
  { name: 'Bachelor of Science (Geography and Regional Planning)', minAggregate: 17 },
  { name: 'Bachelor of Science (Health Information Management)', minAggregate: 18 },
  { name: 'Bachelor of Science (Horticulture)', minAggregate: 20 },
  { name: 'Bachelor of Science (Hospitality Management)', minAggregate: 20 },
  { name: 'Bachelor of Science (Industrial Chemistry)', minAggregate: 21 },
  { name: 'Bachelor of Science (Information Technology)', minAggregate: 15 },
  { name: 'Bachelor of Science (Laboratory Technology)', minAggregate: 18 },
  { name: 'Bachelor of Science (Livestock Science and Meat Technology)', minAggregate: 20 },
  { name: 'Bachelor of Science (Mathematics)', minAggregate: 20 },
  { name: 'Bachelor of Science (Mathematics and Statistics)', minAggregate: 17 },
  { name: 'Bachelor of Science (Mathematics with Business)', minAggregate: 22 },
  { name: 'Bachelor of Science (Mathematics with Economics)', minAggregate: 17 },
  { name: 'Bachelor of Science (Medical Laboratory Science)', minAggregate: 12 },
  { name: 'Bachelor of Science (Mental Health Nursing)', minAggregate: 12 },
  { name: 'Bachelor of Science (Meteorology and Atmospheric Physics)', minAggregate: 19 },
  { name: 'Bachelor of Science (Midwifery)', minAggregate: 12 },
  { name: 'Bachelor of Science (Molecular Biology and Biotechnology)', minAggregate: 20 },
  { name: 'Bachelor of Science (Nursing)', minAggregate: 12 },
  { name: 'Bachelor of Science (Nutrition)', minAggregate: 15 },
  { name: 'Bachelor of Science (Physics)', minAggregate: 22 },
  { name: 'Bachelor of Science (Psychology)', minAggregate: 20 },
  { name: 'Bachelor of Science (Sport and Exercise Science)', minAggregate: 22 },
  { name: 'Bachelor of Science (Statistics)', minAggregate: 25 },
  { name: 'Bachelor of Science (Tourism Management)', minAggregate: 22 },
  { name: 'Bachelor of Science (Water and Public Health Engineering)', minAggregate: 18 },

  // Postgraduate
  { name: 'Doctor of Optometry', minAggregate: 12 },
  { name: 'Doctor of Pharmacy', minAggregate: 9 }
]

async function seedUCCCutoffPoints() {
  try {
    console.log('Seeding UCC cutoff points for 2025/2026...\n')

    const [university] = await pool.query(
      'SELECT id FROM ghana_universities WHERE abbreviation = ?',
      ['UCC']
    )

    if (university.length === 0) {
      console.error('UCC university not found in database')
      process.exit(1)
    }

    const universityId = university[0].id
    let saved = 0
    let updated = 0

    for (const program of uccPrograms) {
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
        [programId, '2025/2026', program.minAggregate, 'UCC Official Website']
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
    console.log(`  - Total: ${uccPrograms.length}`)

    process.exit(0)

  } catch (error) {
    console.error('Error seeding UCC cutoff points:', error)
    process.exit(1)
  }
}

seedUCCCutoffPoints()
