-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "password_changed_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "planner_account" ADD COLUMN     "password_changed_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "password_changed_at" TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "rate_limit_event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limit_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rate_limit_event_key_created_at_idx" ON "rate_limit_event"("key", "created_at");
