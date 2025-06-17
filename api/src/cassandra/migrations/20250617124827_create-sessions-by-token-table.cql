-- Migration: create-sessions-by-token-table
-- Created at: 2025-06-17T12:48:27.386Z


CREATE TABLE IF NOT EXISTS sessions_by_token (
    project_id UUID,
    "token" TEXT,
    user_id UUID,
    type TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY ((project_id), "token")
);