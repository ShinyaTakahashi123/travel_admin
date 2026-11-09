/**
 * 日帰りの座標の直し（A・B）: 3bf609b2（竈門神社と光明禅寺、太宰府の縁結びと史跡を巡るプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 竈門神社 33.528861,130.552389（秒の形）→ OSM place_of_worship way1180032939 33.5288297,130.5524449（0c357818・3bc5f590・9f58d4de と同じ点）
 * - 太宰府天満宮 33.521528,130.534861（秒の形）→ OSM place_of_worship way1353165321 33.5213084,130.5352564（ba8c13f1 と同じ点。約43m）
 * - 坂本八幡宮 33.516778,130.513472（秒の形）→ OSM place_of_worship node1204189118 33.5167742,130.5134753（9f58d4de と同じ点）
 * 時間: 竈門神社→天満宮 routed-car 2,344m 3.6分（車10のまま）、天満宮→九州国立博物館 routed-foot 917m 12.2分（10→13）、
 *   光明禅寺→坂本八幡宮 routed-car 2,685m 6.0分（車10のまま）、坂本八幡宮→政庁跡 routed-foot 401m 5.4分（8のまま）。
 *   上限内の滞在は縮めず、始まりを 9:30→9:27 にして、博物館 11:40 からあとはそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-3bf609b2.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("3bf609b2-ae6f-44ac-8c77-801dc4c56157", [
  {
    id: "c5d80b7f-f8c4-4ba1-913c-f7aa698dab1b",
    label: "竈門神社",
    point: { from: [33.528861, 130.552389], to: [33.5288297, 130.5524449], source: "OSM 竈門神社 place_of_worship way1180032939" },
    time: { from: "09:30", to: "09:27" },
  },
  {
    id: "45ed29f2-5a42-4b81-8f9c-bd192695aee4",
    label: "太宰府天満宮",
    point: { from: [33.521528, 130.534861], to: [33.5213084, 130.5352564], source: "OSM 太宰府天満宮 place_of_worship way1353165321" },
    time: { from: "10:30", to: "10:27" },
  },
  {
    id: "dcf30e5c-fc7a-4905-87e2-b18164d1038a",
    label: "九州国立博物館",
    legs: { from: [{ mode: "walk", min: 10 }], to: [{ mode: "walk", min: 13 }] },
    memo: [{ from: "連絡通路を通って徒歩10分ほどです。", to: "連絡通路を通って徒歩13分ほどです。" }],
  },
  {
    id: "6e30797f-2f9b-477d-bf18-8b0bae64d28e",
    label: "坂本八幡宮",
    point: { from: [33.516778, 130.513472], to: [33.5167742, 130.5134753], source: "OSM 坂本八幡宮 place_of_worship node1204189118" },
  },
]);
