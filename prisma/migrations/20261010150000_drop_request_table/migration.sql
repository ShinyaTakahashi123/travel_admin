-- リクエスト機能(電気通信事業法の届出への対応で2026-09-24に停止、
-- schema.prismaからのモデル削除は2026-10-08)の表を削除する。
-- 自身に定義された索引・外部キー制約(planner_account/user_account/itineraryへの3つ)は
-- 表の削除とあわせて自動的に削除される。ほかの表からrequestへの外部キーはない
DROP TABLE "request";
