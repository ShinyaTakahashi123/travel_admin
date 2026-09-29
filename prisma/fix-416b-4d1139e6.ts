/**
 * #416 4d1139e6 の追いの修正（しおりえ(制作補助2)、自分の点検で）
 * - 「日本最大級」「世界最大級」を「〜ともいわれる」にぼかす（水族館・リニア・鉄道館・科学館・説明文）
 * - 時刻: ふじ 12:05／リニア・鉄道館 120分（14:10〜16:10）／動植物園 150分（9:00〜11:30）／植物園 11:40／スカイタワー 12:50／科学館は地下鉄と乗り換えの徒歩で40分、14:10〜15:40
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-416b-4d1139e6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "4d1139e6-04e2-4f29-af49-e411ec4a06f3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const PLAN: [number, string, Record<string, unknown>, [string, string] | null][] = [
  [1, "名古屋港水族館（昼食）", {}, ["日本最大級の水族館で、", "日本最大級ともいわれる水族館で、"]],
  [1, "南極観測船ふじ", { visitTime: t(12, 5) }, null],
  [1, "リニア・鉄道館", { stayDurationMin: 120 }, ["日本最大級の精緻な鉄道ジオラマ", "日本最大級ともいわれる精緻な鉄道ジオラマ"]],
  [2, "東山動植物園（動物園・昼食）", { stayDurationMin: 150 }, null],
  [2, "東山植物園", { visitTime: t(11, 40) }, null],
  [2, "東山スカイタワー", { visitTime: t(12, 50) }, null],
  [2, "FUJIなごや科学館", { visitTime: t(14, 10), transitDurationMin: 40 }, ["内径35mの世界最大級のプラネタリウムドーム", "内径35mで、世界最大級ともいわれるプラネタリウムドーム"]],
];
const D_OLD = "世界最大級のプラネタリウムがある";
const D_NEW = "世界最大級ともいわれるプラネタリウムがある";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (!it.description?.includes(D_OLD)) throw new Error("説明文が想定と違います");
  const rows = [];
  for (const [day, name, data, edit] of PLAN) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: day, spotName: name });
    const d: Record<string, unknown> = { ...data };
    if (edit) {
      if (!s.memo?.includes(edit[0])) throw new Error(`本文が想定と違います: ${name}`);
      d.memo = s.memo.replace(edit[0], edit[1]);
    }
    rows.push({ day, id: s.id, data: d });
    console.log(day, name, JSON.stringify({ ...data, memo: edit ? edit[1] : undefined }));
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(D_OLD, D_NEW) } });
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
