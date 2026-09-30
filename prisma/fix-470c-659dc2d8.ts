/**
 * #470 659dc2d8 の写真の直し（しおりえ(制作補助2)）
 *   猿田彦神社: 手前に参拝の人が大きめに写る写真（表紙）を外し、人が小さく後ろ姿で写るだけの写真に替える
 *     https://commons.wikimedia.org/wiki/File:Saruta_hiko_shrine_,_猿田彦神社_-_panoramio.jpg（z tanuki、CC BY 3.0）
 *   二見興玉神社: 夫婦岩の写真を足して表紙にする（人は写っていない）
 *     https://commons.wikimedia.org/wiki/File:Meoto_Iwa_rocks_01.jpg（Douglas Perkins、CC BY 4.0。説明「The rocks of Meoto Iwa. Futami-cho, Ise City, Mie」）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-470c-659dc2d8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "659dc2d8-336e-4031-9439-ba48d93e9e08";
const COMMIT = process.argv.includes("--commit");
const SARUTA_FILE = "Saruta_hiko_shrine_,_猿田彦神社_-_panoramio.jpg";
const SARUTA_PAGE = "https://commons.wikimedia.org/wiki/File:" + SARUTA_FILE;
const MEOTO_FILE = "Meoto_Iwa_rocks_01.jpg";
const MEOTO_PAGE = "https://commons.wikimedia.org/wiki/File:" + MEOTO_FILE;
const filePath = (f: string) => "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(f);

async function fetchJpeg(f: string) {
  const res = await fetch(filePath(f), { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  return toWebJpeg(Buffer.from(await res.arrayBuffer()));
}

async function main() {
  const saruta = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "猿田彦神社" });
  const futami = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "二見興玉神社" });
  const sarutaPhotos = await prisma.photo.findMany({ where: { spotId: saruta.id } });
  if (sarutaPhotos.length !== 1 || !(sarutaPhotos[0].sourceUrl ?? "").includes("Ise_Sarutahiko_Shrine.jpg")) throw new Error("猿田彦神社の写真が想定と違います");
  console.log(`外す写真: ${sarutaPhotos[0].sourceUrl}`);
  console.log(`付ける写真: ${SARUTA_PAGE}（z tanuki、CC BY 3.0）→ 猿田彦神社`);
  console.log(`足す写真: ${MEOTO_PAGE}（Douglas Perkins、CC BY 4.0）→ 二見興玉神社、表紙にも`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const b1 = await put("fix-470/sarutahiko.jpg", await fetchJpeg(SARUTA_FILE), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", b1.url);
  const b2 = await put("fix-470/meoto-iwa.jpg", await fetchJpeg(MEOTO_FILE), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", b2.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: sarutaPhotos[0].id } });
    await tx.photo.create({ data: { spotId: saruta.id, url: b1.url, sourceUrl: SARUTA_PAGE, author: "z tanuki", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/" } });
    await tx.photo.create({ data: { spotId: futami.id, url: b2.url, sourceUrl: MEOTO_PAGE, author: "Douglas Perkins", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: b2.url } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
