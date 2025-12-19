import type { Collection } from 'mongodb';
import { dbServer } from '#core/servers/db.server.js';
import type { ListingDalModel } from './listing.model.js';

export const getListingContext = (): Collection<ListingDalModel> => {
  if (!dbServer.db) {
    throw new Error('Database not initialized');
  }
  return dbServer.db.collection<ListingDalModel>('listingsAndReviews');
};
