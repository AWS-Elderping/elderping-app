-- 19_audit_events.sql
-- Create audit_events table and indexes for enterprise-grade audit logging platform

CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(255),
    actor_email VARCHAR(255),
    actor_role VARCHAR(100),
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    resource_id VARCHAR(255),
    metadata JSONB,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_actor_id
    ON audit_events(actor_id);

CREATE INDEX IF NOT EXISTS idx_audit_action
    ON audit_events(action);

CREATE INDEX IF NOT EXISTS idx_audit_resource
    ON audit_events(resource);

CREATE INDEX IF NOT EXISTS idx_audit_created_at
    ON audit_events(created_at DESC);
