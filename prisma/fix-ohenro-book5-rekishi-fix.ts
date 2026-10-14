/**
 * round2が名前検索で別の公開中しおりを誤って更新してしまったため(復元済み、
 * URGENT-restore-206f3ee6-rekishi.ts)、本来の対象だった本5(#13)自身の
 * 宇和島市立歴史資料館(spot 1dafd0b9、id指定)に正しく時刻を適用する。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book5-rekishi-fix.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book5-rekishi-fix.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "1dafd0b9-9ea3-4d1e-9f7b-e0607c48a4d4";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot || spot.name !== "宇和島市立歴史資料館") throw new Error("想定と違います");

  console.log("[確認OK] 本5の歴史資料館(1dafd0b9)を15:55→15:57開始に修正");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: SPOT_ID }, data: { visitTime: t(15, 57) } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
