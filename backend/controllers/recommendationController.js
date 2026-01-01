const { pool } = require('../config/database')

class RecommendationController {
  static async getUniversityRecommendations(req, res) {
    try {
      const { aggregate, academicYear = '2025/2026', courseStream } = req.body

      if (!aggregate || aggregate < 6 || aggregate > 54) {
        return res.status(400).json({
          success: false,
          error: 'Invalid aggregate. Must be between 6 and 54.'
        })
      }

      const courseStreamFilter = RecommendationController.getCourseStreamFilter(courseStream)

      let query = `SELECT 
          gu.abbreviation as university,
          gu.name as universityName,
          p.name as programName,
          CAST(scp.min_aggregate AS UNSIGNED) as cutoffAggregate
        FROM shs_cutoff_points scp
        JOIN programs p ON scp.program_id = p.id
        JOIN ghana_universities gu ON p.university_id = gu.id
        WHERE scp.academic_year = ?
        AND ? <= scp.min_aggregate`

      const params = [academicYear, aggregate]

      if (courseStreamFilter) {
        query += ` AND (${courseStreamFilter.conditions.join(' OR ')})`
      }

      query += ` ORDER BY gu.abbreviation, scp.min_aggregate ASC`

      const [recommendations] = await pool.query(query, params)

      const groupedByUniversity = {}
      for (const rec of recommendations) {
        if (!groupedByUniversity[rec.university]) {
          groupedByUniversity[rec.university] = {
            university: rec.university,
            universityName: rec.universityName,
            programs: []
          }
        }
        groupedByUniversity[rec.university].programs.push({
          name: rec.programName,
          cutoffAggregate: Math.round(rec.cutoffAggregate)
        })
      }

      const universities = Object.values(groupedByUniversity)

      return res.json({
        success: true,
        studentAggregate: aggregate,
        academicYear: academicYear,
        totalUniversitiesWithEligiblePrograms: universities.length,
        totalEligiblePrograms: recommendations.length,
        universities: universities
      })

    } catch (error) {
      console.error('Error getting recommendations:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async getProgramsByUniversity(req, res) {
    try {
      const { universityAbbr, academicYear = '2025/2026' } = req.query

      if (!universityAbbr) {
        return res.status(400).json({
          success: false,
          error: 'University abbreviation is required'
        })
      }

      const [programs] = await pool.query(
        `SELECT 
          p.name as programName,
          CAST(scp.min_aggregate AS UNSIGNED) as cutoffAggregate,
          gu.name as universityName
        FROM shs_cutoff_points scp
        JOIN programs p ON scp.program_id = p.id
        JOIN ghana_universities gu ON p.university_id = gu.id
        WHERE gu.abbreviation = ?
        AND scp.academic_year = ?
        ORDER BY scp.min_aggregate ASC`,
        [universityAbbr, academicYear]
      )

      if (programs.length === 0) {
        return res.json({
          success: true,
          university: universityAbbr,
          programs: [],
          message: 'No programs found for this university'
        })
      }

      return res.json({
        success: true,
        university: universityAbbr,
        universityName: programs[0].universityName,
        academicYear: academicYear,
        totalPrograms: programs.length,
        programs: programs.map(p => ({
          name: p.programName,
          cutoffAggregate: Math.round(p.cutoffAggregate)
        }))
      })

    } catch (error) {
      console.error('Error getting programs:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async getEligibleUniversities(req, res) {
    try {
      const { aggregate, academicYear = '2025/2026' } = req.body

      if (!aggregate || aggregate < 6 || aggregate > 54) {
        return res.status(400).json({
          success: false,
          error: 'Invalid aggregate. Must be between 6 and 54.'
        })
      }

      const [universities] = await pool.query(
        `SELECT DISTINCT
          gu.id,
          gu.abbreviation,
          gu.name,
          gu.location,
          gu.website,
          COUNT(DISTINCT p.id) as totalPrograms,
          SUM(CASE WHEN scp.min_aggregate <= ? THEN 1 ELSE 0 END) as eligiblePrograms,
          CAST(MIN(scp.min_aggregate) AS UNSIGNED) as lowestCutoff
        FROM ghana_universities gu
        JOIN programs p ON gu.id = p.university_id
        JOIN shs_cutoff_points scp ON p.id = scp.program_id
        WHERE scp.academic_year = ?
        GROUP BY gu.id, gu.abbreviation, gu.name, gu.location, gu.website
        HAVING eligiblePrograms > 0
        ORDER BY eligiblePrograms DESC, lowestCutoff ASC`,
        [aggregate, academicYear]
      )

      return res.json({
        success: true,
        studentAggregate: aggregate,
        academicYear: academicYear,
        eligibleUniversities: universities.length,
        universities: universities.map(u => ({
          abbreviation: u.abbreviation,
          name: u.name,
          location: u.location,
          website: u.website,
          totalPrograms: u.totalPrograms,
          eligiblePrograms: u.eligiblePrograms,
          lowestCutoff: Math.round(u.lowestCutoff)
        }))
      })

    } catch (error) {
      console.error('Error getting eligible universities:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static getCourseStreamFilter(courseStream) {
    const filters = {
      science: {
        conditions: [
          "p.name LIKE '%Engineering%'",
          "p.name LIKE '%Medicine%'",
          "p.name LIKE '%Pharmacy%'",
          "p.name LIKE '%Science%'",
          "p.name LIKE '%Chemistry%'",
          "p.name LIKE '%Physics%'",
          "p.name LIKE '%Biology%'",
          "p.name LIKE '%Computer%'",
          "p.name LIKE '%Mathematics%'",
          "p.name LIKE '%Veterinary%'",
          "p.name LIKE '%Optometry%'",
          "p.name LIKE '%Nursing%'",
          "p.name LIKE '%Midwifery%'",
          "p.name LIKE '%Laboratory%'",
          "p.name LIKE '%Imaging%'",
          "p.name LIKE '%Radiography%'",
          "p.name LIKE '%Physiotherapy%'",
          "p.name LIKE '%Dentistry%'",
          "p.name LIKE '%Biomedical%'",
          "p.name LIKE '%Aerospace%'",
          "p.name LIKE '%Petroleum%'",
          "p.name LIKE '%Metallurgical%'",
          "p.name LIKE '%Geological%'"
        ]
      },
      business: {
        conditions: [
          "p.name LIKE '%Business%'",
          "p.name LIKE '%Commerce%'",
          "p.name LIKE '%Accounting%'",
          "p.name LIKE '%Finance%'",
          "p.name LIKE '%Banking%'",
          "p.name LIKE '%Economics%'",
          "p.name LIKE '%Management%'",
          "p.name LIKE '%Marketing%'",
          "p.name LIKE '%Administration%'",
          "p.name LIKE '%Entrepreneurship%'",
          "p.name LIKE '%Supply Chain%'",
          "p.name LIKE '%Procurement%'",
          "p.name LIKE '%Human Resource%'",
          "p.name LIKE '%Hospitality%'",
          "p.name LIKE '%Tourism%'",
          "p.name LIKE '%Information Technology%'",
          "p.name LIKE '%Computer Science%'"
        ]
      },
      'agricultural-science': {
        conditions: [
          "p.name LIKE '%Agriculture%'",
          "p.name LIKE '%Agribusiness%'",
          "p.name LIKE '%Agro%'",
          "p.name LIKE '%Aquaculture%'",
          "p.name LIKE '%Forestry%'",
          "p.name LIKE '%Forest%'",
          "p.name LIKE '%Horticulture%'",
          "p.name LIKE '%Livestock%'",
          "p.name LIKE '%Fisheries%'",
          "p.name LIKE '%Packaging%'",
          "p.name LIKE '%Food Science%'",
          "p.name LIKE '%Food Process%'",
          "p.name LIKE '%Landscape%'",
          "p.name LIKE '%Natural Resources%'",
          "p.name LIKE '%Environmental%'",
          "p.name LIKE '%Biochemistry%'",
          "p.name LIKE '%Biological%'"
        ]
      },
      arts: {
        conditions: [
          "p.name LIKE '%Law%'",
          "p.name LIKE '%History%'",
          "p.name LIKE '%Government%'",
          "p.name LIKE '%Political%'",
          "p.name LIKE '%Sociology%'",
          "p.name LIKE '%BA.%Communication%'",
          "p.name LIKE '%Bachelor of Arts%Communication%'",
          "p.name LIKE '%Bachelor of Education%Communication%'",
          "p.name LIKE '%English%'",
          "p.name LIKE '%Language%'",
          "p.name LIKE '%Literature%'",
          "p.name LIKE '%Geography%'",
          "p.name LIKE '%Social%'",
          "p.name LIKE '%Humanities%'",
          "p.name LIKE '%Religious%'",
          "p.name LIKE '%Linguistics%'"
        ]
      },
      'home-economics': {
        conditions: [
          "p.name LIKE '%Home Economics%'",
          "p.name LIKE '%Nutrition%'",
          "p.name LIKE '%Dietetics%'",
          "p.name LIKE '%Food%'",
          "p.name LIKE '%Clothing%'",
          "p.name LIKE '%Management in Living%'",
          "p.name LIKE '%Family%'",
          "p.name LIKE '%Consumer%'"
        ]
      },
      'visual-arts': {
        conditions: [
          "p.name LIKE '%Art%'",
          "p.name LIKE '%Music%'",
          "p.name LIKE '%Drama%'",
          "p.name LIKE '%Design%'",
          "p.name LIKE '%Fine Art%'",
          "p.name LIKE '%Painting%'",
          "p.name LIKE '%Sculpture%'",
          "p.name LIKE '%Animation%'",
          "p.name LIKE '%Graphic%'",
          "p.name LIKE '%Theatre%'",
          "p.name LIKE '%Performance%'"
        ]
      }
    }

    return filters[courseStream] || null
  }
}

module.exports = RecommendationController
