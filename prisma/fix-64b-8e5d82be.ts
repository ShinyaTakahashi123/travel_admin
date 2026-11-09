/**
 * #64の続き。法務の指摘に対応。夕日ヶ浦海岸(1日目最後のスポット)の
 * 結び「1日目は、ここで終わりです。」に、宿の一言がなかった(もとの
 * 本番からの抜け)。「今夜は、夕日ヶ浦温泉の宿に泊まります。」に
 * 置きかえた(夕日ヶ浦海岸は夕日ヶ浦温泉のそばにあるため)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-64b-8e5d82be.ts
 *   反映: npm run prod -- npx tsx prisma/fix-64b-8e5d82be.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const YUHIGAURA_ID = "0e607273-4823-4e4a-96e5-9a990726d1d2";
const FIND = "季節を問わず気持ちの良い散策が楽しめます。1日目は、ここで終わりです。";
const REPLACE = "季節を問わず気持ちの良い散策が楽しめます。今夜は、夕日ヶ浦温泉の宿に泊まります。";

async function main() {
  const commit = process.argv.includes("--commit");

  const spot = await prisma.spot.findFirstOrThrow({ where: { id: YUHIGAURA_ID } });

  console.log("旧memo:", spot.memo);
  const newMemo = spot.memo?.replace(FIND, REPLACE);
  console.log("新memo:", newMemo);

  if (!spot.memo?.includes(FIND)) {
    console.log("\n[想定と違います] 対象の文が見つかりませんでした。処理を中止します。");
    return;
  }

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: YUHIGAURA_ID }, data: { memo: newMemo } });
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
