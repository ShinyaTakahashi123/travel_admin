/**
 * #108 6dd8f74fの直し(5回目)。企画運営(2026-10-01 12:10)の指摘:
 * ① 車の流れ: 白衣大観音の駐車場に停めた車に、染料植物園から歩いて
 *    戻る一文がなく、染料植物園から急に「車で13分」になっていた。
 *    染料植物園→白衣大観音の駐車場(徒歩10分)→高崎城址公園(車15分)の
 *    一続きの移動として書き直した(DBのtransitMode/transitDurationMinは
 *    最終的な移動手段の車にまとめ、時間は徒歩10分+昼食+運転15分を合算)。
 * ② 昼食: 清水寺の参道の茶屋(観音茶屋・観音屋・観音みやげ松風)は、
 *    OSM生APIで確認したところ実際には清水寺ではなく白衣大観音の
 *    すぐそば(36.311,138.981付近)にあり、清水寺の裏付けにはならないと
 *    判明。昼食は、①の駐車場に戻る道すがら、実在するこれらの食事処で
 *    とる形に移した(店名はメモに書かない)。移動時間に昼食の時間を
 *    含めたことで、染料植物園発(12:46)から駐車場着(12:56)・昼食
 *    (12:56〜13:16ごろ)が、11:30〜13:30の時間帯に収まる。
 *
 * あわせて、後ろのスポット(高崎城址公園・群馬音楽センター・高崎公園・
 * 高崎市美術館・高崎市タワー美術館)の滞在を少しずつ短縮し、1日の終わりが
 * 17:00を超えないようにした(どれも決まりAの水増しではなく、昼食の時間を
 * 新しく確保した分の調整)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KIYOMIZUDERA_FROM = "参拝の際は、敬意を込めて手を合わせましょう。参道沿いには茶屋や食事処が点在しているので、ここで昼食にしましょう。この後は、歩いておよそ13分、高崎市染料植物園へ向かいましょう。";
const KIYOMIZUDERA_TO = "参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ13分、高崎市染料植物園へ向かいましょう。";

const SENRYOKUEN_FROM = "敷地内の染色工芸館では、実際に染められた布や糸の展示を見ることができます。この後は、車でおよそ13分、高崎城址公園へ向かいましょう。";
const SENRYOKUEN_TO = "敷地内の染色工芸館では、実際に染められた布や糸の展示を見ることができます。この後は、歩いておよそ10分、高崎白衣大観音の駐車場に戻ります。参道沿いの食事処で昼食をとってから、車でおよそ15分、高崎城址公園へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dd8f74f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const darumaji = await findSpotInItinerary(itinId, { spotName: "少林山達磨寺" });
  const daikannon = await findSpotInItinerary(itinId, { spotName: "高崎白衣大観音" });
  const kiyomizudera = await findSpotInItinerary(itinId, { spotName: "清水寺" });
  const senryokuen = await findSpotInItinerary(itinId, { spotName: "高崎市染料植物園" });
  const joshikoen = await findSpotInItinerary(itinId, { spotName: "高崎城址公園" });
  const ongakucenter = await findSpotInItinerary(itinId, { spotName: "群馬音楽センター" });
  const takasakikoen = await findSpotInItinerary(itinId, { spotName: "高崎公園" });
  const bijutsukan = await findSpotInItinerary(itinId, { spotName: "高崎市美術館" });
  const tower = await findSpotInItinerary(itinId, { spotName: "高崎市タワー美術館" });

  if (!kiyomizudera.memo!.includes(KIYOMIZUDERA_FROM)) throw new Error("清水寺の文言が想定外です");
  if (!senryokuen.memo!.includes(SENRYOKUEN_FROM)) throw new Error("染料植物園の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: darumaji.id, data: {} },
    { id: daikannon.id, data: {} },
    { id: kiyomizudera.id, data: { memo: kiyomizudera.memo!.replace(KIYOMIZUDERA_FROM, KIYOMIZUDERA_TO), stayDurationMin: 40 } },
    { id: senryokuen.id, data: { memo: senryokuen.memo!.replace(SENRYOKUEN_FROM, SENRYOKUEN_TO) } },
    { id: joshikoen.id, data: { visitTime: t(13, 31), stayDurationMin: 30, transitDurationMin: 45 } },
    { id: ongakucenter.id, data: { visitTime: t(14, 3), stayDurationMin: 10 } },
    { id: takasakikoen.id, data: { visitTime: t(14, 20), stayDurationMin: 30 } },
    { id: bijutsukan.id, data: { visitTime: t(14, 58), stayDurationMin: 50 } },
    { id: tower.id, data: { visitTime: t(15, 56), stayDurationMin: 45 } },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
