/**
 * 日帰りの座標の直し（A・B）: 4edf365d（花の窟神社と七里御浜、熊野古道の峠道を歩く信仰の旅）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 松本峠 33.895917,136.1125（経度4けた）→ OSM「松本峠」mountain_pass node10314577233 33.8959011,136.1124682（68209eb1 と同じ点）
 * - 花の窟神社 33.879861,136.093333（秒の形）→ OSM amenity=place_of_worship node3504996107 33.8798309,136.0933864（68209eb1 と同じ点）
 * - 神倉神社（way500803106）は OSM の値の丸めなので直さない
 * 時間: 松本峠→七里御浜 routed-foot 2,556m 34.1分（歩30→35）、七里御浜→花の窟 routed-car 3,815m 6.3分（車15のまま。上限 14.4 を丸めて15）、
 *   花の窟→産田 1,852m 3.1分（車5のまま）。始まりを 9:30→9:25 にして、七里御浜 10:55 からあとはそのまま（上限内の滞在は縮めない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-4edf365d.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("4edf365d-2ff6-41a0-8235-7b070b83db63", [
  {
    id: "5c4e1699-d8a5-41f2-bd24-b3d6bf49dc4f",
    label: "松本峠",
    point: { from: [33.895917, 136.1125], to: [33.8959011, 136.1124682], source: "OSM 松本峠 mountain_pass node10314577233" },
    time: { from: "09:30", to: "09:25" },
  },
  {
    id: "cfa23c83-b2aa-4f69-99e0-072e5f6260c1",
    label: "七里御浜",
    legs: { from: [{ mode: "walk", min: 30 }], to: [{ mode: "walk", min: 35 }] },
  },
  {
    id: "f6f8c171-00ca-43a0-bbe8-1917f5750d2b",
    label: "花の窟神社",
    point: { from: [33.879861, 136.093333], to: [33.8798309, 136.0933864], source: "OSM 花の窟神社 place_of_worship node3504996107" },
  },
]);
