const mysql = require('mysql2/promise')
require('dotenv').config()

async function addUniversityIdColumn() {
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

    const [tables] = await connection.query("SHOW TABLES LIKE 'programs'")
    
    if (tables.length === 0) {
      console.log('Programs table does not exist. Creating from schema...')
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS programs (
          id INT PRIMARY KEY AUTO_INCREMENT,
          university_id INT NOT NULL,
          program_name VARCHAR(255) NOT NULL,
          program_code VARCHAR(50),
          faculty VARCHAR(100),
          department VARCHAR(100),
          duration_years INT,
          degree_type ENUM('BSc', 'BA', 'BEd', 'BTech', 'BFA', 'LLB', 'Other'),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (university_id) REFERENCES ghana_universities(id) ON DELETE CASCADE,
          INDEX idx_university (university_id),
          INDEX idx_program_name (program_name)
        )
      `
      
      await connection.query(createTableSQL)
      console.log('✓ Programs table created')
    } else {
      console.log('Programs table exists. Checking for university_id column...')
      
      const [columns] = await connection.query("SHOW COLUMNS FROM programs LIKE 'university_id'")
      
      if (columns.length === 0) {
        console.log('Adding university_id column...')
        await connection.query('ALTER TABLE programs ADD COLUMN university_id INT NOT NULL AFTER id')
        await connection.query('ALTER TABLE programs ADD FOREIGN KEY (university_id) REFERENCES ghana_universities(id) ON DELETE CASCADE')
        await connection.query('ALTER TABLE programs ADD INDEX idx_university (university_id)')
        console.log('✓ university_id column added')
      } else {
        console.log('✓ university_id column already exists')
      }
    }

    console.log('\n✓ Migration completed successfully')

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

addUniversityIdColumn()
