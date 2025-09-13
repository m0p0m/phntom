const request = require('supertest');
const app = require('../server');
const File = require('../models/File');

const Device = require('../models/Device');

describe('Files API', () => {
  let token;
  let fileId;
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

  describe('POST /api/devices/:deviceId/files', () => {
    it('should add new file metadata with a valid token', async () => {
      const res = await request(app)
        .post(`/api/devices/${testDeviceId}/files`)
        .set('Authorization', `Bearer ${token}`)
        .send(fileData);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('fileName', fileData.fileName);
      fileId = res.body._id; // Save for later tests
    });
  });

  describe('GET /api/devices/:deviceId/files', () => {
    it('should get file metadata for a device', async () => {
      const res = await request(app)
        .get(`/api/devices/${testDeviceId}/files`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].fileName).toBe(fileData.fileName);
    });
  });

  describe('DELETE /api/files/:id', () => { // This route is not nested, it uses the global file _id
    it('should delete file metadata', async () => {
      const res = await request(app)
        .delete(`/api/files/${fileId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'File metadata removed');
    });

    it('should return 404 for a deleted file', async () => {
        const res = await request(app)
          .delete(`/api/files/${fileId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
      });
  });

  describe('POST /api/devices/:deviceId/files/upload', () => {
    it('should upload a file and create metadata', async () => {
      const res = await request(app)
        .post(`/api/devices/${testDeviceId}/files/upload`)
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('this is a test file'), 'test-upload.txt');

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'File uploaded successfully');
      expect(res.body.file).toHaveProperty('fileName', 'test-upload.txt');
    });
  });
});
