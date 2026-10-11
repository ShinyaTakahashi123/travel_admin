/**
 * #230 ef328d28 の写真の直し（しおりえ(制作補助2)、企画運営の判断 10/11）
 * イオンモール幕張新都心の写真（コモンズ AEON_Mall_Makuhari-Shintoshin_'Grand_Mall'_under_construction_20131201-2.jpg）は工事中のころのものなので外す。
 * 表紙は幕張海浜公園の写真なので変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-230b-ef328d28.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "ef328d28-b822-4bfd-851d-1478a88bf499";
const PHOTO = "9898a44c-e531-486f-a823-eecacf269cd6";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  const p = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO }, include: { spot: { include: { day: true } } } });
  if (p.spot.name !== "イオンモール幕張新都心" || p.spot.day.itineraryId !== ITINERARY_ID || it.thumbnailUrl === p.url) throw new Error("構成が想定と違います");
  console.log(`外す: ${p.url}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.photo.delete({ where: { id: PHOTO } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
