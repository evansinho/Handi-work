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

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.portfolioItem.deleteMany();
  await prisma.artisanProfile.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Portfolio Endpoints', () => {
  describe('POST /api/portfolio', () => {
    it('should upload a portfolio item', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'test1 Doe',
          email: 'test1.doe@example.com',
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
        .post('/api/portfolio')
        .field('artisanId', artisanProfile.id)
        .field('title', 'Test Title')
        .field('description', 'Test Description');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'Test Title');
      expect(response.body).toHaveProperty('description', 'Test Description');
    });
  });

  describe('GET /api/portfolio/:artisanId', () => {
    it('should retrieve all portfolio items for an artisan', async () => {
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
      await prisma.portfolioItem.create({
        data: {
          artisanId: artisanProfile.id,
          title: 'Test Title',
          description: 'Test Description',
          imageUrl: 'test-image.jpg',
        },
      });

      const response = await request(app).get(
        `/api/portfolio/${artisanProfile.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('artisanId', artisanProfile.id);
      expect(response.body[0]).toHaveProperty('title', 'Test Title');
      expect(response.body[0]).toHaveProperty(
        'description',
        'Test Description'
      );
    });
  });

  describe('DELETE /api/portfolio/:id', () => {
    it('should delete a portfolio item', async () => {
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
      const portfolioItem = await prisma.portfolioItem.create({
        data: {
          artisanId: artisanProfile.id,
          title: 'Test Title',
          description: 'Test Description',
          imageUrl: 'test-image.jpg',
        },
      });

      const response = await request(app).delete(
        `/api/portfolio/${portfolioItem.id}`
      );

      expect(response.status).toBe(204);

      const deletedItem = await prisma.portfolioItem.findUnique({
        where: { id: portfolioItem.id },
      });
      expect(deletedItem).toBeNull();
    });
  });
});
