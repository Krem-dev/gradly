CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS universities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  region VARCHAR(100),
  website VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  universityId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  maxCutoff INT NOT NULL,
  requiredSubjects JSON,
  gradeRequirements JSON,
  tuition DECIMAL(10, 2),
  scholarshipAvailable BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (universityId) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  type VARCHAR(50),
  inputData JSON,
  result JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_programs_university ON programs(universityId);
CREATE INDEX idx_programs_cutoff ON programs(maxCutoff);
CREATE INDEX idx_conversions_user ON conversions(userId);
CREATE INDEX idx_conversions_type ON conversions(type);
