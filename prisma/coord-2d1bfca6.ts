/**
 * 日帰りの座標の直し（A）: 2d1bfca6（長浜城と黒壁スクエア、豊臣秀吉ゆかりの城下町を歩く日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md。点だけを直す（どちらも25m以内の移動で、歩く分・時刻・文は変わらない）
 * - 長浜城歴史博物館 35.3775,136.2611（4けた）→ OSM tourism=museum node298348191 35.3776570,136.2612810（3993afce と同じ点）
 * - 長浜鉄道スクエア 35.376723,136.266（経度3けた。OSM「旧長浜駅舎」building=train_station way541462754 の値の丸め）
 *   → OSM「長浜鉄道スクエア」tourism=museum way854120758 35.3768446,136.2658708（8662231d・3993afce と同じ点。同じ場所は同じ点）
 * - 慶雲館（way541463079）は OSM の値の丸めなので直さない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-2d1bfca6.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("2d1bfca6-d5ae-42a2-bccb-dd385c3a3177", [
  {
    id: "c0c66ce1-794b-4dae-b9de-d8bb3509c7fc",
    label: "長浜城歴史博物館",
    point: { from: [35.3775, 136.2611], to: [35.377657, 136.261281], source: "OSM 長浜城歴史博物館 node298348191" },
  },
  {
    id: "4bab6035-e1a0-49b3-9fc8-370007669c8d",
    label: "長浜鉄道スクエア",
    point: { from: [35.376723, 136.266], to: [35.3768446, 136.2658708], source: "OSM 長浜鉄道スクエア way854120758" },
  },
]);
