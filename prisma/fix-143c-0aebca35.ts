/**
 * #143 0aebca35の直し(3回目)。企画運営の指摘3点・法務の指摘1点。
 * ①阿波連ビーチを出る時刻が17:10で、決まり(16:30〜17:00)を少し過ぎて
 *   いたため、滞在を20分短縮(285→265分)し、16:50発・港に17:10着で
 *   17:30の船にゆとりをもって乗れる形に直す。
 * ②渡嘉敷港の「夏は17:30発・冬は17:00発が最終です」は時刻が変わる
 *   ことがあるため、「帰りの最終便の時刻は、出かける前に公式で確かめ
 *   ましょう」にまとめる。
 * ③このしおりは夏だけが対象のため、阿波連ビーチの「冬の時期…ザトウ
 *   クジラ」の一文を外す。
 * ④法務の指摘: 渡嘉敷港の「那覇泊港発9:00の高速船」も時刻を書かない
 *   決まりに触れるため、「朝の高速船で」に直す(visitTimeの09:40着は
 *   そのまま)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const PORT_EKI_FROM = "那覇泊港発9:00の高速船で、およそ40分、渡嘉敷島の渡嘉敷港に着きます。";
const PORT_EKI_TO = "朝の高速船で、およそ40分、渡嘉敷島の渡嘉敷港に着きます。";

const PORT_FROM = "帰りの高速船は、夏は17:30発・冬は17:00発が最終です(増便の時期もあるので、出かける前に公式サイトで確かめましょう)。";
const PORT_TO = "帰りの最終便の時刻は、出かける前に公式サイトで確かめましょう。";

const AWAREN_FROM = "サンゴは生き物なので、踏んだりさわったりしないようにしましょう。冬の時期、例年1〜3月ごろには、沖合でザトウクジラの姿が見られることもあるとされています。このあたりの食事処で昼食をとりましょう。";
const AWAREN_TO = "サンゴは生き物なので、踏んだりさわったりしないようにしましょう。このあたりの食事処で昼食をとりましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0aebca35%'`);
  const itinId = rows[0].id;
  const port = await findSpotInItinerary(itinId, { spotName: "渡嘉敷港・集落" });
  const awaren = await findSpotInItinerary(itinId, { spotName: "阿波連ビーチ" });

  if (!port.memo?.includes(PORT_EKI_FROM)) throw new Error("渡嘉敷港の文言(書き出し)が想定外です");
  if (!port.memo?.includes(PORT_FROM)) throw new Error("渡嘉敷港の文言が想定外です");
  if (!awaren.memo?.includes(AWAREN_FROM)) throw new Error("阿波連ビーチの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: port.id },
      data: { memo: port.memo!.replace(PORT_EKI_FROM, PORT_EKI_TO).replace(PORT_FROM, PORT_TO) },
    }),
    prisma.spot.update({
      where: { id: awaren.id },
      data: { stayDurationMin: 265, memo: awaren.memo!.replace(AWAREN_FROM, AWAREN_TO) },
    }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
