import { verifyHash } from '#common/helpers/hash.helpers.js';
import { getUserContext } from '../user.context.js';
import type { UserRepository } from './user.repository.js';

export const createUserMongoRepository = (): UserRepository => ({
  async getUser(email, password) {
    const user = await getUserContext().findOne({ email });

    if (!user) {
      return null;
    }

    const isValid = await verifyHash(password, user.password);

    if (!isValid) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
  },
});
