/**
 * 同じ場所の点をそろえる: 3155fabf（千光寺と浄土寺、しまなみ海道サイクリングと原爆ドーム・宮島をめぐる尾道・広島3泊4日）の縮景園（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md（998ecdfc の欄②、企画運営の判断 11/04: 縮景園は4本とも「北門」にそろえる）
 * - 縮景園 34.400472,132.467267 → 名前のある入口「北門」entrance=yes node13132914674（34.401448,132.466374。998ecdfc と同じ点）
 *   （広島城から東へ歩いて着くので、北側の北門は着く向きとも合う）
 * 歩く時間（routed-foot、実測 ≤ 今の値 ≤ 上限）: 広島城→北門 1010m 13.5 ≤ 15 ≤ 26、北門→広島県立美術館 247m 3.3 ≤ 5 ≤ 10。変えない。点だけ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-3155fabf.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("3155fabf-7e37-4803-9bdb-66a7c7dc732a", [
  {
    id: "44c21ebf-c114-40d7-b590-1eff0aecd350",
    label: "縮景園",
    point: { from: [34.400472, 132.467267], to: [34.401448, 132.466374], source: "OSM 北門 entrance=yes node13132914674（998ecdfc と同じ点）" },
  },
]);
