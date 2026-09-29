/**
 * #424 625c11c9 の追いの修正（しおりえ(制作補助2)、監査の指摘）
 *   - 藤森神社 → 伏見稲荷大社は約2.1km なので、徒歩15分 → 25分に。藤森神社 09:00〜09:35、伏見稲荷大社 10:00〜12:00、石峰寺 12:10〜12:50
 *   - 平等院の「10円硬貨」が料金の記載に見えるので「十円硬貨」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-424b-625c11c9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "625c11c9-1f5c-40dd-b510-9e93c517f6ff";
const FUJINOMORI = "f00c21a3-1a0f-491d-9454-986b0a984208";
const INARI = "96557949-9dda-4a6f-bee6-ede82ab740f0";
const SEKIHOJI = "d097422f-6f8a-4256-b28f-258b27a9daee";
const BYODOIN = "f0a1323a-b52e-4744-8615-b599fa5d9b98";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const byo = await prisma.spot.findUniqueOrThrow({ where: { id: BYODOIN }, select: { memo: true } });
  const from = "同じ年に鳳凰堂は10円硬貨のデザインにも採用されました。";
  if (!byo.memo?.includes(from)) throw new Error("平等院の本文が想定と違います");
  const memo = byo.memo.replace(from, "同じ年に鳳凰堂は十円硬貨のデザインにも採用されました。");
  const edits: [number, string, Record<string, unknown>][] = [
    [2, FUJINOMORI, { visitTime: t(9, 0), stayDurationMin: 35 }],
    [2, INARI, { visitTime: t(10, 0), stayDurationMin: 120, transitDurationMin: 25 }],
    [2, SEKIHOJI, { visitTime: t(12, 10), stayDurationMin: 40 }],
    [3, BYODOIN, { memo }],
  ];
  for (const [d, id, data] of edits) console.log(d, id, JSON.stringify(data).slice(0, 120));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const [d, id, data] of edits) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: d, spotId: id }, data, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
