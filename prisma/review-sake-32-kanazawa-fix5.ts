/**
 * #32の直し(企画運営の指摘、2026-10-13)。福光屋の103分は時間合わせの長さだった
 * ため56分に短縮し、主計町茶屋街の近くの泉鏡花記念館(金沢市下新町2-3、主計町
 * 茶屋街から徒歩2分。開館時間は情報源により9:30-16:30/17:00と差があったため
 * 本文には書かない)を追加する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "c0b3de48-a090-407f-b4b6-c86a530667b7";
const KAZUEMACHI_SPOT_ID = "13594a40-ac48-4456-a93f-c8eb18f357cd";
const FUKUMITSUYA_SPOT_ID = "75091978-2ff3-4125-a441-34b96d14da8a";

const KYOKA_MEMO =
  "金沢出身の小説家・泉鏡花の記念館です。生家跡に近いこの地に、鏡花の作品や愛用品、直筆原稿などを展示しています。「高野聖」「夜叉ヶ池」など、幻想的な作風で知られる鏡花の世界にふれることができます。";

async function main() {
  const kazuemachi = await prisma.spot.findUnique({ where: { id: KAZUEMACHI_SPOT_ID } });
  const fukumitsuya = await prisma.spot.findUnique({ where: { id: FUKUMITSUYA_SPOT_ID } });
  if (!kazuemachi || !fukumitsuya || fukumitsuya.stayDurationMin !== 103) throw new Error("想定と違います");

  const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: "泉鏡花" } } });
  if (dup) throw new Error("台帳が既に存在します(想定外): 泉鏡花記念館");

  console.log("[確認OK] 泉鏡花記念館を追加し、福光屋の滞在を103分→56分に短縮");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: kazuemachi.placeMasterId! } }))!.prefectureAreaId;

  const fukumitsuyaLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: FUKUMITSUYA_SPOT_ID } });
  if (!fukumitsuyaLeg) throw new Error("移動データが見つかりません");

  await prisma.spot.update({ where: { id: FUKUMITSUYA_SPOT_ID }, data: { orderNo: 93 } });

  // 泉鏡花記念館: orderNo6、主計町茶屋街(13:12+75=14:27)から2分で14:29着、45分滞在
  const kyokaPlace = await prisma.placeMaster.create({
    data: {
      name: "泉鏡花記念館", address: "石川県金沢市下新町2-3", lat: 36.571415, lng: 136.663223,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const kyokaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: kyokaPlace.id, orderNo: 6, name: "泉鏡花記念館",
      address: "石川県金沢市下新町2-3", lat: 36.571415, lng: 136.663223,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 29)), memo: KYOKA_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kyokaSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 2 } });

  // 福光屋: orderNo7、泉鏡花記念館(14:29+45=15:14)からバス20分で15:34着、56分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: FUKUMITSUYA_SPOT_ID },
    data: { orderNo: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 34)), stayDurationMin: 56 },
  });
  await prisma.spotTransitLeg.update({ where: { id: fukumitsuyaLeg.id }, data: { transitDurationMin: 20 } });

  console.log("  COMMITTED: #32 泉鏡花記念館を追加、福光屋を56分に短縮(09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
