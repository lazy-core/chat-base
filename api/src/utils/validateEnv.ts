import { cleanEnv, port, str } from "envalid";

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    SECRET_KEY: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    ORIGIN: str(),
    CLIENT_URL: str(),
    API_URL: str(),
    MAIL_FROM: str(),
    DATABASE_USER: str(),
    DATABASE_PASSWORD: str(),
    DATABASE_NAME: str(),
    DATABASE_HOST: str(),
    DATABASE_DIALECT: str(),
    DATABASE_PORT: port(),
    AWS_ACCESS_KEY_ID: str(),
    AWS_SECRET_KEY_ID: str(),
    AWS_REGION: str(),
    AWS_BUCKET: str(),
    REDIS_URL: str(),
    REDIS_PORT: port(),
    REDIS_PASSWORD: str(),
  });
};
