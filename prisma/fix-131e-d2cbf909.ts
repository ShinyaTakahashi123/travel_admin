/**
 * #131 d2cbf909の直し(5回目)。企画運営(2026-10-11)の指摘3点。
 *
 * 1. 昼食: 展望台(本宮の上)から参道の茶店(大門より下)へ行って戻る
 *    行程は、距離も時刻(展望台11:39発→奥社12:29着の50分の中に
 *    入ってしまう)も実際には成り立たない。順番を変え、朝に駅側の
 *    高灯籠・金陵の郷を回り、大門より下の表参道(こんぴらうどん等が
 *    集まる区域、34.1867,133.8173、推定)で実際に昼食をとってから
 *    石段を上る形にした。奥社を1日の最後にし、石段の上り(大門→
 *    高橋由一館→旭社→本宮→展望台→奥社)がそのまま午後の内容になる。
 * 2. 五人百姓の座標が大門と全く同じだった。OSMに五人百姓自体の点が
 *    なかったため、大門のスポットの文にまとめ、五人百姓は単独の
 *    スポットとしては削除。
 * 3. 奥社→(もとは金陵の郷への)下り90分は時刻合わせだった。奥社が
 *    最後のスポットになったため、結びの文を「琴平駅へ戻る」に変更。
 *    下りの所要時間は、本宮までの往復が1.5〜2時間程度(複数の
 *    クチコミ、4travel.jp等で確認)で「下りは登りよりずっと軽快」
 *    (banzokubiology.com等)とされることから、上り(785段でおよそ
 *    55分程度)より短い下り時間を踏まえ、1368段の下りをおよそ50分と
 *    見積もった(往路の合計上り時間からの比例と、下りが上りより
 *    明確に短いという複数の記述に基づく推定。下りのみを直接示す
 *    出典は見つからなかったため、その旨を報告する)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TAKATOURO_MEMO =
  "琴平駅から歩いてすぐ、高灯籠に着きます。江戸時代の終わり、万延元年(1860)に建てられた、高さ27mの灯籠です。かつて瀬戸内海を行き交う船にとって、沖からも見える目印の役割を果たしていたと伝えられ、国の重要有形民俗文化財に指定されています。この後は、歩いておよそ8分、金陵の郷へ向かいましょう。";

const KINRYONOSATO_MEMO =
  "高灯籠から歩いておよそ8分、金陵の郷に着きます。江戸時代から続く地元の酒蔵が、蔵の一部を資料館として公開しています。昔の酒造りの道具や工程を、建物とあわせて見学できます。営業時間が限られるので、お出かけ前に公式で確かめましょう。この後は、歩いておよそ6分、表参道へ向かいましょう。";

const OMOTESANDO_MEMO =
  "金陵の郷から歩いておよそ6分、表参道に着きます。大門に向かう参道沿いには、うどん店や土産物店が並んでいます。この先、奥社までは長い石段が続き、食事のできる店もないので、ここで昼食をとっておきましょう。この後は、歩いておよそ7分、大門へ向かいましょう。";

const DAIMON_MEMO =
  "表参道から歩いておよそ7分、365段の石段を上って大門に着きます。入母屋造りの二階建ての門で、ここから先が金刀比羅宮の神域となり、俗世との境目を示しています。大門をくぐった先には、白い傘をさして並ぶ飴売り「五人百姓」の店があり、古くからこの五軒だけに境内での商いが許されてきたと伝えられています。この先、奥社までは長い石段が続きます。歩きやすい靴で、自分のペースで休みながら上り下りし、こまめに水分をとりましょう。この後は、石段を上っておよそ10分、高橋由一館へ向かいましょう。";

const TAKAHASHIYUICHIKAN_MEMO =
  "大門から石段を上っておよそ10分、高橋由一館に着きます。「鮭」や「花魁」(いずれも重要文化財)で知られる、日本の近代洋画の先駆者・高橋由一の作品を展示する美術館です。由一は明治11年(1878)に金刀比羅宮へ「二見ヶ浦図」を奉献し、明治13年(1880)から14年にかけて琴平に滞在して「琴平山遠望図」なども手がけました。現在27点の作品を所蔵・展示しています。この後は、石段を上っておよそ10分、旭社へ向かいましょう。";

const TEMBODAI_MEMO =
  "本宮から歩いてすぐ、展望台に着きます。本宮からの眺めとは違う角度から、丸亀平野や讃岐富士(飯野山)、瀬戸内海の島々、瀬戸大橋まで見渡すことができます。この後は、石段を上っておよそ50分、奥社へ向かいましょう。";

const OKUSHA_MEMO =
  "展望台から石段を上っておよそ50分、本宮からあわせて1368段、金刀比羅宮 奥社に着きます。正式には「厳魂神社」といい、御本宮からさらに583段の石段を上った、海抜およそ421mの地に鎮座しています。御祭神の厳魂彦命は、戦国時代、荒廃していた金毘羅大権現の再興に尽力した宥盛(ゆうせい)という僧で、慶長18年(1613)、自らの死後も象頭山の守護となることを誓って亡くなったと伝えられ、今も毎年1月に例祭が営まれています。たどり着いた先で目にする讃岐平野を見渡す眺めは、こんぴら参りを達成した実感を味わえる眺めです。今も参拝が続く神聖な場所ですので、敬意を持ってお参りしましょう。参拝を終えたら、石段を下っておよそ50分、琴平駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd2cbf909%'`);
  const itinId = rows[0].id;

  const goninbyakusho = await findSpotInItinerary(itinId, { spotName: "五人百姓" });
  const takatouro = await findSpotInItinerary(itinId, { spotName: "高灯籠" });
  const kinryonosato = await findSpotInItinerary(itinId, { spotName: "金陵の郷" });
  const daimon = await findSpotInItinerary(itinId, { spotName: "大門" });
  const takahashiyuichikan = await findSpotInItinerary(itinId, { spotName: "高橋由一館" });
  const asahisha = await findSpotInItinerary(itinId, { spotName: "旭社" });
  const hongu = await findSpotInItinerary(itinId, { spotName: "本宮" });
  const tembodai = await findSpotInItinerary(itinId, { spotName: "展望台" });
  const okusha = await findSpotInItinerary(itinId, { spotName: "金刀比羅宮 奥社（厳魂神社）" });

  console.log("確認OK。dayId:", daimon.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        description:
          "琴平駅側の高灯籠・金陵の郷をめぐり、表参道で昼食をとってから、大門・高橋由一館・旭社・本宮を経て、本宮までとは違う眺めの展望台、さらに583段先の金刀比羅宮奥社まで石段を登る、こんぴら参りの絶景を極めるプランです。",
      },
    });

    const items: SpotOrderItem[] = [
      {
        id: takatouro.id,
        data: {
          memo: TAKATOURO_MEMO,
          visitTime: t(9, 0),
          stayDurationMin: 25,
          transitLegs: { deleteMany: {} },
        },
      },
      {
        id: kinryonosato.id,
        data: {
          memo: KINRYONOSATO_MEMO,
          visitTime: t(9, 33),
          stayDurationMin: 75,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
        },
      },
      {
        create: {
          name: "表参道（昼食）",
          memo: OMOTESANDO_MEMO,
          lat: 34.1867,
          lng: 133.8173,
          visitTime: t(10, 54),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
        },
      },
      {
        id: daimon.id,
        data: {
          memo: DAIMON_MEMO,
          visitTime: t(12, 31),
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7, transitLine: null }] },
        },
      },
      {
        id: takahashiyuichikan.id,
        data: { memo: TAKAHASHIYUICHIKAN_MEMO, visitTime: t(13, 6) },
      },
      {
        id: asahisha.id,
        data: { visitTime: t(13, 41) },
      },
      {
        id: hongu.id,
        data: { visitTime: t(14, 16) },
      },
      {
        id: tembodai.id,
        data: { memo: TEMBODAI_MEMO, visitTime: t(14, 38) },
      },
      {
        id: okusha.id,
        data: { memo: OKUSHA_MEMO, visitTime: t(15, 48) },
      },
    ];
    await setDaySpotOrder(daimon.dayId, items, { remove: [goninbyakusho.id], tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
