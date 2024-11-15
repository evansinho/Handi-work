-- DropForeignKey
ALTER TABLE "client_profile" DROP CONSTRAINT "client_profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "freelancer_profile" DROP CONSTRAINT "freelancer_profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_clientId_fkey";

-- AddForeignKey
ALTER TABLE "freelancer_profile" ADD CONSTRAINT "freelancer_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_profile" ADD CONSTRAINT "client_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
