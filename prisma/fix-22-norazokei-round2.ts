/**
 * #22(55e932b6)野良時計の直し(企画運営・法務指摘、2026-10-13)。
 * 「明治20年頃、地主の畠中源馬が自力で製造し建てた」という由来は、観光サイト
 * (tabi-mag.jp)以外の公式(安芸市・高知県)での確認ができなかったため削除。
 * 法務指摘により、個人の住まいの敷地内にあることの注意も追加。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const MEMO_NEW =
  "安芸市のシンボルとして親しまれている、手作りの時計台です。個人の住まいの敷地内にあるため、中には入らず、外から眺めましょう。すぐそばには、藩政期の武士が暮らした武家屋敷群「土居廓中」も広がっています。";

async function main() {
  const spot = await prisma.spot.findFirst({ where: { name: "野良時計" } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 野良時計のメモを書きかえ(由来を削除、敷地内に入らない注意を追加)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: spot.id }, data: { memo: MEMO_NEW } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
