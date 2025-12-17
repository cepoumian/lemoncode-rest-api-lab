import type {
  ListingListItemApiModel,
  ListingDetailApiModel,
} from './listing.api-model.js';
import type { ListingDalModel } from '#dals/listing/listing.model.js';

export const mapListingToListItem = (
  listing: ListingDalModel
): ListingListItemApiModel => ({
  id: listing._id.toHexString(),
  name: listing.name,
  imageUrl: listing.images?.picture_url ?? null,
  price: listing.price ? Number(listing.price.toString()) : null,
  priceCurrency: null,
  address: {
    country: listing.address.country,
  },
});

export const mapListingToDetail = (
  listing: ListingDalModel
): ListingDetailApiModel => {
  const reviews = (listing.reviews ?? []).slice(-5);
  return {
    id: listing._id.toHexString(),
    name: listing.name,
    description: listing.description || null,
    imageUrl: listing.images?.picture_url ?? null,
    amenities: listing.amenities ?? [],
    address: {
      country: listing.address.country,
      street: listing.address.street || null,
    },
    reviews: reviews.map((review) => ({
      id: review._id,
      reviewerName: review.reviewer_name,
      date: review.date.toISOString(),
      comments: review.comments,
    })),
  };
};
