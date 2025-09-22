const request = require('supertest');
const { createApp } = require('../server');
const Device = require('../models/Device');
const Location = require('../models/Location');

describe('Location API (Refactored)', () => {
  let app;
  beforeAll(() => {
    app = createApp();
  });
  let token;
  let testDevice;

  beforeAll(async () => {
    // Get Token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;

    // Register a device
    const deviceRes = await request(app)
      .post('/api/devices/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        uniqueIdentifier: 'location-test-device-uuid',
        deviceName: 'Location Test Device',
        platform: 'android',
      });
    testDevice = deviceRes.body;
  });

  describe('Location Routes', () => {
    it('should create a new location entry for a device', async () => {
      const res = await request(app)
        .post(`/api/devices/${testDevice._id}/location`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          latitude: 10,
          longitude: 20,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('latitude', 10);
      expect(res.body).toHaveProperty('device', testDevice._id);
    });

    it('should get the latest location for a device', async () => {
      const res = await request(app)
        .get(`/api/devices/${testDevice._id}/location`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('device', testDevice._id);
      expect(res.body).toHaveProperty('latitude', 10);
    });
  });
});
