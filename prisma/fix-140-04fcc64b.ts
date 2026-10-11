/**
 * #140 04fcc64b(GALA湯沢スキーと越後湯沢温泉、雪国の冬を満喫するプラン)
 * の直し。もとはDay1がGALA湯沢スキー場の1か所(10:00〜13:00)、Day2が
 * 越後湯沢温泉の1か所(09:30〜10:30)のみで両日とも4か所未満、終始
 * 案内役の話し方(皆様、ご案内する、お楽しみください等)。
 *
 * 既存のeebd52df(雪国館と川端康成ゆかりの地)・1d0aa24f(湯沢高原
 * ロープウェイで行く雲海テラス)が、雪国館・主水公園・諏訪社の大杉・
 * 湯沢高原ロープウェイ・パノラマパーク・CoCoLo湯沢・山の湯・清津峡・
 * 滝沢公園を使用済みのため、タイトルどおりスキー・雪遊び・酒蔵という
 * 別の切り口で構成。
 *
 * Day1: GALA湯沢(駅直結のスキー場)を4か所に分けて構成
 *  - ガーラ湯沢駅・スキーセンター カワバンガ(座標はOSMのガーラ湯沢駅
 *    n9013930719の実点36.9502508,138.7995543に修正。もとの座標は
 *    36.951389,138.778611で経度が約1.8km西にずれた誤りだった)
 *  - ゲレンデ(ゴンドラで山頂へ、標高358→1181m、リフト10基・16コース)
 *  - ゆきあそびパーク(雪遊び専用のキッズ広場、ソリコース)
 *  - SPAガーラの湯(場内の日帰り温泉)
 *  いずれもlivejapan.com/ja/.../article-a0003934の記事で確認。
 *
 * Day2: 岩原スキー場(湯沢町でもっとも古いスキー場の一つ、昭和6年/1931
 * 開業)・そりランド・白瀧酒造(安政2年/1855創業、上善如水の蔵元)で構成。
 * 岩原スキー場前駅はOSM n9013930783、岩原スキー場はOSM w680045685の
 * 中心、白瀧酒造はOSM w845285004の中心。白瀧酒造の創業・銘柄はpedia.
 * 3rd-in.co.jp/wiki/岩原スキー場、niigata-kankou.or.jp/blog/1321等の
 * 記事で確認。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "新幹線駅直結のスキー場・GALA湯沢での雪遊びと、岩原スキー場や酒蔵めぐりで味わう、雪国ならではの冬を満喫する1泊2日プランです。";

const EKI_MEMO =
  "東京駅から上越新幹線でおよそ71分、ガーラ湯沢駅に着きます。日本で唯一、新幹線の駅がスキー場に直結しており、改札を出るとそこがスキーセンター「カワバンガ」です。案内所やチケットカウンター、レンタルカウンターが並び、ウェアやスキー・スノーボードの道具はここで借りられます。営業期間は例年12月下旬からゴールデンウィークの最終日までです。出かける前に公式サイトで確かめましょう。準備ができたら、ゴンドラでゲレンデへ向かいましょう。";

const GERENDE_MEMO =
  "スキーセンターから徒歩すぐ、ゴンドラでゲレンデへ向かいます。標高358メートルの山麓から、標高1181メートルの山頂まで一気に登るゴンドラを含め、リフトは全10基、コースは全16コースあります。山頂からは一面の雪山の景色が広がり、初級者から上級者まで、思い思いのコースで雪上のひとときを過ごせます。この後は、ゴンドラで山麓へ戻り、ゆきあそびパークへ向かいましょう。";

const YUKIASOBI_MEMO =
  "ゴンドラで山麓に戻り、ゆきあそびパークに着きます。ネットで囲われた広場で、小さな子どもも安心して雪遊びができるほか、ソリで雪の斜面を滑るコースもあります。スキーやスノーボードをしない人も、雪国の冬を体ごと楽しめる場所です。この後は、歩いてすぐ、SPAガーラの湯へ向かいましょう。";

const SPA_MEMO =
  "ゆきあそびパークから歩いてすぐ、SPAガーラの湯に着きます。スキー場の中にある日帰り温泉で、内風呂や露天風呂、サウナなど複数の浴槽があります。一日雪の中で過ごした体を、ゆっくりと温めましょう。湯上がりは、新幹線でそのまま帰れるのも、駅直結ならではの魅力です。";

const IWAPPARA_EKI_MEMO =
  "JR上越線の岩原スキー場前駅に着きます。昭和6年(1931)に開業した、歴史あるスキー場の玄関口として設けられた駅です。周りには真っ白な雪景色が広がり、冬の間だけ列車が停まる、雪国らしい小さな駅です。この後は、シャトルバスでおよそ8分、岩原スキー場へ向かいましょう。";

const IWAPPARA_MEMO =
  "岩原スキー場前駅からシャトルバスでおよそ8分、岩原スキー場に着きます。昭和6年(1931)に開業した、湯沢町でもっとも古いスキー場の一つです。飯士山の中腹に広がる、幅およそ600メートルの一枚斜面が特徴で、傾斜も緩やかなため、初めてスキーやスノーボードに挑戦する人にも向いています。思い思いのペースで、雪の斜面を滑ってみましょう。この後は、歩いてすぐ、そりランドへ向かいましょう。";

const SORILAND_MEMO =
  "岩原スキー場の中にある、そりランドに着きます。スキーやスノーボードをしない人も、ソリに乗って雪の斜面を滑り降りられる、家族で楽しめる施設です。周辺には食事処もあるので、ここで昼食をとりましょう。この後は、車でおよそ8分、白瀧酒造へ向かいましょう。";

const SHIRATAKI_MEMO =
  "そりランドから車でおよそ8分、白瀧酒造に着きます。安政2年(1855)、初代・湊屋藤助が、三国街道の宿場町だったこの地で居酒屋を開いたのが、蔵のはじまりです。平成2年(1990)に発売した「上善如水」は、軽やかな味わいで日本酒ビギナーからも支持を集め、今は海外でも親しまれる銘柄に育ちました。直売店では、試飲をしながら自分好みの一本を探せます。酒蔵見学は事前予約が必要なので、訪れる前に公式サイトで確かめましょう。旅の最後に、雪国の水と米が育てたお酒の味を楽しみましょう。";

async function main() {
  const day1Id = "cc8c5a88-cddf-4370-8845-ab5ec463618e";
  const day2Id = "cb0dbe03-1289-4449-b645-16aa9d8e8af7";
  const galaSpotId = "3c3f8f2d-4790-453a-8ce3-466e9cb0817e";
  const yuzawaOnsenSpotId = "eec2f277-aec0-48da-b7b3-cd6c54abdd72";

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: "04fcc64b-72d2-4b60-8484-ca892ff27f12" }, data: { description: DESCRIPTION } });

    const day1: SpotOrderItem[] = [
      {
        id: galaSpotId,
        data: {
          name: "ガーラ湯沢駅・スキーセンター カワバンガ",
          lat: 36.9502508, lng: 138.7995543,
          visitTime: t(9, 0), stayDurationMin: 35, memo: EKI_MEMO,
        },
      },
      {
        create: {
          name: "ゲレンデ", lat: 36.9502508, lng: 138.7995543,
          visitTime: t(9, 42), stayDurationMin: 250, memo: GERENDE_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        create: {
          name: "ゆきあそびパーク", lat: 36.9502508, lng: 138.7995543,
          visitTime: t(13, 59), stayDurationMin: 60, memo: YUKIASOBI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        create: {
          name: "SPAガーラの湯", lat: 36.9502508, lng: 138.7995543,
          visitTime: t(15, 2), stayDurationMin: 90, memo: SPA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
    ];
    await setDaySpotOrder(day1Id, day1, { tx });

    const day2: SpotOrderItem[] = [
      {
        id: yuzawaOnsenSpotId,
        data: {
          name: "岩原スキー場前駅",
          lat: 36.9242628, lng: 138.8397525,
          visitTime: t(9, 0), stayDurationMin: 15, memo: IWAPPARA_EKI_MEMO,
        },
      },
      {
        create: {
          name: "岩原スキー場", lat: 36.9457244, lng: 138.8422289,
          visitTime: t(9, 23), stayDurationMin: 200, memo: IWAPPARA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "そりランド", lat: 36.9457244, lng: 138.8422289,
          visitTime: t(12, 43), stayDurationMin: 100, memo: SORILAND_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 0 }] },
        },
      },
      {
        create: {
          name: "白瀧酒造", lat: 36.9390861, lng: 138.8092198,
          visitTime: t(14, 31), stayDurationMin: 120, memo: SHIRATAKI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
    ];
    await setDaySpotOrder(day2Id, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
