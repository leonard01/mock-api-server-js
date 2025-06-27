const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

let app;

// Reset mock data before each test
beforeEach(() => {
  const defaultUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];

  const mockDataDir = path.join(__dirname, '..', 'mock-data');
  if (!fs.existsSync(mockDataDir)) {
    fs.mkdirSync(mockDataDir, { recursive: true });
  }

  const filePath = path.join(mockDataDir, 'users.json');
  fs.writeFileSync(filePath, JSON.stringify(defaultUsers, null, 2), 'utf8');

  console.log('✅ Reset users.json to:', defaultUsers); // 👈 Logging here

  delete require.cache[require.resolve('../index')];
  app = require('../index');
});


describe('Users API', () => {
  describe('GET /users', () => {
    it('should return all users', async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should return a user by id query', async () => {
      const res = await request(app).get('/users?id=1');
      console.log('🧪 DELETE /users/2 response:', res.body); // Add this line
      expect(res.statusCode).toBe(200);
      expect(res.body[0].name).toBe('Alice');
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Charlie', email: 'charlie@example.com' })
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Charlie');
    });

    it('should reject short names', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'A', email: 'shortname@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/name/i);
    });

    it('should reject non-string names', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 123, email: 'badname@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/name/i);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Valid Name', email: 'not-an-email' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/email/i);
    });

    it('should reject duplicate emails', async () => {
      await request(app)
        .post('/users')
        .send({ name: 'Unique User', email: 'unique@example.com' });

      const res = await request(app)
        .post('/users')
        .send({ name: 'Copy User', email: 'unique@example.com' });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toMatch(/exists/i);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user by id', async () => {
      const res = await request(app)
        .put('/users/1')
        .send({ name: 'Updated Alice' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Alice');
    });

    it('should return 404 for updating non-existent user', async () => {
      const res = await request(app)
        .put('/users/999')
        .send({ name: 'Ghost' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });
  });

describe('DELETE /users/:id', () => {
  it('should delete a user by id', async () => {
    const res = await request(app).delete('/users/2');
    console.log('🧪 DELETE response:', res.body); // Optional for debug

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('deleted');
    expect(res.body.deleted.name).toBe('Bob');
    expect(res.body.deleted.email).toBe('bob@example.com');
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await request(app).delete('/users/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
});
