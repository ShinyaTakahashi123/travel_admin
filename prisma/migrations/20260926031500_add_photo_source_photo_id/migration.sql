-- 「コピーしてアレンジ」で複製した写真が、コピー元のPhoto行を指せるようにする
-- (docs/specs/20260925-copy-and-share.md「写真」)。
-- ON DELETE SET NULL: 公式しおりの保存し直し・制作のスクリプトで元の写真の行が
-- 作り直されるたびにコピー側の写真行が消えてしまわないよう、CASCADEにはしない
-- (2026-09-26 企画運営の判断)。削除依頼の対応は「同じURLの写真の行をすべて消す」
-- 手順で行う(このFKには頼らない)

ALTER TABLE "photo" ADD COLUMN     "source_photo_id" UUID;

-- CreateIndex
CREATE INDEX "photo_source_photo_id_idx" ON "photo"("source_photo_id");

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_source_photo_id_fkey" FOREIGN KEY ("source_photo_id") REFERENCES "photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
