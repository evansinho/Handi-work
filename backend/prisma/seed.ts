import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.job.deleteMany();

  // Seed sample jobs
  await prisma.job.createMany({
    data: [
      {
        clientId: uuidv4(), // Automatically generated valid UUID
        title: 'Job Title 1',
        description: 'Job Description for Job 1',
        category: 'Web Development',
        location: 'Lagos, Nigeria',
        budgetMin: 100,
        budgetMax: 200,
        status: 'PENDING', // Assuming 'PENDING' is a valid status
      },
      {
        clientId: uuidv4(), // Automatically generated valid UUID
        title: 'Job Title 2',
        description: 'Job Description for Job 2',
        category: 'Graphic Design',
        location: 'Abuja, Nigeria',
        budgetMin: 150,
        budgetMax: 250,
        status: 'ACTIVE', // Assuming 'ACTIVE' is a valid status
      },
      {
        clientId: uuidv4(), // Automatically generated valid UUID
        title: 'Job Title 3',
        description: 'Job Description for Job 3',
        category: 'Mobile App Development',
        location: 'Port Harcourt, Nigeria',
        budgetMin: 200,
        budgetMax: 350,
        status: 'COMPLETED', // Assuming 'COMPLETED' is a valid status
      },
      {
        clientId: uuidv4(), // Automatically generated valid UUID
        title: 'Job Title 4',
        description: 'Job Description for Job 4',
        category: 'Digital Marketing',
        location: 'Online',
        budgetMin: 120,
        budgetMax: 250,
        status: 'PENDING', // Assuming 'PENDING' is a valid status
      },
    ],
  });

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
