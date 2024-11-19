import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logAdminActivity } from '../utils/adminUtils';
import { validate as isUUID } from 'uuid';

const prisma = new PrismaClient();

// Approve Artisans profile
export const approveArtisanProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const adminId = req.user?.userId;
  if (!isUUID(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  try {
    // Check if artisan profile exists
    const artisanProfile = await prisma.artisanProfile.findUnique({
      where: { userId },
    });

    if (!artisanProfile) {
      return res.status(404).json({ error: 'Artisan profile not found' });
    }

    // If profile exists, update it to set it as verified
    await prisma.artisanProfile.update({
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
    await logAdminActivity(adminId!, `Approved artisan profile: ${userId}`);

    res
      .status(200)
      .json({ message: 'Artisan profile approved', artisanProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve artisan profile' });
  }
};

// Reject Artisans profile
export const rejectArtisanProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const adminId = req.user?.userId;

  try {
    // Check if Artisan profile exists
    const artisanProfile = await prisma.artisanProfile.findUnique({
      where: { userId },
    });

    if (!artisanProfile) {
      return res.status(404).json({ error: 'Artisan profile not found' });
    }
    // Update Artisan profile to set it as not verified
    await prisma.artisanProfile.update({
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
    await logAdminActivity(adminId!, `Rejected artisan profile: ${userId}`);

    res
      .status(200)
      .json({ message: 'Artisan profile rejected', artisanProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject artisan profile' });
  }
};
