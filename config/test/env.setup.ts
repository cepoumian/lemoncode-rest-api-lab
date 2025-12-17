import { config } from 'dotenv';

config({ path: './.env.test' });

process.env.IS_API_MOCK = 'false';
process.env.CORS_ORIGIN = '*';
process.env.CORS_METHODS = 'GET,POST,PUT,DELETE';
