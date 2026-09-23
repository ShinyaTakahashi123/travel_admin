-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "area" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "parent_id" UUID,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_master" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "category" TEXT,
    "source" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "place_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "google_id" TEXT,
    "icon_url" TEXT,
    "profile" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "home_area_id" UUID,
    "reset_token" TEXT,
    "reset_token_expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_wishlist_area" (
    "user_account_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,

    CONSTRAINT "user_wishlist_area_pkey" PRIMARY KEY ("user_account_id","area_id")
);

-- CreateTable
CREATE TABLE "user_interest_tag" (
    "user_account_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "user_interest_tag_pkey" PRIMARY KEY ("user_account_id","tag_id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_account_id" UUID NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMPTZ,
    "payment_provider" TEXT,
    "payment_ref" TEXT,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planner_account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "google_id" TEXT,
    "icon_url" TEXT,
    "profile" TEXT,
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "gender" TEXT,
    "age" INTEGER,
    "home_area_id" UUID,
    "reset_token" TEXT,
    "reset_token_expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "planner_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planner_service_area" (
    "planner_account_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,

    CONSTRAINT "planner_service_area_pkey" PRIMARY KEY ("planner_account_id","area_id")
);

-- CreateTable
CREATE TABLE "planner_specialty_tag" (
    "planner_account_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "planner_specialty_tag_pkey" PRIMARY KEY ("planner_account_id","tag_id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'invited',
    "invite_token" TEXT,
    "invite_expires_at" TIMESTAMPTZ,
    "reset_token" TEXT,
    "reset_token_expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "planner_account_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "nights" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "thumbnail_url" TEXT,
    "view_count" BIGINT NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMPTZ,
    "reviewed_at" TIMESTAMPTZ,
    "reviewed_by_admin_id" UUID,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_area" (
    "itinerary_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,

    CONSTRAINT "itinerary_area_pkey" PRIMARY KEY ("itinerary_id","area_id")
);

-- CreateTable
CREATE TABLE "itinerary_tag" (
    "itinerary_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "itinerary_tag_pkey" PRIMARY KEY ("itinerary_id","tag_id")
);

-- CreateTable
CREATE TABLE "day" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "itinerary_id" UUID NOT NULL,
    "day_number" INTEGER NOT NULL,

    CONSTRAINT "day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "day_id" UUID NOT NULL,
    "place_master_id" UUID,
    "order_no" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "visit_time" TIME,
    "memo" TEXT,
    "stay_duration_min" INTEGER,
    "website_url" TEXT,
    "transit_mode" TEXT,
    "transit_duration_min" INTEGER,
    "transit_line" TEXT,

    CONSTRAINT "spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "spot_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "user_account_id" UUID NOT NULL,
    "itinerary_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("user_account_id","itinerary_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "itinerary_id" UUID NOT NULL,
    "user_account_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "target_type" TEXT NOT NULL,
    "target_id" UUID NOT NULL,
    "reporter_user_account_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "share_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "itinerary_id" UUID NOT NULL,
    "platform" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "planner_account_id" UUID NOT NULL,
    "sender_user_account_id" UUID NOT NULL,
    "itinerary_id" UUID,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_view" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "itinerary_id" UUID,
    "viewed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_metric" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "metric_date" DATE NOT NULL,
    "total_user_accounts" INTEGER NOT NULL,
    "total_published_itineraries" INTEGER NOT NULL,
    "pv_count" INTEGER NOT NULL,

    CONSTRAINT "daily_metric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "area_parent_id_idx" ON "area"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_email_key" ON "user_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_google_id_key" ON "user_account"("google_id");

