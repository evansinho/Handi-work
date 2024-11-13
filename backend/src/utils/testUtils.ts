import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const createTestUser = async (): Promise<User> => {
  const password = 'testPassword123';
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name: 'Test User',
      email: 'testuser@example.com',
      phoneNumber: '1234567890',
      passwordHash: hashedPassword,
      role: 'CLIENT', // You can change the role as needed
      verificationStatus: 'VERIFIED',
      twoFactorEnabled: false,
    },
  });
};
