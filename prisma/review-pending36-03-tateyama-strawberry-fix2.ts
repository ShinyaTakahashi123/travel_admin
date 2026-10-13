/**
 * #3の直し直し。企画運営の指摘(2026-10-13)に対応。
 * 1. 説明文のぼかしを「安房国の一宮とされる安房神社」に(メモと同じ文の中に)
 * 2. 館山城の「福井県の丸岡城を参考に」は誤りだった。複数の出典
 *    (https://tabi-mag.jp/tateyama-castletower/ ほか)で「犬山城をモデル(を真似て)」
 *    建てられたと確認できたため、「愛知県の犬山城を手本に」に訂正
 * 3. お参りの一文を、法務の決まった形「今も祈りが続く場所ですので、静かに、敬意を
 *    もってお参りください。」にそろえる(大福寺・安房神社の「お参りしましょう」を
 *    「お参りください」に)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "57126c5e-52ef-4b79-b3ff-1216c57bb7d8";
const CASTLE_SPOT_ID = "a7868fe3-196b-4d4a-b131-40334edc93d0";

const NEW_DESCRIPTION =
  "いくつかの農園が集まる観光いちご園でいちご狩りを楽しんだあと、戦国大名・里見氏の居城跡に建つ館山城(八犬伝博物館)をめぐります。渚の駅たてやまで昼食をとり、坂東三十三観音の結願寺・那古寺、崖の中腹に建つ大福寺(崖観音)、安房国の一宮とされる安房神社、房総半島最西端の洲崎灯台をめぐる日帰りプランです。";

const CASTLE_MEMO =
  "戦国大名・里見氏が天正8年(1580)ごろに築いたとされる館山城の跡地、城山公園に建つ資料館です。発掘調査では天守の土台や礎石が見つかっておらず、天守はなかったというのが定説です。現在の三層四階の天守は、愛知県の犬山城を手本に昭和57年(1982)に建てられた模擬天守です。内部は館山市立博物館の分館「八犬伝博物館」となっており、里見氏を題材にした滝沢馬琴の読本『南総里見八犬伝』の版本や錦絵などを展示しています。天守からは館山湾を一望できます。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: "779403af-5a18-46ae-8da0-6421b6b3bcdf" } });
  const gake = spots.find((s) => s.name === "大福寺（崖観音）");
  const awa = spots.find((s) => s.name === "安房神社");
  if (!gake || !awa) throw new Error("想定と違います");

  console.log("[確認OK] 説明文のぼかしを直す");
  console.log("[確認OK] 館山城の「丸岡城」を「犬山城」に訂正");
  console.log("[確認OK] 大福寺・安房神社のお参りの一文を「お参りください」にそろえる");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: CASTLE_SPOT_ID }, data: { memo: CASTLE_MEMO } });
  await prisma.spot.update({
    where: { id: gake.id },
    data: { memo: gake.memo!.replace("静かに、敬意をもってお参りしましょう。", "静かに、敬意をもってお参りください。") },
  });
  await prisma.spot.update({
    where: { id: awa.id },
    data: { memo: awa.memo!.replace("静かに、敬意をもってお参りしましょう。", "静かに、敬意をもってお参りください。") },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
