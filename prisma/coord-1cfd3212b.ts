/**
 * 日帰りの座標の直し（A・B）: 1cfd3212 のつづき（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - coord-1cfd3212.ts（11/03）で、郡上八幡旧庁舎記念館の点を確かめずに残した（制作補助2の見落とし、b79dfc58 の作業で見つけた）
 * - 郡上八幡旧庁舎記念館 35.752441,136.959213（約290m北）→ OSM「郡上八幡旧庁舎」building way585997742（Nominatim 35.7498619,136.9593734。b79dfc58 と同じ点）
 * 歩く時間（routed-foot、実測 ≤ 今の値 ≤ 上限）: やなか水のこみち→旧庁舎 3.2 ≤ 6 ≤ 10、旧庁舎→いがわ小径 1.0 ≤ 4 ≤ 7。変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-1cfd3212b.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("1cfd3212-087f-4da3-90a2-52db7da81e0b", [
  {
    id: "0a32714d-060d-4fe4-9515-a6ed2b6cac24",
    label: "郡上八幡旧庁舎記念館",
    point: { from: [35.752441, 136.959213], to: [35.7498619, 136.9593734], source: "OSM 郡上八幡旧庁舎 building way585997742（Nominatim）" },
  },
]);
