/**
 * round2が名前検索で別の公開中しおりを誤って更新してしまったため(復元済み、
 * URGENT-restore-b3f71b69.ts)、本来の対象だった本1(#7)自身の大塚国際美術館
 * (spot 7e403ef9、day1)に、idを指定して正しく適用する。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book1-round2b.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book1-round2b.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const OTSUKA_ID = "7e403ef9-3c4e-40fb-82cf-3a8c75fcb359";
const DAY1_ID = "181ad257-d64c-413e-9396-6f66d355a939";

const OTSUKA_MEMO_NEW =
  "世界26カ国の西洋名画を、陶板に焼き付けて原寸大で再現した美術館です。地下3階から地上2階までの5つのフロアに、「モナ・リザ」「最後の晩餐」「ゲルニカ」など、原寸大で再現された名画が並びます。開館日や時間は公式サイトで確かめましょう。";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: OTSUKA_ID } });
  if (!spot || spot.dayId !== DAY1_ID || spot.name !== "大塚国際美術館") throw new Error("想定と違います");

  console.log("[確認OK] 本1の大塚国際美術館(7e403ef9)を 9:00→9:30開始・滞在120分・メモ更新");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({
    where: { id: OTSUKA_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 9, 30)), stayDurationMin: 120, memo: OTSUKA_MEMO_NEW },
  });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
