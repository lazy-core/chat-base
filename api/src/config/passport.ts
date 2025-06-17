import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { SECRET_KEY } from './../config';
import { DataStoredInUserSession, UserSessionTypes } from '../types/auth.types';
import { Passport } from 'passport';
import { SessionModel } from '../models/session.model';
import { UserModel } from '../models/user.model';

export const userPassport = new Passport();

const userJwtOptions = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const userJwtVerify = async (payload: DataStoredInUserSession, done) => {
  try {
    if (payload.type !== UserSessionTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    const user = await UserModel.getById(payload?.projectId, payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const userJwtStrategy = new JwtStrategy(userJwtOptions, userJwtVerify);
