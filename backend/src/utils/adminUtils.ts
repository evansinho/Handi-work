import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility function to log admin activity
export const logAdminActivity = async (adminId: string, action: string) => {
  try {
    await prisma.adminActivity.create({
      data: {
        adminId,
        action,
      },
    });
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
};
