const { pool } = require('../config/database')
require('dotenv').config()

async function testArtsAggregate20() {
  try {
    console.log('Testing Arts recommendations for aggregate 20...\n')

    const [recommendations] = await pool.query(
      `SELECT 
        gu.abbreviation as university,
        gu.name as universityName,
        p.name as programName,
        CAST(scp.min_aggregate AS UNSIGNED) as cutoffAggregate
      FROM shs_cutoff_points scp
      JOIN programs p ON scp.program_id = p.id
      JOIN ghana_universities gu ON p.university_id = gu.id
      WHERE scp.academic_year = '2025/2026'
      AND scp.min_aggregate <= 20
      AND (
        p.name LIKE '%Law%'
        OR p.name LIKE '%History%'
        OR p.name LIKE '%Government%'
        OR p.name LIKE '%Political%'
        OR p.name LIKE '%Sociology%'
        OR p.name LIKE '%Communication%'
        OR p.name LIKE '%English%'
        OR p.name LIKE '%Language%'
        OR p.name LIKE '%Literature%'
        OR p.name LIKE '%Geography%'
        OR p.name LIKE '%Social%'
        OR p.name LIKE '%Humanities%'
        OR p.name LIKE '%Religious%'
        OR p.name LIKE '%Linguistics%'
      )
      ORDER BY gu.abbreviation, scp.min_aggregate ASC`
    )

    console.log(`Total Arts programs with cutoff <= 20: ${recommendations.length}\n`)
    
    recommendations.forEach(prog => {
      console.log(`${prog.university} - ${prog.programName}: ${prog.cutoffAggregate}`)
    })

    await pool.end()
    process.exit(0)

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

testArtsAggregate20()
