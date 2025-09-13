const request = require('supertest');
const { app, server } = require('../server');
const Device = require('../models/Device');
const { io: clientIO } = require('socket.io-client');

describe('Devices API & Sockets', () => {
  let token;
  let clientSocket;
  const testDeviceIdentifier = 'test-device-for-sockets';

  // Connect a socket client before all tests
  beforeAll((done) => {
    const port = server.address().port;
    clientSocket = clientIO(`http://localhost:${port}`);

    const loginAndGetToken = async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
          });
        token = res.body.token;
      };

    clientSocket.on('connect', async () => {
        await loginAndGetToken();
        done();
    });
  });

  // Disconnect the socket client after all tests
  afterAll(() => {
    clientSocket.close();
  });

  const deviceData = {
    uniqueIdentifier: testDeviceIdentifier,
    deviceName: 'Test Socket Device',
    platform: 'android',
    storage: { total: 64, free: 32 },
    ram: { total: 4, free: 2 },
  };

  describe('Device Registration and Real-time Events', () => {
    it('should register a new device and emit a "device:registered" event', (done) => {
      // Listen for the event
      clientSocket.on('device:registered', (device) => {
        expect(device).toHaveProperty('uniqueIdentifier', testDeviceIdentifier);
        done();
      });

      // Trigger the action
      request(app)
        .post('/api/devices/register')
        .set('Authorization', `Bearer ${token}`)
        .send(deviceData)
        .expect(201);
    });
  });

  describe('Device Heartbeat and Real-time Events', () => {
    it('should receive a heartbeat and emit a "device:status_update" event', (done) => {
        // Listen for the event
        clientSocket.on('device:status_update', (device) => {
          expect(device).toHaveProperty('uniqueIdentifier', testDeviceIdentifier);
          expect(device.ram.free).toBe(1.5);
          done();
        });

        // Trigger the action
        request(app)
          .post('/api/devices/heartbeat')
          .set('Authorization', `Bearer ${token}`)
          .send({
            uniqueIdentifier: testDeviceIdentifier,
            ram: { free: 1.5 }
          })
          .expect(200);
      });
  });

  describe('GET /api/devices', () => {
    it('should return a list of all devices', async () => {
        const res = await request(app)
            .get('/api/devices')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('status'); // Check for virtual property
    });
  });
});
