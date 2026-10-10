/**
 * #394 f6221e55 の追いの修正その2（しおりえ(制作補助2)、企画運営の指摘）
 * - 説明文: 「現存する日本最古の芝居小屋・金丸座」→「現存する日本最古とされる芝居小屋・金丸座」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-394c-f6221e55.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "f6221e55-7af6-415d-824e-98eb7b07e9f3";
const COMMIT = process.argv.includes("--commit");
const OLD = "現存する日本最古の芝居小屋・金丸座";
const NEW = "現存する日本最古とされる芝居小屋・金丸座";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (!it.description?.includes(OLD)) throw new Error("説明文が想定と違います");
  const description = it.description.replace(OLD, NEW);
  console.log(description);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
