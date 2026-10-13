/**
 * 承認待ちしおりの見直し・新しい地域の分#22(55e932b6、中岡慎太郎館とモネの庭マルモッタン)。
 * 4か所以上・9:30ごろ〜16:30〜17:00の決まりに合わせ、新たに2か所(道の駅田野駅屋・
 * 伊尾木洞)を追加して16:30まで延ばす。既存スポットも直す。
 *
 * - モネの庭マルモッタン: 「冬の間は休園」という既存の注意書きを、具体的な休園期間
 *   (12月1日〜2月末日、公式サイト kjmonet.jp で確認)に直し、「ください」を「しましょう」に
 * - 奈半利の町並み: スポット名を「奈半利の町並み（昼食）」にし(台帳の名前も合わせる)、
 *   「いかがでしょうか」の案内口調を直す。滞在時間も100分→70分に調整(あとに2か所を
 *   追加するため)
 * - 道の駅田野駅屋: 土佐くろしお鉄道田野駅に併設。「道の駅」は国交省登録の公共的な
 *   施設区分のため、固有の私企業名としては扱わない(四国地方整備局の公式ページで
 *   営業時間を確認: https://www.skr.mlit.go.jp/road/rstation/eki/ko19_tano.html)
 * - 伊尾木洞: 国指定天然記念物(大正15年・1926年指定)のシダ群落。安芸市に位置する
 *   (奈半利町・田野町の隣接エリア)。ja.wikipedia.orgで洞窟の規模・成因・シダの種類数を確認
 * - 中岡慎太郎館→モネの庭の既存の移動データ(10分)が、実際の到着時刻の差(20分)と
 *   合っていなかったため、移動データを20分に訂正(距離約3.5kmの山間部のため、
 *   20分という時間そのものは不自然ではないと判断)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea22-nakaoka";

const ITIN_ID = "55e932b6-c5c2-4057-b36b-afcab176ad68";
const DAY_ID = "389c5e96-7cd0-41e9-91a9-7c7e4965749c";
const MONET_SPOT_ID = "540530d4-404e-4d2f-851f-35f154151ef1";
const NAHARI_SPOT_ID = "7c62d14d-06fc-410c-aaab-4f872cc87938";

const NEW_DESCRIPTION =
  "幕末の志士・中岡慎太郎の生涯を伝える資料館から、フランス・モネ財団に名前の使用を認められた庭園「モネの庭マルモッタン」、水切瓦の残る奈半利の町並みをめぐります。道の駅田野駅屋に立ち寄り、国指定天然記念物のシダ群落が広がる伊尾木洞まで足をのばす、北川村・奈半利町・田野町・安芸市の歴史と自然をめぐる日帰りプランです。";

const NEW_MONET_MEMO =
  "フランスの画家クロード・モネがジヴェルニーに残した庭を手本に作られた庭園です。北川村の職員が渡仏して協力を求め、平成11年(1999)、モネ財団から「モネ」の名を冠する使用の許可を受けました。本家の庭以外でこの名前を使うことが認められた、世界でも珍しい庭とされています。睡蓮の浮かぶ「水の庭」、四季折々の花が彩る「花の庭」、モネが晩年に訪れた地中海沿岸の風景を再現した「ボルディゲラの庭」の3つのエリアからなり、平成12年(2000)の開園以来、多くの人が訪れています。12月から2月末は冬季休園となるので、訪れる前に公式サイトで開園状況を確かめましょう。";

const NEW_NAHARI_MEMO =
  "『土佐日記』に「奈半の泊」として記された、古くからの港町です。台風や海からの風雨に備え、白壁を守る「水切瓦」や、浜辺の石を積み上げた石塀、赤レンガの蔵など、独特の町並みが今も残っています。大西家住宅主屋・正覚寺本堂・藤村製絲株式会社倉庫は、国の登録有形文化財に指定されています。今も人が暮らす町並みですので、家の敷地に入らず、静かに見学しましょう。お店で昼食をとりましょう。";

const TANOEKIYA_MEMO =
  "土佐くろしお鉄道ごめん・なはり線の田野駅に併設された道の駅です。地元でとれた野菜や果物、特産品を扱う直売所と、軽食がとれる喫茶コーナーがあり、ドライブの休憩にも便利です。";

const IOKIDO_MEMO =
  "大正15年(1926)、国の天然記念物に指定された洞窟です。かつて海中で堆積した地層が隆起し、渓谷の水に浸食されてできた天然の洞窟で、長さ約40m、幅約3m、高さ約5mあり、年間を通じて約20度に保たれています。この一帯の温度や湿度、地形がシダの生育に適しており、ホウビシダ、コモチシダなど約40種類ものシダが共生する、全国でも珍しい群落が見られます。入口から洞内まで遊歩道が続きますが、ぬかるみもあるため、長靴があると安心です。";

async function main() {
  const monet = await prisma.spot.findUnique({ where: { id: MONET_SPOT_ID } });
  const nahari = await prisma.spot.findUnique({ where: { id: NAHARI_SPOT_ID } });
  if (!monet?.memo || !nahari?.memo) throw new Error("想定と違います");

  const monetTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: monet.id, orderNo: 1 } });
  if (!monetTransit) throw new Error("移動データが見つかりません");

  const naharipm = await prisma.placeMaster.findUnique({ where: { id: nahari.placeMasterId! } });
  if (!naharipm || naharipm.name !== "奈半利の町並み") throw new Error("奈半利の町並みの台帳が想定と違います");

  const tanoDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "田野駅屋" } } });
  const iokidoDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "伊尾木洞" } } });
  if (tanoDup || iokidoDup) throw new Error("台帳が既に存在します(想定外、再利用を検討すること)");

  console.log("[確認OK] モネの庭マルモッタンのメモを直す(休園期間・「ください」)");
  console.log("[確認OK] 奈半利の町並み(昼食)にスポット名・台帳名・メモを直す(滞在時間100→70分)");
  console.log("[確認OK] 中岡慎太郎館→モネの庭の移動データを10分→20分に訂正");
  console.log("[確認OK] 道の駅田野駅屋・伊尾木洞を追加して16:30まで延ばす");

  const tanoPhoto = await uploadCommonsFile("R055-526.jpg", "道の駅田野駅屋", BLOB_PREFIX);
  if (!tanoPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(道の駅田野駅屋)");
  console.log("取得:", tanoPhoto.url, tanoPhoto.credit);

  const iokidoPhoto = await uploadCommonsFile("Entrance of Iokido Cave.jpg", "伊尾木洞", BLOB_PREFIX);
  if (!iokidoPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(伊尾木洞)");
  console.log("取得:", iokidoPhoto.url, iokidoPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spotTransitLeg.update({ where: { id: monetTransit.id }, data: { transitDurationMin: 20 } });
  await prisma.spot.update({ where: { id: monet.id }, data: { memo: NEW_MONET_MEMO } });

  await prisma.placeMaster.update({ where: { id: naharipm.id }, data: { name: "奈半利の町並み（昼食）" } });
  await prisma.spot.update({
    where: { id: nahari.id },
    data: { name: "奈半利の町並み（昼食）", memo: NEW_NAHARI_MEMO, stayDurationMin: 70 },
  });

  const prefectureAreaId = naharipm.prefectureAreaId;

  // 道の駅田野駅屋: orderNo 4、奈半利の町並み(12:40+70=13:50)から10分で14:00着、45分滞在
  const tanoPlace = await prisma.placeMaster.create({
    data: {
      name: "道の駅田野駅屋", address: "高知県安芸郡田野町1431-1", lat: 33.4301388, lng: 134.0075875,
      prefectureAreaId, category: "roadside_station", isWideArea: false, isMemorial: false,
      photoUrl: tanoPhoto.url, photoAuthor: tanoPhoto.credit.author ?? null,
      photoLicense: tanoPhoto.credit.license ?? null, photoLicenseUrl: tanoPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: tanoPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const tanoSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: tanoPlace.id, orderNo: 4, name: "道の駅田野駅屋",
      address: "高知県安芸郡田野町1431-1", lat: 33.4301388, lng: 134.0075875,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 0)), memo: TANOEKIYA_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: tanoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });
  await prisma.photo.create({
    data: {
      spotId: tanoSpot.id, url: tanoPhoto.url, caption: "道の駅田野駅屋",
      sourceUrl: tanoPhoto.credit.sourceUrl ?? null, author: tanoPhoto.credit.author ?? null,
      license: tanoPhoto.credit.license ?? null, licenseUrl: tanoPhoto.credit.licenseUrl ?? null,
    },
  });

  // 伊尾木洞: orderNo 5、道の駅田野駅屋(14:00+45=14:45)から20分で15:05着、85分滞在(16:30終了)
  const iokidoPlace = await prisma.placeMaster.create({
    data: {
      name: "伊尾木洞", address: "高知県安芸市伊尾木", lat: 33.4912988, lng: 133.9333095,
      prefectureAreaId, category: "nature", isWideArea: false, isMemorial: false,
      photoUrl: iokidoPhoto.url, photoAuthor: iokidoPhoto.credit.author ?? null,
      photoLicense: iokidoPhoto.credit.license ?? null, photoLicenseUrl: iokidoPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: iokidoPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const iokidoSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: iokidoPlace.id, orderNo: 5, name: "伊尾木洞",
      address: "高知県安芸市伊尾木", lat: 33.4912988, lng: 133.9333095,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 5)), memo: IOKIDO_MEMO, stayDurationMin: 85,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: iokidoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 20 } });
  await prisma.photo.create({
    data: {
      spotId: iokidoSpot.id, url: iokidoPhoto.url, caption: "伊尾木洞",
      sourceUrl: iokidoPhoto.credit.sourceUrl ?? null, author: iokidoPhoto.credit.author ?? null,
      license: iokidoPhoto.credit.license ?? null, licenseUrl: iokidoPhoto.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED: 新しい地域#22 中岡慎太郎館とモネの庭マルモッタン");
}
main().finally(() => prisma.$disconnect());
