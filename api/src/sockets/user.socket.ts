import { Server, Socket } from 'socket.io';
import Container from 'typedi';
import redis from '../config/redis.config';

export class UserSocketHandler {
  public io: Server;
  public socket: Socket;
  public profile: any;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
    this.profile = (socket.request as any)?.profile;
    this.connected();
    this.initialize();
  }

  public initialize() {
    this.socket.on('connection', this.connected);
    this.socket.on('disconnect', this.disconnected);
  }

  private connected = async () => {
    try {
      this.socket.join(this?.profile?.id?.toString());
      console.log(`Socket connected ${this?.socket?.id}`);

      redis.set(`lazychat:online_socket_profile:${this?.profile?.id}`, this?.socket.id);
      redis.set(`lazychat:socket_to_user:${this?.socket.id}`, this?.profile?.id);

      this.socket.broadcast.emit('user_online', {
        profileId: this?.profile?.id,
        isOnline: true,
      });
    } catch (e) {
      console.error('Error in connected:', e);
    }
  };

  private disconnected = async () => {
    redis.del(`lazychat:online_socket_profile:${this?.profile?.id}`);
    redis.del(`lazychat:socket_to_user:${this?.socket.id}`);

    console.log(`Socket disconnected ${this?.socket?.id}`);

    this.socket.broadcast.emit('user_online', {
      profileId: this?.profile?.id,
      isOnline: false,
    });

    await this.updateLastSeen();
  };

  private async updateLastSeen() {
    try {
      const redisKey = `lazychat:last_seen:${this.profile.id}`;
      const lastSeenFromRedis = await redis.get(redisKey);

      const now = new Date();
      const nowTimestamp = now.getTime();

      if (!lastSeenFromRedis) {
        // await Profiles.update({ lastSeen: now }, { where: { id: this.profile.id } });
        await redis.set(redisKey, nowTimestamp);
        console.info(`Set lastSeen for profile ${this?.profile?.id} to ${now}`);
        return;
      }

      const lastSeenTimestamp = parseInt(lastSeenFromRedis);

      if (nowTimestamp - lastSeenTimestamp > 5 * 60 * 1000) {
        // await Profiles.update({ lastSeen: now }, { where: { id: this.profile.id } });
        await redis.set(redisKey, nowTimestamp);
        console.info(`Updated lastSeen for profile ${this?.profile?.id}`);
      } else {
        console.info(`Skipped lastSeen update for profile ${this?.profile?.id} (updated recently)`);
      }
    } catch (e) {
      console.error('Failed to update lastSeen:', e);
    }
  }
}
