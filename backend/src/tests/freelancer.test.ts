// Import necessary modules
import request from 'supertest';
import { app } from '../index';
import {
  PrismaClient,
  Role,
  SkillLevel,
  VerificationStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

afterAll(async () => {
  try {
    await prisma.freelancerProfile.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    await prisma.$disconnect();
  }
});

// Test suite
describe('Freelancer Profile Endpoints', () => {
  let adminToken: string;
  beforeAll(async () => {
    const adminResponse = await request(app).post('/api/register').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      password: 'securepassword',
      role: Role.ADMIN,
      verificationStatus: VerificationStatus.PENDING,
      twoFactorEnabled: false,
    });
    adminToken = adminResponse.body.token;
    jest.clearAllMocks();
  });

  describe('POST /api/freelancer-profile/approve/:userId', () => {
    it('should approve the freelancer profile when admin', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'test Doe',
          email: 'test.doe@example.com',
          phoneNumber: '1234567890',
          passwordHash: 'securepassword',
          role: Role.FREELANCER,
          verificationStatus: VerificationStatus.PENDING,
          twoFactorEnabled: false,
        },
      });
      // Create the freelancer profile with the given userId
      await prisma.freelancerProfile.create({
        data: {
          userId: newUser.id,
          category: 'carpentry',
          skillLevel: SkillLevel.MASTER,
          hourlyRate: '20000',
        },
      });
      const response = await request(app)
        .post(`/api/freelancer-profile/approve/${newUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Freelancer profile approved');
    });
  });

  describe('POST /api/freelancer-profile/reject/:userId', () => {
    it('should reject the freelancer profile when admin', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'test2 Doe',
          email: 'test2.doe@example.com',
          phoneNumber: '1234567890',
          passwordHash: 'securepassword',
          role: Role.FREELANCER,
          verificationStatus: VerificationStatus.PENDING,
          twoFactorEnabled: false,
        },
      });
      // Create the freelancer profile with the given userId
      await prisma.freelancerProfile.create({
        data: {
          userId: newUser.id,
          category: 'carpentry',
          skillLevel: SkillLevel.MASTER,
          hourlyRate: '20000',
        },
      });
      const response = await request(app)
        .post(`/api/freelancer-profile/reject/${newUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Freelancer profile rejected');
    });
  });
});
