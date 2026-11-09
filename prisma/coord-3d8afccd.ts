/**
 * 日帰りの座標の直し（A）: 3d8afccd（相倉合掌造り集落、世界遺産の山里を歩く定番日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md。点だけを直す（分・時刻・文は変わらない）
 * - 相倉合掌造り集落 36.4183,136.9106（4けた。約2.4km南西）→ OSM「越中五箇山相倉集落」tourism=attraction node4485300889 36.426177,136.935562
 *   （1621a020（#42 の見直しで決めた点）・b991287e・b1d9788b と同じ点）
 * 車の分（routed-car）: 相倉→村上家 5.6km 4.7分（10のまま。もとの範囲 4.7〜12.1 の中）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-3d8afccd.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("3d8afccd-caef-48e8-a49c-57847ced494b", [
  {
    id: "ea891f16-ffb8-4606-94d0-8de5e45b7788",
    label: "相倉合掌造り集落",
    point: { from: [36.4183, 136.9106], to: [36.426177, 136.935562], source: "OSM 越中五箇山相倉集落 node4485300889" },
  },
]);
