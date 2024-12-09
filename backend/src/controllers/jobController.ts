import { Request, Response } from 'express';
import { PrismaClient, JobStatus } from '@prisma/client';
import { notifyArtisansAboutNewJob } from '../services/notifyArtisan';
import Joi from 'joi';

const prisma = new PrismaClient();

// Joi schema for validating query parameters
const querySchema = Joi.object({
  category: Joi.string().optional(),
  location: Joi.string().optional(),
  status: Joi.string()
    .valid('PENDING', 'ACTIVE', 'COMPLETED', 'DISPUTED')
    .optional(),
}).unknown(true);

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

// Filter jobs by status,location or category for admin, client, and Artisan
export const getJobs = async (req: Request, res: Response) => {
  const { role } = req.user!;
  const query = req.query;

  // Validate query parameters
  const { error, value: validatedQuery } = querySchema.validate(query);
  if (error) return res.status(400).json({ error: error.message });
  try {
    let jobs;
    // Admin: unrestricted access
    if (role === 'ADMIN') {
      jobs = await prisma.job.findMany({
        where: {
          category: validatedQuery.category || undefined,
          location: validatedQuery.location || undefined,
          status: validatedQuery.status || undefined,
        },
      });
    }
    // Client: filters include Artisan Availability
    else if (role === 'CLIENT') {
      jobs = await prisma.job.findMany({
        where: {
          category: validatedQuery.category || undefined,
          location: validatedQuery.location || undefined,
          status: 'ACTIVE',
        },
      });
    }
    // Artisan: category and location filters only
    else if (role === 'ARTISAN') {
      jobs = await prisma.job.findMany({
        where: {
          category: validatedQuery.category || undefined,
          location: validatedQuery.location || undefined,
        },
      });
    }
    return res.status(200).json({ jobs });
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

// Client can update job status
export const updateJobByStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const job = await prisma.job.update({
      where: { id },
      data: { status },
    });
    return res.json(job);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error updating job status' });
  }
};

// client message artisan about job
export const messageArtisan = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { fromUserId, toUserId, message } = req.body;

  try {
    const newMessage = await prisma.message.create({
      data: {
        jobId,
        fromUserId,
        toUserId,
        message,
      },
    });
    return res.json(newMessage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error sending message' });
  }
};

// Controller to fetch jobs by category
export const getJobsByCategory = async (req: Request, res: Response) => {
  const { category } = req.query;

  try {
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Query the database for jobs matching the category
    const jobs = await prisma.job.findMany({
      where: {
        category: String(category),
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        proposals: true,
        ratings: true,
      },
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
