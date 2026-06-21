-- 17_user_status.sql
-- Add status column to users table with DEFAULT 'ACTIVE'

ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE';
