-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "planner_age" INTEGER,
ADD COLUMN     "planner_gender" TEXT,
ADD COLUMN     "planner_home_area_id" UUID;

-- AddForeignKey
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_planner_home_area_id_fkey" FOREIGN KEY ("planner_home_area_id") REFERENCES "area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
