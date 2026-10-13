/**
 * #28の直し(企画運営の指摘、2026-10-13)。
 * 1. 昼食がなかったため「西条駅周辺（昼食）」を11:30〜13:30の間に追加
 * 2. 白牡丹75分・賀茂鶴75分・福美人90分・賀茂泉120分は時間を埋める滞在だったため
 *    30〜50分ほどに短縮し、空いた時間に確かめられる行き先を2か所追加
 *    - 東広島市立美術館(公式hhmoa.jp、西条栄町9-1、9:00〜17:00・月曜休館を確認。
 *      料金は書かない)
 *    - 安芸国分寺歴史公園(国の史跡。塔跡は昭和11年、寺域の大半は昭和51年に指定
 *      [文化庁 online.bunka.go.jp で確認]。令和4年に出土品が重要文化財に指定
 *      [文化庁発表で確認]。開園時間の確認できる公式ページが見当たらず、本文には
 *      時刻を書かない)
 *    亀齢酒造・西條鶴醸造(前回調査済み)・山陽鶴酒造(営業時間の情報が食い違い、
 *    公式サイトが見当たらず)は見学の受け入れ状況を確かめられず見送った
 * 3. 福美人酒造の「恵比寿庫は見学ができるとされ」(公式で確かめられない)を削除
 * 4. 賀茂鶴酒造の冒頭「明治6年(1873)、酒銘を「賀茂鶴」と命名しました。」の主語の
 *    抜けを修正
 *
 * 並び順: 御建神社→美術館→白牡丹→賀茂鶴→昼食→福美人→賀茂泉→安芸国分寺歴史公園
 * (美術館・国分寺公園は西条駅の南北にあり、酒蔵通りをまっすぐ歩く既存の順と
 * つながるよう、美術館を先頭寄りに、国分寺公園を最後に置いた)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "sake28-saijo-2";

const ITIN_ID = "5429383d-560c-47c2-9413-4188ed09c34e";
const DAY_ID = "8f9cdfb6-481b-4419-8bd9-3a6b433970db";

const NEW_DESCRIPTION =
  "JR西条駅から徒歩1km圏内に7つの蔵元が集まる、東広島市西条の酒蔵通り。白壁の建物や赤れんがの煙突が並ぶ町並みを歩きながら、白牡丹・賀茂鶴・福美人・賀茂泉の蔵元、酒造りの神様を祀る御建神社、東広島市立美術館、安芸国分寺歴史公園をめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

const MUSEUM_MEMO =
  "「暮らしとともにあるアート」をテーマにした、東広島市立の美術館です。版画や現代の陶芸作品、地域にゆかりのある作品などを収集しており、2階・3階の展示室で見ることができます。建物の前の西条中央公園にも、彫刻作品が置かれています。";

const LUNCH_MEMO = "JR西条駅の周辺には、食事ができるお店が集まっています。ここで昼食をとりましょう。";

const FUKUBIJIN_MEMO_NEW =
  "西条酒蔵通りにある酒蔵で、大黒庫・恵比寿庫の2つの蔵があります。現在も酒造りが行われているのは大黒庫で、赤れんがの煙突が目印になっています。直売所では、日本酒の試飲や購入ができます。車を運転する方は試飲をひかえましょう。";

const KOKUBUNJI_MEMO =
  "奈良時代、聖武天皇の詔により全国に建てられた国分寺の一つ、安芸国分寺の寺域を史跡公園として整備したところです。昭和11年(1936)に塔跡が、昭和51年(1976)には寺域の大半が、国の史跡に指定されました。令和4年(2022)には、発掘で見つかった奈良時代の道具類が国の重要文化財に指定されています。境内には、今も法灯を伝える寺があり、文化財に指定された建物も残ります。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const shirabotan = await prisma.spot.findFirst({ where: { dayId: DAY_ID, name: "白牡丹酒造" } });
  const kamotsuru = await prisma.spot.findFirst({ where: { dayId: DAY_ID, name: "賀茂鶴酒造" } });
  const fukubijin = await prisma.spot.findFirst({ where: { dayId: DAY_ID, name: "福美人酒造" } });
  const kamoizumi = await prisma.spot.findFirst({ where: { dayId: DAY_ID, name: "賀茂泉酒造「酒泉館」" } });
  if (!shirabotan || !kamotsuru?.memo || !fukubijin?.memo || !kamoizumi) throw new Error("想定と違います");

  const newKamotsuruMemo = kamotsuru.memo.replace(
    "明治6年(1873)、酒銘を「賀茂鶴」と命名しました。",
    "明治6年(1873)に酒銘を「賀茂鶴」と名付けた蔵元です。"
  );
  if (newKamotsuruMemo === kamotsuru.memo) throw new Error("賀茂鶴の置換対象が見つかりません");
  if (fukubijin.memo === FUKUBIJIN_MEMO_NEW) throw new Error("福美人のメモが想定外に一致");

  const dupNames = ["東広島市立美術館", "安芸国分寺"];
  for (const n of dupNames) {
    const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: n } } });
    if (dup) throw new Error("台帳が既に存在します(想定外): " + n);
  }

  console.log("[確認OK] 説明文に美術館・国分寺公園を追加");
  console.log("[確認OK] 昼食(西条駅周辺)を追加");
  console.log("[確認OK] 東広島市立美術館・安芸国分寺歴史公園を追加し各滞在を短縮");
  console.log("[確認OK] 福美人酒造の未確認の記述を削除");
  console.log("[確認OK] 賀茂鶴酒造の冒頭の主語を修正");

  const museumPhoto = await uploadCommonsFile("Higashihiroshima City Museum of Art 2024.jpg", "東広島市立美術館", BLOB_PREFIX);
  console.log("美術館の写真:", museumPhoto ? museumPhoto.url : "(取得できず、写真なしで進める)");

  const kokubunjiPhoto = await uploadCommonsFile("Aki Kokubunji-ato, gaikan-1.jpg", "安芸国分寺歴史公園", BLOB_PREFIX);
  console.log("国分寺公園の写真:", kokubunjiPhoto ? kokubunjiPhoto.url : "(取得できず、写真なしで進める)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: kamotsuru.placeMasterId! } }))!.prefectureAreaId;

  // 既存4スポットをいったん退避(orderNoの衝突を避ける)
  const shirabotanLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: shirabotan.id } });
  const kamotsuruLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: kamotsuru.id } });
  const fukubijinLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: fukubijin.id } });
  const kamoizumiLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: kamoizumi.id } });
  if (!shirabotanLeg || !kamotsuruLeg || !fukubijinLeg || !kamoizumiLeg) throw new Error("移動データが見つかりません");

  await prisma.spot.update({ where: { id: shirabotan.id }, data: { orderNo: 91 } });
  await prisma.spot.update({ where: { id: kamotsuru.id }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: fukubijin.id }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: kamoizumi.id }, data: { orderNo: 94 } });

  // 東広島市立美術館: orderNo2、御建神社(9:30+45=10:15)から5分で10:20着、65分滞在
  const museumPlace = await prisma.placeMaster.create({
    data: {
      name: "東広島市立美術館", address: "広島県東広島市西条栄町9-1", lat: 34.426979, lng: 132.742584,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      photoUrl: museumPhoto?.url ?? null, photoAuthor: museumPhoto?.credit.author ?? null,
      photoLicense: museumPhoto?.credit.license ?? null, photoLicenseUrl: museumPhoto?.credit.licenseUrl ?? null,
      photoSourceUrl: museumPhoto?.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const museumSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: museumPlace.id, orderNo: 2, name: "東広島市立美術館",
      address: "広島県東広島市西条栄町9-1", lat: 34.426979, lng: 132.742584,
      visitTime: new Date(Date.UTC(1970, 0, 1, 10, 20)), memo: MUSEUM_MEMO, stayDurationMin: 65,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: museumSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });
  if (museumPhoto) {
    await prisma.photo.create({
      data: {
        spotId: museumSpot.id, url: museumPhoto.url, caption: "東広島市立美術館",
        sourceUrl: museumPhoto.credit.sourceUrl ?? null, author: museumPhoto.credit.author ?? null,
        license: museumPhoto.credit.license ?? null, licenseUrl: museumPhoto.credit.licenseUrl ?? null,
      },
    });
  }

  // 白牡丹酒造: orderNo3、美術館(10:20+65=11:25)から5分で11:30着、40分滞在
  await prisma.spot.update({ where: { id: shirabotan.id }, data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 30)), stayDurationMin: 40 } });
  await prisma.spotTransitLeg.update({ where: { id: shirabotanLeg.id }, data: { transitDurationMin: 5 } });

  // 賀茂鶴酒造: orderNo4、白牡丹(11:30+40=12:10)から5分で12:15着、40分滞在
  await prisma.spot.update({ where: { id: kamotsuru.id }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 15)), stayDurationMin: 40, memo: newKamotsuruMemo } });
  await prisma.spotTransitLeg.update({ where: { id: kamotsuruLeg.id }, data: { transitDurationMin: 5 } });

  // 西条駅周辺（昼食）: orderNo5、賀茂鶴(12:15+40=12:55)から3分で12:58着、30分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "西条駅周辺", address: "広島県東広島市西条本町", lat: 34.4306213, lng: 132.7433314,
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 5, name: "西条駅周辺（昼食）",
      address: "広島県東広島市西条本町", lat: 34.4306213, lng: 132.7433314,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 58)), memo: LUNCH_MEMO, stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 3 } });

  // 福美人酒造: orderNo6、昼食(12:58+30=13:28)から5分で13:33着、35分滞在
  await prisma.spot.update({ where: { id: fukubijin.id }, data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 33)), stayDurationMin: 35, memo: FUKUBIJIN_MEMO_NEW } });
  await prisma.spotTransitLeg.update({ where: { id: fukubijinLeg.id }, data: { transitDurationMin: 5 } });

  // 賀茂泉酒造「酒泉館」: orderNo7、福美人(13:33+35=14:08)から5分で14:13着、55分滞在
  await prisma.spot.update({ where: { id: kamoizumi.id }, data: { orderNo: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 13)), stayDurationMin: 55 } });
  await prisma.spotTransitLeg.update({ where: { id: kamoizumiLeg.id }, data: { transitDurationMin: 5 } });

  // 安芸国分寺歴史公園: orderNo8、賀茂泉(14:13+55=15:08)から12分で15:20着、70分滞在(16:30終了)
  const kokubunjiPlace = await prisma.placeMaster.create({
    data: {
      name: "安芸国分寺歴史公園", address: "広島県東広島市西条町吉行2064", lat: 34.4345292, lng: 132.749088,
      prefectureAreaId, category: "park", isWideArea: false, isMemorial: false,
      photoUrl: kokubunjiPhoto?.url ?? null, photoAuthor: kokubunjiPhoto?.credit.author ?? null,
      photoLicense: kokubunjiPhoto?.credit.license ?? null, photoLicenseUrl: kokubunjiPhoto?.credit.licenseUrl ?? null,
      photoSourceUrl: kokubunjiPhoto?.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const kokubunjiSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: kokubunjiPlace.id, orderNo: 8, name: "安芸国分寺歴史公園",
      address: "広島県東広島市西条町吉行2064", lat: 34.4345292, lng: 132.749088,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 20)), memo: KOKUBUNJI_MEMO, stayDurationMin: 70,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kokubunjiSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 12 } });
  if (kokubunjiPhoto) {
    await prisma.photo.create({
      data: {
        spotId: kokubunjiSpot.id, url: kokubunjiPhoto.url, caption: "安芸国分寺歴史公園",
        sourceUrl: kokubunjiPhoto.credit.sourceUrl ?? null, author: kokubunjiPhoto.credit.author ?? null,
        license: kokubunjiPhoto.credit.license ?? null, licenseUrl: kokubunjiPhoto.credit.licenseUrl ?? null,
      },
    });
  }

  console.log("  COMMITTED: 酒蔵めぐり#28 組み直し完了(御建神社→美術館→白牡丹→賀茂鶴→昼食→福美人→賀茂泉→国分寺公園、09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
