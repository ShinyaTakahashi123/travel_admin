-- 手動適用SQL: CHECK制約・pg_trgmトライグラムインデックス・updated_at自動更新トリガー
--
-- Prismaのスキーマ定義言語(schema.prisma)は任意のCHECK制約、USING gin (... gin_trgm_ops)
-- 形式のインデックス、DBレベルのトリガーを直接表現できないため、これらは `prisma migrate dev`
-- が生成したマイグレーションSQLには含まれない。本ファイルは docs/database-design.md の2章に
-- 記載されたCHECK制約・トライグラムインデックス・トリガーを、そのマイグレーション適用後に
-- 手動で反映するためのリファレンスである。
--
-- ⚠️ updated_at自動更新トリガーについて: アプリケーションは必ずPrisma Client経由で更新する
-- （`@updatedAt`によりPrisma自身がupdated_atを設定する）ため、このトリガーはPrismaを経由しない
-- 直接のSQL操作に対する保険（多重防御）という位置づけであり、無くてもアプリの動作自体には
-- 影響しない。とはいえdatabase-design.mdの設計通りに揃えるため本ファイルに含める。
--
-- 運用手順:
--   1. schema.prisma を変更したら、まず `npm run db:migrate` (= prisma migrate dev) を実行する
--   2. 生成された prisma/migrations/<timestamp>_xxx/migration.sql の末尾に、
--      対応する内容を本ファイルからコピーして追記する
--      （もしくは本ファイルの内容をそのままpsql等で直接実行してもよい。ただし将来
--        `prisma migrate reset` 等でDBを作り直す際は、追記を忘れると制約が失われる点に注意）
--   3. schema.prisma・database-design.md・本ファイルの3つは常に同じ内容を保つこと
--
-- pgcrypto / pg_trgm 拡張自体は schema.prisma の datasource ブロックで
-- `extensions = [pgcrypto, pg_trgm]` として宣言済みのため、migrate dev 実行時に
-- CREATE EXTENSION は自動的に生成される。本ファイルには含めない。

-- ============================================================
-- 2.1 マスタ系
-- ============================================================

-- area: 都道府県(prefecture)はparent_idを持たず、エリア(area)は必ず親を持つ
ALTER TABLE area
  ADD CONSTRAINT area_parent_matches_level
  CHECK (
    (level = 'prefecture' AND parent_id IS NULL) OR
    (level = 'area' AND parent_id IS NOT NULL)
  );

ALTER TABLE area
  ADD CONSTRAINT area_level_check
  CHECK (level IN ('prefecture', 'area'));

-- place_master: データ取得元
ALTER TABLE place_master
  ADD CONSTRAINT place_master_source_check
  CHECK (source IN ('ai_collected', 'user_submitted'));

-- 日本語の部分一致検索用（to_tsvectorは日本語を単語分割できないためtrigramを使う）
CREATE INDEX idx_place_master_name_trgm ON place_master USING gin (name gin_trgm_ops);

-- ============================================================
-- 2.2 ユーザーサイト（UserAccount）
-- ============================================================

ALTER TABLE user_account
  ADD CONSTRAINT user_account_gender_check
  CHECK (gender IN ('male', 'female', 'other', 'no_answer'));

ALTER TABLE user_account
  ADD CONSTRAINT user_account_age_check
  CHECK (age IS NULL OR (age >= 0 AND age <= 120));

ALTER TABLE user_account
  ADD CONSTRAINT user_account_status_check
  CHECK (status IN ('active', 'suspended'));

ALTER TABLE subscription
  ADD CONSTRAINT subscription_plan_check
  CHECK (plan IN ('free', 'premium'));

-- ============================================================
-- 2.3 プランナーサイト（PlannerAccount）
-- ============================================================

ALTER TABLE planner_account
  ADD CONSTRAINT planner_account_gender_check
  CHECK (gender IN ('male', 'female', 'other', 'no_answer'));

ALTER TABLE planner_account
  ADD CONSTRAINT planner_account_age_check
  CHECK (age IS NULL OR (age >= 0 AND age <= 120));

ALTER TABLE planner_account
  ADD CONSTRAINT planner_account_status_check
  CHECK (status IN ('active', 'suspended'));

-- ============================================================
-- 2.4 管理者サイト（Admin）
-- ============================================================

ALTER TABLE admin
  ADD CONSTRAINT admin_role_check
  CHECK (role IN ('super', 'staff'));

ALTER TABLE admin
  ADD CONSTRAINT admin_status_check
  CHECK (status IN ('invited', 'active', 'disabled'));

-- status='active'のadminは必ずpassword_hashを持つ（招待中はNULL許容）
ALTER TABLE admin
  ADD CONSTRAINT admin_password_required_when_active
  CHECK (status <> 'active' OR password_hash IS NOT NULL);

-- ============================================================
-- 2.5 しおり本体
-- ============================================================

ALTER TABLE itinerary
  ADD CONSTRAINT itinerary_nights_check
  CHECK (nights >= 0);

ALTER TABLE itinerary
  ADD CONSTRAINT itinerary_status_check
  CHECK (status IN ('draft', 'pending', 'published', 'rejected', 'private', 'deleted'));

-- タイトル部分一致検索用（pg_trgm、2.1節と同じ理由）
CREATE INDEX idx_itinerary_title_trgm ON itinerary USING gin (title gin_trgm_ops);

ALTER TABLE day
  ADD CONSTRAINT day_number_check
  CHECK (day_number >= 1);

ALTER TABLE spot
  ADD CONSTRAINT spot_stay_duration_min_check
  CHECK (stay_duration_min IS NULL OR stay_duration_min >= 0);

ALTER TABLE spot
  ADD CONSTRAINT spot_transit_mode_check
  CHECK (transit_mode IN ('walk', 'train', 'bus', 'car', 'taxi', 'other'));

ALTER TABLE spot
  ADD CONSTRAINT spot_transit_duration_min_check
  CHECK (transit_duration_min IS NULL OR transit_duration_min >= 0);

-- 路線名(transit_line)は移動手段が電車・バスのときのみ設定可能
ALTER TABLE spot
  ADD CONSTRAINT spot_transit_line_only_for_train_bus
  CHECK (transit_line IS NULL OR transit_mode IN ('train', 'bus'));

-- ============================================================
-- 2.6 エンゲージメント（お気に入り・コメント・通報・共有・リクエスト）
-- ============================================================

ALTER TABLE report
  ADD CONSTRAINT report_target_type_check
  CHECK (target_type IN ('itinerary', 'comment'));

ALTER TABLE report
  ADD CONSTRAINT report_status_check
  CHECK (status IN ('unread', 'resolved', 'dismissed'));

ALTER TABLE share_log
  ADD CONSTRAINT share_log_platform_check
  CHECK (platform IN ('x', 'facebook', 'line', 'other'));

ALTER TABLE request
  ADD CONSTRAINT request_status_check
  CHECK (status IN ('unread', 'read', 'responded'));

-- ============================================================
-- updated_at 自動更新トリガー（2.0節の共通関数 + 各テーブルへの適用）
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_account_updated_at BEFORE UPDATE ON user_account
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_planner_account_updated_at BEFORE UPDATE ON planner_account
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_admin_updated_at BEFORE UPDATE ON admin
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_itinerary_updated_at BEFORE UPDATE ON itinerary
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
