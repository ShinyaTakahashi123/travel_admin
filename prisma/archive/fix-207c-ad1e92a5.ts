/**
 * #207 ad1e92a5 唐戸市場の屋台の書き方（しおりえ(制作補助2)、2026-10-01 企画運営の指摘）
 * - 唐戸市場は9:00〜9:40。公式 https://www.karatoichiba.com/faq/ では、活きいき馬関街は金・土曜日は10時から、日曜日・祝日は8時から（15時まで）、
 *   卸売市場は月〜土の朝早くから。屋台が開いていない日もある時刻なので、朝の市場の店先を中心にし、屋台は「日によって開く時間がこのプランより遅い」ことが分かる形に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-207c-ad1e92a5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ad1e92a5-bfea-413b-9385-efd118b1c89a";
const COMMIT = process.argv.includes("--commit");
const O = "店先には新鮮な魚介が並びます。週末などには、にぎり寿司や海鮮丼、ふく汁などの屋台が並ぶ「活きいき馬関街」も開かれます。";
const N = "朝の店先には、新鮮な魚介がずらりと並びます。週末などには、にぎり寿司や海鮮丼、ふく汁などの屋台が並ぶ「活きいき馬関街」も開かれますが、日によっては開く時間がこのプランより遅いので、公式の案内で確かめましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "唐戸市場" });
  if (!s.memo?.includes(O)) throw new Error("本文が想定と違います");
  if (!COMMIT) return console.log(`${s.memo.replace(O, N)}\n確認モードです。--commit で書き込みます。`);
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo: s.memo.replace(O, N) });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
