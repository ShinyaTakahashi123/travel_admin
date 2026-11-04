/**
 * 同じ場所の点をそろえる: fb532960（原爆ドームと平和記念公園、定番の平和学習日帰りプラン）の縮景園（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md（998ecdfc の欄②、企画運営の判断 11/04: 縮景園は4本とも「北門」にそろえる）
 * - 縮景園 34.400338,132.467449（面の中心）→ 名前のある入口「北門」entrance=yes node13132914674（34.401448,132.466374。998ecdfc と同じ点）
 * 歩く時間（routed-foot）: 八丁堀の電停 node420034245 →北門 1019m 13.6 ≤ 15 ≤ 26（今の点へは 14.4）。walk/10+train/10+walk/15 は変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-fb532960.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("fb532960-0b0c-4170-948e-d484b575f739", [
  {
    id: "b36f198f-7897-4816-bb0e-0e549bdd6528",
    label: "縮景園",
    point: { from: [34.400338, 132.467449], to: [34.401448, 132.466374], source: "OSM 北門 entrance=yes node13132914674（998ecdfc と同じ点）" },
  },
]);
