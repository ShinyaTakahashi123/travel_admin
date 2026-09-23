-- AlterTable
ALTER TABLE "itinerary" ADD COLUMN     "primary_area_id" UUID;

-- CreateIndex
CREATE INDEX "itinerary_primary_area_id_idx" ON "itinerary"("primary_area_id");

-- AddForeignKey
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_primary_area_id_fkey" FOREIGN KEY ("primary_area_id") REFERENCES "area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
