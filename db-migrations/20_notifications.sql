-- 20_notifications.sql
-- Create notifications and dead letter queue tables with indexes and check constraints

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel VARCHAR(20) NOT NULL,                           -- 'EMAIL', 'SMS', 'WHATSAPP'
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',          -- 'PENDING', 'PROCESSING', 'SENT', 'FAILED', 'SKIPPED', 'CANCELLED'
    provider VARCHAR(50) NOT NULL,                          -- 'mock', 'aws'
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS notification_dead_letter_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL,
    reason TEXT,
    payload JSONB,
    failed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient);
CREATE INDEX IF NOT EXISTS idx_notifications_channel ON notifications(channel);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_dlq_failed_at ON notification_dead_letter_queue(failed_at DESC);

-- Add check constraint for valid status values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_notifications_status'
    ) THEN
        ALTER TABLE notifications ADD CONSTRAINT chk_notifications_status 
        CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'SKIPPED', 'CANCELLED'));
    END IF;
END
$$;
