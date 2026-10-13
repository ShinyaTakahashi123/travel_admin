/**
 * 承認待ちしおりの見直し・新しい地域の分#33(9254ab1d、竹原町並み保存地区と
 * 西方寺・普明閣、安芸の小京都、広島)。
 * 既存5か所(道の駅たけはら30分・竹原町並み保存地区140分・西方寺45分・
 * 旧松阪家住宅50分・竹鶴酒造20分、09:30開始)は4か所以上を満たすが14:36終了。
 * 竹原町並み保存地区の140分は昼食を含まない純粋な町歩きで時間埋めと判断し、
 * 104分に短縮。説明文も不完全(標準の案内文の途中で切れていた)だったため
 * 書き直す。
 *
 * 新スポット3か所:
 * - 竹原町並み保存地区（昼食）
 * - 照蓮寺: 慶長8年(1603)浄喜による中興と伝わる浄土真宗寺院。学者僧を多く
 *   輩出し竹原の文化的拠点だったことを複数の観光・行政情報で確認
 * - 竹原市歴史民俗資料館: 昭和5年(1930)築の擬洋風建築(旧町立竹原書院図書館)
 *   を生かした資料館(観光情報サイトで確認)
 *
 * 竹鶴酒造(外観)の「ください」も直す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "9254ab1d-e6e5-47c9-8ab3-c3d5331c59fc";
const DAY_ID = "bc328b0f-c7d5-4e1f-a2e2-f081eeda5cb8";
const MACHINAMI_SPOT_ID = "5fb3b93f-af24-489e-a7f4-c89c37d15290";
const SAIHOJI_SPOT_ID = "5d342f6d-d8ef-4e42-be22-01605563f417";
const MATSUZAKAKE_SPOT_ID = "314e6703-66e3-4a6f-9e05-e7c69badaf5a";
const TAKETSURU_SPOT_ID = "a52794b7-d65f-462c-9b9c-b1bfb3a0af54";

const NEW_DESCRIPTION =
  "「安芸の小京都」と呼ばれる竹原町並み保存地区を中心に、道の駅たけはら、清水寺を模したという西方寺・普明閣、豪商の屋敷・旧松阪家住宅、竹原市歴史民俗資料館、照蓮寺、日本のウイスキーの父・竹鶴政孝の生家をめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学は、内容が変わることがあるので、お出かけ前に各施設の公式の案内で確かめましょう。";

const LUNCH_MEMO = "竹原町並み保存地区には、食事ができるお店が集まっています。ここで昼食をとりましょう。";

const SHORENJI_MEMO =
  "慶長8年(1603)、浄喜によって中興されたと伝わる浄土真宗の寺院です。江戸時代には学者僧を多く輩出し、竹原の文化的な拠点としての役割も担いました。本堂・経蔵は江戸時代の建築です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const SHIRYOKAN_MEMO =
  "昭和5年(1930)、町立竹原書院図書館として建てられた擬洋風建築を生かした資料館です。製塩業や酒造業で栄えた竹原の歴史や、暮らしの道具などを紹介しています。";

const TAKETSURU_OLD = "見学できるかどうかは、公式の案内で確かめてください。";
const TAKETSURU_NEW = "見学できるかどうかは、公式の案内で確かめましょう。";

async function main() {
  const machinami = await prisma.spot.findUnique({ where: { id: MACHINAMI_SPOT_ID } });
  const saihoji = await prisma.spot.findUnique({ where: { id: SAIHOJI_SPOT_ID } });
  const matsuzakake = await prisma.spot.findUnique({ where: { id: MATSUZAKAKE_SPOT_ID } });
  const taketsuru = await prisma.spot.findUnique({ where: { id: TAKETSURU_SPOT_ID } });
  if (!machinami || !saihoji || !matsuzakake || !taketsuru?.memo) throw new Error("想定と違います");
  if (!taketsuru.memo.includes(TAKETSURU_OLD)) throw new Error("竹鶴酒造の置換対象が見つかりません");

  const dupNames = ["照蓮寺", "竹原市歴史民俗資料館"];
  for (const n of dupNames) {
    const dup = await prisma.placeMaster.findFirst({ where: { name: n } });
    if (dup) throw new Error("台帳が既に存在します(想定外): " + n);
  }

  const newTaketsuruMemo = taketsuru.memo.replace(TAKETSURU_OLD, TAKETSURU_NEW);

  console.log("[確認OK] 説明文を書き直す(道の駅・照蓮寺・資料館を反映)");
  console.log("[確認OK] 竹原町並み保存地区を140分→104分に短縮");
  console.log("[確認OK] 昼食・照蓮寺・竹原市歴史民俗資料館を追加して16:30まで延ばす");
  console.log("[確認OK] 竹鶴酒造の「ください」を直す");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: machinami.placeMasterId! } }))!.prefectureAreaId;

  const saihojiLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: SAIHOJI_SPOT_ID } });
  const matsuzakakeLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: MATSUZAKAKE_SPOT_ID } });
  const taketsuruLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: TAKETSURU_SPOT_ID } });
  if (!saihojiLeg || !matsuzakakeLeg || !taketsuruLeg) throw new Error("移動データが見つかりません");

  // 西方寺・旧松阪家住宅・竹鶴酒造をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: SAIHOJI_SPOT_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: MATSUZAKAKE_SPOT_ID }, data: { orderNo: 94 } });
  await prisma.spot.update({ where: { id: TAKETSURU_SPOT_ID }, data: { orderNo: 95 } });

  // 竹原町並み保存地区: orderNo2(変更なし)、104分滞在
  await prisma.spot.update({ where: { id: MACHINAMI_SPOT_ID }, data: { stayDurationMin: 104 } });

  // 竹原町並み保存地区（昼食）: orderNo3、町並み(10:08+104=11:52)から3分で11:55着、55分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "竹原町並み保存地区（昼食用）", address: "広島県竹原市本町", lat: Number(machinami.lat), lng: Number(machinami.lng),
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 3, name: "竹原町並み保存地区（昼食）",
      address: "広島県竹原市本町", lat: Number(machinami.lat), lng: Number(machinami.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 55)), memo: LUNCH_MEMO, stayDurationMin: 55,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 3 } });

  // 照蓮寺: orderNo4、昼食(11:55+55=12:50)から6分で12:56着、30分滞在
  const shorenjiPlace = await prisma.placeMaster.create({
    data: {
      name: "照蓮寺", address: "広島県竹原市本町三丁目", lat: 34.3487191, lng: 132.9097358,
      prefectureAreaId, category: "temple", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const shorenjiSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: shorenjiPlace.id, orderNo: 4, name: "照蓮寺",
      address: "広島県竹原市本町三丁目", lat: 34.3487191, lng: 132.9097358,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 56)), memo: SHORENJI_MEMO, stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: shorenjiSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 6 } });

  // 竹原市歴史民俗資料館: orderNo5、照蓮寺(12:56+30=13:26)から2分で13:28着、60分滞在
  const shiryokanPlace = await prisma.placeMaster.create({
    data: {
      name: "竹原市歴史民俗資料館", address: "広島県竹原市本町三丁目11-16", lat: 34.347532, lng: 132.910081,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const shiryokanSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: shiryokanPlace.id, orderNo: 5, name: "竹原市歴史民俗資料館",
      address: "広島県竹原市本町三丁目11-16", lat: 34.347532, lng: 132.910081,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 28)), memo: SHIRYOKAN_MEMO, stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: shiryokanSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 2 } });

  // 西方寺・普明閣: orderNo6、資料館(13:28+60=14:28)から2分で14:30着、45分滞在(変更なし)
  await prisma.spot.update({ where: { id: SAIHOJI_SPOT_ID }, data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 30)) } });
  await prisma.spotTransitLeg.update({ where: { id: saihojiLeg.id }, data: { transitDurationMin: 2 } });

  // 旧松阪家住宅: orderNo7、西方寺(14:30+45=15:15)から2分で15:17着、50分滞在(変更なし)
  await prisma.spot.update({ where: { id: MATSUZAKAKE_SPOT_ID }, data: { orderNo: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 17)) } });
  await prisma.spotTransitLeg.update({ where: { id: matsuzakakeLeg.id }, data: { transitDurationMin: 2 } });

  // 竹鶴酒造(外観): orderNo8、旧松阪家住宅(15:17+50=16:07)から3分で16:10着、20分滞在(16:30終了、変更なし)
  await prisma.spot.update({ where: { id: TAKETSURU_SPOT_ID }, data: { orderNo: 8, visitTime: new Date(Date.UTC(1970, 0, 1, 16, 10)), memo: newTaketsuruMemo } });
  await prisma.spotTransitLeg.update({ where: { id: taketsuruLeg.id }, data: { transitDurationMin: 3 } });

  console.log("  COMMITTED: #33 竹原(09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
