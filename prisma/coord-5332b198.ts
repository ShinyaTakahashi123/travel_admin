/**
 * 日帰りの座標の直し（A・B）: 5332b198（岡山後楽園から吉備路へ、名園と古社・古墳・五重塔をめぐる日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 岡山後楽園 34.66633,133.937395（OSM「後楽園」leisure=park way82602383 の面の中心）→ 入口「南門」barrier=gate node4439932325 34.6668421,133.9354159
 *   （広い公園は着く場所の入口の名前つきの点、7章。北の正門は OSM に名前のある点がない。法務・企画運営 11/03）
 * - 吉備路もてなしの館（node13103277740）・造山古墳（node2478974379）は OSM の値の丸めなので直さない
 * 車の時間（routed-car）: 南門→吉備津彦神社 8,947m 17.0分（25のまま）。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-5332b198.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("5332b198-5be3-4cf5-9800-7528a8d5b7ad", [
  {
    id: "50026b53-7472-461a-8c6e-f03f2d8caedc",
    label: "岡山後楽園",
    point: { from: [34.66633, 133.937395], to: [34.6668421, 133.9354159], source: "OSM 後楽園 南門 barrier=gate node4439932325（入口）" },
  },
]);
