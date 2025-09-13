const request = require('supertest');
const app = require('../server');
const GalleryItem = require('../models/GalleryItem');

describe('Gallery API', () => {
  let token;
  const testDeviceId = 'gallery-test-device';

  beforeAll(async () => {
    // Get a token to use for protected routes
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;
  });

  describe('POST /api/gallery', () => {
    it('should not add a gallery item without a token', async () => {
      const res = await request(app)
        .post('/api/gallery')
        .send({
          deviceId: testDeviceId,
          imageUrl: 'http://example.com/image1.jpg',
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should add a new gallery item with a valid token', async () => {
      const res = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .send({
          deviceId: testDeviceId,
          imageUrl: 'http://example.com/image1.jpg',
          caption: 'Test Image 1',
          sourceApp: 'Camera',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('imageUrl', 'http://example.com/image1.jpg');
      expect(res.body).toHaveProperty('sourceApp', 'Camera');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .send({
          deviceId: testDeviceId,
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/gallery/:deviceId', () => {
    it('should not get items without a token', async () => {
      const res = await request(app).get(`/api/gallery/${testDeviceId}`);
      expect(res.statusCode).toEqual(401);
    });

    it('should get all gallery items for a device', async () => {
      // Add another item for testing retrieval
      await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .send({
          deviceId: testDeviceId,
          imageUrl: 'http://example.com/image2.jpg',
        });

      const res = await request(app)
        .get(`/api/gallery/${testDeviceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('sourceApp');
    });

    it('should return an empty array for a device with no items', async () => {
        const res = await request(app)
          .get('/api/gallery/non-existent-device')
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
      });
  });
});
