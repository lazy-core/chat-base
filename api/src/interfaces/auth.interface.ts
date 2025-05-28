import { CassandraUser } from './cassandra.interface';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: CassandraUser;
}
