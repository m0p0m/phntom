const request = require('supertest');
const { createApp } = require('../server');

describe('Commands API (Refactored)', () => {
  let app;
  beforeAll(() => {
    app = createApp();
  });
  let token;
  let commandId;
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
            uniqueIdentifier: 'command-test-device-uuid',
            deviceName: 'Command Test Device',
            platform: 'android',
        });
    testDeviceId = deviceRes.body._id;
  });

  it('should queue a new command for a device', async () => {
    const res = await request(app)
      .post(`/api/devices/${testDeviceId}/commands`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'SHOW_MESSAGE',
        payload: { message: 'Hello' },
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'PENDING');
    commandId = res.body._id;
  });

  it('should fetch pending commands for a device', async () => {
    const res = await request(app)
      .get(`/api/devices/${testDeviceId}/commands/pending`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
  });

  it('should update the status of a command', async () => {
    const res = await request(app)
      .put(`/api/commands/${commandId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'EXECUTED' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'EXECUTED');
  });
});
