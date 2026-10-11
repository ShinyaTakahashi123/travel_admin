/**
 * #134 e0181f83の直し。もとは弥山(宮島ロープウェー)の1か所のみ
 * (09:30〜12:00、終始案内役の話し方)で4か所未満。
 * 紅葉谷公園(ロープウエー乗り場)・獅子岩展望台(ロープウエー終点)・
 * 釈迦涅槃堂・大聖院(大聖院コースの下山先)を追加し5か所に。
 * 既存の78026dc9(紅葉谷公園・大聖院を使用)とは別の切り口で執筆
 * (78026dc9=紅葉の名所・空海ゆかりの歴史上の人物の参詣、
 *  本案=ロープウエー登山の起点・終点としての機能、勅願堂の由来)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MOMIJIDANI_MEMO =
  "宮島桟橋から歩いておよそ15分、紅葉谷公園に着きます。弥山の山麓、紅葉谷川沿いに広がる公園で、弥山へ登るいくつかの道のうち「紅葉谷コース」の起点でもあり、宮島ロープウエーの紅葉谷駅もこの公園の中にあります。渓流のせせらぎを聞きながら、ひと息ついて、これから登る弥山に思いを巡らせましょう。この後は、宮島ロープウエーで榧谷駅を経て、およそ14分、獅子岩駅へ向かいましょう。";

const SHISHIIWA_MEMO =
  "紅葉谷駅から宮島ロープウエーで榧谷駅を経て、およそ14分、山上の獅子岩駅に着きます。駅のすぐそばにある獅子岩展望台からは、瀬戸内海に浮かぶ島々を見渡せます。すぐ近くには、ライオンの姿に見えるとされる巨岩「獅子岩」もあります。ここから弥山山頂までは、さらに徒歩での登山となります。この後は、弥山本堂・霊火堂を経て、歩いておよそ30分、弥山山頂展望台へ向かいましょう。";

const MISEN_MEMO =
  "獅子岩駅から歩いておよそ30分、弥山山頂展望台に着きます。途中には弥山本堂・霊火堂があり、弘法大師空海の修行以来1200年以上消えることなく燃え続けているとされる「消えずの火」があります。この火は、広島平和記念公園の「平和の灯」の元火にもなったと伝えられています。標高535mのこの山は、大同元年(806)に空海が開いたと伝えられる、古くからの信仰の対象で、真言密教の修行の場として大切にされてきました。大きな岩が積み重なる山頂の展望台からは、瀬戸内海に浮かぶ島々を一望する多島美のパノラマが広がります。北側の斜面には、国の天然記念物に指定された「弥山原始林」が広がり、暖温帯性の針葉樹と南方系の植物が共存する貴重な自然も見られます。厳島神社とその前面の海、そしてこの弥山の原始林をあわせた一帯は、世界文化遺産にも登録されています。持ってきた軽食やお弁当を広げて、ここで昼食をとりましょう。今も信仰の対象となっている霊山ですので、静かに、敬意を持ってお過ごしください。この後は、大聖院コースを歩いておよそ75分、釈迦涅槃堂へ向かいましょう。石段の続く下り道です。";

const SHAKANEHAN_MEMO =
  "弥山山頂展望台から、大聖院コースを歩いておよそ75分、釈迦涅槃堂に着きます。大聖院の境内にあるお堂で、お釈迦様が涅槃(亡くなる際の姿)で安置された涅槃像を祀っています。長い下り道を歩いてきた体を、ここで少し休めましょう。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ5分、大聖院へ向かいましょう。";

const DAISHOIN_MEMO =
  "釈迦涅槃堂から歩いておよそ5分、大聖院に着きます。大同元年(806)、唐から帰国した弘法大師空海が、この地で修行したのちに開いたと伝えられる、宮島でも最も歴史ある寺院の一つとされています。本堂である勅願堂は、12世紀に宮島を訪れた鳥羽天皇の命により建てられた、境内で最も古い建物でしたが、今の建物は明治43年(1910)に建てられたものです。安置されている本尊の波切不動明王像は、豊臣秀吉が寄進したと伝えられています。「勅願」とは、天皇が国の平和と繁栄を祈ることを意味します。弥山を開いた空海ゆかりの寺として、山を下りてきた道の終わりにふさわしい場所です。静かに、敬意を持ってお参りしましょう。参拝を終えたら、歩いておよそ10分、宮島桟橋へ向かい、帰りのフェリーに乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e0181f83%'`);
  const itinId = rows[0].id;
  const misen = await findSpotInItinerary(itinId, { spotName: "弥山（宮島ロープウェー）" });

  console.log("dayId:", misen.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1: SpotOrderItem[] = [
    {
      create: {
        name: "紅葉谷公園",
        lat: 34.2938092,
        lng: 132.3250384,
        visitTime: t(9, 30),
        stayDurationMin: 30,
        memo: MOMIJIDANI_MEMO,
      },
    },
    {
      create: {
        name: "獅子岩展望台",
        lat: 34.2796894,
        lng: 132.3197576,
        visitTime: t(10, 14),
        stayDurationMin: 35,
        memo: SHISHIIWA_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 14, transitLine: "宮島ロープウエー" }] },
      },
    },
    {
      id: misen.id,
      data: {
        visitTime: t(11, 19),
        stayDurationMin: 110,
        memo: MISEN_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 30 }] },
      },
    },
    {
      create: {
        name: "釈迦涅槃堂",
        lat: 34.2912855,
        lng: 132.3187532,
        visitTime: t(14, 24),
        stayDurationMin: 20,
        memo: SHAKANEHAN_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 75, transitLine: "大聖院コース" }] },
      },
    },
    {
      create: {
        name: "大聖院",
        lat: 34.2929275,
        lng: 132.3189497,
        visitTime: t(14, 49),
        stayDurationMin: 105,
        memo: DAISHOIN_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
      },
    },
  ];

  await setDaySpotOrder(misen.dayId, day1);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
