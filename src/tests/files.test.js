const request = require('supertest');
const { app } = require('../server');
const fs = require('fs');
const path = require('path');

describe('Files API (Refactored)', () => {
  let token;
  let testDeviceId;
  let fileId;
  let uploadedFilename;

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

  it('should upload a file and create metadata', async () => {
    const res = await request(app)
      .post(`/api/devices/${testDeviceId}/files/upload`)
      .set('Authorization', `Bearer ${token}`)
      .field('filePath', '/data/on-device/test-upload.txt')
      .attach('file', Buffer.from('this is a test file'), 'test-upload.txt');

    expect(res.statusCode).toEqual(201);
    expect(res.body.file).toHaveProperty('fileName', 'test-upload.txt');
    fileId = res.body.file._id;
    uploadedFilename = res.body.file.storageUrl.split('/').pop();
  });

  it('should get file metadata for the device', async () => {
    const res = await request(app)
      .get(`/api/devices/${testDeviceId}/files`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
  });

  it('should delete file metadata and the physical file', async () => {
    const res = await request(app)
      .delete(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);

    // Verify the file is gone from the filesystem
    const filePath = path.join(__dirname, '../../uploads', uploadedFilename);
    const fileExists = fs.existsSync(filePath);
    expect(fileExists).toBe(false);
  });
});
