/**
 * #227 e88cf598 のタイトルの直し（しおりえ(制作補助2)、企画運営の指摘 10/11）
 * 本文から外した「高濃度ラジウム泉」（出典で確かめられず、効き目を思わせる）を、タイトルからも外し、行程に合うタイトルにする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-227b-e88cf598.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "e88cf598-ee6a-4351-a185-f90ff6ed7b78";
const COMMIT = process.argv.includes("--commit");
const OLD = "三朝温泉、高濃度ラジウム泉を楽しむ定番日帰りプラン";
const NEW = "三朝温泉の株湯と温泉街さんぽ、倉吉の梨と中国庭園をめぐる日帰りプラン";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  if (it.title !== OLD) throw new Error("タイトルが想定と違います");
  console.log(`${OLD}\n→ ${NEW}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: NEW } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
