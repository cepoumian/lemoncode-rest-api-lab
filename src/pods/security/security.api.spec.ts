import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createRestApiServer } from '#core/servers/rest-api.server.js';
import { securityApi } from './security.api.js';
import { seedUsers } from '../../../config/test/seed.config.js';

describe('POST /api/security/login (integration)', () => {
  const app = createRestApiServer();
  app.use('/api/security', securityApi);

  beforeEach(async () => {
    await seedUsers();
  });

  it('sets authorization cookie when credentials are valid', async () => {
    const res = await request(app)
      .post('/api/security/login')
      .send({ email: 'admin@email.com', password: 'admin' });

    expect(res.status).toBe(204);

    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeTruthy();
    expect(Array.isArray(setCookie)).toBe(true);

    const cookieStr = setCookie[0];
    expect(cookieStr).toContain('authorization=Bearer%20');
    expect(cookieStr).toContain('HttpOnly');
  });

  it('returns 401 and clears cookie when credentials are invalid', async () => {
    const res = await request(app)
      .post('/api/security/login')
      .send({ email: 'admin@email.com', password: 'wrong' });

    expect(res.status).toBe(401);

    const setCookie = res.headers['set-cookie'];
    // debería mandar un Set-Cookie que expira/borrar authorization
    expect(setCookie).toBeTruthy();
    expect(setCookie[0]).toContain('authorization=');
  });
});
