-- 足あと地図・現地チェックイン (docs/specs/20260928-footprint-map-checkin.md)

-- AlterTable: spot に足あと地図・チェックイン用の列を追加
ALTER TABLE "spot" ADD COLUMN "stamp_category" TEXT;
ALTER TABLE "spot" ADD COLUMN "checkin_radius" TEXT;
ALTER TABLE "spot" ADD COLUMN "is_memorial" BOOLEAN;

-- CreateTable: trip
CREATE TABLE "trip" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_account_id" UUID NOT NULL,
    "original_itinerary_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "travel_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "trip_user_account_id_idx" ON "trip"("user_account_id");
CREATE INDEX "trip_original_itinerary_id_idx" ON "trip"("original_itinerary_id");

ALTER TABLE "trip" ADD CONSTRAINT "trip_user_account_id_fkey"
    FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: trip_spot
CREATE TABLE "trip_spot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "trip_id" UUID NOT NULL,
    "day_number" INTEGER NOT NULL,
    "order_no" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "visit_time" TIME,
    "stay_duration_min" INTEGER,
    "transit_legs_json" JSONB,
    "memo" TEXT,
    "photo_url" TEXT,
    "photo_author" TEXT,
    "photo_license" TEXT,
    "photo_license_url" TEXT,
    "photo_source_url" TEXT,
    "prefecture_area_id" UUID,
    "stamp_category" TEXT,
    "is_wide_area" BOOLEAN NOT NULL DEFAULT false,
    "is_memorial" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "trip_spot_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "trip_spot_trip_id_idx" ON "trip_spot"("trip_id");

ALTER TABLE "trip_spot" ADD CONSTRAINT "trip_spot_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: checkin
CREATE TABLE "checkin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_account_id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "trip_spot_id" UUID NOT NULL,
    "place_key" TEXT NOT NULL,
    "prefecture_area_id" UUID,
    "stamp_category" TEXT,
    "is_memorial" BOOLEAN NOT NULL DEFAULT false,
    "checked_in_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkin_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "checkin_user_account_id_checked_in_at_idx" ON "checkin"("user_account_id", "checked_in_at");
CREATE INDEX "checkin_user_account_id_place_key_idx" ON "checkin"("user_account_id", "place_key");

ALTER TABLE "checkin" ADD CONSTRAINT "checkin_user_account_id_fkey"
    FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_trip_spot_id_fkey"
    FOREIGN KEY ("trip_spot_id") REFERENCES "trip_spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: prefecture_visit
CREATE TABLE "prefecture_visit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_account_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,
    "visit_type" TEXT NOT NULL,
    "visit_date" DATE,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prefecture_visit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "prefecture_visit_user_account_id_area_id_key" ON "prefecture_visit"("user_account_id", "area_id");

ALTER TABLE "prefecture_visit" ADD CONSTRAINT "prefecture_visit_user_account_id_fkey"
    FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prefecture_visit" ADD CONSTRAINT "prefecture_visit_area_id_fkey"
    FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
