/**
 * #149 158f73faの直し(2回目)。企画運営・法務の指摘。
 *
 * 企画運営:
 * ①白鷺の湯の120分は外湯として長すぎる(決まりA)ため50分に短縮。
 * ②空いた時間に、森八幡神社(森水無八幡神社、景行天皇の時代の創建伝承、
 *   10体の重要文化財の神像、国指定重要無形民俗文化財「田の神祭り」。
 *   既存2本に未使用)を追加して8か所に。昼食の位置を噴泉池の前から
 *   白鷺橋の後に移し、11:30〜13:30の決まりに収める。
 *
 * 法務:
 * ③下呂温泉噴泉池・鷺の足湯・白鷺の湯に「ほかの人を写さない」一文、
 *   白鷺の湯に長湯を避ける一文、噴泉池(飛騨川の河原)に増水時の一文を追加。
 * ④座標: 白鷺の湯はもと歩道w714665591の点だったため、実際のお風呂の
 *   建物w714665465「白鷺の湯」の中心35.8093187,137.2414312に修正。
 *   下呂温泉合掌村はもと丸めた値だったため、OSMのn1420976068
 *   「下呂温泉合掌村」(tourism=museum)の35.8084673,137.2499485に修正。
 *
 * 森八幡神社の座標は国土地理院の番地点(下呂市森1321番地、OSMに単独の
 * 点がないため)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const GASSHO_FROM = "この後は、歩いておよそ9分、白鷺橋へ向かいましょう。";
const GASSHO_TO = "この後は、歩いておよそ8分、森八幡神社へ向かいましょう。";

const MORIHACHIMANGU_MEMO =
  "下呂温泉合掌村から歩いておよそ8分、森八幡神社に着きます。景行天皇の時代に創建されたと伝わる古い社で、平安時代から鎌倉時代にかけて広まった八幡信仰と結びつき、今の名前になったとされています。本殿には、平安時代から鎌倉時代にかけて飛騨の工人が彫ったと伝わる10体の神像がまつられ、国の重要文化財に指定されています。毎年2月14日には、豊作を祈る「田の神祭り」が行われ、花笠をつけた踊り手が舞う様子から「花笠まつり」とも呼ばれる、国の重要無形民俗文化財です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ2分、白鷺橋へ向かいましょう。";

const CHAPLIN_FROM = "下呂温泉合掌村から歩いておよそ9分、白鷺橋に着きます。橋のたもとには、平成13年(2001)11月に除幕されたチャップリン像が立ち、記念撮影をする人の姿をよく見かけます。橋の上からは、飛騨川沿いに広がる温泉街の町並みを眺めることができます。この後は、歩いておよそ3分、下呂温泉噴泉池へ向かいましょう。";
const CHAPLIN_TO = "森八幡神社から歩いておよそ2分、白鷺橋に着きます。橋のたもとには、平成13年(2001)11月に除幕されたチャップリン像が立ち、記念撮影をする人の姿をよく見かけます。橋の上からは、飛騨川沿いに広がる温泉街の町並みを眺めることができます。この後は、歩いておよそ4分、下呂温泉街へ向かいましょう。";

const LUNCH_FROM = "下呂温泉噴泉池から歩いておよそ5分、下呂温泉街に着きます。飛騨川沿いに宿や土産物店、食堂が並ぶ通りで、ここで昼食をとりましょう。下呂温泉は、有馬温泉・草津温泉とともに「日本三名泉」の一つとされています。この後は、歩いておよそ7分、加恵瑠神社へ向かいましょう。";
const LUNCH_TO = "白鷺橋から歩いておよそ4分、下呂温泉街に着きます。飛騨川沿いに宿や土産物店、食堂が並ぶ通りで、ここで昼食をとりましょう。下呂温泉は、有馬温泉・草津温泉とともに「日本三名泉」の一つとされています。この後は、歩いておよそ5分、下呂温泉噴泉池へ向かいましょう。";

const FUNSENCHI_FROM = "白鷺橋から歩いておよそ3分、下呂温泉噴泉池に着きます。下呂大橋のたもと、飛騨川の河原に湧く自然の露天風呂で、下呂温泉の名物として知られています。令和3年(2021)12月から入浴は禁止されていますが、足湯としては今も利用できます。この後は、歩いておよそ5分、下呂温泉街へ向かいましょう。";
const FUNSENCHI_TO = "下呂温泉街から歩いておよそ5分、下呂温泉噴泉池に着きます。下呂大橋のたもと、飛騨川の河原に湧く自然の露天風呂で、下呂温泉の名物として知られています。令和3年(2021)12月から入浴は禁止されていますが、足湯としては今も利用できます。川の水が増えているときは、河原に下りないようにしましょう。ほかの人を写さないようにしましょう。この後は、歩いておよそ4分、加恵瑠神社へ向かいましょう。";

const KAERU_FROM = "下呂温泉街から歩いておよそ7分、加恵瑠神社に着きます。";
const KAERU_TO = "下呂温泉噴泉池から歩いておよそ4分、加恵瑠神社に着きます。";

const ASHIYU_FROM = "加恵瑠神社から歩いてすぐ、鷺の足湯に着きます。下呂温泉街の中にある足湯で、歩き疲れた足を軽く温めることができます。この後は、歩いてすぐ、白鷺の湯へ向かいましょう。";
const ASHIYU_TO = "加恵瑠神社から歩いてすぐ、鷺の足湯に着きます。下呂温泉街の中にある足湯で、歩き疲れた足を軽く温めることができます。ほかの人を写さないようにしましょう。この後は、歩いてすぐ、白鷺の湯へ向かいましょう。";

const SHIRASAGI_FROM = "鷺の足湯から歩いてすぐ、白鷺の湯に着きます。下呂温泉街にある外湯の一つで、地元の人や旅行者が立ち寄る共同浴場です。下呂の温泉につかり、旅の最後をゆっくりと過ごしましょう。見学を終えたら、下呂駅まで歩いて戻りましょう。";
const SHIRASAGI_TO = "鷺の足湯から歩いてすぐ、白鷺の湯に着きます。下呂温泉街にある外湯の一つで、地元の人や旅行者が立ち寄る共同浴場です。ほかの人を写さず、長湯は避けて、水分をとりながら入りましょう。見学を終えたら、下呂駅まで歩いて戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '158f73fa%'`);
  const itinId = rows[0].id;
  const gassho = await findSpotInItinerary(itinId, { spotName: "下呂温泉合掌村" });
  const chaplin = await findSpotInItinerary(itinId, { spotName: "白鷺橋" });
  const lunch = await findSpotInItinerary(itinId, { spotName: "下呂温泉街(昼食)" });
  const funsenchi = await findSpotInItinerary(itinId, { spotName: "下呂温泉噴泉池" });
  const kaeru = await findSpotInItinerary(itinId, { spotName: "加恵瑠神社" });
  const ashiyu = await findSpotInItinerary(itinId, { spotName: "鷺の足湯" });
  const shirasagi = await findSpotInItinerary(itinId, { spotName: "白鷺の湯" });
  const dayId = gassho.dayId;

  if (!gassho.memo?.includes(GASSHO_FROM)) throw new Error("下呂温泉合掌村の文言が想定外です");
  if (chaplin.memo !== CHAPLIN_FROM) throw new Error("白鷺橋の文言が想定外です");
  if (lunch.memo !== LUNCH_FROM) throw new Error("下呂温泉街(昼食)の文言が想定外です");
  if (funsenchi.memo !== FUNSENCHI_FROM) throw new Error("下呂温泉噴泉池の文言が想定外です");
  if (!kaeru.memo?.includes(KAERU_FROM)) throw new Error("加恵瑠神社の文言が想定外です");
  if (ashiyu.memo !== ASHIYU_FROM) throw new Error("鷺の足湯の文言が想定外です");
  if (shirasagi.memo !== SHIRASAGI_FROM) throw new Error("白鷺の湯の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      {
        id: gassho.id,
        data: {
          lat: 35.8084673,
          lng: 137.2499485,
          memo: gassho.memo!.replace(GASSHO_FROM, GASSHO_TO),
        },
      },
      {
        create: {
          name: "森八幡神社",
          address: "岐阜県下呂市森1321",
          lat: 35.80759,
          lng: 137.244019,
          visitTime: t(12, 8),
          stayDurationMin: 45,
          memo: MORIHACHIMANGU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
        },
      },
      {
        id: chaplin.id,
        data: {
          visitTime: t(12, 55),
          memo: CHAPLIN_TO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        id: lunch.id,
        data: {
          visitTime: t(13, 9),
          stayDurationMin: 85,
          memo: LUNCH_TO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
      {
        id: funsenchi.id,
        data: {
          visitTime: t(14, 39),
          memo: FUNSENCHI_TO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        id: kaeru.id,
        data: {
          visitTime: t(15, 3),
          memo: kaeru.memo!.replace(KAERU_FROM, KAERU_TO),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
      { id: ashiyu.id, data: { visitTime: t(15, 24), memo: ASHIYU_TO } },
      {
        id: shirasagi.id,
        data: {
          lat: 35.8093187,
          lng: 137.2414312,
          visitTime: t(15, 40),
          stayDurationMin: 50,
          memo: SHIRASAGI_TO,
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
