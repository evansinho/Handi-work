import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchArtisans = async (req: Request, res: Response) => {
  try {
    const { location, skills } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    if (location && typeof location === 'string') {
      filters.location = location;
    }
    if (skills && typeof skills === 'string') {
      filters.category = { in: skills.split(',') };
    }

    const artisans = await prisma.artisanProfile.findMany({
      where: {
        available: true,
        ...filters,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    res.status(200).json({ data: artisans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
