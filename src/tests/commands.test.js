const request = require('supertest');
const app = require('../server');
const Command = require('../models/Command');

describe('Commands API', () => {
  let token;
  let commandId;
  const testDeviceId = 'command-test-device';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;
  });

  describe('POST /api/commands/:deviceId', () => {
    it('should queue a new command for a device', async () => {
      const res = await request(app)
        .post(`/api/commands/${testDeviceId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'SHOW_MESSAGE',
          payload: { message: 'Hello' },
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('status', 'PENDING');
      expect(res.body).toHaveProperty('type', 'SHOW_MESSAGE');
      commandId = res.body._id;
    });
  });

  describe('GET /api/commands/:deviceId/pending', () => {
    it('should fetch pending commands for a device', async () => {
      const res = await request(app)
        .get(`/api/commands/${testDeviceId}/pending`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]._id).toBe(commandId);
    });
  });

  describe('PUT /api/commands/:commandId', () => {
    it('should update the status of a command', async () => {
      const res = await request(app)
        .put(`/api/commands/${commandId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'EXECUTED' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'EXECUTED');
    });

    it('should no longer be in pending after update', async () => {
        const res = await request(app)
          .get(`/api/commands/${testDeviceId}/pending`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(0);
      });
  });
});
