-- Migration: create-messages-by-conversation-table
-- Created at: 2025-06-17T12:52:45.268Z

CREATE TABLE IF NOT EXISTS messages_by_conversation (
    project_id UUID,
    conversation_id UUID,
    message_id TIMEUUID,
    user_id UUID,
    text TEXT,
    attachments LIST<TEXT>,
    mentioned_users SET<UUID>,
    parent_id UUID,
    type TEXT,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP,
    PRIMARY KEY ((project_id, conversation_id), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
