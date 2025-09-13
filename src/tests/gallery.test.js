const request = require('supertest');
const app = require('../server');
const GalleryItem = require('../models/GalleryItem');

const Device = require('../models/Device');

describe('Gallery API', () => {
  let token;
  let testDeviceId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;

    const deviceRes = await request(app)
        .post('/api/devices/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
            uniqueIdentifier: 'gallery-test-device-uuid',
            deviceName: 'Gallery Test Device',
            platform: 'android',
        });
    testDeviceId = deviceRes.body._id;
  });

  describe('POST /api/devices/:deviceId/gallery', () => {
    it('should add a new gallery item with a valid token', async () => {
      const res = await request(app)
        .post(`/api/devices/${testDeviceId}/gallery`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          imageUrl: 'http://example.com/image1.jpg',
          caption: 'Test Image 1',
          sourceApp: 'Camera',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('imageUrl', 'http://example.com/image1.jpg');
      expect(res.body).toHaveProperty('sourceApp', 'Camera');
    });
  });

  describe('GET /api/devices/:deviceId/gallery', () => {
    it('should get all gallery items for a device', async () => {
      const res = await request(app)
        .get(`/api/devices/${testDeviceId}/gallery`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.length).toBe(1);
    });
  });
});
