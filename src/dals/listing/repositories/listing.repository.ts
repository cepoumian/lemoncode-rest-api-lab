import type { ListingDalModel } from '../listing.model.js';

export interface AddReviewDalModel {
  reviewer_name: string;
  comments: string;
  date: Date;
}

export interface UpdateListingDalModel {
  name?: string;
  description?: string;
  imageUrl?: string | null;
  amenities?: string[];
  price?: number | null;
  address?: {
    street?: string | null;
  };
}

export interface ListingRepository {
  getListingsByCountry(
    country: string,
    page: number,
    pageSize: number
  ): Promise<ListingDalModel[]>;

  getListingById(id: string): Promise<ListingDalModel | null>;

  addReview(listingId: string, review: AddReviewDalModel): Promise<boolean>;

  updateListing(id: string, update: UpdateListingDalModel): Promise<boolean>;
}
