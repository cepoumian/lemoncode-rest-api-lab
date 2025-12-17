import { beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { dbServer } from '#core/servers/db.server.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await dbServer.connect(mongoServer.getUri('airbnb'));
});

afterAll(async () => {
  await dbServer.disconnect();
  await mongoServer.stop();
});
