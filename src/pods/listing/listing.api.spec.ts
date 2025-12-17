import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createRestApiServer } from '#core/servers/rest-api.server.js';
import { listingApi } from './listing.api.js';
import { seedListings } from '../../../config/test/seed.config.js';

export const createTestApp = () => {
  const app = createRestApiServer();
  app.use('/api/listings', listingApi);
  return app;
};

describe('GET /api/listings (integration)', () => {
  const app = createTestApp();

  beforeEach(async () => {
    await seedListings();
  });

  it('returns a paginated list filtered by country', async () => {
    const res = await request(app).get(
      '/api/listings?country=Portugal&page=1&pageSize=1'
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);

    expect(res.body[0]).toMatchObject({
      id: '65097600a74000a4a4a22686',
      name: 'Ribeira Charming Duplex',
      address: { country: 'Portugal' },
    });
  });
});
