/**
 * #410 177ea052 の追いの修正（しおりえ(制作補助2)、企画運営の指摘）
 * - 説明文の「日本で最も早咲きの梅で知られる熱海梅園」の言い切りをぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-410b-177ea052.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "177ea052-e17b-4922-8151-54de866305f5";
const COMMIT = process.argv.includes("--commit");
const OLD = "日本で最も早咲きの梅で知られる熱海梅園と、";
const NEW = "日本で最も早咲きの梅が見られるといわれる熱海梅園と、";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (!it.description?.includes(OLD)) throw new Error("説明文が想定と違います");
  console.log(it.description.replace(OLD, NEW));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description.replace(OLD, NEW) } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
