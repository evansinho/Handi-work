import request from 'supertest';
import { app } from '../index';
import { PrismaClient, Role, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Endpoints', () => {
  let adminToken: string;
  beforeAll(async () => {
    await prisma.$connect();
    jest.clearAllMocks();
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
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // Test GET /users
  it('should retrieve all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  // Test GET /user/:id
  it('should retrieve a user by ID', async () => {
    const newUser = await prisma.user.create({
      data: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phoneNumber: '1234567890',
        passwordHash: 'securepassword',
        role: Role.CLIENT,
        verificationStatus: VerificationStatus.PENDING,
        twoFactorEnabled: false,
      },
    });
    const response = await request(app)
      .get(`/api/user/${newUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', newUser.id);
  });

  // Test PUT /user/:id
  it('should update a user by ID', async () => {
    const newUser = await prisma.user.create({
      data: {
        name: 'Original Name',
        email: 'updateuser@example.com',
        phoneNumber: '1234567890',
        passwordHash: 'securepassword',
        role: Role.CLIENT,
        verificationStatus: VerificationStatus.PENDING,
        twoFactorEnabled: false,
      },
    });

    const response = await request(app)
      .put(`/api/user/${newUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Name',
        email: 'updateduser@example.com',
        role: Role.ARTISAN,
      })
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Updated Name');
    expect(response.body).toHaveProperty('email', 'updateduser@example.com');
    expect(response.body).toHaveProperty('role', 'ARTISAN');
  });

  // Test DELETE /user/:id
  it('should delete a user by ID', async () => {
    const newUser = await prisma.user.create({
      data: {
        name: 'Original Name',
        email: 'updateuser@example.com',
        phoneNumber: '1234567890',
        passwordHash: 'securepassword',
        role: Role.CLIENT,
        verificationStatus: VerificationStatus.PENDING,
        twoFactorEnabled: false,
      },
    });
    const response = await request(app)
      .delete(`/api/user/${newUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'User Deleted.');
  });
});
