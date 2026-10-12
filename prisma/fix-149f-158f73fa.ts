/**
 * #149 158f73faの直し(6回目)。企画運営の指摘。温泉寺の座標が、町なかにある
 * 「湯薬師」の石碑の点(加恵瑠神社から64m)になっていて、実際の温泉寺(173段の
 * 石段の上)の場所と合っていなかった。OSMの温泉寺そのものの点n7125611132
 * (#173 57b8650dでも使用)に直し、石段を上り下りする分の移動時間も
 * 合わせて直す(町なかの石碑に言及していた一文も、場所が変わるため外す)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ONSENJI_FROM =
  "下呂温泉噴泉池から歩いておよそ4分、温泉寺に着きます。文永2年(1265)の地震で湯が止まった後、傷ついた白鷺が飛騨川のほとりに毎日飛来し、傷を癒やす姿が見られたことから、村人がその場所を探して温泉を再発見したという「白鷺伝説」が伝わっています。この白鷺は薬師如来の化身だったとされ、「湯薬師」として温泉寺にまつられています。境内には、この伝説を伝える石碑が立っています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ3分、加恵瑠神社へ向かいましょう。";
const ONSENJI_TO =
  "下呂温泉噴泉池から歩いておよそ9分、173段の石段を上って温泉寺に着きます。文永2年(1265)の地震で湯が止まった後、傷ついた白鷺が飛騨川のほとりに毎日飛来し、傷を癒やす姿が見られたことから、村人がその場所を探して温泉を再発見したという「白鷺伝説」が伝わっています。この白鷺は薬師如来の化身だったとされ、「湯薬師」として本堂にまつられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。石段は足元に気をつけて上り下りしましょう。この後は、歩いておよそ4分、加恵瑠神社へ向かいましょう。";

const KAERU_FROM = "温泉寺から歩いておよそ3分、加恵瑠神社に着きます。";
const KAERU_TO = "温泉寺から歩いておよそ4分、加恵瑠神社に着きます。";

const FUNSENCHI_FROM = "この後は、歩いておよそ4分、温泉寺へ向かいましょう。";
const FUNSENCHI_TO = "この後は、歩いておよそ9分、石段を上って温泉寺へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '158f73fa%'`);
  const itinId = rows[0].id;
  const onsenji = await findSpotInItinerary(itinId, { spotName: "温泉寺" });
  const kaeru = await findSpotInItinerary(itinId, { spotName: "加恵瑠神社" });
  const ashiyu = await findSpotInItinerary(itinId, { spotName: "鷺の足湯" });
  const shirasagi = await findSpotInItinerary(itinId, { spotName: "白鷺の湯" });
  const funsenchi = await findSpotInItinerary(itinId, { spotName: "下呂温泉噴泉池" });
  const dayId = onsenji.dayId;

  if (onsenji.memo !== ONSENJI_FROM) throw new Error("温泉寺の文言が想定外です");
  if (!kaeru.memo?.includes(KAERU_FROM)) throw new Error("加恵瑠神社の文言が想定外です");
  if (!funsenchi.memo?.includes(FUNSENCHI_FROM)) throw new Error("下呂温泉噴泉池の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const others = (await tx.spot.findMany({ where: { dayId }, orderBy: { orderNo: "asc" } }))
      .filter((s) => ![onsenji.id, kaeru.id, ashiyu.id, shirasagi.id, funsenchi.id].includes(s.id))
      .map((s) => ({ id: s.id, data: {} }));

    const day1: SpotOrderItem[] = [
      ...others.slice(0, 4), // 合掌村・森八幡神社・白鷺橋・昼食
      {
        id: funsenchi.id,
        data: { memo: funsenchi.memo!.replace(FUNSENCHI_FROM, FUNSENCHI_TO) },
      },
      {
        id: onsenji.id,
        data: {
          lat: 35.8105925,
          lng: 137.2429277,
          visitTime: t(14, 43),
          memo: ONSENJI_TO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
        },
      },
      {
        id: kaeru.id,
        data: {
          visitTime: t(15, 12),
          memo: kaeru.memo!.replace(KAERU_FROM, KAERU_TO),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
      { id: ashiyu.id, data: { visitTime: t(15, 33) } },
      { id: shirasagi.id, data: { visitTime: t(15, 49) } },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
