/**
 * 日帰りの座標の直し（A・B）: b79dfc58（郡上八幡城と宗祇水、水と踊りの城下町をめぐる日帰りプラン）（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md
 * - 長敬寺 35.753479,136.956（6/3けた）→ OSM amenity=place_of_worship way585997743（Nominatim 35.7538764,136.9559774、約45m）
 * - 郡上八幡城下町プラザ 35.751038,136.957764 → OSM「城下町プラザ」way289134637（Nominatim 35.7515291,136.9574695、約60m）
 * - 洗い出しの郡上八幡城 35.753083,136.961445 は、OSM tourism=museum way585995159（35.7530831,136.9614453）の6けたの丸めで、直さない
 * - 宗祇水 node4742153893・安養寺 node1420981183・柳町 node4829451721・博覧館 node1421001173・旧庁舎記念館 way585997742 も6けたの丸め
 * 歩く時間（routed-foot、実測 ≤ 今の値 ≤ 上限）: 八幡神社→長敬寺 14.3 ≤ 15 ≤ 27、長敬寺→プラザ 4.4 ≤ 5 ≤ 12。変えない
 * メモ: プラザの書き出し「歩いてすぐ」→「歩いておよそ5分」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-b79dfc58.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("b79dfc58-26a7-4cbc-b1f2-b089a25ace29", [
  {
    id: "3600b3de-4c2a-4ce1-a0d0-3ddfb6813f19",
    label: "長敬寺",
    point: { from: [35.753479, 136.956], to: [35.7538764, 136.9559774], source: "OSM 長敬寺 amenity=place_of_worship way585997743（Nominatim）" },
  },
  {
    id: "8248bc3e-03ce-447e-bdab-2d8c2ef8d000",
    label: "郡上八幡城下町プラザ",
    point: { from: [35.751038, 136.957764], to: [35.7515291, 136.9574695], source: "OSM 城下町プラザ way289134637（Nominatim）" },
    memo: [{ from: "長敬寺から歩いてすぐの郡上八幡城下町プラザへ。", to: "長敬寺から歩いておよそ5分の郡上八幡城下町プラザへ。" }],
  },
]);
