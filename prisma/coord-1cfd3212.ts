/**
 * 日帰りの座標の直し（A・B）: 1cfd3212（慈恩禅寺の名園と郡上本染、藍と禅をたずねる郡上八幡日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 慈恩禅寺 35.748111,136.961556（秒の形）→ OSM amenity=place_of_worship node4829451723 35.7477135,136.9615398（約45m）
 * - 職人町・鍛冶屋町 35.75341,136.955917（5けた。地名の点 node8732430657「八幡町職人町」）→ OSM「鍛冶屋町 Kajiya Machi」tourism=attraction
 *   node4829416221 35.7515383,136.9562835（地名の点は使わない。約210m南）
 * - 郡上八幡城（way585995159）は OSM の値の丸めなので直さない
 * 歩く時間（routed-foot）: 駅→慈恩禅寺 1,718m 23.0分（18→23）、慈恩禅寺→染物店 238m 3.2分（10のまま。上限9.75の切り上げ）、
 *   染物店→鍛冶屋町 548m 7.3分（15のまま）、鍛冶屋町→郡上八幡城 1,072m 14.3分（7→15）。
 *   上限内の滞在は縮めず、始まりを 9:00→8:47 にして、郡上八幡城 13:30 からあとはそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-1cfd3212.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("1cfd3212-087f-4da3-90a2-52db7da81e0b", [
  { id: "f1910bb0-42fa-4dec-b36f-b1fa2e908378", label: "郡上八幡駅", time: { from: "09:00", to: "08:47" } },
  {
    id: "c14882c4-dcbf-4325-a1de-fa8db6a1b55c",
    label: "慈恩禅寺",
    point: { from: [35.748111, 136.961556], to: [35.7477135, 136.9615398], source: "OSM 慈恩禅寺 place_of_worship node4829451723" },
    time: { from: "09:38", to: "09:30" },
    legs: { from: [{ mode: "walk", min: 18 }], to: [{ mode: "walk", min: 23 }] },
    memo: [{ from: "郡上八幡駅から歩いておよそ18分、", to: "郡上八幡駅から歩いておよそ23分、" }],
  },
  { id: "be1b0886-defa-4811-ba7a-435952e0fe3b", label: "郡上本染 渡辺染物店", time: { from: "10:48", to: "10:40" } },
  {
    id: "e8e785b7-a8a9-4d88-88d1-2974c6be1463",
    label: "職人町・鍛冶屋町",
    point: { from: [35.75341, 136.955917], to: [35.7515383, 136.9562835], source: "OSM 鍛冶屋町 tourism=attraction node4829416221" },
    time: { from: "11:53", to: "11:45" },
  },
  {
    id: "d341941c-f2af-42da-95e7-0b746a13c8ca",
    label: "郡上八幡城",
    legs: { from: [{ mode: "walk", min: 7 }], to: [{ mode: "walk", min: 15 }] },
    memo: [{ from: "職人町・鍛冶屋町から歩いておよそ7分、", to: "職人町・鍛冶屋町から歩いておよそ15分、" }],
  },
]);
