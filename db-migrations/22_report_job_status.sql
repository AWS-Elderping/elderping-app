-- 22_report_job_status.sql
-- Add status and retry_count columns and make s3 columns nullable to support job recovery state machine

ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE weekly_reports ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

ALTER TABLE weekly_reports ALTER COLUMN s3_bucket DROP NOT NULL;
ALTER TABLE weekly_reports ALTER COLUMN s3_key DROP NOT NULL;

-- Update existing records that already have S3 keys to 'COMPLETED'
UPDATE weekly_reports SET status = 'COMPLETED' WHERE s3_key IS NOT NULL AND s3_bucket IS NOT NULL;
