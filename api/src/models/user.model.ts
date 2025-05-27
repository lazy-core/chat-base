import { cassandraClient } from '.';
import { CassandraUser } from '../interfaces/cassandra.interface';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  static async create(userData: Omit<CassandraUser, 'createdAt' | 'updatedAt'>): Promise<CassandraUser> {
    const now = new Date();

    const user: CassandraUser = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    const query = `
      INSERT INTO users_by_project (
        project_id, user_id, username, name, image, privacy_settings, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await cassandraClient.execute(query, [user.projectId, user.userId, user.username, user.name, user.image, user.privacySettings, user.createdAt]);

    return user;
  }

  static async getById(projectId: string, userId: string): Promise<CassandraUser | null> {
    const query = `
      SELECT * FROM users_by_project WHERE project_id = ? AND user_id = ?
    `;

    const result = await cassandraClient.execute(query, [projectId, userId]);
    return result.rowLength > 0 ? this.mapRowToUser(result.first()) : null;
  }

  static async updateUser(projectId: string, userId: string, updates: Partial<Pick<CassandraUser, 'username' | 'image'>>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.username) {
      fields.push('username = ?');
      values.push(updates.username);
    }

    if (updates.image) {
      fields.push('image = ?');
      values.push(updates.image);
    }

    fields.push('updated_at = ?');
    values.push(new Date());

    const query = `
      UPDATE users_by_project
      SET ${fields.join(', ')}
      WHERE project_id = ? AND user_id = ?
    `;

    values.push(projectId, userId);

    await cassandraClient.execute(query, values);
  }

  private static mapRowToUser(row: any): CassandraUser {
    return {
      projectId: row.project_id,
      userId: row.user_id,
      username: row.username,
      name: row.name,
      image: row.image,
      privacySettings: row.privacy_settings,
      createdAt: row.created_at,
      updatedAt: row.updated_at ?? row.created_at,
    };
  }
}
