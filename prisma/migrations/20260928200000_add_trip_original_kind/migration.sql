-- 「旅」の元のしおりの種類(公開中／自分のコピー／限定公開リンク)を保持する列を追加。
-- 「見られなくなった」の判定基準が種類によって違うため(2026-09-28 企画運営の指摘への対応)
ALTER TABLE "trip" ADD COLUMN "original_kind" TEXT NOT NULL DEFAULT 'published';
