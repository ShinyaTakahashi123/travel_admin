/**
 * #425 6e2f29bb の追いの修正（しおりえ(制作補助2)、企画運営の指摘）: 一の湯の「『一』は、天下一の『一』なのです。」を普通の文「〜に由来するとされます。」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-425b-6e2f29bb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "6e2f29bb-45c2-494a-83c1-8e42e11552c1";
const ICHI = "983157d4-8b39-4b6f-8f11-bb866cfd736f";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: ICHI }, select: { memo: true } });
  const from = "「一の湯」の「一」は、天下一の「一」なのです。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "「一の湯」の名は、この「天下一」に由来するとされます。");
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: ICHI }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
