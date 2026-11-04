/**
 * 日帰りの座標の直し（A・B）: a71cf39b（松山城、現存12天守の一つを望む日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 子規記念博物館 33.849667,132.787167（0.1秒の形）→ OSM tourism=museum node1423739411 33.849701,132.787045（約13m。3bb9508b・e9a900e3 と同じ点）
 * - 松山城 node611661255・萬翠荘 way505266693・大街道 way237265571・坂の上の雲ミュージアム way216404934・伊佐爾波神社 relation6604925 は6けたの丸めで、直しても変わらない
 * - 二之丸史跡庭園（庭園の面 way137312636 の中心、ほかの2本も同じ値）は、名前のある入口がなく、扱いを法務・企画運営に相談中のため、この版では直さない
 * 移動: 大街道→子規記念博物館は市内電車で、約13mの直しでは変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-a71cf39b.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("a71cf39b-efb6-4338-a893-72c3ca0f9df2", [
  {
    id: "a05359af-d4e6-4acf-9d42-b4c1141f3db2",
    label: "子規記念博物館",
    point: { from: [33.849667, 132.787167], to: [33.849701, 132.787045], source: "OSM 子規記念博物館 tourism=museum node1423739411" },
  },
]);
