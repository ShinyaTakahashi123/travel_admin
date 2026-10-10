/**
 * #407 0df57d67 の追いの修正その2（しおりえ(制作補助2)、法務の判断）
 * - 羅漢寺の写真（Commons Rakan_Temple_03.jpg、境内で撮影）を外す。羅漢寺は境内の撮影を禁止しており、本文にもそう書いているため
 *   写真の行だけ削除（Blob の画像は消さない。使われない画像は Cron が片づける）。表紙は青の洞門の写真のまま
 * - 同じ写真が自動でまた付かないよう、seed-areas-15-kyushu1.ts の羅漢寺の wikiTitle も見送り用に変える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-407c-0df57d67.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "0df57d67-3dc2-4af0-8b22-74933cfcc298";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "羅漢寺" });
  const ph = await prisma.photo.findMany({ where: { spotId: s.id } });
  if (ph.length !== 1 || !ph[0].sourceUrl?.includes("Rakan_Temple_03")) throw new Error("写真が想定と違います");
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (it.thumbnailUrl === ph[0].url) throw new Error("表紙がこの写真です（想定外）");
  console.log(`外す写真: ${ph[0].sourceUrl}（${ph[0].author}）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.photo.delete({ where: { id: ph[0].id } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
