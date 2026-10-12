/**
 * #131 d2cbf909(金刀比羅宮 奥社と展望台、こんぴら参りの絶景を極める
 * プラン)の全面見直し。
 *
 * もとは奥社(厳魂神社)の1か所のみ(09:00、滞在150分)で4か所未満。
 * 150分の滞在は決まりAの水増しにあたる。終始「皆様」「ご案内する」
 * 「お楽しみください」「お楽しみいただけたことでしょう」の案内役の
 * 話し方。
 *
 * 既存のf6221e55(金刀比羅宮、785段の石段を登る「こんぴらさん」定番
 * プラン)が、金丸座・金刀比羅宮(本宮・こんぴら狗・表書院の応挙障壁画・
 * 讃岐平野の眺め)・鞘橋(明治2年建立・登録有形文化財)・高灯籠(27m・
 * 日本一・重要有形民俗文化財)を全文確認したうえで使っているため、
 * 重なる場所(本宮・高灯籠)は別の事実・切り口にし、こんぴら狗・応挙の
 * 障壁画は使わない。本宮はこのしおりの主題(奥社・展望台)ではないため、
 * ごく簡潔な通過点として扱う。鞘橋はf6221e55と重なりが大きいため使わず、
 * 代わりに五人百姓(f6221e55は使っていない)・旭社(応挙の話は避け、
 * 建物自体の話にする)・展望台(本宮とは違う方角の眺め)・金陵の郷
 * (どの既存しおりも使っていない)を新規に追加。
 *
 * 座標(OSM、生API api.openstreetmap.org/api/0.6/mapで確認):
 * - 大門: 34.184338,133.814286(OSM way 729750814の中心)
 * - 五人百姓: 34.1856803,133.8165262(OSM node、五軒のうち1軒の点)
 * - 旭社: 34.1831354,133.8102711(OSM way 139583697)
 * - 本宮: 34.1839885,133.8093897(OSM way 139583694)
 * - 展望台: 34.1837466,133.8116895(OSM node 8328555874
 *   「金刀比羅宮展望台」)
 * - 奥社(厳魂神社): 34.1861,133.8125(既存値を維持。OSMに名前つきの
 *   点が見つからなかったため、見直し前の値のまま)
 * - 金陵の郷: 34.1878263,133.8184797(OSM way 566013323)
 * - 高灯籠: 34.191346,133.819253(OSM way 570442020)
 *
 * 出典: 五人百姓・加美代飴はrurubu.jp/andmore/article/4553等、旭社は
 * skyticket.jp/guide/406461/等(応挙の話は使わない)、展望台の眺めは
 * www.pref.kagawa.lg.jp/documents/27511/10kotohirakouenn.pdf、
 * 金陵の郷はtabi-mag.jp/ka0037/(西野金陵、寛政元年/1789創業、
 * 昭和63年/1988整備)、高灯籠は4travel.jp/dm_shisetsu/11333909等
 * (万延元年/1860築、瀬戸内海を行き交う船の目印、f6221e55と違う
 * 切り口にするため「日本一」の表記は使わない)。所要時間は
 * 4travel.jp/dm_qa_each-19384.html等(本宮まで休憩を含め往復2時間
 * 程度、奥社はさらに時間がかかる)を参考に見積もり。
 *
 * 金陵の郷は営業時間が平日9:00〜16:00・休日9:00〜17:00と限られる
 * ため、訪問を14:56〜15:51に設定(平日でも閉館前に終わる組み方)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DAIMON_MEMO =
  "こんぴら参りの出発点、大門に着きます。参道の石段を365段上った先に立つ、入母屋造りの二階建ての門です。ここから先が金刀比羅宮の神域となり、俗世との境目を示しています。この後は、歩いてすぐ、五人百姓へ向かいましょう。";

const GONINBYAKUSHO_MEMO =
  "大門から歩いてすぐ、五人百姓に着きます。大門をくぐった先に、白い傘をさして並ぶ飴売りの店で、古くからこの五軒だけに境内での商いが許されてきたと伝えられています。売られている「加美代飴」は、700年以上の歴史を持つという、こんぴら参りの名物です。この後は、石段を上っておよそ20分、旭社へ向かいましょう。";

const ASAHISHA_MEMO =
  "五人百姓から石段を上っておよそ20分、628段目にあたる旭社に着きます。天保8年(1837)に建てられた、総欅造りの重要文化財の建物です。二層になった入母屋造りの屋根と、細やかな彫刻が施された外観は、本宮と見間違えて引き返してしまう参拝者もいるほど立派だと伝えられています。この後は、石段を上っておよそ12分、本宮へ向かいましょう。";

const HONGU_MEMO =
  "旭社から石段を上っておよそ12分、785段目にあたる本宮に着きます。大物主神と崇徳天皇をまつる、こんぴら参りの中心となる社殿です。長い石段を上ってきた参拝者の多くがここで引き返しますが、今回はさらに先の奥社を目指します。今も祈りが続く場所ですので、敬意を持ってお参りしましょう。この後は、歩いておよそ6分、展望台へ向かいましょう。";

const TEMBODAI_MEMO =
  "本宮から歩いておよそ6分、展望台に着きます。本宮からの眺めとは違う角度から、丸亀平野や讃岐富士(飯野山)、瀬戸内海の島々、瀬戸大橋まで見渡すことができます。少し先まで足を延ばした人だけが見られる、こんぴら参りの隠れた絶景ポイントです。この後は、石段を上っておよそ40分、奥社へ向かいましょう。";

const OKUSHA_MEMO =
  "展望台から石段を上っておよそ40分、本宮からあわせて1368段、金刀比羅宮 奥社に着きます。正式には「厳魂神社」といい、御本宮からさらに583段の石段を上った、海抜およそ421mの地に鎮座しています。御祭神の厳魂彦命は、戦国時代、荒廃していた金毘羅大権現の再興に尽力した宥盛(ゆうせい)という僧で、慶長18年(1613)、自らの死後も象頭山の守護となることを誓って亡くなったと伝えられ、今も命日にあたる1月6日には例祭が営まれています。たどり着いた先で目にする讃岐平野を見渡す眺めは、こんぴら参りの締めくくりにふさわしい眺めです。持参した軽い食事などで、ここで昼食にするのもよいでしょう。今も参拝が続く神聖な場所ですので、敬意を持ってお参りしましょう。参拝を終えたら、石段を下っておよそ75分、金陵の郷へ向かいましょう。";

const KINRYONOSATO_MEMO =
  "奥社から石段を下っておよそ75分、金陵の郷に着きます。寛政元年(1789)創業の酒蔵・西野金陵が、金刀比羅宮の御神酒としても知られる日本酒「金陵」の酒蔵の一部を資料館として公開しています。昭和63年(1988)に整備されたもので、昔の酒造りの道具や工程を、建物とあわせて見学できます。営業時間が限られるので、お出かけ前に公式で確かめましょう。この後は、歩いておよそ8分、高灯籠へ向かいましょう。";

const TAKATOURO_MEMO =
  "金陵の郷から歩いておよそ8分、高灯籠に着きます。江戸時代の終わり、万延元年(1860)に建てられた、高さ27mの灯籠です。かつて瀬戸内海を行き交う船にとって、沖からも見える目印の役割を果たしていたと伝えられ、国の重要有形民俗文化財に指定されています。琴平駅のすぐそばに立っており、こんぴら参りの旅の締めくくりにふさわしい姿を見せてくれます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd2cbf909%'`);
  const itinId = rows[0].id;

  const okusha = await findSpotInItinerary(itinId, { spotName: "金刀比羅宮 奥社（厳魂神社）" });

  console.log("確認OK。dayId:", okusha.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({
    where: { id: itinId },
    data: {
      description:
        "大門・五人百姓・旭社から本宮を経て、本宮までとは違う眺めの展望台、さらに583段先の金刀比羅宮奥社まで石段を登り、下山後は金陵の郷・高灯籠もめぐる、こんぴら参りの絶景を極めるプランです。",
    },
  });

  const items: SpotOrderItem[] = [
    {
      create: {
        name: "大門",
        memo: DAIMON_MEMO,
        lat: 34.184338,
        lng: 133.814286,
        visitTime: t(9, 0),
        stayDurationMin: 20,
      },
    },
    {
      create: {
        name: "五人百姓",
        memo: GONINBYAKUSHO_MEMO,
        lat: 34.1856803,
        lng: 133.8165262,
        visitTime: t(9, 28),
        stayDurationMin: 15,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
      },
    },
    {
      create: {
        name: "旭社",
        memo: ASAHISHA_MEMO,
        lat: 34.1831354,
        lng: 133.8102711,
        visitTime: t(10, 3),
        stayDurationMin: 25,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20, transitLine: null }] },
      },
    },
    {
      create: {
        name: "本宮",
        memo: HONGU_MEMO,
        lat: 34.1839885,
        lng: 133.8093897,
        visitTime: t(10, 40),
        stayDurationMin: 20,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12, transitLine: null }] },
      },
    },
    {
      create: {
        name: "展望台",
        memo: TEMBODAI_MEMO,
        lat: 34.1837466,
        lng: 133.8116895,
        visitTime: t(11, 6),
        stayDurationMin: 25,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
      },
    },
    {
      id: okusha.id,
      data: {
        memo: OKUSHA_MEMO,
        visitTime: t(12, 11),
        stayDurationMin: 90,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 40, transitLine: null }] },
      },
    },
    {
      create: {
        name: "金陵の郷",
        memo: KINRYONOSATO_MEMO,
        lat: 34.1878263,
        lng: 133.8184797,
        visitTime: t(14, 56),
        stayDurationMin: 55,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 75, transitLine: null }] },
      },
    },
    {
      create: {
        name: "高灯籠",
        memo: TAKATOURO_MEMO,
        lat: 34.191346,
        lng: 133.819253,
        visitTime: t(15, 59),
        stayDurationMin: 30,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
      },
    },
  ];
  await setDaySpotOrder(okusha.dayId, items, {});

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
