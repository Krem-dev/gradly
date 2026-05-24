const Conversion = require('../models/Conversion')
const User = require('../models/User')
const universityConverterService = require('../services/university.converter.service')
const { pool } = require('../config/database')

class DashboardController {
  static async getStats(req, res) {
    try {
      const userId = req.params.userId

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      // Count BOTH SHS conversions (in `conversions`) and university conversions
      // (in `university_conversions`). The frontend dashboard wants a single total.
      let shsCount = 0
      let univCount = 0
      try {
        shsCount = await Conversion.countByUserId(userId)
      } catch {}
      try {
        const [[r]] = await pool.query(
          'SELECT COUNT(*) AS c FROM university_conversions WHERE user_id = ?',
          [userId]
        )
        univCount = r?.c || 0
      } catch {}

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            plan: user.plan,
            credits: user.credits ?? 0,
            createdAt: user.createdAt,
          },
          stats: {
            totalConversions: shsCount + univCount,
            shsConversions: shsCount,
            universityConversions: univCount,
          },
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async getRecentConversions(req, res) {
    try {
      const userId = req.params.userId
      const limit = parseInt(req.query.limit) || 10

      // Pull both tables in one query, union them into a normalized shape.
      // The frontend ConversionRow component reads:
      //   id, type, aggregate, result, courses, targetSystem, sourceSystem, createdAt
      const [rows] = await pool.query(
        `
        SELECT id,
               'shs' AS source_table,
               type,
               inputData AS input_data,
               result,
               createdAt AS created_at
          FROM conversions WHERE userId = ?
        UNION ALL
        SELECT id,
               'university' AS source_table,
               'university_conversion' AS type,
               JSON_OBJECT('courses', courses) AS input_data,
               JSON_OBJECT(
                 'sourceSystem', source_system,
                 'sourceScore', source_score,
                 'usaGpa', usa_gpa,
                 'ukPercentage', uk_percentage,
                 'targetSystem', target_system
               ) AS result,
               created_at
          FROM university_conversions WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
        `,
        [userId, userId, limit]
      )

      const normalized = rows.map((r) => {
        const input = safeJson(r.input_data)
        const result = safeJson(r.result)
        const base = {
          id: r.id,
          type: r.type,
          createdAt: r.created_at,
          source: r.source_table, // 'shs' | 'university'
        }
        if (r.source_table === 'shs') {
          return {
            ...base,
            aggregate: result?.aggregate ?? null,
            courseStream: result?.courseStream ?? null,
            courses: input?.subjects || [],
          }
        }
        return {
          ...base,
          result: result?.usaGpa ?? null,
          targetSystem: result?.targetSystem ?? null,
          sourceSystem: result?.sourceSystem ?? null,
          courses: input?.courses || [],
        }
      })

      res.json({ success: true, data: normalized })
    } catch (error) {
      console.error('[getRecentConversions]', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async deleteConversion(req, res) {
    try {
      const { conversionId } = req.params
      // Frontend now sends ?source=shs|university so we know which table to target.
      // Without source, the legacy behaviour (conversions table) is preserved.
      const source = (req.query.source || 'shs').toString()

      if (source === 'university') {
        const [result] = await pool.query(
          'DELETE FROM university_conversions WHERE id = ?',
          [conversionId]
        )
        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, error: 'Conversion not found' })
        }
        return res.json({ success: true, message: 'Conversion deleted successfully' })
      }

      // 'shs' (legacy) → conversions table
      const conversion = await Conversion.findById(conversionId)
      if (!conversion) {
        return res.status(404).json({
          success: false,
          error: 'Conversion not found'
        })
      }

      await Conversion.delete(conversionId)

      res.json({
        success: true,
        message: 'Conversion deleted successfully'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

function safeJson(v) {
  if (v == null) return null
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return null }
}

module.exports = DashboardController
