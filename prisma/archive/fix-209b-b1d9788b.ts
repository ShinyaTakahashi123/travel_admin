/**
 * #209 b1d9788b の季節の直し（しおりえ(制作補助2)）
 * 村上家は12月15日〜2月末が休業（https://www.murakamike.jp/ ）なので、季節から冬を外す（春・夏・秋）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-209b-b1d9788b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "b1d9788b-d0fc-4ade-b894-f90084f94d55";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, seasons: true } });
  console.log(`対象: ${it.title} 季節: ${it.seasons.join(",")} → spring,summer,autumn`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: ["spring", "summer", "autumn"] } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
