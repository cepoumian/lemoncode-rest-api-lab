import jwt from 'jsonwebtoken';
import { ENV } from '#core/constants/env.constants.js';
import type { UserSession } from '#core/models/index.js';

export const verifyToken = (token: string): UserSession => {
  if (!ENV.AUTH_SECRET) {
    throw new Error('AUTH_SECRET not configured');
  }

  const payload = jwt.verify(token, ENV.AUTH_SECRET);
  return payload as UserSession;
};
