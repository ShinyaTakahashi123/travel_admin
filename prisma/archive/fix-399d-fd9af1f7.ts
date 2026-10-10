/**
 * #399 fd9af1f7 の追いの修正その3（しおりえ(制作補助2)、法務の提案を企画運営が採用）
 * - 北沢浮遊選鉱場跡: 戦時中の増産をたたえるように読める「戦時下の大増産計画…『東洋一』とうたわれました」「往時の繁栄」を外し、中立な書き方にする
 *   （処理量の数字は https://www.visitsado.com/spot/detail0091/ の「1カ月で最大5万t」による）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-399d-fd9af1f7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "fd9af1f7-8f27-4e9a-ab8c-31619adeb036";
const COMMIT = process.argv.includes("--commit");
const OLD =
  "戦時下の大増産計画で大規模な設備が整えられ、1か月に最大5万tもの鉱石を処理できたことから「東洋一」とうたわれました。残るコンクリートの基礎が、往時の繁栄を語っています。";
const NEW = "昭和の時代に大規模な設備が整えられ、1か月に最大5万tもの鉱石を処理できたといわれます。今はコンクリートの基礎が残っています。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "北沢浮遊選鉱場跡" });
  if (!s.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(OLD, NEW);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
