/**
 * #141 050431baの直し(3回目)。企画運営からの指摘4点・法務からの指摘3点
 * をまとめて対応。
 *
 * 企画運営:
 * ①車の置き場所: 森林博物館に置いたままで新町通りのあと「車で合浦公園
 *   へ」となっていた食い違いを、青森駅近くの駐車場に置く設定に直し、
 *   新町通りでの昼食のあとに駐車場へ歩いて戻る一文を追加。
 * ②季節: 八甲田ロープウェーの「8の字遊歩道を1時間」は雪のない時期
 *   限定のため、雪のない時期/冬で書き分け(冬は山頂公園駅からの眺めの
 *   み)、四季すべてを対象のまま維持。
 * ③座標: 新町通り・八甲田山麓(昼食)・八甲田ロープウェーを、それぞれ
 *   別のOSMの点に修正。
 * ④タイトルを「青森の港町と縄文遺跡、八甲田ロープウェーもめぐる1泊
 *   2日」に変更。
 *
 * 法務:
 * ⑤浅虫水族館「本州最北端に位置する水族館」→同じ文で「本州最北端の
 *   水族館とされ」にぼかし。
 * ⑥八甲田ロープウェー・ゴードラインに、係の人の案内・火山情報・クマ
 *   の決まった一文・天候急変と防寒・足元の一文を追加。
 * ⑦座標2か所: 三内丸山遺跡をw651501082のNominatim中心
 *   40.8110007,140.6975615に、新町通りをw225654058の中心
 *   40.8260170,140.7426556に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const TITLE = "青森の港町と縄文遺跡、八甲田ロープウェーもめぐる1泊2日";

const SHINRIN_FROM = "青森駅前でレンタカーを借りて、車でおよそ3分、青森市森林博物館に着きます。";
const SHINRIN_TO = "青森駅の近くの駐車場にレンタカーを置いて、歩いておよそ17分、青森市森林博物館に着きます。";

const SHINMACHI_FROM = "善知鳥神社から歩いてすぐ、新町通りに着きます。青森市の中心を東西に走る、昔からの繁華街です。このあたりの食事処で、青森ならではの味を楽しみながら、昼食をとりましょう。この後は、車でおよそ8分、合浦公園へ向かいましょう。";
const SHINMACHI_TO = "善知鳥神社から歩いてすぐ、新町通りに着きます。青森市の中心を東西に走る、昔からの繁華街です。このあたりの食事処で、青森ならではの味を楽しみながら、昼食をとりましょう。食事を終えたら、歩いておよそ5分、青森駅の近くの駐車場へ戻り、車に乗りましょう。この後は、車でおよそ8分、合浦公園へ向かいましょう。";

const ASAMUSHI_FROM = "合浦公園から車でおよそ20分、浅虫水族館に着きます。本州最北端に位置する水族館で、陸奥湾を中心に、およそ300種1万点の生き物を展示しています。";
const ASAMUSHI_TO = "合浦公園から車でおよそ20分、浅虫水族館に着きます。本州最北端の水族館とされ、陸奥湾を中心に、およそ300種1万点の生き物を展示しています。";

const HAKKODA_LUNCH_FROM = "小牧野遺跡から車でおよそ30分、八甲田山麓に着きます。山の景色を眺めながら、郷土の味を楽しんで昼食をとりましょう。この後は、歩いてすぐ、八甲田ロープウェーへ向かいましょう。";
const HAKKODA_LUNCH_TO = "小牧野遺跡から車でおよそ30分、八甲田山麓に着きます。山の景色を眺めながら、郷土の味を楽しんで昼食をとりましょう。この後は、ロープウェーに乗り、山頂公園駅へ向かいましょう。";

const HAKKODA_ROPEWAY_FROM = "八甲田山麓から歩いてすぐ、八甲田ロープウェーに着きます。山麓駅から、標高1314メートルの山頂公園駅まで、およそ10分で登ります。山頂の田茂萢岳(標高1326m)のまわりには、8の字形に湿原をめぐる、およそ2kmの遊歩道「八甲田ゴードライン」が整備されており、1時間ほどで八甲田の山々を眺めながら歩けます。荒天時などに運休することがあるので、出かける前に公式サイトで運行状況を確かめましょう。この後は、車でおよそ40分、青龍寺へ向かいましょう。";
const HAKKODA_ROPEWAY_TO = "八甲田山麓からロープウェーに乗り、山頂公園駅に着きます。乗るときは係の人の案内に従いましょう。山麓駅から、標高1314メートルの山頂公園駅まで、およそ10分で登ります。八甲田山は活火山なので、出かける前に火山の情報を確かめましょう。雪のない時期は、山頂の田茂萢岳(標高1326m)のまわりに整備された、8の字形に湿原をめぐるおよそ2kmの遊歩道「八甲田ゴードライン」を、1時間ほどで歩けます。冬は雪に覆われるため、山頂公園駅から樹氷や雪山の景色を眺めましょう。山の上は天気が変わりやすいので、上着を持ち、足元に気をつけて歩きましょう。クマが出ることもあるので、鈴を鳴らして歩き、決められた道から外れず、もし出会ったら騒がず静かにその場を離れましょう。荒天時などに運休することがあるので、出かける前に公式サイトで運行状況を確かめましょう。この後は、車でおよそ40分、青龍寺へ向かいましょう。";

async function main() {
  const itinId = "050431ba-9c60-400d-ac75-912c857a90ba";
  const shinrin = await findSpotInItinerary(itinId, { spotName: "青森市森林博物館" });
  const shinmachi = await findSpotInItinerary(itinId, { spotName: "新町通り" });
  const asamushi = await findSpotInItinerary(itinId, { spotName: "浅虫水族館" });
  const sannai = await findSpotInItinerary(itinId, { spotName: "三内丸山遺跡" });
  const hakkodaLunch = await findSpotInItinerary(itinId, { spotName: "八甲田山麓" });
  const hakkodaRopeway = await findSpotInItinerary(itinId, { spotName: "八甲田ロープウェー" });

  if (!shinrin.memo?.includes(SHINRIN_FROM)) throw new Error("森林博物館の文言が想定外です");
  if (!shinmachi.memo?.includes(SHINMACHI_FROM)) throw new Error("新町通りの文言が想定外です");
  if (!asamushi.memo?.includes(ASAMUSHI_FROM)) throw new Error("浅虫水族館の文言が想定外です");
  if (!hakkodaLunch.memo?.includes(HAKKODA_LUNCH_FROM)) throw new Error("八甲田山麓の文言が想定外です");
  if (!hakkodaRopeway.memo?.includes(HAKKODA_ROPEWAY_FROM)) throw new Error("八甲田ロープウェーの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.itinerary.update({ where: { id: itinId }, data: { title: TITLE } }),
    prisma.spot.update({ where: { id: shinrin.id }, data: { memo: shinrin.memo!.replace(SHINRIN_FROM, SHINRIN_TO) } }),
    prisma.spot.update({
      where: { id: shinmachi.id },
      data: {
        lat: 40.8260170, lng: 140.7426556,
        memo: shinmachi.memo!.replace(SHINMACHI_FROM, SHINMACHI_TO),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
      },
    }),
    prisma.spot.update({ where: { id: asamushi.id }, data: { memo: asamushi.memo!.replace(ASAMUSHI_FROM, ASAMUSHI_TO) } }),
    prisma.spot.update({ where: { id: sannai.id }, data: { lat: 40.8110007, lng: 140.6975615 } }),
    prisma.spot.update({
      where: { id: hakkodaLunch.id },
      data: { lat: 40.6798240, lng: 140.8307806, memo: hakkodaLunch.memo!.replace(HAKKODA_LUNCH_FROM, HAKKODA_LUNCH_TO) },
    }),
    prisma.spot.update({
      where: { id: hakkodaRopeway.id },
      data: {
        lat: 40.6756231, lng: 140.8588561,
        memo: hakkodaRopeway.memo!.replace(HAKKODA_ROPEWAY_FROM, HAKKODA_ROPEWAY_TO),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 12 }] },
      },
    }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
