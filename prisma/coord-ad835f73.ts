/**
 * 日帰りの座標の直し（A）: ad835f73（熊野那智大社と那智の滝、大門坂の熊野古道を歩く日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md。点だけを直す（約10mの移動で、分・時刻・文は変わらない）
 * - 那智の滝 33.675278,135.8875（秒の形）→ OSM「那智滝」waterway=waterfall node975026052 33.6752833,135.8876266（4124d576 と同じ点）
 * - 補陀洛山寺・浜の宮王子跡（補陀洛山寺 way218695969）・天然温泉公衆浴場はまゆ（way706629095）は OSM の値の丸めなので直さない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-ad835f73.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("ad835f73-423a-47da-9130-7f2c5e7c289b", [
  {
    id: "5934fa83-9f22-41a4-b951-769e93b1a30b",
    label: "那智の滝",
    point: { from: [33.675278, 135.8875], to: [33.6752833, 135.8876266], source: "OSM 那智滝 waterway=waterfall node975026052" },
  },
]);
