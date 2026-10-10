/**
 * #108 6dd8f74fの直し(7回目)。企画運営(2026-10-01 12:17)の指摘:
 * 染料植物園12:46発→城址公園13:31着の45分(徒歩10分+昼食+車15分)では、
 * 昼食が20分しかなく食事には短すぎる(決まり:食べる時間を十分にとる)。
 * 染料植物園の滞在を実際の見学の長さ(42分)に縮め、空いた時間を昼食に
 * 回し、昼食をおよそ40分とれるようにした(徒歩10分+昼食40分+車15分=65分)。
 * 後ろのスポットは滞在を縮めず、そのまま17:00以内に収まることを確認。
 *
 * 観音山の食事処(レストラン観音山風車11:30-15:00、そばっ処11:30-15:00、
 * Restaurant いしだ11:30-15:30など)は、いずれも昼どきに開いていることを
 * WebSearchで確認済み。昼食の時間帯(およそ12:43〜13:23)はこの範囲内。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const JOSHIKOEN_FROM = "高崎市染料植物園から、高崎白衣大観音の駐車場まで歩いておよそ10分戻り、参道沿いの食事処で昼食をとってから、車でおよそ15分、高崎城址公園に着きます。";
const JOSHIKOEN_TO = "高崎市染料植物園から、高崎白衣大観音の駐車場まで歩いておよそ10分戻り、参道沿いの食事処でゆっくり昼食をとってから、車でおよそ15分、高崎城址公園に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dd8f74f%'`);
  const itinId = rows[0].id;

  const senryokuen = await findSpotInItinerary(itinId, { spotName: "高崎市染料植物園" });
  const joshikoen = await findSpotInItinerary(itinId, { spotName: "高崎城址公園" });
  const ongakucenter = await findSpotInItinerary(itinId, { spotName: "群馬音楽センター" });
  const takasakikoen = await findSpotInItinerary(itinId, { spotName: "高崎公園" });
  const bijutsukan = await findSpotInItinerary(itinId, { spotName: "高崎市美術館" });
  const tower = await findSpotInItinerary(itinId, { spotName: "高崎市タワー美術館" });

  if (!joshikoen.memo!.includes(JOSHIKOEN_FROM)) throw new Error("高崎城址公園の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: senryokuen.id }, { stayDurationMin: 42 });
  await updateSpotInItinerary(itinId, { spotId: joshikoen.id }, {
    memo: joshikoen.memo!.replace(JOSHIKOEN_FROM, JOSHIKOEN_TO),
    visitTime: t(13, 38),
    transitDurationMin: 65,
  });
  await updateSpotInItinerary(itinId, { spotId: ongakucenter.id }, { visitTime: t(14, 10) });
  await updateSpotInItinerary(itinId, { spotId: takasakikoen.id }, { visitTime: t(14, 27) });
  await updateSpotInItinerary(itinId, { spotId: bijutsukan.id }, { visitTime: t(15, 5) });
  await updateSpotInItinerary(itinId, { spotId: tower.id }, { visitTime: t(16, 3) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
