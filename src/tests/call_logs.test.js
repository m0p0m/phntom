const request = require('supertest');
const app = require('../server');
const CallLog = require('../models/CallLog');

describe('Call Logs API', () => {
  let token;
  const testDeviceId = 'call-log-test-device';

  const callLogData = {
    deviceId: testDeviceId,
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
  });

  describe('POST /api/call-logs', () => {
    it('should not add a call log without a token', async () => {
      const res = await request(app).post('/api/call-logs').send(callLogData);
      expect(res.statusCode).toEqual(401);
    });

    it('should add a new call log with a valid token', async () => {
      const res = await request(app)
        .post('/api/call-logs')
        .set('Authorization', `Bearer ${token}`)
        .send(callLogData);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('phoneNumber', callLogData.phoneNumber);
    });
  });

  describe('GET /api/call-logs/:deviceId', () => {
    it('should get all call logs for a device', async () => {
      // Add another log to ensure we get a list
      await request(app)
        .post('/api/call-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...callLogData, type: 'OUTGOING', phoneNumber: '555-333-4444' });

      const res = await request(app)
        .get(`/api/call-logs/${testDeviceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});
