import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';
import speakeasy from 'speakeasy';

const prisma = new PrismaClient();

describe('2FA Verification Tests', () => {
  let userId: string;
  let secret: string;

  beforeAll(async () => {
    // Create a test user and set up 2FA for them
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser2@example.com',
        passwordHash: 'hashed_password', // Use a real hash here if needed
        role: 'CLIENT',
        verificationStatus: 'VERIFIED',
        twoFactorEnabled: false,
      },
    });
    userId = user.id;

    // Generate and store a TOTP secret for the user
    const generatedSecret = speakeasy.generateSecret({ length: 20 });
    secret = generatedSecret.base32;

    // Update the user with the secret and enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: true,
      },
    });
  });

  afterAll(async () => {
    // Clean up the test database
    await prisma.user.deleteMany();
  });

  test('should verify valid 2FA code', async () => {
    // Generate a valid TOTP token
    const token = speakeasy.totp({ secret, encoding: 'base32' });

    const response = await request(app)
      .post('/api/2fa/verify')
      .send({ userId, token })
      .expect(200);

    expect(response.body.message).toBe('2FA code verified successfully');
  });

  test('should return error for invalid 2FA code', async () => {
    const invalidToken = '123456'; // A random invalid code

    const response = await request(app)
      .post('/api/2fa/verify')
      .send({ userId, token: invalidToken })
      .expect(400);

    expect(response.body.message).toBe('Invalid 2FA code');
  });

  test('should return error if 2FA is not set up', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Another User',
        email: 'anotheruser@example.com',
        passwordHash: 'hashed_password',
        role: 'CLIENT',
        verificationStatus: 'VERIFIED',
        twoFactorEnabled: false, // 2FA is not enabled
      },
    });

    const response = await request(app)
      .post('/api/2fa/verify')
      .send({ userId: user.id, token: '123456' })
      .expect(400);

    expect(response.body.message).toBe('2FA not set up for this user');
  });
});
