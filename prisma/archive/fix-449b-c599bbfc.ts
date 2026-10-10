/**
 * #449 c599bbfc の写真の直し（しおりえ(制作補助2)、企画運営の指示 9/30 16:29・法務の指摘）
 * 大川内山の写真（表紙も同じ）が鍋島焼の皿の写真（Floral_Plate_Nabeshima.JPG、撮影者欄は窯の名前）で、場所の写真ではないので、大川内山の町並みの写真に差し替える
 *   https://commons.wikimedia.org/wiki/File:Okawachiyamma_street_scene.jpg（Houjyou-Minori、CC BY-SA 3.0。ファイルの説明「大川内山（佐賀県伊万里市）の町並み。」
 *   目で見て、白壁の通りと奇岩の山、青山窯の煙突が写っている（青山窯は OSM でも大川内山の中 node 7254762138）。人の顔の写り込みなし）
 * 写真の行はIDのまま url・出典を書き換え、表紙も新しい画像にする（前の画像の Blob は消さない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-449b-c599bbfc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "c599bbfc-3cff-41f4-b6ea-5fd8de9c9068";
const OLD_SOURCE = "Floral_Plate_Nabeshima.JPG";
const PAGE = "https://commons.wikimedia.org/wiki/File:Okawachiyamma_street_scene.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Okawachiyamma_street_scene.jpg";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "大川内山" });
  const photos = await prisma.photo.findMany({ where: { spotId: spot.id } });
  if (photos.length !== 1 || !photos[0].sourceUrl?.includes(OLD_SOURCE)) throw new Error("写真が想定と違います");
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  const sameAsCover = it.thumbnailUrl === photos[0].url;
  console.log(`差し替える写真: ${photos[0].id} ${photos[0].sourceUrl}（表紙と同じ: ${sameAsCover}）\n新しい写真: ${PAGE}（Houjyou-Minori、CC BY-SA 3.0）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const jpeg = await toWebJpeg(Buffer.from(await res.arrayBuffer()));
  const blob = await put("fix-449/okawachiyama-street.jpg", jpeg, { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.update({
      where: { id: photos[0].id },
      data: { url: blob.url, sourceUrl: PAGE, author: "Houjyou-Minori", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" },
    });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: blob.url } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
