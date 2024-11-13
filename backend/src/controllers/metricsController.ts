import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the expected type for user activity metrics
interface UserActivityMetrics {
  totalUsers: number;
  newSignups: number;
  freelancerProfilesCreated: number;
  clientProfilesCreated: number;
  jobPosts: number;
  proposalsSubmitted: number;
  contractsCompleted: number;
}

// Define the expected type for app performance metrics
interface AppPerformanceMetrics {
  pendingJobs: number;
  activeJobs: number;
  completedJobs: number;
  disputedJobs: number;
  pendingPayments: number;
  paidPayments: number;
  escrowPayments: number;
  averageRating: number;
  totalContracts: number;
  completedContracts: number;
  activeContracts: number;
}

// Get User Activity Metrics
export const getUserActivityMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const userActivity: UserActivityMetrics[] = await prisma.$queryRaw`
  SELECT
    (SELECT COUNT(*) FROM "users") AS "totalUsers",
    (SELECT COUNT(*) FROM "users" WHERE "createdAt" BETWEEN ${startDate}::timestamp AND ${endDate}::timestamp) AS "newSignups",
    (SELECT COUNT(*) FROM "freelancer_profile") AS "freelancerProfilesCreated",
    (SELECT COUNT(*) FROM "client_profile") AS "clientProfilesCreated",
    (SELECT COUNT(*) FROM "jobs") AS "jobPosts",
    (SELECT COUNT(*) FROM "proposals") AS "proposalsSubmitted",
    (SELECT COUNT(*) FROM "contracts" WHERE "endDate" IS NOT NULL) AS "contractsCompleted"
`;

    // Convert BigInt values to strings before returning
    const sanitizedMetrics = userActivity.map((metric) => ({
      totalUsers: metric.totalUsers.toString(),
      newSignups: metric.newSignups.toString(),
      freelancerProfilesCreated: metric.freelancerProfilesCreated.toString(),
      clientProfilesCreated: metric.clientProfilesCreated.toString(),
      jobPosts: metric.jobPosts.toString(),
      proposalsSubmitted: metric.proposalsSubmitted.toString(),
      contractsCompleted: metric.contractsCompleted.toString(),
    }));

    res.json(sanitizedMetrics);
  } catch (error) {
    console.error('Error fetching user activity metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get App Performance Metrics
export const getAppPerformanceMetrics = async (req: Request, res: Response) => {
  try {
    const appPerformance: AppPerformanceMetrics[] = await prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM "jobs" WHERE status = 'PENDING') AS "pendingJobs",
        (SELECT COUNT(*) FROM "jobs" WHERE status = 'ACTIVE') AS "activeJobs",
        (SELECT COUNT(*) FROM "jobs" WHERE status = 'COMPLETED') AS "completedJobs",
        (SELECT COUNT(*) FROM "jobs" WHERE status = 'DISPUTED') AS "disputedJobs",
        (SELECT COUNT(*) FROM "payments" WHERE "paymentStatus" = 'PENDING') AS "pendingPayments",
        (SELECT COUNT(*) FROM "payments" WHERE "paymentStatus" = 'PAID') AS "paidPayments",
        (SELECT COUNT(*) FROM "payments" WHERE "paymentStatus" = 'ESCROW') AS "escrowPayments", 
        (SELECT AVG(rating) FROM "ratings") AS "averageRating",
        (SELECT COUNT(*) FROM "contracts") AS "totalContracts",
        (SELECT COUNT(*) FROM "contracts" WHERE "endDate" IS NOT NULL) AS "completedContracts",
        (SELECT COUNT(*) FROM "contracts" WHERE "endDate" IS NULL) AS "activeContracts"
    `;

    // Convert BigInt values to strings before returning
    const sanitizedMetrics = {
      pendingJobs: appPerformance[0].pendingJobs.toString(),
      activeJobs: appPerformance[0].activeJobs.toString(),
      completedJobs: appPerformance[0].completedJobs.toString(),
      disputedJobs: appPerformance[0].disputedJobs.toString(),
      pendingPayments: appPerformance[0].pendingPayments.toString(),
      paidPayments: appPerformance[0].paidPayments.toString(),
      escrowPayments: appPerformance[0].escrowPayments.toString(),
      averageRating: appPerformance[0].averageRating,
      totalContracts: appPerformance[0].totalContracts.toString(),
      completedContracts: appPerformance[0].completedContracts.toString(),
      activeContracts: appPerformance[0].activeContracts.toString(),
    };

    res.json(sanitizedMetrics);
  } catch (error) {
    console.error('Error fetching app performance metrics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
