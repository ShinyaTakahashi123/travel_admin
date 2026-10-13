/**
 * 承認待ちしおりの見直し・酒蔵めぐり#31(6ef3e7a8、肥前浜宿酒蔵通りと肥前屋、鹿島)。
 * 既存4か所(肥前浜宿酒蔵通り130分・旧乗田家住宅35分・肥前屋55分・HAMA BAR40分、
 * 09:30開始)は4か所以上を満たすが14:08終了。肥前浜宿酒蔵通りは昼食を含む町歩きの
 * ため130分は時間埋めと判断せず維持。空いた時間に2か所を追加。
 *
 * - 泰智寺: 肥前浜宿の酒蔵通り沿いにある寺院(神奈川大学建築学研究室の町並み
 *   資料に掲載を確認)。詳しい由緒は確認できなかったため、外観を眺める程度の
 *   控えめな記述にとどめた
 * - 浜庄津町浜金屋町の町並み: 酒蔵通り(浜中町八本木宿)とは浜川を挟んで対岸にある
 *   もう一つの重要伝統的建造物群保存地区。平成18年(2006)7月5日、酒蔵通りと
 *   同日に選定(文化庁オンラインで確認)。茅葺き町家と桟瓦葺き町家が混在する
 *   港町・在郷町の町並み
 *
 * 富久千代酒造(「鍋島」の蔵元)も検討したが、通常の見学・直売の受け入れ状況が
 * 確認できなかった(「鹿島酒蔵ツーリズム」という期間限定イベントの情報のみ)ため
 * 見送った。若宮神社も住所・由緒が確認できず見送った。
 *
 * 【未解決】肥前浜宿酒蔵通りと旧乗田家住宅の座標が完全に同じ値(33.088047,
 * 130.119476)だった。旧乗田家住宅の正確な番地が見つからず、OSM/Overpassも
 * 現在利用できなかったため、このスクリプトでは直せていない。企画運営に報告する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "6ef3e7a8-2b31-498d-9023-a6fb7c7072da";
const DAY_ID = "d91dfab4-7d06-4e8a-a675-9d09e6ccfbf5";
const NOTTA_SPOT_ID = "4750404f-3dd2-4eba-bd1c-166949ae8ad3";
const HIZENYA_SPOT_ID = "5b0e906f-1622-4404-b899-c83280e1fe1a";
const HAMABAR_SPOT_ID = "27786a13-7105-4742-824c-9e56052415c2";

const NEW_DESCRIPTION =
  "国の重要伝統的建造物群保存地区、肥前浜宿の酒蔵通りと旧乗田家住宅、対岸の浜庄津町浜金屋町の町並みから、観光酒蔵の肥前屋、昭和5年(1930)築の木造駅舎を生かした肥前浜駅のHAMA BARまで、徒歩でめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

const NOTTA_OLD = "入館料や開館時間は変わることがあるので、公式の案内で確かめてください。";
const NOTTA_NEW = "開館時間は変わることがあるので、公式の案内で確かめましょう。";

const TAICHIJI_MEMO =
  "肥前浜宿の酒蔵通り沿いにある寺院です。白壁の町並みの中、静かなたたずまいの境内を眺めることができます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const HAMAKANAYA_MEMO =
  "肥前浜宿のもう一つの重要伝統的建造物群保存地区で、酒蔵通り(浜中町八本木宿)とは浜川を挟んで向かい合っています。平成18年(2006)、酒蔵通りと同じ日に選定されました。河港を背景に発展した町で、茅葺きの町家と桟瓦葺きの町家が入り混じる、昔ながらの町並みが残っています。今も人が暮らす町並みですので、家の敷地に入らず、静かに散策しましょう。";

const HAMABAR_OLD = "営業日や営業時間が限られることがあるので、お出かけ前に公式の案内で確かめてください。今日一日の締めくくりに、車を運転する方は試飲をひかえ、そのまま列車で帰路につきましょう。";
const HAMABAR_NEW = "営業日や営業時間が限られることがあるので、お出かけ前に公式の案内で確かめましょう。車を運転する方は試飲をひかえ、列車で帰路につきましょう。";

async function main() {
  const notta = await prisma.spot.findUnique({ where: { id: NOTTA_SPOT_ID } });
  const hizenya = await prisma.spot.findUnique({ where: { id: HIZENYA_SPOT_ID } });
  const hamabar = await prisma.spot.findUnique({ where: { id: HAMABAR_SPOT_ID } });
  if (!notta?.memo || !hizenya || !hamabar?.memo) throw new Error("想定と違います");
  if (!notta.memo.includes(NOTTA_OLD)) throw new Error("旧乗田家住宅の置換対象が見つかりません");
  if (!hamabar.memo.includes(HAMABAR_OLD)) throw new Error("HAMA BARの置換対象が見つかりません");

  const dupNames = ["泰智寺", "浜庄津町浜金屋町"];
  for (const n of dupNames) {
    const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: n } } });
    if (dup) throw new Error("台帳が既に存在します(想定外): " + n);
  }

  const newNottaMemo = notta.memo.replace(NOTTA_OLD, NOTTA_NEW);
  const newHamabarMemo = hamabar.memo.replace(HAMABAR_OLD, HAMABAR_NEW);

  console.log("[確認OK] 説明文を直す(お金の話・「ください」を削除、浜金屋町を追加)");
  console.log("[確認OK] 旧乗田家住宅の「ください」を直す");
  console.log("[確認OK] 泰智寺・浜庄津町浜金屋町の町並みを追加して16:30まで延ばす");
  console.log("[確認OK] HAMA BARの「ください」・案内口調を直す");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: NOTTA_SPOT_ID }, data: { memo: newNottaMemo } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: hizenya.placeMasterId! } }))!.prefectureAreaId;

  const hizenyaLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: HIZENYA_SPOT_ID } });
  const hamabarLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: HAMABAR_SPOT_ID } });
  if (!hizenyaLeg || !hamabarLeg) throw new Error("移動データが見つかりません");

  // 肥前屋・HAMA BARをいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: HIZENYA_SPOT_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: HAMABAR_SPOT_ID }, data: { orderNo: 94 } });

  // 泰智寺: orderNo3、旧乗田家住宅(11:45+35=12:20)から5分で12:25着、45分滞在
  const taichijiPlace = await prisma.placeMaster.create({
    data: {
      name: "泰智寺", address: "佐賀県鹿島市浜町", lat: 33.0903955, lng: 130.1172295,
      prefectureAreaId, category: "temple", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const taichijiSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: taichijiPlace.id, orderNo: 3, name: "泰智寺",
      address: "佐賀県鹿島市浜町", lat: 33.0903955, lng: 130.1172295,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 25)), memo: TAICHIJI_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: taichijiSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });

  // 観光酒蔵 肥前屋: orderNo4、泰智寺(12:25+45=13:10)から3分で13:13着、55分滞在(変更なし)
  await prisma.spot.update({ where: { id: HIZENYA_SPOT_ID }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 13)) } });
  await prisma.spotTransitLeg.update({ where: { id: hizenyaLeg.id }, data: { transitDurationMin: 3 } });

  // 浜庄津町浜金屋町の町並み: orderNo5、肥前屋(13:13+55=14:08)から5分で14:13着、70分滞在
  const hamakanayaPlace = await prisma.placeMaster.create({
    data: {
      name: "浜庄津町浜金屋町の町並み", address: "佐賀県鹿島市浜町乙", lat: 33.093681, lng: 130.120926,
      prefectureAreaId, category: "townscape", isWideArea: true, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const hamakanayaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: hamakanayaPlace.id, orderNo: 5, name: "浜庄津町浜金屋町の町並み",
      address: "佐賀県鹿島市浜町乙", lat: 33.093681, lng: 130.120926,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 13)), memo: HAMAKANAYA_MEMO, stayDurationMin: 70,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: hamakanayaSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });

  // HAMA BAR(肥前浜駅): orderNo6、浜金屋町(14:13+70=15:23)から5分で15:28着、62分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: HAMABAR_SPOT_ID },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 28)), stayDurationMin: 62, memo: newHamabarMemo },
  });
  await prisma.spotTransitLeg.update({ where: { id: hamabarLeg.id }, data: { transitDurationMin: 5 } });

  console.log("  COMMITTED: 酒蔵めぐり#31 肥前浜宿(09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
