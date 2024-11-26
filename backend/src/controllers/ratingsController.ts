import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const postRating = async (req: Request, res: Response) => {
  const { jobId, fromUserId, toUserId, rating, review } = req.body;

  try {
    // Ensure the users exist
    const fromUser = await prisma.user.findUnique({
      where: { id: fromUserId },
    });

    const toUser = await prisma.user.findUnique({
      where: { id: toUserId },
    });

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure the profiles exist for both users (ClientProfile or ArtisanProfile)
    if (fromUser.role === 'CLIENT') {
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: fromUserId },
      });
      if (!clientProfile) {
        return res.status(404).json({ error: 'ClientProfile not found' });
      }
    }

    if (toUser.role === 'ARTISAN') {
      const artisanProfile = await prisma.artisanProfile.findUnique({
        where: { userId: toUserId },
      });
      if (!artisanProfile) {
        return res.status(404).json({ error: 'ArtisanProfile not found' });
      }
    }

    // Create the rating
    const newRating = await prisma.rating.create({
      data: {
        jobId,
        fromUserId,
        toUserId,
        rating,
        review,
      },
    });

    // Update ratings average for the recipient (if they are an artisan)
    if (toUser.role === 'ARTISAN') {
      // Retrieve all ratings for the artisan
      const ratings = await prisma.rating.findMany({
        where: { toUserId },
      });

      // Calculate the average rating (handle edge case where no ratings exist yet)
      const averageRating =
        ratings.length > 0
          ? ratings.reduce(
              (sum, r) => sum + parseFloat(r.rating.toString()),
              0
            ) / ratings.length
          : 0; // Default to 0 if no ratings exist

      // Update the artisan's profile with the new average rating
      await prisma.artisanProfile.update({
        where: { userId: toUserId },
        data: {
          ratingsAvg: averageRating,
        },
      });
    }

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const fetchRatings = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const ratings = await prisma.rating.findMany({
      where: { toUserId: userId },
      include: { fromUser: true, job: true },
    });
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};
