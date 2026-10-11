/**
 * #134 e0181f83の直し(5回目)。企画運営の指示(c)で、大聖院のあとに
 * 多宝塔・清盛神社・町家通り・宮島伝統産業会館を追加し、終了時刻を
 * 16:30〜17:00に近づける。多宝塔(3155fabfのみ使用)・清盛神社(78026dc9
 * のみ使用)は、それぞれの既存文を確認し、使っていない事実・切り口で執筆
 * (3155fabf=建立年・高さ・亀腹・勝山城跡、本案=多宝塔という建築形式自体。
 *  78026dc9=神社の創建経緯・分祀、本案=清盛本人の経歴)。
 * あわせて法務の指摘で、大聖院の「焼失し」(出典で確かめられない)を削除。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DAISHOIN_MEMO =
  "釈迦涅槃堂から歩いておよそ5分、大聖院に着きます。大聖院コースを歩いて下りてきた道の終着点で、空海が開いたと伝えられる弥山のふもとに建つ寺です。本堂である勅願堂には、豊臣秀吉が寄進したと伝えられる本尊・波切不動明王像が安置されています。もとの建物は、12世紀に宮島を訪れた鳥羽天皇の命により建てられた、境内で最も古い建物でしたが、今の建物は明治43年(1910)に建て直されたものです。「勅願」とは、天皇が国の平和と繁栄を祈ることを意味します。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ5分、多宝塔へ向かいましょう。坂道です、足元に気をつけましょう。";

const TAHOTO_MEMO =
  "大聖院から坂道を歩いておよそ5分、多宝塔に着きます。下層が方形、上層が円形という形の、二重の塔です。近くに立つ五重塔とは違う、もう一つの塔の形を見比べてみましょう。石段や坂道が続きますので、足元に気をつけましょう。この後は、歩いておよそ4分、清盛神社へ向かいましょう。";

const KIYOMORI_MEMO =
  "多宝塔から歩いておよそ4分、清盛神社に着きます。祀られているのは平清盛で、久安2年(1146)に安芸守となり、保元・平治の乱を経て、仁安2年(1167)には武士として初めて太政大臣になったとされる人物です。「西の松原」と呼ばれる松林の中にあり、海を見渡せる静かな一角です。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ9分、町家通りへ向かいましょう。";

const MACHIYA_MEMO =
  "清盛神社から歩いておよそ9分、町家通りに着きます。宮島桟橋から厳島神社へ続く表参道商店街とは違う、山側寄りの古い参道にあたる通りで、白壁や弁柄格子の町家が軒を連ねています。令和3年(2021)、国の重要伝統的建造物群保存地区に選定されました。宮島の商家の町並みを眺めながら、ゆっくり歩いてみましょう。この後は、歩いておよそ6分、宮島伝統産業会館へ向かいましょう。";

const SANGYOKAIKAN_MEMO =
  "町家通りから歩いておよそ6分、宮島伝統産業会館(みやじまん工房)に着きます。宮島の伝統工芸品である杓子・ロクロ細工・宮島彫りなどの「宮島細工」を展示・販売する、体験型の観光施設です。宮島細工は、鎌倉時代に厳島神社の建設にあわせて伝わった木工の技術が起源とされ、江戸時代に発展し、昭和57年(1982)には伝統工芸品の指定を受けました。見学を終えたら、歩いてすぐの宮島桟橋から、帰りのフェリーに乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e0181f83%'`);
  const itinId = rows[0].id;

  const momijidani = await findSpotInItinerary(itinId, { spotName: "紅葉谷公園" });
  const shishiiwa = await findSpotInItinerary(itinId, { spotName: "獅子岩駅" });
  const misen = await findSpotInItinerary(itinId, { spotName: "弥山（宮島ロープウェー）" });
  const shakanehan = await findSpotInItinerary(itinId, { spotName: "釈迦涅槃堂" });
  const daishoin = await findSpotInItinerary(itinId, { spotName: "大聖院" });

  console.log("dayId:", momijidani.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1: SpotOrderItem[] = [
    { id: momijidani.id, data: {} },
    { id: shishiiwa.id, data: {} },
    { id: misen.id, data: {} },
    { id: shakanehan.id, data: {} },
    { id: daishoin.id, data: { memo: DAISHOIN_MEMO } },
    {
      create: {
        name: "多宝塔",
        lat: 34.2946169,
        lng: 132.3182035,
        visitTime: t(14, 49),
        stayDurationMin: 25,
        memo: TAHOTO_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
      },
    },
    {
      create: {
        name: "清盛神社",
        lat: 34.2963772,
        lng: 132.3164232,
        visitTime: t(15, 18),
        stayDurationMin: 25,
        memo: KIYOMORI_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
    {
      create: {
        name: "町家通り",
        lat: 34.298436,
        lng: 132.3223952,
        visitTime: t(15, 52),
        stayDurationMin: 20,
        memo: MACHIYA_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
      },
    },
    {
      create: {
        name: "宮島伝統産業会館",
        lat: 34.3020804,
        lng: 132.323491,
        visitTime: t(16, 18),
        stayDurationMin: 20,
        memo: SANGYOKAIKAN_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
      },
    },
  ];

  await setDaySpotOrder(momijidani.dayId, day1);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
