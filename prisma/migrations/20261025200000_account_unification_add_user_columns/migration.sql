-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "is_official" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_pending_recovery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_planner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "legacy_email" TEXT,
ADD COLUMN     "legacy_email_recovery_token" TEXT,
ADD COLUMN     "legacy_email_recovery_token_expires_at" TIMESTAMPTZ,
ADD COLUMN     "legacy_google_id" TEXT,
ADD COLUMN     "planner_suspended_at" TIMESTAMPTZ;

-- CreateIndex
CREATE INDEX "user_account_legacy_email_idx" ON "user_account"("legacy_email");

-- CreateIndex
CREATE INDEX "user_account_legacy_google_id_idx" ON "user_account"("legacy_google_id");
