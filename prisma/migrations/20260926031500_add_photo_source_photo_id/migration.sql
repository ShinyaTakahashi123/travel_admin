-- 「コピーしてアレンジ」で複製した写真が、コピー元のPhoto行を指せるようにする
-- (docs/specs/20260925-copy-and-share.md「写真」。削除依頼で元の写真を消すとき、
-- コピー側の写真もまとめて消せるように ON DELETE CASCADE にする)

ALTER TABLE "photo" ADD COLUMN     "source_photo_id" UUID;

-- CreateIndex
CREATE INDEX "photo_source_photo_id_idx" ON "photo"("source_photo_id");

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_source_photo_id_fkey" FOREIGN KEY ("source_photo_id") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
