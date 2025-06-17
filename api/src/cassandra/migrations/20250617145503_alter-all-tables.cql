-- Migration: alter-all-tables
-- Created at: 2025-06-17T14:55:03.245Z

-- Migration: convert project_id UUID -> TEXT across all tables
-- Date: 2025-06-17


CREATE TYPE IF NOT EXISTS typing_indicators_udt (
    enabled BOOLEAN
);

CREATE TYPE IF NOT EXISTS read_receipts_udt (
    enabled BOOLEAN
);

CREATE TYPE IF NOT EXISTS privacy_settings_udt (
    typing_indicators FROZEN<typing_indicators_udt>,
    read_receipts FROZEN<read_receipts_udt>
);

CREATE TYPE IF NOT EXISTS conversation_config_udt (
    settings MAP<TEXT, TEXT>
);


DROP TABLE IF EXISTS users_by_project;

CREATE TABLE IF NOT EXISTS users_by_project (
    project_id TEXT,
    user_id UUID,
    user_name TEXT,
    name TEXT,
    image TEXT,
    privacy_settings FROZEN<privacy_settings_udt>,
    created_at TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);

DROP TABLE IF EXISTS sessions_by_token;

CREATE TABLE IF NOT EXISTS sessions_by_token (
    project_id TEXT,
    "token" TEXT,
    user_id UUID,
    type TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY ((project_id), "token")
);


DROP TABLE IF EXISTS conversations_by_user;

CREATE TABLE IF NOT EXISTS conversations_by_user (
    project_id TEXT,
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


DROP TABLE IF EXISTS participants_by_conversation;

CREATE TABLE IF NOT EXISTS participants_by_conversation (
    project_id TEXT,
    conversation_id UUID,
    user_id UUID,
    joined_at TIMESTAMP,
    role TEXT,
    PRIMARY KEY ((project_id, conversation_id), user_id)
);


DROP TABLE IF EXISTS conversations;

CREATE TABLE IF NOT EXISTS conversations (
    project_id TEXT,
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


DROP TABLE IF EXISTS messages_by_conversation;

CREATE TABLE IF NOT EXISTS messages_by_conversation (
    project_id TEXT,
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


DROP TABLE IF EXISTS last_message_by_conversation;

CREATE TABLE IF NOT EXISTS last_message_by_conversation (
    project_id TEXT,
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

