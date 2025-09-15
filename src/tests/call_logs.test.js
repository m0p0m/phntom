const request = require('supertest');

describe('Call Logs API (Refactored)', () => {
  let token;
  let testDeviceId;
  let app;

  beforeAll(async () => {
    app = require('../server').app;
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

  it('should add a new call log for a device', async () => {
    const res = await request(app)
      .post(`/api/devices/${testDeviceId}/call-logs`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        phoneNumber: '555-111-2222',
        type: 'INCOMING',
        duration: 60,
        callDate: new Date().toISOString(),
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('device', testDeviceId);
  });

  it('should get all call logs for a device', async () => {
    const res = await request(app)
      .get(`/api/devices/${testDeviceId}/call-logs`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });
});
