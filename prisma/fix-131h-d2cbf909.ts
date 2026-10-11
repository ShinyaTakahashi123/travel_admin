/**
 * #131 d2cbf909の直し(8回目)。企画運営(2026-10-11)の指摘。
 *
 * 1. 鞘橋65分(渡れない橋を外から見るだけなのに長すぎ、決まりAの
 *    水増し)を20分に短縮。「思いを馳せながら過ごしましょう」の
 *    水増し気味の一文も削除。
 * 2. 表参道→大門「歩いておよそ35分」(audit「0.5km/35分」の指摘どおり
 *    長すぎ)を修正。もとの「30〜40分」は検索の要約で、開いて確認できる
 *    URLが見つからなかったため(mapple.net/article/81627/を開いたが
 *    具体的な時間の記載はなかった)、企画運営の指示に沿って本宮まで
 *    (785段・30〜40分が目安)の半分程度、18分に修正。出典が確認できな
 *    かった旨を報告する。
 * 3. 空いた時間(鞘橋45分+移動17分=62分)に、海の科学館(こんぴら船の
 *    実物大模型などを展示する博物館、OSM way 1160847109、f6221e55
 *    未使用)を追加。
 * 4. 奥社に、冬は日没が早いため暗くなる前に下山する注意の一文を追加。
 *
 * 海の科学館: 34.1863214,133.8178117(OSM実点、確認済み)。出典:
 * news.mynavi.jp/article/20240724-2991619/ほか(瀬戸内海の歴史・船の
 * 仕組み、江戸時代の港を再現した展示、金毘羅船の実物大模型、操舵室の
 * 体験コーナー)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SAYABASHI_MEMO =
  "金陵の郷から歩いておよそ7分、金倉川のほとりに着きます。古くから「清めの川」とされ、こんぴら参りの旅人は、長旅の汚れをこの川で洗い流してから金刀比羅宮へ向かったと伝えられています。川に架かる鞘橋は、橋脚を持たずに浮いているように見える珍しい構造で、ふだんは渡ることができず、秋の例大祭などの神事のときだけ使われます。外から眺めてみましょう。この後は、歩いておよそ6分、海の科学館へ向かいましょう。";

const UMINOKAGAKUKAN_MEMO =
  "鞘橋から歩いておよそ6分、海の科学館に着きます。瀬戸内海の歴史や、船の仕組みを紹介する博物館です。江戸時代の港の様子を再現した展示では、金毘羅参りで活躍した「金毘羅船」の実物大の模型を見ることができます。操舵室を再現した展示や、模型の船を操作する体験コーナーもあります。この後は、歩いてすぐ、表参道へ向かいましょう。";

const OMOTESANDO_MEMO =
  "海の科学館から歩いてすぐ、表参道に着きます。大門に向かう参道沿いには、うどん店や土産物店が並んでいます。この先、奥社までは長い石段が続き、食事のできる店もないので、ここで昼食をとっておきましょう。この後は、参道を歩いておよそ18分、365段の石段を上って大門へ向かいましょう。";

const DAIMON_MEMO =
  "表参道から参道を歩いておよそ18分、365段の石段を上って大門に着きます。入母屋造りの二階建ての門で、ここから先が金刀比羅宮の神域となり、俗世との境目を示しています。大門をくぐった先には、白い傘をさして並ぶ飴売り「五人百姓」の店があり、古くからこの五軒だけに境内での商いが許されてきたと伝えられています。この先、奥社までは長い石段が続きます。歩きやすい靴で、自分のペースで休みながら上り下りし、こまめに水分をとりましょう。この後は、石段を上っておよそ10分、高橋由一館へ向かいましょう。";

const OKUSHA_FROM = "参拝を終えたら、石段を下っておよそ50分、琴平駅へ戻りましょう。";
const OKUSHA_TO =
  "参拝を終えたら、石段を下っておよそ50分、琴平駅へ戻りましょう。日が短い季節は、暗くなる前に下りられるよう時間に気をつけましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd2cbf909%'`);
  const itinId = rows[0].id;

  const sayabashi = await findSpotInItinerary(itinId, { spotName: "鞘橋" });
  const omotesando = await findSpotInItinerary(itinId, { spotName: "表参道（昼食）" });
  const daimon = await findSpotInItinerary(itinId, { spotName: "大門" });
  const takahashiyuichikan = await findSpotInItinerary(itinId, { spotName: "高橋由一館" });
  const asahisha = await findSpotInItinerary(itinId, { spotName: "旭社" });
  const hongu = await findSpotInItinerary(itinId, { spotName: "本宮" });
  const tembodai = await findSpotInItinerary(itinId, { spotName: "展望台" });
  const okusha = await findSpotInItinerary(itinId, { spotName: "金刀比羅宮 奥社（厳魂神社）" });
  const takatouro = await findSpotInItinerary(itinId, { spotName: "高灯籠" });
  const kinryonosato = await findSpotInItinerary(itinId, { spotName: "金陵の郷" });

  if (!okusha.memo?.includes(OKUSHA_FROM)) throw new Error("奥社の文言が想定外です");

  console.log("確認OK。dayId:", sayabashi.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const items: SpotOrderItem[] = [
      { id: takatouro.id, data: {} },
      { id: kinryonosato.id, data: {} },
      {
        id: sayabashi.id,
        data: { memo: SAYABASHI_MEMO, stayDurationMin: 20 },
      },
      {
        create: {
          name: "海の科学館",
          memo: UMINOKAGAKUKAN_MEMO,
          lat: 34.1863214,
          lng: 133.8178117,
          visitTime: t(10, 46),
          stayDurationMin: 42,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
        },
      },
      {
        id: omotesando.id,
        data: {
          memo: OMOTESANDO_MEMO,
          visitTime: t(11, 30),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null }] },
        },
      },
      {
        id: daimon.id,
        data: {
          memo: DAIMON_MEMO,
          visitTime: t(12, 48),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 18, transitLine: null }] },
        },
      },
      { id: takahashiyuichikan.id, data: { visitTime: t(13, 18) } },
      { id: asahisha.id, data: { visitTime: t(13, 48) } },
      { id: hongu.id, data: { visitTime: t(14, 18) } },
      { id: tembodai.id, data: { visitTime: t(14, 40) } },
      {
        id: okusha.id,
        data: { memo: okusha.memo!.replace(OKUSHA_FROM, OKUSHA_TO), visitTime: t(15, 50) },
      },
    ];
    await setDaySpotOrder(takatouro.dayId, items, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
