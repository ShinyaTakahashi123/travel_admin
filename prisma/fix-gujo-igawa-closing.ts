/**
 * 郡上八幡(1cfd3212)いがわ小径の終わりに、帰りの一文を足す(法務の指摘2026-11-03)。
 * いがわ小径→郡上八幡駅 routed-foot 1.51km・20.2分→21分。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const IGAWA_ID = "37ac8938-5627-418e-a591-7b5a17e8baf0";

const MEMO_OLD =
  "郡上八幡旧庁舎記念館から歩いておよそ4分、旅の最後はいがわ小径です。江戸時代から続く島谷用水路に沿って整備された小径で、旧庁舎記念館の裏手からのびています。透き通った水路の中を、大きな鯉が悠々と泳ぐ姿を間近に見られるのが魅力です。水と共に生きてきた郡上八幡の暮らしぶりを感じながら、旅の締めくくりに水辺の風情をゆっくりと楽しみましょう。";
const MEMO_NEW =
  "郡上八幡旧庁舎記念館から歩いておよそ4分、旅の最後はいがわ小径です。江戸時代から続く島谷用水路に沿って整備された小径で、旧庁舎記念館の裏手からのびています。透き通った水路の中を、大きな鯉が悠々と泳ぐ姿を間近に見られるのが魅力です。水と共に生きてきた郡上八幡の暮らしぶりを感じながら、旅の締めくくりに水辺の風情をゆっくりと楽しみましょう。見学を終えたら、歩いておよそ21分の郡上八幡駅へ戻り、帰路につきましょう。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: IGAWA_ID } });
  if (spot.memo !== MEMO_OLD) throw new Error("いがわ小径: memo現在値が期待と不一致");

  console.log(`\n旧: ${MEMO_OLD}`);
  console.log(`\n新: ${MEMO_NEW}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.spot.update({ where: { id: IGAWA_ID }, data: { memo: MEMO_NEW } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
