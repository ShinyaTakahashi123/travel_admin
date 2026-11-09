/**
 * 日帰りの座標の直し（A・B）: 6dd8f74f（高崎白衣大観音と少林山達磨寺、観音山と城下をめぐる高崎日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 少林山達磨寺 36.330556,138.956944（秒の形）→ OSM amenity=place_of_worship way256525207 36.3299126,138.9573627（6de84372・a4ee710d と同じ点。約81m）
 * - 高崎白衣大観音 36.310944,138.980528（秒の形）→ OSM historic=monument node1736439895 36.3109646,138.980551（観音像そのもの。6de84372・a4ee710d と同じ点。約3m）
 * 時間: 達磨寺→白衣大観音 routed-car 4,717m 9.5分（15のまま）、白衣大観音→清水寺 routed-foot 874m 11.7分（13のまま）。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-6dd8f74f.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("6dd8f74f-2e9c-4921-9608-757f5970696d", [
  {
    id: "bd412616-f94a-4c0e-aa93-47909ad0d070",
    label: "少林山達磨寺",
    point: { from: [36.330556, 138.956944], to: [36.3299126, 138.9573627], source: "OSM 少林山達磨寺 place_of_worship way256525207" },
  },
  {
    id: "18d7ab68-3818-4a6a-b4f6-93a8bf152c95",
    label: "高崎白衣大観音",
    point: { from: [36.310944, 138.980528], to: [36.3109646, 138.980551], source: "OSM 高崎白衣大観音 historic=monument node1736439895（観音像）" },
  },
]);
