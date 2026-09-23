-- AlterTable
ALTER TABLE "planner_account" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
