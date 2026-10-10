/**
 * #455 d6beaf2d の写真の差し替え（しおりえ(制作補助2)）
 * 富岩運河環水公園の写真が、公園の中の店の建物（Starbucks_Toyama_Canal…）の写真で、店の宣伝に近いので、公園と天門橋の写真に差し替える
 *   https://commons.wikimedia.org/wiki/File:Fugan-unga_Kansui_Park_013.jpg（えむかとー、パブリックドメイン。ファイルの説明「Fugan-unga Kansui Park in Toyama Japan (富岩運河環水公園)」
 *   となりの富山市総合体育館から撮ったもの。目で見て天門橋と運河が写り、人は遠くに小さく写るだけ）
 * 写真の行はIDのまま url・出典を書き換える（前の画像の Blob は消さない）。表紙は富山城の写真なので変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-455b-d6beaf2d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d6beaf2d-3089-4b72-a272-2a563064e5da";
const PAGE = "https://commons.wikimedia.org/wiki/File:Fugan-unga_Kansui_Park_013.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Fugan-unga_Kansui_Park_013.jpg";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "富岩運河環水公園" });
  const photos = await prisma.photo.findMany({ where: { spotId: spot.id } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (photos.length !== 1 || !photos[0].sourceUrl?.includes("Starbucks")) throw new Error("写真が想定と違います");
  if (it.thumbnailUrl === photos[0].url) throw new Error("表紙と同じ写真なので止めます");
  console.log(`差し替える写真: ${photos[0].id} ${photos[0].sourceUrl}\n新しい写真: ${PAGE}（えむかとー、パブリックドメイン）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-455/kansui-park.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.photo.update({ where: { id: photos[0].id }, data: { url: blob.url, sourceUrl: PAGE, author: "えむかとー", license: "パブリックドメイン", licenseUrl: null } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
