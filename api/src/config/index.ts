import { config } from 'dotenv';
import { resolve } from 'path';
const envPath = resolve(__dirname, '../../../.env');

config({ path: envPath });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const {
  NODE_ENV,
  PORT,
  API_PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  CLIENT_URL,
  API_URL,
  MAIL_FROM,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_DIALECT,
  DATABASE_PORT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY_ID,
  AWS_REGION,
  AWS_BUCKET,
  REDIS_URL,
  REDIS_PORT,
  REDIS_PASSWORD,
} = process.env;
