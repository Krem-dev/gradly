const { pool } = require('../config/database')

class Conversion {
  static async create(conversionData) {
    const { userId, type, inputData, result } = conversionData
    const query = `
      INSERT INTO conversions (userId, type, inputData, result)
      VALUES (?, ?, ?, ?)
    `
    const [result_] = await pool.execute(query, [
      userId,
      type,
      JSON.stringify(inputData),
      JSON.stringify(result)
    ])
    return result_.insertId
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT * FROM conversions 
      WHERE userId = ? 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.execute(query, [userId, limit, offset])
    return rows.map(row => this._parseConversion(row))
  }

  static async findById(id) {
    const query = `SELECT * FROM conversions WHERE id = ?`
    const [rows] = await pool.execute(query, [id])
    return rows[0] ? this._parseConversion(rows[0]) : null
  }

  static async findByUserIdAndType(userId, type) {
    const query = `
      SELECT * FROM conversions 
      WHERE userId = ? AND type = ? 
      ORDER BY createdAt DESC
    `
    const [rows] = await pool.execute(query, [userId, type])
    return rows.map(row => this._parseConversion(row))
  }

  static async countByUserId(userId) {
    const query = `SELECT COUNT(*) as count FROM conversions WHERE userId = ?`
    const [rows] = await pool.execute(query, [userId])
    return rows[0].count
  }

  static async delete(id) {
    const query = `DELETE FROM conversions WHERE id = ?`
    await pool.execute(query, [id])
  }

  static _parseConversion(row) {
    return {
      ...row,
      inputData: JSON.parse(row.inputData || '{}'),
      result: JSON.parse(row.result || '{}')
    }
  }
}

module.exports = Conversion
