/**
 * #24 657f4a15（箱根）企画運営の指摘2点（2026-09-30 10:34）。
 * 1) 箱根美術館: 休館は2026年5月7日〜10月29日で、10月30日から再開予定
 *    （旅うらら https://www.tabiulala.com/museum/event-oh1258/ 、
 *    公式 https://moaart.or.jp/hakone/informations/ ）。日付が変わると誤りになるため、
 *    「改修で休館中・外観のみ」をやめ、苔庭・展示を見るふつうの本文と滞在(45分)に戻す。
 *    「改修工事で休館している時期があるので、開館の状況は公式で確かめましょう」を追加。
 *    延びた25分は、強羅公園(50→30)・彫刻の森美術館(65→60)を縮めて調整。Day1の終わりは変わらず16:45。
 * 2) 元箱根港の乗船待ちを25分→10分に短縮(決まり5)。空いた時間は、箱根町港のそばにある
 *    箱根駅伝ミュージアム(実在、神奈川県足柄下郡箱根町箱根167、箱根町港前)を追加して埋める。
 *    箱根町港の滞在は35→20分(散策)、その後歩いて箱根駅伝ミュージアムへ(30分)。
 *    Day2の終わりは16:47(16:30〜17:00の範囲内)。
 *
 * 座標: Nominatim確認。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const ITIN = "657f4a15-8f20-4d44-ac20-fa757f002d63";
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HAKONE_MUSEUM_MEMO_NEW =
  "箱根登山鉄道の強羅駅から徒歩約7分、箱根美術館は実業家・岡田茂吉(1882〜1955)が集めた古美術品を紹介する美術館です。岡田茂吉は日本・中国・南アジアなどの古美術品を熱心に収集し、1952年にこの地に美術館を開館させました。敷地『神仙郷』は、岡田茂吉が戦中から戦後にかけて自ら造成したもので、約130種の苔と200本以上のイロハモミジを組み合わせた『苔庭』は、多くの人を魅了する美しさといわれています。館内では、岡田茂吉が集めた陶磁器などの古美術品もあわせて鑑賞できます。改修工事で休館している時期があるので、開館の状況は公式サイトで確かめましょう。この後は、歩いておよそ3分、強羅公園へ向かいましょう。";

const MOTOHAKONE_MEMO_NEW =
  "箱根旧街道杉並木から歩いておよそ5分、元箱根港に着きます。ここから芦ノ湖遊覧船に乗り、湖上から旅を締めくくりましょう。港からは、湖畔に立つ箱根神社の「平和の鳥居」を湖の上から眺められるほか、天気が良ければ、芦ノ湖の向こうに富士山の姿を望むこともできます。乗り場で少し待ったのち、箱根町港までのおよそ10分間の船旅を楽しんでください。";

const HAKONEMACHIKO_MEMO_NEW =
  "元箱根港から芦ノ湖遊覧船でおよそ10分、箱根町港に着きます。船を降りたら、湖畔の遊歩道を少し歩いてみましょう。山側から歩いてきた元箱根・箱根関所のあたりを、今度は湖の上から眺めた余韻とともに振り返ることができます。この後は、歩いてすぐの箱根駅伝ミュージアムへ向かいましょう。";

const EKIDEN_MUSEUM_MEMO =
  "箱根町港から歩いてすぐ、箱根駅伝ミュージアムに着きます。芦ノ湖のほとりに立つミュージアムで、箱根駅伝の歴代大会の名シーンを記録した写真や、選手が愛用した品々などを展示しています。旅の締めくくりに、箱根の山々を舞台にした駅伝の歴史にふれてみてください。営業時間は曜日によって異なるので、訪れる前に公式サイトで確かめましょう。強羅の美術館めぐりから芦ノ湖のほとりまで、一泊二日の箱根の旅も、ここでゆっくりと締めくくってください。この後は、箱根町港からバスに乗り、箱根湯本駅方面へ向かいましょう。バスの時刻は、公式サイトで確かめておくと安心です。";

async function main() {
  // 1) 箱根美術館・強羅公園・彫刻の森美術館(Day1、単発の書き換え)
  const hakoneMuseum = await findSpotInItinerary(ITIN, { spotName: "箱根美術館" });
  const goraPark = await findSpotInItinerary(ITIN, { spotName: "強羅公園" });
  const chokoku = await findSpotInItinerary(ITIN, { spotName: "彫刻の森美術館" });
  console.log("箱根美術館 現在:", hakoneMuseum.memo?.slice(0, 30), hakoneMuseum.stayDurationMin);
  console.log("強羅公園 現在stay:", goraPark.stayDurationMin);
  console.log("彫刻の森美術館 現在stay:", chokoku.stayDurationMin);

  if (COMMIT) {
    await updateSpotInItinerary(ITIN, { spotId: hakoneMuseum.id }, { memo: HAKONE_MUSEUM_MEMO_NEW, stayDurationMin: 45 });
    await updateSpotInItinerary(ITIN, { spotId: goraPark.id }, { stayDurationMin: 30 });
    await updateSpotInItinerary(ITIN, { spotId: chokoku.id }, { stayDurationMin: 60 });
  }

  // 2) 元箱根港・箱根町港(Day2、順番の入れ替え=箱根駅伝ミュージアムを追加)
  const motohakone = await findSpotInItinerary(ITIN, { spotName: "元箱根港(芦ノ湖遊覧船)" });
  const hakonemachiko = await findSpotInItinerary(ITIN, { spotName: "箱根町港" });
  const day2 = await prisma.day.findFirstOrThrow({
    where: { id: motohakone.dayId },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });

  const day2Spots: SpotOrderItem[] = [
    ...day2.spots.filter((s) => s.id !== motohakone.id && s.id !== hakonemachiko.id).map((s) => ({ id: s.id, data: {} })),
    { id: motohakone.id, data: { memo: MOTOHAKONE_MEMO_NEW, visitTime: t(15, 32), stayDurationMin: 10 } },
    { id: hakonemachiko.id, data: { memo: HAKONEMACHIKO_MEMO_NEW, visitTime: t(15, 52), stayDurationMin: 20, transitMode: "other", transitDurationMin: 10 } },
    { create: { name: "箱根駅伝ミュージアム", address: "神奈川県足柄下郡箱根町箱根167", lat: 35.189391, lng: 139.024868, memo: EKIDEN_MUSEUM_MEMO, visitTime: t(16, 17), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
  ];

  console.log("Day2 既存(編集前):", day2.spots.map((s) => `${s.name}@${s.visitTime?.toISOString().slice(11, 16)}(stay${s.stayDurationMin})`).join(" | "));

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
