import request from 'supertest';
import { expect } from 'vitest';

export const loginAndGetCookie = async (app: any) => {
  const res = await request(app)
    .post('/api/security/login')
    .send({ email: 'admin@email.com', password: 'admin' });

  expect(res.status).toBe(204);

  const cookie = res.headers['set-cookie'];
  expect(cookie).toBeTruthy();

  return cookie;
};
