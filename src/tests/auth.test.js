const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the app

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
      expect(res.body).toHaveProperty('message', 'Invalid username or password');
    });

    it('should return 401 for invalid username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: process.env.ADMIN_PASSWORD,
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid username or password');
    });

    it('should return 401 for missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(res.statusCode).toEqual(401);
    });
  });
});
