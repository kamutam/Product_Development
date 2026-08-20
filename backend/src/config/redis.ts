import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

let redisClient: Redis | null = null;
let isRedisConnected = false;

if (env.ENABLE_BACKGROUND_JOBS) {
  try {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      logger.info('✓ Redis Cache & BullMQ Queue Gateway Connected');
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      logger.warn(`Redis connection note: ${err.message}`);
    });
  } catch (err: any) {
    logger.warn(`Redis initialization note: ${err.message}`);
  }
}

export function getRedisClient(): Redis | null {
  return redisClient;
}

export function isRedisAvailable(): boolean {
  return isRedisConnected;
}
