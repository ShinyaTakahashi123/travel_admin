/**
 * #448 bbc2264b の写真の直し（しおりえ(制作補助2)、企画運営の了承 9/30 16:18）
 * - 「琵琶湖疏水（大津閘門）」の写真が山科の疏水の桜（Yamasina_Lake_Biwa_Canal_and_Cherry_Bloss…）で、大津の閘門ではないので外す
 * - しおりの表紙も同じ画像だったので、場所が合っている「びわ湖大津館」の写真（663highland）に替える
 *   （画像ファイル自体はほかで使われている可能性があるので消さない。使われなくなった画像は Cron が片づける）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-448c-bbc2264b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "bbc2264b-5108-4228-8d22-35f42dd603c7";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const sosui = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "琵琶湖疏水（大津閘門）" });
  const otsukan = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "びわ湖大津館" });
  const wrong = await prisma.photo.findMany({ where: { spotId: sosui.id } });
  const good = await prisma.photo.findMany({ where: { spotId: otsukan.id } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (wrong.length !== 1 || !wrong[0].sourceUrl?.includes("Yamasina_Lake_Biwa_Canal")) throw new Error("疏水の写真が想定と違います");
  if (good.length !== 1 || !good[0].sourceUrl?.includes("Biwako_Otsukan") || !good[0].author) throw new Error("大津館の写真が想定と違います");
  console.log(`外す写真: ${wrong[0].sourceUrl}\n表紙（今）が疏水の写真か: ${it.thumbnailUrl === wrong[0].url}\n新しい表紙: ${good[0].url}（${good[0].author}）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: wrong[0].id } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: good[0].url } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
