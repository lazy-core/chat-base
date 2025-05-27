export const UserSessionTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export const TokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

export type UserSessionType = (typeof UserSessionTypes)[keyof typeof UserSessionTypes];

export type DataStoredInUserSession = {
  projectId: string;
  sub: string;
  iat: number;
  exp: number;
  type: UserSessionType;
};
