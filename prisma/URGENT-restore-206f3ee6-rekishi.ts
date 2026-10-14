/**
 * 緊急修正: fix-ohenro-book5-round2.ts が、名前だけでスポットを検索した
 * (findFirst({where:{name:"宇和島市立歴史資料館"}}))ため、本5(#13)とは
 * 無関係の、公開中のしおり(206f3ee6「天赦園と九島、宇和島藩主の庭園と
 * 離島風景を楽しむ1泊2日」)の同名スポット(id=2743561f)の時刻を、誤って
 * 15:09→15:57に書き換えてしまった。2026-10-12 21:35のバックアップから
 * 元の値に復元する。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/URGENT-restore-206f3ee6-rekishi.ts
 *   本登録     : npm run prod -- npx tsx prisma/URGENT-restore-206f3ee6-rekishi.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "2743561f-64c2-4bac-9ffc-d0c4a7ed8299";
const ORIGINAL_VISIT_TIME = new Date(Date.UTC(1970, 0, 1, 15, 9));

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot || spot.name !== "宇和島市立歴史資料館") throw new Error("想定と違います");

  console.log("[現状] visitTime=", spot.visitTime, "(復元後: 15:09)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: SPOT_ID }, data: { visitTime: ORIGINAL_VISIT_TIME } });

  console.log("  COMMITTED(復元しました)");
}

main().finally(() => prisma.$disconnect());
