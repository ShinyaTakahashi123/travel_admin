/**
 * #498 e96abd78 のタイトルの直し（しおりえ(制作補助2)、2026-10-01 法務の提案を企画運営が「変える」と決定）
 * - お酒のブランド名が目立たないよう「ニッカウヰスキー余市蒸溜所」→「余市の蒸溜所」。スポット名は施設の正式名なのでそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-498d-e96abd78.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "e96abd78-1c28-4825-93b1-9a57aa9538b9";
const FROM = "小樽の歴史的建造物とニッカウヰスキー余市蒸溜所、積丹ブルーをめぐるレンタカー2泊3日";
const TO = "小樽の歴史的建造物と余市の蒸溜所、積丹ブルーをめぐるレンタカー2泊3日";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true } });
  if (it.title !== FROM) throw new Error(`タイトルが想定と違います: ${it.title}`);
  console.log(`${FROM}\n→ ${TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TO } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
