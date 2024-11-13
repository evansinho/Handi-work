import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../index';
import { Role, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('User Registration Endpoint', () => {
  it('should successfully register a new user', async () => {
    const response = await request(app).post('/api/register').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      password: 'securepassword',
      role: Role.CLIENT,
      verificationStatus: VerificationStatus.PENDING,
      twoFactorEnabled: false,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'User registered successfully'
    );
    expect(response.body.user).toMatchObject({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      role: 'CLIENT',
      verificationStatus: 'PENDING',
      twoFactorEnabled: false,
    });
  });

  beforeEach(async () => {
    // Clear the test database
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 400 if email is already in use', async () => {
    const existingUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      passwordHash:
        '$2a$10$NtWW3JzyvY0kLZEh0gs3V.3nOYwl2fCeSSiqyTHLegLnoulznQC2a',
      role: Role.CLIENT,
      verificationStatus: VerificationStatus.PENDING,
      twoFactorEnabled: false,
    };

    // Create a user directly in the database
    await prisma.user.create({
      data: existingUser,
    });

    // Attempt to register a new user with the same email
    const response = await request(app).post('/api/register').send({
      name: 'Jane Doe',
      email: 'john.doe@example.com',
      phoneNumber: '0987654321',
      password: 'anotherpassword',
      role: Role.CLIENT,
      verificationStatus: VerificationStatus.PENDING,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email is already in use.');
  });

  it('should return 400 if validation fails', async () => {
    const response = await request(app).post('/api/register').send({
      name: 'John Doe',
      email: 'invalid-email', // Invalid email format
      password: '123', // Password too short
      role: 'CLIENT',
      verificationStatus: 'PENDING',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message'); // Joi validation error message
  });
});
