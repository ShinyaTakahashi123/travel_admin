/**
 * 承認待ちしおりの見直し・新しい地域の分#26(258b3878、つづら棚田と弘農園の
 * ぶどう・なし狩り、道の駅うきは)。企画運営の指示(2026-10-13)に沿って、昼食を
 * スポットとして分け(道の駅うきは（昼食）)、弘農園を60〜80分の範囲(80分)に
 * トリムし、新たに3か所(新川田篭の町並み・流川の桜並木・吉井歴史民俗資料館)を
 * 追加して16:30以降まで延ばす。
 *
 * - 新川田篭の町並み: 平成24年(2012)重要伝統的建造物群保存地区選定、国重要文化財
 *   「平川家住宅」(内部見学は予約制)を文化庁のデータベース(online.bunka.go.jp)で
 *   確認。今も人が暮らす集落のため「家の敷地に入らない」一文を入れる
 * - 流川の桜並木: 巨瀬川沿い約2kmの桜並木(crossroadfukuoka.jp等で確認)。
 *   Commonsに該当する写真が見つからず、写真なし
 * - 吉井歴史民俗資料館: うきは市公式サイト(city.ukiha.fukuoka.jp)で開館時間
 *   (9:00-16:30・月曜休館)を確認。隣接する日岡古墳・珍敷塚古墳(装飾古墳)は
 *   毎月第3土曜のみ・要予約のため、見学必須の行程には含めず、メモで案内のみ
 * - 道の駅うきは（昼食）: 「レストラン『きふね食堂』」という店名を削除し、
 *   ここで昼食をとる形に。「ください」も直す
 * - 弘農園: 「料金のしくみ...確かめてください」のお金の話と「ください」を削除。
 *   季節タグ(summer/autumn)は収穫期(8月上旬〜10月中旬)と一致済みのため変更なし
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea26-tsuzura";

const ITIN_ID = "258b3878-0458-417b-be90-76bd7b12ed23";
const DAY_ID = "49402151-658e-46b0-8e52-ece5a1098171";
const TSUZURA_SPOT_ID = "3c228fa7-1389-4627-8a91-4c2c0e24ad12";
const HIRONOEN_SPOT_ID = "cdbfeb40-0555-4632-ba5d-ef5220a7fe3f";
const MICHINOEKI_SPOT_ID = "5bda41e2-6fbd-4ca9-9dcf-48e08ce2e203";

const NEW_DESCRIPTION =
  "日本棚田百選のつづら棚田、重要伝統的建造物群保存地区・新川田篭の集落、巨瀬川沿いの流川の桜並木から、ぶどう・なし狩りの弘農園、地元の果物が並ぶ道の駅うきは、吉井歴史民俗資料館まで、実りの季節のうきはを楽しむ日帰りプランです。";

const TAGOMORI_MEMO =
  "つづら棚田を含む「新川田篭」地区は、平成24年(2012)に国の重要伝統的建造物群保存地区に選定されました。井手を利用した稲作が営まれる谷あいの集落で、近世以降の寄棟造の茅葺き主屋や、明治時代以降の入母屋造の瓦葺き主屋が残っています。国の重要文化財に指定された、くど造り民家「平川家住宅」もこの地区にありますが、内部の見学は予約制です。今も人が暮らす集落ですので、家の敷地には入らず、道から静かに見学しましょう。";

const NAGAREKAWA_MEMO =
  "巨瀬川沿いに約2kmにわたって桜並木が続く、うきは市を代表する花見の名所です。例年3月下旬から4月上旬ごろが見頃で、川面に映る桜並木の眺めも楽しめます。";

const SHIRYOKAN_MEMO =
  "筑後吉井の歴史や民俗資料を紹介する資料館です。市内の日岡古墳から出土した埴輪など、地域の遺跡にまつわる資料も展示されています。近くには、装飾古墳として知られる日岡古墳・珍敷塚古墳もありますが、内部の公開は毎月第3土曜日のみで、事前の予約が必要です。";

async function main() {
  const tsuzura = await prisma.spot.findUnique({ where: { id: TSUZURA_SPOT_ID } });
  const hironoen = await prisma.spot.findUnique({ where: { id: HIRONOEN_SPOT_ID } });
  const michinoeki = await prisma.spot.findUnique({ where: { id: MICHINOEKI_SPOT_ID }, include: { photos: true } });
  if (!tsuzura || !hironoen?.memo || !michinoeki?.memo) throw new Error("想定と違います");

  const newHironoenMemo = hironoen.memo.replace(
    "料金のしくみや営業状況は、季節により変わるので、園の公式の案内(Instagramなど)で確かめてください。",
    "営業状況は季節により変わるので、園の公式の案内(Instagramなど)で確かめましょう。"
  );
  const newMichinoekiMemo = michinoeki.memo
    .replace(
      "レストラン「きふね食堂」では郷土料理などを味わえ、隣接する観光交流施設「ウキハコ」では、うきは市の観光案内やレンタサイクルの貸し出しも行っています。",
      "レストランでは郷土料理などを味わえ、ここで昼食をとりましょう。隣接する観光交流施設「ウキハコ」では、うきは市の観光案内やレンタサイクルの貸し出しも行っています。"
    )
    .replace("営業時間は季節により変わるので、公式サイトで確かめてください。", "営業時間は季節により変わるので、公式サイトで確かめましょう。");
  if (newHironoenMemo === hironoen.memo || newMichinoekiMemo === michinoeki.memo) throw new Error("置換対象が見つかりません");

  const dupNames = ["新川田篭", "流川の桜並木", "吉井歴史民俗資料館"];
  for (const n of dupNames) {
    const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: n } } });
    if (dup) throw new Error("台帳が既に存在します(想定外): " + n);
  }

  console.log("[確認OK] 説明文を直す");
  console.log("[確認OK] つづら棚田の開始時刻を9:00→9:30に");
  console.log("[確認OK] 道の駅うきはを「（昼食）」にし、店名・「ください」を削除");
  console.log("[確認OK] 弘農園のメモからお金の話・「ください」を削除、滞在130→80分に");
  console.log("[確認OK] 新川田篭の町並み・流川の桜並木・吉井歴史民俗資料館を追加して16:30以降まで延ばす");

  const tagomoriPhoto = await uploadCommonsFile("Niikawa Tagomori.jpg", "新川田篭の町並み", BLOB_PREFIX);
  if (!tagomoriPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(新川田篭)");
  console.log("取得:", tagomoriPhoto.url, tagomoriPhoto.credit);

  const shiryokanPhoto = await uploadCommonsFile("日岡古墳 埴輪.JPG", "吉井歴史民俗資料館", BLOB_PREFIX);
  if (!shiryokanPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(吉井歴史民俗資料館)");
  console.log("取得:", shiryokanPhoto.url, shiryokanPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: TSUZURA_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 9, 30)) } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: tsuzura.placeMasterId! } }))!.prefectureAreaId;

  // 弘農園・道の駅うきはをいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: HIRONOEN_SPOT_ID }, data: { orderNo: 98 } });
  await prisma.spot.update({ where: { id: MICHINOEKI_SPOT_ID }, data: { orderNo: 99 } });

  // 新川田篭の町並み: orderNo2、つづら棚田(9:30+60=10:30)から10分で10:40着、50分滞在
  const tagomoriPlace = await prisma.placeMaster.create({
    data: {
      name: "新川田篭の町並み", address: "福岡県うきは市浮羽町田篭", lat: 33.273125, lng: 130.841599,
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      photoUrl: tagomoriPhoto.url, photoAuthor: tagomoriPhoto.credit.author ?? null,
      photoLicense: tagomoriPhoto.credit.license ?? null, photoLicenseUrl: tagomoriPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: tagomoriPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const tagomoriSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: tagomoriPlace.id, orderNo: 2, name: "新川田篭の町並み",
      address: "福岡県うきは市浮羽町田篭", lat: 33.273125, lng: 130.841599,
      visitTime: new Date(Date.UTC(1970, 0, 1, 10, 40)), memo: TAGOMORI_MEMO, stayDurationMin: 50,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: tagomoriSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });
  await prisma.photo.create({
    data: {
      spotId: tagomoriSpot.id, url: tagomoriPhoto.url, caption: "新川田篭の町並み",
      sourceUrl: tagomoriPhoto.credit.sourceUrl ?? null, author: tagomoriPhoto.credit.author ?? null,
      license: tagomoriPhoto.credit.license ?? null, licenseUrl: tagomoriPhoto.credit.licenseUrl ?? null,
    },
  });

  // 流川の桜並木: orderNo3、田篭(10:40+50=11:30)から15分で11:45着、40分滞在
  const nagarekawaPlace = await prisma.placeMaster.create({
    data: {
      name: "流川の桜並木", address: "福岡県うきは市浮羽町流川", lat: 33.3153551, lng: 130.7857682,
      prefectureAreaId, category: "nature", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const nagarekawaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: nagarekawaPlace.id, orderNo: 3, name: "流川の桜並木",
      address: "福岡県うきは市浮羽町流川", lat: 33.3153551, lng: 130.7857682,
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 45)), memo: NAGAREKAWA_MEMO, stayDurationMin: 40,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: nagarekawaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });

  // 道の駅うきは（昼食）: orderNo4、流川(11:45+40=12:25)から10分で12:35着、90分滞在(既存)
  await prisma.spot.update({
    where: { id: MICHINOEKI_SPOT_ID },
    data: { orderNo: 4, name: "道の駅うきは（昼食）", memo: newMichinoekiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 35)) },
  });
  const michinoekiTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: MICHINOEKI_SPOT_ID, orderNo: 1 } });
  if (michinoekiTransit) await prisma.spotTransitLeg.update({ where: { id: michinoekiTransit.id }, data: { transitDurationMin: 10 } });

  // 弘農園: orderNo5、道の駅(12:35+90=14:05)から2分で14:07着、80分滞在(130→80に短縮)
  await prisma.spot.update({
    where: { id: HIRONOEN_SPOT_ID },
    data: { orderNo: 5, memo: newHironoenMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 7)), stayDurationMin: 80 },
  });
  const hironoenTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: HIRONOEN_SPOT_ID, orderNo: 1 } });
  if (hironoenTransit) await prisma.spotTransitLeg.update({ where: { id: hironoenTransit.id }, data: { transitDurationMin: 2 } });

  // 吉井歴史民俗資料館: orderNo6、弘農園(14:07+80=15:27)から15分で15:42着、50分滞在(16:32終了)
  const shiryokanPlace = await prisma.placeMaster.create({
    data: {
      name: "吉井歴史民俗資料館", address: "福岡県うきは市吉井町983-1", lat: 33.342522, lng: 130.751236,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      photoUrl: shiryokanPhoto.url, photoAuthor: shiryokanPhoto.credit.author ?? null,
      photoLicense: shiryokanPhoto.credit.license ?? null, photoLicenseUrl: shiryokanPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: shiryokanPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const shiryokanSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: shiryokanPlace.id, orderNo: 6, name: "吉井歴史民俗資料館",
      address: "福岡県うきは市吉井町983-1", lat: 33.342522, lng: 130.751236,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 42)), memo: SHIRYOKAN_MEMO, stayDurationMin: 50,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: shiryokanSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });
  await prisma.photo.create({
    data: {
      spotId: shiryokanSpot.id, url: shiryokanPhoto.url, caption: "吉井歴史民俗資料館(日岡古墳出土の埴輪)",
      sourceUrl: shiryokanPhoto.credit.sourceUrl ?? null, author: shiryokanPhoto.credit.author ?? null,
      license: shiryokanPhoto.credit.license ?? null, licenseUrl: shiryokanPhoto.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED: 新しい地域#26 つづら棚田と弘農園のぶどう・なし狩り");
}
main().finally(() => prisma.$disconnect());
