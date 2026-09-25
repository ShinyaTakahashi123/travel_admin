-- 乗り継ぎ(スポットへの移動を複数持てるようにする)。spot.transit_* の値は残したまま、
-- 1つ目の移動としてこの表に移す(docs/specs/20260925-transit-multi-leg.md)

-- CreateTable
CREATE TABLE "spot_transit_leg" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "spot_id" UUID NOT NULL,
    "order_no" INTEGER NOT NULL,
    "transit_mode" TEXT NOT NULL,
    "transit_duration_min" INTEGER,
    "transit_line" TEXT,

    CONSTRAINT "spot_transit_leg_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spot_transit_leg_spot_id_order_no_key" ON "spot_transit_leg"("spot_id", "order_no");

-- AddForeignKey
ALTER TABLE "spot_transit_leg" ADD CONSTRAINT "spot_transit_leg_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 既存のスポットの移動を、1つ目の移動として移す(transit_modeがある行だけ)
INSERT INTO "spot_transit_leg" ("id", "spot_id", "order_no", "transit_mode", "transit_duration_min", "transit_line")
SELECT gen_random_uuid(), "id", 1, "transit_mode", "transit_duration_min", "transit_line"
FROM "spot"
WHERE "transit_mode" IS NOT NULL;
