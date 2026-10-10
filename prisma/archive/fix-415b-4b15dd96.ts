/**
 * #415 4b15dd96 の追いの修正（しおりえ(制作補助2)、自分の点検で）
 * - 旧東奥義塾外人教師館: 「県内で最初に開校した私学校」を「〜とされる」にぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-415b-4b15dd96.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "4b15dd96-716f-4925-bfe3-86275452108e";
const COMMIT = process.argv.includes("--commit");
const OLD = "明治5年に県内で最初に開校した私学校・東奥義塾に";
const NEW = "明治5年に県内で最初に開校した私学校とされる東奥義塾に";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "旧東奥義塾外人教師館" });
  if (!s.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  console.log(s.memo.replace(OLD, NEW));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo: s.memo.replace(OLD, NEW) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
