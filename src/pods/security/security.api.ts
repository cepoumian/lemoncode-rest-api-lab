import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '#core/constants/env.constants.js';
import type { UserSession } from '#core/models/user-session.model.js';
import { createUserRepository } from '#dals/index.js';
import type { LoginApiModel } from './security.api-model.js';

export const securityApi = Router();

securityApi.post('/login', async (req, res, next) => {
  try {
    const body = req.body as Partial<LoginApiModel>;

    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      res.status(400).send('email and password are required');
      return;
    }

    if (!ENV.AUTH_SECRET) {
      res.status(500).send('AUTH_SECRET not configured');
      return;
    }

    const userRepository = createUserRepository();
    const user = await userRepository.getUser(email, password);

    if (!user) {
      res.clearCookie('authorization');
      res.sendStatus(401);
      return;
    }

    const userSession: UserSession = {
      id: user._id.toHexString(),
      role: user.role,
    };

    const token = jwt.sign(userSession, ENV.AUTH_SECRET, {
      expiresIn: '1d',
      algorithm: 'HS256',
    });

    res.cookie('authorization', `Bearer ${token}`, {
      httpOnly: true,
      secure: ENV.IS_PRODUCTION,
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

securityApi.post('/logout', async (_req, res) => {
  res.clearCookie('authorization');
  res.sendStatus(200);
});
