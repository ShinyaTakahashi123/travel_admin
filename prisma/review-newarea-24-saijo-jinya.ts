/**
 * 承認待ちしおりの見直し・新しい地域の分#24(efaee93e、弘法水と西条陣屋跡)。
 * 既に5か所あったため、新規スポットは昼食の1つのみ追加し、既存スポットの並び順を
 * そのまま使って16:30まで延ばす。
 *
 * - 西条陣屋跡と西条郷土博物館: 「入館料は変わることがあるので、公式の案内で
 *   確かめてください」というお金の話と「ください」を削除
 * - 伊予西条駅前（昼食）: 駅前の飲食店は複数の個別店舗(焼肉店・居酒屋など private)
 *   のため、店名は出さずエリアとして案内する形にする(つくば駅前と同じパターン)
 * - 四国鉄道文化館・西条市観光交流センターの滞在時間を、内容量に見合う範囲で
 *   延ばす(北館・南館・大型ジオラマのある鉄道文化館は60→90分、観光交流センターは
 *   45→50分。いずれも過度な水増しではなく、展示内容に見合う調整と判断)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "efaee93e-6edc-4e90-bde2-5f942c5f7e8c";
const DAY_ID = "a2264601-1ab1-4914-b7d8-5835983c2413";
const JINYA_SPOT_ID = "c47d1572-32ce-47eb-a4d7-886a0c7eff1c";
const TETSUDO_SPOT_ID = "e9d7359f-c94f-4c93-9952-e7653214e756";
const KORYU_SPOT_ID = "1cee668d-3d10-4cfd-9f0b-27c84ed1c7b7";

const NEW_DESCRIPTION =
  "弘法大師ゆかりの湧き水「弘法水」から、水辺の遊歩道アクアトピア、西条藩の歴史を伝える陣屋跡と郷土博物館をめぐります。伊予西条駅前で昼食をとり、四国鉄道文化館、西条市観光交流センターまで、水の都・西条の城下町と鉄道の魅力を楽しむ日帰りプランです。";

const NEW_JINYA_MEMO =
  "寛永13年(1636)、伊勢神戸から移った一柳氏によって築かれた西条藩の陣屋跡です。一柳氏は寛文5年(1665)に改易となり、寛文10年(1670)、徳川家康の孫にあたる松平頼純が藩主となってからは、松平氏が10代・約200年にわたって西条藩三万石を治めました。今も鯉や鴨が泳ぐ堀が残っています。陣屋跡は現在、県立西条高校の敷地になっており、大手門は同校の正門として使われています。校内には入らず、堀や門を外から見学しましょう。陣屋跡の一角に立つ西条郷土博物館では、陣屋の模型や藩札、大砲など、旧西条藩ゆかりの品々を見学できます。";

const EKIMAE_MEMO = "JR伊予西条駅前には、飲食店が点在しています。好みの店で昼食をとりましょう。";

async function main() {
  const jinya = await prisma.spot.findUnique({ where: { id: JINYA_SPOT_ID } });
  const tetsudo = await prisma.spot.findUnique({ where: { id: TETSUDO_SPOT_ID } });
  const koryu = await prisma.spot.findUnique({ where: { id: KORYU_SPOT_ID } });
  if (!jinya?.memo || !tetsudo || !koryu) throw new Error("想定と違います");

  const tetsudoTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: tetsudo.id, orderNo: 1 } });
  if (!tetsudoTransit) throw new Error("移動データが見つかりません");

  const newJinyaMemo = jinya.memo.replace(
    "入館料は変わることがあるので、公式の案内で確かめてください。",
    ""
  );
  if (newJinyaMemo === jinya.memo) throw new Error("置換対象が見つかりません(陣屋跡)");

  const ekimaeDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "伊予西条駅前" } } });
  if (ekimaeDup) throw new Error("台帳が既に存在します(想定外、再利用を検討すること)");

  console.log("[確認OK] 説明文を直す(鉄道文化館・観光交流センターを追加)");
  console.log("[確認OK] 西条陣屋跡のメモからお金の話・「ください」を削除");
  console.log("[確認OK] 伊予西条駅前（昼食）を追加し、以降の時刻を調整して16:30まで延ばす");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: JINYA_SPOT_ID }, data: { memo: newJinyaMemo } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: jinya.placeMasterId! } }))!.prefectureAreaId;

  // 伊予西条駅前（昼食）: orderNo 4、陣屋跡(11:25+75=12:40)から20分で13:00着、60分滞在
  const ekimaePlace = await prisma.placeMaster.create({
    data: {
      name: "伊予西条駅前", address: "愛媛県西条市大町", lat: 33.911625, lng: 133.189255,
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "address", verifiedAt: new Date(),
    },
  });
  const ekimaeSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: ekimaePlace.id, orderNo: 4, name: "伊予西条駅前（昼食）",
      address: "愛媛県西条市大町", lat: 33.911625, lng: 133.189255,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 0)), memo: EKIMAE_MEMO, stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: ekimaeSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 20 } });

  // 既存のorderNoを1つずつ後ろにずらす(4→5, 5→6)
  await prisma.spot.update({ where: { id: KORYU_SPOT_ID }, data: { orderNo: 99 } });
  await prisma.spot.update({ where: { id: TETSUDO_SPOT_ID }, data: { orderNo: 5 } });
  await prisma.spot.update({ where: { id: KORYU_SPOT_ID }, data: { orderNo: 6 } });

  // 四国鉄道文化館: 伊予西条駅前(13:00+60=14:00)から5分で14:05着、90分滞在(60→90に延長)
  await prisma.spotTransitLeg.update({ where: { id: tetsudoTransit.id }, data: { transitDurationMin: 5 } });
  await prisma.spot.update({
    where: { id: TETSUDO_SPOT_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 5)), stayDurationMin: 90 },
  });

  // 西条市観光交流センター: 鉄道文化館(14:05+90=15:35)から5分で15:40着、50分滞在(16:30終了)
  const koryuTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: KORYU_SPOT_ID, orderNo: 1 } });
  if (koryuTransit) await prisma.spotTransitLeg.update({ where: { id: koryuTransit.id }, data: { transitDurationMin: 5 } });
  await prisma.spot.update({
    where: { id: KORYU_SPOT_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 40)), stayDurationMin: 50 },
  });

  console.log("  COMMITTED: 新しい地域#24 弘法水と西条陣屋跡");
}
main().finally(() => prisma.$disconnect());
