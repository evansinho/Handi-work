import request from 'supertest';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { app } from '../index';
import { createTestUser } from '../utils/testUtils';

const prisma = new PrismaClient();

describe('POST /login', () => {
  let testUser: User;

  beforeAll(async () => {
    // Set up a user for testing
    testUser = await createTestUser();
  });

  afterAll(async () => {
    // Clean up: delete test user from the database after tests
    await prisma.user.delete({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: testUser.email,
        password: 'testPassword123', // Assuming this was the password used during registration
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('should return 400 for invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: testUser.email,
        password: 'wrongPassword', // Invalid password
      })
      .expect(400);

    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should return 400 if email is not found', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'nonexistentuser@example.com',
        password: 'anyPassword',
      })
      .expect(400);

    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should return 400 if email or password is missing', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: '', // Missing email
        password: 'testPassword123',
      })
      .expect(400);

    expect(response.body.message).toBe('Email and password are required');
  });

  it('should return 400 if password is missing', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: testUser.email,
        password: '', // Missing password
      })
      .expect(400);

    expect(response.body.message).toBe('Email and password are required');
  });
});
