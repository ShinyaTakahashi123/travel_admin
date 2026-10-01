/**
 * #414 441b998a の追いの修正（しおりえ(制作補助2)、自分の点検で）
 * - 1日目の時刻の空きを詰める（ひろめ市場 11:50／龍馬の生まれたまち記念館 13:20／自由民権記念館 14:35〜15:45）
 * - 2日目の牧野植物園を150分に（11:35〜14:05）
 * - 日曜市の本文から曜日の書き方を外す（開催日は公式で確かめる書き方に）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-414b-441b998a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "441b998a-82ce-43fd-849a-ee82c277dd46";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const OLD = "年始とよさこい祭りの期間を除く毎週日曜日に開かれ、午後になると片付けを始める店も多いので、朝のうちに訪れましょう。";
const NEW = "年始やよさこい祭りの期間などは開かれないので、開催日は公式の案内で確かめましょう。午後になると片付けを始める店も多いので、朝のうちに訪れるのがおすすめです。";
const PLAN: [number, string, Record<string, unknown>][] = [
  [1, "ひろめ市場（昼食）", { visitTime: t(11, 50) }],
  [1, "龍馬の生まれたまち記念館", { visitTime: t(13, 20) }],
  [1, "高知市立自由民権記念館", { visitTime: t(14, 35) }],
  [2, "高知県立牧野植物園（昼食）", { stayDurationMin: 150 }],
];

async function main() {
  const ichi = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "日曜市（高知）" });
  if (!ichi.memo?.includes(OLD)) throw new Error("日曜市の本文が想定と違います");
  const rows: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const [day, name, data] of PLAN) rows.push({ day, id: (await findSpotInItinerary(ITINERARY_ID, { dayNumber: day, spotName: name })).id, name, data });
  console.log(ichi.memo.replace(OLD, NEW));
  for (const r of rows) console.log(r.day, r.name, JSON.stringify(r.data));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: ichi.id }, { memo: ichi.memo!.replace(OLD, NEW) }, { tx });
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: r.day, spotId: r.id }, r.data, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
