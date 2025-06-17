-- Migration: create-conversations-by-user-table
-- Created at: 2025-06-17T12:49:28.083Z

CREATE TABLE IF NOT EXISTS conversations_by_user (
    project_id UUID,
    user_id UUID,
    conversation_id UUID,
    name TEXT,
    image TEXT,
    type TEXT,
    last_message TEXT,
    pinned BOOLEAN,
    muted BOOLEAN,
    created_at TIMESTAMP,
    config FROZEN<conversation_config_udt>,
    PRIMARY KEY ((project_id, user_id), created_at)
) WITH CLUSTERING ORDER BY (created_at DESC);
