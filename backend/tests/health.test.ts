import request from 'supertest';
import app from '../src/app';

describe('System Health & Documentation Endpoints', () => {
  it('GET /api/v1/health should return healthy status and telemetry', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.platform).toBeDefined();
  });

  it('GET /api/docs should return Swagger HTML documentation', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Swagger UI');
  });

  it('GET /api/v1/unknown should return 404', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint-404');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
