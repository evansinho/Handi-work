// Import necessary modules
import request from 'supertest';
import { app } from '../index';
import {
  PrismaClient,
  Role,
  SkillLevel,
  VerificationStatus,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

afterAll(async () => {
  try {
    await prisma.artisanProfile.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    await prisma.$disconnect();
  }
});

// Test suite
describe('Artisan Profile Endpoints', () => {
  let adminToken: string;
  let artisanToken: string;
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
    const artisanResponse = await request(app).post('/api/register').send({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phoneNumber: '1234567890',
      password: 'securepassword',
      role: Role.ARTISAN,
      verificationStatus: VerificationStatus.PENDING,
      twoFactorEnabled: false,
    });
    adminToken = adminResponse.body.token;
    artisanToken = artisanResponse.body.token;
    jest.clearAllMocks();
  });

  describe('POST /api/artisan-profile/approve/:userId', () => {
    it('should approve the artisan profile when admin', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'test Doe',
          email: 'test.doe@example.com',
          phoneNumber: '1234567890',
          passwordHash: 'securepassword',
          role: Role.ARTISAN,
          verificationStatus: VerificationStatus.PENDING,
          twoFactorEnabled: false,
        },
      });
      // Create the artisan profile with the given userId
      await prisma.artisanProfile.create({
        data: {
          userId: newUser.id,
          category: 'carpentry',
          skillLevel: SkillLevel.MASTER,
          hourlyRate: '20000',
        },
      });
      const response = await request(app)
        .post(`/api/artisan-profile/approve/${newUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Artisan profile approved');
    });
  });

  describe('POST /api/artisan-profile/reject/:userId', () => {
    it('should reject the artisan profile when admin', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'test2 Doe',
          email: 'test2.doe@example.com',
          phoneNumber: '1234567890',
          passwordHash: 'securepassword',
          role: Role.ARTISAN,
          verificationStatus: VerificationStatus.PENDING,
          twoFactorEnabled: false,
        },
      });
      // Create the artisan profile with the given userId
      await prisma.artisanProfile.create({
        data: {
          userId: newUser.id,
          category: 'carpentry',
          skillLevel: SkillLevel.MASTER,
          hourlyRate: '20000',
        },
      });
      const response = await request(app)
        .post(`/api/artisan-profile/reject/${newUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Artisan profile rejected');
    });
  });

  describe('POST /api/artisan-profile', () => {
    it('should create an artisan profile successfully', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'test3 Doe',
          email: 'test3.doe@example.com',
          phoneNumber: '1234567890',
          passwordHash: 'securepassword',
          role: Role.ARTISAN,
          verificationStatus: VerificationStatus.PENDING,
          twoFactorEnabled: false,
        },
      });
      const artisanProfile = {
        userId: newUser.id,
        bio: 'Experienced artisan specializing in carpentry and furniture design.',
        category: 'Carpentry',
        skillLevel: SkillLevel.MASTER,
        portfolio: 'https://portfolio.example.com/janedoe',
        hourlyRate: '50',
      };

      const response = await request(app)
        .post('/api/artisan-profile')
        .send(artisanProfile)
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Artisan profile created',
        artisanProfile: expect.objectContaining({
          bio: 'Experienced artisan specializing in carpentry and furniture design.',
          category: 'Carpentry',
          hourlyRate: '50',
          portfolio: 'https://portfolio.example.com/janedoe',
          skillLevel: 'MASTER',
          available: true,
          ratingsAvg: null,
          id: expect.any(String),
          userId: expect.any(String),
        }),
      });
    });

    it('should handle errors when creating an artisan profile', async () => {
      const response = await request(app)
        .post('/api/artisan-profile')
        .send({})
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to create artisan profile',
      });
    });
  });

  describe('GET /api/artisan-profile/:id', () => {
    it('should retrieve an artisan profile successfully', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'test4 Doe',
          email: 'test4.doe@example.com',
          phoneNumber: '1234567890',
          passwordHash: 'securepassword',
          role: Role.ARTISAN,
          verificationStatus: VerificationStatus.PENDING,
          twoFactorEnabled: false,
        },
      });
      const artisanProfile = await prisma.artisanProfile.create({
        data: {
          userId: newUser.id,
          bio: 'Experienced Baker.',
          category: 'Baker',
          skillLevel: SkillLevel.MASTER,
          portfolio: 'https://portfolio.example.com/janedoe',
          hourlyRate: new Decimal('50'),
        },
      });

      const response = await request(app)
        .get(`/api/artisan-profile/${artisanProfile.id}`)
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.userId).toBeDefined();
    });

    it('should return 404 if artisan profile is not found', async () => {
      const response = await request(app)
        .get('/api/artisan-profile/1e3c8884-c7e0-44a7-8c44-577c8c1e9654')
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Artisan profile not found' });
    });

    it('should handle errors when retrieving an artisan profile', async () => {
      const response = await request(app)
        .get('/api/artisan-profile/non-existent-id')
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to retrieve artisan profile',
      });
    });
  });

  describe('PUT /artisan-profile/:id', () => {
    it('should update an artisan profile successfully', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'original Doe',
          email: 'original.doe@example.com',
          phoneNumber: '1234567890',
          passwordHash: 'securepassword',
          role: Role.ARTISAN,
          verificationStatus: VerificationStatus.PENDING,
          twoFactorEnabled: false,
        },
      });
      const updateArtisanProfile = await prisma.artisanProfile.create({
        data: {
          userId: newUser.id,
          bio: 'Experienced Baker.',
          category: 'Baker',
          skillLevel: SkillLevel.MASTER,
          portfolio: 'https://portfolio.example.com/janedoe',
          hourlyRate: new Decimal('50'),
        },
      });

      const response = await request(app)
        .put(`/api/artisan-profile/${updateArtisanProfile.id}`)
        .send({
          hourlyRate: new Decimal('100'),
        })
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(200);
    });

    it('should handle errors when updating an artisan profile', async () => {
      const response = await request(app)
        .put('/artisan-profile/123')
        .send({})
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(404);
    });
  });
  describe('DELETE /artisan-profile/:id', () => {
    it('should delete an artisan profile successfully', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'test5 Doe',
          email: 'test5.doe@example.com',
          phoneNumber: '1234567890',
          passwordHash: 'securepassword',
          role: Role.ARTISAN,
          verificationStatus: VerificationStatus.PENDING,
          twoFactorEnabled: false,
        },
      });
      const artisanProfile = await prisma.artisanProfile.create({
        data: {
          userId: newUser.id,
          bio: 'Experienced Baker.',
          category: 'Baker',
          skillLevel: SkillLevel.MASTER,
          portfolio: 'https://portfolio.example.com/janedoe',
          hourlyRate: new Decimal('50'),
        },
      });
      const response = await request(app)
        .delete(`/api/artisan-profile/${artisanProfile.id}`)
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Artisan profile deleted' });
    });

    it('should handle errors when deleting an artisan profile', async () => {
      const response = await request(app)
        .delete('/api/artisan-profile/123')
        .set('Authorization', `Bearer ${artisanToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to delete artisan profile',
      });
    });
  });
});
