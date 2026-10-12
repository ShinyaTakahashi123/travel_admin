/**
 * #108 6dd8f74fの直し(6回目)。fix-108eで清水寺の滞在を55→40分に戻した際、
 * 染料植物園のvisitTimeを連動して直し忘れ、itinerary-audit.cjsで
 * 「時刻の計算が合わない」が2件(染料植物園・高崎城址公園)発生していた。
 * 染料植物園のvisitTimeを12:06→11:51に直す(これで城址公園側のずれも
 * 連動して解消する)。
 * あわせて、高崎城址公園の書き出し文が、fix-108eで直した染料植物園側の
 * 結び(駐車場まで徒歩10分+昼食+車15分)と食い違ったまま(「車でおよそ
 * 13分」)だったのを直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const JOSHIKOEN_FROM = "高崎市染料植物園から車でおよそ13分、高崎城址公園に着きます。";
const JOSHIKOEN_TO = "高崎市染料植物園から、高崎白衣大観音の駐車場まで歩いておよそ10分戻り、参道沿いの食事処で昼食をとってから、車でおよそ15分、高崎城址公園に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dd8f74f%'`);
  const itinId = rows[0].id;
  const senryokuen = await findSpotInItinerary(itinId, { spotName: "高崎市染料植物園" });
  const joshikoen = await findSpotInItinerary(itinId, { spotName: "高崎城址公園" });

  if (!joshikoen.memo!.includes(JOSHIKOEN_FROM)) throw new Error("高崎城址公園の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: senryokuen.id }, { visitTime: t(11, 51) });
  await updateSpotInItinerary(itinId, { spotId: joshikoen.id }, { memo: joshikoen.memo!.replace(JOSHIKOEN_FROM, JOSHIKOEN_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
