-- AlterTable
ALTER TABLE "user_account" ADD COLUMN     "legal_hold" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "planner_account" ADD COLUMN     "legal_hold" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "deleted_account_record" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_type" TEXT NOT NULL,
    "original_account_id" UUID NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "legal_hold" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deleted_account_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deleted_account_record_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "record_id" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "body" TEXT,
    "ip_address" TEXT,
    "occurred_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "deleted_account_record_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "deleted_account_record_deleted_at_idx" ON "deleted_account_record"("deleted_at");

-- CreateIndex
CREATE INDEX "deleted_account_record_item_record_id_idx" ON "deleted_account_record_item"("record_id");

-- AddForeignKey
ALTER TABLE "deleted_account_record_item" ADD CONSTRAINT "deleted_account_record_item_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "deleted_account_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
