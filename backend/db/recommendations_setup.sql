-- Aligns the DB with the live recommendationController queries.
-- The legacy `programs`/`universities` tables (from db/init.sql) use the old camelCase
-- schema; the controller now uses `ghana_universities` / `programs` (new shape) /
-- `shs_cutoff_points`. This script drops the legacy tables and creates the new ones,
-- then seeds enough Ghana universities + programs + cutoffs to exercise the flow.

DROP TABLE IF EXISTS data_quality_issues;
DROP TABLE IF EXISTS scraper_logs;
DROP TABLE IF EXISTS shs_cutoff_points;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS ghana_universities;
DROP TABLE IF EXISTS universities;  -- legacy

-- New universities table (snake_case, with abbreviation)
CREATE TABLE ghana_universities (
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

-- New programs table (snake_case, FK to ghana_universities)
CREATE TABLE programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  university_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,             -- recommendationController reads p.name
  faculty VARCHAR(100),
  degree_type VARCHAR(20),
  duration_years INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES ghana_universities(id) ON DELETE CASCADE,
  INDEX idx_university (university_id),
  INDEX idx_program_name (name)
);

-- Cutoff points per academic year (the controller joins this)
CREATE TABLE shs_cutoff_points (
  id INT PRIMARY KEY AUTO_INCREMENT,
  program_id INT NOT NULL,
  academic_year VARCHAR(9) NOT NULL,
  min_aggregate DECIMAL(4,2) NOT NULL,   -- lower = better
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

-- Seed: 5 major Ghana universities
INSERT INTO ghana_universities (name, abbreviation, type, location, website) VALUES
  ('Kwame Nkrumah University of Science and Technology', 'KNUST', 'public', 'Kumasi', 'https://www.knust.edu.gh'),
  ('University of Ghana', 'UG', 'public', 'Accra', 'https://www.ug.edu.gh'),
  ('University of Cape Coast', 'UCC', 'public', 'Cape Coast', 'https://ucc.edu.gh'),
  ('Ashesi University', 'Ashesi', 'private', 'Berekuso', 'https://www.ashesi.edu.gh'),
  ('University of Education, Winneba', 'UEW', 'public', 'Winneba', 'https://www.uew.edu.gh');

-- Seed: programs (id_set follows insertion order)
INSERT INTO programs (university_id, name, faculty, degree_type, duration_years) VALUES
  -- KNUST (1)
  (1, 'BSc. Computer Science', 'Physical Sciences', 'BSc', 4),
  (1, 'BSc. Computer Engineering', 'Engineering', 'BSc', 4),
  (1, 'BSc. Mechanical Engineering', 'Engineering', 'BSc', 4),
  (1, 'BSc. Architecture', 'Built Environment', 'BSc', 6),
  (1, 'BSc. Medicine', 'Health Sciences', 'BSc', 6),
  (1, 'BSc. Agriculture', 'Agriculture', 'BSc', 4),
  (1, 'BSc. Business Administration', 'Business', 'BSc', 4),
  -- UG (2)
  (2, 'BSc. Computer Science', 'Physical Sciences', 'BSc', 4),
  (2, 'LLB. Bachelor of Laws', 'Law', 'LLB', 4),
  (2, 'BSc. Economics', 'Social Sciences', 'BSc', 4),
  (2, 'BSc. Medicine', 'Medical Sciences', 'BSc', 7),
  (2, 'BA. Political Science', 'Social Sciences', 'BA', 4),
  -- UCC (3)
  (3, 'BSc. Business Administration', 'Business', 'BSc', 4),
  (3, 'BEd. Education', 'Education', 'BEd', 4),
  (3, 'BSc. Tourism Management', 'Business', 'BSc', 4),
  -- Ashesi (4)
  (4, 'BSc. Computer Science', 'Engineering', 'BSc', 4),
  (4, 'BSc. Business Administration', 'Business', 'BSc', 4),
  (4, 'BSc. Mechatronics Engineering', 'Engineering', 'BSc', 4),
  -- UEW (5)
  (5, 'BEd. Mathematics Education', 'Education', 'BEd', 4),
  (5, 'BSc. Information Technology', 'Sciences', 'BSc', 4);

-- Seed: cutoff points for 2025/2026 (lower aggregate = more competitive)
INSERT INTO shs_cutoff_points (program_id, academic_year, min_aggregate, data_source, is_verified) VALUES
  (1,  '2025/2026', 9,  'KNUST Official', TRUE),
  (2,  '2025/2026', 6,  'KNUST Official', TRUE),
  (3,  '2025/2026', 9,  'KNUST Official', TRUE),
  (4,  '2025/2026', 7,  'KNUST Official', TRUE),
  (5,  '2025/2026', 6,  'KNUST Official', TRUE),
  (6,  '2025/2026', 20, 'KNUST Official', TRUE),
  (7,  '2025/2026', 16, 'KNUST Official', TRUE),
  (8,  '2025/2026', 12, 'UG Official',    TRUE),
  (9,  '2025/2026', 9,  'UG Official',    TRUE),
  (10, '2025/2026', 14, 'UG Official',    TRUE),
  (11, '2025/2026', 7,  'UG Official',    TRUE),
  (12, '2025/2026', 18, 'UG Official',    TRUE),
  (13, '2025/2026', 22, 'UCC Official',   TRUE),
  (14, '2025/2026', 30, 'UCC Official',   TRUE),
  (15, '2025/2026', 28, 'UCC Official',   TRUE),
  (16, '2025/2026', 15, 'Ashesi Official', TRUE),
  (17, '2025/2026', 18, 'Ashesi Official', TRUE),
  (18, '2025/2026', 12, 'Ashesi Official', TRUE),
  (19, '2025/2026', 24, 'UEW Official',   TRUE),
  (20, '2025/2026', 22, 'UEW Official',   TRUE);
