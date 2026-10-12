/**
 * #453 cf6ae961 の追いの直し（しおりえ(制作補助2)）
 * - 竹下通り: itinerary-audit の指摘（0.3km に歩き15分は長い）→ 歩き10分・11:15〜11:45（30分）に。ほかの滞在は変えない
 * - 忠犬ハチ公像の写真（Faithful_Dog_Hachiko_Photo.png）は、像ではなく生前のハチの写真で、撮影者の欄も「Unknown」だったので外す（表紙ではない）
 *   Commons の像の写真（Dick Thomas Johnson・Joli Rumi・Hyppolyte de Saint-Rambert）は、どれも人の顔が大きく写るので付けない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-453b-cf6ae961.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "cf6ae961-1b58-486b-8b4f-fcae6f7e0516";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const take = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "竹下通り" });
  const hachi = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "忠犬ハチ公像" });
  const photos = await prisma.photo.findMany({ where: { spotId: hachi.id } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (photos.length !== 1 || !photos[0].sourceUrl?.includes("Faithful_Dog_Hachiko_Photo")) throw new Error("写真が想定と違います");
  if (it.thumbnailUrl === photos[0].url) throw new Error("表紙と同じ写真なので止めます");
  console.log(`竹下通り: 歩き10分 11:15〜11:45\n外す写真: ${photos[0].sourceUrl}（${photos[0].author}）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: take.id }, { visitTime: t(11, 15), stayDurationMin: 30, transitDurationMin: 10 }, { tx });
    await tx.photo.delete({ where: { id: photos[0].id } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
