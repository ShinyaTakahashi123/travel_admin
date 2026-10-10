/**
 * #466 2b2188a6 の写真の差し替え（しおりえ(制作補助2)、企画運営の依頼 9/30 19:14）
 *   新勝寺の写真（大本堂の前、参拝の人が中くらいの大きさで写る）を外し、人の写っていない三重塔の写真に替えて表紙にする
 *   https://commons.wikimedia.org/wiki/File:3-story_pagoda_@_Naritasan_Shinshoji_Temple_@_Narita_(15077855229).jpg
 *   （Guilhem Vellut、CC BY 2.0。説明「3-story pagoda @ Naritasan Shinshoji Temple @ Narita」。目で見て人は写っていない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-466c-2b2188a6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "2b2188a6-1fba-436c-9f73-91658f0a6386";
const PAGE = "https://commons.wikimedia.org/wiki/File:3-story_pagoda_@_Naritasan_Shinshoji_Temple_@_Narita_(15077855229).jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/3-story_pagoda_@_Naritasan_Shinshoji_Temple_@_Narita_(15077855229).jpg";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "成田山新勝寺" });
  const photos = await prisma.photo.findMany({ where: { spotId: spot.id } });
  if (photos.length !== 1 || !(photos[0].sourceUrl ?? "").includes("Naritasan-Shinshoji-Temple-2008")) throw new Error("写真が想定と違います");
  console.log(`外す写真: ${photos[0].sourceUrl}`);
  console.log(`付ける写真: ${PAGE}（Guilhem Vellut、CC BY 2.0）→ 成田山新勝寺 ${spot.id}、表紙にも`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-466/naritasan-pagoda.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: photos[0].id } });
    await tx.photo.create({ data: { spotId: spot.id, url: blob.url, sourceUrl: PAGE, author: "Guilhem Vellut", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" } });
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
