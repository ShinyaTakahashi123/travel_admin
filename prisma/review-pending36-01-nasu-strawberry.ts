/**
 * 承認待ち36本の見直し・#1(df7271d1、那須高原でいちご狩りと殺生石)。
 * docs/specs/20260929-itinerary-4spots-9to16.md の決まりに合わせる。
 *
 * - 那須ロープウェイ(公式サイト https://www.nasu-ropeway.jp/information/ で運行期間
 *   3/20〜12/13と確認。しおりの季節(冬・春)のほとんどで運休のため、企画運営の判断
 *   (2026-10-13)で外す)を削除
 * - 代わりに、冬も営業する那須どうぶつ王国(屋内中心の王国タウン。冬季は休園日が
 *   不定期にあるため、メモでは具体的な日付を書かず「公式サイトで確かめて」と案内。
 *   公式サイト https://www.nasu-oukoku.com/ )と南ヶ丘牧場(年中無休・入場無料を
 *   公式サイト https://www.minamigaoka.co.jp/ で確認)を追加し、16:30まで延ばす
 * - 移動は全区間「車」(既存のいちごの森→ロープウェイ・ロープウェイ→殺生石も車だった
 *   ため、旅の足と矛盾しない)
 * - 表紙は、削除するロープウェイの写真から、タイトルにも入っている殺生石の写真に変更
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "pending36-01-nasu";

const ITIN_ID = "df7271d1-8bcb-4e05-a142-bb33e425fce1";
const ROPEWAY_SPOT_ID = "9e1f29a2-8f50-4f89-8963-b811127fd611";
const SESSHOSEKI_SPOT_ID = "b49271b8-ed6b-4853-b2b1-6e85e62fe968";
const SESSHOSEKI_TRANSIT_ID = "1241a38d-10c5-4d8f-8532-632ad3c94ee3";
const SHRINE_SPOT_ID = "10ea5230-ead0-42f4-b847-d65e07cc759c";
const DAY_ID = "468695c0-fd4b-4c20-af9c-208df69e6178";
const SESSHOSEKI_PHOTO_URL = "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-08/%25E6%25AE%25BA%25E7%2594%259F%25E7%259F%25B3-SOBZuKmRDHF8RMcy5ahKk67lA2EyDL.jpg";

const DOUBUTSU_PLACE_ID = "c3deb850-9a57-4580-b141-dca065f43016"; // 既存台帳: 那須どうぶつ王国

const NEW_DESCRIPTION =
  "那須高原の観光いちご園でいちご狩りを楽しんだあと、九尾の狐伝説で知られる殺生石と、隣接する古社・那須温泉神社をめぐります。午後は那須どうぶつ王国で動物とふれあい、南ヶ丘牧場で乳製品づくりも楽しむ日帰りプランです。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { thumbnailUrl: true, description: true } });
  const ropeway = await prisma.spot.findUnique({ where: { id: ROPEWAY_SPOT_ID }, include: { photos: true } });
  if (!itin || !ropeway || ropeway.name !== "那須ロープウェイ") throw new Error("想定と違います(itin/ropeway)");
  if (itin.thumbnailUrl !== ropeway.photos[0]?.url) throw new Error("想定と違います(表紙)");

  const minamigaoka = await prisma.placeMaster.findFirst({ where: { name: "南ヶ丘牧場" } });
  if (minamigaoka) throw new Error("南ヶ丘牧場の台帳が既に存在します(想定外、二重登録防止のため中断)");

  const doubutsu = await prisma.placeMaster.findUnique({ where: { id: DOUBUTSU_PLACE_ID } });
  if (!doubutsu || doubutsu.name !== "那須どうぶつ王国") throw new Error("想定と違います(那須どうぶつ王国の台帳)");

  console.log("[確認OK] ロープウェイのスポット・写真を削除");
  console.log("[確認OK] 殺生石・那須温泉神社のorderNo/時刻/移動時間を直す");
  console.log("[確認OK] 南ヶ丘牧場の台帳を新規作成(写真つき)");
  console.log("[確認OK] 那須どうぶつ王国・南ヶ丘牧場のスポットを追加");
  console.log("[確認OK] 表紙を殺生石の写真に、説明文を更新");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // 1. ロープウェイのスポットを削除(Photo・TransitLegはCASCADEで一緒に消える)
  await prisma.spot.delete({ where: { id: ROPEWAY_SPOT_ID } });

  // 2. 殺生石: orderNo 2、いちごの森から直接車で25分、09:30+70分(いちごの森の滞在)+25分=11:05着
  await prisma.spot.update({
    where: { id: SESSHOSEKI_SPOT_ID },
    data: { orderNo: 2, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 5)) },
  });
  await prisma.spotTransitLeg.update({
    where: { id: SESSHOSEKI_TRANSIT_ID },
    data: { transitDurationMin: 25 },
  });

  // 3. 那須温泉神社: orderNo 3、殺生石(11:05+45分=11:50)から徒歩5分で11:55着(変更なし、確認のみ)
  await prisma.spot.update({
    where: { id: SHRINE_SPOT_ID },
    data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 55)) },
  });

  // 4. 那須どうぶつ王国を追加(既存台帳の写真を流用)。那須温泉神社(11:55+25分=12:20)から車15分で12:35着、100分滞在
  const doubutsuSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID,
      placeMasterId: DOUBUTSU_PLACE_ID,
      orderNo: 4,
      name: "那須どうぶつ王国",
      address: "栃木県那須郡那須町大島1042-1",
      lat: 37.1292006,
      lng: 140.0378048,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 35)),
      memo: "うさぎ・カピバラなどの小動物とふれあえる屋内中心の「王国タウン」と、鳥のショーなどを楽しむ屋外の「王国ファーム」からなる動物園です。冬は積雪や寒さに備え、屋内中心の王国タウンのみの営業になることが多く、不定期の休園日もあります。訪れる前に、必ず公式サイトの営業カレンダーで確かめてください。園内にはレストランやカフェもあり、ここで昼食をとることもできます。",
      stayDurationMin: 100,
      websiteUrl: "https://www.nasu-oukoku.com/",
    },
  });
  await prisma.spotTransitLeg.create({
    data: { spotId: doubutsuSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 },
  });

  // 5. 南ヶ丘牧場の台帳を新規作成
  const result = await uploadCommonsFile("190725 Minamigaoka Farm Nasu Japan01s3.jpg", "南ヶ丘牧場", BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました(南ヶ丘牧場)");
  console.log("取得:", result.url, result.credit);
  const minamigaokaPlace = await prisma.placeMaster.create({
    data: {
      name: "南ヶ丘牧場",
      address: "栃木県那須郡那須町湯本579",
      lat: 37.0797851,
      lng: 140.0004676,
      prefectureAreaId: doubutsu.prefectureAreaId,
      category: "other",
      isWideArea: false,
      isMemorial: false,
      websiteUrl: "https://www.minamigaoka.co.jp/",
      photoUrl: result.url,
      photoAuthor: result.credit.author ?? null,
      photoLicense: result.credit.license ?? null,
      photoLicenseUrl: result.credit.licenseUrl ?? null,
      photoSourceUrl: result.credit.sourceUrl ?? null,
      source: "ai_collected",
      positionSource: "gsi",
      verifiedAt: new Date(),
    },
  });

  // 6. 南ヶ丘牧場のスポットを追加。那須どうぶつ王国(12:35+100分=14:15)から車15分で14:30着、120分滞在(16:30終了)
  const minamigaokaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID,
      placeMasterId: minamigaokaPlace.id,
      orderNo: 5,
      name: "南ヶ丘牧場",
      address: "栃木県那須郡那須町湯本579",
      lat: 37.0797851,
      lng: 140.0004676,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 30)),
      memo: "明治創業の牧場で、入場料・駐車場ともに無料です。牛や羊、ポニーなどの動物とふれあえるほか、バター作りやアイスクリーム作りの体験もできます(体験は有料・要予約のものもあります)。売店では、牧場で作ったチーズやソフトクリームも楽しめます。旅の最後に、ゆっくりと那須の牧場風景を楽しみましょう。",
      stayDurationMin: 120,
      websiteUrl: "https://www.minamigaoka.co.jp/",
    },
  });
  await prisma.spotTransitLeg.create({
    data: { spotId: minamigaokaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 },
  });

  // 7. 表紙を殺生石の写真に、説明文を更新
  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: { thumbnailUrl: SESSHOSEKI_PHOTO_URL, description: NEW_DESCRIPTION },
  });

  console.log("  COMMITTED: #1 那須高原でいちご狩りと殺生石");
}
main().finally(() => prisma.$disconnect());
