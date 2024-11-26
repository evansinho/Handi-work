/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // Cleanup database after test
    await prisma.rating.deleteMany();
    await prisma.job.deleteMany();
    await prisma.clientProfile.deleteMany();
    await prisma.artisanProfile.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    await prisma.$disconnect();
  }
});

describe('Ratings API', () => {
  it('should create a new rating', async () => {
    // Create users
    const user1 = await prisma.user.create({
      data: {
        name: 'newName Doe',
        email: 'newName.doe@example.com',
        phoneNumber: '1234567890',
        passwordHash: 'securepassword',
        role: Role.ARTISAN,
        verificationStatus: VerificationStatus.PENDING,
        twoFactorEnabled: false,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'newName2 Doe',
        email: 'newName2.doe@example.com',
        phoneNumber: '1234567890',
        passwordHash: 'securepassword',
        role: Role.CLIENT,
        verificationStatus: VerificationStatus.PENDING,
        twoFactorEnabled: false,
      },
    });

    // Create artisan and client profiles
    const clientProfile = await prisma.clientProfile.create({
      data: {
        userId: user2.id,
        businessName: 'Test Business',
      },
    });

    await prisma.artisanProfile.create({
      data: {
        userId: user1.id,
        category: 'carpentry',
        skillLevel: SkillLevel.MASTER,
        hourlyRate: '20000',
      },
    });

    // Create job
    const newJob = await prisma.job.create({
      data: {
        title: 'Job Title',
        description: 'Job Description',
        client: { connect: { id: clientProfile.id } },
        category: 'Category',
        budgetMin: new Decimal('100'),
        budgetMax: new Decimal('500'),
        status: 'PENDING',
      },
    });

    // Create a rating for the job
    await prisma.rating.create({
      data: {
        jobId: newJob.id,
        fromUserId: user2.id,
        toUserId: user1.id,
        rating: 4.5,
        review: 'Great job!',
      },
    });

    // Update artisan profile with the new average rating
    await prisma.artisanProfile.update({
      where: { userId: user1.id },
      data: {
        ratingsAvg: 4.5,
      },
    });

    // Make request to the Ratings API
    const response = await request(app).post('/api/ratings').send({
      jobId: newJob.id,
      fromUserId: user2.id,
      toUserId: user1.id,
      rating: 4.5,
      review: 'Great job!',
    });

    // Check if the rating is created successfully
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(Number(response.body.rating)).toBe(4.5);
    expect(response.body.review).toBe('Great job!');
  });

  it('should fetch all ratings for a user', async () => {
    const userId = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test.user@example.com',
        phoneNumber: '1234567890',
        passwordHash: 'securepassword',
        role: Role.ARTISAN,
        verificationStatus: VerificationStatus.PENDING,
        twoFactorEnabled: false,
      },
    });

    const response = await request(app).get(`/api/ratings/${userId.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    if (response.body.length > 0) {
      response.body.forEach((rating: any) => {
        expect(rating).toHaveProperty('jobId');
        expect(rating).toHaveProperty('fromUserId');
        expect(rating).toHaveProperty('toUserId');
        expect(rating).toHaveProperty('rating');
        expect(rating).toHaveProperty('review');
      });
    }
  });
});
