/**
 * 企画運営の依頼: 承認待ちの14e1c69b（四国八十八か所6）金剛福寺のメモを直す。
 * 「古くは小舟で単身、南の海へ漕ぎ出す『補陀落渡海』の行が行われた地」(5章、
 * 漕ぎ出す場面を書く表現) → 那智と同じ言い方で、行が行われた場面を書かない形に
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "14e1c69b-365a-4c8a-8ea7-8e29fbceb8a3";
const SPOT_NAME = "金剛福寺";

const FROM1 =
  "嵯峨天皇は空海・橘逸勢とともに「三筆」に数えられる名筆家で、";
const TO1 = "嵯峨天皇は空海・橘逸勢とともに「三筆」のひとりとされる名筆家で、";

const FROM2 =
  "足摺岬一帯は、観音菩薩の住む浄土「補陀落」に見立てられ、古くは小舟で単身、南の海へ漕ぎ出す「補陀落渡海」の行が行われた地としても知られています。";
const TO2 =
  "足摺岬一帯は、観音菩薩の住む浄土「補陀落」に見立てられ、「補陀落渡海」の信仰が伝わる地とされています。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: SPOT_NAME, day: { itineraryId: ITIN_ID } } });
  if (!spot.memo || !spot.memo.includes(FROM1)) throw new Error("期待する文1が見つかりません");
  if (!spot.memo.includes(FROM2)) throw new Error("期待する文2が見つかりません");
  const after = spot.memo.replace(FROM1, TO1).replace(FROM2, TO2);
  console.log(`旧: ${spot.memo}\n\n新: ${after}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }
  await prisma.spot.update({ where: { id: spot.id }, data: { memo: after } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
