import pg from 'pg';
import env from './env';
const { Client } = pg;

export function createDbClient() {
  return new Client({
    user: env.POSTGRES_USER,
    port: env.POSTGRES_PORT,
    host: env.POSTGRES_HOST,
    database: env.POSTGRES_DB
  });
};

