import { Redis } from 'ioredis';
import { REDIS_URL, REDIS_PASSWORD, REDIS_PORT } from '.';

const redis = new Redis(parseInt(REDIS_PORT), REDIS_URL, {
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', err => {
  console.error(err);
});

export default redis;
