-- Migration: create-participants-by-conversation-table
-- Created at: 2025-06-17T12:51:32.083Z

CREATE TABLE IF NOT EXISTS participants_by_conversation (
    project_id UUID,
    conversation_id UUID,
    user_id UUID,
    joined_at TIMESTAMP,
    role TEXT,
    PRIMARY KEY ((project_id, conversation_id), user_id)
);
