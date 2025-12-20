import type { UserSession } from '#core/models/index.ts';

declare global {
  namespace Express {
    interface Request {
      userSession?: UserSession;
    }
  }
}

export {};
