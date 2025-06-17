import { cassandraClient } from '.';
import { CassandraMessage } from '../interfaces/cassandra.interface';

export class MessageModel {
  static async create(data: Omit<CassandraMessage, 'createdAt'>): Promise<CassandraMessage> {
    const now = new Date();
    const msg: CassandraMessage = { ...data, createdAt: now };

    const queryConversation = `
      INSERT INTO messages_by_conversation (
        project_id, conversation_id, message_id, user_id, text,
        attachments, mentioned_users, parent_id, type, deleted_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const queryById = `
      INSERT INTO messages_by_id (
        project_id, message_id, conversation_id, user_id, text,
        attachments, mentioned_users, parent_id, type, deleted_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const queryLastMessage = `
      INSERT INTO last_message_by_conversation (
        project_id, conversation_id, message_id, user_id, text,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    await Promise.all([
      cassandraClient.execute(queryConversation, [
        msg.projectId,
        msg.conversationId,
        msg.messageId,
        msg.userId,
        msg.text,
        msg.attachments,
        msg.mentionedUsers,
        msg.parentId || null,
        msg.type,
        msg.deletedAt || null,
        msg.createdAt,
      ]),
      cassandraClient.execute(queryById, [
        msg.projectId,
        msg.messageId,
        msg.conversationId,
        msg.userId,
        msg.text,
        msg.attachments,
        msg.mentionedUsers,
        msg.parentId || null,
        msg.type,
        msg.deletedAt || null,
        msg.createdAt,
      ]),
      cassandraClient.execute(queryLastMessage, [msg.projectId, msg.conversationId, msg.messageId, msg.userId, msg.text, msg.createdAt]),
    ]);

    return msg;
  }

  static async getByConversation(projectId: string, conversationId: string): Promise<CassandraMessage[]> {
    const query = `
      SELECT * FROM messages_by_conversation WHERE project_id = ? AND conversation_id = ?
    `;
    const result = await cassandraClient.execute(query, [projectId, conversationId]);
    return result.rows.map(this.mapRow);
  }

  static async getById(projectId: string, messageId: string): Promise<CassandraMessage | null> {
    const query = `
      SELECT * FROM messages_by_id WHERE project_id = ? AND message_id = ?
    `;
    const result = await cassandraClient.execute(query, [projectId, messageId]);
    return result.rowLength > 0 ? this.mapRow(result.first()) : null;
  }

  private static mapRow(row: any): CassandraMessage {
    return {
      projectId: row.project_id,
      conversationId: row.conversation_id,
      messageId: row.message_id,
      userId: row.user_id,
      text: row.text,
      attachments: row.attachments,
      mentionedUsers: row.mentioned_users,
      parentId: row.parent_id,
      type: row.type,
      deletedAt: row.deleted_at ?? undefined,
      createdAt: row.created_at,
    };
  }
}
