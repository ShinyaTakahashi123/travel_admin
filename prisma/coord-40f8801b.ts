/**
 * 日帰りの座標の直し（A・B）: 40f8801b（堂崎天主堂、五島のキリシタンの歴史をたどる定番日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 堂崎天主堂 32.755861,128.837194（秒の形）→ OSM tourism=museum way734662407 32.7558714,128.8372523（7d6f199f と同じ点。約5m）
 * - 水ノ浦教会（node6326615995）は OSM の値の丸めなので直さない
 * 車の時間（routed-car）: 堂崎天主堂→楠原教会 16,820m 18.3分（25のまま）。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-40f8801b.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("40f8801b-fa0c-4c22-9744-4992fcb77d19", [
  {
    id: "6c29617f-1a2c-4980-8407-18fd5f4979ac",
    label: "堂崎天主堂",
    point: { from: [32.755861, 128.837194], to: [32.7558714, 128.8372523], source: "OSM 堂崎天主堂 tourism=museum way734662407" },
  },
]);
