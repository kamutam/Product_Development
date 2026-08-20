import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { ProductController } from '../controllers/productController';
import { TenderController } from '../controllers/tenderController';
import {
  VendorController,
  CompetitorController,
  ResearchController,
  AnalyticsController,
  AIController,
  SearchController,
  HealthController
} from '../controllers/additionalControllers';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// 1. System Health
router.get('/health', HealthController.check);

// 2. Authentication
router.post('/auth/register', authRateLimiter, AuthController.register);
router.post('/auth/login', authRateLimiter, AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/me', requireAuth, AuthController.getMe);

// 3. Products, Ideas & Roadmaps
router.get('/products', ProductController.list);
router.get('/products/ideas', ProductController.listIdeas);
router.post('/products/ideas', requireAuth, ProductController.createIdea);
router.get('/products/roadmaps', ProductController.listRoadmaps);
router.get('/products/:id', ProductController.getById);
router.post('/products', requireAuth, ProductController.create);
router.put('/products/:id', requireAuth, ProductController.update);
router.delete('/products/:id', requireAuth, ProductController.delete);

// 4. Tender Intelligence
router.get('/tenders', TenderController.list);
router.get('/tenders/:id', TenderController.getById);
router.post('/tenders', requireAuth, TenderController.create);
router.post('/tenders/:id/analyze', requireAuth, TenderController.analyze);
router.post('/tenders/:id/search', TenderController.search);

// 5. Vendor & OEM Management
router.get('/vendors', VendorController.list);
router.get('/vendors/emails', VendorController.listEmails);
router.get('/vendors/:id', VendorController.getById);
router.post('/vendors', requireAuth, VendorController.create);
router.post('/vendors/email', requireAuth, VendorController.recordEmail);

// 6. Competitor Intelligence
router.get('/competitors', CompetitorController.list);
router.get('/competitors/:id', CompetitorController.getById);
router.post('/competitors', requireAuth, CompetitorController.create);

// 7. Market Research & Trends
router.get('/markets', ResearchController.listMarkets);
router.get('/markets/opportunities', ResearchController.listOpportunities);
router.get('/markets/trends', ResearchController.listTrends);

// 8. Analytics & Telemetry (/analytics & /analytics3)
router.get('/analytics/overview', AnalyticsController.getOverview);
router.get('/analytics/products', AnalyticsController.getOverview);
router.get('/analytics/tenders', AnalyticsController.getOverview);
router.get('/analytics/vendors', AnalyticsController.getOverview);

// 9. AI Orchestrator & Chat Assistant
router.post('/ai/chat', AIController.chat);

// 10. Global Search (Ctrl + K)
router.get('/search', SearchController.globalSearch);

export default router;
