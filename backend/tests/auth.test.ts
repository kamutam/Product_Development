import request from 'supertest';
import app from '../src/app';

describe('Authentication & Protected Routes', () => {
  it('POST /api/v1/auth/login with missing fields should return 500 or validation error', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@brihaspathi.com', password: 'wrong' });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/auth/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Product Intelligence & Analytics Endpoints', () => {
  it('GET /api/v1/products should respond with items list', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/analytics/overview should return aggregated telemetry', async () => {
    const res = await request(app).get('/api/v1/analytics/overview');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.homologationHealth).toBeDefined();
  });

  it('GET /api/v1/search should return search results array', async () => {
    const res = await request(app).get('/api/v1/search?q=camera');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.results)).toBe(true);
  });
});
