/**
 * 承認待ちしおりの見直し・酒蔵めぐり#29(6eb0ef87、沼垂テラスと今代司酒造、新潟市内)。
 * 既存4か所(沼垂テラス100分・今代司酒造90分・萬代橋35分・ぽんしゅ館40分)は
 * 9:30開始・4か所以上を満たすが14:35終了で、沼垂テラス・今代司酒造の滞在が
 * 時間を埋める長さだった。今代司酒造の見学は観光サイトで約30〜40分(テイス
 * ティング込み)と確認できたため45分に短縮。沼垂テラスは複数の個人店が並ぶ
 * 商店街のため80分は残すが100分からは短縮。
 *
 * 昼食「万代地区（昼食）」を追加(萬代橋のたもとの飲食店街、店名は出さない)。
 * 新スポットとして旧齋藤家別邸(大正7年[1918]建築、庭園は大正6〜9年作庭、
 * 平成27年[2015]に国の名勝指定。新潟市教育委員会のPDF・文化庁online.bunka.go.jp
 * で確認)を追加。新潟市歴史博物館みなとぴあも検討したが、本館が令和8年9月〜
 * 令和9年6月末ごろまで空調工事で長期休館中(公式サイトnchm.jpで確認)のため、
 * 公開予定の2027年1〜2月でも見られない可能性が高く見送った。
 *
 * 既存スポット間の移動時間(今代司酒造→萬代橋20分、萬代橋→ぽんしゅ館10分)も
 * 実際の距離(OSM)と比べて速すぎたため、今回あわせて直す。旧齋藤家別邸は
 * 萬代橋から1.3km(徒歩約17分)、新潟駅までは2.4km以上あるため、新潟駅へは
 * バスを使う(具体的な系統・時刻は確認できていないため本文には書かない)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "6eb0ef87-f3a8-4689-ba24-a2c545d46ccf";

const NEW_DESCRIPTION =
  "かつての青果市場をリノベーションした沼垂テラス商店街から、明和4年(1767)創業と伝わる今代司酒造、信濃川に架かる萬代橋、大正時代の庭園が残る旧齋藤家別邸、新潟駅構内の利き酒処「ぽんしゅ館」まで、徒歩とバスでめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

const LUNCH_MEMO = "萬代橋のたもとに広がる万代地区には、食事ができるお店が数多く集まっています。ここで昼食をとりましょう。";

const SAITO_MEMO =
  "新潟の豪商、齋藤家の四代目・齋藤喜十郎が、大正7年(1918)に別邸として建てたものです。庭園は大正6年(1917)から9年(1920)にかけて、東京の庭師の手で造られました。新潟砂丘の地形を生かした回遊式庭園で、部屋ごとに異なる庭の眺めを楽しめるように設計されています。平成27年(2015)、庭園は国の名勝に指定されました。";

const PONSHUKAN_CLOSING_OLD = "今日一日の締めくくりに、車を運転する方は試飲をひかえ、そのまま新潟駅から帰路につきましょう。";
const PONSHUKAN_CLOSING_NEW = "車を運転する方は試飲をひかえましょう。新潟駅から帰路につきましょう。";

async function main() {
  const numatari = await prisma.spot.findFirst({ where: { name: "沼垂テラス商店街" } });
  const imayotsukasa = await prisma.spot.findFirst({ where: { name: "今代司酒造" } });
  const bandaibashi = await prisma.spot.findFirst({ where: { name: "萬代橋" } });
  const ponshukan = await prisma.spot.findFirst({ where: { name: "ぽんしゅ館 新潟驛店 利き酒番所" } });
  if (!numatari || !imayotsukasa || !bandaibashi || !ponshukan?.memo) throw new Error("想定と違います");

  const dayId = numatari.dayId;
  const newPonshukanMemo = ponshukan.memo.replace(PONSHUKAN_CLOSING_OLD, PONSHUKAN_CLOSING_NEW);
  if (newPonshukanMemo === ponshukan.memo) throw new Error("ぽんしゅ館の置換対象が見つかりません");

  const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: "万代地区" } } });
  if (dup) throw new Error("台帳が既に存在します(想定外): 万代地区");
  const saitoPlaceExisting = await prisma.placeMaster.findFirst({ where: { name: { contains: "齋藤家別邸" } } });
  if (!saitoPlaceExisting) throw new Error("旧齋藤家別邸の台帳が見つかりません(想定外)");

  console.log("[確認OK] 説明文を直す(お金の話・「ください」を削除、旧齋藤家別邸を追加)");
  console.log("[確認OK] 沼垂テラス100分→80分、今代司酒造90分→45分に短縮");
  console.log("[確認OK] 万代地区（昼食）・旧齋藤家別邸(既存の台帳を再利用)を追加して16:30まで延ばす");
  console.log("[確認OK] ぽんしゅ館の結びの文を直す");
  console.log("旧齋藤家別邸の既存の写真を使う:", saitoPlaceExisting.photoUrl);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: numatari.placeMasterId! } }))!.prefectureAreaId;

  const imayotsukasaLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: imayotsukasa.id } });
  const bandaibashiLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: bandaibashi.id } });
  const ponshukanLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: ponshukan.id } });
  if (!imayotsukasaLeg || !bandaibashiLeg || !ponshukanLeg) throw new Error("移動データが見つかりません");

  // 萬代橋・ぽんしゅ館をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: bandaibashi.id }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: ponshukan.id }, data: { orderNo: 94 } });

  // 沼垂テラス商店街: orderNo1、9:30開始、80分滞在(変更なし)
  await prisma.spot.update({ where: { id: numatari.id }, data: { stayDurationMin: 80 } });

  // 今代司酒造: orderNo2、沼垂テラス(9:30+80=10:50)から7分で10:57着、45分滞在
  await prisma.spot.update({ where: { id: imayotsukasa.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 57)), stayDurationMin: 45 } });
  await prisma.spotTransitLeg.update({ where: { id: imayotsukasaLeg.id }, data: { transitDurationMin: 7 } });

  // 万代地区（昼食）: orderNo3、今代司酒造(10:57+45=11:42)から20分で12:02着、60分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "万代地区", address: "新潟県新潟市中央区万代", lat: 37.9159203, lng: 139.0546439,
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId, placeMasterId: lunchPlace.id, orderNo: 3, name: "万代地区（昼食）",
      address: "新潟県新潟市中央区万代", lat: 37.9159203, lng: 139.0546439,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 2)), memo: LUNCH_MEMO, stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 20 } });

  // 萬代橋: orderNo4、万代地区(12:02+60=13:02)から6分で13:08着、35分滞在(変更なし)
  await prisma.spot.update({ where: { id: bandaibashi.id }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 8)) } });
  await prisma.spotTransitLeg.update({ where: { id: bandaibashiLeg.id }, data: { transitDurationMin: 6 } });

  // 旧齋藤家別邸: orderNo5、萬代橋(13:08+35=13:43)から17分で14:00着、80分滞在(既存の台帳を再利用)
  const saitoSpot = await prisma.spot.create({
    data: {
      dayId, placeMasterId: saitoPlaceExisting.id, orderNo: 5, name: "旧齋藤家別邸",
      address: saitoPlaceExisting.address, lat: Number(saitoPlaceExisting.lat), lng: Number(saitoPlaceExisting.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 0)), memo: SAITO_MEMO, stayDurationMin: 80,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: saitoSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 17 } });
  if (saitoPlaceExisting.photoUrl) {
    await prisma.photo.create({
      data: {
        spotId: saitoSpot.id, url: saitoPlaceExisting.photoUrl, caption: "旧齋藤家別邸",
        sourceUrl: saitoPlaceExisting.photoSourceUrl, author: saitoPlaceExisting.photoAuthor,
        license: saitoPlaceExisting.photoLicense, licenseUrl: saitoPlaceExisting.photoLicenseUrl,
      },
    });
  }

  // ぽんしゅ館: orderNo6、旧齋藤家別邸(14:00+80=15:20)からバス20分で15:40着、50分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: ponshukan.id },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 40)), stayDurationMin: 50, memo: newPonshukanMemo },
  });
  await prisma.spotTransitLeg.update({ where: { id: ponshukanLeg.id }, data: { transitMode: "bus", transitDurationMin: 20 } });

  console.log("  COMMITTED: 酒蔵めぐり#29 沼垂テラス・今代司酒造・新潟市内(09:30〜16:30)");
}
main().finally(() => prisma.$disconnect());
