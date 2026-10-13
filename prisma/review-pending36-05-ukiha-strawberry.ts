/**
 * 承認待ち36本の見直し・#5(21141835、うきはでいちご狩りと筑後吉井の白壁の町並み)。
 * #1〜#4で学んだ決まりを最初から反映する。あわせて、既存3スポットのメモも見直す
 * (#4の反省:「#5からは、いちご園のメモも#1の形で最初から作ってください」)。
 *
 * - 春光園: 出典サイト名「クロスロードふくおか」・料金の話・「ください」を直す
 * - 筑後吉井の白壁の町並み: 到着時刻のずれ(11:00→10:55)のみ直す。文面は
 *   文化庁の選定日(平成8年12月10日)・約250棟という数字とも矛盾しないため変更なし
 * - 浮羽稲荷神社: 到着時刻のずれ(12:20→12:15)を直し、出典(ukihalove.jp)で裏が
 *   取れない「井上城の城跡」の記述を削除。写真がなかったため追加
 * - 道の駅うきは（昼食）・つづら棚田・田主丸駅とかっぱの町並み: 台帳(place_master)に
 *   既存のものを再利用(他セッションの台帳整備作業で先に登録済み)。つづら棚田と
 *   浮羽稲荷神社は台帳側にも写真がなかったため、このスクリプトで取得・登録する
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "pending36-05-ukiha";

const ITIN_ID = "21141835-bf8c-4fd1-ac60-65d389545d30";
const DAY_ID = "90952d9d-86ab-447c-8e7e-d2b542069214";
const SHUNKOEN_SPOT_ID = "e06b1b41-7adf-478f-93a1-488731243c01";
const YOSHII_SPOT_ID = "35697f64-8f98-4bd8-ab9b-50468dbd4750";
const INARI_SPOT_ID = "ff95b30e-fc83-4e44-95b3-93d82271e1f0";
const INARI_PM_ID = "73caad3d-b758-49e5-a94b-b973572c5d0e";
const MICHINOEKI_PM_ID = "165cda28-4e86-4076-a6fa-ef486623d188";
const TSUZURA_PM_ID = "73b9d6a2-38e7-4d8c-aee2-f9a985f45fc1";
const TANUSHIMARU_PM_ID = "131809f3-ecfb-4f6a-b349-46aab87abf41";

const NEW_DESCRIPTION =
  "観光いちご園でいちご狩りを楽しんだあと、江戸時代の宿場町の面影を残す重要伝統的建造物群保存地区・筑後吉井の白壁の町並み、朱の鳥居が連なる浮羽稲荷神社をめぐります。道の駅うきはで昼食をとり、日本の棚田百選に選ばれたつづら棚田、河童をデザインした駅舎で知られる田主丸をめぐる日帰りプランです。";

const SHUNKOEN_MEMO =
  "「あまおう」「紅ほっぺ」「かおりの」など複数の品種を栽培する観光いちご園です。多段式の高設栽培で、立ったままいちご狩りができます。開園期間や時間は季節によって変わるため、訪れる前に公式サイトで確かめましょう。いちご狩りは、この観光農園の中だけにしましょう。観光農園以外の畑には入らないようにしましょう。";

const INARI_MEMO =
  "昭和32年(1957)創建の神社で、京都の伏見稲荷大社・松尾大社、太宰府天満宮から祀りを受けた三柱を祭神とし、商売繁盛や学問などのご利益があるとされます。城ヶ鼻公園内にあり、山の斜面に沿って90基あまりの朱の鳥居が連なる参道が、近年SNSでも話題になっています。鳥居をくぐって登った先からは、筑後平野を一望する眺めが広がり、晴れた日には遠く原鶴温泉や甘木方面まで見渡せます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const MICHINOEKI_MEMO =
  "国道210号沿い、大原野台地の西北端に建つ道の駅です。国の重要文化財「くど造り民家」を模した木造の建物で、物産館では地元でとれたフルーツや野菜、手作りの惣菜やパンなどが並びます。レストランでは旬の食材を使った料理を楽しめるほか、ソフトクリームなどの軽食もあります。北側の展望デッキからは、筑後平野を一望できます。隣接する交流施設「ウキハコ」では、うきは市の観光情報の案内も行っています。";

const TSUZURA_MEMO =
  "大原から新川にかけて、約7haの急斜面に約300枚の石積みの棚田が広がる、日本の棚田百選に選ばれた景観です。田に水が張られる時期や、稲が実る時期、雪景色など、季節ごとに表情を変えます。棚田は地域の方が大切に耕作している農地です。道路や見学できる場所から、景色を楽しみましょう。";

const TANUSHIMARU_MEMO =
  "昭和3年(1928)開業のJR久大本線田主丸駅は、平成4年(1992)、地元・浮羽工業高校の生徒が河童をイメージしてデザインした駅舎に生まれ変わりました。筑後川流域に伝わる河童伝説の地として知られ、中央アジアから海を渡った河童が球磨川(熊本県)から筑後川へ移り住んだという言い伝えが残ります。戦時中にこの地を訪れた作家・火野葦平は、川で鯉をとる名人「鯉とりまあしゃん」との出会いをきっかけに、河童を題材にした作品を多く残しました。駅舎内の「田主丸ふるさと会館」には河童の資料館やカフェがあり、ホームの「お迎え河童」や駅前の「楽太郎河童」が出迎えてくれます。駅の周りを歩くと、あちこちに河童の像を見つけられます。";

async function main() {
  const shunkoen = await prisma.spot.findUnique({ where: { id: SHUNKOEN_SPOT_ID } });
  const yoshii = await prisma.spot.findUnique({ where: { id: YOSHII_SPOT_ID } });
  const inari = await prisma.spot.findUnique({ where: { id: INARI_SPOT_ID }, include: { photos: true } });
  if (!shunkoen || !yoshii || !inari) throw new Error("想定と違います");
  if (inari.photos.length > 0) throw new Error("浮羽稲荷神社に写真が既にあります(想定外)");

  const michinoeki = await prisma.placeMaster.findUnique({ where: { id: MICHINOEKI_PM_ID } });
  const tanushimaru = await prisma.placeMaster.findUnique({ where: { id: TANUSHIMARU_PM_ID } });
  const tsuzura = await prisma.placeMaster.findUnique({ where: { id: TSUZURA_PM_ID } });
  const inariPm = await prisma.placeMaster.findUnique({ where: { id: INARI_PM_ID } });
  if (!michinoeki?.photoUrl || !tanushimaru?.photoUrl) throw new Error("道の駅うきは・田主丸の台帳(写真つき)が見つかりません");
  if (!tsuzura) throw new Error("つづら棚田の台帳が見つかりません");
  if (!inariPm) throw new Error("浮羽稲荷神社の台帳が見つかりません");

  console.log("[確認OK] 説明文を直す(出典サイト名を外し、新しい3スポットを追加)");
  console.log("[確認OK] 春光園のメモを直す(出典サイト名・料金・「ください」)");
  console.log("[確認OK] 筑後吉井の到着時刻を直す(11:00→10:55)");
  console.log("[確認OK] 浮羽稲荷神社の到着時刻を直し(12:20→12:15)、裏が取れない「井上城」の記述を削除、写真を追加");
  console.log("[確認OK] 道の駅うきは（昼食）・つづら棚田・田主丸駅とかっぱの町並みを追加して16:40まで延ばす");

  // つづら棚田の写真を取得(台帳にまだ写真がないため)
  const tsuzuraPhoto = await uploadCommonsFile("Tsuzura-tanada, Ukiha 01.jpg", "つづら棚田", BLOB_PREFIX);
  if (!tsuzuraPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(つづら棚田)");
  console.log("取得:", tsuzuraPhoto.url, tsuzuraPhoto.credit);

  // 浮羽稲荷神社の写真を取得
  const inariPhoto = await uploadCommonsFile("Ukiha Town view from Ukiha Inari.jpg", "浮羽稲荷神社", BLOB_PREFIX);
  if (!inariPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(浮羽稲荷神社)");
  console.log("取得:", inariPhoto.url, inariPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: SHUNKOEN_SPOT_ID }, data: { memo: SHUNKOEN_MEMO } });
  await prisma.spot.update({ where: { id: YOSHII_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 55)) } });
  await prisma.spot.update({
    where: { id: INARI_SPOT_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 15)), memo: INARI_MEMO },
  });

  // 台帳(つづら棚田・浮羽稲荷神社)に写真を登録(他セッションの台帳整備作業とも整合させる)
  await prisma.placeMaster.update({
    where: { id: TSUZURA_PM_ID },
    data: {
      photoUrl: tsuzuraPhoto.url, photoAuthor: tsuzuraPhoto.credit.author ?? null,
      photoLicense: tsuzuraPhoto.credit.license ?? null, photoLicenseUrl: tsuzuraPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: tsuzuraPhoto.credit.sourceUrl ?? null, verifiedAt: new Date(),
    },
  });
  await prisma.placeMaster.update({
    where: { id: INARI_PM_ID },
    data: {
      photoUrl: inariPhoto.url, photoAuthor: inariPhoto.credit.author ?? null,
      photoLicense: inariPhoto.credit.license ?? null, photoLicenseUrl: inariPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: inariPhoto.credit.sourceUrl ?? null, verifiedAt: new Date(),
    },
  });
  await prisma.photo.create({
    data: {
      spotId: INARI_SPOT_ID, url: inariPhoto.url, caption: "浮羽稲荷神社",
      sourceUrl: inariPhoto.credit.sourceUrl ?? null, author: inariPhoto.credit.author ?? null,
      license: inariPhoto.credit.license ?? null, licenseUrl: inariPhoto.credit.licenseUrl ?? null,
    },
  });

  // 道の駅うきは（昼食）: orderNo 4、浮羽稲荷神社(12:15+45=13:00)から15分で13:15着、60分滞在
  const michinoekiSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: michinoeki.id, orderNo: 4, name: "道の駅うきは（昼食）",
      address: michinoeki.address, lat: michinoeki.lat, lng: michinoeki.lng,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 15)), memo: MICHINOEKI_MEMO, stayDurationMin: 60,
      websiteUrl: michinoeki.websiteUrl,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: michinoekiSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });
  await prisma.photo.create({
    data: {
      spotId: michinoekiSpot.id, url: michinoeki.photoUrl!, caption: "道の駅うきは",
      sourceUrl: michinoeki.photoSourceUrl, author: michinoeki.photoAuthor,
      license: michinoeki.photoLicense, licenseUrl: michinoeki.photoLicenseUrl,
    },
  });

  // つづら棚田: orderNo 5、道の駅うきは(13:15+60=14:15)から20分で14:35着、60分滞在
  const tsuzuraSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: tsuzura.id, orderNo: 5, name: "つづら棚田",
      address: tsuzura.address, lat: tsuzura.lat, lng: tsuzura.lng,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 35)), memo: TSUZURA_MEMO, stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: tsuzuraSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 20 } });
  await prisma.photo.create({
    data: {
      spotId: tsuzuraSpot.id, url: tsuzuraPhoto.url, caption: "つづら棚田",
      sourceUrl: tsuzuraPhoto.credit.sourceUrl ?? null, author: tsuzuraPhoto.credit.author ?? null,
      license: tsuzuraPhoto.credit.license ?? null, licenseUrl: tsuzuraPhoto.credit.licenseUrl ?? null,
    },
  });

  // 田主丸駅とかっぱの町並み: orderNo 6、つづら棚田(14:35+60=15:35)から30分で16:05着、35分滞在(16:40終了)
  const tanushimaruSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: tanushimaru.id, orderNo: 6, name: "田主丸駅とかっぱの町並み",
      address: tanushimaru.address, lat: tanushimaru.lat, lng: tanushimaru.lng,
      visitTime: new Date(Date.UTC(1970, 0, 1, 16, 5)), memo: TANUSHIMARU_MEMO, stayDurationMin: 35,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: tanushimaruSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 30 } });
  await prisma.photo.create({
    data: {
      spotId: tanushimaruSpot.id, url: tanushimaru.photoUrl!, caption: "田主丸駅とかっぱの町並み",
      sourceUrl: tanushimaru.photoSourceUrl, author: tanushimaru.photoAuthor,
      license: tanushimaru.photoLicense, licenseUrl: tanushimaru.photoLicenseUrl,
    },
  });

  console.log("  COMMITTED: #5 うきはでいちご狩りと筑後吉井の白壁の町並み");
}
main().finally(() => prisma.$disconnect());
