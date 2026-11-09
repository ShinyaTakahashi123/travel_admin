/**
 * #142 0534e5d3 の続き（しおりえ(制作補助2)、2026-10-30。法務の指摘）: 2日目 和田家のメモの「おすすめ」をなくす
 *   「2階の窓から見下ろす雪の集落もおすすめです。」→「2階の窓からは、雪の集落を見下ろせます。」
 * 時刻・座標は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-142b-0534e5d3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const WADA = "5512710b-7b02-42df-aa7c-d1fec8710819";
const FROM = "2階の窓から見下ろす雪の集落もおすすめです。";
const TO = "2階の窓からは、雪の集落を見下ろせます。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: WADA } });
  if (s.name !== "和田家") throw new Error(`名前が違います（${s.name}）`);
  const memo = s.memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("置き換え元が見つかりません");
  const next = memo.replace(FROM, TO);
  console.log(`${s.name}\n  前: ${memo}\n  後: ${next}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: WADA }, data: { memo: next } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
