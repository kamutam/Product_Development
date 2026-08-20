import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/product_intelligence?schema=public';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'brihaspathi-production-jwt-super-secret-key-2026';
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'brihaspathi-production-refresh-token-super-secret-key-2026';
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('5000').transform(val => parseInt(val, 10)),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('*'),
  
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/product_intelligence?schema=public'),
  
  JWT_SECRET: z.string().default('brihaspathi-production-jwt-super-secret-key-2026'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('brihaspathi-production-refresh-token-super-secret-key-2026'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  AI_PROVIDER: z.enum(['gemini', 'openai', 'mock']).default('gemini'),
  AI_MODEL: z.string().default('gemini-2.0-flash'),
  AI_API_KEY: z.string().default(''),
  EMBEDDING_MODEL: z.string().default('text-embedding-004'),
  
  REDIS_URL: z.string().default('redis://localhost:6379'),
  ENABLE_BACKGROUND_JOBS: z.string().default('false').transform(val => val === 'true'),
  
  STORAGE_PROVIDER: z.enum(['local', 's3']).default('local'),
  STORAGE_LOCAL_DIR: z.string().default('./uploads'),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(val => parseInt(val, 10)),
  RATE_LIMIT_MAX: z.string().default('500').transform(val => parseInt(val, 10))
});

export const env = envSchema.parse(process.env);
