import Container, { Service } from 'typedi';
import httpStatus from 'http-status';
import { CassandraUser } from '../interfaces/cassandra.interface';
import { UserModel } from '../models/user.model';
import { HttpException } from '../utils/httpException';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { CreateUserDto } from '../dtos/chat.dto';

@Service()
export class UserService {
  private authService = Container.get(AuthService);
  private sessionService = Container.get(SessionService);

  public async createUser(keys: { apiKey: string; secretKey: string }, data: CreateUserDto): Promise<any> {
    try {
      const response = await this.authService.verifyApiKeys(keys.apiKey, keys.secretKey);

      const user = await UserModel.create({
        userId: uuidv4(),
        projectId: response?.projectId,
        username: data.username,
        name: data.name,
        image: data.image,
        privacySettings: {
          read_receipts: data.privacySettings?.read_receipts as any,
          typing_indicators: data.privacySettings?.typing_indicators as any,
        },
      });

      const token = this.sessionService.generateAuthSession({
        userId: user.userId,
        projectId: user.projectId,
      });

      return token;
    } catch (error) {
      console.error('Error creating user', error);
      throw new HttpException(error?.status, error?.message);
    }
  }

  public async getUserById(userId: string, projectId: string): Promise<CassandraUser | null> {
    try {
      return await UserModel.getById(projectId, userId);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new HttpException(error?.status, error?.message);
    }
  }

  public async updateUser(projectId: string, userId: string, updates: Partial<Pick<CassandraUser, 'username' | 'image'>>): Promise<void> {
    try {
      await UserModel.updateUser(projectId, userId, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpException(error?.status, error?.message);
    }
  }
}
