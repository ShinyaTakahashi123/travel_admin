/**
 * 同じ場所の点をそろえる: a37b8c79（東大寺と春日大社、薬師寺と唐招提寺をめぐり御朱印をいただく奈良1泊2日）の東大寺（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md（7f972333 の欄、企画運営の判断 11/04: 東大寺は着く側の門「南大門」にそろえる）
 * - 東大寺 34.689065,135.839873（大仏殿のそば）→「南大門」building=roof way43558121（34.685812,135.839843）
 * 1日目の1か所目（JR奈良駅からバス、東大寺大仏殿のバス停から歩く）。歩く時間（routed-foot）: 南大門→東大寺のあたりで昼食 187m 2.5 ≤ 4 ≤ 9。変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-a37b8c79.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("a37b8c79-85e0-4c3d-b2c6-94057033f31a", [
  {
    id: "22de220b-2413-458c-a043-0625c6f74f3e",
    label: "東大寺",
    point: { from: [34.689065, 135.839873], to: [34.685812, 135.839843], source: "OSM 南大門 building=roof way43558121" },
  },
]);
