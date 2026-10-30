/**
 * #35 彦根城と佐和山城跡、法務の本番確認(2026-10-30 20:54)の指摘。しおりの説明文
 * (Itinerary.description)に会社名「近江鉄道」が残っていた。文のみの直し、時刻・点・
 * スポットのメモは変更なし。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-35-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-35-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "4d332b95-a3a0-4e2a-bdc0-092b71868765";
const FIND = "国宝の天守がそびえる彦根城と城下の通りから、近江鉄道で中山道の鳥居本宿、近江商人の町・豊郷の伊藤忠兵衛記念館とヴォーリズ設計の旧校舎へ。";
const REPLACE = "国宝の天守がそびえる彦根城と城下の通りから、電車で中山道の鳥居本宿、近江商人の町・豊郷の伊藤忠兵衛記念館とヴォーリズ設計の旧校舎へ。";

async function main() {
  const commit = process.argv.includes("--commit");

  const itinerary = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  if (!itinerary.description || !itinerary.description.includes(FIND)) {
    console.log("[想定と違います] 説明文に対象の文が見つかりません。処理を中止します。");
    console.log("現在の説明文:", itinerary.description);
    return;
  }
  const newDescription = itinerary.description.replace(FIND, REPLACE);

  console.log("=== #35 説明文の会社名除去(時刻・点・メモ変更なし) ===");
  console.log("直前:", itinerary.description);
  console.log("直後:", newDescription);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: newDescription } });
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
