import { ObjectId, Decimal128 } from 'mongodb';
import { getListingCollection } from '../listing.context.js';
import type { ListingDalModel } from '../listing.model.js';
import type { ListingRepository } from './listing.repository.js';
import type { UpdateListingDalModel } from './listing.repository.js';

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

    async updateListing(id, update: UpdateListingDalModel) {
      if (!ObjectId.isValid(id)) {
        return false;
      }

      const collection = getListingCollection();

      // Construimos $set solo con lo que venga definido
      const $set: Record<string, unknown> = {};

      if (update.name !== undefined) {
        $set.name = update.name;
      }

      if (update.description !== undefined) {
        $set.description = update.description ?? null;
      }

      if (update.amenities !== undefined) {
        $set.amenities = update.amenities ?? null;
      }

      if (update.imageUrl !== undefined) {
        $set['images.picture_url'] = update.imageUrl ?? null;
      }

      if (update.price !== undefined) {
        $set.price =
          update.price === null
            ? null
            : Decimal128.fromString(String(update.price));
      }

      if (update.address?.street !== undefined) {
        $set['address.street'] = update.address.street ?? null;
      }

      // Si no hay nada que actualizar, consideramos no-op exitoso
      if (Object.keys($set).length === 0) {
        return true;
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set }
      );

      return result.matchedCount === 1;
    },
  };
};
