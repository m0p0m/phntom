const request = require('supertest');
const app = require('../server');
const File = require('../models/File');

describe('Files API', () => {
  let token;
  let fileId;
  const testDeviceId = 'files-test-device';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;
  });

  const fileData = {
    deviceId: testDeviceId,
    fileName: 'test-file.txt',
    filePath: '/data/test-file.txt',
    fileType: 'text/plain',
    size: 1024,
    storageUrl: 'http://example.com/storage/test-file.txt',
  };

  describe('POST /api/files', () => {
    it('should not add file metadata without a token', async () => {
      const res = await request(app).post('/api/files').send(fileData);
      expect(res.statusCode).toEqual(401);
    });

    it('should add new file metadata with a valid token', async () => {
      const res = await request(app)
        .post('/api/files')
        .set('Authorization', `Bearer ${token}`)
        .send(fileData);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('fileName', fileData.fileName);
      fileId = res.body._id; // Save for later tests
    });
  });

  describe('GET /api/files/:deviceId', () => {
    it('should get file metadata for a device', async () => {
      const res = await request(app)
        .get(`/api/files/${testDeviceId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].fileName).toBe(fileData.fileName);
    });

    it('should filter files by path', async () => {
        // Add another file in a different path
        await request(app)
          .post('/api/files')
          .set('Authorization', `Bearer ${token}`)
          .send({ ...fileData, fileName: 'another.txt', filePath: '/other/another.txt' });

        const res = await request(app)
          .get(`/api/files/${testDeviceId}?path=/data`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].filePath).toBe('/data/test-file.txt');
      });
  });

  describe('DELETE /api/files/:id', () => {
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
});
