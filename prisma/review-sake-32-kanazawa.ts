/**
 * 承認待ちしおりの見直し・酒蔵めぐり#32(8347d735、長町武家屋敷跡と福光屋、金沢)。
 * 既存3か所(長町武家屋敷跡100分・主計町茶屋街75分・福光屋65分、09:30開始)は
 * 4か所未満・14:10終了。各滞在は町歩き・酒蔵見学として内容相応と判断し維持。
 *
 * 新スポット候補として兼六園・金沢城公園・近江町市場を検討したが、公開中の
 * 「兼六園と金沢城公園、日本三名園を巡る定番日帰りプラン」(4bb849f5)が既に
 * この2か所をテーマにしており、重なりが大きいため見送った。代わりに:
 * - 尾山神社(台帳に既存。明治6年[1873]創建、神門[明治8年築・国の重要文化財]の
 *   ギヤマン張りなどを観光情報サイトで確認)
 * - 近江町市場(昼食): 既に別のしおり(58dbfab5)のテーマになっているため、
 *   深い説明はせず昼食の案内にとどめた(店名は出さない)
 * を追加。福光屋は最後のスポットのまま、滞在を65→90分に延ばして16:30に収めた。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "sake32-kanazawa";

const ITIN_ID = "8347d735-5bd3-456d-bc73-c0379b50cdaa";
const DAY_ID = "c0b3de48-a090-407f-b4b6-c86a530667b7";
const NAGAMACHI_SPOT_ID = "9cbc48c5-4aa6-481c-8281-959fa4d66282";
const KAZUEMACHI_SPOT_ID = "13594a40-ac48-4456-a93f-c8eb18f357cd";
const FUKUMITSUYA_SPOT_ID = "75091978-2ff3-4125-a441-34b96d14da8a";
const OYAMA_PLACE_ID = "0b45a9cd-3370-4e55-ad6f-680e1dc097d2";

const NEW_DESCRIPTION =
  "加賀藩士の屋敷跡が続く長町武家屋敷跡、藩祖・前田利家を祀る尾山神社、金沢の台所と呼ばれる近江町市場、浅野川沿いの主計町茶屋街から、寛永2年(1625)創業と伝わる、金沢で最も古い蔵元とされる福光屋まで、バスと徒歩でめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

const OYAMA_MEMO =
  "明治6年(1873)、旧加賀藩士たちが、藩祖・前田利家と正室お松の方を祀って建てた神社です。金沢城の金谷出丸跡に建っています。正門にあたる神門は明治8年(1875)の建築で、3層構造の最上階に色ガラスをはめ込んだ和漢洋折衷の造りです。夜には明かりがともり、かつては日本海を行く船の目印にもなったと伝わります。国の重要文化財に指定されています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const LUNCH_MEMO = "金沢の台所と呼ばれる市場で、鮮魚店や青果店など、多くの店が軒を連ねています。ここで昼食をとりましょう。";

const FUKUMITSUYA_OLD_CLOSING = "今日一日の締めくくりに、お気に入りの一本をお土産に選びましょう。";
const FUKUMITSUYA_NEW_CLOSING = "お気に入りの一本をお土産に選びましょう。";

async function main() {
  const nagamachi = await prisma.spot.findUnique({ where: { id: NAGAMACHI_SPOT_ID } });
  const kazuemachi = await prisma.spot.findUnique({ where: { id: KAZUEMACHI_SPOT_ID } });
  const fukumitsuya = await prisma.spot.findUnique({ where: { id: FUKUMITSUYA_SPOT_ID } });
  const oyamaPlace = await prisma.placeMaster.findUnique({ where: { id: OYAMA_PLACE_ID } });
  if (!nagamachi || !kazuemachi || !fukumitsuya?.memo || !oyamaPlace) throw new Error("想定と違います");
  if (!fukumitsuya.memo.includes(FUKUMITSUYA_OLD_CLOSING)) throw new Error("福光屋の置換対象が見つかりません");

  const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: "近江町市場" } }, select: { id: true } });
  if (!dup) throw new Error("近江町市場の台帳が見つかりません(想定外)");

  const newFukumitsuyaMemo = fukumitsuya.memo.replace(FUKUMITSUYA_OLD_CLOSING, FUKUMITSUYA_NEW_CLOSING);

  console.log("[確認OK] 説明文を直す(尾山神社・近江町市場を追加)");
  console.log("[確認OK] 尾山神社(台帳の既存データを再利用)・近江町市場（昼食）を追加して16:30まで延ばす");
  console.log("[確認OK] 福光屋の滞在を65分→90分に延ばし、結びの文を直す");

  const omichoPhoto = await uploadCommonsFile("Kanazawa fish market.jpg", "近江町市場", BLOB_PREFIX);
  console.log("近江町市場の写真:", omichoPhoto ? omichoPhoto.url : "(取得できず、写真なしで進める)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: nagamachi.placeMasterId! } }))!.prefectureAreaId;

  const kazuemachiLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: KAZUEMACHI_SPOT_ID } });
  const fukumitsuyaLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: FUKUMITSUYA_SPOT_ID } });
  if (!kazuemachiLeg || !fukumitsuyaLeg) throw new Error("移動データが見つかりません");

  // 主計町茶屋街・福光屋をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: KAZUEMACHI_SPOT_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: FUKUMITSUYA_SPOT_ID }, data: { orderNo: 94 } });

  // 尾山神社: orderNo2、長町武家屋敷跡(9:30+100=11:10)から7分で11:17着、45分滞在(台帳の既存データを再利用)
  const oyamaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: OYAMA_PLACE_ID, orderNo: 2, name: "尾山神社",
      address: oyamaPlace.address, lat: Number(oyamaPlace.lat), lng: Number(oyamaPlace.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 17)), memo: OYAMA_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: oyamaSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 7 } });
  if (oyamaPlace.photoUrl) {
    await prisma.photo.create({
      data: {
        spotId: oyamaSpot.id, url: oyamaPlace.photoUrl, caption: "尾山神社",
        sourceUrl: oyamaPlace.photoSourceUrl, author: oyamaPlace.photoAuthor,
        license: oyamaPlace.photoLicense, licenseUrl: oyamaPlace.photoLicenseUrl,
      },
    });
  }

  // 近江町市場（昼食）: orderNo3、尾山神社(11:17+45=12:02)から9分で12:11着、65分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "近江町市場（昼食用）", address: "石川県金沢市上近江町50", lat: 36.571866, lng: 136.655778,
      prefectureAreaId, category: "gourmet", isWideArea: false, isMemorial: false,
      photoUrl: omichoPhoto?.url ?? null, photoAuthor: omichoPhoto?.credit.author ?? null,
      photoLicense: omichoPhoto?.credit.license ?? null, photoLicenseUrl: omichoPhoto?.credit.licenseUrl ?? null,
      photoSourceUrl: omichoPhoto?.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 3, name: "近江町市場（昼食）",
      address: "石川県金沢市上近江町50", lat: 36.571866, lng: 136.655778,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 11)), memo: LUNCH_MEMO, stayDurationMin: 65,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 9 } });
  if (omichoPhoto) {
    await prisma.photo.create({
      data: {
        spotId: lunchSpot.id, url: omichoPhoto.url, caption: "近江町市場",
        sourceUrl: omichoPhoto.credit.sourceUrl ?? null, author: omichoPhoto.credit.author ?? null,
        license: omichoPhoto.credit.license ?? null, licenseUrl: omichoPhoto.credit.licenseUrl ?? null,
      },
    });
  }

  // 主計町茶屋街: orderNo4、近江町市場(12:11+65=13:16)から9分で13:25着、75分滞在(変更なし)
  await prisma.spot.update({ where: { id: KAZUEMACHI_SPOT_ID }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 25)) } });
  await prisma.spotTransitLeg.update({ where: { id: kazuemachiLeg.id }, data: { transitDurationMin: 9 } });

  // 福光屋: orderNo5、主計町茶屋街(13:25+75=14:40)からバス20分で15:00着、90分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: FUKUMITSUYA_SPOT_ID },
    data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)), stayDurationMin: 90, memo: newFukumitsuyaMemo },
  });
  await prisma.spotTransitLeg.update({ where: { id: fukumitsuyaLeg.id }, data: { transitDurationMin: 20 } });

  console.log("  COMMITTED: 酒蔵めぐり#32 金沢(09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
