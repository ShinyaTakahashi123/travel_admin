/**
 * 日帰りの座標の直し（A・B）: 66258009（湯布院フローラルヴィレッジ、絵本の世界を体感するプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 湯布院フローラルヴィレッジ 33.2675,131.3656（4けた）→ OSM「湯布院フローラルビレッジ」tourism=attraction way1323836250 33.2675137,131.365641（約2m）
 * - 金鱗湖（way162781794）は OSM の値の丸めなので直さない
 * 歩く時間（routed-foot）: フローラルヴィレッジ→由布院駅 1,196m 16.0分（15→16）。上限内の滞在は縮めず、始まりを 9:30→9:29 にして、駅 10:45 からあとはそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-66258009.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("66258009-2007-49b0-a1b5-fdb3131a4b15", [
  {
    id: "6c72cfbc-3049-4003-9252-b275a316d94e",
    label: "湯布院フローラルヴィレッジ",
    point: { from: [33.2675, 131.3656], to: [33.2675137, 131.365641], source: "OSM 湯布院フローラルビレッジ tourism=attraction way1323836250" },
    time: { from: "09:30", to: "09:29" },
  },
  {
    id: "ec3a4a3a-3c08-4ed3-9ea2-998df4e0b1f9",
    label: "由布院駅",
    legs: { from: [{ mode: "walk", min: 15 }], to: [{ mode: "walk", min: 16 }] },
  },
]);
