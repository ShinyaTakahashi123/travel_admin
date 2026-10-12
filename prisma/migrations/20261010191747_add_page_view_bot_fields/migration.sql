-- PVからロボットのアクセスを外す(docs/specs/20261010-pv-bot-filter.md)。
-- User-Agentの全文・IPアドレスは保存しない方針のため、入れるのは種類の短い名前(bot_name)だけ。
-- bot_nameは決まった一覧(src/lib/bot-detection.tsのBOT_NAMES)の値のみ許可する

-- AlterTable
ALTER TABLE "page_view" ADD COLUMN "is_bot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "bot_name" TEXT;

-- bot_nameは決まった一覧の値のみ・40文字以内(セキュリティ指摘2026-10-10)
ALTER TABLE "page_view"
  ADD CONSTRAINT page_view_bot_name_check
  CHECK (
    bot_name IS NULL
    OR (
      char_length(bot_name) <= 40
      AND bot_name IN ('googlebot', 'bingbot', 'gptbot', 'claudebot', 'other')
    )
  );
