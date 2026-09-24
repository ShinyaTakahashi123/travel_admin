-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "ip_address" TEXT;

-- AlterTable
ALTER TABLE "itinerary" ADD COLUMN     "submitted_ip" TEXT;

-- AlterTable
ALTER TABLE "request" ADD COLUMN     "ip_address" TEXT;
