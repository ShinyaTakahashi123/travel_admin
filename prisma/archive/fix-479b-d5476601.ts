/**
 * #479 d5476601 の写真の直し（しおりえ(制作補助2)）
 *   湯の坪街道の写真（Mount_Yufudake_from_Yunotsubo_Street.JPG）は、手前に顔のわかる人が大きく写り、店の看板も目立つので外す（表紙は金鱗湖のまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-479b-d5476601.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d5476601-4ed3-4351-a2a5-8025e4211b26";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "湯の坪街道" });
  const photos = await prisma.photo.findMany({ where: { spotId: spot.id } });
  if (photos.length !== 1 || !(photos[0].sourceUrl ?? "").includes("Mount_Yufudake_from_Yunotsubo_Street")) throw new Error("写真が想定と違います");
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (it.thumbnailUrl === photos[0].url) throw new Error("この写真が表紙になっています");
  console.log(`外す写真: ${photos[0].sourceUrl}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.photo.delete({ where: { id: photos[0].id } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
