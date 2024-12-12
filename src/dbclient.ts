import pg from 'pg';
import env from './env';
const { Client } = pg;


export const client = new Client({
  user: env.POSTGRES_USER,
  port: env.POSTGRES_PORT,
  host: env.POSTGRES_HOST
});


