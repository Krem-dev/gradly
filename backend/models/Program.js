const { pool } = require('../config/database')

class Program {
  static async create(programData) {
    const {
      universityId,
      name,
      category,
      maxCutoff,
      requiredSubjects,
      gradeRequirements,
      tuition,
      scholarshipAvailable
    } = programData

    const query = `
      INSERT INTO programs 
      (universityId, name, category, maxCutoff, requiredSubjects, gradeRequirements, tuition, scholarshipAvailable)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await pool.execute(query, [
      universityId,
      name,
      category,
      maxCutoff,
      JSON.stringify(requiredSubjects),
      JSON.stringify(gradeRequirements),
      tuition,
      scholarshipAvailable ? 1 : 0
    ])
    return result.insertId
  }

  static async findByUniversityId(universityId) {
    const query = `
      SELECT * FROM programs 
      WHERE universityId = ? 
      ORDER BY category ASC
    `
    const [rows] = await pool.execute(query, [universityId])
    return rows.map(row => this._parseProgram(row))
  }

  static async findById(id) {
    const query = `SELECT * FROM programs WHERE id = ?`
    const [rows] = await pool.execute(query, [id])
    return rows[0] ? this._parseProgram(rows[0]) : null
  }

  static async findByCategory(category) {
    const query = `
      SELECT p.*, u.name as universityName 
      FROM programs p
      JOIN universities u ON p.universityId = u.id
      WHERE p.category = ?
      ORDER BY p.maxCutoff ASC
    `
    const [rows] = await pool.execute(query, [category])
    return rows.map(row => this._parseProgram(row))
  }

  static async findEligible(maxAggregate) {
    const query = `
      SELECT p.*, u.name as universityName, u.location, u.region
      FROM programs p
      JOIN universities u ON p.universityId = u.id
      WHERE p.maxCutoff >= ?
      ORDER BY p.maxCutoff ASC
    `
    const [rows] = await pool.execute(query, [maxAggregate])
    return rows.map(row => this._parseProgram(row))
  }

  static async update(id, programData) {
    const {
      name,
      category,
      maxCutoff,
      requiredSubjects,
      gradeRequirements,
      tuition,
      scholarshipAvailable
    } = programData

    const query = `
      UPDATE programs 
      SET name = ?, category = ?, maxCutoff = ?, requiredSubjects = ?, 
          gradeRequirements = ?, tuition = ?, scholarshipAvailable = ?
      WHERE id = ?
    `
    await pool.execute(query, [
      name,
      category,
      maxCutoff,
      JSON.stringify(requiredSubjects),
      JSON.stringify(gradeRequirements),
      tuition,
      scholarshipAvailable ? 1 : 0,
      id
    ])
  }

  static async delete(id) {
    const query = `DELETE FROM programs WHERE id = ?`
    await pool.execute(query, [id])
  }

  static _parseProgram(row) {
    return {
      ...row,
      requiredSubjects: JSON.parse(row.requiredSubjects || '[]'),
      gradeRequirements: JSON.parse(row.gradeRequirements || '[]'),
      scholarshipAvailable: row.scholarshipAvailable === 1
    }
  }
}

module.exports = Program
