import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';

async function bootstrap() {
  logger.info('🚀 Initializing Brihaspathi Product Intelligence Platform Backend...');

  // Connect Database
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`========================================================================`);
    logger.info(`✓ Backend Server running on http://localhost:${env.PORT}`);
    logger.info(`✓ REST API Base: http://localhost:${env.PORT}${env.API_PREFIX}`);
    logger.info(`✓ Interactive OpenAPI Documentation: http://localhost:${env.PORT}/api/docs`);
    logger.info(`✓ Health Check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
    logger.info(`========================================================================`);
  });

  // Graceful Shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, () => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    });
  });
}

bootstrap().catch((err) => {
  logger.error(`Fatal Server Bootstrap Error: ${err.message}`);
  process.exit(1);
});
