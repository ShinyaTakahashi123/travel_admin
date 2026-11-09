/**
 * 日帰りの座標の直し（A・B）: aec8eadc（雪の大谷ウォークと黒部ダム、迫力の大自然を体感するプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 室堂 36.5719,137.6011（4けた。室堂ターミナルから約700m東）→ 高原バスで着くバス停「室堂」highway=bus_stop node8456480871 36.5771409,137.5956865（f3ee1b04 と同じ点）
 * - 黒部ダム 36.5658,137.6486（4けた。黒部平駅のそばで、ダムから約1.3km西）→ OSM「黒部ダム」waterway=dam way57033637（Nominatim 36.5666941,137.6636386）
 *   （メモは「黒部湖へ出たあと、ダムの堰堤を歩いて」で、ダムそのものが行き先）
 * - 美女平 way542438921・大観峰 way197886842・黒部平 node711976380 は6けたの丸めで、直しても変わらない
 * 移動: 高原バス・トロリーバス・ロープウェイ・ケーブルカーで、点の直しでは変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-aec8eadc.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("aec8eadc-75da-4179-8c8c-013bb4b3c01f", [
  {
    id: "a8b176a6-2901-4960-a2e9-a676a9c05e80",
    label: "室堂",
    point: { from: [36.5719, 137.6011], to: [36.5771409, 137.5956865], source: "OSM 室堂 highway=bus_stop node8456480871" },
  },
  {
    id: "45ac0223-32ac-44c5-84d1-e26a3db52e9f",
    label: "黒部ダム",
    point: { from: [36.5658, 137.6486], to: [36.5666941, 137.6636386], source: "OSM 黒部ダム waterway=dam way57033637（Nominatim）" },
  },
]);
