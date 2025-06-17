import { Server, Socket } from 'socket.io';
import Container from 'typedi';
import { ChatService } from '../services/chat.service';
import redis from '../config/redis.config';

export class ChatSocketHandler {
  public io: Server;
  public socket: Socket;
  public profile: any;
  public projectId: string;
  public _chatService = Container.get(ChatService);

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
    this.profile = (socket.request as any)?.user;
    this.projectId = (socket.request as any)?.projectId;
    this.initialize();
  }

  public initialize() {
    this.socket.on('sendMessage', this.onMessage);
    this.socket.on('typing', this.onTyping);
  }

  private onMessage = async (data: any) => {
    try {
      console.log('Message data:', data);
      console.log('Profile:', this?.profile);

      const senderId = this?.profile?.id;
      const receiverId = data?.receiverId;

      console.log(`Sender ID: ${senderId}`);

      console.log(`Receiver ID: ${receiverId}`);

      if (!senderId || !receiverId) {
        this.socket.emit('error', { message: 'Sender or receiver not valid' });
        return;
      }

      const receiverSocketId = await redis.get(`lazychat:online_socket_profile:${receiverId}`);

      console.log(`Receiver socket ID for newMessage: ${receiverSocketId}`);

      const message = await this._chatService.sendMessage({
        conversationId: data?.conversationId,
        text: data?.text,
        userId: senderId,
        projectId: this.projectId,
        attachments: data?.attachments,
        mentionedUsers: data?.mentionedUsers,
        parentId: data?.parentId,
        type: data?.type,
      });

      this.socket.emit('messageSent', {
        message: { ...message, tempIdFromClient: data?.tempIdFromClient },
      });

      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit('newMessage', {
          message: { ...message, tempIdFromClient: data?.tempIdFromClient },
        });
      }
      console.info(`Message sent from ${senderId} to ${receiverId}`);
    } catch (e) {
      console.error(e);
    }
  };

  private onTyping = async data => {
    try {
      const senderId = this.profile?.id;
      const receiverId = data.receiverId;

      if (!senderId || !receiverId) {
        console.error('Sender or receiver not valid');
        this.socket.emit('error', { message: 'Sender or receiver not valid' });
        return;
      }

      const receiverSocketId = await redis.get(`lazychat:online_socket_profile:${receiverId}`);

      console.log(`Receiver socket ID for typing: ${receiverSocketId}`);

      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit('typing', {
          senderId,
          conversationId: data.conversationId,
        });
      }

      console.info(`Typing event sent from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error(error);
    }
  };
}
