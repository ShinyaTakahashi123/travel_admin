-- CreateIndex
CREATE INDEX "itinerary_status_like_count_idx" ON "itinerary"("status", "like_count" DESC);
