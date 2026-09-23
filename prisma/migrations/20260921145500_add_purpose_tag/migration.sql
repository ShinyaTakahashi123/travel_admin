-- CreateTable
CREATE TABLE "purpose_tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purpose_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_purpose_tag" (
    "itinerary_id" UUID NOT NULL,
    "purpose_tag_id" UUID NOT NULL,

    CONSTRAINT "itinerary_purpose_tag_pkey" PRIMARY KEY ("itinerary_id","purpose_tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purpose_tag_name_key" ON "purpose_tag"("name");

-- CreateIndex
CREATE INDEX "itinerary_purpose_tag_purpose_tag_id_idx" ON "itinerary_purpose_tag"("purpose_tag_id");

-- AddForeignKey
ALTER TABLE "itinerary_purpose_tag" ADD CONSTRAINT "itinerary_purpose_tag_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_purpose_tag" ADD CONSTRAINT "itinerary_purpose_tag_purpose_tag_id_fkey" FOREIGN KEY ("purpose_tag_id") REFERENCES "purpose_tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
