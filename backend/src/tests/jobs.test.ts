import request from 'supertest';
import { PrismaClient, Role, VerificationStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../index';

const prisma = new PrismaClient();

describe('Jobs API', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({});
  });

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

  // Before each test, clear the database and insert sample data
  beforeAll(async () => {
    await prisma.job.deleteMany();
    await prisma.job.createMany({
      data: [
        {
          clientId: uuidv4(),
          title: 'Job Title 1',
          description: 'Job Description for Job 1',
          category: 'Web Development',
          location: 'Lagos, Nigeria',
          budgetMin: 100,
          budgetMax: 200,
          status: 'PENDING',
        },
        {
          clientId: uuidv4(),
          title: 'Job Title 2',
          description: 'Job Description for Job 2',
          category: 'Graphic Design',
          location: 'Abuja, Nigeria',
          budgetMin: 150,
          budgetMax: 250,
          status: 'ACTIVE',
        },
        {
          clientId: uuidv4(),
          title: 'Job Title 3',
          description: 'Job Description for Job 3',
          category: 'Mobile App Development',
          location: 'Port Harcourt, Nigeria',
          budgetMin: 200,
          budgetMax: 350,
          status: 'COMPLETED',
        },
        {
          clientId: uuidv4(),
          title: 'Job Title 4',
          description: 'Job Description for Job 4',
          category: 'Digital Marketing',
          location: 'Online',
          budgetMin: 120,
          budgetMax: 250,
          status: 'PENDING',
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/jobs/all', () => {
    it('should return all jobs', async () => {
      const response = await request(app)
        .get('/api/jobs/all')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
    });
  });

  describe('GET /api/jobs', () => {
    it('should return jobs filtered by status', async () => {
      const response = await request(app)
        .get('/api/jobs?status=ACTIVE')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Job Title 2');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .get('/api/jobs?status=INVALID_STATUS')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid status parameter');
    });

    it('should return all jobs if no status is provided', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Status query parameter is required');
    });
  });
});
