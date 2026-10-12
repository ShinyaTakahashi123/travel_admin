/**
 * #477 b2a067e9 の写真の直し（しおりえ(制作補助2)）
 *   足羽川桜並木の写真（Asuwagawa.jpg）は、山あいを流れる足羽川の上流で、街なかの桜並木ではないので外す
 *   → 足羽川の桜並木の写真を付けて表紙にする
 *   https://commons.wikimedia.org/wiki/File:Row_of_sakura,_Asuwa_River,_Fukui.jpg（HarueFukuiJapan、パブリックドメイン。説明「Sakura in Asuwa, Fukui, Japan.」。人は遠くに小さく写るだけ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-477b-b2a067e9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b2a067e9-a1ad-40ae-9d41-b68f9b7138c1";
const PAGE = "https://commons.wikimedia.org/wiki/File:Row_of_sakura,_Asuwa_River,_Fukui.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Row_of_sakura,_Asuwa_River,_Fukui.jpg";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "足羽川桜並木" });
  const photos = await prisma.photo.findMany({ where: { spotId: spot.id } });
  if (photos.length !== 1 || !(photos[0].sourceUrl ?? "").includes("Asuwagawa.jpg")) throw new Error("写真が想定と違います");
  console.log(`外す写真: ${photos[0].sourceUrl}／付ける写真: ${PAGE}（表紙にも）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-477/asuwa-sakura.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: photos[0].id } });
    await tx.photo.create({ data: { spotId: spot.id, url: blob.url, sourceUrl: PAGE, author: "HarueFukuiJapan", license: "Public domain", licenseUrl: null } });
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
