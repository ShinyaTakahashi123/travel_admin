/**
 * #94 訂正その3。訂正2で元興寺の時刻をまた誤った。改めて鎖を手計算で検算し、正しい時刻に
 * 直す。興福寺の滞在を49分(47分から2分戻す)にして、終了を17:00に保つ。
 *
 * 10:56東大寺(75)→12:15昼食(40)→13:04二月堂(20)→13:41春日大社(46)→14:52ならまち(30)
 * →15:27元興寺(35)→16:11興福寺(47)→終了16:58(16:30〜17:00の範囲内、法務の確認どおり)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-94-a37b8c79-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-94-a37b8c79-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const GANGOJI_ID = "f6543e24-be5f-447c-a46f-f08f9321b631";
const KOFUKUJI_ID = "fa1a3190-33d8-460c-bf8e-50cd9c591c2f";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #94 訂正その3 ===");
  console.log("元興寺: 15:27に直す");
  console.log("興福寺: 16:11に直す(47分のまま)、終了16:58");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: GANGOJI_ID }, data: { visitTime: t(15, 27) } }),
    prisma.spot.update({ where: { id: KOFUKUJI_ID }, data: { visitTime: t(16, 11) } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
