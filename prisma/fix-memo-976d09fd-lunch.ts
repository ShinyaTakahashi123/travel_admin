/**
 * 976d09fd(井の頭公園とジブリ美術館)の昼食の結びに分を入れる直し(2026-11-05、しおりえ(制作補助2))。
 * 組み直し(fix-kichijoji-976d09fd.ts)のあと、check-draft で「昼食の結びに移動の分の記載が見当たりません」と出たもの。
 * 結びの文だけを替える。時刻・区間・点は変えない(電車17＋歩き20 は今のまま)。
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-memo-976d09fd-lunch.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const SPOT_ID = "5e3db952-1953-4486-ac30-ff3ed4ecc755";
const NAME = "西国分寺駅のあたりで昼食";
const FROM = "この後は、JR中央線の上りで三鷹駅へ向かいます。";
const TO = "この後は、JR中央線の上りでおよそ17分の三鷹駅へ向かい、南口から歩いておよそ20分、三鷹の森ジブリ美術館へ向かいましょう。";

async function main() {
  const s = await prisma.spot.findUnique({ where: { id: SPOT_ID }, select: { name: true, memo: true, day: { select: { itineraryId: true } } } });
  if (!s || s.name !== NAME || !s.day.itineraryId.startsWith("976d09fd")) throw new Error(`スポットが想定と違います: 「${s?.name}」`);
  const memo = s.memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error(`メモに「${FROM}」がちょうど1回ありません`);
  const next = memo.replace(FROM, TO);
  console.log(`■ ${NAME}\n  メモ「${FROM}」\n  →「${TO}」\n  直したあとのメモ: ${next}`);
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { memo: next } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
