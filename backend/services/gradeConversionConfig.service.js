const { pool } = require('../config/database')

class GradeConversionConfigService {
  async getGradingSystems() {
    try {
      const [systems] = await pool.query(
        'SELECT * FROM grading_systems WHERE is_active = TRUE ORDER BY country, name'
      )
      return { success: true, data: systems }
    } catch (error) {
      console.error('Error fetching grading systems:', error)
      return { success: false, error: error.message }
    }
  }

  async getGradeBoundaries(gradingSystemId) {
    try {
      const [boundaries] = await pool.query(
        `SELECT * FROM grade_boundaries 
         WHERE grading_system_id = ? AND is_active = TRUE 
         ORDER BY display_order`,
        [gradingSystemId]
      )
      return { success: true, data: boundaries }
    } catch (error) {
      console.error('Error fetching grade boundaries:', error)
      return { success: false, error: error.message }
    }
  }

  async getConversionFormula(gradingSystemId, targetSystem) {
    try {
      const [formulas] = await pool.query(
        `SELECT * FROM conversion_formulas 
         WHERE grading_system_id = ? AND target_system = ? AND is_active = TRUE 
         LIMIT 1`,
        [gradingSystemId, targetSystem]
      )
      return { success: true, data: formulas[0] || null }
    } catch (error) {
      console.error('Error fetching conversion formula:', error)
      return { success: false, error: error.message }
    }
  }

  async updateGradeBoundary(id, data) {
    try {
      const { min_score, max_score, us_letter_grade, gpa_points } = data
      
      await pool.query(
        `UPDATE grade_boundaries 
         SET min_score = ?, max_score = ?, us_letter_grade = ?, gpa_points = ?, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [min_score, max_score, us_letter_grade, gpa_points, id]
      )
      
      return { success: true, message: 'Grade boundary updated successfully' }
    } catch (error) {
      console.error('Error updating grade boundary:', error)
      return { success: false, error: error.message }
    }
  }

  async updateConversionFormula(id, data) {
    try {
      const { formula_expression, description } = data
      
      await pool.query(
        `UPDATE conversion_formulas 
         SET formula_expression = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [formula_expression, description, id]
      )
      
      return { success: true, message: 'Conversion formula updated successfully' }
    } catch (error) {
      console.error('Error updating conversion formula:', error)
      return { success: false, error: error.message }
    }
  }

  async scoreToLetterGrade(gradingSystemId, score) {
    try {
      const result = await this.getGradeBoundaries(gradingSystemId)
      
      if (!result.success || !result.data || result.data.length === 0) {
        return null
      }

      for (const boundary of result.data) {
        if (score >= boundary.min_score && score <= boundary.max_score) {
          return {
            letter: boundary.us_letter_grade,
            points: boundary.gpa_points
          }
        }
      }

      return { letter: 'F', points: 0.0 }
    } catch (error) {
      console.error('Error converting score to letter grade:', error)
      return null
    }
  }

  async applyFormula(gradingSystemId, targetSystem, score) {
    try {
      const result = await this.getConversionFormula(gradingSystemId, targetSystem)
      
      if (!result.success || !result.data) {
        return null
      }

      const formula = result.data
      
      if (formula.formula_type === 'direct') {
        return score
      }
      
      if (formula.formula_type === 'linear' && formula.formula_expression) {
        const calculatedValue = eval(formula.formula_expression.replace('score', score))
        return Math.round(calculatedValue * 100) / 100
      }

      return null
    } catch (error) {
      console.error('Error applying formula:', error)
      return null
    }
  }
}

module.exports = new GradeConversionConfigService()
