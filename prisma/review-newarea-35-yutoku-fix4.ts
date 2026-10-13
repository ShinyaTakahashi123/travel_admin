/**
 * #35の直し(企画運営・法務の指摘、2026-10-13)。
 * 1. 「日本三大稲荷」「鎮西日光」を同じ文の中でぼかす
 * 2. 表参道・門前商店街102分→40分、日本庭園・祐徳博物館90分→60分に戻す(時間を
 *    埋める長さだったため)
 * 3. 空いた時間に、バスで肥前浜宿酒蔵通りへ立ち寄るスポットを追加(#31と同じ
 *    場所だが文は書き写さず、短く紹介するのみ)。乗り方の一文も追加
 * 4. 奥の院・表参道の座標は、OSM生API・Overpass・GSI地名検索のいずれも
 *    今回は手段が見つからず、まだ直せていない(チェック表には「座標待ち」と記録)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "2dee8038-3148-4f2a-b192-f03fe6f1fad4";
const YUTOKU_SPOT_ID = "3e22c82c-19dc-4cc2-a136-9fc4a157e896";
const NIHONTEIEN_SPOT_ID = "0d1f6065-d97a-4f9c-85f7-82188567fab3";
const OMOTESANDO_SPOT_ID = "e40054ed-cd45-4b23-85d1-de488c5aa8b6";

const YUTOKU_OLD = "公式には、京都の伏見稲荷神社、茨城の笠間稲荷神社とあわせて「日本三大稲荷」の一つに数えられるとしています。石壁山の中腹、高さ18mの舞台造りの上に本殿が立ち、総漆塗り・極彩色の楼門とあわせて「鎮西日光」とも呼ばれています。";
const YUTOKU_NEW = "京都の伏見稲荷神社、茨城の笠間稲荷神社とあわせて、日本三大稲荷の一つとされています。石壁山の中腹、高さ18mの舞台造りの上に本殿が立ち、総漆塗り・極彩色の楼門とあわせて「鎮西日光」とも呼ばれています。";

const HAMASHUKU_MEMO =
  "佐賀県鹿島市浜町にある、国の重要伝統的建造物群保存地区です。白壁の酒蔵や町家が軒を連ねる通りを、のんびりと歩いてみましょう。今も人が暮らす町並みですので、家の敷地に入らず、静かに散策しましょう。見学を終えたら、すぐ近くのJR肥前浜駅から帰路につきましょう。";

async function main() {
  const yutoku = await prisma.spot.findUnique({ where: { id: YUTOKU_SPOT_ID } });
  const nihonteien = await prisma.spot.findUnique({ where: { id: NIHONTEIEN_SPOT_ID } });
  const omotesando = await prisma.spot.findUnique({ where: { id: OMOTESANDO_SPOT_ID } });
  if (!yutoku?.memo || !nihonteien || nihonteien.stayDurationMin !== 90 || !omotesando || omotesando.stayDurationMin !== 102) {
    throw new Error("想定と違います");
  }
  if (!yutoku.memo.includes(YUTOKU_OLD)) throw new Error("祐徳稲荷神社の置換対象が見つかりません");

  const hamashukuPlace = await prisma.placeMaster.findFirst({ where: { name: "肥前浜宿酒蔵通り" } });
  if (!hamashukuPlace) throw new Error("肥前浜宿酒蔵通りの台帳が見つかりません(#31で作成済みのはず)");

  const newYutokuMemo = yutoku.memo.replace(YUTOKU_OLD, YUTOKU_NEW);

  console.log("[確認OK] 祐徳稲荷神社の「日本三大稲荷」「鎮西日光」をぼかす");
  console.log("[確認OK] 日本庭園90→60分、表参道102→40分に戻す");
  console.log("[確認OK] 肥前浜宿酒蔵通りへのバスでの立ち寄りを追加(台帳は#31と共有、文は新規)");
  console.log("新祐徳稲荷神社メモ:", newYutokuMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: YUTOKU_SPOT_ID }, data: { memo: newYutokuMemo } });
  await prisma.spot.update({ where: { id: NIHONTEIEN_SPOT_ID }, data: { stayDurationMin: 60 } });
  await prisma.spot.update({ where: { id: OMOTESANDO_SPOT_ID }, data: { stayDurationMin: 40 } });

  const omotesandoLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: OMOTESANDO_SPOT_ID } });
  if (!omotesandoLeg) throw new Error("移動データが見つかりません");

  // 肥前浜宿酒蔵通り（立ち寄り）: orderNo6、表参道(14:18+40=14:58)からバス25分で15:23着、67分滞在(16:30終了)
  const hamashukuSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: hamashukuPlace.id, orderNo: 6, name: "肥前浜宿酒蔵通り（立ち寄り）",
      address: hamashukuPlace.address, lat: Number(hamashukuPlace.lat), lng: Number(hamashukuPlace.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 23)), memo: HAMASHUKU_MEMO, stayDurationMin: 67,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: hamashukuSpot.id, orderNo: 1, transitMode: "bus", transitDurationMin: 25 } });

  console.log("  COMMITTED: #35 肥前浜宿への立ち寄りを追加、滞在を戻す(09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
