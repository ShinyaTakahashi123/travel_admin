-- 限定公開リンクの「作り直し」を検知するため、旅を作った時点のリンクのハッシュを控える列を追加
-- (2026-09-28セキュリティの指摘。作り直してもitinerary.shared_link_token_hashはnullにならない)
ALTER TABLE "trip" ADD COLUMN "original_shared_link_token_hash" TEXT;
