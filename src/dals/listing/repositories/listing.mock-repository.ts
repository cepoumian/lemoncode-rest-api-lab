import { ObjectId } from 'mongodb';
import type { ListingDalModel } from '../listing.model.js';
import type { ListingRepository } from './listing.repository.js';
import { mockListingList } from '../mock-data.js';

export const createListingMockRepository = (): ListingRepository => {
  // Copiamos en memoria para que tests/llamadas no muten el "seed" original
  let data: ListingDalModel[] = [...mockListingList];

  return {
    async getListingsByCountry(country, page, pageSize) {
      const filtered = data.filter((l) => l.address.country === country);

      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, filtered.length);

      return filtered.slice(startIndex, endIndex);
    },

    async getListingById(id) {
      // Soportamos ids inválidos sin explotar: devuelvemos null
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const objectId = new ObjectId(id);
      return data.find((l) => l._id.equals(objectId)) ?? null;
    },

    async addReview(listingId, review) {
      if (!ObjectId.isValid(listingId)) {
        return false;
      }
      const objectId = new ObjectId(listingId);

      const listing = data.find((l) => l._id.equals(objectId));
      if (!listing) {
        return false;
      }

      const newReview = {
        _id: new ObjectId().toHexString(),
        date: review.date,
        reviewer_name: review.reviewer_name,
        comments: review.comments,
      };
      listing.reviews = [...(listing.reviews ?? []), newReview];
      return true;
    },
  };
};
