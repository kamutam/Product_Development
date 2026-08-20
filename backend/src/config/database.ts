import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' }
  ]
});

// @ts-ignore
prisma.$on('error', (e: any) => {
  logger.error(`Prisma Database Error: ${e.message}`);
});

export async function connectDatabase(): Promise<boolean> {
  try {
    await prisma.$connect();
    logger.info('✓ PostgreSQL Database Connected via Prisma');
    return true;
  } catch (error: any) {
    logger.warn(`Database connection note (using fallback state if DB offline): ${error.message}`);
    return false;
  }
}
