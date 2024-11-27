-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_jobId_fkey";

-- AlterTable
ALTER TABLE "artisan_profile" ADD COLUMN     "location" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
