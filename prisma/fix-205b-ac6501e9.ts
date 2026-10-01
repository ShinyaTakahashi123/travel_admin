/**
 * #205 ac6501e9 の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: itinerary-audit）
 * - 天神橋筋商店街: 六丁目から南へ歩くので、点を三丁目の OSM way 1062771339（34.7021273,135.5115139）に。今昔館からは商店街を歩いて約20分、滞在30分（15:20〜15:50）
 * - 言い切りをやわらげる: 中央公会堂「西日本で初めて」→「初めてとされ」、今昔館「日本で初めての専門の博物館」→「初めてとされる」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-205b-ac6501e9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ac6501e9-2927-429c-a6bc-d7185b8fe515";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const EDITS: [string, string, string][] = [
  ["大阪市中央公会堂", "公会堂の建物として西日本で初めて国の重要文化財に指定されました。", "公会堂の建物として西日本で初めて国の重要文化財に指定されたとされます。"],
  ["大阪くらしの今昔館", "日本で初めての専門の博物館で、", "日本で初めてとされる専門の博物館で、"],
  ["天神橋筋商店街", "今昔館を出てすぐ、天神橋筋六丁目から商店街を南へ歩きます。", "今昔館を出てすぐの天神橋筋六丁目から、商店街を南へ歩いて約20分、三丁目のあたりへ。"],
  ["天神橋筋商店街", "食べ歩きやお土産探しを楽しみながら、大阪天満宮のある二丁目のあたりまで歩きましょう。", "食べ歩きやお土産探しを楽しみましょう。"],
];

async function main() {
  const memos = new Map<string, { id: string; memo: string }>();
  for (const [name, a, b] of EDITS) {
    let cur = memos.get(name);
    if (!cur) {
      const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
      cur = { id: s.id, memo: s.memo ?? "" };
    }
    if (!cur.memo.includes(a)) throw new Error(`${name}: 本文が想定と違います`);
    memos.set(name, { id: cur.id, memo: cur.memo.replace(a, b) });
  }
  for (const [n, v] of memos) console.log(`\n${n}: ${v.memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const [n, v] of memos) {
      const extra = n === "天神橋筋商店街" ? { visitTime: t(15, 20), stayDurationMin: 30, transitDurationMin: 20, lat: 34.7021273, lng: 135.5115139, address: "大阪府大阪市北区天神橋3丁目" } : {};
      await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: v.id }, { memo: v.memo, ...extra }, { tx });
    }
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
