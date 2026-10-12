/**
 * #149 158f73faの直し(4回目)。企画運営の指摘。
 * ①昼食85分は、白鷺の湯を短くした分が移った時間合わせ(決まりA)のため
 *   60分に短縮。
 * ②空いた25分ほどに、温泉寺(湯薬師)を追加。既存2本(401d9f0c・57b8650d)は
 *   「173段の石段・下呂温泉街を見下ろす眺め」の切り口と見られるため、別の
 *   切り口として、文永2年(1265)の地震で湯が止まった後、傷ついた白鷺が
 *   毎日飛来して癒やす姿から温泉が再発見されたという「白鷺伝説」と、その
 *   白鷺が薬師如来の化身だったとされ、温泉寺に「湯薬師」としてまつられて
 *   いるという話にする(白鷺橋・チャップリン像の名前の由来にもつながる)。
 *
 * 座標はOSM実点(湯薬師node7178342169、historic=memorial)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const FUNSENCHI_FROM = "この後は、歩いておよそ4分、加恵瑠神社へ向かいましょう。";
const FUNSENCHI_TO = "この後は、歩いておよそ4分、温泉寺へ向かいましょう。";

const ONSENJI_MEMO =
  "下呂温泉噴泉池から歩いておよそ4分、温泉寺に着きます。文永2年(1265)の地震で湯が止まった後、傷ついた白鷺が飛騨川のほとりに毎日飛来し、傷を癒やす姿が見られたことから、村人がその場所を探して温泉を再発見したという「白鷺伝説」が伝わっています。この白鷺は薬師如来の化身だったとされ、「湯薬師」として温泉寺にまつられています。境内には、この伝説を伝える石碑が立っています。この後は、歩いておよそ3分、加恵瑠神社へ向かいましょう。";

const KAERU_FROM = "下呂温泉噴泉池から歩いておよそ4分、加恵瑠神社に着きます。";
const KAERU_TO = "温泉寺から歩いておよそ3分、加恵瑠神社に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '158f73fa%'`);
  const itinId = rows[0].id;
  const lunch = await findSpotInItinerary(itinId, { spotName: "下呂温泉街(昼食)" });
  const funsenchi = await findSpotInItinerary(itinId, { spotName: "下呂温泉噴泉池" });
  const kaeru = await findSpotInItinerary(itinId, { spotName: "加恵瑠神社" });
  const ashiyu = await findSpotInItinerary(itinId, { spotName: "鷺の足湯" });
  const shirasagi = await findSpotInItinerary(itinId, { spotName: "白鷺の湯" });
  const dayId = lunch.dayId;

  if (!funsenchi.memo?.includes(FUNSENCHI_FROM)) throw new Error("下呂温泉噴泉池の文言が想定外です");
  if (!kaeru.memo?.includes(KAERU_FROM)) throw new Error("加恵瑠神社の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const others = (await tx.spot.findMany({ where: { dayId }, orderBy: { orderNo: "asc" } }))
      .filter((s) => ![lunch.id, funsenchi.id, kaeru.id, ashiyu.id, shirasagi.id].includes(s.id))
      .map((s) => ({ id: s.id, data: {} }));

    const day1: SpotOrderItem[] = [
      ...others.slice(0, 3), // 合掌村・森八幡神社・白鷺橋
      { id: lunch.id, data: { stayDurationMin: 60 } },
      {
        id: funsenchi.id,
        data: {
          visitTime: t(14, 14),
          memo: funsenchi.memo!.replace(FUNSENCHI_FROM, FUNSENCHI_TO),
        },
      },
      {
        create: {
          name: "温泉寺",
          address: "岐阜県下呂市湯之島",
          lat: 35.8100576,
          lng: 137.2420919,
          visitTime: t(14, 38),
          stayDurationMin: 25,
          memo: ONSENJI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
      {
        id: kaeru.id,
        data: {
          visitTime: t(15, 6),
          memo: kaeru.memo!.replace(KAERU_FROM, KAERU_TO),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      { id: ashiyu.id, data: { visitTime: t(15, 27) } },
      { id: shirasagi.id, data: { visitTime: t(15, 43) } },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
