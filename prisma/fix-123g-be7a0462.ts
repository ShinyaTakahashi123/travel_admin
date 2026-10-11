/**
 * #123 be7a0462の直し(7回目)。企画運営・法務(2026-10-11、法務記録a1c8902)
 * の指摘。
 *
 * 企画運営: 越前松島水族館130分(決まりA)→90分に短縮、北潟湖畔70分→50分に。
 * 空いた時間に、水族館の隣にある実在の景勝地「越前松島」を追加し、宿の
 * 一文をそちらに移す。
 * 法務: 水族館の「岩場での磯遊び体験もできます」に、岩場が滑りやすい旨の
 * 一文を追加。
 *
 * 座標: 越前松島 36.2553073, 136.1470239(OSM relation、osm_id 11668483、
 * 水族館から約300m)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const AQUARIUM_MEMO =
  "北潟湖畔から車でおよそ20分、坂井市三国町の越前松島水族館に着きます。日本海に面した水族館で、イルカやアザラシとのふれあいプログラム、タコやサメ、エイに直接ふれられるタッチプール、ペンギンの散歩イベントなど、生き物との距離の近さが魅力です。岩場での磯遊び体験もできます。岩場は滑りやすいので、足元と波に気をつけましょう。動物にふれるときは、やさしく接し、ふれたあとは手を洗いましょう。この後は、歩いておよそ5分、越前松島へ向かいましょう。";

const MATSUSHIMA_MEMO =
  "越前松島水族館から歩いておよそ5分、越前松島に着きます。日本海に浮かぶ小島や奇岩が連なる景勝地で、松林に覆われた岩礁の眺めが広がります。波打ち際は足元が滑りやすいので、近づきすぎないようにしましょう。今夜はこの近くの宿に泊まりましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'be7a0462%'`);
  const itinId = rows[0].id;
  const lake = await findSpotInItinerary(itinId, { spotName: "北潟湖畔" });
  const aquarium = await findSpotInItinerary(itinId, { spotName: "越前松島水族館" });

  console.log("確認OK。dayId:", lake.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: lake.id }, { stayDurationMin: 50 });

  const day1Spots = await prisma.spot.findMany({ where: { dayId: lake.dayId }, orderBy: { orderNo: "asc" } });
  await setDaySpotOrder(
    lake.dayId,
    [
      ...day1Spots
        .filter((s) => s.id !== aquarium.id)
        .map((s) => ({ id: s.id, data: {} })),
      { id: aquarium.id, data: { memo: AQUARIUM_MEMO, stayDurationMin: 90, visitTime: t(14, 3) } },
      {
        create: {
          name: "越前松島",
          memo: MATSUSHIMA_MEMO,
          lat: 36.2553073,
          lng: 136.1470239,
          visitTime: t(15, 38),
          stayDurationMin: 55,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
    ]
  );

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
