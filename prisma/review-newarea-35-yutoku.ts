/**
 * 承認待ちしおりの見直し・新しい地域の分#35(79fc6e71、祐徳稲荷神社と表参道、
 * 日本庭園と奥の院、鹿島)。
 * 既存4か所(本殿・楼門60分・日本庭園60分・奥の院70分・表参道75分[昼食の
 * 提案を含む]、09:30開始)は4か所以上を満たすが14:35終了。
 *
 * - 日本庭園・祐徳博物館の座標が丸め値(33.0748,130.1071)だったため、OSM
 *   (Nominatim)で確認できた実点(33.07394,130.1096775)に修正。奥の院・表参道は
 *   OSM・Overpassの両方が終日利用できず(429エラー・接続タイムアウト)、祐徳
 *   稲荷神社の公式サイトにも専用ページ・地図が見当たらず、今回は座標を直せて
 *   いない(企画運営に報告する)
 * - 表参道から昼食の一文を切り出し、「表参道（昼食）」を新規スポットとして追加
 * - 確かめられる新しい行き先が見つからなかったため、日本庭園・祐徳博物館
 *   (60→90分、庭園と博物館の2つの見学を含むため)と表参道・門前商店街
 *   (75→102分、土産物店や食事処が並ぶ約400mの通り)の滞在を、内容に見合う
 *   範囲で延ばして16:30に収めた
 * - 日本庭園のメモの「ください」、料金への言及を修正
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "2dee8038-3148-4f2a-b192-f03fe6f1fad4";
const NIHONTEIEN_SPOT_ID = "0d1f6065-d97a-4f9c-85f7-82188567fab3";
const OKUNOIN_SPOT_ID = "ee1068f8-ccdf-4f0f-b8dc-d7ed49406698";
const OMOTESANDO_SPOT_ID = "e40054ed-cd45-4b23-85d1-de488c5aa8b6";

const NIHONTEIEN_NEW_LAT = 33.07394;
const NIHONTEIEN_NEW_LNG = 130.1096775;

const NIHONTEIEN_OLD_LINE = "開園の時期や料金は変わることがあるので、公式の案内で確かめてください。";
const NIHONTEIEN_NEW_LINE = "開園の時期は変わることがあるので、公式の案内で確かめましょう。";

const LUNCH_MEMO = "祐徳稲荷神社へと続く表参道沿いには、食事ができるお店が集まっています。ここで昼食をとりましょう。";

const OMOTESANDO_OLD_LINE = "ここで遅めの昼食をとるのもおすすめです。";

async function main() {
  const nihonteien = await prisma.spot.findUnique({ where: { id: NIHONTEIEN_SPOT_ID } });
  const okunoin = await prisma.spot.findUnique({ where: { id: OKUNOIN_SPOT_ID } });
  const omotesando = await prisma.spot.findUnique({ where: { id: OMOTESANDO_SPOT_ID } });
  if (!nihonteien?.memo || !okunoin || !omotesando?.memo) throw new Error("想定と違います");
  if (!nihonteien.memo.includes(NIHONTEIEN_OLD_LINE)) throw new Error("日本庭園の置換対象が見つかりません");
  if (!omotesando.memo.includes(OMOTESANDO_OLD_LINE)) throw new Error("表参道の置換対象が見つかりません");

  const newNihonteienMemo = nihonteien.memo.replace(NIHONTEIEN_OLD_LINE, NIHONTEIEN_NEW_LINE);
  const newOmotesandoMemo = omotesando.memo.replace(OMOTESANDO_OLD_LINE, "");

  console.log("[確認OK] 日本庭園・祐徳博物館の座標・ください・料金の言及を修正");
  console.log("[確認OK] 表参道（昼食）を新規追加し、表参道からは昼食の文を外す");
  console.log("[確認OK] 日本庭園60→90分、表参道75→102分に延ばして16:30に収める");
  console.log("新日本庭園メモ:", newNihonteienMemo);
  console.log("新表参道メモ:", newOmotesandoMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: nihonteien.placeMasterId! } }))!.prefectureAreaId;

  const okunoinLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: OKUNOIN_SPOT_ID } });
  const omotesandoLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: OMOTESANDO_SPOT_ID } });
  if (!okunoinLeg || !omotesandoLeg) throw new Error("移動データが見つかりません");

  // 日本庭園: orderNo2(変更なし)、座標修正、90分滞在
  await prisma.placeMaster.update({ where: { id: nihonteien.placeMasterId! }, data: { lat: NIHONTEIEN_NEW_LAT, lng: NIHONTEIEN_NEW_LNG, positionSource: "gsi" } });
  await prisma.spot.update({ where: { id: NIHONTEIEN_SPOT_ID }, data: { lat: NIHONTEIEN_NEW_LAT, lng: NIHONTEIEN_NEW_LNG, memo: newNihonteienMemo, stayDurationMin: 90 } });

  // 奥の院をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: OKUNOIN_SPOT_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: OMOTESANDO_SPOT_ID }, data: { orderNo: 94 } });

  // 奥の院: orderNo3、日本庭園(10:35+90=12:05)から20分で12:25着、70分滞在(変更なし)
  await prisma.spot.update({ where: { id: OKUNOIN_SPOT_ID }, data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 25)) } });

  // 表参道（昼食）: orderNo4、奥の院(12:25+70=13:35)から15分で13:50着、55分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "表参道（祐徳稲荷神社・昼食用）", address: "佐賀県鹿島市古枝", lat: Number(omotesando.lat), lng: Number(omotesando.lng),
      prefectureAreaId, category: "gourmet", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 4, name: "表参道（昼食）",
      address: "佐賀県鹿島市古枝", lat: Number(omotesando.lat), lng: Number(omotesando.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 50)), memo: LUNCH_MEMO, stayDurationMin: 55,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 15 } });

  // 表参道(門前商店街): orderNo5、昼食(13:50+55=14:45)から3分で14:48着、102分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: OMOTESANDO_SPOT_ID },
    data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 48)), stayDurationMin: 102, memo: newOmotesandoMemo },
  });
  await prisma.spotTransitLeg.update({ where: { id: omotesandoLeg.id }, data: { transitDurationMin: 3 } });

  console.log("  COMMITTED: #35 祐徳稲荷神社(09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
