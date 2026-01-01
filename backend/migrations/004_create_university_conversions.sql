-- Migration: Create university_conversions table
-- Description: Store university grade conversions for Ghana/Nigeria to USA/UK

CREATE TABLE IF NOT EXISTS university_conversions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  source_system VARCHAR(50) NOT NULL,
  source_score DECIMAL(5,2) NOT NULL CHECK (source_score >= 0 AND source_score <= 100),
  usa_gpa DECIMAL(4,2) NOT NULL CHECK (usa_gpa >= 0 AND usa_gpa <= 4.0),
  uk_percentage DECIMAL(5,2) NOT NULL CHECK (uk_percentage >= 0 AND uk_percentage <= 100),
  target_system VARCHAR(20) NOT NULL,
  courses JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_source_system (source_system),
  INDEX idx_target_system (target_system),
  INDEX idx_user_created (user_id, created_at),
  
  CONSTRAINT fk_user_conversions 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments for documentation
ALTER TABLE university_conversions 
  COMMENT = 'Stores university grade conversions from Ghana/Nigeria to USA/UK systems';

-- Sample data for testing (optional)
-- INSERT INTO university_conversions (user_id, source_system, source_score, usa_gpa, uk_percentage, target_system, courses)
-- VALUES (1, 'ghana_cwa', 85.00, 3.40, 85.00, 'usa_gpa', '[]');
