/**
 * 同じ場所の点をそろえる: 44c030d6（蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日）の霞城公園（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md（企画運営の判断 11/04: 霞城公園は3本とも「山形城東大手門」にそろえる。ec2b0e8d は済）
 * - 霞城公園 38.255211,140.329993 →「山形城東大手門」tourism=attraction node5663974178（38.25525,140.3308）
 * 移動（routed-car、実測 ≤ 今の値 ≤ 上限）: 上湯・川原湯共同浴場→東大手門 18333m 18.4 ≤ 30 ≤ 33。変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-44c030d6.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("44c030d6-8683-4c99-84eb-96159b2ce14b", [
  {
    id: "c8d54f90-9cfc-4c43-8580-320f73990f01",
    label: "霞城公園",
    point: { from: [38.255211, 140.329993], to: [38.25525, 140.3308], source: "OSM 山形城東大手門 tourism=attraction node5663974178（ec2b0e8d と同じ点）" },
  },
]);
