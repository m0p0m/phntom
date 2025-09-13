const request = require('supertest');
const app = require('../server');
const CallLog = require('../models/CallLog');

const Device = require('../models/Device');

describe('Call Logs API', () => {
  let token;
  let testDeviceId;

  const callLogData = {
    phoneNumber: '555-111-2222',
    type: 'INCOMING',
    duration: 60,
    callDate: new Date().toISOString(),
  };

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
          uniqueIdentifier: 'call-log-test-device-uuid',
          deviceName: 'Call Log Test Device',
          platform: 'android',
      });
    testDeviceId = deviceRes.body._id;
  });

  describe('POST /api/devices/:deviceId/call-logs', () => {
    it('should add a new call log with a valid token', async () => {
      const res = await request(app)
        .post(`/api/devices/${testDeviceId}/call-logs`)
        .set('Authorization', `Bearer ${token}`)
        .send(callLogData);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('phoneNumber', callLogData.phoneNumber);
    });
  });

  describe('GET /api/devices/:deviceId/call-logs', () => {
    it('should get all call logs for a device', async () => {
      const res = await request(app)
        .get(`/api/devices/${testDeviceId}/call-logs`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.length).toBe(1);
    });
  });
});
