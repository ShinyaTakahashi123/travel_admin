/**
 * #447 b7f38e2f の季節の直し（しおりえ(制作補助2)、企画運営の指示 9/30 16:08: 冬の営業が公式で確かめられなければ冬を外す）
 *   小岩井農場の公式（https://www.koiwaifarm.com/guide/hours/ ・/guide/entry/ ・/event/season/）には、まきば園の営業は「4月1日〜11月中旬」、
 *   入場パスポートの期間も「2026年4月11日〜2027年1月11日」とあるだけで、冬（11月中旬〜3月）のまきば園・上丸牛舎の見学の案内が見つからない
 *   → 季節を 春・夏・秋 に。まきば園の本文の「冬は営業の内容が変わる」も、営業期間を確かめる一言に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-447c-b7f38e2f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b7f38e2f-129c-43ae-9313-9fe104e78005";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { seasons: true } });
  if (it.seasons.join() !== "spring,summer,autumn,winter") throw new Error(`季節が想定と違います: ${it.seasons}`);
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "小岩井農場まきば園" });
  const from = "冬は営業の内容が変わるので、公式の案内で確かめましょう。", to = "営業期間は公式の案内で確かめましょう。";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`季節: ${it.seasons} → spring,summer,autumn`);
  console.log(`まきば園: …${memo.slice(-60)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: ["spring", "summer", "autumn"] } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: spot.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
