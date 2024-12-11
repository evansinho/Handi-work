import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get messages for a job
export const getMessagesByJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({ data: messages });
  } catch (error) {
    const err = error as Error;
    res
      .status(500)
      .json({ error: 'Failed to retrieve messages', details: err.message });
  }
};

// Get conversation between two users
export const getConversation = async (req: Request, res: Response) => {
  const { fromUserId, toUserId } = req.params;

  try {
    const conversation = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({ data: conversation });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      error: 'Failed to retrieve conversation',
      details: err.message,
    });
  }
};
