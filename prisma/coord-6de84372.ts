/**
 * 日帰りの座標の直し（A・B）: 6de84372（群馬県立近代美術館と高崎城址、アートと歴史を楽しむ日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 群馬県立近代美術館 36.298722,139.078639（秒の形）→ OSM tourism=museum way632373587 36.2987872,139.0783836（約24m）
 * - 群馬県立歴史博物館（node1420713236）は OSM の値の丸めなので直さない
 * 歩く時間（routed-foot）: 近代美術館→歴史博物館 420m 5.6分（2→6）。上限内の滞在は縮めず、始まりを 9:30→9:26 にして、歴史博物館 10:42 からあとはそのまま。
 *   メモに分の書き出しはないので、文は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-6de84372.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("6de84372-3d1e-4106-bcb2-f881ee14b8b4", [
  {
    id: "1f36ff26-6705-41db-b66b-08cb012d8b8e",
    label: "群馬県立近代美術館",
    point: { from: [36.298722, 139.078639], to: [36.2987872, 139.0783836], source: "OSM 群馬県立近代美術館 tourism=museum way632373587" },
    time: { from: "09:30", to: "09:26" },
  },
  {
    id: "67175166-c233-4b11-9d17-0d86303b2ed1",
    label: "群馬県立歴史博物館",
    legs: { from: [{ mode: "walk", min: 2 }], to: [{ mode: "walk", min: 6 }] },
  },
]);
