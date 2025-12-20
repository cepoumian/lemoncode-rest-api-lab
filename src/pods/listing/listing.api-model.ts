export interface ListingListItemApiModel {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number | null;
  priceCurrency: string | null;
  address: {
    country: string;
  };
}

export interface ReviewApiModel {
  id: string;
  date: string; // ISO string
  reviewerName: string;
  comments: string;
}

export interface ListingDetailApiModel {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  amenities: string[];
  address: {
    country: string;
    street: string | null;
  };
  reviews: ReviewApiModel[]; // últimas 5
}

export interface CreateReviewApiModel {
  reviewerName: string;
  comments: string;
}

export interface UpdateListingApiModel {
  name?: string;
  description?: string;
  imageUrl?: string | null;
  amenities?: string[];
  price?: number | null;
  address?: {
    street?: string | null;
  };
}
