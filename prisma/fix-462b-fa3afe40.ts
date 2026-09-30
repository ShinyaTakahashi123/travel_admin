/**
 * #462 fa3afe40 の写真の追加（しおりえ(制作補助2)、企画運営の依頼 9/30 18:31）
 * もとから写真も表紙もなかったので、中町通り（なまこ壁の土蔵の町並み）の写真を1枚付けて表紙にする
 *   https://commons.wikimedia.org/wiki/File:Nakamachi_street_Matsumoto_Nagano_pref_Japan02s3.jpg（663highland、CC BY 2.5。ファイルの説明「At Nakamachi street in Matsumoto, Nagano prefecture, Japan.」。
 *   目で見て白壁・土蔵造りの町並みが写っている。人は遠くに小さく写るだけで顔はわからない。美術作品は写っていない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-462b-fa3afe40.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "fa3afe40-a1bb-4610-9538-848755e1c83f";
const PAGE = "https://commons.wikimedia.org/wiki/File:Nakamachi_street_Matsumoto_Nagano_pref_Japan02s3.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Nakamachi_street_Matsumoto_Nagano_pref_Japan02s3.jpg";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "中町通り" });
  const photos = await prisma.photo.findMany({ where: { spot: { day: { itineraryId: ITINERARY_ID } } } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (photos.length !== 0 || it.thumbnailUrl) throw new Error("写真か表紙がすでにあります");
  console.log(`付ける写真: ${PAGE}（663highland、CC BY 2.5）→ 中町通り ${spot.id}、表紙にも`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-462/nakamachi-street.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
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
