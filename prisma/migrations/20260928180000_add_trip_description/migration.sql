-- 「旅」にしおりの説明文を写して保持する列を追加(元のしおりが見られなくなったら空にする。
-- 法務2026-09-28決定B・docs/legal/20260928-trip-copy-legal.md)
ALTER TABLE "trip" ADD COLUMN "description" TEXT;
