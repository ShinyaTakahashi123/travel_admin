/**
 * 日帰りの座標の直し（A・B）: 8e7d688e（石段街と伊香保神社、伊香保温泉さんぽ日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 水澤寺 36.4811,138.94577（4/5けた）→ OSM「坂東16番 五徳山 水澤寺」amenity=place_of_worship node2472165186 36.4793789,138.9455274（約200m。7f723012 と同じ点）
 * 移動: ハワイ王国公使別邸→水澤寺はバス20（群馬バス）で、点の直しでは変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-8e7d688e.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("8e7d688e-1378-4f2e-a324-47bbc747576c", [
  {
    id: "5ce09b12-3b64-42bb-928e-a62632ce9fb9",
    label: "水澤寺",
    point: { from: [36.4811, 138.94577], to: [36.4793789, 138.9455274], source: "OSM 坂東16番 五徳山 水澤寺 amenity=place_of_worship node2472165186" },
  },
]);
