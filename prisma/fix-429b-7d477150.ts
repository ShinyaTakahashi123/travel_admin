/**
 * #429 7d477150 の写真の差し替え（しおりえ(制作補助2)、法務の指摘）
 * 熊野本宮大社の写真（Inside_the_Kumano_Hongu_Taisha.jpg、表紙も同じ）は神門の内側で、お参り中の人が十数人写っている。
 *   熊野本宮大社は神門の内側の撮影を控えるよう案内しているとされるので、神門の外の一の鳥居の写真に差し替え、表紙もそれにする:
 *   https://commons.wikimedia.org/wiki/File:Tanabe_Kumano_Hongu-Taisha_Ichi-no-Torii.jpg（Zairon、CC BY 4.0、2023年撮影。人は奥に小さく1人）
 * 大斎原（写真なし）には、大鳥居を遠くから写した写真を付ける（人は写っていない）:
 *   https://commons.wikimedia.org/wiki/File:Torii_at_Oyunohara_01.jpg（Douglas Perkins、CC BY 4.0）
 * 前の画像の Blob は消さない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-429b-7d477150.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const ITINERARY_ID = "7d477150-6dba-472c-8a1f-7ef6c5812428";
const HONGU = "c8cc33e6-cef1-4616-b432-c99f86317edf";
const OOYUNOHARA = "7a8987c9-7daf-44a8-bd25-8fd6338cbfbd";
const CC_BY_4 = "https://creativecommons.org/licenses/by/4.0/";
const NEW_HONGU = { file: "Tanabe_Kumano_Hongu-Taisha_Ichi-no-Torii.jpg", author: "Zairon", blob: "fix-429/hongu-ichi-no-torii.jpg" };
const NEW_OOYU = { file: "Torii_at_Oyunohara_01.jpg", author: "Douglas Perkins", blob: "fix-429/oyunohara-torii.jpg" };
const COMMIT = process.argv.includes("--commit");

async function upload(x: { file: string; blob: string }) {
  const res = await fetch(`https://commons.wikimedia.org/wiki/Special:FilePath/${x.file}`, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${x.file} ${res.status}`);
  const b = await put(x.blob, await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", b.url);
  return b.url;
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  const hongu = await prisma.spot.findUniqueOrThrow({ where: { id: HONGU }, include: { photos: true, day: { select: { itineraryId: true } } } });
  const ooyu = await prisma.spot.findUniqueOrThrow({ where: { id: OOYUNOHARA }, include: { photos: true, day: { select: { itineraryId: true } } } });
  if (hongu.day.itineraryId !== ITINERARY_ID || ooyu.day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (hongu.photos.length !== 1 || !hongu.photos[0].sourceUrl?.includes("Inside_the_Kumano_Hongu_Taisha.jpg") || ooyu.photos.length !== 0) throw new Error("写真が想定と違います");
  console.log(`差し替える写真: ${hongu.photos[0].id}（表紙と同じ: ${it.thumbnailUrl === hongu.photos[0].url}）／大斎原に1枚足す`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const honguUrl = await upload(NEW_HONGU);
  const ooyuUrl = await upload(NEW_OOYU);
  await prisma.$transaction(async (tx) => {
    await tx.photo.update({ where: { id: hongu.photos[0].id }, data: { url: honguUrl, sourceUrl: `https://commons.wikimedia.org/wiki/File:${NEW_HONGU.file}`, author: NEW_HONGU.author, license: "CC BY 4.0", licenseUrl: CC_BY_4 } });
    await tx.photo.create({ data: { spotId: OOYUNOHARA, url: ooyuUrl, sourceUrl: `https://commons.wikimedia.org/wiki/File:${NEW_OOYU.file}`, author: NEW_OOYU.author, license: "CC BY 4.0", licenseUrl: CC_BY_4 } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: honguUrl } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
