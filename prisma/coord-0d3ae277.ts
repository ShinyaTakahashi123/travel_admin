/**
 * 日帰りの座標の直し（A・B）: 0d3ae277（一目千本、桜の名所・吉野山を巡る日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md。点だけを直す（分・時刻・文は変わらない）
 * - 高城山展望台 34.3466,135.8622（4けた。約1.5km西）→ OSM「高城山休憩所」tourism=viewpoint node2863468101 34.3505250,135.8779574
 *   （高城山の山頂 natural=peak node2863468601 から33m。同じ名前のバス停 node2863464401 は施設の点でないので使わない）
 * - 吉野水分神社 34.3403,135.8636（4けた。約1.5km南西）→ OSM amenity=place_of_worship way218659903 34.3539555,135.8731109（ecdd6ad8 と同じ）
 * - 竹林院群芳園 34.358,135.8654（3けた）→ OSM「竹林院」amenity=place_of_worship way470662668 34.3602705,135.8628548（ecdd6ad8 と同じ）
 * - 金峯山寺 34.36825,135.858167（0.1秒の形）→ OSM amenity=place_of_worship way1340388235 34.3683328,135.8588339（0d8b6309 と同じ）
 * - 吉水神社 34.3673,135.8619（4けた）→ OSM amenity=place_of_worship way218660992 34.3672859,135.8618984（0d8b6309・ecdd6ad8 と同じ）
 * 歩く時間（routed-foot）: 高城山休憩所→水分神社 698m 9.3分（10のまま）、竹林院→金峯山寺 1,153m 15.4分（16のまま）、金峯山寺→吉水神社 594m 7.9分（11のまま）、
 *   吉水神社→如意輪寺 1,347m 19.3分（20のまま）。水分神社→竹林院のバス10は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-0d3ae277.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("0d3ae277-170b-4e8a-a5ed-54b2034287a0", [
  {
    id: "749607cf-1f60-4180-9a3c-a834f26ae74a",
    label: "高城山展望台",
    point: { from: [34.3466, 135.8622], to: [34.350525, 135.8779574], source: "OSM 高城山休憩所 tourism=viewpoint node2863468101" },
  },
  {
    id: "d74ae26e-9bd5-488b-9bf8-14a49f9f1726",
    label: "吉野水分神社",
    point: { from: [34.3403, 135.8636], to: [34.3539555, 135.8731109], source: "OSM 吉野水分神社 way218659903" },
  },
  {
    id: "b741dfde-213d-4275-ab93-987e03ccba9d",
    label: "竹林院群芳園",
    point: { from: [34.358, 135.8654], to: [34.3602705, 135.8628548], source: "OSM 竹林院 place_of_worship way470662668" },
  },
  {
    id: "eae508ca-369a-4adc-af1d-4d0d7518a17c",
    label: "金峯山寺",
    point: { from: [34.36825, 135.858167], to: [34.3683328, 135.8588339], source: "OSM 金峯山寺 way1340388235" },
  },
  {
    id: "400f61d8-f9c4-468d-bb2e-5623ed15558e",
    label: "吉水神社",
    point: { from: [34.3673, 135.8619], to: [34.3672859, 135.8618984], source: "OSM 吉水神社 way218660992" },
  },
]);
