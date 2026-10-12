/**
 * #132 d45c6b3bの直し(6回目)。企画運営(2026-10-11)の指摘7点+法務の
 * 鎌先温泉の指摘(同じ内容)。
 *
 * 1. 昼食: 蔵王山頂レストハウスを1つのスポットとして新規に追加
 *    (11:42〜12:32、11:30〜13:30の間)。座標はOSM実点(way 854811459、
 *    38.1283988,140.4462775)。
 * 2. 滝見台55分・駒草平55分(展望台として長すぎ、決まりAの水増し)を
 *    それぞれ30分に短縮。空いた時間をレストハウスにあてた。
 * 3. 鎌先温泉「切り傷によく効く湯として知られ」(効き目をうたう書き方、
 *    法務も同じ指摘)を削除し、「昔から湯治場として親しまれてきた」に。
 * 4. 刈田嶺神社奥宮「冬の間は雪深い山頂へのお参りが難しくなるため、
 *    御神体は遠刈田温泉の里宮へ遷されます」が8a15b42cとほぼ同じ文
 *    だったため削除。昼食の一文(レストハウスへ分離したため不要)も
 *    削除。「お参りください」→「お参りしましょう」。
 * 5. 御釜「作り上げてきたのだそうです」(伝聞のくだけた言い方)→
 *    「作り上げてきたとされます」に修正。
 * 6. 白石城「三階櫓からは、益岡公園と白石の街並みを見渡すことができ
 *    ます」が8a15b42cと似ていたため、甲冑試着体験(片倉小十郎景綱らの
 *    甲冑を再現、予約制)に替えた(出典: gltjp.com/ja/directory/
 *    item/12590/等)。
 * 7. 最初と最後: 白石蔵王駅でレンタカーを借り、白石蔵王駅で返す形に
 *    明記(白石蔵王駅⇔遠刈田温泉はおよそ25分、白石城⇔白石蔵王駅は
 *    およそ5分、座標間の距離から見積もり)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ECHOLINE_MEMO =
  "白石蔵王駅でレンタカーを借り、車でおよそ25分、遠刈田温泉を経由して、蔵王連峰を貫く蔵王エコーラインに入ります。昭和37年(1962)に開通した、宮城・山形県境を結ぶ山岳ドライブルートです。沿道には「賽の河原」など仏教にちなんだ地名が残っており、この道ができる前、蔵王が信仰の山として多くの人に登られていた歴史をしのばせます。標高を上げるにつれて木々の姿は変わり、視界が開けると蔵王連峰の雄大な稜線が広がります。積雪のため冬の間は通行止めとなり、春から秋にかけてだけ走ることのできる道です。この後は、車でおよそ8分、滝見台へ向かいましょう。";

const OKAMA_SOUDESU_FROM = "作り上げてきたのだそうです。";
const OKAMA_SOUDESU_TO = "作り上げてきたとされます。";
const OKAMA_END_FROM = "この後は、歩いておよそ10分、刈田嶺神社奥宮へ向かいましょう。";
const OKAMA_END_TO = "この後は、歩いておよそ5分、蔵王山頂レストハウスへ向かいましょう。";

const RESTHOUSE_MEMO =
  "蔵王のお釜から歩いておよそ5分、蔵王山頂レストハウスに着きます。刈田岳の山頂、御釜のすぐそばに立つ休憩施設で、1階には売店、2階には食堂があります。霧が晴れるのを待つ人や、登山者の休憩の場としても利用されています。ここで昼食をとりましょう。この後は、歩いておよそ3分、刈田嶺神社奥宮へ向かいましょう。";

const KATTAMINEJINJA_MEMO =
  "蔵王山頂レストハウスから歩いておよそ3分、刈田嶺神社奥宮に着きます。修験道の祖とされる役小角(えんのぎょうじゃ)が開いたと伝えられる、古くからの信仰の山・蔵王の中心となる神社です。平安時代の『延喜式』にもその名が記された、歴史の長い神社としても知られています。現在の社殿は、脇の金具に刻まれた銘から、享保3年(1718)に建てられたものと確認されており、宮城県の指定文化財になっています。敬意を持ってお参りしましょう。見学を終えたら、車でおよそ65分、弥治郎こけし村へ向かいましょう。";

const KAMASAKI_MEMO =
  "弥治郎こけし村から車でおよそ3分、鎌先温泉に着きます。永享元年(1428)、農民が鍬の先で掘り当てたという言い伝えから「鎌先」の名がついたとされ、昔から湯治場として親しまれてきました。谷あいに宿が並ぶ一帯には、大正時代の木造建築も残り、昔ながらの湯治場の風情が漂います。レトロな街並みを散策してみましょう。この後は、車でおよそ10分、白石城へ向かいましょう。";

const SHIROISHIJO_MEMO =
  "鎌先温泉から車でおよそ10分、白石城に着きます。仙台藩の重臣・片倉氏が、関ヶ原の戦いのあとから明治維新まで260年近く居城とした城です。戊辰戦争で新政府軍に降伏したことにより明治7年(1874)に取り壊されましたが、平成7年(1995)、発掘調査に基づいて、文政6年(1823)の再建後の姿を史実に忠実に、吉野産のヒノキを使った木造で復元されました。解体から120年ぶりの再建です。予約をすれば、片倉小十郎景綱らの甲冑を再現した衣装を着て、記念撮影ができる体験も用意されています。見学を終えたら、車でおよそ5分、白石蔵王駅でレンタカーを返しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;

  const echoline = await findSpotInItinerary(itinId, { spotName: "蔵王エコーライン" });
  const takimidai = await findSpotInItinerary(itinId, { spotName: "滝見台" });
  const komakusadaira = await findSpotInItinerary(itinId, { spotName: "駒草平" });
  const okama = await findSpotInItinerary(itinId, { spotName: "蔵王のお釜" });
  const kattaminejinja = await findSpotInItinerary(itinId, { spotName: "刈田嶺神社奥宮" });
  const yajiro = await findSpotInItinerary(itinId, { spotName: "弥治郎こけし村" });
  const kamasaki = await findSpotInItinerary(itinId, { spotName: "鎌先温泉" });
  const shiroishijo = await findSpotInItinerary(itinId, { spotName: "白石城" });

  if (!okama.memo?.includes(OKAMA_SOUDESU_FROM)) throw new Error("お釜の文言(そうです)が想定外です");
  if (!okama.memo?.includes(OKAMA_END_FROM)) throw new Error("お釜の結びが想定外です");

  console.log("確認OK。dayId:", echoline.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const okamaMemo = okama.memo!.replace(OKAMA_SOUDESU_FROM, OKAMA_SOUDESU_TO).replace(OKAMA_END_FROM, OKAMA_END_TO);

  await prisma.$transaction(async (tx) => {
    const items: SpotOrderItem[] = [
      { id: echoline.id, data: { memo: ECHOLINE_MEMO } },
      { id: takimidai.id, data: { stayDurationMin: 30 } },
      { id: komakusadaira.id, data: { visitTime: t(10, 17), stayDurationMin: 30 } },
      { id: okama.id, data: { memo: okamaMemo, visitTime: t(10, 52) } },
      {
        create: {
          name: "蔵王山頂レストハウス",
          memo: RESTHOUSE_MEMO,
          lat: 38.1283988,
          lng: 140.4462775,
          visitTime: t(11, 42),
          stayDurationMin: 50,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        id: kattaminejinja.id,
        data: {
          memo: KATTAMINEJINJA_MEMO,
          visitTime: t(12, 35),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] },
        },
      },
      { id: yajiro.id, data: { visitTime: t(14, 15) } },
      { id: kamasaki.id, data: { memo: KAMASAKI_MEMO, visitTime: t(15, 18) } },
      { id: shiroishijo.id, data: { memo: SHIROISHIJO_MEMO, visitTime: t(15, 58) } },
    ];
    await setDaySpotOrder(echoline.dayId, items, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
