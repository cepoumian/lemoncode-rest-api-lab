import { ENV } from '#core/constants/env.constants.js';
import { createUserMockRepository } from './user.mock-repository.js';
import { createUserMongoRepository } from './user.mongodb-repository.js';

export const createUserRepository = ENV.IS_API_MOCK
  ? createUserMockRepository
  : createUserMongoRepository;

export * from './user.repository.js';
