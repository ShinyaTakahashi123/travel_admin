/**
 * #123 be7a0462の直し(6回目)。企画運営・法務(2026-10-11、法務記録aeab5fc)
 * の指摘。
 *
 * 企画運営: 決まりは各日ごとのため、Day1も16:30〜17:00終了にする必要が
 * ある(今は北潟湖畔14:03終わり)。実在の行き先として越前松島水族館
 * (坂井市三国町、ja.wikipedia.org/wiki/越前松島水族館で確認、#111では
 * 取り上げていない)を追加し、宿の一文を北潟湖畔から新しい最後の
 * スポットに移す。
 *
 * 法務①: あわら湯のまち広場の足湯に、ほかの人を撮らない・長く浸かり
 * すぎない旨の一文を追加(#111と同じ扱い)。
 * 法務②: 金津創作の森の座標が、way 438377096の「最初の頂点」になって
 * いた(中心ではない)。Nominatimの中心(36.2304916, 136.2613462)に修正。
 * 法務③: ガラス工房に使った名前のない建物way(438377024)は、ガラス工房
 * であることをOSMで確かめられないため使わない決まりに従い、金津創作の森
 * と同じ敷地全体の点(way 438377096の中心)に変更。チェックリストには
 * 「推定(敷地全体の点)」と明記する。
 *
 * 座標: 越前松島水族館 36.2526485, 136.1466764(osm_id 1420949924、Nominatim)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MORI_LAT = 36.2304916;
const MORI_LNG = 136.2613462;

const YUNOMACHI_FROM = "足湯で歩き疲れた足を休めましょう。";
const YUNOMACHI_TO = "足湯で歩き疲れた足を休めましょう。ほかの人を撮らないように気をつけ、長く浸かりすぎないようにしましょう。";

const LAKE_FROM = "歩道と車道が近い場所もあるので、車に気をつけながら歩きましょう。今夜はこの近くの宿に泊まりましょう。";
const LAKE_TO = "歩道と車道が近い場所もあるので、車に気をつけながら歩きましょう。この後は、車でおよそ20分、越前松島水族館へ向かいましょう。";

const AQUARIUM_MEMO =
  "北潟湖畔から車でおよそ20分、坂井市三国町の越前松島水族館に着きます。日本海に面した水族館で、イルカやアザラシとのふれあいプログラム、タコやサメ、エイに直接ふれられるタッチプール、ペンギンの散歩イベントなど、生き物との距離の近さが魅力です。岩場での磯遊び体験もできます。動物にふれるときは、やさしく接し、ふれたあとは手を洗いましょう。今夜はこの近くの宿に泊まりましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'be7a0462%'`);
  const itinId = rows[0].id;
  const mori = await findSpotInItinerary(itinId, { dayNumber: 1, spotName: "金津創作の森" });
  const glass = await findSpotInItinerary(itinId, { spotName: "金津創作の森ガラス工房" });
  const yunomachi = await findSpotInItinerary(itinId, { spotName: "あわら湯のまち広場" });
  const lake = await findSpotInItinerary(itinId, { spotName: "北潟湖畔" });

  if (!yunomachi.memo?.includes(YUNOMACHI_FROM)) throw new Error("湯のまち広場の文言が想定外です");
  if (!lake.memo?.includes(LAKE_FROM)) throw new Error("北潟湖畔の文言が想定外です");

  console.log("確認OK。dayId:", lake.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: mori.id }, { lat: MORI_LAT, lng: MORI_LNG });
  await updateSpotInItinerary(itinId, { spotId: glass.id }, { lat: MORI_LAT, lng: MORI_LNG });
  await updateSpotInItinerary(itinId, { spotId: yunomachi.id }, { memo: yunomachi.memo!.replace(YUNOMACHI_FROM, YUNOMACHI_TO) });
  await updateSpotInItinerary(itinId, { spotId: lake.id }, { memo: lake.memo!.replace(LAKE_FROM, LAKE_TO) });

  const day1Spots = await prisma.spot.findMany({ where: { dayId: lake.dayId }, orderBy: { orderNo: "asc" } });
  await setDaySpotOrder(
    lake.dayId,
    [
      ...day1Spots.map((s) => ({ id: s.id, data: {} })),
      {
        create: {
          name: "越前松島水族館",
          memo: AQUARIUM_MEMO,
          lat: 36.2526485,
          lng: 136.1466764,
          visitTime: t(14, 23),
          stayDurationMin: 130,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20, transitLine: null }] },
        },
      },
    ]
  );

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
