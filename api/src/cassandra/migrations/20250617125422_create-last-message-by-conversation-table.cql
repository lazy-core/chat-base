-- Migration: create-last-message-by-conversation-table
-- Created at: 2025-06-17T12:54:22.112Z

CREATE TABLE IF NOT EXISTS last_message_by_conversation (
  project_id UUID,
  conversation_id UUID,
  message_id UUID,
  user_id UUID,
  text TEXT,
  attachments LIST<TEXT>,
  mentioned_users LIST<UUID>,
  parent_id UUID,
  type TEXT,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP,
  PRIMARY KEY ((project_id, conversation_id))
);
