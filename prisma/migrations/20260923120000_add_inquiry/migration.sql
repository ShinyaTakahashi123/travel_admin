-- CreateTable
CREATE TABLE "inquiry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_site" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inquiry_status_idx" ON "inquiry"("status");

-- CreateIndex
CREATE INDEX "inquiry_category_idx" ON "inquiry"("category");

-- CreateIndex
CREATE INDEX "inquiry_source_site_idx" ON "inquiry"("source_site");
