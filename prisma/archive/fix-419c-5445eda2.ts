/**
 * #419 5445eda2 の追いの修正その2（しおりえ(制作補助2)、法務の指摘）
 * - 説明文・大宮公園の「埼玉県で一番歴史のある県営公園」をぼかす
 * - 盆栽村に「住宅地でもあるので、静かに歩きましょう」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-419c-5445eda2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "5445eda2-d558-41e6-96ff-7a0987c42d2b";
const COMMIT = process.argv.includes("--commit");
const D_OLD = "県内で一番歴史のある県営公園・大宮公園から";
const D_NEW = "県内で最も古い県営公園とされる大宮公園から";
const P_OLD = "埼玉県で一番歴史のある県営公園です。";
const P_NEW = "埼玉県で最も古い県営公園とされています。";
const B_OLD = "盆栽には手を触れず、それぞれの園の決まりに従って見学しましょう。";
const B_NEW = "盆栽には手を触れず、それぞれの園の決まりに従って見学しましょう。住宅地でもあるので、静かに歩きましょう。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const p = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "大宮公園" });
  const b = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "大宮盆栽村（散策）" });
  if (!it.description?.includes(D_OLD) || !p.memo?.includes(P_OLD) || !b.memo?.includes(B_OLD)) throw new Error("本文が想定と違います");
  console.log(it.description.replace(D_OLD, D_NEW) + "\n" + p.memo.replace(P_OLD, P_NEW) + "\n" + b.memo.replace(B_OLD, B_NEW));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(D_OLD, D_NEW) } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: p.id }, { memo: p.memo!.replace(P_OLD, P_NEW) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: b.id }, { memo: b.memo!.replace(B_OLD, B_NEW) }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
