const { pool } = require('../config/database')
require('dotenv').config()

async function verifyCutoffData() {
  try {
    console.log('Verifying cutoff data in database...\n')

    const [universities] = await pool.query(
      'SELECT id, abbreviation, name FROM ghana_universities ORDER BY abbreviation'
    )

    for (const uni of universities) {
      const [programs] = await pool.query(
        `SELECT 
          p.id,
          p.name as programName,
          p.maxCutoff,
          scp.min_aggregate,
          scp.academic_year,
          scp.data_source
        FROM programs p
        LEFT JOIN shs_cutoff_points scp ON p.id = scp.program_id
        WHERE p.university_id = ?
        ORDER BY scp.min_aggregate ASC`,
        [uni.id]
      )

      console.log(`\n${'='.repeat(80)}`)
      console.log(`${uni.abbreviation} - ${uni.name}`)
      console.log(`${'='.repeat(80)}`)
      console.log(`Total Programs: ${programs.length}\n`)

      if (programs.length === 0) {
        console.log('⚠️  No programs found for this university\n')
        continue
      }

      let mismatchCount = 0
      let missingCutoffCount = 0

      console.log('Program Name | maxCutoff | min_aggregate | Match | Data Source')
      console.log('-'.repeat(100))

      for (const prog of programs) {
        const hasMatch = prog.maxCutoff === prog.min_aggregate
        const status = hasMatch ? '✓' : '✗'
        
        if (!hasMatch && prog.min_aggregate !== null) {
          mismatchCount++
        }
        
        if (prog.min_aggregate === null) {
          missingCutoffCount++
        }

        const programName = prog.programName.substring(0, 40).padEnd(40)
        const maxCutoff = (prog.maxCutoff || '-').toString().padEnd(9)
        const minAggregate = (prog.min_aggregate || '-').toString().padEnd(13)
        const source = prog.data_source || 'NONE'

        console.log(`${programName} | ${maxCutoff} | ${minAggregate} | ${status} | ${source}`)
      }

      console.log(`\nSummary for ${uni.abbreviation}:`)
      console.log(`  ✓ Matching cutoffs: ${programs.length - mismatchCount - missingCutoffCount}`)
      console.log(`  ✗ Mismatched cutoffs: ${mismatchCount}`)
      console.log(`  ⚠️  Missing cutoff points: ${missingCutoffCount}`)
    }

    console.log(`\n${'='.repeat(80)}`)
    console.log('OVERALL STATISTICS')
    console.log(`${'='.repeat(80)}\n`)

    const [totalStats] = await pool.query(
      `SELECT 
        COUNT(DISTINCT p.id) as totalPrograms,
        COUNT(DISTINCT CASE WHEN scp.id IS NOT NULL THEN p.id END) as programsWithCutoffs,
        COUNT(DISTINCT CASE WHEN p.maxCutoff = scp.min_aggregate THEN p.id END) as matchingCutoffs
      FROM programs p
      LEFT JOIN shs_cutoff_points scp ON p.id = scp.program_id`
    )

    const stats = totalStats[0]
    console.log(`Total Programs in Database: ${stats.totalPrograms}`)
    console.log(`Programs with Cutoff Points: ${stats.programsWithCutoffs}`)
    console.log(`Programs with Matching Cutoffs: ${stats.matchingCutoffs}`)
    console.log(`Coverage: ${((stats.programsWithCutoffs / stats.totalPrograms) * 100).toFixed(2)}%`)
    console.log(`Match Rate: ${((stats.matchingCutoffs / stats.programsWithCutoffs) * 100).toFixed(2)}%`)

    await pool.end()
    process.exit(0)

  } catch (error) {
    console.error('Error verifying cutoff data:', error)
    process.exit(1)
  }
}

verifyCutoffData()
