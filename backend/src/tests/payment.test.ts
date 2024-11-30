/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../index';
import {
  JobStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PrismaClient,
  Role,
  SkillLevel,
  VerificationStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

describe('Payment API Endpoints', () => {
  let paymentId: string;
  let contract: any;
  let job: any;

  beforeAll(async () => {
    // Optional: Seed necessary data for related entities like jobs or contracts
    const user = await prisma.user.create({
      data: {
        email: 'artisan2@example.com',
        passwordHash: 'securepassword',
        name: 'John',
        role: Role.ARTISAN,
        verificationStatus: VerificationStatus.VERIFIED,
      },
    });
    const artisanProfile = await prisma.artisanProfile.create({
      data: {
        userId: user.id,
        bio: 'Experienced carpenter specializing in custom furniture.',
        category: 'Carpentry',
        skillLevel: SkillLevel.MASTER,
        portfolio: 'https://portfolio.example.com',
        hourlyRate: new Prisma.Decimal(25.0),
        available: true,
        location: 'Lagos, Nigeria',
      },
    });
    job = await prisma.job.create({
      data: {
        title: 'Test Job',
        category: 'Construction',
        budgetMin: 1000,
        budgetMax: 5000,
        status: JobStatus.PENDING,
        client: {
          create: {
            businessName: 'Test Business',
            user: {
              create: {
                email: 'test2user@example.com',
                name: 'Test User',
                phoneNumber: '286587698',
                passwordHash: 'securepassword',
                role: Role.CLIENT,
                verificationStatus: VerificationStatus.VERIFIED,
              },
            },
          },
        },
      },
    });

    contract = await prisma.contract.create({
      data: {
        jobId: job.id,
        artisanId: artisanProfile.id,
        agreedRate: new Prisma.Decimal(100.0),
        paymentStatus: PaymentStatus.ESCROW,
        milestoneCount: 3,
        startDate: new Date(),
        endDate: null,
      },
    });
  });

  afterAll(async () => {
    // Clean up and disconnect Prisma client
    await prisma.payment.deleteMany({});
    await prisma.contract.deleteMany({});
    await prisma.job.deleteMany({});
    await prisma.clientProfile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /payment', () => {
    it('should create a new payment', async () => {
      const paymentData = {
        jobId: job.id,
        contractId: contract.id,
        amount: 100.0,
        currency: 'USD',
        paymentMethod: PaymentMethod.CARD,
      };

      const response = await request(app)
        .post('/api/payment')
        .send(paymentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.paymentStatus).toBe('PENDING');

      // Save the created payment ID for later tests
      paymentId = response.body.id;
    });
  });

  describe('POST /api/payment/:id/process', () => {
    it('should process a payment', async () => {
      const response = await request(app).post(
        `/api/payment/${paymentId}/process`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('paymentStatus');
      expect(['PAID', 'ESCROW']).toContain(response.body.paymentStatus);
    });
  });

  describe('GET /api/payment/:id', () => {
    it('should retrieve payment details', async () => {
      const response = await request(app).get(`/api/payment/${paymentId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(paymentId);
      expect(response.body).toHaveProperty('jobId');
    });
  });
});
