/**
 * #61 03a50000（小豆島）企画運営(12:40)・法務(12:40)の指摘。
 * 1) 土渕海峡「歩いてすぐ」→時刻(11分)に合わせて「歩いておよそ11分」(法務も同指摘)。
 * 2) 寒霞渓「200万年をかけて自然が刻んだ」を削除(公式・複数の資料で「1300万年前の
 *    火山活動」に統一されており、200万年の根拠は確認できなかった)。
 * 3) 寒霞渓「他では味わえない絶景」(言い切り)→「絶景が広がります」まで。
 *    「ゆったりとお楽しみください」→「ゆっくり楽しんでください」。
 * 4) 説明文「日本三大渓谷美の一つに数えられる」→本文と同じ「…の一つともいわれる」に。
 * 5) 迷路のまちは今も人が暮らす路地のため、「住まいの路地なので、家の敷地には
 *    入らず、静かに歩きましょう」の一文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "03a50000-32df-4771-a11e-18521fd89703";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo("土渕海峡", "この後は、歩いてすぐ、エンジェルロードへ向かいましょう。", "この後は、歩いておよそ11分、エンジェルロードへ向かいましょう。");
  await replaceMemo(
    "寒霞渓",
    "空と海と渓谷を一度に見渡せる、他では味わえない絶景が広がります。",
    "空と海と渓谷を一度に見渡せる絶景が広がります。"
  );
  await replaceMemo(
    "寒霞渓",
    "200万年をかけて自然が刻んだ奇岩と、四季折々の彩りを、ゆったりとお楽しみください。",
    "自然が刻んだ奇岩と、四季折々の彩りを、ゆっくり楽しんでください。"
  );

  const meiro = await findSpotInItinerary(ITIN, { spotName: "迷路のまち" });
  const meiroFrom = "地図を片手に、あるいはあえて地図を見ずに、路地に迷い込みながら歩いてみるのもおすすめです。";
  const meiroTo = "地図を片手に、あるいはあえて地図を見ずに、路地に迷い込みながら歩いてみるのもおすすめです。住まいの路地なので、家の敷地には入らず、静かに歩きましょう。";
  if (!meiro.memo!.includes(meiroFrom)) throw new Error("一致しません(迷路のまち)");
  const newMeiroMemo = meiro.memo!.split(meiroFrom).join(meiroTo);
  console.log("迷路のまち: OK");

  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN } });
  const descFrom = "「日本三大渓谷美」の一つに数えられる寒霞渓。";
  const descTo = "「日本三大渓谷美」の一つともいわれる寒霞渓。";
  if (!it.description!.includes(descFrom)) throw new Error("一致しません(説明文)");
  const newDesc = it.description!.split(descFrom).join(descTo);
  console.log("説明文: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: meiro.id }, { memo: newMeiroMemo });
  await prisma.itinerary.update({ where: { id: ITIN }, data: { description: newDesc } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
