import { cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    API_PORT: port(),
    SECRET_KEY: str(),
    ORIGIN: str(),
    REDIS_URL: str(),
    REDIS_PORT: port(),
    REDIS_PASSWORD: str(),
  });
};
