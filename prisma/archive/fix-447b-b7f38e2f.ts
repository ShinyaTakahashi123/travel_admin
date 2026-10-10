/**
 * #447 b7f38e2f の直し（しおりえ(制作補助2)、itinerary-audit の指摘: 赤レンガ館の本文の「無料のゾーン・有料のゾーン」は料金の記載）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-447b-b7f38e2f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b7f38e2f-129c-43ae-9313-9fe104e78005";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "岩手銀行赤レンガ館" });
  const from = "無料のゾーンでは盛岡の産業や商業の歴史を紹介し、有料のゾーンでは開業当時から使われている金庫室なども公開されています。";
  const to = "館内では盛岡の産業や商業の歴史を紹介していて、開業当時から使われている金庫室なども公開されています。";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`赤レンガ館: …${memo.slice(-110)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
