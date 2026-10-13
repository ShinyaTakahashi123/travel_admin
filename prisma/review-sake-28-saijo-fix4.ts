/**
 * #28の直し(自己点検)。fix3で並び順を変えた際、賀茂泉酒造「酒泉館」の結びの文
 * 「JR西条駅から帰路につきましょう。」が、もう最後のスポットではないのに残って
 * いた(今は安芸国分寺歴史公園が最後)。賀茂泉からは帰りの文を外し、安芸国分寺
 * 歴史公園の結びに帰りの一文を付ける。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const DAY_ID = "8f9cdfb6-481b-4419-8bd9-3a6b433970db";

async function main() {
  const kamoizumi = await prisma.spot.findFirst({ where: { dayId: DAY_ID, name: "賀茂泉酒造「酒泉館」" } });
  const kokubunji = await prisma.spot.findFirst({ where: { dayId: DAY_ID, name: "安芸国分寺歴史公園" } });
  if (!kamoizumi?.memo || !kokubunji?.memo) throw new Error("想定と違います");

  const newKamoizumiMemo = kamoizumi.memo.replace("JR西条駅から帰路につきましょう。", "");
  if (newKamoizumiMemo === kamoizumi.memo) throw new Error("賀茂泉の置換対象が見つかりません");

  const closing = "見学を終えたら、西条駅まで歩いて帰路につきましょう。";
  if (kokubunji.memo.includes(closing)) throw new Error("既に結びの文があります(想定外)");
  const newKokubunjiMemo = kokubunji.memo.replace(
    "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
    "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。" + closing
  );
  if (newKokubunjiMemo === kokubunji.memo) throw new Error("国分寺の置換対象が見つかりません");

  console.log("[確認OK] 賀茂泉から帰りの文を削除");
  console.log("[確認OK] 安芸国分寺歴史公園に帰りの文を追加");
  console.log("新賀茂泉メモ:", newKamoizumiMemo);
  console.log("新国分寺メモ:", newKokubunjiMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: kamoizumi.id }, data: { memo: newKamoizumiMemo } });
  await prisma.spot.update({ where: { id: kokubunji.id }, data: { memo: newKokubunjiMemo } });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
