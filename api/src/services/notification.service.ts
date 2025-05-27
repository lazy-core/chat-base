import Container, { Service } from 'typedi';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { Server } from 'socket.io';
import redis from '../config/redis.config';

@Service()
export class NotificationService {
  private io: Server;

  public initialize(io: Server) {
    this.io = io;
  }

  public sendSocketNotification = async (event: string, data: any, profileId: string) => {
    try {
      const userSocketId = await redis.get(`eazydate:online_socket_profile:${profileId}`);
      if (userSocketId) {
        this.io.to(userSocketId).emit(event, data);
      }
      console.info(`Notification sent to ${profileId} with event ${event}`);
    } catch (e) {
      console.error(e);
    }
  };
}
