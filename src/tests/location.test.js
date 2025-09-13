const request = require('supertest');
const app = require('../server');
const Location = require('../models/Location');

describe('Location API', () => {
  let token;
  const testDeviceId = 'location-test-device';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;
  });

  describe('POST /api/location', () => {
    it('should not update location without a token', async () => {
      const res = await request(app)
        .post('/api/location')
        .send({
          deviceId: testDeviceId,
          latitude: 10,
          longitude: 20,
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should create a new location entry with a valid token', async () => {
      const res = await request(app)
        .post('/api/location')
        .set('Authorization', `Bearer ${token}`)
        .send({
          deviceId: testDeviceId,
          latitude: 10,
          longitude: 20,
        });
      expect(res.statusCode).toEqual(200); // Upsert returns 200 OK, not 201 Created
      expect(res.body).toHaveProperty('latitude', 10);
    });

    it('should update an existing location entry', async () => {
        const res = await request(app)
          .post('/api/location')
          .set('Authorization', `Bearer ${token}`)
          .send({
            deviceId: testDeviceId,
            latitude: 15,
            longitude: 25,
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('latitude', 15);
      });
  });

  describe('GET /api/location/:deviceId', () => {
    it('should get the latest location for a device', async () => {
      const res = await request(app)
        .get(`/api/location/${testDeviceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('deviceId', testDeviceId);
      expect(res.body).toHaveProperty('latitude', 15);
    });

    it('should return 404 for a device with no location data', async () => {
        const res = await request(app)
          .get('/api/location/non-existent-device')
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
      });
  });
});
