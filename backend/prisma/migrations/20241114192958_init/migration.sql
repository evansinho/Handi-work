-- DropForeignKey
ALTER TABLE "admin_activities" DROP CONSTRAINT "admin_activities_adminId_fkey";

-- AddForeignKey
ALTER TABLE "admin_activities" ADD CONSTRAINT "admin_activities_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
