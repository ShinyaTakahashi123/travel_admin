/**
 * 日帰りの座標の直し（A・B）: e4b7d41b（湯畑と西の河原公園、草津温泉街を歩く定番日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 草津町温泉図書館 36.6207,138.5965（4けた）→ OSM「温泉図書館」tourism=museum node1742251452（36.620695,138.596497、約1m）
 * - 湯畑 36.62266,138.59655 は案内板「名勝『湯畑』」tourism=information node12143440669 の点（7章）→ 「湯畑源泉」natural=hot_spring node8845986107（36.622708,138.596598、約7m）
 * - 熱乃湯 way954629638・光泉寺 way1311927446・地蔵源泉 node8842212099・大滝乃湯 way954651338・白根神社 way954982172 は1〜5m
 * 歩く時間（routed-foot、実測 ≤ 今の値 ≤ 上限）: 0.0 ≤ 5 ≤ 5、2.0 ≤ 5 ≤ 8、4.9 ≤ 10 ≤ 13、4.4 ≤ 10 ≤ 12、8.5 ≤ 15 ≤ 18、10.5 ≤ 15 ≤ 21、13.1 ≤ 20 ≤ 25。変えない。点だけ
 * 大滝乃湯の中の昼食・題の「定番」は組み直しの欄へ（企画運営・法務 11/04）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-e4b7d41b.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("e4b7d41b-b1a3-464f-ba14-431c01970e13", [
  {
    id: "1eb12528-7efd-4cac-92d2-ffb08392d105",
    label: "湯畑",
    point: { from: [36.62266, 138.59655], to: [36.622708, 138.596598], source: "OSM 湯畑源泉 natural=hot_spring node8845986107" },
  },
  {
    id: "f77a94a3-fe3d-4e95-a700-ae3db0a1368b",
    label: "草津町温泉図書館",
    point: { from: [36.6207, 138.5965], to: [36.620695, 138.596497], source: "OSM 温泉図書館 tourism=museum node1742251452" },
  },
]);
