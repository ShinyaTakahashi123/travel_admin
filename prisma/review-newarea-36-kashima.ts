/**
 * #36(旭ヶ岡公園と道の駅鹿島、鹿島城跡と有明海の干潟、b9031e4f)の直し。
 * 1. 干潟展望館・干潟交流館なな海のメモ「確かめてください」→「確かめましょう」
 * 2. 干潟展望館・干潟交流館なな海と物産館千菜市が同じ座標(道の駅鹿島の代表点)
 *    だったため、それぞれ実在の建物の点に分ける:
 *    干潟交流館(OSM way 1085151991、official_name「鹿島市干潟交流館」、
 *    33.0756941,130.1457487)、千菜市(OSM way 1085151989、33.0752360,130.1457220)
 * 3. 14:29で終わっていた日程を、太良町の実在の行き先3か所を加えて16:30まで
 *    延ばす:
 *    - 竹崎観世音寺(OSM way 1237226176、32.9573183,130.2201163)。「童子舞」の
 *      修正会鬼祭が国の重要無形民俗文化財に指定(出典: 文化庁 文化遺産オンライン
 *      detail/136474、1985年1月12日指定。日付は年中行事のため具体的な日を書かない)
 *    - 竹崎城跡(OSM node 4770835164、32.9558153,130.2226543)。南北朝時代に
 *      有馬氏が築いたと伝わる中世の城跡、展望台
 *    - 道の駅太良(OSM way 1229504115、highway=services、33.0472758,130.1691386。
 *      住所タグに「太良町大字伊福甲3488番地」とあり、以前使っていた国土地理院の
 *      大字中心の点(伊福甲の代表点、どの番地で検索しても同じ点になる既知の
 *      データ欠落)とは別の実点であることを確認)
 * 日程: 大魚神社(13:44-14:29、変更なし)→竹崎観世音寺(14:39-15:14)→
 * 竹崎城跡(15:19-15:39)→道の駅太良(15:50-16:30)。9:30〜16:30。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "b9031e4f-79e2-414d-a1e8-bbc809ed5f6f";
const DAY_ID = "90630a01-3ff6-449a-9671-bc5527847ec1";

const HIGATA_ID = "b3e79486-31b2-40cd-a190-41fc61094663";
const SENJAICHI_ID = "38ad6915-f7b5-4b51-831d-8bed9e76203f";
const OYO_ID = "7e624c09-1263-4d46-ac3e-c15a6168790f";

const OLD_DESC =
  "鹿島藩の政庁が置かれた鹿島城の跡地・旭ヶ岡公園から、有明海の広大な干潟を望む道の駅鹿島、隣の太良町にある大魚神社の海中鳥居までをめぐる、鹿島・太良の日帰りプランです。";
const NEW_DESC =
  "鹿島藩の政庁が置かれた鹿島城の跡地・旭ヶ岡公園から、有明海の広大な干潟を望む道の駅鹿島、隣の太良町にある大魚神社の海中鳥居、国の重要無形民俗文化財「童子舞」が伝わる竹崎観世音寺や中世の城跡・竹崎城跡、道の駅太良までをめぐる、鹿島・太良の日帰りプランです。";

const HIGATA_MEMO_NEW =
  "有明海の広大な干潟を望む展望施設です。2階の観察デッキからは干潟の様子を一望でき、隣接する干潟交流館「なな海」では、ムツゴロウなど有明海ならではの生き物を展示するミニ水族館を見学できます。4〜10月ごろには、干潟の上を滑る「潟スキー」などの干潟体験も行われています。参加方法や貸出用具については、公式の案内で確かめましょう。干潟には、決められた体験の場所以外では入らないようにしましょう。潮の満ち引きもあるので、現地の案内に従いましょう。";

const HIGATA_LAT = 33.0756941;
const HIGATA_LNG = 130.1457487;
const SENJAICHI_LAT = 33.075236;
const SENJAICHI_LNG = 130.145722;

const KANZEONJI_NAME = "竹崎観世音寺";
const KANZEONJI_LAT = 32.9573183;
const KANZEONJI_LNG = 130.2201163;
const KANZEONJI_MEMO =
  "太良町竹崎にある古刹です。正月の修正会で奉納される「童子舞」は、この寺だけに伝わる芸能とされ、国の重要無形民俗文化財に指定されています。静かに境内を拝観しましょう。";

const SHIROATO_NAME = "竹崎城跡";
const SHIROATO_LAT = 32.9558153;
const SHIROATO_LNG = 130.2226543;
const SHIROATO_MEMO =
  "南北朝時代、有馬氏によって築かれたと伝わる、有明海に面した中世の城跡です。島原の乱の後に廃城になったとされ、今は城をかたどった展望台が立ち、有明海や多良岳、晴れた日には雲仙岳までを見渡せます。展望台の階段には段差があるので、足元に注意しましょう。";

const MICHINOEKI_NAME = "道の駅太良";
const MICHINOEKI_LAT = 33.0472758;
const MICHINOEKI_LNG = 130.1691386;
const MICHINOEKI_MEMO =
  "太良町の特産品が並ぶ道の駅です。冬を中心に、多良岳山麓で栽培されるみかんが数多く並びます。有明海でとれたムツゴロウなどの加工品も見つかります。ここでこの日の旅を終え、帰路につきましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("説明文が想定と違います");

  const higata = await prisma.spot.findUnique({ where: { id: HIGATA_ID } });
  const senjaichi = await prisma.spot.findUnique({ where: { id: SENJAICHI_ID } });
  const oyo = await prisma.spot.findUnique({ where: { id: OYO_ID } });
  if (!higata || !senjaichi || !oyo) throw new Error("想定と違います");

  console.log("[確認OK] 説明文を書きかえ");
  console.log("[確認OK] 干潟展望館・なな海: ください→ましょう、座標→", HIGATA_LAT, HIGATA_LNG);
  console.log("[確認OK] 物産館千菜市: 座標→", SENJAICHI_LAT, SENJAICHI_LNG);
  console.log("[確認OK] 竹崎観世音寺・竹崎城跡・道の駅太良を追加(orderNo5,6,7)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });

  if (higata.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: higata.placeMasterId }, data: { lat: HIGATA_LAT, lng: HIGATA_LNG, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: HIGATA_ID }, data: { lat: HIGATA_LAT, lng: HIGATA_LNG, memo: HIGATA_MEMO_NEW } });

  if (senjaichi.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: senjaichi.placeMasterId }, data: { lat: SENJAICHI_LAT, lng: SENJAICHI_LNG, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: SENJAICHI_ID }, data: { lat: SENJAICHI_LAT, lng: SENJAICHI_LNG } });

  const kanzeonjiPlace = await prisma.placeMaster.create({
    data: { name: KANZEONJI_NAME, lat: KANZEONJI_LAT, lng: KANZEONJI_LNG, positionSource: "osm", source: "ai_collected" },
  });
  const kanzeonji = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: kanzeonjiPlace.id, orderNo: 5, name: KANZEONJI_NAME,
      lat: KANZEONJI_LAT, lng: KANZEONJI_LNG, memo: KANZEONJI_MEMO,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 39)), stayDurationMin: 35,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kanzeonji.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });

  const shiroatoPlace = await prisma.placeMaster.create({
    data: { name: SHIROATO_NAME, lat: SHIROATO_LAT, lng: SHIROATO_LNG, positionSource: "osm", source: "ai_collected" },
  });
  const shiroato = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: shiroatoPlace.id, orderNo: 6, name: SHIROATO_NAME,
      lat: SHIROATO_LAT, lng: SHIROATO_LNG, memo: SHIROATO_MEMO,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 19)), stayDurationMin: 20,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: shiroato.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });

  const michinoekiPlace = await prisma.placeMaster.create({
    data: { name: MICHINOEKI_NAME, lat: MICHINOEKI_LAT, lng: MICHINOEKI_LNG, positionSource: "osm", source: "ai_collected" },
  });
  const michinoeki = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: michinoekiPlace.id, orderNo: 7, name: MICHINOEKI_NAME,
      lat: MICHINOEKI_LAT, lng: MICHINOEKI_LNG, memo: MICHINOEKI_MEMO,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 50)), stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: michinoeki.id, orderNo: 1, transitMode: "car", transitDurationMin: 11 } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
