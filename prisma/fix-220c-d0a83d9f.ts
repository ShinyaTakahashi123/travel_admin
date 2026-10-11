/**
 * #220 d0a83d9f の追いの直し（しおりえ(制作補助2)、自分の写真の確認で）
 * 写真 Yobuko_Asa-ichi_(Yobuko,_Karatsu,_Saga,_Japan).jpg は呼子の朝市の通りの写真なので、「呼子港」から「呼子朝市」のスポットへ付け替える（表紙はそのまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-220c-d0a83d9f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d0a83d9f-65f0-4364-aeb0-4a5310b9e7b0";
const PHOTO_ID = "3f0ed46b-62d4-4a3e-94e4-d407b317d711";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const asaichi = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "呼子朝市" });
  const ph = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO_ID }, include: { spot: true } });
  if (!String(ph.sourceUrl).includes("Yobuko_Asa-ichi") || ph.spot.name !== "呼子港") throw new Error("写真が想定と違います");
  console.log(`写真 ${PHOTO_ID}: ${ph.spot.name} → 呼子朝市`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.photo.update({ where: { id: PHOTO_ID }, data: { spotId: asaichi.id, caption: "呼子朝市" } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
