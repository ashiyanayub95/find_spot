const request = require('supertest');
const app = require('../src/app');
jest.mock('@imagekit/nodejs');

describe('Health Endpoint', () => {
  it('should return 200 and status OK', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("OK");
  });
});