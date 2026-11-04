/**
 * 日帰りの座標の直し（A・B）: 7d477150（熊野本宮大社と大斎原、世界遺産・熊野古道の聖地を巡る日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 大斎原 33.834655,135.774411（way299050053 の面の中心）→ メモに「入口には…大鳥居が立っています」とある入口の
 *   「大鳥居」man_made=ceremonial_gate,tourism=attraction way1127649070（Nominatim 33.8358362,135.7755598、約150m）
 * - 湯の峰温泉 33.8287,135.757563 は OSM のバス停「湯の峰温泉」highway=bus_stop node2822853461（33.8286995,135.7575631）の丸め（約1m）。
 *   メモは「本宮からバスで湯の峰温泉へ」で、着く場所のバス停の点にするが、丸めた値は残さない決まりなので OSM の元の値にそろえる（企画運営 11/04）
 * 歩く時間: 熊野本宮大社→大鳥居は、routed-foot が大鳥居を約210m離れた道に寄せてしまい測れない（4.9km・65分と出る）。
 *   まっすぐの長さは約530m（メモも「500mほど」）で、歩いて8〜9分ほど。もとの歩10は範囲の中なので変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-7d477150.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("7d477150-6dba-472c-8a1f-7ef6c5812428", [
  {
    id: "7a8987c9-7daf-44a8-bd25-8fd6338cbfbd",
    label: "大斎原",
    point: { from: [33.834655, 135.774411], to: [33.8358362, 135.7755598], source: "OSM 大鳥居 man_made=ceremonial_gate,tourism=attraction way1127649070（Nominatim）" },
  },
  {
    id: "50ba0aa0-d6e3-4ca5-8f3c-8bf57c2d82ea",
    label: "湯の峰温泉",
    point: { from: [33.8287, 135.757563], to: [33.8286995, 135.7575631], source: "OSM 湯の峰温泉 highway=bus_stop node2822853461" },
  },
]);
