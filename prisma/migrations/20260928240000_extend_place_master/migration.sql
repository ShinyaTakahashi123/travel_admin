-- スポットの台帳(place_master)の拡張 (docs/specs/20260928-spot-master.md)。
-- place_masterは現時点で0件のため、既存データへの影響はない

ALTER TABLE "place_master" ADD COLUMN "reading" TEXT;
ALTER TABLE "place_master" ADD COLUMN "prefecture_area_id" UUID;
ALTER TABLE "place_master" ADD COLUMN "is_wide_area" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "place_master" ADD COLUMN "is_memorial" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "place_master" ADD COLUMN "stay_duration_min" INTEGER;
ALTER TABLE "place_master" ADD COLUMN "website_url" TEXT;
ALTER TABLE "place_master" ADD COLUMN "photo_url" TEXT;
ALTER TABLE "place_master" ADD COLUMN "photo_author" TEXT;
ALTER TABLE "place_master" ADD COLUMN "photo_license" TEXT;
ALTER TABLE "place_master" ADD COLUMN "photo_license_url" TEXT;
ALTER TABLE "place_master" ADD COLUMN "photo_source_url" TEXT;
ALTER TABLE "place_master" ADD COLUMN "position_source" TEXT;
ALTER TABLE "place_master" ADD COLUMN "verified_at" DATE;
ALTER TABLE "place_master" ADD COLUMN "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "place_master_prefecture_area_id_idx" ON "place_master"("prefecture_area_id");

ALTER TABLE "place_master" ADD CONSTRAINT "place_master_prefecture_area_id_fkey"
    FOREIGN KEY ("prefecture_area_id") REFERENCES "area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "place_master_alias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "place_master_id" UUID NOT NULL,
    "alias" TEXT NOT NULL,

    CONSTRAINT "place_master_alias_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "place_master_alias_place_master_id_idx" ON "place_master_alias"("place_master_id");

ALTER TABLE "place_master_alias" ADD CONSTRAINT "place_master_alias_place_master_id_fkey"
    FOREIGN KEY ("place_master_id") REFERENCES "place_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;
