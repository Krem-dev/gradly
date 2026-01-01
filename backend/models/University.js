const { pool } = require('../config/database')

class University {
  static async create(universityData) {
    const { name, location, region, website } = universityData
    const query = `
      INSERT INTO universities (name, location, region, website)
      VALUES (?, ?, ?, ?)
    `
    const [result] = await pool.execute(query, [name, location, region, website])
    return result.insertId
  }

  static async findAll() {
    const query = `SELECT * FROM universities ORDER BY name ASC`
    const [rows] = await pool.execute(query)
    return rows
  }

  static async findById(id) {
    const query = `SELECT * FROM universities WHERE id = ?`
    const [rows] = await pool.execute(query, [id])
    return rows[0] || null
  }

  static async findByRegion(region) {
    const query = `SELECT * FROM universities WHERE region = ? ORDER BY name ASC`
    const [rows] = await pool.execute(query, [region])
    return rows
  }

  static async update(id, universityData) {
    const { name, location, region, website } = universityData
    const query = `
      UPDATE universities 
      SET name = ?, location = ?, region = ?, website = ?
      WHERE id = ?
    `
    await pool.execute(query, [name, location, region, website, id])
  }

  static async delete(id) {
    const query = `DELETE FROM universities WHERE id = ?`
    await pool.execute(query, [id])
  }
}

module.exports = University
