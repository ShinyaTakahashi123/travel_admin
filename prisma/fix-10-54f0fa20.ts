/**
 * #10 54f0fa20(姫路城と書写山圓教寺)の直し。企画運営(2026-10-11)の依頼。
 *
 * 姫路市立美術館は、令和8年(2026)4月1日〜令和9年(2027)12月末(予定)まで
 * 全館休館(ひめのみち himeji-kanko.jp/spot/60 で確認、制作補助2が発見)。
 * スポットを削除し、実在の別の行き先に差し替える。#218・#232は姫路城・
 * 好古園・兵庫県立歴史博物館・姫路科学館などを使っているため、重ならない
 * 「男山配水池公園」(姫路城の北西、198段の石段を上った先にある、姫路市
 * 最古の配水池公園。国の近代化産業遺産。大天守と3つの小天守をまとめて
 * 見渡せる「世界遺産姫路城十景」の一つ)に差し替える。
 *
 * 座標: 34.8409379, 134.6897039(OSM node 2844163558)
 * 出典: tabi-mag.jp/hg0239/(完成年・石段の段数・十景・近代化産業遺産・
 * 男山八幡宮を確認)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KOKOEN_FROM = "園内のレストランで、庭園を眺めながら昼食をとるのもおすすめです。";
const KOKOEN_TO =
  "園内のレストランで、庭園を眺めながら昼食をとるのもおすすめです。この後は、男山へ続く石段を上り、男山配水池公園へ向かいましょう。";

const OTOKOYAMA_MEMO =
  "好古園から、男山へ続く198段の石段を上って、男山配水池公園に着きます。昭和4年(1929)に完成した、姫路市内で最も古い配水池を中心とした公園で、国の近代化産業遺産にも選ばれています。「世界遺産姫路城十景」の中でも、大天守と3つの小天守をまとめて見渡せる、ここだけの眺めが広がります。石段の途中には男山八幡宮もあり、あわせてお参りすることもできます。階段は段差があるので、足元に気をつけて上り下りしましょう。この後は、石段を下りて歩いておよそ12分、姫路市立動物園へ向かいましょう。";

const ZOO_FROM = "姫路市立美術館から歩いてすぐ、姫路城の三の丸広場に隣接する姫路市立動物園です。";
const ZOO_TO = "男山配水池公園から歩いておよそ12分、姫路城の三の丸広場に隣接する姫路市立動物園に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;

  const otedori = await findSpotInItinerary(itinId, { spotName: "大手前通り" });
  const himejijo = await findSpotInItinerary(itinId, { spotName: "姫路城" });
  const kokoen = await findSpotInItinerary(itinId, { spotName: "好古園" });
  const museum = await findSpotInItinerary(itinId, { spotName: "姫路市立美術館" });
  const zoo = await findSpotInItinerary(itinId, { spotName: "姫路市立動物園" });
  const bungakukan = await findSpotInItinerary(itinId, { spotName: "姫路文学館" });

  if (!kokoen.memo?.includes(KOKOEN_FROM)) throw new Error("好古園の文言が想定外です");
  if (!zoo.memo?.includes(ZOO_FROM)) throw new Error("動物園の文言が想定外です");

  console.log("確認OK。dayId:", kokoen.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.photo.deleteMany({ where: { spotId: museum.id } });

    const items: SpotOrderItem[] = [
      { id: otedori.id, data: {} },
      { id: himejijo.id, data: {} },
      { id: kokoen.id, data: { memo: kokoen.memo!.replace(KOKOEN_FROM, KOKOEN_TO) } },
      {
        create: {
          name: "男山配水池公園",
          memo: OTOKOYAMA_MEMO,
          lat: 34.8409379,
          lng: 134.6897039,
          visitTime: t(13, 57),
          stayDurationMin: 45,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
        },
      },
      {
        id: zoo.id,
        data: {
          memo: zoo.memo!.replace(ZOO_FROM, ZOO_TO),
          visitTime: t(14, 54),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12, transitLine: null }] },
        },
      },
      { id: bungakukan.id, data: { visitTime: t(15, 54) } },
    ];
    await setDaySpotOrder(kokoen.dayId, items, { remove: [museum.id], tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
