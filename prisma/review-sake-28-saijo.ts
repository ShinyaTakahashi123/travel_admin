/**
 * 承認待ちしおりの見直し・酒蔵めぐり#28(5429383d、東広島・西条酒蔵通り)。
 * 既に4か所・9:30開始があり決まりは満たしていた(ただし14:57で終了)。福美人酒造
 * (西条酒蔵通り7蔵の一つ、賀茂鶴と賀茂泉の間に実在)を追加して16:30以降まで
 * 延ばす。亀齢酒造・西條鶴醸造も候補として調べたが、通常の見学・試飲の受け入れ
 * 状況が公式・観光情報のいずれでも確認できなかったため見送った。
 *
 * - 福美人酒造: 東広島市西条本町6-21。大黒庫・恵比寿庫の2つの蔵があり、恵比寿庫は
 *   見学可能とされる(複数の観光情報サイトで確認。公式サイトは文字化けのため
 *   詳細を読み取れず)
 * - 賀茂泉酒造「酒泉館」の最後の文「今日一日の締めくくりに、車を運転する方は
 *   試飲をひかえ、そのまま」は、案内口調・車の話(説明文に既出)のため削除
 *   (#27で指摘された形と同じ直し)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "sake28-saijo";

const DAY_ID = "8f9cdfb6-481b-4419-8bd9-3a6b433970db";
const KAMOTSURU_SPOT_ID = "de07407b-0ac5-45bf-ace8-7ee491bdcd0e";
const KAMOIZUMI_SPOT_ID = "8f50c4c4-70d3-439b-b668-a0a9b9780d04";

const FUKUBIJIN_MEMO =
  "西条酒蔵通りにある酒蔵で、大黒庫・恵比寿庫の2つの蔵があります。現在も酒造りが行われているのは大黒庫ですが、もう一方の恵比寿庫は見学ができるとされ、赤れんがの煙突も目印になっています。直売所では、日本酒の試飲や購入ができます。車を運転する方は試飲をひかえましょう。";

async function main() {
  const kamotsuru = await prisma.spot.findUnique({ where: { id: KAMOTSURU_SPOT_ID } });
  const kamoizumi = await prisma.spot.findUnique({ where: { id: KAMOIZUMI_SPOT_ID } });
  if (!kamotsuru || !kamoizumi?.memo) throw new Error("想定と違います");

  const newKamoizumiMemo = kamoizumi.memo.replace(
    "今日一日の締めくくりに、車を運転する方は試飲をひかえ、そのままJR西条駅から帰路につきましょう。",
    "JR西条駅から帰路につきましょう。"
  );
  if (newKamoizumiMemo === kamoizumi.memo) throw new Error("置換対象が見つかりません");

  const fukubijinDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "福美人" } } });
  if (fukubijinDup) throw new Error("台帳が既に存在します(想定外)");

  console.log("[確認OK] 福美人酒造を追加して16:30以降まで延ばす");
  console.log("[確認OK] 賀茂泉酒造「酒泉館」の最後の文を直す(案内口調・車の話を削除)");

  const fukubijinPhoto = await uploadCommonsFile("福美人酒造.jpg", "福美人酒造", BLOB_PREFIX);
  if (!fukubijinPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(福美人酒造)");
  console.log("取得:", fukubijinPhoto.url, fukubijinPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: kamotsuru.placeMasterId! } }))!.prefectureAreaId;

  // 賀茂泉をいったん退避(orderNoの衝突を避ける)
  const kamoizumiTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: KAMOIZUMI_SPOT_ID, orderNo: 1 } });
  if (!kamoizumiTransit) throw new Error("賀茂泉の移動データが見つかりません");
  await prisma.spot.update({ where: { id: KAMOIZUMI_SPOT_ID }, data: { orderNo: 90 } });

  // 福美人酒造: orderNo4、賀茂鶴(11:37+75=12:52)から5分で12:57着、90分滞在
  const fukubijinPlace = await prisma.placeMaster.create({
    data: {
      name: "福美人酒造", address: "広島県東広島市西条本町6-21", lat: 34.430393, lng: 132.747864,
      prefectureAreaId, category: "sake_brewery", isWideArea: false, isMemorial: false,
      photoUrl: fukubijinPhoto.url, photoAuthor: fukubijinPhoto.credit.author ?? null,
      photoLicense: fukubijinPhoto.credit.license ?? null, photoLicenseUrl: fukubijinPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: fukubijinPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const fukubijinSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: fukubijinPlace.id, orderNo: 4, name: "福美人酒造",
      address: "広島県東広島市西条本町6-21", lat: 34.430393, lng: 132.747864,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 57)), memo: FUKUBIJIN_MEMO, stayDurationMin: 90,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: fukubijinSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });
  await prisma.photo.create({
    data: {
      spotId: fukubijinSpot.id, url: fukubijinPhoto.url, caption: "福美人酒造",
      sourceUrl: fukubijinPhoto.credit.sourceUrl ?? null, author: fukubijinPhoto.credit.author ?? null,
      license: fukubijinPhoto.credit.license ?? null, licenseUrl: fukubijinPhoto.credit.licenseUrl ?? null,
    },
  });

  // 賀茂泉酒造「酒泉館」: orderNo5、福美人(12:57+90=14:27)から5分で14:32着、120分滞在(既存のまま)
  await prisma.spot.update({
    where: { id: KAMOIZUMI_SPOT_ID },
    data: { orderNo: 5, memo: newKamoizumiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 32)) },
  });
  await prisma.spotTransitLeg.update({ where: { id: kamoizumiTransit.id }, data: { transitDurationMin: 5 } });

  console.log("  COMMITTED: 酒蔵めぐり#28 東広島・西条酒蔵通り");
}
main().finally(() => prisma.$disconnect());
