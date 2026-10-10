/**
 * #398 fa4c2ce4 の追いの修正（しおりえ(制作補助2)、法務の指摘・元からの問題）
 * - 1か所目「四万十川源流点」の写真が、下流の岩間沈下橋の写真（Shimanto_River_And_Iwama_Bridge_1.JPG）だったので外す
 *   （しおりの表紙 thumbnail_url も同じ画像だったので空にする。画像ファイル自体はエリアなどで使われている可能性があるので消さない）
 * - 岩間沈下橋は一斗俵沈下橋とも別の橋なので、一斗俵にも付け替えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-398b-fa4c2ce4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "fa4c2ce4-3769-458a-888f-3212199fd34a";
const COMMIT = process.argv.includes("--commit");
const WRONG_SOURCE = "Shimanto_River_And_Iwama_Bridge_1.JPG";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "四万十川源流点" });
  const photos = await prisma.photo.findMany({ where: { spotId: spot.id } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (photos.length !== 1 || !photos[0].sourceUrl?.includes(WRONG_SOURCE)) throw new Error("写真が想定と違います");
  const clearThumb = it.thumbnailUrl === photos[0].url;
  console.log(`外す写真: ${photos[0].sourceUrl}\n表紙も同じ画像か: ${clearThumb}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: photos[0].id } });
    if (clearThumb) await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: null } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
