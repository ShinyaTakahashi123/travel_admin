-- 公式しおりの「コピーしてアレンジ」と、会員だけが見られる限定公開リンク
-- (docs/specs/20260925-copy-and-share.md)

-- コピーの印・コピー元
ALTER TABLE "itinerary" ADD COLUMN     "is_copy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "copied_from_id" UUID;

-- CreateIndex
CREATE INDEX "itinerary_copied_from_id_idx" ON "itinerary"("copied_from_id");

-- AddForeignKey
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_copied_from_id_fkey" FOREIGN KEY ("copied_from_id") REFERENCES "itinerary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 限定公開リンク。合言葉は保存せず、SHA-256のハッシュだけを保存する
ALTER TABLE "itinerary" ADD COLUMN     "shared_link_token_hash" TEXT,
ADD COLUMN     "shared_link_created_at" TIMESTAMPTZ,
ADD COLUMN     "shared_link_consent_at" TIMESTAMPTZ;

-- CreateIndex
CREATE UNIQUE INDEX "itinerary_shared_link_token_hash_key" ON "itinerary"("shared_link_token_hash");

-- コピーはpublished・pendingにできないことを、アプリ側に加えてDB側でも保証する
-- (セキュリティ確認 docs/security/20260925-copy-and-share-review.md A-5)
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_copy_not_public_check" CHECK (NOT ("is_copy" AND "status" IN ('published', 'pending')));
