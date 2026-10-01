/**
 * #498 e96abd78 の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営の指摘）
 * - 説明文: 「有料の場合があり」は料金の言葉なので外す
 * - 小樽市鰊御殿: 「北海道の民家で初めて」に「とされます」を付ける
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-498c-e96abd78.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "e96abd78-1c28-4825-93b1-9a57aa9538b9";
const COMMIT = process.argv.includes("--commit");
const D_FROM = "予約が必要な場合や有料の場合があり、内容も変わることがあるので";
const D_TO = "予約が必要な場合があり、内容も変わることがあるので";
const M_FROM = "「北海道有形文化財鰊漁場建築」に指定されています。";
const M_TO = "「北海道有形文化財鰊漁場建築」に指定されたとされます。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (!it.description?.includes(D_FROM)) throw new Error("説明文が想定と違います");
  const description = it.description.replace(D_FROM, D_TO);
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotName: "小樽市鰊御殿" });
  if (!s.memo?.includes(M_FROM)) throw new Error("鰊御殿の本文が想定と違います");
  const memo = s.memo.replace(M_FROM, M_TO);
  console.log(`説明文: ${description}\n\n鰊御殿: ${memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
