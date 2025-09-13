const request = require('supertest');
const { app } = require('../server');
const InstalledApp = require('../models/InstalledApp');

describe('Installed Apps API (Refactored)', () => {
  let token;
  let testDeviceId;

  const initialApps = [
    { appName: 'App A', packageName: 'com.a.app', version: '1.0' },
    { appName: 'App B', packageName: 'com.b.app', version: '2.0' },
  ];

  const updatedApps = [
    { appName: 'App B', packageName: 'com.b.app', version: '2.1' },
    { appName: 'App C', packageName: 'com.c.app', version: '3.0' },
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

  it('should perform an initial sync and a subsequent updated sync', async () => {
    // Initial Sync
    await request(app)
      .post(`/api/devices/${testDeviceId}/apps/sync`)
      .set('Authorization', `Bearer ${token}`)
      .send({ apps: initialApps })
      .expect(200);

    let appsInDb = await InstalledApp.find({ device: testDeviceId });
    expect(appsInDb.length).toBe(2);

    // Updated Sync
    await request(app)
      .post(`/api/devices/${testDeviceId}/apps/sync`)
      .set('Authorization', `Bearer ${token}`)
      .send({ apps: updatedApps })
      .expect(200);

    appsInDb = await InstalledApp.find({ device: testDeviceId }).lean();
    expect(appsInDb.length).toBe(2);
    const packageNames = appsInDb.map(app => app.packageName);
    expect(packageNames).not.toContain('com.a.app');
    expect(packageNames).toContain('com.c.app');
  });
});
