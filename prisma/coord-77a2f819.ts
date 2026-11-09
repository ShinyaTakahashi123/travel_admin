/**
 * 日帰りの座標の直し（A・B）: 77a2f819（もみじの永観堂から哲学の道へ。東山の紅葉名所さんぽ）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 哲学の道 35.0229,135.7944（4けた）→ OSM「哲学の道」highway=footway,tourism=attraction way196173120（Nominatim 35.0225183,135.7949888、約70m）。
 *   もとの点と同じく道の中ほど（永観堂から歩15・銀閣寺へ歩10 はこの位置で合う）
 * - 金戒光明寺 35.019639,135.788028（0.1秒の形）→ OSM place_of_worship way317681824（Nominatim 35.0194851,135.7886067、約55m）
 * - 平安神宮 35.0161,135.7822（4けた）→ OSM place_of_worship way619903245（Nominatim 35.0160683,135.7828961。01de69f8・fc54731b・2eb3162a と同じ点）
 * 歩く時間（routed-foot）: 永観堂→哲学の道 14.2分（15のまま）、哲学の道→銀閣寺 9.7分（10のまま）、真如堂→金戒光明寺 628m 7.8分（5→8）、
 *   金戒光明寺→岡崎神社 4.4分（8のまま）、岡崎神社→平安神宮 1138m 15.2分（10→16）
 * 時刻: 合わせて9分のびる。上限を超える滞在がないため、始まりを 9:00→8:51 にする（南禅寺の方丈は8:40から）。平安神宮 16:03 はそのまま
 * メモ: 岡崎神社の終わり「すぐそばの平安神宮」と平安神宮の書き出しの分、平安神宮の「眺めてください」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-77a2f819.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("77a2f819-ec53-4d8c-a0d9-b736a3e35f1e", [
  { id: "068645d5-881c-45e6-9609-b826a10346b1", label: "南禅寺", time: { from: "09:00", to: "08:51" } },
  { id: "29004fa5-db26-4ed0-811c-12fc3b510564", label: "永観堂（禅林寺）", time: { from: "10:05", to: "09:56" } },
  {
    id: "fa0f4887-4fca-4e7a-8bdf-2ca1648ff724",
    label: "哲学の道",
    point: { from: [35.0229, 135.7944], to: [35.0225183, 135.7949888], source: "OSM 哲学の道 highway=footway,tourism=attraction way196173120（Nominatim）" },
    time: { from: "11:30", to: "11:21" },
  },
  { id: "95ff8ef6-70d7-4b03-8fc3-ec6be07b6039", label: "銀閣寺（慈照寺）", time: { from: "12:25", to: "12:16" } },
  { id: "6bdbdab5-97a5-4f27-9e10-7b5bb12f6c04", label: "真如堂（真正極楽寺）", time: { from: "13:55", to: "13:46" } },
  {
    id: "809c7505-dbfd-4177-a747-b4b2b2b90ac2",
    label: "金戒光明寺",
    point: { from: [35.019639, 135.788028], to: [35.0194851, 135.7886067], source: "OSM 金戒光明寺 amenity=place_of_worship way317681824（Nominatim）" },
    time: { from: "14:45", to: "14:39" },
    legs: { from: [{ mode: "walk", min: 5 }], to: [{ mode: "walk", min: 8 }] },
  },
  {
    id: "fe238b6f-98a1-4edc-b44d-bc7357579fd7",
    label: "岡崎神社",
    time: { from: "15:33", to: "15:27" },
    memo: [{ from: "すぐそばの平安神宮へ向かいましょう。", to: "続いては、歩いておよそ16分、平安神宮へ向かいましょう。" }],
  },
  {
    id: "1b37a395-1553-45bf-95f7-be55e52534a9",
    label: "平安神宮",
    point: { from: [35.0161, 135.7822], to: [35.0160683, 135.7828961], source: "OSM 平安神宮 amenity=place_of_worship way619903245（Nominatim）" },
    legs: { from: [{ mode: "walk", min: 10 }], to: [{ mode: "walk", min: 16 }] },
    memo: [
      { from: "岡崎神社から歩いておよそ10分、", to: "岡崎神社から歩いておよそ16分、" },
      { from: "広大な神苑の庭園をゆっくり眺めてください。", to: "広大な神苑の庭園をゆっくり眺めましょう。" },
    ],
  },
]);
