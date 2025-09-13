const request = require('supertest');
const app = require('../server');
const Contact = require('../models/Contact');

const Device = require('../models/Device');

describe('Contacts API', () => {
  let token;
  let contactId;
  let testDeviceId;

  // Before running tests, register a device and get a token
  beforeAll(async () => {
    // Get Token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;

    // Register a device to get a valid ID
    const deviceRes = await request(app)
        .post('/api/devices/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
            uniqueIdentifier: 'contact-test-device-uuid',
            deviceName: 'Contact Test Device',
            platform: 'android',
        });
    testDeviceId = deviceRes.body._id;
  });

  // Test creating a contact
  describe('POST /api/devices/:deviceId/contacts', () => {
    it('should not create a contact without a token', async () => {
      const res = await request(app)
        .post(`/api/devices/${testDeviceId}/contacts`)
        .send({
          name: 'Test User',
          phoneNumber: '111222333',
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should create a new contact with a valid token', async () => {
      const res = await request(app)
        .post(`/api/devices/${testDeviceId}/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test User',
          phoneNumber: '111222333',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Test User');
      contactId = res.body._id; // Save for later tests
    });

    it('should not create a contact with missing fields', async () => {
        const res = await request(app)
          .post(`/api/devices/${testDeviceId}/contacts`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Incomplete User',
          });
        expect(res.statusCode).toEqual(400);
      });
  });

  // Test getting contacts
  describe('GET /api/devices/:deviceId/contacts', () => {
    it('should get all contacts with paginated results', async () => {
      const res = await request(app)
        .get(`/api/devices/${testDeviceId}/contacts`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('pagination');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // Test getting a single contact
  describe('GET /api/contacts/:id', () => {
    it('should get a single contact by id', async () => {
      const res = await request(app)
        .get(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', contactId);
    });

    it('should return 404 for a non-existent contact', async () => {
        const nonExistentId = '60d5f1b4e6b3f1a1b8f3a3a1'; // A valid but non-existent ObjectId
        const res = await request(app)
          .get(`/api/contacts/${nonExistentId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
      });
  });

  // Test updating a contact
  describe('PUT /api/contacts/:id', () => {
    it('should update a contact', async () => {
      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Test User' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Updated Test User');
    });
  });

  // Test deleting a contact
  describe('DELETE /api/contacts/:id', () => {
    it('should delete a contact', async () => {
      const res = await request(app)
        .delete(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Contact removed');
    });

    it('should return 404 after deleting', async () => {
        const res = await request(app)
          .get(`/api/contacts/${contactId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
      });
  });
});
