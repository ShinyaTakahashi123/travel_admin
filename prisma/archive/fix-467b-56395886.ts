/**
 * #467 56395886 の追いの修正（しおりえ(制作補助2)、法務の提案・企画運営の指示）
 * 上野動物園の写真（Ueno_Zoo_20220414a1.jpg、入口に並ぶ人の列）を、園内のゴリラの写真に差し替える（本文の「ゴリラ・トラのすむ森」に合う）
 *   https://commons.wikimedia.org/wiki/File:Gorilla_at_Ueno_Zoo.jpg（Sahaib、CC BY 4.0。ファイルの説明「Gorilla at Ueno Zoo」、同じ撮影者の同じ日の上野動物園の入口の写真もある。目で見て人の写り込みなし）
 * 写真の行はIDのまま url・出典を書き換える（前の画像の Blob は消さない）。表紙は上野東照宮の写真なので変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-467b-56395886.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const ITINERARY_ID = "56395886-d541-4396-b650-e006867bef6a";
const ZOO = "e12d19d0-d6a6-4487-84ec-b4d225efbf91";
const OLD_SOURCE = "Ueno_Zoo_20220414a1.jpg";
const PAGE = "https://commons.wikimedia.org/wiki/File:Gorilla_at_Ueno_Zoo.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Gorilla_at_Ueno_Zoo.jpg";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: ZOO }, include: { photos: true, day: { select: { itineraryId: true } } } });
  if (spot.day.itineraryId !== ITINERARY_ID || spot.photos.length !== 1 || !spot.photos[0].sourceUrl?.includes(OLD_SOURCE)) throw new Error("写真が想定と違います");
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  console.log(`差し替える写真: ${spot.photos[0].id} ${spot.photos[0].sourceUrl}（表紙と同じ: ${it.thumbnailUrl === spot.photos[0].url}）`);
  if (it.thumbnailUrl === spot.photos[0].url) throw new Error("表紙と同じ写真なので止めます");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const jpeg = await toWebJpeg(Buffer.from(await res.arrayBuffer()));
  const blob = await put("fix-467/ueno-zoo-gorilla.jpg", jpeg, { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.photo.update({
    where: { id: spot.photos[0].id },
    data: { url: blob.url, sourceUrl: PAGE, author: "Sahaib", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
