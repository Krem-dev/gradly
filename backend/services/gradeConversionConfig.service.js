const { pool } = require('../config/database')

/**
 * Safely evaluate a *very* restricted arithmetic expression with one variable, `score`.
 * Returns the numeric result, or null if the expression contains anything else.
 *
 * Allowed: digits, `.`, `+`, `-`, `*`, `/`, `(`, `)`, whitespace, the literal token `score`.
 * No identifiers, no property access, no function calls — that defeats RCE.
 *
 * Examples:
 *   safeEvalLinear('score * 0.8', 50)     → 40
 *   safeEvalLinear('(score / 5) * 4', 25) → 20
 *   safeEvalLinear('score', 3.5)          → 3.5
 *   safeEvalLinear('require("fs")', 1)    → null  (rejected)
 */
function safeEvalLinear(expression, score) {
  if (typeof expression !== 'string') return null
  if (!/^[\s0-9+\-*/().score]+$/i.test(expression)) return null
  // Tokenize: numbers, `score`, operators, parens
  const tokens = expression.match(/(\d+\.\d+|\d+|score|[+\-*/()])/gi)
  if (!tokens) return null

  let pos = 0
  const peek = () => tokens[pos]
  const consume = () => tokens[pos++]

  function parseFactor() {
    const t = consume()
    if (t === '(') {
      const v = parseExpression()
      if (consume() !== ')') throw new Error('Mismatched parens')
      return v
    }
    if (t === '-') return -parseFactor()
    if (t === '+') return parseFactor()
    if (t && t.toLowerCase() === 'score') return Number(score)
    const n = Number(t)
    if (Number.isFinite(n)) return n
    throw new Error(`Unexpected token: ${t}`)
  }

  function parseTerm() {
    let left = parseFactor()
    while (peek() === '*' || peek() === '/') {
      const op = consume()
      const right = parseFactor()
      left = op === '*' ? left * right : left / right
    }
    return left
  }

  function parseExpression() {
    let left = parseTerm()
    while (peek() === '+' || peek() === '-') {
      const op = consume()
      const right = parseTerm()
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  try {
    const result = parseExpression()
    if (pos !== tokens.length) return null
    return Number.isFinite(result) ? result : null
  } catch {
    return null
  }
}

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

  /**
   * Apply a stored conversion formula. The original implementation used eval() on
   * DB-stored expressions, which is a remote-code-execution vector if anyone
   * (admin or attacker) can write to conversion_formulas.formula_expression.
   *
   * This version parses expressions safely. Supported formats:
   *   - "direct"                      → returns score unchanged
   *   - "score * 0.8"                 → linear: score × constant
   *   - "(score / 5) * 4"             → linear with constants and parens
   *   - "score" / "score + 0"         → identity
   * Anything else returns null.
   */
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
        const value = safeEvalLinear(formula.formula_expression, score)
        if (value === null) return null
        return Math.round(value * 100) / 100
      }

      return null
    } catch (error) {
      console.error('Error applying formula:', error)
      return null
    }
  }
}

module.exports = new GradeConversionConfigService()
