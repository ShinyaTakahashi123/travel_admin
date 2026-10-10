/**
 * #487 0e1eeb5f の表紙の直し（しおりえ(制作補助2)）
 *   丸岡城の天守は令和9年11月（予定）まで大規模修理で、足場や幕に覆われる期間があるので、表紙を丸岡城から東尋坊の写真（663highland、CC BY-SA 4.0。人は遠くに小さく写るだけ）に替える
 *   丸岡城の写真はスポットの写真として残す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-487b-0e1eeb5f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "0e1eeb5f-0d86-43b1-9bf5-585210b3c15f";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "東尋坊" });
  const photos = await prisma.photo.findMany({ where: { spotId: spot.id } });
  if (photos.length !== 1 || !(photos[0].sourceUrl ?? "").includes("Tojinbo_Sakai_Fukui")) throw new Error("写真が想定と違います");
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  console.log(`いまの表紙: ${it.thumbnailUrl}\n新しい表紙: ${photos[0].url}（${photos[0].author}）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: photos[0].url } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
