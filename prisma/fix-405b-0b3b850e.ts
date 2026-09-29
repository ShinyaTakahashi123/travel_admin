/**
 * #405 0b3b850e の追いの修正（しおりえ(制作補助2)、監査の警告への対応）
 * - 南極観測船「宗谷」: 「日本で初めての南極観測船として」→「日本で初めての南極観測船として知られ、」
 * - 潮風公園: 宗谷から0.7kmなので徒歩5分→10分、到着14:30・滞在25分に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-405b-0b3b850e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "0b3b850e-f174-49fe-8413-158011680085";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const soya = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "南極観測船「宗谷」" });
  const shio = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "潮風公園" });
  const O1 = "1956年から1962年まで日本で初めての南極観測船として6回の南極観測に活躍しました。";
  const N1 = "日本で初めての南極観測船として知られ、1956年から1962年まで6回の南極観測に活躍しました。";
  const O2 = "宗谷から歩いてすぐ、";
  const N2 = "宗谷から歩いて約10分、";
  if (!soya.memo?.includes(O1) || !shio.memo?.includes(O2)) throw new Error("本文が想定と違います");
  console.log(N1, "\n", N2);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: soya.id }, { memo: soya.memo!.replace(O1, N1) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: shio.id }, { memo: shio.memo!.replace(O2, N2), visitTime: t(14, 30), stayDurationMin: 25, transitDurationMin: 10 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
