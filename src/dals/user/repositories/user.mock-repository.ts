import { ObjectId } from 'mongodb';
import type { UserRepository } from './user.repository.js';

const mockUser = {
  _id: new ObjectId('650000000000000000000001'),
  email: 'admin@email.com',
  password: 'admin',
  role: 'admin' as const,
};

export const createUserMockRepository = (): UserRepository => ({
  async getUser(email, password) {
    if (email === mockUser.email && password === mockUser.password) {
      return {
        _id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      };
    }
    return null;
  },
});
