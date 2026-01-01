-- Migration: Create grade conversion rules tables
-- Description: Store configurable grade conversion rules in database

-- Table for grading systems
CREATE TABLE IF NOT EXISTS grading_systems (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  scale_min DECIMAL(5,2) NOT NULL,
  scale_max DECIMAL(5,2) NOT NULL,
  type ENUM('gpa', 'cgpa', 'percentage') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_country (country),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for grade boundaries (percentage to letter grade mapping)
CREATE TABLE IF NOT EXISTS grade_boundaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grading_system_id VARCHAR(50) NOT NULL,
  min_score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  us_letter_grade VARCHAR(5) NOT NULL,
  gpa_points DECIMAL(3,2) NOT NULL,
  display_order INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (grading_system_id) REFERENCES grading_systems(id) ON DELETE CASCADE,
  INDEX idx_system (grading_system_id),
  INDEX idx_active (is_active),
  UNIQUE KEY unique_system_range (grading_system_id, min_score, max_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for conversion formulas (for systems that use formulas instead of boundaries)
CREATE TABLE IF NOT EXISTS conversion_formulas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grading_system_id VARCHAR(50) NOT NULL,
  target_system VARCHAR(20) NOT NULL,
  formula_type ENUM('linear', 'direct', 'custom') NOT NULL,
  formula_expression TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (grading_system_id) REFERENCES grading_systems(id) ON DELETE CASCADE,
  INDEX idx_system (grading_system_id),
  INDEX idx_active (is_active),
  UNIQUE KEY unique_system_target (grading_system_id, target_system)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert grading systems
INSERT INTO grading_systems (id, name, country, scale_min, scale_max, type) VALUES
('ghana_gpa', 'GPA (4.0 Scale)', 'Ghana', 0, 4.0, 'gpa'),
('ghana_cwa', 'CWA (Percentage)', 'Ghana', 0, 100, 'percentage'),
('nigeria_cgpa_5', 'CGPA (5.0 Scale)', 'Nigeria', 0, 5.0, 'cgpa'),
('nigeria_cgpa_4', 'CGPA (4.0 Scale)', 'Nigeria', 0, 4.0, 'cgpa');

-- Insert grade boundaries for Ghana CWA (Scholaro method)
INSERT INTO grade_boundaries (grading_system_id, min_score, max_score, us_letter_grade, gpa_points, display_order) VALUES
('ghana_cwa', 80, 100, 'A', 4.0, 1),
('ghana_cwa', 75, 79.99, 'A-', 3.7, 2),
('ghana_cwa', 70, 74.99, 'B+', 3.3, 3),
('ghana_cwa', 65, 69.99, 'B', 3.0, 4),
('ghana_cwa', 60, 64.99, 'B-', 2.7, 5),
('ghana_cwa', 55, 59.99, 'C+', 2.3, 6),
('ghana_cwa', 50, 54.99, 'C', 2.0, 7),
('ghana_cwa', 0, 49.99, 'F', 0.0, 8);

-- Insert conversion formulas for systems that use formulas
INSERT INTO conversion_formulas (grading_system_id, target_system, formula_type, formula_expression, description) VALUES
('ghana_gpa', 'usa_gpa', 'direct', 'score', 'Direct mapping - Ghana 4.0 scale equals USA 4.0 scale'),
('ghana_gpa', 'uk_percentage', 'linear', '(score / 4.0) * 100', 'Convert 4.0 GPA to percentage'),
('nigeria_cgpa_5', 'usa_gpa', 'linear', '(score / 5.0) * 4.0', 'Convert 5.0 CGPA to 4.0 GPA'),
('nigeria_cgpa_5', 'uk_percentage', 'linear', '(score / 5.0) * 100', 'Convert 5.0 CGPA to percentage'),
('nigeria_cgpa_4', 'usa_gpa', 'direct', 'score', 'Direct mapping - Nigeria 4.0 scale equals USA 4.0 scale'),
('nigeria_cgpa_4', 'uk_percentage', 'linear', '(score / 4.0) * 100', 'Convert 4.0 CGPA to percentage');

-- Add comments
ALTER TABLE grading_systems COMMENT = 'Stores all supported grading systems with their scales';
ALTER TABLE grade_boundaries COMMENT = 'Stores grade boundaries for percentage-based conversions (Scholaro method)';
ALTER TABLE conversion_formulas COMMENT = 'Stores conversion formulas for GPA/CGPA systems';
