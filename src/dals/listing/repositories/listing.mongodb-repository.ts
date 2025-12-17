import { ObjectId } from 'mongodb';
import { getListingCollection } from '../listing.context.js';
import type { ListingDalModel } from '../listing.model.js';
import type { ListingRepository } from './listing.repository.js';

export const createListingMongoRepository = (): ListingRepository => {
  return {
    async getListingsByCountry(country, page, pageSize) {
      const collection = getListingCollection();

      const skip = (page - 1) * pageSize;

      const projection = {
        name: 1,
        images: { picture_url: 1 },
        price: 1,
        address: { country: 1 },
      };

      const result = await collection
        .find({ 'address.country': country }, { projection })
        .skip(skip)
        .limit(pageSize)
        .toArray();

      return result as ListingDalModel[];
    },

    async getListingById(id) {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const collection = getListingCollection();

      // Proyección: detalle + últimas 5 reviews
      const projection = {
        name: 1,
        description: 1,
        amenities: 1,
        images: { picture_url: 1 },
        address: { country: 1, street: 1 },
        reviews: { $slice: -5 },
      };

      const result = await collection.findOne(
        { _id: new ObjectId(id) },
        { projection }
      );

      return (result as ListingDalModel | null) ?? null;
    },

    async addReview(listingId, review) {
      if (!ObjectId.isValid(listingId)) {
        return false;
      }

      const collection = getListingCollection();

      const newReview = {
        _id: new ObjectId().toHexString(),
        date: review.date,
        reviewer_name: review.reviewer_name,
        comments: review.comments,
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(listingId) },
        { $push: { reviews: newReview } }
      );

      // devuelvemos un booleano para que la API pueda responder 404
      return result.matchedCount === 1;
    },
  };
};
