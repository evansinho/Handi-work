import { Request, Response } from 'express';
import { PrismaClient, JobStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Get all jobs
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Filter jobs by status
export const filterJobByStatus = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    // Ensure status is provided and not empty
    if (!status) {
      return res
        .status(400)
        .json({ error: 'Status query parameter is required' });
    }
    // Normalize status to uppercase (to handle case insensitivity)
    const normalizedStatus = status.toUpperCase() as JobStatus;
    // Validate if normalized status is a valid JobStatus enum value
    if (!Object.values(JobStatus).includes(normalizedStatus)) {
      return res.status(400).json({ error: 'Invalid status parameter' });
    }

    const jobs = await prisma.job.findMany({
      where: {
        status: normalizedStatus,
      },
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs by status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
