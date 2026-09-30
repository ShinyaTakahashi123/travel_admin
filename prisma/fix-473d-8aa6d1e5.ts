/**
 * #473 8aa6d1e5 の追いの直し（しおりえ(制作補助2)、法務の指摘 9/30 20:05）
 *   三鷹の森ジブリ美術館: チケットの売り買いにかかわる言葉を外し、「入場は日時指定の予約制なので、前もって公式の案内で予約しましょう。」だけにする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-473d-8aa6d1e5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8aa6d1e5-c110-4e37-b4fa-916fc19c8417";
const COMMIT = process.argv.includes("--commit");
const FROM = "入場は日時指定の予約制で、美術館の窓口ではチケットを売っていないので、前もって予約しましょう。";
const TO = "入場は日時指定の予約制なので、前もって公式の案内で予約しましょう。";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "三鷹の森ジブリ美術館" });
  if (!(spot.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: spot.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
