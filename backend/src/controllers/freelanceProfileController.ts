import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logAdminActivity } from '../utils/adminUtils';

const prisma = new PrismaClient();

// Approve Freelancers profile
export const approveFreelancerProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const adminId = req.user?.id;

  try {
    // Check if freelancer profile exists
    const freelancerProfile = await prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancerProfile) {
      return res.status(404).json({ error: 'Freelancer profile not found' });
    }

    // If profile exists, update it to set it as verified
    await prisma.freelancerProfile.update({
      where: { userId },
      data: {
        verified: true,
      },
    });

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: 'VERIFIED',
      },
    });

    // Log the admin activity
    await logAdminActivity(adminId!, `Approved freelancer profile: ${userId}`);

    res
      .status(200)
      .json({ message: 'Freelancer profile approved', freelancerProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve freelancer profile' });
  }
};

// Reject Freelancers profile
export const rejectFreelancerProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const adminId = req.user?.id;

  try {
    // Check if freelancer profile exists
    const freelancerProfile = await prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancerProfile) {
      return res.status(404).json({ error: 'Freelancer profile not found' });
    }
    // Update freelancer profile to set it as not verified
    await prisma.freelancerProfile.update({
      where: { userId },
      data: {
        verified: false,
      },
    });

    // Update user verification status to REJECTED
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: 'REJECTED',
      },
    });
    // Log the admin activity (action of rejection)
    await logAdminActivity(adminId!, `Rejected freelancer profile: ${userId}`);

    res
      .status(200)
      .json({ message: 'Freelancer profile rejected', freelancerProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject freelancer profile' });
  }
};
