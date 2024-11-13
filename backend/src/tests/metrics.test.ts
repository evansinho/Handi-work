import request from 'supertest';
import { app } from '../index';
import { PrismaClient, Role, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Mock Prisma for testing (optional, depending on your setup)
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    $queryRaw: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('Metrics API', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prismaMock: any;
  let token: string;
  // Generate a token for authentication before tests run
  beforeAll(async () => {
    // Call register API to get a token (modify according to your authentication method)
    const registerResponse = await request(app).post('/api/register').send({
      name: 'test Doe',
      email: 'test.doe@example.com',
      phoneNumber: '1234567890',
      password: 'securepassword',
      role: Role.ADMIN,
      verificationStatus: VerificationStatus.PENDING,
      twoFactorEnabled: false,
    });

    token = registerResponse.body.token;
  });

  beforeAll(() => {
    prismaMock = prisma; // Store the mocked prisma
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test User Activity Metrics Endpoint
  describe('GET /api/metrics/user-activity', () => {
    it('should return user activity metrics successfully', async () => {
      // Mock the Prisma query result
      prismaMock.$queryRaw.mockResolvedValueOnce([
        {
          totalUsers: 1000,
          newSignups: 200,
          freelancerProfilesCreated: 150,
          clientProfilesCreated: 50,
          jobPosts: 300,
          proposalsSubmitted: 250,
          contractsCompleted: 100,
        },
      ]);

      const startDate = '2024-01-01';
      const endDate = '2024-12-31';

      const response = await request(app)
        .get('/api/metrics/user-activity')
        .query({ startDate, endDate })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual({
        totalUsers: '1000',
        newSignups: '200',
        freelancerProfilesCreated: '150',
        clientProfilesCreated: '50',
        jobPosts: '300',
        proposalsSubmitted: '250',
        contractsCompleted: '100',
      });
    });

    it('should return a 500 error on failure', async () => {
      prismaMock.$queryRaw.mockRejectedValueOnce(new Error('Database error'));

      const startDate = '2024-01-01';
      const endDate = '2024-12-31';

      const response = await request(app)
        .get('/api/metrics/user-activity')
        .query({ startDate, endDate })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  // Test App Performance Metrics Endpoint
  describe('GET /api/metrics/app-performance', () => {
    it('should return app performance metrics successfully', async () => {
      // Mock the Prisma query result
      prismaMock.$queryRaw.mockResolvedValueOnce([
        {
          pendingJobs: 10,
          activeJobs: 5,
          completedJobs: 3,
          disputedJobs: 2,
          pendingPayments: 8,
          paidPayments: 6,
          escrowPayments: 4,
          averageRating: 4.5,
          totalContracts: 100,
          completedContracts: 80,
          activeContracts: 20,
        },
      ]);

      const response = await request(app)
        .get('/api/metrics/app-performance')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        pendingJobs: '10',
        activeJobs: '5',
        completedJobs: '3',
        disputedJobs: '2',
        pendingPayments: '8',
        paidPayments: '6',
        escrowPayments: '4',
        averageRating: 4.5,
        totalContracts: '100',
        completedContracts: '80',
        activeContracts: '20',
      });
    });

    it('should return a 500 error on failure', async () => {
      prismaMock.$queryRaw.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/metrics/app-performance')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
