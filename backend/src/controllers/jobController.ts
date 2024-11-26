import { Request, Response } from 'express';
import { PrismaClient, JobStatus } from '@prisma/client';
import { notifyArtisansAboutNewJob } from '../services/notifyArtisan';

const prisma = new PrismaClient();

// Get all jobs for admin
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Filter jobs by status for admin
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

// Clients controller to post jobs
export const postJobs = async (req: Request, res: Response) => {
  try {
    const {
      clientId,
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      location,
    } = req.body;

    // Create the job
    const newJob = await prisma.job.create({
      data: {
        clientId,
        title,
        description,
        category,
        budgetMin,
        budgetMax,
        location,
        status: 'PENDING',
      },
    });

    // Notify matching artisans
    await notifyArtisansAboutNewJob(newJob.id);

    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Retrieve all jobs created by a client
export const retrieveJobs = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    // Validate if clientId is provided
    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required.' });
    }
    // Fetch jobs created by the client
    const jobs = await prisma.job.findMany({
      where: {
        clientId: clientId,
      },
      include: {
        client: true,
        proposals: true,
        contracts: true,
      },
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Update a job created by a client
export const updateJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const clientId = req.body.clientId;
    const {
      title,
      description,
      category,
      location,
      budgetMin,
      budgetMax,
      status,
    } = req.body;

    // Validate required fields
    if (
      !clientId ||
      !title ||
      !category ||
      !budgetMin ||
      !budgetMax ||
      !status
    ) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Find the job to ensure it belongs to the client
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    if (existingJob.clientId !== clientId) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to update this job.' });
    }

    // Update the job
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        description,
        category,
        location,
        budgetMin,
        budgetMax,
        status,
      },
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
