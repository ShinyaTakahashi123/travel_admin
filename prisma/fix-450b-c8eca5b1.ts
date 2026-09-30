/**
 * #450 c8eca5b1 の写真の追加（しおりえ(制作補助2)、企画運営の了承 9/30 16:40）
 * もとから写真も表紙もなかったので、松江城の天守の写真を1枚付けて表紙にする
 *   https://commons.wikimedia.org/wiki/File:Matsue_castle01bs4592.jpg（663highland、CC BY 2.5。ファイルの説明「Matsue Castle in Matsue, Shimane prefecture, Japan」、
 *   撮影位置 35.475117,133.050747 は松江城（OSM way 299654325）の位置。目で見て天守が写っている。右下に遠くの人が小さく写るだけで顔はわからない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-450b-c8eca5b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "c8eca5b1-b460-490d-943b-33fab6a68230";
const PAGE = "https://commons.wikimedia.org/wiki/File:Matsue_castle01bs4592.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Matsue_castle01bs4592.jpg";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "松江城" });
  const photos = await prisma.photo.findMany({ where: { spot: { day: { itineraryId: ITINERARY_ID } } } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (photos.length !== 0 || it.thumbnailUrl) throw new Error("写真か表紙がすでにあります");
  console.log(`付ける写真: ${PAGE}（663highland、CC BY 2.5）→ 松江城 ${spot.id}、表紙にも`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-450/matsue-castle.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.create({ data: { spotId: spot.id, url: blob.url, sourceUrl: PAGE, author: "663highland", license: "CC BY 2.5", licenseUrl: "https://creativecommons.org/licenses/by/2.5/" } });
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
