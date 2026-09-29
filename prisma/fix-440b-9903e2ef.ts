/**
 * #440 9903e2ef の追いの修正（しおりえ(制作補助2)、法務の指摘）: 言い切らない書き方に
 *   - 説明文・礼拝堂の本文「軽井沢で最も古い教会」→「軽井沢で最も古い教会とされる」
 *   - 礼拝堂の本文「軽井沢で最初の別荘を建てました」→「軽井沢で最初の別荘とされる家を建てました。この家が…」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-440b-9903e2ef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9903e2ef-b144-43b3-885f-c552bc7cc906";
const COMMIT = process.argv.includes("--commit");

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const description = rep(it.description ?? "", "軽井沢で最も古い教会のショー記念礼拝堂", "軽井沢で最も古い教会とされるショー記念礼拝堂");
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "軽井沢ショー記念礼拝堂" });
  let memo = rep(s.memo ?? "", "軽井沢で最も古い教会で、", "軽井沢で最も古い教会とされ、");
  memo = rep(memo, "軽井沢で最初の別荘を建てました。この別荘が", "軽井沢で最初の別荘とされる家を建てました。この家が");
  console.log(description);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
