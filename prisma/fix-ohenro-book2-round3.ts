/**
 * お遍路 本2(#8)の3回目の直し(企画運営指摘、2026-10-14)。対象はすべてidで指定。
 * 「滞在を延ばして埋めるのは不可」との指摘を受け、単一スポットの滞在を延ばす
 * のではなく、実在の別スポットを追加して空いた時間を埋める。
 *
 * 1. 阿波十郎兵衛屋敷(昼食)の滞在を106分→65分に戻し、空いた時間には
 *    阿波おどり会館(徳島市新町橋、OSM way 226021281、34.0701506,134.5450185、
 *    出典: 公式サイトのフロア案内〈2階阿波おどりホール・3階ミュージアム・
 *    5階眉山ロープウェイ山麓駅〉)を追加
 * 2. 立江寺の滞在を90分→40分に戻し、空いた時間には星の岩屋(勝浦町星谷、
 *    OSM node 415527383、33.9486482,134.5146753。弘法大師が7日間修行したと
 *    伝わり立江寺の奥院ともされる洞窟。出典: 勝浦町の観光案内等〈二次資料。
 *    伝承として「〜と伝えられる」の形で記載〉)を追加
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book2-round3.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book2-round3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY1_ID = "32ab4c48-0c31-4840-a4a1-546c5fb472ea";
const DAY2_ID = "726af385-2af7-4773-9bbc-7312837ec238";

const JURO_SPOT_ID = "53ebf453-b474-4572-990a-557f02d37249";
const KANNONJI_ID = "947ce18e-a482-4859-a0ba-723352529f6f";
const IDOJI_ID = "5a4c10f0-0d15-4204-bc4f-deb3555740e3";

const TATSUEJI_ID = "beec02b4-3ea3-45b2-9902-98daef8e291c";
const HINANO_ID = "e293af1e-7159-4c7c-9129-15897bc771c9";
const KAKURINJI_ID = "dfa83673-cb86-4ac6-b58b-46dbfd866b77";
const WASHINOSATO_NAME = "道の駅鷲の里";
const TAIRYUJI_ID = "36c7a23d-1cd9-413c-a4a3-426cdab0f697";

const TATSUEJI_MEMO_SHORT =
  "天平19年(747)、聖武天皇の勅願により行基が、光明皇后の安産を願って延命地蔵菩薩を刻んで開いたと伝えられます。四国霊場の「総関所」とも呼ばれ、心に後ろめたさを抱えた者はこれより先に進めないという言い伝えがあります。境内の黒髪堂には、罪を犯して遍路の途中に懺悔した女性の髪が、鐘の綱に巻きついて抜けなくなったという伝説にちなむ髪が祀られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const juro = await prisma.spot.findUnique({ where: { id: JURO_SPOT_ID } });
  const tatsueji = await prisma.spot.findUnique({ where: { id: TATSUEJI_ID } });
  const washinosato = await prisma.spot.findFirst({ where: { dayId: DAY2_ID, name: WASHINOSATO_NAME } });
  if (!juro || juro.stayDurationMin !== 106) throw new Error("想定と違います(十郎兵衛屋敷)");
  if (!tatsueji || tatsueji.stayDurationMin !== 90) throw new Error("想定と違います(立江寺)");
  if (!washinosato) throw new Error("想定と違います(鷲の里)");

  console.log("[確認OK] 十郎兵衛屋敷(昼食)を65分に戻し、阿波おどり会館(新設)を追加");
  console.log("[確認OK] 立江寺を40分に戻し、星の岩屋(新設)を追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // --- 日1 ---
  await prisma.spot.update({ where: { id: JURO_SPOT_ID }, data: { stayDurationMin: 65 } }); // 13:15-14:20

  await prisma.spot.update({ where: { id: KANNONJI_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: IDOJI_ID }, data: { orderNo: 93 } });

  const odoriPlace = await prisma.placeMaster.create({
    data: { name: "阿波おどり会館", address: "徳島県徳島市新町橋2丁目", lat: 34.0701506, lng: 134.5450185, category: "museum", source: "ai_collected", positionSource: "nominatim" },
  });
  const odoriSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: odoriPlace.id, orderNo: 6, name: "阿波おどり会館",
      address: odoriPlace.address, lat: odoriPlace.lat, lng: odoriPlace.lng,
      memo: "徳島市新町橋にある、阿波おどりを紹介する施設です。2階の「阿波おどりホール」では阿波おどりの実演が行われることがあり(開催日時は公式の案内で確かめましょう)、3階の「阿波おどりミュージアム」では衣装や鳴り物などの展示を見学できます。5階は眉山ロープウェイの山麓駅になっています。",
      visitTime: t(14, 27), stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: odoriSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 7 } });

  await prisma.spot.update({ where: { id: KANNONJI_ID }, data: { orderNo: 7, visitTime: t(15, 22) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: KANNONJI_ID }, data: { transitDurationMin: 10 } });

  await prisma.spot.update({ where: { id: IDOJI_ID }, data: { orderNo: 8, visitTime: t(16, 2) } });

  // --- 日2 ---
  await prisma.spot.update({
    where: { id: TATSUEJI_ID },
    data: { stayDurationMin: 40, memo: TATSUEJI_MEMO_SHORT }, // 09:45-10:25
  });

  await prisma.spot.update({ where: { id: HINANO_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: KAKURINJI_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: washinosato.id }, data: { orderNo: 94 } });
  await prisma.spot.update({ where: { id: TAIRYUJI_ID }, data: { orderNo: 95 } });

  const hoshiPlace = await prisma.placeMaster.create({
    data: { name: "星の岩屋", address: "徳島県勝浦郡勝浦町星谷", lat: 33.9486482, lng: 134.5146753, category: "other", source: "ai_collected", positionSource: "nominatim" },
  });
  const hoshiSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: hoshiPlace.id, orderNo: 3, name: "星の岩屋",
      address: hoshiPlace.address, lat: hoshiPlace.lat, lng: hoshiPlace.lng,
      memo: "勝浦町星谷にある洞窟です。弘法大師がこの岩屋に7日間こもって修行したと伝えられ、立江寺の奥院ともされています。人々に災いをもたらしていた星を、大師が法力でこの岩屋に封じ込めたという言い伝えも残ります。岩屋の前には「裏見の滝」と呼ばれる滝が流れ落ち、滝の裏側からその様子を眺められます。足もとが滑りやすいので、気をつけて歩きましょう。今も信仰を集める場所ですので、静かに、敬意をもって見学しましょう。",
      visitTime: t(10, 51), stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: hoshiSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 26 } });

  await prisma.spot.update({ where: { id: HINANO_ID }, data: { orderNo: 4, visitTime: t(11, 44) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: HINANO_ID }, data: { transitDurationMin: 13 } });

  await prisma.spot.update({ where: { id: KAKURINJI_ID }, data: { orderNo: 5, visitTime: t(12, 56) } });
  await prisma.spot.update({ where: { id: washinosato.id }, data: { orderNo: 6, visitTime: t(14, 29) } });
  await prisma.spot.update({ where: { id: TAIRYUJI_ID }, data: { orderNo: 7, visitTime: t(15, 9), stayDurationMin: 85 } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
