import type { User } from '../user.model.js';

export interface UserRepository {
  getUser: (
    email: string,
    password: string
  ) => Promise<Pick<User, '_id' | 'email' | 'role'> | null>;
}
