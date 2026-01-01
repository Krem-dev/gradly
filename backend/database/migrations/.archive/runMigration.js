const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

async function runMigration() {
  let connection

  try {
    console.log('Connecting to database...')
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    })

    console.log('✓ Connected to database')

    const sqlFile = path.join(__dirname, '../schema/universities.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')

    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    console.log(`\nExecuting ${statements.length} SQL statements...\n`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      try {
        await connection.query(statement)
        
        const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1]
        if (tableName) {
          console.log(`✓ Created table: ${tableName}`)
        }
      } catch (error) {
        console.error(`✗ Error executing statement ${i + 1}:`, error.message)
        console.error('Statement:', statement.substring(0, 100) + '...')
      }
    }

    console.log('\n✓ Migration completed successfully')

    const [tables] = await connection.query('SHOW TABLES')
    console.log('\nCreated tables:')
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`)
    })

  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n✓ Database connection closed')
    }
  }
}

runMigration()
