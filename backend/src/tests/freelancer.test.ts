// Import necessary modules
import request from 'supertest';
import { app } from '../index';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate an admin token
const generateAdminToken = () => {
  return jwt.sign(
    { userId: 'admin-user-id', role: Role.ADMIN },
    process.env.JWT_SECRET!
  );
};

// Helper function to generate a non-admin token
const generateUserToken = () => {
  return jwt.sign(
    { id: 'user-id', role: Role.CLIENT },
    process.env.JWT_SECRET!
  );
};

// Test suite
describe('Freelancer Profile Endpoints', () => {
  const adminToken = generateAdminToken();
  const userToken = generateUserToken();
  const userId = 'test-freelancer-id';

  describe('POST /api/freelancer-profile/approve/:userId', () => {
    it('should approve the freelancer profile when admin', async () => {
      const response = await request(app)
        .post(`/api/freelancer-profile/approve/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Freelancer profile approved successfully'
      );
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .post(`/api/freelancer-profile/approve/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'You do not have permission to approve freelancer profiles'
      );
    });

    it('should return 404 if the freelancer profile is not found', async () => {
      const response = await request(app)
        .post(`/api/freelancer-profile/approve/non-existent-id`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Freelancer not found');
    });
  });

  describe('POST /api/freelancer-profile/reject/:userId', () => {
    it('should reject the freelancer profile when admin', async () => {
      const response = await request(app)
        .post(`/api/freelancer-profile/reject/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Freelancer profile rejected successfully'
      );
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .post(`/api/freelancer-profile/reject/${userId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'You do not have permission to reject freelancer profiles'
      );
    });

    it('should return 404 if the freelancer profile is not found', async () => {
      const response = await request(app)
        .post(`/api/freelancer-profile/reject/non-existent-id`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Freelancer not found');
    });
  });
});
