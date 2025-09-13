const request = require('supertest');
const app = require('../server');
const Contact = require('../models/Contact');

describe('Contacts API', () => {
  let token;
  let contactId;

  // Before running tests, get a valid token
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      });
    token = res.body.token;
  });

  // Test creating a contact
  describe('POST /api/contacts', () => {
    it('should not create a contact without a token', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({
          name: 'Test User',
          phoneNumber: '111222333',
          deviceId: 'test-device-1',
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should create a new contact with a valid token', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test User',
          phoneNumber: '111222333',
          deviceId: 'test-device-1',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Test User');
      contactId = res.body._id; // Save for later tests
    });

    it('should not create a contact with missing fields', async () => {
        const res = await request(app)
          .post('/api/contacts')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Incomplete User',
          });
        expect(res.statusCode).toEqual(400);
      });
  });

  // Test getting contacts
  describe('GET /api/contacts', () => {
    it('should get all contacts', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
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
