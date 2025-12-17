import { ObjectId, Decimal128 } from 'mongodb';
import type { ListingDalModel } from './listing.model.js';

export const mockListingList: ListingDalModel[] = [
  {
    _id: new ObjectId('65097600a74000a4a4a22686'),
    name: 'Ribeira Charming Duplex',
    images: { picture_url: 'https://example.com/1.jpg' },
    price: Decimal128.fromString('80.00'),
    address: { country: 'Portugal', street: 'Porto, Porto, Portugal' },
    amenities: ['TV', 'Wifi', 'Kitchen'],
    description: 'Fantastic duplex apartment...',
    reviews: [
      {
        _id: 'r1',
        date: new Date('2019-01-20T05:00:00.000Z'),
        reviewer_name: 'Milo',
        comments: 'Great location.',
      },
    ],
  },
  {
    _id: new ObjectId('65097600a74000a4a4a22687'),
    name: 'Lisbon Central Flat',
    images: { picture_url: 'https://example.com/2.jpg' },
    price: Decimal128.fromString('120.00'),
    address: { country: 'Portugal', street: 'Lisbon, Portugal' },
    amenities: ['Wifi'],
    description: 'Cozy flat in Lisbon...',
    reviews: [],
  },
  {
    _id: new ObjectId('65097600a74000a4a4a22688'),
    name: 'CDMX Loft',
    images: { picture_url: 'https://example.com/3.jpg' },
    price: Decimal128.fromString('55.00'),
    address: { country: 'Mexico', street: 'CDMX, Mexico' },
    amenities: ['Wifi', 'Kitchen'],
    description: 'Nice loft in CDMX...',
    reviews: [],
  },
];
