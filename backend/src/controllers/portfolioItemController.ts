import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Upload portfolio item
export const uploadPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { artisanId, title, description } = req.body;

    const newPortfolioItem = await prisma.portfolioItem.create({
      data: {
        artisanId,
        title,
        description,
        imageUrl: req.file?.path || '',
      },
    });

    res.status(201).json(newPortfolioItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload portfolio item' });
  }
};

// Get all portfolio items for an artisan
export const getPortfolioItems = async (req: Request, res: Response) => {
  try {
    const { artisanId } = req.params;

    const portfolioItems = await prisma.portfolioItem.findMany({
      where: { artisanId },
    });

    res.status(200).json(portfolioItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve portfolio items' });
  }
};

// Delete portfolio item
export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.portfolioItem.delete({ where: { id } });
    res.status(204).json({ message: 'Portfolio Deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
};
