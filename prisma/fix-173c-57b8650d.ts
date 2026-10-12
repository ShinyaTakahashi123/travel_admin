/**
 * #173 57b8650d の続き（しおりえ(制作補助2)）: 企画運営の確認（2026-10-11）で、季節が春・夏・秋なのに、写真（663highland の 260125_Gero_Onsen…01s3.jpg）が雪の温泉街なので外す。
 *   替えの写真はないので、写真を外し、表紙（thumbnailUrl）も空にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-173c-57b8650d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "57b8650d-ffaa-435b-81d7-27085573a508";
const PHOTO = "77d695c0-b9d2-46a8-9f03-2da080564feb";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, thumbnailUrl: true } });
  const photos = await prisma.photo.findMany({ where: { spot: { day: { itineraryId: ITINERARY_ID } } }, select: { id: true, url: true } });
  console.log(`対象: ${it.title}\n表紙: ${it.thumbnailUrl}\n写真: ${photos.map((p) => p.id.slice(0, 8)).join(", ")}`);
  if (photos.length !== 1 || photos[0].id !== PHOTO) throw new Error("写真が想定と違います");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: PHOTO } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: null } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
