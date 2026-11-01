/**
 * 日帰りの座標の直し（A・B）: 44ade3e4（五百羅漢、石見銀山の坑夫を弔う石仏群を訪ねるプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 五百羅漢（羅漢寺） 35.1078,132.4372（4けた。約1km南西の山の中）→ OSM「羅漢寺」amenity=place_of_worship node7460628486 35.1132656,132.4462303
 *   （34e2b41c「羅漢寺・五百羅漢」と同じ点。「五百羅漢」node7460628585 は約60m東）
 * - 石見銀山世界遺産センター（way612811610）は OSM の値の丸めなので直さない
 * 歩く時間（routed-foot）: センター→羅漢寺 1,095m 14.6分（24のまま）、羅漢寺→城上神社 1,133m 15.1分（28のまま。上限 15.1×1.5＋5＝27.7 を丸めて28、法務 11/02）。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-44ade3e4.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("44ade3e4-de3c-4d7f-8152-2189dc5b0fa6", [
  {
    id: "b37bf3cf-ee98-4b21-b3f6-8e9e63ef6423",
    label: "五百羅漢（羅漢寺）",
    point: { from: [35.1078, 132.4372], to: [35.1132656, 132.4462303], source: "OSM 羅漢寺 place_of_worship node7460628486" },
  },
]);
