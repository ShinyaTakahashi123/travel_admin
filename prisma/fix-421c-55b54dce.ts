/**
 * #421 55b54dce の追いの修正その2（しおりえ(制作補助2)、法務の提案）
 * - 石火矢町ふるさと村・吹屋ふるさと村: 「今も人が暮らす町並みなので、家の敷地に入らず、静かに歩きましょう」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-421c-55b54dce.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "55b54dce-3c63-4e62-b3c7-bf046d449f0f";
const COMMIT = process.argv.includes("--commit");
const LINE = "今も人が暮らす町並みなので、家の敷地に入らず、静かに歩きましょう。";

async function main() {
  const rows = [];
  for (const name of ["石火矢町ふるさと村", "吹屋ふるさと村"]) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo || s.memo.includes(LINE)) throw new Error(`本文が想定と違います: ${name}`);
    rows.push({ id: s.id, memo: s.memo + LINE });
    console.log(`${name}: …${LINE}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: r.id }, { memo: r.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
