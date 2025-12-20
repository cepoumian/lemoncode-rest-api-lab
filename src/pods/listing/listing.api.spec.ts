import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { seedListings, seedUsers } from '../../../config/test/seed.config.js';

import { createTestApp } from '../../../config/test/test-app.js';
import { loginAndGetCookie } from '../../../config/test/auth.helpers.js';

describe('Listing API (integration)', () => {
  const app = createTestApp();

  beforeEach(async () => {
    await seedListings();
    await seedUsers();
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
    const cookie = await loginAndGetCookie(app);

    const putRes = await request(app)
      .put(`/api/listings/${id}`)
      .set('Cookie', cookie)
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
    const cookie = await loginAndGetCookie(app);

    const res = await request(app)
      .put(`/api/listings/${id}`)
      .set('Cookie', cookie)
      .send({});
    expect(res.status).toBe(400);
  });

  it('PUT /api/listings/:id returns 404 when listing does not exist', async () => {
    const nonExistingId = '65097600a74000a4a4a22699';
    const cookie = await loginAndGetCookie(app);

    const res = await request(app)
      .put(`/api/listings/${nonExistingId}`)
      .set('Cookie', cookie)
      .send({ name: "Doesn't matter" });

    expect(res.status).toBe(404);
  });

  it('PUT /api/listings/:id returns 400 when id is invalid', async () => {
    const cookie = await loginAndGetCookie(app);

    const res = await request(app)
      .put('/api/listings/not-an-object-id')
      .set('Cookie', cookie)
      .send({ name: 'Updated name' });

    expect(res.status).toBe(400);
  });
});
