/**
 * #431 83518f0d の追いの修正（しおりえ(制作補助2)、監査の「徒歩が速すぎ」）: 北海道大学（キャンパスの中心の点）→ 赤れんが庁舎は約1.9km なので徒歩25分に。
 *   赤れんが庁舎 14:10〜14:55、大通公園 15:05〜15:40、狸小路 15:50〜16:30（40分）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-431b-83518f0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "83518f0d-2bb9-44db-a3f1-bf8193c73dcf";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const EDITS: [string, Record<string, unknown>][] = [
  ["北海道庁旧本庁舎", { visitTime: t(14, 10), stayDurationMin: 45, transitDurationMin: 25 }],
  ["大通公園", { visitTime: t(15, 5), stayDurationMin: 35 }],
  ["狸小路商店街", { visitTime: t(15, 50), stayDurationMin: 40 }],
];

async function main() {
  const rows: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const [name, data] of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    rows.push({ id: s.id, data });
    console.log(name, JSON.stringify(data));
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: r.id }, r.data, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
