import request from 'supertest';
import { PrismaClient, User } from '@prisma/client';
import { app } from '../index';
import { createTestUser } from '../utils/testUtils';

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('POST /login', () => {
  let testUser: User;

  beforeAll(async () => {
    testUser = await createTestUser();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up: delete test user from the database after tests
    await prisma.user.delete({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: 'testPassword123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('should return 400 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: 'wrongPassword',
      })
      .expect(400);

    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should return 400 if email is not found', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'nonexistentuser@example.com',
        password: 'anyPassword',
      })
      .expect(400);

    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should return 400 if email or password is missing', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: '', // Missing email
        password: 'testPassword123',
      })
      .expect(400);

    expect(response.body.message).toBe('"email" is not allowed to be empty');
  });

  it('should return 400 if password is missing', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: '',
      })
      .expect(400);

    expect(response.body.message).toBe('"password" is not allowed to be empty');
  });
});
