import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number(),
  POSTGRES_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PORT: z.number(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  CUSTOMER_TABLE_NAME: z.string()
});

const env = envSchema.parse(process.env);

export default env;


