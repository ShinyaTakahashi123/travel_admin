/**
 * #77の訂正。SS30→牛たん通りのlegを7→8分に直した際、牛たん通りの
 * visitTimeを更新し忘れ、1分のずれが生じていた(itinerary-audit.cjsで
 * 発見)。牛たん通り14:13→14:14、榴岡公園15:29→15:30に直す(滞在は無変更、
 * 終了は16:34→16:35で、16:30〜17:00の範囲内のまま)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-77-af5a402c-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-77-af5a402c-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const GYUTAN_ID = "8623d44b-2337-46e3-ba60-7b5bf05b64ef";
const TSUTSUJIGAOKA_ID = "3fef4965-17f8-494e-a86c-af15150617dd";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #77 緊急訂正: 牛たん通り・榴岡公園のvisitTimeを1分ずらす ===\n");
  console.log("[牛たん通り] visitTime: 14:13 → 14:14");
  console.log("[榴岡公園] visitTime: 15:29 → 15:30(〜16:35)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: GYUTAN_ID }, data: { visitTime: T(14, 14) } });
  await prisma.spot.update({ where: { id: TSUTSUJIGAOKA_ID }, data: { visitTime: T(15, 30) } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
