import request from 'supertest';
import { app } from '../index';
import {
  PrismaClient,
  Role,
  SkillLevel,
  VerificationStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

afterEach(async () => {
  await prisma.artisanProfile.deleteMany({});
  await prisma.user.deleteMany({});
});

describe('GET /api/artisans', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return filtered artisans based on location and skills', async () => {
    const artisan = await prisma.artisanProfile.create({
      data: {
        location: 'Lagos',
        category: 'Electrician',
        available: true,
        skillLevel: SkillLevel.MASTER,
        hourlyRate: 25.0,
        user: {
          create: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            passwordHash: 'hashed_password',
            role: Role.ARTISAN,
            verificationStatus: VerificationStatus.PENDING,
          },
        },
      },
    });

    const res = await request(app).get(
      `/api/artisans?location=Lagos&skills=Electrician`
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toEqual(artisan.id);
    expect(res.body.data[0].user.name).toEqual('John Doe');
    expect(res.body.data[0].user.email).toEqual('john.doe@example.com');
  });

  it('should return all available artisans when no filters are provided', async () => {
    // Set up data in your test database
    const artisan = await prisma.artisanProfile.create({
      data: {
        location: 'Abuja',
        category: 'Plumber',
        available: true,
        skillLevel: SkillLevel.MASTER,
        hourlyRate: 25.0,
        user: {
          create: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            passwordHash: 'hashed_password',
            role: Role.ARTISAN,
            verificationStatus: VerificationStatus.PENDING,
          },
        },
      },
    });

    const res = await request(app).get('/api/artisans');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toEqual(artisan.id);
    expect(res.body.data[0].user.name).toEqual('Jane Smith');
  });
});
