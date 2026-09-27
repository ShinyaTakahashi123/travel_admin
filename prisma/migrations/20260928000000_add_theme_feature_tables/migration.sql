-- 「テーマから探す」「特集」を管理者サイトで作れるようにする
-- (docs/specs/20260927-admin-managed-themes-features.md)

-- CreateTable
CREATE TABLE "theme" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "image_url" TEXT,
    "seasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_tag" (
    "theme_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "theme_tag_pkey" PRIMARY KEY ("theme_id","tag_id")
);

-- CreateTable
CREATE TABLE "theme_purpose_tag" (
    "theme_id" UUID NOT NULL,
    "purpose_tag_id" UUID NOT NULL,

    CONSTRAINT "theme_purpose_tag_pkey" PRIMARY KEY ("theme_id","purpose_tag_id")
);

-- CreateTable
CREATE TABLE "feature" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "closing" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "display_from_month" INTEGER,
    "display_to_month" INTEGER,
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "feature_id" UUID NOT NULL,
    "itinerary_id" UUID NOT NULL,
    "caption" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "feature_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_related_link" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "feature_id" UUID NOT NULL,
    "href" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "feature_related_link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "theme_slug_key" ON "theme"("slug");

-- CreateIndex
CREATE INDEX "theme_status_idx" ON "theme"("status");

-- CreateIndex
CREATE INDEX "theme_tag_tag_id_idx" ON "theme_tag"("tag_id");

-- CreateIndex
CREATE INDEX "theme_purpose_tag_purpose_tag_id_idx" ON "theme_purpose_tag"("purpose_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "feature_slug_key" ON "feature"("slug");

-- CreateIndex
CREATE INDEX "feature_status_idx" ON "feature"("status");

-- CreateIndex
CREATE UNIQUE INDEX "feature_item_feature_id_itinerary_id_key" ON "feature_item"("feature_id", "itinerary_id");

-- CreateIndex
CREATE INDEX "feature_item_itinerary_id_idx" ON "feature_item"("itinerary_id");

-- AddForeignKey
ALTER TABLE "theme_tag" ADD CONSTRAINT "theme_tag_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_tag" ADD CONSTRAINT "theme_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_purpose_tag" ADD CONSTRAINT "theme_purpose_tag_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theme_purpose_tag" ADD CONSTRAINT "theme_purpose_tag_purpose_tag_id_fkey" FOREIGN KEY ("purpose_tag_id") REFERENCES "purpose_tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_item" ADD CONSTRAINT "feature_item_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_item" ADD CONSTRAINT "feature_item_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_related_link" ADD CONSTRAINT "feature_related_link_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
