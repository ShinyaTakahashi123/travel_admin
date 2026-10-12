/**
 * #149 158f73fa「下呂温泉合掌村で飛騨の里山にふれる、体験型の日帰りプラン」の
 * 直し。1日4か所以上・9時ごろ〜17時ごろの決まりに合わせる。
 *
 * もとは下呂温泉合掌村の1か所のみ(09:30〜11:30)、終始案内役の話し方
 * (皆様/ご案内/お楽しみください)だった。既存の下呂の2本(401d9f0c=下呂
 * 温泉街・クアガーデン露天風呂・下呂発温泉博物館・加恵瑠神社・温泉寺・
 * 下呂温泉合掌村・縄文公園・下呂歴史記念館、57b8650d=禅昌寺・巌立峡・
 * 下呂の温泉街・湯のまち雨情公園・下呂発温泉博物館・温泉寺・中山七里・
 * 金山巨石群・金山の町・横谷峡)と見比べ、どちらにも使われていない
 * 白鷺橋(チャップリン像)・下呂温泉噴泉池・鷺の足湯・白鷺の湯を新規に
 * 追加。合掌村自体は401d9f0cにも使われているが、タイトルの主題のため
 * そのまま残し、口調のみ直す(#148の遠野ふるさと村と同じ扱い)。
 * 加恵瑠神社は401d9f0cで使われているが、頼まれた切り口(カエルの語呈合わせ・
 * 創建の経緯)で文・組み立てを変えて追加。
 *
 * 下呂は小さな温泉街のため、ほかの見どころがすでに2本でほぼ使われており、
 * 合掌村(体験型施設、タイトルの主題)と白鷺の湯(外湯でのんびり過ごす、
 * 温泉街らしい締め方)の滞在は長めだが、内容に基づく長さとして判断。
 *
 * 座標はOSM実点(チャップリン像node5106813103・下呂温泉噴泉池
 * node5255414316・加恵瑠神社node14067321973・鷺の足湯node11005699530)、
 * 白鷺の湯はway714665591を構成するnodeの中心(建物の点がwayのため)。
 * 昼食は下呂温泉観光協会node5106794076の点を使用(店名は出さない)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const GASSHO_FROM =
  "皆様、本日ご案内するのは下呂温泉合掌村です。戦後の失業対策事業で生まれた土取り場の跡地に、昭和38年(1963)、飛騨郷土館として開館したのが始まりで、昭和44年(1969)には白川村や富山県五箇山から合掌造り家屋を移築し、今の「下呂温泉合掌村」という名前になりました。国の重要文化財に指定された「旧大戸家住宅」を中心に、10棟の合掌造り家屋が集まり、飛騨の里山の暮らしを再現しています。館内では、農具や民具の展示に加え、機織りや杵つきなど、昔ながらの体験プログラムも楽しめます。白川郷まで足を延ばさなくても、合掌造りの暮らしにふれられる、飛騨の里山の縮図のような場所です。移築された家屋も、かつては実際に人が暮らしていた住まいであることに思いを馳せながら、見学をお楽しみください。";
const GASSHO_TO =
  "下呂駅からバスでおよそ6分、下呂温泉合掌村に着きます。戦後の失業対策事業で生まれた土取り場の跡地に、昭和38年(1963)、飛騨郷土館として開館したのが始まりで、昭和44年(1969)には白川村や富山県五箇山から合掌造り家屋を移築し、今の「下呂温泉合掌村」という名前になりました。国の重要文化財に指定された「旧大戸家住宅」を中心に、10棟の合掌造り家屋が集まり、飛騨の里山の暮らしを再現しています。館内では、農具や民具の展示に加え、機織りや杵つきなど、昔ながらの体験プログラムも楽しめます。移築された家屋も、かつては実際に人が暮らしていた住まいです。この後は、歩いておよそ9分、白鷺橋へ向かいましょう。";

const CHAPLIN_MEMO =
  "下呂温泉合掌村から歩いておよそ9分、白鷺橋に着きます。橋のたもとには、平成13年(2001)11月に除幕されたチャップリン像が立ち、記念撮影をする人の姿をよく見かけます。橋の上からは、飛騨川沿いに広がる温泉街の町並みを眺めることができます。この後は、歩いておよそ3分、下呂温泉噴泉池へ向かいましょう。";

const FUNSENCHI_MEMO =
  "白鷺橋から歩いておよそ3分、下呂温泉噴泉池に着きます。下呂大橋のたもと、飛騨川の河原に湧く自然の露天風呂で、下呂温泉の名物として知られています。令和3年(2021)12月から入浴は禁止されていますが、足湯としては今も利用できます。この後は、歩いておよそ5分、下呂温泉街へ向かいましょう。";

const LUNCH_MEMO =
  "下呂温泉噴泉池から歩いておよそ5分、下呂温泉街に着きます。飛騨川沿いに宿や土産物店、食堂が並ぶ通りで、ここで昼食をとりましょう。下呂温泉は、有馬温泉・草津温泉とともに「日本三名泉」の一つとされています。この後は、歩いておよそ7分、加恵瑠神社へ向かいましょう。";

const KAERU_MEMO =
  "下呂温泉街から歩いておよそ7分、加恵瑠神社に着きます。平成22年(2010)に建てられた神社で、「ゲロ」が「ゲロゲロ」というカエルの鳴き声に通じることから、旅の安全を願って「加恵瑠大明神」がまつられています。石灯籠や手水舎にもカエルの意匠が施され、絵馬やお守りにもカエルがあしらわれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いてすぐ、鷺の足湯へ向かいましょう。";

const ASHIYU_MEMO =
  "加恵瑠神社から歩いてすぐ、鷺の足湯に着きます。下呂温泉街の中にある足湯で、歩き疲れた足を軽く温めることができます。この後は、歩いてすぐ、白鷺の湯へ向かいましょう。";

const SHIRASAGI_MEMO =
  "鷺の足湯から歩いてすぐ、白鷺の湯に着きます。下呂温泉街にある外湯の一つで、地元の人や旅行者が立ち寄る共同浴場です。下呂の温泉につかり、旅の最後をゆっくりと過ごしましょう。見学を終えたら、下呂駅まで歩いて戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '158f73fa%'`);
  const itinId = rows[0].id;
  const gassho = await findSpotInItinerary(itinId, { spotName: "下呂温泉合掌村" });
  const dayId = gassho.dayId;

  if (!gassho.memo?.includes(GASSHO_FROM)) throw new Error("下呂温泉合掌村の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      {
        id: gassho.id,
        data: {
          visitTime: t(9, 30),
          stayDurationMin: 150,
          memo: gassho.memo!.replace(GASSHO_FROM, GASSHO_TO),
        },
      },
      {
        create: {
          name: "白鷺橋",
          address: "岐阜県下呂市森",
          lat: 35.8080960,
          lng: 137.2429079,
          visitTime: t(12, 9),
          stayDurationMin: 10,
          memo: CHAPLIN_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
        },
      },
      {
        create: {
          name: "下呂温泉噴泉池",
          address: "岐阜県下呂市湯之島",
          lat: 35.8075858,
          lng: 137.2408768,
          visitTime: t(12, 22),
          stayDurationMin: 20,
          memo: FUNSENCHI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        create: {
          name: "下呂温泉街(昼食)",
          address: "岐阜県下呂市森",
          lat: 35.8055414,
          lng: 137.2446573,
          visitTime: t(12, 47),
          stayDurationMin: 70,
          memo: LUNCH_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        create: {
          name: "加恵瑠神社",
          address: "岐阜県下呂市湯之島",
          lat: 35.8098620,
          lng: 137.2414253,
          visitTime: t(14, 4),
          stayDurationMin: 20,
          memo: KAERU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        create: {
          name: "鷺の足湯",
          address: "岐阜県下呂市湯之島",
          lat: 35.8098642,
          lng: 137.2410025,
          visitTime: t(14, 25),
          stayDurationMin: 15,
          memo: ASHIYU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
      {
        create: {
          name: "白鷺の湯",
          address: "岐阜県下呂市湯之島",
          lat: 35.809364,
          lng: 137.241484,
          visitTime: t(14, 41),
          stayDurationMin: 120,
          memo: SHIRASAGI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
