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

describe('Listing API (integration)', () => {
  const app = createTestApp();

  beforeEach(async () => {
    await seedListings();
  });

  it('GET /api/listings returns a paginated list filtered by country', async () => {
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

  it('PUT /api/listings/:id updates name and persists it', async () => {
    const id = '65097600a74000a4a4a22686';

    const putRes = await request(app)
      .put(`/api/listings/${id}`)
      .send({ name: 'Updated name' });

    expect(putRes.status).toBe(204);

    const getRes = await request(app).get(`/api/listings/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toMatchObject({
      id,
      name: 'Updated name',
    });
  });

  it('PUT /api/listings/:id returns 400 when body is empty', async () => {
    const id = '65097600a74000a4a4a22686';

    const res = await request(app).put(`/api/listings/${id}`).send({});
    expect(res.status).toBe(400);
  });

  it('PUT /api/listings/:id returns 404 when listing does not exist', async () => {
    const nonExistingId = '65097600a74000a4a4a22699';

    const res = await request(app)
      .put(`/api/listings/${nonExistingId}`)
      .send({ name: "Doesn't matter" });

    expect(res.status).toBe(404);
  });

  it('PUT /api/listings/:id returns 400 when id is invalid', async () => {
    const res = await request(app)
      .put('/api/listings/not-an-object-id')
      .send({ name: 'Updated name' });

    expect(res.status).toBe(400);
  });
});
