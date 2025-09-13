const request = require('supertest');
const { app } = require('../server');
const Device = require('../models/Device');

describe('Files API (Refactored)', () => {
  let token;
  let testDeviceId;
  let fileId;

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
        uniqueIdentifier: 'files-test-device-uuid',
        deviceName: 'Files Test Device',
        platform: 'android',
      });
    testDeviceId = deviceRes.body._id;
  });

  const fileData = {
    fileName: 'test-file.txt',
    filePath: '/data/test-file.txt',
    fileType: 'text/plain',
    size: 1024,
    storageUrl: 'http://example.com/storage/test-file.txt',
  };

  it('should add new file metadata for a device', async () => {
    const res = await request(app)
      .post(`/api/devices/${testDeviceId}/files`)
      .set('Authorization', `Bearer ${token}`)
      .send(fileData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('fileName', fileData.fileName);
    fileId = res.body._id;
  });

  it('should get file metadata for a device', async () => {
    const res = await request(app)
      .get(`/api/devices/${testDeviceId}/files`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
  });

  it('should upload a file and create metadata', async () => {
    const res = await request(app)
      .post(`/api/devices/${testDeviceId}/files/upload`)
      .set('Authorization', `Bearer ${token}`)
      .field('filePath', '/data/on-device/test-upload.txt')
      .attach('file', Buffer.from('this is a test file'), 'test-upload.txt');

    expect(res.statusCode).toEqual(201);
    expect(res.body.file).toHaveProperty('fileName', 'test-upload.txt');
    expect(res.body.file).toHaveProperty('filePath', '/data/on-device/test-upload.txt');
  });

  it('should delete file metadata', async () => {
    const res = await request(app)
      .delete(`/api/files/${fileId}`) // This is a top-level route
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
