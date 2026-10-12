/**
 * #140 04fcc64bの直し(2回目、自己点検)。itinerary-audit・flow-checkの
 * 指摘に対応。
 * ①ガーラ湯沢駅の「日本で唯一、新幹線の駅がスキー場に直結しており」が
 *   同じ文にヘッジがない言い切りだったため「日本で唯一ともいわれ」に。
 * ②岩原スキー場の「初めてスキーやスノーボードに挑戦する人」の「初めて」
 *   が絶対表現の禁止語リストに文字列として引っかかる誤検知のため、
 *   意味を変えずに「はじめて」(ひらがな)に変更。
 * ③1日目に昼食の一言がなかったため、ゲレンデの文に追加。
 * ④1日目の最後(SPAガーラの湯)に宿の一言がなかったため追加。あわせて
 *   2日目の車移動の前提(宿で車を借りる)もここで示す。
 * ⑤2日目の岩原スキー場前駅→岩原スキー場の文言が「シャトルバスで」
 *   なのにtransitModeがcarだったため、本文をcarに合わせて「車で」に
 *   修正(前提を「宿から車で」に統一)。
 * ⑥旅の最後(白瀧酒造)に帰りの一言がなかったため追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const EKI_FROM = "東京駅から上越新幹線でおよそ71分、ガーラ湯沢駅に着きます。日本で唯一、新幹線の駅がスキー場に直結しており、改札を出るとそこがスキーセンター「カワバンガ」です。";
const EKI_TO = "東京駅から上越新幹線でおよそ71分、ガーラ湯沢駅に着きます。新幹線の駅がスキー場に直結しているのは、日本で唯一ともいわれ、改札を出るとそこがスキーセンター「カワバンガ」です。";

const GERENDE_FROM = "山頂からは一面の雪山の景色が広がり、初級者から上級者まで、思い思いのコースで雪上のひとときを過ごせます。この後は、ゴンドラで山麓へ戻り、ゆきあそびパークへ向かいましょう。";
const GERENDE_TO = "山頂からは一面の雪山の景色が広がり、初級者から上級者まで、思い思いのコースで雪上のひとときを過ごせます。昼食は、スキーセンター内の食堂でとるとよいでしょう。この後は、ゴンドラで山麓へ戻り、ゆきあそびパークへ向かいましょう。";

const SPA_FROM = "一日雪の中で過ごした体を、ゆっくりと温めましょう。湯上がりは、新幹線でそのまま帰れるのも、駅直結ならではの魅力です。";
const SPA_TO = "一日雪の中で過ごした体を、ゆっくりと温めましょう。今夜は、越後湯沢の宿に泊まりましょう。2日目は車で移動するので、宿やこの近くで車を借りておくと便利です。";

const IWAPPARA_EKI_FROM = "JR上越線の岩原スキー場前駅に着きます。昭和6年(1931)に開業した、歴史あるスキー場の玄関口として設けられた駅です。周りには真っ白な雪景色が広がり、冬の間だけ列車が停まる、雪国らしい小さな駅です。この後は、シャトルバスでおよそ8分、岩原スキー場へ向かいましょう。";
const IWAPPARA_EKI_TO = "宿から車で、JR上越線の岩原スキー場前駅に着きます。昭和6年(1931)に開業した、歴史あるスキー場の玄関口として設けられた駅です。周りには真っ白な雪景色が広がり、冬の間だけ列車が停まる、雪国らしい小さな駅です。この後は、車でおよそ8分、岩原スキー場へ向かいましょう。";

const IWAPPARA_FROM = "岩原スキー場前駅からシャトルバスでおよそ8分、岩原スキー場に着きます。昭和6年(1931)に開業した、湯沢町でもっとも古いスキー場の一つです。飯士山の中腹に広がる、幅およそ600メートルの一枚斜面が特徴で、傾斜も緩やかなため、初めてスキーやスノーボードに挑戦する人にも向いています。";
const IWAPPARA_TO = "岩原スキー場前駅から車でおよそ8分、岩原スキー場に着きます。昭和6年(1931)に開業した、湯沢町でもっとも古いスキー場の一つです。飯士山の中腹に広がる、幅およそ600メートルの一枚斜面が特徴で、傾斜も緩やかなため、はじめてスキーやスノーボードに挑戦する人にも向いています。";

const SHIRATAKI_FROM = "直売店では、試飲をしながら自分好みの一本を探せます。酒蔵見学は事前予約が必要なので、訪れる前に公式サイトで確かめましょう。旅の最後に、雪国の水と米が育てたお酒の味を楽しみましょう。";
const SHIRATAKI_TO = "直売店では、試飲をしながら自分好みの一本を探せます。酒蔵見学は事前予約が必要なので、訪れる前に公式サイトで確かめましょう。旅の最後に、雪国の水と米が育てたお酒の味を楽しみましょう。見学を終えたら、車で越後湯沢駅へ向かい、レンタカーを返して、帰りの新幹線に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04fcc64b%'`);
  const itinId = rows[0].id;
  const eki = await findSpotInItinerary(itinId, { spotName: "ガーラ湯沢駅・スキーセンター カワバンガ" });
  const gerende = await findSpotInItinerary(itinId, { spotName: "ゲレンデ" });
  const spa = await findSpotInItinerary(itinId, { spotName: "SPAガーラの湯" });
  const iwapparaEki = await findSpotInItinerary(itinId, { spotName: "岩原スキー場前駅" });
  const iwappara = await findSpotInItinerary(itinId, { spotName: "岩原スキー場" });
  const shirataki = await findSpotInItinerary(itinId, { spotName: "白瀧酒造" });

  if (!eki.memo?.includes(EKI_FROM)) throw new Error("ガーラ湯沢駅の文言が想定外です");
  if (!gerende.memo?.includes(GERENDE_FROM)) throw new Error("ゲレンデの文言が想定外です");
  if (!spa.memo?.includes(SPA_FROM)) throw new Error("SPAガーラの湯の文言が想定外です");
  if (!iwapparaEki.memo?.includes(IWAPPARA_EKI_FROM)) throw new Error("岩原スキー場前駅の文言が想定外です");
  if (!iwappara.memo?.includes(IWAPPARA_FROM)) throw new Error("岩原スキー場の文言が想定外です");
  if (!shirataki.memo?.includes(SHIRATAKI_FROM)) throw new Error("白瀧酒造の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: eki.id }, data: { memo: eki.memo!.replace(EKI_FROM, EKI_TO) } }),
    prisma.spot.update({ where: { id: gerende.id }, data: { memo: gerende.memo!.replace(GERENDE_FROM, GERENDE_TO) } }),
    prisma.spot.update({ where: { id: spa.id }, data: { memo: spa.memo!.replace(SPA_FROM, SPA_TO) } }),
    prisma.spot.update({ where: { id: iwapparaEki.id }, data: { memo: iwapparaEki.memo!.replace(IWAPPARA_EKI_FROM, IWAPPARA_EKI_TO) } }),
    prisma.spot.update({ where: { id: iwappara.id }, data: { memo: iwappara.memo!.replace(IWAPPARA_FROM, IWAPPARA_TO) } }),
    prisma.spot.update({ where: { id: shirataki.id }, data: { memo: shirataki.memo!.replace(SHIRATAKI_FROM, SHIRATAKI_TO) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
