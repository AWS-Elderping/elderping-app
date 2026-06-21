-- 18_finops_recommendations_fields.sql
-- Add persistent columns for recommendations: title, description, severity, status, applied_at, dismissed_at

ALTER TABLE finops_recommendations ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE finops_recommendations ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE finops_recommendations ADD COLUMN IF NOT EXISTS severity VARCHAR(50) DEFAULT 'MEDIUM';
ALTER TABLE finops_recommendations ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'OPEN';
ALTER TABLE finops_recommendations ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE finops_recommendations ADD COLUMN IF NOT EXISTS dismissed_at TIMESTAMP WITH TIME ZONE;

-- Add check constraint for severity values if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_finops_recs_severity'
    ) THEN
        ALTER TABLE finops_recommendations ADD CONSTRAINT chk_finops_recs_severity 
        CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'));
    END IF;
END
$$;

-- Sync existing data for compatibility
UPDATE finops_recommendations 
SET status = 'APPLIED', applied_at = CURRENT_TIMESTAMP 
WHERE is_applied = TRUE AND status = 'OPEN';
