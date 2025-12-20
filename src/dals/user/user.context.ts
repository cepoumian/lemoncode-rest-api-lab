import type { Collection } from 'mongodb';
import { dbServer } from '#core/servers/index.js';
import type { User } from './user.model.js';

export const getUserContext = (): Collection<User> => {
  if (!dbServer.db) {
    throw new Error('Database not initialized');
  }
  return dbServer.db.collection<User>('users');
};
