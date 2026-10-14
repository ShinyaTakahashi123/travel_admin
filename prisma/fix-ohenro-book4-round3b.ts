/**
 * round3で、青龍寺の時刻(12:00開始)に伴う帷子崎展望所の到着時刻の更新を
 * 忘れていた(12:53のままだったが、青龍寺の終わり12:50+移動8分=12:58が正しい)。
 * かわうその里すさき以降は、もともと13:27で正しい値だったため変更不要。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book4-round3b.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book4-round3b.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const kata = await prisma.spot.findFirst({ where: { name: "帷子崎展望所" } });
  if (!kata) throw new Error("帷子崎展望所が見つかりません");

  console.log("[確認OK] 帷子崎展望所 12:53→12:58開始(現在:", kata.visitTime, ")");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: kata.id }, data: { visitTime: t(12, 58) } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
