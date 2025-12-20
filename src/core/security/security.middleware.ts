import type { RequestHandler } from 'express';
import { verifyToken } from './security.helpers.js';

export const aunthenticationMiddleware: RequestHandler = (req, res, next) => {
  const authCookie = req.cookies?.authorization;

  if (!authCookie || typeof authCookie !== 'string') {
    res.sendStatus(401);
    return;
  }

  const [scheme, token] = authCookie.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.sendStatus(401);
    return;
  }

  try {
    req.userSession = verifyToken(token);
    next();
  } catch {
    res.sendStatus(401);
  }
};
