/**
 * #93 上高地の訂正その2。企画運営の指摘で、「ほぼ一致」としていた座標もOSMの値そのもの
 * (6けた)にそろえる。移動の分数はいずれも変わらないため、時刻は変更しない。
 *
 * - 田代池: way439470889の頂点node748631214(36.235768,137.624196、約22m)
 * - 田代橋・穂高橋: 田代橋のway697546566の中点(36.244151,137.624912、ノード6550890055・
 *   1636023738の中間、約8m)
 * - 小梨平: node2293285488(36.250582,137.640381、完全一致)
 * - 河童橋: way150718102の中点(36.248844,137.637837、完全一致)
 * - 清水川: 清水橋のway446746691の中点(36.249372,137.638820、ノード1636024040・
 *   1636024029の中間、約6m)
 * - ウェストン碑: node4370931929(36.247030,137.626656、完全一致)
 *
 * 徳沢: もとの点(36.265717,137.690513)は「徳沢園」(宿、tourism=hotel)の点だったため、
 * node1281064873「徳沢キャンプ場」(36.265275,137.690021、約66m)に直す。明神からの徒歩
 * (実測52分)・徳沢→河童橋(実測96分)はどちらも変わらない。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-93-5b3004dc-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-93-5b3004dc-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TASHIROIKE_ID = "77ce6ac7-b372-49f6-9bca-115c3bfaf93c";
const TASHIROBASHI_ID = "c7535856-8757-4afd-adef-d32e93c197e7";
const KONASHIDAIRA_ID = "d7f3a0aa-1123-4191-bc44-3c3a1f6ca321";
const KAPPABASHI_ID = "488cafa7-f358-45bf-ac5c-61f6cedf8adb";
const SHIMIZUGAWA_ID = "9de4bfdd-60ae-4e36-b6a6-b1e5ff003887";
const WESTON_ID = "f708e440-2797-498c-b096-8751d6abc430";
const TOKUSAWA_ID = "ad366c9c-ecfc-4020-9448-519e83acd6f6";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #93 訂正その2: 座標をOSMの値にそろえる ===");
  console.log("田代池: 36.235768,137.624196(node748631214)");
  console.log("田代橋・穂高橋: 36.244151,137.624912(田代橋の中点)");
  console.log("小梨平: 36.250582,137.640381(node2293285488)");
  console.log("河童橋: 36.248844,137.637837(wayの中点)");
  console.log("清水川: 36.249372,137.638820(清水橋の中点)");
  console.log("ウェストン碑: 36.247030,137.626656(node4370931929)");
  console.log("徳沢: 36.265275,137.690021(node1281064873「徳沢キャンプ場」。もとは宿の点だった)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: TASHIROIKE_ID }, data: { lat: 36.235768, lng: 137.624196 } }),
    prisma.spot.update({ where: { id: TASHIROBASHI_ID }, data: { lat: 36.244151, lng: 137.624912 } }),
    prisma.spot.update({ where: { id: KONASHIDAIRA_ID }, data: { lat: 36.250582, lng: 137.640381 } }),
    prisma.spot.update({ where: { id: KAPPABASHI_ID }, data: { lat: 36.248844, lng: 137.637837 } }),
    prisma.spot.update({ where: { id: SHIMIZUGAWA_ID }, data: { lat: 36.249372, lng: 137.63882 } }),
    prisma.spot.update({ where: { id: WESTON_ID }, data: { lat: 36.24703, lng: 137.626656 } }),
    prisma.spot.update({ where: { id: TOKUSAWA_ID }, data: { lat: 36.265275, lng: 137.690021 } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
