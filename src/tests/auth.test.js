const request = require('supertest');
const { app } = require('../server'); // We still need app for supertest

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: process.env.ADMIN_USERNAME,
          password: process.env.ADMIN_PASSWORD,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: process.env.ADMIN_USERNAME,
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(401);
    });
  });
});
