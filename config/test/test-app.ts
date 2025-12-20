import { createRestApiServer } from '#core/servers/rest-api.server.js';
import { listingApi } from '#pods/listing/index.js';
import { securityApi } from '#pods/security/index.js';

export const createTestApp = () => {
  const app = createRestApiServer();
  app.use('/api/listings', listingApi);
  app.use('/api/security', securityApi);
  return app;
};
