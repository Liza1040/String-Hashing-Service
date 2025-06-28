DROP TABLE audit_logs;
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR,
    operation VARCHAR NOT NULL,
    meta JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
