export interface ConversationConfig {
  settings: Record<string, string>;
}

export interface CassandraConversation {
  projectId: string;
  conversationId: string;
  name: string;
  image: string;
  type: string;
  members: string[];
  createdBy: string;
  config: ConversationConfig;
  createdAt: Date;
}

export interface CassandraMessage {
  projectId: string;
  conversationId: string;
  messageId: string;
  userId: string;
  text: string;
  attachments: string[];
  mentionedUsers: string[];
  parentId?: string;
  type: string;
  deletedAt?: Date;
  createdAt: Date;
}

export interface TypingIndicators {
  enabled: boolean;
}

export interface ReadReceipts {
  enabled: boolean;
}

export interface PrivacySettings {
  typing_indicators: TypingIndicators;
  read_receipts: ReadReceipts;
}

export interface CassandraUser {
  projectId: string;
  userId: string;
  username: string;
  name: string;
  image: string;
  privacySettings: PrivacySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface CassandraSession {
  projectId: string;
  token: string;
  userId: string;
  type: 'access' | 'refresh';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
