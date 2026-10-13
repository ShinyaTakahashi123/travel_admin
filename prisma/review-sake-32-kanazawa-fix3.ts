/**
 * #32の直し(企画運営の指摘、2026-10-13)。
 * 1. 長町武家屋敷跡100分(外観のみ)は長すぎるため45分に短縮し、中を見学できる
 *    野村家(加賀藩士の屋敷跡、千二百石。公式サイトnomurake.comで確認できた
 *    範囲[屋敷の格・庭園の構成]で記述。代数・ミシュランの評価は観光サイトでしか
 *    確認できず書かない)を追加
 * 2. 主計町茶屋街の「全国で初めて旧町名として復活したことでも知られています」を
 *    同じ文の中でぼかす
 * 3. 主計町茶屋街→福光屋だけバスのため、終わりにバスの乗り方の一文を追加
 * 4. 1の結果、合計が16:30にほぼ合ったため福光屋の短縮はせず、端数（103分）で
 *    16:30ちょうどに収めた
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "sake32-kanazawa-2";

const DAY_ID = "c0b3de48-a090-407f-b4b6-c86a530667b7";
const NAGAMACHI_SPOT_ID = "9cbc48c5-4aa6-481c-8281-959fa4d66282";
const KAZUEMACHI_SPOT_ID = "13594a40-ac48-4456-a93f-c8eb18f357cd";
const FUKUMITSUYA_SPOT_ID = "75091978-2ff3-4125-a441-34b96d14da8a";

const NOMURA_MEMO =
  "加賀藩士・野村家の屋敷跡です。野村家は加賀藩から千二百石を領する家柄でした。庭園には大野庄用水の水が引き込まれ、曲水や石灯籠、古木が武家屋敷らしい趣を伝えています。";

const KAZUEMACHI_OLD_HISTORY = "「主計町」という町名は、いったん失われたのち、平成11年(1999)に全国で初めて旧町名として復活したことでも知られています。";
const KAZUEMACHI_NEW_HISTORY = "「主計町」という町名は、いったん失われたのち、平成11年(1999)に、全国で初めて旧町名が復活した例とされています。";
const KAZUEMACHI_BUS_NOTE = "ここからは、バスで福光屋へ向かいます(約20分)。";

async function main() {
  const nagamachi = await prisma.spot.findUnique({ where: { id: NAGAMACHI_SPOT_ID } });
  const kazuemachi = await prisma.spot.findUnique({ where: { id: KAZUEMACHI_SPOT_ID } });
  const fukumitsuya = await prisma.spot.findUnique({ where: { id: FUKUMITSUYA_SPOT_ID } });
  const oyama = await prisma.spot.findFirst({ where: { name: "尾山神社", dayId: DAY_ID } });
  const lunch = await prisma.spot.findFirst({ where: { name: "近江町市場（昼食）", dayId: DAY_ID } });
  if (!nagamachi || !kazuemachi?.memo || !fukumitsuya || !oyama || !lunch) throw new Error("想定と違います");
  if (!kazuemachi.memo.includes(KAZUEMACHI_OLD_HISTORY)) throw new Error("主計町茶屋街の置換対象が見つかりません");

  const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: "野村家" } } });
  if (dup) throw new Error("台帳が既に存在します(想定外): 野村家");

  const newKazuemachiMemo = kazuemachi.memo.replace(KAZUEMACHI_OLD_HISTORY, KAZUEMACHI_NEW_HISTORY) + KAZUEMACHI_BUS_NOTE;

  console.log("[確認OK] 長町武家屋敷跡を100分→45分に短縮し、野村家を追加");
  console.log("[確認OK] 主計町茶屋街の「全国初」をぼかし、バスの一文を追加");
  console.log("新主計町茶屋街メモ:", newKazuemachiMemo);

  const nomuraPhoto = await uploadCommonsFile("Nomura house in Kanazawa - Flickr - odako1 (1).jpg", "野村家", BLOB_PREFIX);
  console.log("野村家の写真:", nomuraPhoto ? nomuraPhoto.url : "(取得できず、写真なしで進める)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: nagamachi.placeMasterId! } }))!.prefectureAreaId;

  const oyamaLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: oyama.id } });
  const fukumitsuyaLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: FUKUMITSUYA_SPOT_ID } });
  if (!oyamaLeg || !fukumitsuyaLeg) throw new Error("移動データが見つかりません");

  await prisma.spot.update({ where: { id: KAZUEMACHI_SPOT_ID }, data: { memo: newKazuemachiMemo } });

  // 尾山神社以降をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: oyama.id }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: lunch.id }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: KAZUEMACHI_SPOT_ID }, data: { orderNo: 94 } });
  await prisma.spot.update({ where: { id: FUKUMITSUYA_SPOT_ID }, data: { orderNo: 95 } });

  // 長町武家屋敷跡: orderNo1、09:30開始、45分滞在
  await prisma.spot.update({ where: { id: NAGAMACHI_SPOT_ID }, data: { stayDurationMin: 45 } });

  // 野村家: orderNo2、長町武家屋敷跡(9:30+45=10:15)から2分で10:17着、40分滞在
  const nomuraPlace = await prisma.placeMaster.create({
    data: {
      name: "野村家", address: "石川県金沢市長町1-3-32", lat: 36.564266, lng: 136.650269,
      prefectureAreaId, category: "landmark", isWideArea: false, isMemorial: false,
      photoUrl: nomuraPhoto?.url ?? null, photoAuthor: nomuraPhoto?.credit.author ?? null,
      photoLicense: nomuraPhoto?.credit.license ?? null, photoLicenseUrl: nomuraPhoto?.credit.licenseUrl ?? null,
      photoSourceUrl: nomuraPhoto?.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const nomuraSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: nomuraPlace.id, orderNo: 2, name: "野村家",
      address: "石川県金沢市長町1-3-32", lat: 36.564266, lng: 136.650269,
      visitTime: new Date(Date.UTC(1970, 0, 1, 10, 17)), memo: NOMURA_MEMO, stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: nomuraSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 2 } });
  if (nomuraPhoto) {
    await prisma.photo.create({
      data: {
        spotId: nomuraSpot.id, url: nomuraPhoto.url, caption: "野村家",
        sourceUrl: nomuraPhoto.credit.sourceUrl ?? null, author: nomuraPhoto.credit.author ?? null,
        license: nomuraPhoto.credit.license ?? null, licenseUrl: nomuraPhoto.credit.licenseUrl ?? null,
      },
    });
  }

  // 尾山神社: orderNo3、野村家(10:17+40=10:57)から7分で11:04着、45分滞在(変更なし)
  await prisma.spot.update({ where: { id: oyama.id }, data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 4)) } });
  await prisma.spotTransitLeg.update({ where: { id: oyamaLeg.id }, data: { transitDurationMin: 7 } });

  // 近江町市場（昼食）: orderNo4、尾山神社(11:04+45=11:49)から9分で11:58着、65分滞在(変更なし)
  await prisma.spot.update({ where: { id: lunch.id }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 58)) } });

  // 主計町茶屋街: orderNo5、昼食(11:58+65=13:03)から9分で13:12着、75分滞在(変更なし)
  await prisma.spot.update({ where: { id: KAZUEMACHI_SPOT_ID }, data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 12)) } });

  // 福光屋: orderNo6、主計町茶屋街(13:12+75=14:27)からバス20分で14:47着、103分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: FUKUMITSUYA_SPOT_ID },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 47)), stayDurationMin: 103 },
  });

  console.log("  COMMITTED: 酒蔵めぐり#32 組み直し完了(09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
