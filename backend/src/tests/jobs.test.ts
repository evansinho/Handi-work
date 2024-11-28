import request from 'supertest';
import { PrismaClient, Role, VerificationStatus } from '@prisma/client';
import { app } from '../index';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.message.deleteMany({});
  await prisma.job.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.user.deleteMany();
  jest.clearAllMocks();
});

afterAll(async () => {
  try {
    await prisma.message.deleteMany({});
    await prisma.clientProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.job.deleteMany();
  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    await prisma.$disconnect();
  }
});

describe('Jobs API', () => {
  let token: string;
  beforeAll(async () => {
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
    const user = await prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        passwordHash: 'hashedpassword',
        role: 'CLIENT',
        verificationStatus: 'VERIFIED',
      },
    });
    // Seed sample clients
    const client = await prisma.clientProfile.create({
      data: {
        userId: user.id,
        businessName: 'Sample Client',
      },
    });
    await prisma.job.createMany({
      data: [
        {
          clientId: client.id,
          title: 'Job Title 1',
          description: 'Job Description for Job 1',
          category: 'Web Development',
          location: 'Lagos, Nigeria',
          budgetMin: 100,
          budgetMax: 200,
          status: 'PENDING',
        },
        {
          clientId: client.id,
          title: 'Job Title 2',
          description: 'Job Description for Job 2',
          category: 'Graphic Design',
          location: 'Abuja, Nigeria',
          budgetMin: 150,
          budgetMax: 250,
          status: 'ACTIVE',
        },
        {
          clientId: client.id,
          title: 'Job Title 3',
          description: 'Job Description for Job 3',
          category: 'Mobile App Development',
          location: 'Port Harcourt, Nigeria',
          budgetMin: 200,
          budgetMax: 350,
          status: 'COMPLETED',
        },
        {
          clientId: client.id,
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

  it('should return all jobs', async () => {
    const response = await request(app)
      .get('/api/jobs/all')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
  });

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

describe('Client Jobs API', () => {
  let token: string;
  let clientId: string;
  let anotherClientId: string;

  beforeAll(async () => {
    const registerResponse = await request(app).post('/api/register').send({
      name: 'test1 Doe',
      email: 'test1.doe@example.com',
      phoneNumber: '1234567890',
      password: 'securepassword',
      role: Role.CLIENT,
      verificationStatus: VerificationStatus.PENDING,
      twoFactorEnabled: false,
    });

    token = registerResponse.body.token;

    const user = await prisma.user.create({
      data: {
        name: 'Jane Johnson',
        email: 'jane.johnson@example.com',
        passwordHash: 'hashedpassword',
        role: 'CLIENT',
        verificationStatus: 'VERIFIED',
      },
    });

    const anotherUser = await prisma.user.create({
      data: {
        name: 'sino Johnson',
        email: 'sino.johnson@example.com',
        passwordHash: 'hashedpassword',
        role: 'CLIENT',
        verificationStatus: 'VERIFIED',
      },
    });

    const client = await prisma.clientProfile.create({
      data: {
        userId: user.id,
        businessName: 'Sample Client',
      },
    });

    const anotherClient = await prisma.clientProfile.create({
      data: {
        userId: anotherUser.id,
        businessName: 'Sample Client',
      },
    });

    clientId = client.id;
    anotherClientId = anotherClient.id;
  });

  beforeEach(async () => {
    await prisma.job.deleteMany();
  });

  it('should post a new job', async () => {
    const newJob = {
      clientId,
      title: 'New Job Title',
      description: 'New Job Description',
      category: 'Web Development',
      budgetMin: 500,
      budgetMax: 1000,
      location: 'Remote',
    };

    const response = await request(app)
      .post('/api/job')
      .set('Authorization', `Bearer ${token}`)
      .send(newJob);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newJob.title);
    expect(response.body.description).toBe(newJob.description);
    expect(response.body.status).toBe('PENDING');
  });

  it('should retrieve all jobs created by a client', async () => {
    await prisma.job.create({
      data: {
        clientId,
        title: 'Existing Job Title',
        description: 'Existing Job Description',
        category: 'Mobile App Development',
        budgetMin: 300,
        budgetMax: 500,
        status: 'PENDING',
        location: 'Lagos, Nigeria',
      },
    });

    const response = await request(app)
      .get(`/api/jobs/${clientId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe('Existing Job Title');
  });

  it('should update an existing job', async () => {
    const job = await prisma.job.create({
      data: {
        clientId,
        title: 'Job to Update',
        description: 'Job Description',
        category: 'Graphic Design',
        budgetMin: 100,
        budgetMax: 200,
        location: 'Online',
        status: 'PENDING',
      },
    });

    const updatedJob = {
      clientId,
      title: 'Updated Job Title',
      description: 'Updated Description',
      category: 'UI/UX Design',
      location: 'Remote',
      budgetMin: 200,
      budgetMax: 400,
      status: 'ACTIVE',
    };

    const response = await request(app)
      .put(`/api/jobs/${job.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedJob);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedJob.title);
    expect(response.body.status).toBe(updatedJob.status);
  });

  it('should return 400 for missing fields on update', async () => {
    const job = await prisma.job.create({
      data: {
        clientId,
        title: 'Job to Update',
        description: 'Job Description',
        category: 'Graphic Design',
        budgetMin: 100,
        budgetMax: 200,
        status: 'PENDING',
        location: 'Online',
      },
    });

    const response = await request(app)
      .put(`/api/jobs/${job.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ clientId });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields.');
  });

  it('should return 403 if client tries to update another client’s job', async () => {
    const job = await prisma.job.create({
      data: {
        clientId: anotherClientId,
        title: 'Job to Update',
        description: 'Job Description',
        category: 'Graphic Design',
        budgetMin: 100,
        budgetMax: 200,
        status: 'PENDING',
        location: 'Online',
      },
    });

    const response = await request(app)
      .put(`/api/jobs/${job.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId,
        title: 'Updated Title',
        description: 'Updated Description',
        category: 'Web Development',
        budgetMin: 150,
        budgetMax: 300,
        status: 'ACTIVE',
        location: 'Remote',
      });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe(
      'You do not have permission to update this job.'
    );
  });

  it('should update the job status successfully', async () => {
    const job = await prisma.job.create({
      data: {
        clientId: anotherClientId,
        title: 'Job to Update',
        description: 'Job Description',
        category: 'Graphic Design',
        budgetMin: 100,
        budgetMax: 200,
        status: 'PENDING',
        location: 'Online',
      },
    });
    const response = await request(app)
      .patch(`/api/job/${job.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'ACTIVE',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ACTIVE');
  });
});
