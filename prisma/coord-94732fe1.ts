/**
 * 日帰りの座標の直し（A・B）: 94732fe1（高千穂峡と真名井の滝、渓谷ボート日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 高千穂神社 32.706444,131.302306（0.1秒の形）→ OSM amenity=place_of_worship way757459506（Nominatim 32.7066706,131.3018922。8ddcabc5・4051e181 と同じ点、約45m）
 * - 高千穂町歴史民俗資料館 32.715633,131.303314 → OSM tourism=museum node1423885309（32.7152120,131.3033220。8ddcabc5 と同じ点、約47m）
 * - 高千穂峡 node4563512590・槵觸神社（8ddcabc5・4051e181 と同じ値）・天岩戸神社 node5087204138・天安河原 node4478900293・総合公園（バス停 node5518443521）は直しても変わらない
 * 車の時間（routed-car）: 槵觸→高千穂神社 2.8分（6のまま、上限10）、高千穂神社→天岩戸神社 8.6分（14のまま、上限18）、天安河原→資料館 8.2分（15のまま、上限18）。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-94732fe1.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("94732fe1-b3b9-49ce-8ebc-d610b6c19062", [
  {
    id: "a8ab0834-4652-4fae-a5e5-babfdd416b66",
    label: "高千穂神社",
    point: { from: [32.706444, 131.302306], to: [32.7066706, 131.3018922], source: "OSM 高千穂神社 amenity=place_of_worship way757459506（Nominatim）" },
  },
  {
    id: "f87c60a3-3795-4219-8e1b-dc0d2f12ff03",
    label: "高千穂町歴史民俗資料館",
    point: { from: [32.715633, 131.303314], to: [32.715212, 131.303322], source: "OSM 高千穂町歴史民俗資料館 tourism=museum node1423885309" },
  },
]);
