/**
 * お遍路 本2(#8 12番〜21番)の直し。範囲(12〜21番)は変えない。
 * すべて対象をidで指定する(本1での事故を踏まえ、名前検索は使わない)。
 *
 * 【新しいスポットの座標の出どころ】OSM Nominatimで直接確認した名前のある地物
 * - 文化の森総合公園: OSM way 591279737 (34.0398035, 134.5260422)
 * - 阿波十郎兵衛屋敷: OSM node 266977554 (34.0914976, 134.5840471)
 * - ひなの里かつうら: OSM node 2990721599 (33.9321070, 134.5229142)
 *
 * 【新しい区間の移動時間】OSRM(router.project-osrm.org)の実測を切り上げ
 * 国分寺→文化の森14分(実測13.7)、文化の森→観音寺13分(12.2)、
 * 井戸寺→十郎兵衛屋敷13分(12.1)、立江寺→ひなの里16分(15.0)、
 * ひなの里→鶴林寺12分(11.2)
 *
 * 【内容】
 * - 日1: 国分寺・立江寺相当のメモにあった「この付近で昼食をとって」等の
 *   口頭の案内を削除し、文化の森総合公園(昼食)を新設。観音寺のあとに
 *   井戸寺(既存の宿泊の一文を削除)→阿波十郎兵衛屋敷(新設、宿泊の一文を追加)
 * - 日2: 立江寺の滞在を40→90分に延ばし(食事処を見てまわる時間として)、
 *   ひなの里かつうら(昼食)を新設。太龍寺の滞在を60→105分に延ばし
 *   (ロープウェイ往復を含めた時間として)、16:30過ぎに終わるようにする
 * - 説明文の「ください」→「ましょう」
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book2.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "b4254f5c-51d1-4394-a3a5-eb7dcbba5103";
const DAY1_ID = "32ab4c48-0c31-4840-a4a1-546c5fb472ea";
const DAY2_ID = "726af385-2af7-4773-9bbc-7312837ec238";

const KONSENJI_ID = "77678a3e-42d0-4089-bed0-30e590c29151"; // 国分寺
const KANNONJI_ID = "947ce18e-a482-4859-a0ba-723352529f6f"; // 観音寺
const IDOJI_ID = "5a4c10f0-0d15-4204-bc4f-deb3555740e3"; // 井戸寺
const ONZANJI_ID = "3e7c0493-1de6-49f4-88b8-fbdcc58a8848"; // 恩山寺(未使用だが確認用)
const TATSUEJI_ID = "beec02b4-3ea3-45b2-9902-98daef8e291c"; // 立江寺
const KAKURINJI_ID = "dfa83673-cb86-4ac6-b58b-46dbfd866b77"; // 鶴林寺
const TAIRYUJI_ID = "36c7a23d-1cd9-413c-a4a3-426cdab0f697"; // 太龍寺

const OLD_DESC_SENTENCE = "お出かけ前に各寺院の公式の案内で確かめてください。";
const NEW_DESC_SENTENCE = "お出かけ前に各寺院の公式の案内で確かめましょう。";

const KONSENJI_MEMO_NEW =
  "天平13年(741)、聖武天皇の詔により、全国に建てられた国分寺の一つとして開かれました。当初は法相宗でしたが、弘法大師が修行したことから真言宗に転じ、戦国時代に長宗我部元親の兵火で焼失したあと、江戸時代中期に曹洞宗の寺として再興されました。境内の庭園「阿波国分寺庭園」は、阿波の青石を組んだ豪快な枯山水で、国の名勝に指定されています。奈良時代の七重塔の礎石も残っています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const IDOJI_MEMO_NEW =
  "白鳳2年(673)、天武天皇の勅願により開かれたと伝わる、聖徳太子ゆかりの七仏薬師如来を本尊とする寺です。弘仁6年(815)、この地を訪れた弘法大師が、水不足に苦しむ村人のために錫杖で井戸を掘ったという言い伝えから「井戸寺」と呼ばれるようになりました。今も残るこの井戸は「面影の井戸」と呼ばれ、水面に自分の顔がはっきり映れば3年間無病息災、映らなければ不幸が近いという言い伝えがあります。一木造りの十一面観音立像は国の重要文化財に指定されています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const TATSUEJI_MEMO_NEW =
  "天平19年(747)、聖武天皇の勅願により行基が、光明皇后の安産を願って延命地蔵菩薩を刻んで開いたと伝えられます。四国霊場の「総関所」とも呼ばれ、心に後ろめたさを抱えた者はこれより先に進めないという言い伝えがあります。境内の黒髪堂には、罪を犯して遍路の途中に懺悔した女性の髪が、鐘の綱に巻きついて抜けなくなったという伝説にちなむ髪が祀られています。門前には食事処が並んでいます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || !itin.description || !itin.description.includes(OLD_DESC_SENTENCE)) throw new Error("想定と違います(description)");

  const konsenji = await prisma.spot.findUnique({ where: { id: KONSENJI_ID } });
  const kannonji = await prisma.spot.findUnique({ where: { id: KANNONJI_ID } });
  const idoji = await prisma.spot.findUnique({ where: { id: IDOJI_ID } });
  const tatsueji = await prisma.spot.findUnique({ where: { id: TATSUEJI_ID } });
  const kakurinji = await prisma.spot.findUnique({ where: { id: KAKURINJI_ID } });
  const tairyuji = await prisma.spot.findUnique({ where: { id: TAIRYUJI_ID } });
  if (!konsenji || !kannonji || !idoji || !tatsueji || !kakurinji || !tairyuji) throw new Error("想定と違います(spot)");
  if (konsenji.dayId !== DAY1_ID || idoji.orderNo !== 6 || tairyuji.dayId !== DAY2_ID) throw new Error("想定と違います(構成)");

  console.log("[確認OK] 説明文のください→ましょう");
  console.log("[確認OK] 日1: 焼山寺→大日寺→常楽寺→国分寺→文化の森総合公園(昼食,新設)→観音寺→井戸寺→阿波十郎兵衛屋敷(新設) 09:00〜16:31");
  console.log("[確認OK] 日2: 恩山寺→立江寺(滞在90分に)→ひなの里かつうら(昼食,新設)→鶴林寺→太龍寺(滞在105分に) 09:00〜16:31");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(OLD_DESC_SENTENCE, NEW_DESC_SENTENCE) } });

  // --- 日1: 観音寺(5)・井戸寺(6)を退避してから、文化の森(5)・十郎兵衛屋敷(8)を作る ---
  await prisma.spot.update({ where: { id: KANNONJI_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: IDOJI_ID }, data: { orderNo: 93 } });

  await prisma.spot.update({ where: { id: KONSENJI_ID }, data: { memo: KONSENJI_MEMO_NEW } });

  const bunka = await prisma.placeMaster.create({
    data: { name: "文化の森総合公園", address: "徳島県徳島市八万町", lat: 34.0398035, lng: 134.5260422, category: "park", source: "ai_collected", positionSource: "nominatim" },
  });
  const bunkaSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: bunka.id, orderNo: 5, name: "文化の森総合公園（昼食）",
      address: bunka.address, lat: bunka.lat, lng: bunka.lng,
      memo: "徳島市八万町にある総合公園です。徳島県立博物館・近代美術館・図書館などの文化施設が集まり、園内の食堂で昼食をとれます。緑の中を散策しながら、気になる施設をのぞいてみましょう。",
      visitTime: t(13, 12), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: bunkaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 14 } });

  await prisma.spot.update({ where: { id: KANNONJI_ID }, data: { orderNo: 6, visitTime: t(14, 24) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: KANNONJI_ID }, data: { transitDurationMin: 13 } });

  await prisma.spot.update({ where: { id: IDOJI_ID }, data: { orderNo: 7, visitTime: t(15, 4), memo: IDOJI_MEMO_NEW } });

  const juro = await prisma.placeMaster.create({
    data: { name: "阿波十郎兵衛屋敷", address: "徳島県徳島市川内町", lat: 34.0914976, lng: 134.5840471, category: "museum", source: "ai_collected", positionSource: "nominatim" },
  });
  const juroSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: juro.id, orderNo: 8, name: "阿波十郎兵衛屋敷",
      address: juro.address, lat: juro.lat, lng: juro.lng,
      memo: "徳島市川内町にある、阿波人形浄瑠璃の資料館です。人形浄瑠璃の名場面を、人形と太夫・三味線の生演奏で見せる上演が行われており(上演日時は公式の案内で確かめましょう)、精巧な人形や衣装の展示も見学できます。この日は、このあたりの宿に泊まりましょう。",
      visitTime: t(15, 51), stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: juroSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 12 } });

  // --- 日2: 鶴林寺(3)・太龍寺(4)を退避してから、ひなの里(3)を作る ---
  await prisma.spot.update({ where: { id: KAKURINJI_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: TAIRYUJI_ID }, data: { orderNo: 94 } });

  await prisma.spot.update({ where: { id: TATSUEJI_ID }, data: { stayDurationMin: 90, memo: TATSUEJI_MEMO_NEW } });

  const hinano = await prisma.placeMaster.create({
    data: { name: "ひなの里かつうら", address: "徳島県勝浦郡勝浦町生名", lat: 33.932107, lng: 134.5229142, category: "gourmet", source: "ai_collected", positionSource: "nominatim" },
  });
  const hinanoSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: hinano.id, orderNo: 3, name: "ひなの里かつうら（昼食）",
      address: hinano.address, lat: hinano.lat, lng: hinano.lng,
      memo: "勝浦町にある物産販売所です。地元でとれた野菜や果物、お遍路の道中にうれしい軽食が並びます。ここで昼食をとりましょう。",
      visitTime: t(11, 30), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: hinanoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 16 } });

  await prisma.spot.update({ where: { id: KAKURINJI_ID }, data: { orderNo: 4, visitTime: t(12, 41) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: KAKURINJI_ID }, data: { transitDurationMin: 12 } });

  await prisma.spot.update({ where: { id: TAIRYUJI_ID }, data: { orderNo: 5, visitTime: t(14, 46), stayDurationMin: 105 } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
