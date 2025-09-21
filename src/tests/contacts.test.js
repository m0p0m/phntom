const request = require('supertest');
const { app } = require('../server');
const Device = require('../models/Device');

describe('Contacts API (Refactored)', () => {
  let token;
  let testDeviceId;
  let contactId;

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
        uniqueIdentifier: 'contact-test-device-uuid',
        deviceName: 'Contact Test Device',
        platform: 'android',
      });
    testDeviceId = deviceRes.body._id;
  });

  it('should create a contact for a device', async () => {
    const res = await request(app)
      .post(`/api/devices/${testDeviceId}/contacts`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nested Contact', phoneNumber: '123456789' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('device', testDeviceId);
    contactId = res.body._id;
  });

  it('should get all contacts for a device', async () => {
      const res = await request(app)
        .get(`/api/devices/${testDeviceId}/contacts`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

  it('should get a single contact by its ID', async () => {
    const res = await request(app)
      .get(`/api/devices/${testDeviceId}/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toBe(contactId);
  });

  it('should update a contact', async () => {
    const res = await request(app)
      .put(`/api/devices/${testDeviceId}/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Contact Name' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Contact Name');
  });

  it('should delete a contact', async () => {
    const res = await request(app)
      .delete(`/api/devices/${testDeviceId}/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);

    // Verify it's gone
    const getRes = await request(app)
      .get(`/api/devices/${testDeviceId}/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toEqual(404);
  });
});
