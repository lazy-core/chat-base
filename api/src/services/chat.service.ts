import Container, { Service } from 'typedi';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from './notification.service';
import { CassandraConversation, CassandraMessage } from '../interfaces/cassandra.interface';
import { ConversationModel } from '../models/conversation.model';
import { MessageModel } from '../models/message.model';
import { HttpException } from '../utils/httpException';

@Service()
export class ChatService {
  private notificationService = Container.get(NotificationService);

  public async createConversation({
    projectId,
    name,
    image,
    type,
    members,
    createdBy,
    config,
  }: {
    projectId: string;
    name: string;
    image?: string;
    type: string;
    members: string[];
    createdBy: string;
    config?: any;
  }): Promise<CassandraConversation | null> {
    try {
      const conversationId = uuidv4();
      const conversation: CassandraConversation = {
        projectId,
        conversationId,
        name,
        image,
        type,
        members,
        createdBy,
        config,
        createdAt: new Date(),
      };

      await ConversationModel.create(conversation);

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new HttpException(error?.status, error?.message);
    }
  }

  public async getConversations({
    profileId,
    projectId,
    limit = 50,
    offset = 0,
  }: {
    profileId: string;
    projectId: string;
    limit?: number;
    offset?: number;
  }): Promise<CassandraConversation[]> {
    try {
      const conversations = await ConversationModel.getAllForUser(projectId, profileId);
      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw new HttpException(error?.status, error?.message);
    }
  }

  public async getConversationById({
    projectId,
    conversationId,
  }: {
    projectId: string;
    conversationId: string;
  }): Promise<CassandraConversation | null> {
    try {
      const conversation = await ConversationModel.getById(projectId, conversationId);
      return conversation;
    } catch (error) {
      console.error('Error fetching conversation by ID:', error);
      throw new HttpException(error?.status, error?.message);
    }
  }

  public async sendMessage({
    projectId,
    conversationId,
    userId,
    text,
    attachments,
    mentionedUsers,
    parentId,
    type = 'TEXT',
  }: {
    projectId: string;
    conversationId: string;
    userId: string;
    text: string;
    attachments?: string[];
    mentionedUsers?: string[];
    parentId?: string;
    type?: string;
  }): Promise<CassandraMessage> {
    try {
      const messageId = uuidv4();
      const message: CassandraMessage = {
        projectId,
        conversationId,
        messageId,
        userId,
        text,
        attachments,
        mentionedUsers,
        parentId,
        type,
        createdAt: new Date(),
      };

      await MessageModel.create(message);

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new HttpException(error?.status, error?.message);
    }
  }

  public async getMessages({
    projectId,
    conversationId,
    limit = 50,
    offset = 0,
  }: {
    projectId: string;
    conversationId: string;
    limit?: number;
    offset?: number;
  }): Promise<CassandraMessage[]> {
    try {
      const messages = await MessageModel.getByConversation(projectId, conversationId);
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new HttpException(error?.status, error?.message);
    }
  }
}
