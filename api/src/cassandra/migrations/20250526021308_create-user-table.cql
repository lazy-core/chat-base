-- Migration: create-user-table
-- Created at: 2025-05-26T02:13:08.685Z

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


CREATE TABLE IF NOT EXISTS users_by_project (
    project_id UUID,
    user_id UUID,
    user_name TEXT,
    name TEXT,
    image TEXT,
    privacy_settings FROZEN<privacy_settings_udt>,
    created_at TIMESTAMP,
    PRIMARY KEY (project_id, user_id)
);
