import {
  logRequestMiddleware,
  logErrorRequestMiddleware,
} from '#common/middlewares/index.js';
import { createRestApiServer, dbServer } from '#core/servers/index.js';
import { ENV } from '#core/constants/env.constants.js';
import { listingApi } from '#pods/listing/index.js';
import { securityApi } from '#pods/security/index.js';

const app = createRestApiServer();

app.use(logRequestMiddleware);

app.use('/api/listings', listingApi);
app.use('/api/security', securityApi);

app.use(logErrorRequestMiddleware);

if (!ENV.IS_API_MOCK) {
  await dbServer.connect(ENV.MONGODB_URL as string);
  console.log('Running DataBase');
} else {
  console.log('Running Mock API');
}

app.listen(ENV.PORT, () => {
  console.log(`Server ready at port ${ENV.PORT}`);
});
