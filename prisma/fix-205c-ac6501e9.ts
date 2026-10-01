/**
 * #205 ac6501e9 の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * - HEP FIVE観覧車の写真（commons HEP_in_201409.JPG）は、ビルの店の看板が大きく写っているので外す（表紙ではない）
 * - 同じ写真がまた付かないよう、photo-cache.json の「HEP FIVE観覧車」のキーも消す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-205c-ac6501e9.ts [--commit]
 */
import { readFileSync, writeFileSync } from "fs";
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "ac6501e9-2927-429c-a6bc-d7185b8fe515";
const PHOTO_ID = "19bf5117-e774-4878-a38c-d1fcee4755bd";
const CACHE = "prisma/photo-cache.json";
const KEY = "HEP FIVE観覧車";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  const ph = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO_ID }, include: { spot: { include: { day: true } } } });
  if (ph.spot?.day.itineraryId !== ITINERARY_ID || !String(ph.sourceUrl).includes("HEP_in_201409")) throw new Error("写真が想定と違います");
  if (it.thumbnailUrl === ph.url) throw new Error("表紙がこの写真です");
  const raw = readFileSync(CACHE, "utf8");
  const obj = JSON.parse(raw) as Record<string, unknown>;
  const has = KEY in obj;
  delete obj[KEY];
  console.log(`外す: ${ph.sourceUrl}\n${CACHE} のキー「${KEY}」: ${has ? "消す" : "なし"}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.photo.delete({ where: { id: PHOTO_ID } });
  if (has) writeFileSync(CACHE, JSON.stringify(obj, null, 2) + (raw.endsWith("\n") ? "\n" : ""), "utf8");
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
