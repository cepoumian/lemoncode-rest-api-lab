import { dbServer } from '#core/servers/db.server.js';
import { ObjectId, Decimal128 } from 'mongodb';

export const seedListings = async () => {
  const col = dbServer.db.collection('listingsAndReviews');

  await col.deleteMany({});

  await col.insertMany([
    {
      _id: new ObjectId('65097600a74000a4a4a22686'),
      name: 'Ribeira Charming Duplex',
      images: { picture_url: 'https://example.com/1.jpg' },
      price: Decimal128.fromString('80.00'),
      address: { country: 'Portugal', street: 'Porto, Porto, Portugal' },
      amenities: ['TV'],
      description: 'Fantastic duplex apartment...',
      reviews: [],
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
  ]);
};
