const { pool } = require('../config/database')
require('dotenv').config()

async function testAPI() {
  try {
    const aggregate = 12

    console.log(`Testing recommendation API for aggregate: ${aggregate}\n`)

    const [recommendations] = await pool.query(
      `SELECT 
        gu.abbreviation as university,
        gu.name as universityName,
        p.name as programName,
        scp.min_aggregate as cutoffAggregate
      FROM shs_cutoff_points scp
      JOIN programs p ON scp.program_id = p.id
      JOIN ghana_universities gu ON p.university_id = gu.id
      WHERE scp.academic_year = '2025/2026'
      AND scp.min_aggregate <= ?
      ORDER BY gu.abbreviation, scp.min_aggregate ASC`,
      [aggregate]
    )

    console.log(`Total eligible programs for aggregate ${aggregate}: ${recommendations.length}\n`)

    const computerScience = recommendations.filter(r => r.programName.toLowerCase().includes('computer science'))
    
    console.log('Computer Science programs eligible for aggregate 12:')
    console.log('=' .repeat(80))
    computerScience.forEach(prog => {
      console.log(`${prog.university} - ${prog.programName}: ${prog.cutoffAggregate}`)
    })

    await pool.end()
    process.exit(0)

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

testAPI()
