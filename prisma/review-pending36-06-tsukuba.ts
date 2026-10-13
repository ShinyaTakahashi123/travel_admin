/**
 * 承認待ち36本の見直し・#6(625bdb23、つくばでいちご狩りと筑波実験植物園)。
 * #1〜#5で学んだ決まりを最初から反映する(既存スポットのメモも見直す)。
 * あわせて、既存データの到着時刻のずれ(筑波実験植物園11:10→11:00、
 * 地図と測量の科学館12:25→12:20、移動時間と合っていなかった)も直す。
 *
 * - いちご家つくばねファーム: 出典サイト名・料金の話・「ください」を直す(#1〜#5と同じ)
 * - 地図と測量の科学館: 既存メモの「直径21.5m」は、国土地理院の広報・複数の観光
 *   情報サイトで裏付けが取れず、実際は「約22m」が正しいため訂正。「入館は無料です」
 *   も、お金の話をしない決まりに合わせて削除(https://www.gsi.go.jp/MUSEUM/ 等で確認)
 * - つくば駅前（昼食）: 駅前の商業施設は大和リース(私企業)の運営のため、建物名・店名は
 *   出さず、エリアとして案内する形にする
 * - つくばエキスポセンター: 公益財団法人つくば科学万博記念財団の運営(公的な施設)。
 *   開館9:50-17:00・休館月曜を確認(https://www.expocenter.or.jp/)。「世界最大級」は
 *   観光情報サイトの紹介文による表現のため、ぼかしを同じ文に入れる
 * - JAXA筑波宇宙センター: スペースドーム展示館は予約不要で見学可(ガイド付き有料
 *   ツアーとは別)。入館料には触れない(お金の話をしない決まり)
 *   (https://fanfun.jaxa.jp/visit/tsukuba/, https://visit-tsukuba.jaxa.jp/ で確認)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "pending36-06-tsukuba";

const ITIN_ID = "625bdb23-f36e-489d-afd9-e3c8f85041e7";
const DAY_ID = "acfb0013-d6f7-4cdf-8bfc-1125d8a6539f";
const ICHIGO_SPOT_ID = "90ccfc5c-fc2b-4c83-8614-51999d0ea1fd";
const SHOKUBUTSUEN_SPOT_ID = "d29e7a28-12cf-45f9-90c9-06db42235add";
const CHIZU_SPOT_ID = "c7f6cf3e-a23b-405b-ba22-6a3f8316e6ee";
const EXPOCENTER_PM_ID = "e5b1fd94-032b-409f-84a4-0fc6764b4024"; // 既存の台帳(他のしおりで先に登録済み)を再利用

const NEW_DESCRIPTION =
  "観光いちご園でいちご狩りを楽しんだあと、国立科学博物館附属の筑波実験植物園、国土地理院の地図と測量の科学館で、植物と地図の世界にふれます。つくば駅前で昼食をとり、つくばエキスポセンター、JAXA筑波宇宙センターをめぐる、科学の世界を楽しむ日帰りプランです。";

const ICHIGO_MEMO =
  "「紅ほっぺ」「とちおとめ」のほか、茨城県が開発したブランドいちご「いばらキッス」など複数の品種を栽培する観光いちご園です。開園期間や時間は季節によって変わるため、訪れる前に公式サイトで確かめましょう。いちご狩りは、この観光農園の中だけにしましょう。観光農園以外の畑には入らないようにしましょう。";

const CHIZU_MEMO =
  "国土交通省・国土地理院が運営する、地図と測量をテーマにした展示施設です。屋外には直径約22mの日本列島球体模型があり、上を歩いて地球の大きさや丸さを実感できます。館内には伊能忠敬の伊能図や、現存する世界最古とされる地球儀(1492年のベハイムの地球儀の複製)、地図の歴史や測量の仕組みを、遊びながら学べる展示が並びます。";

const EKIMAE_MEMO = "TXつくば駅の駅前には、飲食店の入る商業施設が集まっています。好みの店で昼食をとりましょう。";

const EXPOCENTER_MEMO =
  "公益財団法人つくば科学万博記念財団が運営する科学館です。屋外には実物大のH-IIロケットが展示され、館内には世界最大級とされる直径25.6mのドームを持つプラネタリウムをはじめ、科学の原理を体験しながら学べる展示が並びます。";

const JAXA_MEMO =
  "日本の宇宙開発を担うJAXAの中核施設です。展示棟「スペースドーム」では、本物のロケットエンジンや、国際宇宙ステーション(ISS)の日本実験棟「きぼう」の実物大モデルなどを間近に見ることができ、スタッフによる展示解説も随時行われています。予約をしなくても見学できます(施設の点検や行事などで、見学できない日もあります)。";

async function main() {
  const ichigo = await prisma.spot.findUnique({ where: { id: ICHIGO_SPOT_ID } });
  const shokubutsuen = await prisma.spot.findUnique({ where: { id: SHOKUBUTSUEN_SPOT_ID } });
  const chizu = await prisma.spot.findUnique({ where: { id: CHIZU_SPOT_ID }, include: { photos: true } });
  if (!ichigo || !shokubutsuen || !chizu) throw new Error("想定と違います");

  const ekimaeDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "つくば駅前" } } });
  const jaxaDup = await prisma.placeMaster.findFirst({ where: { name: { contains: "JAXA" } } });
  if (ekimaeDup || jaxaDup) throw new Error("台帳が既に存在します(想定外、再利用を検討すること)");
  const expoExisting = await prisma.placeMaster.findUnique({ where: { id: EXPOCENTER_PM_ID } });
  if (!expoExisting?.photoUrl || expoExisting.name !== "つくばエキスポセンター") throw new Error("つくばエキスポセンターの既存台帳が想定と違います");

  console.log("[確認OK] 説明文を直す(出典サイト名を外し、新しい3スポットを追加)");
  console.log("[確認OK] いちご家つくばねファームのメモを直す(出典サイト名・料金・「ください」)");
  console.log("[確認OK] 筑波実験植物園の到着時刻を直す(11:10→11:00)");
  console.log("[確認OK] 地図と測量の科学館の到着時刻(12:25→12:20)とメモ(直径・無料の記述)を直す");
  console.log("[確認OK] つくば駅前（昼食）・つくばエキスポセンター・JAXA筑波宇宙センターを追加して16:35まで延ばす");

  const jaxaPhoto = await uploadCommonsFile("Tsukuba Space Center-01.jpg", "JAXA筑波宇宙センター", BLOB_PREFIX);
  if (!jaxaPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(JAXA筑波宇宙センター)");
  console.log("取得:", jaxaPhoto.url, jaxaPhoto.credit);

  const ekimaePhoto = await uploadCommonsFile("Tsukuba Center & Mt.Tsukuba01.jpg", "つくば駅前", BLOB_PREFIX);
  if (!ekimaePhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(つくば駅前)");
  console.log("取得:", ekimaePhoto.url, ekimaePhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: ICHIGO_SPOT_ID }, data: { memo: ICHIGO_MEMO } });
  await prisma.spot.update({ where: { id: SHOKUBUTSUEN_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 0)) } });
  await prisma.spot.update({
    where: { id: CHIZU_SPOT_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 20)), memo: CHIZU_MEMO },
  });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: chizu.placeMasterId! } }))!.prefectureAreaId;

  // つくば駅前（昼食）: orderNo 4、地図と測量の科学館(12:20+45=13:05)から10分で13:15着、60分滞在
  const ekimaePlace = await prisma.placeMaster.create({
    data: {
      name: "つくば駅前", address: "茨城県つくば市吾妻1丁目", lat: 36.0828102, lng: 140.1115244,
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      photoUrl: ekimaePhoto.url, photoAuthor: ekimaePhoto.credit.author ?? null,
      photoLicense: ekimaePhoto.credit.license ?? null, photoLicenseUrl: ekimaePhoto.credit.licenseUrl ?? null,
      photoSourceUrl: ekimaePhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const ekimaeSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: ekimaePlace.id, orderNo: 4, name: "つくば駅前（昼食）",
      address: "茨城県つくば市吾妻1丁目", lat: 36.0828102, lng: 140.1115244,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 15)), memo: EKIMAE_MEMO, stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: ekimaeSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });
  await prisma.photo.create({
    data: {
      spotId: ekimaeSpot.id, url: ekimaePhoto.url, caption: "つくば駅前",
      sourceUrl: ekimaePhoto.credit.sourceUrl ?? null, author: ekimaePhoto.credit.author ?? null,
      license: ekimaePhoto.credit.license ?? null, licenseUrl: ekimaePhoto.credit.licenseUrl ?? null,
    },
  });

  // つくばエキスポセンター: orderNo 5、つくば駅前(13:15+60=14:15)から10分で14:25着、60分滞在
  // (既存の台帳(他のしおりで先に登録済み)を再利用)
  const expoSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: expoExisting.id, orderNo: 5, name: "つくばエキスポセンター",
      address: expoExisting.address, lat: expoExisting.lat, lng: expoExisting.lng,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 25)), memo: EXPOCENTER_MEMO, stayDurationMin: 60,
      websiteUrl: "https://www.expocenter.or.jp/",
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: expoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });
  await prisma.photo.create({
    data: {
      spotId: expoSpot.id, url: expoExisting.photoUrl!, caption: "つくばエキスポセンター",
      sourceUrl: expoExisting.photoSourceUrl, author: expoExisting.photoAuthor,
      license: expoExisting.photoLicense, licenseUrl: expoExisting.photoLicenseUrl,
    },
  });

  // JAXA筑波宇宙センター: orderNo 6、つくばエキスポセンター(14:25+60=15:25)から10分で15:35着、60分滞在(16:35終了)
  const jaxaPlace = await prisma.placeMaster.create({
    data: {
      name: "JAXA筑波宇宙センター", address: "茨城県つくば市千現2-1-1", lat: 36.069489, lng: 140.127304,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      photoUrl: jaxaPhoto.url, photoAuthor: jaxaPhoto.credit.author ?? null,
      photoLicense: jaxaPhoto.credit.license ?? null, photoLicenseUrl: jaxaPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: jaxaPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const jaxaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: jaxaPlace.id, orderNo: 6, name: "JAXA筑波宇宙センター",
      address: "茨城県つくば市千現2-1-1", lat: 36.069489, lng: 140.127304,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 35)), memo: JAXA_MEMO, stayDurationMin: 60,
      websiteUrl: "https://visit-tsukuba.jaxa.jp/",
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: jaxaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });
  await prisma.photo.create({
    data: {
      spotId: jaxaSpot.id, url: jaxaPhoto.url, caption: "JAXA筑波宇宙センター",
      sourceUrl: jaxaPhoto.credit.sourceUrl ?? null, author: jaxaPhoto.credit.author ?? null,
      license: jaxaPhoto.credit.license ?? null, licenseUrl: jaxaPhoto.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED: #6 つくばでいちご狩りと筑波実験植物園");
}
main().finally(() => prisma.$disconnect());
