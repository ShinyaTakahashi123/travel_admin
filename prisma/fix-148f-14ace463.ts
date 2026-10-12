/**
 * #148 14ace463の直し(6回目)。企画運営の指摘: 2か所削除で空いた2時間強を
 * 「①福泉寺・鍋倉公園・遠野郷八幡宮(いずれも既存1本9dff2862でのみ使用、
 * 違う文・違う話で書けば使える)」で埋める。福泉寺は既存の「木彫り観音像」
 * の角度ではなく「五重塔・二重塔」の角度で書く(観音像にもふれるが、既存文の
 * 「2代目住職が12年かけて彫った」という具体的な逸話は使わない)。鍋倉公園は
 * 「展望台からの眺め・珍しい桜の品種」の角度、遠野郷八幡宮は「文治5年(1189)
 * 創建の歴史・遠野南部流鏑馬」の角度で、9dff2862の文とは別の組み立てにする。
 *
 * 出典: るるぶ&more(鍋倉公園・福泉寺)、tohokukanko.jp・tabiiro.jp(遠野郷
 * 八幡宮)。座標は9dff2862で使われている実点をそのまま使用(同じ場所のため)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const LUNCH_FROM = "荒神神社から車でおよそ15分、遠野の市街に着きます。中央通りの周辺には食堂やそば店が並んでいるので、ここで昼食をとりましょう。遠野は「遠野物語」の舞台として知られ、まちの中にも河童や座敷わらしにまつわる看板をいくつも見かけます。この後は、車でおよそ15分、続石へ向かいましょう。";
const LUNCH_TO = "荒神神社から車でおよそ15分、遠野の市街に着きます。中央通りの周辺には食堂やそば店が並んでいるので、ここで昼食をとりましょう。遠野は「遠野物語」の舞台として知られ、まちの中にも河童や座敷わらしにまつわる看板をいくつも見かけます。この後は、車でおよそ3分、鍋倉公園へ向かいましょう。";

const NABEKURA_MEMO =
  "遠野の市街から車でおよそ3分、鍋倉公園に着きます。鍋倉山にあった遠野南部氏の居城・鍋倉城の跡を整備した公園で、天守閣を模した展望台からは、遠野盆地と、まちを囲む山々を見渡せます。園内には500本ほどの桜が植えられ、御衣黄や普賢象といった珍しい品種も見られます。この後は、車でおよそ6分、遠野郷八幡宮へ向かいましょう。";

const HACHIMANGU_MEMO =
  "鍋倉公園から車でおよそ6分、遠野郷八幡宮に着きます。文治5年(1189)、遠野の地を与えられた阿曽沼広綱が八幡神をまつったのが始まりとされ、寛文元年(1661)に今の場所へ移されました。馬場では、南部直栄が始めたとされる「遠野南部流鏑馬」が、360年近く続く郷土芸能として今も奉納されています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、車でおよそ9分、福泉寺へ向かいましょう。";

const FUKUSENJI_MEMO =
  "遠野郷八幡宮から車でおよそ9分、福泉寺に着きます。大正元年(1912)に開かれた真言宗の寺で、境内には五重塔と二重塔が建ち、山あいの静かな景観によく映ります。本堂には、大きな木彫りの観音像もまつられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、車でおよそ25分、続石へ向かいましょう。";

const TSUZUKIISHI_FROM_OPENER = "遠野の市街から車でおよそ15分、続石の駐車場に着きます。";
const TSUZUKIISHI_TO_OPENER = "福泉寺から車でおよそ25分、続石の駐車場に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const furusato = await findSpotInItinerary(itinId, { spotName: "遠野ふるさと村" });
  const gojin = await findSpotInItinerary(itinId, { spotName: "荒神神社" });
  const lunch = await findSpotInItinerary(itinId, { spotName: "遠野の市街(昼食)" });
  const tsuzuki = await findSpotInItinerary(itinId, { spotName: "続石" });
  const dayId = furusato.dayId;

  if (lunch.memo !== LUNCH_FROM) throw new Error("遠野の市街(昼食)の文言が想定外です");
  if (!tsuzuki.memo?.includes(TSUZUKIISHI_FROM_OPENER)) throw new Error("続石の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      { id: furusato.id, data: {} },
      { id: gojin.id, data: {} },
      {
        id: lunch.id,
        data: { memo: lunch.memo!.replace(LUNCH_FROM, LUNCH_TO) },
      },
      {
        create: {
          name: "鍋倉公園（鍋倉城址）",
          address: "岩手県遠野市遠野町",
          lat: 39.327514,
          lng: 141.527887,
          visitTime: t(12, 57),
          stayDurationMin: 35,
          memo: NABEKURA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3 }] },
        },
      },
      {
        create: {
          name: "遠野郷八幡宮",
          address: "岩手県遠野市松崎町白岩",
          lat: 39.343811,
          lng: 141.54644,
          visitTime: t(13, 38),
          stayDurationMin: 30,
          memo: HACHIMANGU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6 }] },
        },
      },
      {
        create: {
          name: "福泉寺",
          address: "岩手県遠野市松崎町駒木7-57-1",
          lat: 39.371577,
          lng: 141.563128,
          visitTime: t(14, 17),
          stayDurationMin: 35,
          memo: FUKUSENJI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9 }] },
        },
      },
      {
        id: tsuzuki.id,
        data: {
          visitTime: t(15, 17),
          memo: tsuzuki.memo!.replace(TSUZUKIISHI_FROM_OPENER, TSUZUKIISHI_TO_OPENER),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25 }] },
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
