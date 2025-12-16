import type { ListingDalModel } from '../listing.model.js';

export interface AddReviewDalModel {
  reviewer_name: string;
  comments: string;
  date: Date;
}

export interface ListingRepository {
  getListingsByCountry(
    country: string,
    page: number,
    pageSize: number
  ): Promise<ListingDalModel[]>;

  getListingById(id: string): Promise<ListingDalModel | null>;

  addReview(listingId: string, review: AddReviewDalModel): Promise<void>;
}
