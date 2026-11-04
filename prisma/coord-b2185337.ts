/**
 * 日帰りの座標の直し（A・B）: b2185337（松江城と堀川めぐり、塩見縄手。水の城下町を楽しむ日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 松江歴史館 35.4752,133.053497（4/6けた）→ OSM tourism=museum way311398093（Nominatim 35.4751598,133.0534973。e989f860・c62de963 と同じ点、約4m）
 * - 松江城 way299654325・塩見縄手 way1082906437・小泉八雲記念館 way317465585・島根県立美術館 way127302818 は6けたの丸めで、直しても変わらない
 * 歩く時間: 約4mの直しなので変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-b2185337.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("b2185337-bf98-49a5-9cde-60940a27c0be", [
  {
    id: "3d05f123-c6f9-4c3e-895d-97d6c374e989",
    label: "松江歴史館",
    point: { from: [35.4752, 133.053497], to: [35.4751598, 133.0534973], source: "OSM 松江歴史館 tourism=museum way311398093（Nominatim）" },
  },
]);
