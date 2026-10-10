/**
 * #440 9903e2ef の追いの修正（しおりえ(制作補助2)、企画運営の6つの確認の4）: 車の旅であることを、1日目と2日目の最初に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-440d-9903e2ef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9903e2ef-b144-43b3-885f-c552bc7cc906";
const COMMIT = process.argv.includes("--commit");
const fixes = [
  { day: 1, name: "白糸の滝", from: "旅の始まりは白糸の滝へ。", to: "この旅は車（レンタカーなど）でめぐります。旅の始まりは白糸の滝へ。" },
  { day: 2, name: "追分宿郷土館", from: "2日目は、中山道の宿場町だった追分へ。", to: "2日目は、車で中山道の宿場町だった追分へ。" },
];

async function main() {
  const plans: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const f of fixes) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: f.day, spotName: f.name });
    if (!s.memo?.includes(f.from)) throw new Error(`${f.name}: 本文が想定と違います`);
    const memo = s.memo.replace(f.from, f.to);
    plans.push({ day: f.day, id: s.id, memo });
    console.log(`D${f.day} ${f.name}: ${memo.slice(0, 60)}…`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plans) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: p.day, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
