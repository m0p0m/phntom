const request = require('supertest');
const app = require('../server');
const InstalledApp = require('../models/InstalledApp');

const Device = require('../models/Device');

describe('Installed Apps API', () => {
  let token;
  let testDeviceId;

  const initialApps = [
    { appName: 'App A', packageName: 'com.a.app', version: '1.0' },
    { appName: 'App B', packageName: 'com.b.app', version: '2.0' },
  ];

  const updatedApps = [
    { appName: 'App B', packageName: 'com.b.app', version: '2.1' }, // Updated version
    { appName: 'App C', packageName: 'com.c.app', version: '3.0' }, // New app
  ];

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
            uniqueIdentifier: 'apps-test-device-uuid',
            deviceName: 'Apps Test Device',
            platform: 'android',
        });
    testDeviceId = deviceRes.body._id;
  });

  describe('POST /api/devices/:deviceId/apps/sync', () => {
    it('should perform an initial sync of apps', async () => {
      const res = await request(app)
        .post(`/api/devices/${testDeviceId}/apps/sync`)
        .set('Authorization', `Bearer ${token}`)
        .send({ apps: initialApps });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Sync successful');

      const appsInDb = await InstalledApp.find({ device: testDeviceId });
      expect(appsInDb.length).toBe(2);
    });

    it('should update the app list on a subsequent sync', async () => {
        const res = await request(app)
          .post(`/api/devices/${testDeviceId}/apps/sync`)
          .set('Authorization', `Bearer ${token}`)
          .send({ apps: updatedApps });
        expect(res.statusCode).toEqual(200);

        const appsInDb = await InstalledApp.find({ device: testDeviceId }).lean();
        expect(appsInDb.length).toBe(2);

        const packageNames = appsInDb.map(app => app.packageName);
        expect(packageNames).toContain('com.b.app');
        expect(packageNames).toContain('com.c.app');
        expect(packageNames).not.toContain('com.a.app');

        const appB = appsInDb.find(app => app.packageName === 'com.b.app');
        expect(appB.version).toBe('2.1');
      });
  });

  describe('GET /api/devices/:deviceId/apps', () => {
    it('should get the synced list of apps for a device', async () => {
      const res = await request(app)
        .get(`/api/devices/${testDeviceId}/apps`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.length).toBe(2);
    });
  });
});
