import type { ObjectId, Decimal128 } from 'mongodb';

export interface ListingDalModel {
  _id: ObjectId;
  name: string;
  images?: {
    picture_url?: string;
    thumbnail_url?: string;
    medium_url?: string;
    xl_picture_url?: string;
  };
  price?: Decimal128;
  address: {
    country: string;
    street?: string;
  };
  amenities?: string[];
  description?: string;
  reviews?: Array<{
    _id: string;
    date: Date;
    reviewer_name: string;
    comments: string;
  }>;
}
