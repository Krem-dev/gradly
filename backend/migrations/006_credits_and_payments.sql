-- Migration 006: Credits + Paystack payments
-- Adds prepaid credit balance to users, an audit log of every credit movement,
-- and a record of every Paystack transaction.

-- 1. Credit balance on users (MySQL 8 doesn't support "IF NOT EXISTS" on ADD COLUMN —
--    re-running this migration will error; that's fine, it's idempotent at the table level below).
ALTER TABLE users
  ADD COLUMN credits INT NOT NULL DEFAULT 0;

-- 2. Audit log of every credit movement (purchase, use, refund, grant)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  delta INT NOT NULL,                       -- +N for grants/purchases, -N for use
  reason ENUM('purchase', 'use', 'refund', 'grant', 'expire') NOT NULL,
  balance_after INT NOT NULL,               -- snapshot of users.credits after this txn
  reference VARCHAR(100),                   -- e.g. Paystack reference, or conversion id
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at),
  INDEX idx_reference (reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Paystack transactions
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  reference VARCHAR(100) NOT NULL UNIQUE,   -- Paystack transaction reference
  access_code VARCHAR(100),                 -- Paystack access_code (for inline resume)
  authorization_url VARCHAR(500),
  amount_pesewas INT NOT NULL,              -- amount in pesewas (smallest GHS unit)
  currency VARCHAR(3) NOT NULL DEFAULT 'GHS',
  credits_purchased INT NOT NULL,           -- how many credits this pack gives
  status ENUM('pending', 'success', 'failed', 'abandoned') NOT NULL DEFAULT 'pending',
  channel VARCHAR(50),                      -- card, mobile_money, etc. (filled on verify)
  paid_at TIMESTAMP NULL,
  raw_response JSON,                        -- full Paystack response for audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
