CREATE TABLE IF NOT EXISTS ghana_universities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  abbreviation VARCHAR(20) NOT NULL,
  type ENUM('public', 'private', 'technical') NOT NULL,
  location VARCHAR(100),
  website VARCHAR(255),
  admission_url VARCHAR(255),
  established_year INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_abbreviation (abbreviation)
);

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
);

CREATE TABLE IF NOT EXISTS shs_cutoff_points (
  id INT PRIMARY KEY AUTO_INCREMENT,
  program_id INT NOT NULL,
  academic_year VARCHAR(9) NOT NULL,
  min_aggregate DECIMAL(4,2) NOT NULL,
  max_aggregate DECIMAL(4,2),
  required_subjects JSON,
  special_requirements TEXT,
  data_source VARCHAR(100),
  scrape_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  last_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  INDEX idx_program_year (program_id, academic_year),
  INDEX idx_aggregate (min_aggregate),
  UNIQUE KEY unique_program_year (program_id, academic_year)
);

CREATE TABLE IF NOT EXISTS scraper_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  university_id INT,
  scraper_name VARCHAR(100) NOT NULL,
  status ENUM('success', 'failed', 'partial') NOT NULL,
  records_scraped INT DEFAULT 0,
  records_updated INT DEFAULT 0,
  records_new INT DEFAULT 0,
  error_message TEXT,
  execution_time_ms INT,
  scrape_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES ghana_universities(id) ON DELETE SET NULL,
  INDEX idx_timestamp (scrape_timestamp),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS data_quality_issues (
  id INT PRIMARY KEY AUTO_INCREMENT,
  university_id INT,
  program_id INT,
  issue_type ENUM('missing_data', 'invalid_aggregate', 'duplicate', 'anomaly', 'selector_failed') NOT NULL,
  description TEXT,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  is_resolved BOOLEAN DEFAULT FALSE,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES ghana_universities(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  INDEX idx_unresolved (is_resolved, severity)
);
