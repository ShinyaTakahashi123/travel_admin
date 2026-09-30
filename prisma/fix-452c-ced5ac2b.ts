/**
 * #452 ced5ac2b の直し（しおりえ(制作補助2)、法務の指摘 9/30 17:09）
 *   時の鐘「環境省の『残したい“日本の音風景100選”』」→ 選ばれたのは平成8年（1996年）で当時は環境庁なので「環境庁（今の環境省）の…」に（#436 と同じ直し方）
 *   菓子屋横丁の「かおり風景100選」は平成13年（2001年）で、環境省になったあとなのでそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-452c-ced5ac2b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ced5ac2b-e034-4d4c-be65-467521eac189";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "時の鐘" });
  const from = "その音は環境省の「残したい“日本の音風景100選”」に選ばれています。", to = "その音は、平成8年（1996年）に環境庁（今の環境省）の「残したい“日本の音風景100選”」に選ばれました。";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`時の鐘: …${memo.slice(-80)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
