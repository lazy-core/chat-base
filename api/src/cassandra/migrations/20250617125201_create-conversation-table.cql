-- Migration: create-conversation-table
-- Created at: 2025-06-17T12:52:01.967Z

CREATE TABLE IF NOT EXISTS conversations (
    project_id UUID,
    conversation_id UUID,
    name TEXT,
    image TEXT,
    type TEXT,
    members SET<UUID>,
    created_by UUID,
    config FROZEN<conversation_config_udt>,
    created_at TIMESTAMP,
    PRIMARY KEY (project_id, conversation_id)
);
