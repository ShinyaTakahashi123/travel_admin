/**
 * #131 d2cbf909の直し(3回目)。企画運営・法務(2026-10-11)の指摘。
 *
 * 企画運営:
 * 1. 奥社の座標が丸め値→法務が示したOSM n5159729422「奥社厳魂神社」
 *    34.187921,133.802630に修正(自分でapi.openstreetmap.org/api/0.6/
 *    node/5159729422を開いて確認)。
 * 2. 奥社の昼食の一文(案内役の言い方・境内での食事を勧める形)を削除。
 *    昼食は展望台→奥社の間、参道の茶店でとる形に変更。奥社の90分
 *    (昼食込み)から、参拝と眺めに合う45分に短縮。空いた45分には、
 *    高橋由一館(f6221e55未使用、金刀比羅宮が所蔵する洋画家・高橋由一の
 *    美術館)を追加。
 * 3. 金陵の郷の会社名「西野金陵」を削除(法務の指摘と同じ)。
 * 4. 展望台: 座標がOSMの名前のない点だったと法務から指摘があり、
 *    「金刀比羅宮展望台」の実点(OSM n8328555884、api.openstreetmap.org/
 *    api/0.6/map?bbox=...の生データを自分で開いて確認)に修正。
 *    「隠れた絶景ポイント」の宣伝の言い方を削除。
 * 5. 大門: 琴平駅から歩いて来る一文を追加。
 *
 * 法務(記録55084a9):
 * ① 五人百姓の「加美代飴」、金陵の郷の「酒蔵・西野金陵」「日本酒
 *    『金陵』」の商品・会社・銘柄名を削除。
 * ② 奥社の「命日にあたる1月6日には例祭」→毎年の行事は月までの決まり
 *    のため「毎年1月に例祭が営まれています」に修正。
 * ③ 大門に、長い石段の安全の一文(歩きやすい靴・自分のペース・水分)を
 *    追加。
 * ④ 奥社の写真(Kotohira-gu01s.jpg)が実際は本宮の社殿だったため、
 *    本宮のスポットへ移す。
 * ⑤ 五人百姓の座標が飴店個別の点だったため、法務の指示どおり大門の
 *    座標(推定)に変更。
 *
 * 高橋由一館: 34.184213,133.812363(OSM建物の中心、生データで確認)。
 * 出典: 高橋由一(1828-1894)、「鮭」「花魁」(いずれも重要文化財)で
 * 知られる日本近代洋画の先駆者、明治11年(1878)に金刀比羅宮へ「二見
 * ヶ浦図」を奉献、明治13-14年(1880-81)に琴平に滞在して「琴平山遠望図」
 * なども手がけ、現在27点を所蔵(kotobank.jp/word/高橋由一、nact.jp
 * ほかで確認)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DAIMON_MEMO =
  "琴平駅から参道を歩いておよそ25分、365段の石段を上って大門に着きます。入母屋造りの二階建ての門で、ここから先が金刀比羅宮の神域となり、俗世との境目を示しています。この先、奥社までは長い石段が続きます。歩きやすい靴で、自分のペースで休みながら上り下りし、こまめに水分をとりましょう。この後は、歩いてすぐ、五人百姓へ向かいましょう。";

const GONINBYAKUSHO_MEMO =
  "大門から歩いてすぐ、五人百姓に着きます。大門をくぐった先に、白い傘をさして並ぶ飴売りの店で、古くからこの五軒だけに境内での商いが許されてきたと伝えられています。名物の飴を売る、こんぴら参りならではの光景です。この後は、石段を上っておよそ10分、高橋由一館へ向かいましょう。";

const TAKAHASHIYUICHIKAN_MEMO =
  "五人百姓から石段を上っておよそ10分、高橋由一館に着きます。「鮭」や「花魁」(いずれも重要文化財)で知られる、日本の近代洋画の先駆者・高橋由一の作品を展示する美術館です。由一は明治11年(1878)に金刀比羅宮へ「二見ヶ浦図」を奉献し、明治13年(1880)から14年にかけて琴平に滞在して「琴平山遠望図」なども手がけました。現在27点の作品を所蔵・展示しています。この後は、石段を上っておよそ10分、旭社へ向かいましょう。";

const ASAHISHA_MEMO =
  "高橋由一館から石段を上っておよそ10分、628段目にあたる旭社に着きます。天保8年(1837)に建てられた、総欅造りの重要文化財の建物です。二層になった入母屋造りの屋根と、細やかな彫刻が施された外観は、本宮と見間違えて引き返してしまう参拝者もいるほど立派だと伝えられています。この後は、石段を上っておよそ10分、本宮へ向かいましょう。";

const HONGU_MEMO =
  "旭社から石段を上っておよそ10分、785段目にあたる本宮に着きます。大物主神と崇徳天皇をまつる、こんぴら参りの中心となる社殿です。長い石段を上ってきた参拝者の多くがここで引き返しますが、今回はさらに先の奥社を目指します。今も祈りが続く場所ですので、敬意を持ってお参りしましょう。この後は、歩いてすぐ、展望台へ向かいましょう。";

const TEMBODAI_MEMO =
  "本宮から歩いてすぐ、展望台に着きます。本宮からの眺めとは違う角度から、丸亀平野や讃岐富士(飯野山)、瀬戸内海の島々、瀬戸大橋まで見渡すことができます。この先、奥社までは食事のできる店がないので、参道の茶店でうどんなどの昼食をとってから、石段を上りましょう。この後は、石段を上っておよそ50分、奥社へ向かいましょう。";

const OKUSHA_MEMO =
  "展望台から石段を上っておよそ50分、本宮からあわせて1368段、金刀比羅宮 奥社に着きます。正式には「厳魂神社」といい、御本宮からさらに583段の石段を上った、海抜およそ421mの地に鎮座しています。御祭神の厳魂彦命は、戦国時代、荒廃していた金毘羅大権現の再興に尽力した宥盛(ゆうせい)という僧で、慶長18年(1613)、自らの死後も象頭山の守護となることを誓って亡くなったと伝えられ、今も毎年1月に例祭が営まれています。たどり着いた先で目にする讃岐平野を見渡す眺めは、こんぴら参りを達成した実感を味わえる眺めです。今も参拝が続く神聖な場所ですので、敬意を持ってお参りしましょう。参拝を終えたら、石段を下っておよそ90分、金陵の郷へ向かいましょう。";

const KINRYONOSATO_MEMO =
  "奥社から石段を下っておよそ90分、金陵の郷に着きます。江戸時代から続く地元の酒蔵が、蔵の一部を資料館として公開しています。昔の酒造りの道具や工程を、建物とあわせて見学できます。営業時間が限られるので、お出かけ前に公式で確かめましょう。この後は、歩いておよそ8分、高灯籠へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd2cbf909%'`);
  const itinId = rows[0].id;

  const daimon = await findSpotInItinerary(itinId, { spotName: "大門" });
  const goninbyakusho = await findSpotInItinerary(itinId, { spotName: "五人百姓" });
  const asahisha = await findSpotInItinerary(itinId, { spotName: "旭社" });
  const hongu = await findSpotInItinerary(itinId, { spotName: "本宮" });
  const tembodai = await findSpotInItinerary(itinId, { spotName: "展望台" });
  const okusha = await findSpotInItinerary(itinId, { spotName: "金刀比羅宮 奥社（厳魂神社）" });
  const kinryonosato = await findSpotInItinerary(itinId, { spotName: "金陵の郷" });
  const takatouro = await findSpotInItinerary(itinId, { spotName: "高灯籠" });

  console.log("確認OK。dayId:", daimon.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    // 写真を奥社から本宮へ移す(法務指摘④、実際は本宮の社殿の写真)
    await tx.photo.updateMany({ where: { spotId: okusha.id }, data: { spotId: hongu.id } });

    const items: SpotOrderItem[] = [
      { id: daimon.id, data: { memo: DAIMON_MEMO } },
      {
        id: goninbyakusho.id,
        data: {
          memo: GONINBYAKUSHO_MEMO,
          lat: 34.184338,
          lng: 133.814286,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null }] },
        },
      },
      {
        create: {
          name: "高橋由一館",
          memo: TAKAHASHIYUICHIKAN_MEMO,
          lat: 34.184213,
          lng: 133.812363,
          visitTime: t(9, 47),
          stayDurationMin: 25,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        id: asahisha.id,
        data: {
          memo: ASAHISHA_MEMO,
          visitTime: t(10, 22),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        id: hongu.id,
        data: {
          memo: HONGU_MEMO,
          visitTime: t(10, 57),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        id: tembodai.id,
        data: {
          memo: TEMBODAI_MEMO,
          lat: 34.184261,
          lng: 133.80964,
          visitTime: t(11, 19),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null }] },
        },
      },
      {
        id: okusha.id,
        data: {
          memo: OKUSHA_MEMO,
          lat: 34.187921,
          lng: 133.80263,
          visitTime: t(12, 29),
          stayDurationMin: 45,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 50, transitLine: null }] },
        },
      },
      {
        id: kinryonosato.id,
        data: {
          memo: KINRYONOSATO_MEMO,
          visitTime: t(14, 44),
          stayDurationMin: 65,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 90, transitLine: null }] },
        },
      },
      { id: takatouro.id, data: { visitTime: t(15, 57) } },
    ];
    await setDaySpotOrder(daimon.dayId, items, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