-- CreateIndex
CREATE INDEX "user_account_home_area_id_idx" ON "user_account"("home_area_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_user_account_id_key" ON "subscription"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "planner_account_email_key" ON "planner_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "planner_account_google_id_key" ON "planner_account"("google_id");

-- CreateIndex
CREATE INDEX "planner_account_home_area_id_idx" ON "planner_account"("home_area_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE INDEX "itinerary_planner_account_id_idx" ON "itinerary"("planner_account_id");

-- CreateIndex
CREATE INDEX "itinerary_status_idx" ON "itinerary"("status");

-- CreateIndex
CREATE INDEX "itinerary_status_created_at_idx" ON "itinerary"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "itinerary_status_view_count_idx" ON "itinerary"("status", "view_count" DESC);

-- CreateIndex
CREATE INDEX "itinerary_area_area_id_idx" ON "itinerary_area"("area_id");

-- CreateIndex
CREATE INDEX "itinerary_tag_tag_id_idx" ON "itinerary_tag"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "day_itinerary_id_day_number_key" ON "day"("itinerary_id", "day_number");

-- CreateIndex
CREATE INDEX "spot_place_master_id_idx" ON "spot"("place_master_id");

-- CreateIndex
CREATE UNIQUE INDEX "spot_day_id_order_no_key" ON "spot"("day_id", "order_no");

-- CreateIndex
CREATE INDEX "photo_spot_id_idx" ON "photo"("spot_id");

-- CreateIndex
CREATE INDEX "favorite_itinerary_id_idx" ON "favorite"("itinerary_id");

-- CreateIndex
CREATE INDEX "comment_itinerary_id_created_at_idx" ON "comment"("itinerary_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "report_status_idx" ON "report"("status");

-- CreateIndex
CREATE INDEX "report_target_type_target_id_idx" ON "report"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "share_log_itinerary_id_platform_idx" ON "share_log"("itinerary_id", "platform");

-- CreateIndex
CREATE INDEX "request_planner_account_id_status_idx" ON "request"("planner_account_id", "status");

-- CreateIndex
CREATE INDEX "page_view_viewed_at_idx" ON "page_view"("viewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "daily_metric_metric_date_key" ON "daily_metric"("metric_date");

-- AddForeignKey
ALTER TABLE "area" ADD CONSTRAINT "area_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_home_area_id_fkey" FOREIGN KEY ("home_area_id") REFERENCES "area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wishlist_area" ADD CONSTRAINT "user_wishlist_area_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wishlist_area" ADD CONSTRAINT "user_wishlist_area_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_tag" ADD CONSTRAINT "user_interest_tag_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_tag" ADD CONSTRAINT "user_interest_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner_account" ADD CONSTRAINT "planner_account_home_area_id_fkey" FOREIGN KEY ("home_area_id") REFERENCES "area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner_service_area" ADD CONSTRAINT "planner_service_area_planner_account_id_fkey" FOREIGN KEY ("planner_account_id") REFERENCES "planner_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner_service_area" ADD CONSTRAINT "planner_service_area_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner_specialty_tag" ADD CONSTRAINT "planner_specialty_tag_planner_account_id_fkey" FOREIGN KEY ("planner_account_id") REFERENCES "planner_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner_specialty_tag" ADD CONSTRAINT "planner_specialty_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_planner_account_id_fkey" FOREIGN KEY ("planner_account_id") REFERENCES "planner_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_reviewed_by_admin_id_fkey" FOREIGN KEY ("reviewed_by_admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_area" ADD CONSTRAINT "itinerary_area_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_area" ADD CONSTRAINT "itinerary_area_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_tag" ADD CONSTRAINT "itinerary_tag_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_tag" ADD CONSTRAINT "itinerary_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day" ADD CONSTRAINT "day_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot" ADD CONSTRAINT "spot_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot" ADD CONSTRAINT "spot_place_master_id_fkey" FOREIGN KEY ("place_master_id") REFERENCES "place_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_user_account_id_fkey" FOREIGN KEY ("reporter_user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_log" ADD CONSTRAINT "share_log_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_planner_account_id_fkey" FOREIGN KEY ("planner_account_id") REFERENCES "planner_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_sender_user_account_id_fkey" FOREIGN KEY ("sender_user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_view" ADD CONSTRAINT "page_view_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
