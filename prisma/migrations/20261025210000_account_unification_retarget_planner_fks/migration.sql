-- アカウント統合(docs/specs/20261025-account-unification-detailed.md 3節)。
-- Itinerary・PlannerServiceArea・PlannerSpecialtyTagの外部キーの参照先を
-- PlannerAccountからUserAccountへ付け替える。
--
-- NOT VALIDで追加する: この時点でplanner_account_idの値はまだPlannerAccount側の
-- idのままで、対応するUserAccountの行は(移しかえスクリプトがまだ)存在しないため、
-- 既存の行を即座には検証させない。移しかえスクリプトが全行をUserAccountへ
-- 複製・付け替えた後、段階9の前に「ALTER TABLE ... VALIDATE CONSTRAINT ...」で検証する。
--
-- ON DELETE RESTRICT(元はCASCADE): 移しかえが終わるまでUserAccountの行を誤って
-- 削除できないようにする、DB側の安全策(セキュリティ指摘2026-10-25。
-- 2026-10-25に開発用DBでしおりが連鎖削除された事故を受けて)。

-- Itinerary
ALTER TABLE "itinerary" DROP CONSTRAINT "itinerary_planner_account_id_fkey";
ALTER TABLE "itinerary" ADD CONSTRAINT "itinerary_planner_account_id_fkey"
  FOREIGN KEY ("planner_account_id") REFERENCES "user_account"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE NOT VALID;

-- PlannerServiceArea
ALTER TABLE "planner_service_area" DROP CONSTRAINT "planner_service_area_planner_account_id_fkey";
ALTER TABLE "planner_service_area" ADD CONSTRAINT "planner_service_area_planner_account_id_fkey"
  FOREIGN KEY ("planner_account_id") REFERENCES "user_account"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE NOT VALID;

-- PlannerSpecialtyTag
ALTER TABLE "planner_specialty_tag" DROP CONSTRAINT "planner_specialty_tag_planner_account_id_fkey";
ALTER TABLE "planner_specialty_tag" ADD CONSTRAINT "planner_specialty_tag_planner_account_id_fkey"
  FOREIGN KEY ("planner_account_id") REFERENCES "user_account"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE NOT VALID;
