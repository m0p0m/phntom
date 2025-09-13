const request = require('supertest');
const { app } = require('../server');
const Device = require('../models/Device');

describe('Gallery API (Refactored)', () => {
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

  it('should add a new gallery item for a device', async () => {
    const res = await request(app)
      .post(`/api/devices/${testDeviceId}/gallery`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        imageUrl: 'http://example.com/image.jpg',
        caption: 'Test Caption',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('device', testDeviceId);
  });

  it('should get all gallery items for a device', async () => {
    const res = await request(app)
      .get(`/api/devices/${testDeviceId}/gallery`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });
});
