import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { seedListings, seedUsers } from '../../../config/test/seed.config.js';

import { createTestApp } from '../../../config/test/test-app.js';
import { loginAndGetCookie } from '../../../config/test/auth.helpers.js';

describe('Listing protected endpoints (integration)', () => {
  const app = createTestApp();

  beforeEach(async () => {
    await seedUsers();
    await seedListings();
  });

  it('PUT /api/listings/:id returns 401 without auth cookie', async () => {
    const id = '65097600a74000a4a4a22686';

    const res = await request(app)
      .put(`/api/listings/${id}`)
      .send({ name: 'Updated name' });

    expect(res.status).toBe(401);
  });

  it('PUT /api/listings/:id succeeds with auth cookie', async () => {
    const id = '65097600a74000a4a4a22686';
    const cookie = await loginAndGetCookie(app);

    const res = await request(app)
      .put(`/api/listings/${id}`)
      .set('Cookie', cookie)
      .send({ name: 'Updated name' });

    expect(res.status).toBe(204);
  });

  it('POST /api/listings/:id/reviews returns 401 without auth cookie', async () => {
    const id = '65097600a74000a4a4a22686';

    const res = await request(app)
      .post(`/api/listings/${id}/reviews`)
      .send({ reviewerName: 'Cesar', comments: 'Test' });

    expect(res.status).toBe(401);
  });

  it('POST /api/listings/:id/reviews succeeds with auth cookie', async () => {
    const id = '65097600a74000a4a4a22686';
    const cookie = await loginAndGetCookie(app);

    const res = await request(app)
      .post(`/api/listings/${id}/reviews`)
      .set('Cookie', cookie)
      .send({ reviewerName: 'Cesar', comments: 'Test' });

    expect([200, 201]).toContain(res.status);
  });
});
