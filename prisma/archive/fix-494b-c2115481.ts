/**
 * #494 c2115481 の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * ① 指宿温泉 砂むし会館 砂楽 の写真（commons Kaimondake_frm_sea.jpg ＝ 海から見た開聞岳で、砂むし会館ではない）を外す。
 *    表紙はこの写真ではない（仙巌園）。photo-cache.json・photo-credit-cache.json にこの名前・ファイルのキーはない
 *    Blob のファイルは手で消さない（Cron が使われなくなった画像を消す）
 * ② 池田湖「九州最大の湖です」→「九州最大の湖とされます」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-494b-c2115481.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "c2115481-2b50-4c3c-98b8-3b21148eb5b6";
const PHOTO_ID = "05e871b4-413f-456d-a8f5-0c090b572a31";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  const suna = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "指宿温泉 砂むし会館 砂楽" });
  const photo = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO_ID } });
  if (photo.spotId !== suna.id || !String(photo.sourceUrl).includes("Kaimondake_frm_sea")) throw new Error("写真が想定と違います");
  if (it.thumbnailUrl === photo.url) throw new Error("表紙がこの写真です（表紙も差し替えが要る）");
  const ike = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "池田湖" });
  const O = "周囲約15km、九州最大の湖です。";
  if (!ike.memo?.includes(O)) throw new Error("池田湖の本文が想定と違います");
  const memo = ike.memo.replace(O, "周囲約15km、九州最大の湖とされます。");
  console.log(`写真を外す: ${photo.id} ${photo.sourceUrl}\n池田湖: ${memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: PHOTO_ID } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: ike.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
