/**
 * #177 5c3502b5 の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 16:35、記録 1707a3d）で、琴平門前町に付いている写真（663highland の Kotohira-gu04n4500.jpg）は
 *   金刀比羅宮の境内の回廊と社殿の写真なので、金刀比羅宮のスポットへ移す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-177d-5c3502b5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5c3502b5-0318-4f0d-bb31-797899970ef5";
const MONZEN = "fc59bd80-c193-4b26-844a-8b031bf940b7";
const PHOTO = "8d24a580-a5a9-4e6e-94e2-b6d6792f1fb3";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const photo = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO } });
  if (photo.spotId !== MONZEN) throw new Error("写真の付き先が想定と違います");
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "金刀比羅宮" } });
  if (s.length !== 1) throw new Error(`金刀比羅宮 ${s.length}件`);
  console.log(`写真 ${PHOTO.slice(0, 8)}: 琴平門前町 → 金刀比羅宮 (${s[0].id.slice(0, 8)})`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.photo.update({ where: { id: PHOTO }, data: { spotId: s[0].id } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
