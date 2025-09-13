const request = require('supertest');
const app = require('../server');
const InstalledApp = require('../models/InstalledApp');

describe('Installed Apps API', () => {
  let token;
  const testDeviceId = 'apps-test-device';

  const initialApps = [
    { appName: 'App A', packageName: 'com.a.app', version: '1.0' },
    { appName: 'App B', packageName: 'com.b.app', version: '2.0' },
  ];

  const updatedApps = [
    { appName: 'App B', packageName: 'com.b.app', version: '2.1' }, // Updated version
    { appName: 'App C', packageName: 'com.c.app', version: '3.0' }, // New app
  ];

  beforeAll(async () => {
    // Get a token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;
  });

  describe('POST /api/apps/sync', () => {
    it('should perform an initial sync of apps', async () => {
      const res = await request(app)
        .post('/api/apps/sync')
        .set('Authorization', `Bearer ${token}`)
        .send({
          deviceId: testDeviceId,
          apps: initialApps,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Sync successful');

      // Verify the apps were created
      const appsInDb = await InstalledApp.find({ deviceId: testDeviceId });
      expect(appsInDb.length).toBe(2);
    });

    it('should update the app list on a subsequent sync', async () => {
        const res = await request(app)
          .post('/api/apps/sync')
          .set('Authorization', `Bearer ${token}`)
          .send({
            deviceId: testDeviceId,
            apps: updatedApps,
          });
        expect(res.statusCode).toEqual(200);

        // Verify the sync logic
        const appsInDb = await InstalledApp.find({ deviceId: testDeviceId }).lean();
        expect(appsInDb.length).toBe(2);

        const packageNames = appsInDb.map(app => app.packageName);
        expect(packageNames).toContain('com.b.app');
        expect(packageNames).toContain('com.c.app');
        expect(packageNames).not.toContain('com.a.app'); // App A should have been deleted

        const appB = appsInDb.find(app => app.packageName === 'com.b.app');
        expect(appB.version).toBe('2.1'); // Check for updated version
      });
  });

  describe('GET /api/apps/:deviceId', () => {
    it('should get the synced list of apps for a device', async () => {
      const res = await request(app)
        .get(`/api/apps/${testDeviceId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      const packageNames = res.body.map(app => app.packageName);
      expect(packageNames).toContain('com.b.app');
      expect(packageNames).toContain('com.c.app');
    });
  });
});
