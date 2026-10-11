/**
 * #236 0534e5d3 の座標と写真の直し（しおりえ(制作補助2)、法務の指摘 10/11）
 * ① 神田家: 案内板の点（node 5599670545）から、OSM の建物「神田家 Kanda House」way 236248699 の Nominatim の中心（36.257803, 136.9070797）にする
 * ② 冬だけの「雪の白川郷」のしおりなのに、夏の緑の景色の写真が3枚あったので外す（場所は合っているので photo-cache はそのまま）:
 *    和田家（Ogi_Shirakawa21s3s3999.jpg）・白川郷・荻町集落（Shirakawa-go_(2017-07-22).jpg）・荻町城跡展望台（Ogimachi_catle_ruins_Observatory…panoramio_(2).jpg）
 *    表紙は宮川朝市の写真なので変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-236d-0534e5d3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "0534e5d3-5ada-405b-8781-ed4c0414dc75";
const KANDA = "8b2605be-c7a5-441c-9018-c15038a4f4e6";
const SUMMER_PHOTOS = ["a5b0780e-835f-41b4-b493-e5577ae1da7e", "42069a48-d598-4428-bf32-3ceb26499399", "94c8c6d0-0387-4594-a0d7-91057598ee86"];
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  const photos = await prisma.photo.findMany({ where: { id: { in: SUMMER_PHOTOS } }, include: { spot: { include: { day: true } } } });
  if (photos.length !== 3 || photos.some((p) => p.spot.day.itineraryId !== ITINERARY_ID || p.url === it.thumbnailUrl)) throw new Error("写真が想定と違います");
  const kanda = await prisma.spot.findUniqueOrThrow({ where: { id: KANDA } });
  if (kanda.name !== "神田家") throw new Error("スポットが想定と違います");
  console.log(`神田家: (${kanda.lat},${kanda.lng}) → (36.257803,136.9070797)\n外す写真: ${photos.map((p) => p.spot.name).join("・")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: KANDA }, data: { lat: 36.257803, lng: 136.9070797 } }),
    prisma.photo.deleteMany({ where: { id: { in: SUMMER_PHOTOS } } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
