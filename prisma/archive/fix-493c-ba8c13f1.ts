/**
 * #493 ba8c13f1 の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * - 和布刈神社: 海辺の安全の一文（法務の文例どおり）
 * - 大濠公園: 貸しボートに「係員の案内に従いましょう」（法務の任意の提案）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-493c-ba8c13f1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ba8c13f1-d71a-41ac-9fa2-ec6a3565695f";
const COMMIT = process.argv.includes("--commit");
const FIXES = [
  { day: 3, name: "和布刈神社", o: "「和布刈神事」が今も受け継がれています。", n: "「和布刈神事」が今も受け継がれています。海に面した石段や岸辺は潮の流れが速く、滑りやすいので、近づきすぎないようにしましょう。" },
  { day: 1, name: "大濠公園", o: "日本庭園や貸しボートも楽しめます。", n: "日本庭園や貸しボートも楽しめます（ボートでは係員の案内に従いましょう）。" },
];

async function main() {
  const rows: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const f of FIXES) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: f.day, spotName: f.name });
    if (!s.memo?.includes(f.o)) throw new Error(`本文が想定と違います: ${f.name}`);
    rows.push({ f, id: s.id, memo: s.memo.replace(f.o, f.n) });
    console.log(`\n■ ${f.name}\n${s.memo.replace(f.o, f.n)}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: r.f.day, spotId: r.id }, { memo: r.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
