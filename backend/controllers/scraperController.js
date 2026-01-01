const ScraperFactory = require('../services/scrapers/index')
const db = require('../config/database')

class ScraperController {
  static async runScraper(req, res) {
    try {
      const { university } = req.body

      if (!university) {
        return res.status(400).json({
          success: false,
          error: 'University abbreviation is required'
        })
      }

      const result = await ScraperFactory.scrapeUniversity(university)

      return res.json({
        success: true,
        result: result
      })
    } catch (error) {
      console.error('Scraper error:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async runAllScrapers(req, res) {
    try {
      const results = await ScraperFactory.scrapeAll()

      const summary = {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        totalRecords: results.reduce((sum, r) => sum + (r.recordsScraped || 0), 0)
      }

      return res.json({
        success: true,
        summary: summary,
        results: results
      })
    } catch (error) {
      console.error('Scraper error:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async getScraperLogs(req, res) {
    try {
      const { limit = 50, university_id } = req.query

      let query = 'SELECT * FROM scraper_logs'
      const params = []

      if (university_id) {
        query += ' WHERE university_id = ?'
        params.push(university_id)
      }

      query += ' ORDER BY scrape_timestamp DESC LIMIT ?'
      params.push(parseInt(limit))

      const [logs] = await pool.query(query, params)

      return res.json({
        success: true,
        logs: logs
      })
    } catch (error) {
      console.error('Error fetching logs:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async getDataQualityIssues(req, res) {
    try {
      const { resolved = false } = req.query

      const [issues] = await pool.query(
        `SELECT dqi.*, gu.name as university_name, p.program_name 
         FROM data_quality_issues dqi
         LEFT JOIN ghana_universities gu ON dqi.university_id = gu.id
         LEFT JOIN programs p ON dqi.program_id = p.id
         WHERE dqi.is_resolved = ?
         ORDER BY dqi.severity DESC, dqi.detected_at DESC
         LIMIT 100`,
        [resolved]
      )

      return res.json({
        success: true,
        issues: issues
      })
    } catch (error) {
      console.error('Error fetching issues:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async getUniversityPrograms(req, res) {
    try {
      const { university_id, academic_year } = req.query

      if (!university_id) {
        return res.status(400).json({
          success: false,
          error: 'university_id is required'
        })
      }

      let query = `
        SELECT p.*, scp.min_aggregate, scp.academic_year, scp.required_subjects
        FROM programs p
        LEFT JOIN shs_cutoff_points scp ON p.id = scp.program_id
        WHERE p.university_id = ?
      `
      const params = [university_id]

      if (academic_year) {
        query += ' AND scp.academic_year = ?'
        params.push(academic_year)
      }

      query += ' ORDER BY p.program_name'

      const [programs] = await pool.query(query, params)

      return res.json({
        success: true,
        programs: programs
      })
    } catch (error) {
      console.error('Error fetching programs:', error)
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

module.exports = ScraperController
