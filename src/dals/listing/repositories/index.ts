export * from './listing.repository.js';

import { createListingMockRepository } from './listing.mock-repository.js';
import { createListingMongoRepository } from './listing.mongodb-repository.js';
import { ENV } from '#core/constants/env.constants.js';

export const createListingRepository = ENV.IS_API_MOCK
  ? createListingMockRepository
  : createListingMongoRepository;
