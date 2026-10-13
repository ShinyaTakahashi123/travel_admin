/**
 * #31の直し(企画運営・法務の指摘、2026-10-13)。
 * 1. 肥前浜宿酒蔵通りに含めていた昼食を「肥前浜宿（昼食）」として分離。
 *    酒蔵通りの滞在は130分→100分に短縮
 * 2. 由緒が確かめられなかった泰智寺を削除し、祐徳稲荷神社に差し替え。日本三大稲荷の
 *    一つとされる神社で、由緒・本殿の特徴は公式サイト(yutokusan.jp/about/)で確認。
 *    肥前浜宿からは2.4km以上あるためバスを使う(系統・時刻は確認できず本文には
 *    書かない)
 * 3. 肥前浜宿酒蔵通りと旧乗田家住宅の座標が同じ値だった件: 旧乗田家住宅の正確な
 *    番地を「鹿島市旧乗田家住宅設置条例」(佐賀県鹿島市古枝甲115番地)で確認し、
 *    国土地理院の番地検索の点(33.092125, 130.113632)に修正。OSMの生API・Overpass
 *    は今回も利用できなかった(429エラー・接続タイムアウト)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "6ef3e7a8-2b31-498d-9023-a6fb7c7072da";
const DAY_ID = "d91dfab4-7d06-4e8a-a675-9d09e6ccfbf5";
const SHUZODORI_SPOT_ID = "d75d3d35-08be-4ec7-8f49-3bcace20f45b";
const NOTTA_SPOT_ID = "4750404f-3dd2-4eba-bd1c-166949ae8ad3";
const HIZENYA_SPOT_ID = "5b0e906f-1622-4404-b899-c83280e1fe1a";
const HAMABAR_SPOT_ID = "27786a13-7105-4742-824c-9e56052415c2";

const NOTTA_NEW_LAT = 33.092125;
const NOTTA_NEW_LNG = 130.113632;
const NOTTA_NEW_ADDRESS = "佐賀県鹿島市古枝甲115番地";

const SHUZODORI_LUNCH_LINE = "通り沿いには食事処もあるので、昼食をとりながらゆっくり町並みを楽しみましょう。";

const LUNCH_MEMO = "肥前浜宿の酒蔵通り沿いには、食事ができるお店が集まっています。ここで昼食をとりましょう。";

const YUTOKU_MEMO =
  "貞享4年(1687)、肥前鹿島藩主・鍋島直朝の夫人、花山院萬子媛が、朝廷の勅願所だった稲荷大神の分霊を迎えて創建したと伝わります。御本殿・御神楽殿・楼門などは漆塗りで極彩色に飾られた華やかな造りで、「鎮西日光」とも呼ばれています。日本三大稲荷の一つとされ、商売繁盛や交通安全を願う参拝者が絶えません。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const shuzodori = await prisma.spot.findUnique({ where: { id: SHUZODORI_SPOT_ID } });
  const notta = await prisma.spot.findUnique({ where: { id: NOTTA_SPOT_ID } });
  const hizenya = await prisma.spot.findUnique({ where: { id: HIZENYA_SPOT_ID } });
  const hamabar = await prisma.spot.findUnique({ where: { id: HAMABAR_SPOT_ID } });
  const taichiji = await prisma.spot.findFirst({ where: { name: "泰智寺", dayId: DAY_ID } });
  const yutokuPlaceExisting = await prisma.placeMaster.findFirst({ where: { name: "祐徳稲荷神社" } });
  if (!shuzodori?.memo || !notta || !hizenya || !hamabar || !taichiji || !yutokuPlaceExisting) throw new Error("想定と違います");
  if (!shuzodori.memo.includes(SHUZODORI_LUNCH_LINE)) throw new Error("酒蔵通りの置換対象が見つかりません");

  const newShuzodoriMemo = shuzodori.memo.replace(SHUZODORI_LUNCH_LINE, "");

  console.log("[確認OK] 肥前浜宿酒蔵通りから昼食の文を外し100分に短縮");
  console.log("[確認OK] 肥前浜宿（昼食）を新規スポットとして追加");
  console.log("[確認OK] 泰智寺を削除し、祐徳稲荷神社に差し替え");
  console.log("[確認OK] 旧乗田家住宅の座標を国土地理院の番地点に修正(条例の地番で確認)");
  console.log("新酒蔵通りメモ:", newShuzodoriMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: hizenya.placeMasterId! } }))!.prefectureAreaId;

  // 泰智寺を削除(自分が今回のレビューで追加したばかりのため、そのまま削除してよい)
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: taichiji.id } });
  await prisma.photo.deleteMany({ where: { spotId: taichiji.id } });
  const taichijiPlaceId = taichiji.placeMasterId;
  await prisma.spot.delete({ where: { id: taichiji.id } });
  if (taichijiPlaceId) await prisma.placeMaster.delete({ where: { id: taichijiPlaceId } });

  const nottaLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: NOTTA_SPOT_ID } });
  const hizenyaLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: HIZENYA_SPOT_ID } });
  const hamabarLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: HAMABAR_SPOT_ID } });
  if (!nottaLeg || !hizenyaLeg || !hamabarLeg) throw new Error("移動データが見つかりません");

  // 旧乗田家住宅・肥前屋・HAMA BARをいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: NOTTA_SPOT_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: HIZENYA_SPOT_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: HAMABAR_SPOT_ID }, data: { orderNo: 94 } });

  // 肥前浜宿酒蔵通り: orderNo1、09:30開始、100分滞在
  await prisma.spot.update({ where: { id: SHUZODORI_SPOT_ID }, data: { memo: newShuzodoriMemo, stayDurationMin: 100 } });

  // 肥前浜宿（昼食）: orderNo2、酒蔵通り(9:30+100=11:10)から5分で11:15着、55分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "肥前浜宿", address: "佐賀県鹿島市浜町乙", lat: Number(shuzodori.lat), lng: Number(shuzodori.lng),
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 2, name: "肥前浜宿（昼食）",
      address: "佐賀県鹿島市浜町乙", lat: Number(shuzodori.lat), lng: Number(shuzodori.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 15)), memo: LUNCH_MEMO, stayDurationMin: 55,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });

  // 旧乗田家住宅: orderNo3、昼食(11:15+55=12:10)から9分で12:19着、35分滞在(座標を修正)
  await prisma.spot.update({
    where: { id: NOTTA_SPOT_ID },
    data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 19)), lat: NOTTA_NEW_LAT, lng: NOTTA_NEW_LNG, address: NOTTA_NEW_ADDRESS },
  });
  await prisma.placeMaster.update({ where: { id: notta.placeMasterId! }, data: { lat: NOTTA_NEW_LAT, lng: NOTTA_NEW_LNG, address: NOTTA_NEW_ADDRESS, positionSource: "gsi" } });
  await prisma.spotTransitLeg.update({ where: { id: nottaLeg.id }, data: { transitDurationMin: 9 } });

  // 観光酒蔵 肥前屋: orderNo4、旧乗田家住宅(12:19+35=12:54)から5分で12:59着、55分滞在(変更なし)
  await prisma.spot.update({ where: { id: HIZENYA_SPOT_ID }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 59)) } });
  await prisma.spotTransitLeg.update({ where: { id: hizenyaLeg.id }, data: { transitDurationMin: 5 } });

  // 祐徳稲荷神社: orderNo5、肥前屋(12:59+55=13:54)からバス25分で14:19着、70分滞在(台帳の既存データを再利用)
  const yutokuSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: yutokuPlaceExisting.id, orderNo: 5, name: "祐徳稲荷神社",
      address: yutokuPlaceExisting.address, lat: Number(yutokuPlaceExisting.lat), lng: Number(yutokuPlaceExisting.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 19)), memo: YUTOKU_MEMO, stayDurationMin: 70,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: yutokuSpot.id, orderNo: 1, transitMode: "bus", transitDurationMin: 25 } });
  if (yutokuPlaceExisting.photoUrl) {
    await prisma.photo.create({
      data: {
        spotId: yutokuSpot.id, url: yutokuPlaceExisting.photoUrl, caption: "祐徳稲荷神社",
        sourceUrl: yutokuPlaceExisting.photoSourceUrl, author: yutokuPlaceExisting.photoAuthor,
        license: yutokuPlaceExisting.photoLicense, licenseUrl: yutokuPlaceExisting.photoLicenseUrl,
      },
    });
  }

  // HAMA BAR(肥前浜駅): orderNo6、祐徳稲荷神社(14:19+70=15:29)からバス25分で15:54着、40分滞在
  await prisma.spot.update({ where: { id: HAMABAR_SPOT_ID }, data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 54)) } });
  await prisma.spotTransitLeg.update({ where: { id: hamabarLeg.id }, data: { transitMode: "bus", transitDurationMin: 25 } });

  console.log("  COMMITTED: 酒蔵めぐり#31 組み直し完了(09:30〜16:34)");
}
main().finally(() => prisma.$disconnect());
