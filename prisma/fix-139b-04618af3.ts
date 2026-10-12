/**
 * #139 04618af3の直し(2回目、自己点検)。
 * ①角島大橋の「通行無料の橋としては」がitinerary-auditの
 *   「料金・時刻・日程・先の予定の記載」で検出された(無料=禁止語)。
 *   橋の長さの話に絞って削除。
 * ②元乃隅神社の結びが「静かにお参りしましょう」のみで、
 *   「敬意」「手を合わせ」のいずれも含まず、prayer-checkで
 *   配慮の一文なしと検出された(このしおり内の他の社寺と同じ
 *   「静かに、敬意を持ってお参りしましょう」の形に統一)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const BRIDGE_FROM = "平成12年(2000)に開通した、全長1780mの橋で、通行無料の橋としては国内でも有数の長さです。";
const BRIDGE_TO = "平成12年(2000)に開通した、全長1780mの橋で、国内でも有数の長さを誇ります。";

const MOTONOSUMI_FROM = "今も参拝の対象となっている神社ですので、境内では静かにお参りしましょう。";
const MOTONOSUMI_TO = "今も参拝の対象となっている神社ですので、境内では静かに、敬意を持ってお参りしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04618af3%'`);
  const itinId = rows[0].id;
  const bridge = await findSpotInItinerary(itinId, { spotName: "角島大橋" });
  const motonosumi = await findSpotInItinerary(itinId, { spotName: "元乃隅神社" });

  if (!bridge.memo?.includes(BRIDGE_FROM)) throw new Error("角島大橋の文言が想定外です");
  if (!motonosumi.memo?.includes(MOTONOSUMI_FROM)) throw new Error("元乃隅神社の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: bridge.id }, data: { memo: bridge.memo!.replace(BRIDGE_FROM, BRIDGE_TO) } }),
    prisma.spot.update({ where: { id: motonosumi.id }, data: { memo: motonosumi.memo!.replace(MOTONOSUMI_FROM, MOTONOSUMI_TO) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
