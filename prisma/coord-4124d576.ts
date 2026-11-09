/**
 * 日帰りの座標の直し（B）: 4124d576（熊野古道 大門坂、世界遺産の参詣道を歩く定番日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md。点だけを直す（約10mの移動で、分・時刻・文は変わらない）
 * - 那智の滝 33.675278,135.8875（秒の形）→ OSM「那智滝」waterway=waterfall node975026052 33.6752833,135.8876266
 * - 補陀洛山寺（way218695969）は OSM の値の丸めなので直さない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-4124d576.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("4124d576-4cd8-4086-b61e-9cd8a9576115", [
  {
    id: "204b0fb3-cb5b-4d75-83bb-c1ba7dae3684",
    label: "那智の滝",
    point: { from: [33.675278, 135.8875], to: [33.6752833, 135.8876266], source: "OSM 那智滝 waterway=waterfall node975026052" },
  },
]);
