import { cassandraClient } from '.';
import { CassandraConversation } from '../interfaces/cassandra.interface';

export class ConversationModel {
  static async create(data: Omit<CassandraConversation, 'createdAt'>): Promise<CassandraConversation> {
    const now = new Date();
    const convo: CassandraConversation = { ...data, createdAt: now };

    const mainQuery = `
      INSERT INTO conversations (
        project_id, conversation_id, name, image, type, members, created_by, config, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await cassandraClient.execute(mainQuery, [
      convo.projectId,
      convo.conversationId,
      convo.name,
      convo.image,
      convo.type,
      convo.members,
      convo.createdBy,
      convo.config,
      convo.createdAt,
    ]);

    const convoByUserQuery = `
      INSERT INTO conversations_by_user (
        project_id, user_id, conversation_id, name, image, type, created_by, config, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertUserConvos = convo.members.map(userId => {
      return cassandraClient.execute(convoByUserQuery, [
        convo.projectId,
        userId,
        convo.conversationId,
        convo.name,
        convo.image,
        convo.type,
        convo.createdBy,
        convo.config,
        convo.createdAt,
      ]);
    });

    await Promise.all(insertUserConvos);

    return convo;
  }

  static async getAllForUser(projectId: string, memberId: string, limit = 50, offset = 0): Promise<CassandraConversation[]> {
    const query = `
      SELECT * FROM conversations_by_user
      WHERE project_id = ? AND user_id = ?
      LIMIT ?
    `;

    const result = await cassandraClient.execute(query, [projectId, memberId, limit]);
    return result.rows.map(this.mapRow);
  }

  static async getById(projectId: string, conversationId: string): Promise<CassandraConversation | null> {
    const query = `SELECT * FROM conversations WHERE project_id = ? AND conversation_id = ?`;
    const result = await cassandraClient.execute(query, [projectId, conversationId]);
    return result.rowLength > 0 ? this.mapRow(result.first()) : null;
  }

  private static mapRow(row: any): CassandraConversation {
    return {
      projectId: row.project_id,
      conversationId: row.conversation_id,
      name: row.name,
      image: row.image,
      type: row.type,
      members: row.members,
      createdBy: row.created_by,
      config: row.config,
      createdAt: row.created_at,
    };
  }
}
