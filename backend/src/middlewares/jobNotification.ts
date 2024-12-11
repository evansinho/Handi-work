import { PrismaClient } from '@prisma/client';
import { sendEmail, sendSMS } from '../services/notificationService';

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

    if (artisans.length === 0) return;

    // Create notifications and send batched email/SMS for matching artisans
    const notifications = artisans.map((artisan) => ({
      userId: artisan.userId,
      notificationType: 'NEW_JOB',
      message: `A new job is available in your category: "${job.title}".`,
    }));

    await prisma.notification.createMany({ data: notifications });

    console.log(`Notifications created for ${artisans.length} artisans.`);

    // Get the contact details of artisans (email and phone number)
    const artisanContacts = await prisma.user.findMany({
      where: { id: { in: artisans.map((artisan) => artisan.userId) } },
      select: { email: true, phoneNumber: true },
    });

    // Prepare messages for email and SMS
    const emailSubject = 'New Job Available in Your Category';
    const emailBody = `A new job is available in your category: "${job.title}".\nDescription: ${job.description}\nApply now!`;

    const smsBody = `New job alert: "${job.title}" is available in your category. Apply now!`;

    // Send emails and SMS to each artisan
    for (const contact of artisanContacts) {
      if (contact.email) {
        await sendEmail(contact.email, emailSubject, emailBody);
        console.log(`Email sent to ${contact.email}`);
      }

      if (contact.phoneNumber) {
        await sendSMS(contact.phoneNumber, smsBody);
        console.log(`SMS sent to ${contact.phoneNumber}`);
      }
    }
  } catch (error) {
    console.error('Error notifying artisans:', error);
  }
};
