import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const notifyArtisansAboutNewJob = async (jobId: string) => {
  try {
    // Fetch the job details
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { category: true, title: true, description: true },
    });

    if (!job) throw new Error('Job not found');
    // Find artisans matching the job category
    const artisans = await prisma.artisanProfile.findMany({
      where: { category: job.category, available: true },
      select: { userId: true },
    });

    if (artisans.length === 0) {
      console.log('No matching artisans found for this job.');
      return;
    }
    // Create notifications for matching artisans
    const notifications = artisans.map((artisan) => ({
      userId: artisan.userId,
      notificationType: 'NEW_JOB',
      message: `A new job is available in your category: "${job.title}".`,
    }));

    await prisma.notification.createMany({ data: notifications });
    console.log(`Notifications sent to ${artisans.length} artisans.`);
  } catch (error) {
    console.error('Error notifying artisans:', error);
  }
};
