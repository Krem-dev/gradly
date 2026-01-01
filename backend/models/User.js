const { pool } = require('../config/database')

class User {
  static async create(userData) {
    const { email, password, fullName } = userData
    const query = `
      INSERT INTO users (email, password, fullName, plan)
      VALUES (?, ?, ?, 'free')
    `
    const [result] = await pool.execute(query, [email, password, fullName])
    return result.insertId
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`
    const [rows] = await pool.execute(query, [email])
    return rows[0] || null
  }

  static async findById(id) {
    const query = `SELECT id, email, fullName, plan, createdAt FROM users WHERE id = ?`
    const [rows] = await pool.execute(query, [id])
    return rows[0] || null
  }

  static async updatePlan(userId, plan) {
    const query = `UPDATE users SET plan = ? WHERE id = ?`
    await pool.execute(query, [plan, userId])
  }

  static async exists(email) {
    const query = `SELECT id FROM users WHERE email = ?`
    const [rows] = await pool.execute(query, [email])
    return rows.length > 0
  }

  static async updatePassword(userId, newPassword) {
    const query = `UPDATE users SET password = ? WHERE id = ?`
    await pool.execute(query, [newPassword, userId])
  }

  static async delete(userId) {
    const query = `DELETE FROM users WHERE id = ?`
    await pool.execute(query, [userId])
  }

  static async findByEmailForAuth(email) {
    const query = `SELECT id, email, password, fullName, plan FROM users WHERE email = ?`
    const [rows] = await pool.execute(query, [email])
    return rows[0] || null
  }
}

module.exports = User
