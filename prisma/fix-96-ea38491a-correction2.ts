/**
 * #96 訂正その2。fix-96-ea38491a.ts で visitTime・座標・移動・メモは書き込んだが、
 * 初日の滞在(stayDurationMin)の短縮を書き込み忘れていた(itinerary-audit.tsで発覚)。
 * 滞在だけをここで直す。時刻・座標・メモは直さない(前のスクリプトで済んでいる)。
 *
 * 熊本城90→75、加藤神社40→22、桜の馬場城彩苑60→50、現代美術館90→70、
 * 上通アーケード60→45、藤崎八旛宮50→50(変更なし)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-96-ea38491a-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-96-ea38491a-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const STAY_UPDATES: { id: string; label: string; min: number }[] = [
  { id: "18f4a311-bf65-418f-9d53-b7f08c2ec457", label: "熊本城", min: 75 },
  { id: "fda6eb67-0148-4186-b709-ab1933e0196f", label: "加藤神社", min: 22 },
  { id: "b54826c7-ed54-487c-9409-0403cab593a3", label: "桜の馬場城彩苑", min: 50 },
  { id: "d458be04-606a-4bdb-920e-fa301d3cf0a8", label: "熊本市現代美術館", min: 70 },
  { id: "4a56e589-b253-4b24-b6c2-9aa5fb702406", label: "上通アーケード", min: 45 },
];

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #96 訂正その2: 初日の滞在を直す ===");
  for (const s of STAY_UPDATES) {
    console.log(`  ${s.label} => ${s.min}分`);
  }

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(
    STAY_UPDATES.map((s) => prisma.spot.update({ where: { id: s.id }, data: { stayDurationMin: s.min } }))
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
