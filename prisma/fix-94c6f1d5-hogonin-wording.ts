/**
 * 94c6f1d5（嵯峨野の紅葉めぐり）の宝厳院、「お過ごしください」を「過ごしましょう」に直す
 * (2026-10-30、企画運営の指示・法務のOKで文のみ)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const HOGONIN = "fd92e2c2-241f-43c0-9e79-f488f9751a26";

const MEMO_OLD =
  "渡月橋から歩いておよそ8分、天龍寺の塔頭のひとつ、宝厳院に着きます。ふだんは非公開ですが、春と秋の年2回、期間を限って特別公開されています。嵐山を借景にした回遊式庭園「獅子吼の庭」は、巨岩の獅子岩と、境内を覆うように色づく紅葉が見どころです。夕方からのライトアップ拝観が行われることもあります。静かに、敬意をもって拝観しましょう。訪れる前に公式サイトで、公開している期間・時間を確かめてください。嵯峨野めぐりの締めくくりに、静かな庭園でゆっくりお過ごしください。";
const MEMO_NEW =
  "渡月橋から歩いておよそ8分、天龍寺の塔頭のひとつ、宝厳院に着きます。ふだんは非公開ですが、春と秋の年2回、期間を限って特別公開されています。嵐山を借景にした回遊式庭園「獅子吼の庭」は、巨岩の獅子岩と、境内を覆うように色づく紅葉が見どころです。夕方からのライトアップ拝観が行われることもあります。静かに、敬意をもって拝観しましょう。訪れる前に公式サイトで、公開している期間・時間を確かめてください。嵯峨野めぐりの締めくくりに、静かな庭園でゆっくり過ごしましょう。";

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: HOGONIN } });
  if (spot.memo !== MEMO_OLD) throw new Error("宝厳院: memo現在値が期待と不一致");

  console.log("前提の確認OK。「お過ごしください」→「過ごしましょう」のみ直します。");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.spot.update({ where: { id: HOGONIN }, data: { memo: MEMO_NEW } });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
