import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '../config';
import httpStatus from 'http-status';
import { HttpException } from '../utils/httpException';
import { DataStoredInUserSession, UserSessionType, UserSessionTypes } from '../types/auth.types';
import { SessionModel } from '../models/session.model';
import { UserModel } from '../models/user.model';
import { CassandraSession } from '../interfaces/cassandra.interface';

type GenerateSessionBody = {
  expires?: number;
  userId: string;
  projectId?: string;
  type: UserSessionType;
};
export interface TokenObj {
  token: string;
  expires: Date;
}

@Service()
export class SessionService {
  generateSessionToken = ({ userId, expires, type, projectId }: GenerateSessionBody): string => {
    const dataStoredInToken: DataStoredInUserSession = {
      sub: userId,
      iat: Date.now(),
      projectId: projectId || '',
      exp: expires || Date.now() + 7 * 24 * 60 * 60 * 1000,
      type,
    };

    return sign(dataStoredInToken, SECRET_KEY);
  };

  public async saveSession(tokenBody: Omit<CassandraSession, 'createdAt' | 'updatedAt'>): Promise<CassandraSession> {
    try {
      const fullBody: Omit<CassandraSession, 'createdAt' | 'updatedAt'> = {
        userId: tokenBody.userId,
        projectId: tokenBody.projectId,
        token: tokenBody.token,
        type: tokenBody.type,
        expiresAt: tokenBody.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      return await SessionModel.create(fullBody);
    } catch (e) {
      console.error('saveSession error', e);
      throw e;
    }
  }

  public async verifySession(token: string, type: UserSessionType) {
    try {
      const payload = verify(token, SECRET_KEY) as DataStoredInUserSession;

      const session = await SessionModel.getByToken(payload.projectId, token);

      const isExpired = new Date(payload.exp) < new Date();
      const isTypeMismatch = session?.type !== (type as any);

      if (!session || isExpired || isTypeMismatch) {
        throw new HttpException(httpStatus.UNAUTHORIZED, 'Session not found or expired');
      }

      return session;
    } catch (error) {
      console.error('Error verifying session token', error);
      throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  }

  public async generateAuthSession(user: { userId: string; projectId: string }): Promise<{
    access: TokenObj;
    refresh: TokenObj;
  }> {
    try {
      const accessExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const accessToken = this.generateSessionToken({
        userId: user.userId,
        projectId: user.projectId,
        type: UserSessionTypes.ACCESS,
        expires: accessExpires.getTime(),
      });

      const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const refreshToken = this.generateSessionToken({
        userId: user.userId,
        projectId: user.projectId,
        type: UserSessionTypes.REFRESH,
        expires: refreshExpires.getTime(),
      });

      await this.saveSession({
        userId: user.userId,
        projectId: user.projectId,
        token: accessToken,
        type: UserSessionTypes.ACCESS,
        expiresAt: accessExpires,
      });

      await this.saveSession({
        userId: user.userId,
        projectId: user.projectId,
        token: refreshToken,
        type: UserSessionTypes.REFRESH,
        expiresAt: refreshExpires,
      });

      return {
        access: { token: accessToken, expires: accessExpires },
        refresh: { token: refreshToken, expires: refreshExpires },
      };
    } catch (e) {
      console.error('Error generating auth session', e);
      throw e;
    }
  }

  public async refreshSession(refreshToken: string): Promise<{
    accessToken: {
      token: string;
      expires: Date;
    };
  }> {
    try {
      const sessionData = await this.verifySession(refreshToken, UserSessionTypes.REFRESH);

      const user = await UserModel.getById(sessionData.projectId, sessionData.userId);

      if (!user) {
        throw new HttpException(httpStatus.UNAUTHORIZED, 'User not found');
      }

      const tokenData = await this.generateAuthSession({
        userId: sessionData.userId,
        projectId: sessionData.projectId,
      });

      return {
        accessToken: {
          token: tokenData.access.token,
          expires: tokenData.access.expires,
        },
      };
    } catch (error) {
      console.error('Error refreshing session', error);
      throw new HttpException(error?.status || 500, error?.message || 'Refresh failed');
    }
  }
}
