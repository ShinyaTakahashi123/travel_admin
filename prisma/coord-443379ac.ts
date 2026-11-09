/**
 * 同じ場所の点をそろえる: 443379ac（東大寺・春日大社から飛鳥・長谷寺と室生寺までめぐる奈良2泊3日）の東大寺（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md（7f972333 の欄、企画運営の判断 11/04: 東大寺は着く側の門「南大門」にそろえる）
 * - 東大寺 34.689065,135.839873（大仏殿のそば）→「南大門」building=roof way43558121（34.685812,135.839843）
 * ならまちから北へ歩いて着く。歩く時間（routed-foot、実測 ≤ 今の値 ≤ 上限）: ならまち→南大門 2032m 27.1 ≤ 33 ≤ 46、南大門→春日大社 1197m 16.0 ≤ 21 ≤ 29。変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-443379ac.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("443379ac-eac1-427a-859b-34aaece19786", [
  {
    id: "e3af3831-f988-40ed-aa6c-4928577258b1",
    label: "東大寺",
    point: { from: [34.689065, 135.839873], to: [34.685812, 135.839843], source: "OSM 南大門 building=roof way43558121" },
  },
]);
