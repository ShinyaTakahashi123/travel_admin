/**
 * 94c6f1d5(嵯峨野の紅葉めぐり。秋の嵐山)の渡月橋を、#9で確定した橋の点(way519319727)に揃える
 * (法務指摘、2026-10-30)。もとの値(35.0129,135.6778)は4桁までの入力で、実際には同じ橋の点を
 * 指していた(差は約4m)ため、legs・文(「およそ2km、30分ほど」)の変更は不要
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const TOGETSUKYO = "eaea1d4e-d05e-4f56-baa6-e517391b1f91";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: TOGETSUKYO } });
  if (Number(s.lat) !== 35.0129 || Number(s.lng) !== 135.6778) {
    throw new Error("渡月橋: 座標の現在値が期待と不一致");
  }
  console.log("前提の確認OK。渡月橋: 35.0129,135.6778 → 35.012875,135.677764(#9と同じ橋way519319727)。legs・文は変更なし");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.spot.update({ where: { id: TOGETSUKYO }, data: { lat: 35.012875, lng: 135.677764 } });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
