import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './config/logger';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const corsOrigins = env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',');
app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static Uploads Directory
app.use('/uploads', express.static(path.resolve(process.cwd(), env.STORAGE_LOCAL_DIR)));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Rate Limiter for general APIs
app.use(env.API_PREFIX, apiRateLimiter);

// API Documentation (Swagger UI)
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Brihaspathi Technologies Product Intelligence & OEM Platform API',
    version: '3.0.0',
    description: 'Enterprise REST API specification for AI-powered product development, tender homologation, and hardware intelligence.'
  },
  servers: [{ url: `http://localhost:${env.PORT}${env.API_PREFIX}`, description: 'Local Development Server' }],
  paths: {
    '/health': { get: { summary: 'System Health & Telemetry Status', responses: { '200': { description: 'Healthy system status' } } } },
    '/auth/login': { post: { summary: 'User Authentication & JWT Token Issuance', responses: { '200': { description: 'Access and refresh tokens' } } } },
    '/products': { get: { summary: 'List Products with pagination and filters', responses: { '200': { description: 'Product list' } } } },
    '/tenders': { get: { summary: 'List Tender Intelligence Dossiers', responses: { '200': { description: 'Tender list' } } } },
    '/vendors': { get: { summary: 'List OEM Vendors and partners', responses: { '200': { description: 'Vendor directory' } } } },
    '/analytics/overview': { get: { summary: 'Get aggregated executive analytics metrics', responses: { '200': { description: 'Metrics payload' } } } },
    '/ai/chat': { post: { summary: 'Multi-Agent AI Orchestrator Query', responses: { '200': { description: 'Grounded AI response' } } } }
  }
};

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount Primary API Router
app.use(env.API_PREFIX, apiRouter);

// Fallback 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
