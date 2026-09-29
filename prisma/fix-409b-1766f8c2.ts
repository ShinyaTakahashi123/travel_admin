/**
 * #409 1766f8c2 の追いの修正（しおりえ(制作補助2)、自分の点検で）
 * - 盛岡城跡公園: 「最も古い石垣」を市の説明どおり「最も古いと考えられる」に（https://www.city.morioka.iwate.jp/kankou/kankou/1037106/rekishi/1009470/1009474.html）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-409b-1766f8c2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "1766f8c2-8d00-4dd7-b89d-578f9a4295b5";
const COMMIT = process.argv.includes("--commit");
const OLD = "本丸東側には、築城当初の慶長年間のものと考えられる、自然石を多く用いた盛岡城で最も古い石垣が残り、";
const NEW = "本丸東側には、自然石を多く用いた、築城当初の慶長年間のもので盛岡城で最も古いと考えられる石垣が残り、";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "盛岡城跡公園" });
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
