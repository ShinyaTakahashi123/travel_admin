/**
 * #393 f507e490 の追いの修正（しおりえ(制作補助2)、監査の「言い切り?」への対応）
 * - 松本市時計博物館: 「日本最大級の振り子時計」→「日本最大級とされる振り子時計」
 * - 旧開智学校: 「初めて国宝に指定されました」→「初めて国宝に指定された建物とされています」
 * - 大王わさび農場: 「国内でも最大級のわさび農場です」→「国内でも最大級とされるわさび農場です」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-393b-f507e490.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f507e490-d079-42fb-bf98-12be010ccf3d";
const COMMIT = process.argv.includes("--commit");

const EDITS = [
  { day: 1, name: "松本市時計博物館", old: "外壁の日本最大級の振り子時計が目印です。", new: "外壁の、日本最大級とされる振り子時計が目印です。" },
  { day: 2, name: "旧開智学校", old: "近代の学校建築として初めて国宝に指定されました。", new: "近代の学校建築として初めて国宝に指定された建物とされています。" },
  { day: 2, name: "大王わさび農場", old: "国内でも最大級のわさび農場です。", new: "国内でも最大級とされるわさび農場です。" },
];

async function main() {
  const plan: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const e of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: e.day, spotName: e.name });
    if (!s.memo?.includes(e.old)) throw new Error(`${e.name}: 本文が想定と違います`);
    plan.push({ day: e.day, id: s.id, memo: s.memo.replace(e.old, e.new) });
    console.log(`${e.name}: ${e.new}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: p.day, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
