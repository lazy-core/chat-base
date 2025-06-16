import { cassandraClient } from '.';
import { v4 as uuidv4 } from 'uuid';
import { CassandraSession } from '../interfaces/cassandra.interface';

export class SessionModel {
  static async create(session: Omit<CassandraSession, 'createdAt' | 'updatedAt'>): Promise<CassandraSession> {
    const now = new Date();

    const fullSession: CassandraSession = {
      ...session,
      createdAt: now,
      updatedAt: now,
    };

    const query = `
      INSERT INTO sessions_by_token (
        project_id, token, user_id, type, expires_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await cassandraClient.execute(query, [
      fullSession.projectId,
      fullSession.token,
      fullSession.userId,
      fullSession.type,
      fullSession.expiresAt,
      fullSession.createdAt,
      fullSession.updatedAt,
    ]);

    return fullSession;
  }

  static async getByToken(projectId: string, token: string): Promise<CassandraSession | null> {
    const query = `
      SELECT * FROM sessions_by_token WHERE project_id = ? AND token = ?
    `;

    const result = await cassandraClient.execute(query, [projectId, token]);
    return result.rowLength > 0 ? this.mapRow(result.first()) : null;
  }

  private static mapRow(row: any): CassandraSession {
    return {
      projectId: row.project_id,
      token: row.token,
      userId: row.user_id,
      type: row.type,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
