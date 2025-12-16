import { ObjectId, Decimal128 } from 'mongodb';

import { mapListingToListItem } from './listing.mappers.js';
import type { ListingDalModel } from '#dals/listing/listing.model.js';

describe('listing.mappers - mapListingToListItem', () => {
  it('should map dal model to list item api model', () => {
    const id = new ObjectId('65097600a74000a4a4a22686');

    const listing: ListingDalModel = {
      _id: id,
      name: 'Ribeira Charming Duplex',
      images: {
        picture_url: 'https://example.com/pic.jpg',
      },
      price: Decimal128.fromString('80.00'),
      address: {
        country: 'Portugal',
        street: 'Porto, Porto, Portugal',
      },
    };

    const result = mapListingToListItem(listing);

    expect(result).toEqual({
      id: '65097600a74000a4a4a22686',
      name: 'Ribeira Charming Duplex',
      imageUrl: 'https://example.com/pic.jpg',
      price: 80,
      priceCurrency: null,
      address: {
        country: 'Portugal',
      },
    });
  });

  it('should map missing optional fields to nulls', () => {
    const listing: ListingDalModel = {
      _id: new ObjectId('65097600a74000a4a4a22686'),
      name: 'No Image / No Price',
      address: { country: 'Portugal' },
    };

    const result = mapListingToListItem(listing);

    expect(result.imageUrl).toBeNull();
    expect(result.price).toBeNull();
    expect(result.priceCurrency).toBeNull();
  });
});
