/**
 * バッチ7を送る前の制作側の見比べで見つけた3件(台帳のみ)と、法務のバッチ6レビュー
 * (2026-10-13)で見つかった場所違い3件(台帳+公式しおり)を直す。
 *
 * 【台帳のみ、まだ未登録】
 * - 青の洞門: 元候補は競秀峰・山国川の遠景で、洞門(トンネル)自体が分かりにくかった。
 *   トンネル入口が写った写真に差し替え。
 * - 西武秩父駅前温泉 祭の湯: 元候補は隣接する西武秩父駅の駅舎で、祭の湯自体ではな
 *   かった。祭の湯の建物が写った写真に差し替え。
 * - 水木しげるロード: 元候補は境港市内の一般的な通りの写真で、水木しげるロードと
 *   分かる特徴(妖怪像・案内標識等)が写っていなかった。「MIZUKI SHIGERU ROAD」の
 *   案内標識が写った写真に差し替え。
 *
 * 【台帳+公式しおり、法務指摘(場所が違う3件)】
 * - 出雲文化伝承館 ← Shimane_Winery1.JPG: 島根ワイナリーの試飲販売棟で、別の施設
 *   だった。出雲文化伝承館の建物が写った写真に差し替え(台帳+公式しおり1本)。
 * - 上高地ビジターセンター ← 秋の上高地(Kamikochi in autumn): 河童橋付近の景色で、
 *   センターの建物ではなかった。ビジターセンターの建物が写った写真に差し替え
 *   (台帳+公式しおり1本)。
 * - 城崎文芸館 ← Kinosaki_onsen02_1920.jpg: 大谿川の柳並木の写真の使い回しで、
 *   文芸館自体ではなかった(柳並木側はこの写真で正しいため、文芸館側のみ差し替え)。
 *   文芸館の建物が写った写真に差し替え(台帳+公式しおり「城崎文芸館」スポットのみ。
 *   「大谿川の柳並木」スポット2件は変更しない)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-9";

type PlaceOnlyTask = { name: string; prefecture: string; fileTitle: string; reason: string };
const PLACE_ONLY_TASKS: PlaceOnlyTask[] = [
  { name: "青の洞門", prefecture: "大分県", fileTitle: "Entrance of Aonodomon Tunnel dug by Zenkai.jpg", reason: "元候補は競秀峰・山国川の遠景で、トンネル自体が分かりにくかった" },
  { name: "西武秩父駅前温泉 祭の湯", prefecture: "埼玉県", fileTitle: "Seibu Chichibu Ekimae Onsen Matsurinoyu.jpg", reason: "元候補は隣接する西武秩父駅の駅舎で、祭の湯自体ではなかった" },
  { name: "水木しげるロード", prefecture: "鳥取県", fileTitle: "Sakaiminato Mizuki Shigeru Road 2.JPG", reason: "元候補は一般的な通りの写真で、水木しげるロードと分かる特徴が写っていなかった" },
];

type PlaceAndOfficialTask = { name: string; prefecture: string; fileTitle: string; photoId: string; spotId: string; reason: string };
const PLACE_AND_OFFICIAL_TASKS: PlaceAndOfficialTask[] = [
  { name: "出雲文化伝承館", prefecture: "島根県", fileTitle: "出雲文化伝承館 - panoramio.jpg", photoId: "9fd8c0fe-584f-4589-808d-172f2cd14634", spotId: "0142d1ea-d37a-4f0a-9d75-d8a0e9e777ae", reason: "島根ワイナリーの試飲販売棟で、別の施設だった" },
  { name: "上高地ビジターセンター", prefecture: "長野県", fileTitle: "Kamikochi Visitor Center.JPG", photoId: "fcc5f86e-b938-4e8e-8d2b-4b7d2837741c", spotId: "163becc7-107f-41bf-89d5-21ab472e275f", reason: "河童橋付近の景色で、センターの建物ではなかった" },
  { name: "城崎文芸館", prefecture: "兵庫県", fileTitle: "Kinosaki bungei01 2816.jpg", photoId: "c4263f5c-a6b3-4825-80ce-dbb808eda7e5", spotId: "84b65fc2-0eb0-4081-ac13-69fffd89427c", reason: "大谿川の柳並木の写真の使い回しで、文芸館自体ではなかった" },
];

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  for (const t of PLACE_ONLY_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    if (place.photoUrl) throw new Error(`既に写真があります(想定外): ${t.name}`);
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason}`);
  }

  for (const t of PLACE_AND_OFFICIAL_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    const photo = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    if (!photo || photo.spotId !== t.spotId) throw new Error(`想定と違います(公式しおり): ${t.name}`);
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason} | 台帳+公式しおり1スポットを差し替え`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const t of PLACE_ONLY_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`書き込み直前に台帳が見つかりません: ${t.name}`);
    const result = await uploadCommonsFile(t.fileTitle, t.name, BLOB_PREFIX);
    if (!result) throw new Error(`画像の取得・ライセンス確認に失敗しました(${t.fileTitle})`);
    console.log(`取得: ${result.url}`, result.credit);
    await prisma.placeMaster.update({
      where: { id: place.id },
      data: {
        photoUrl: result.url,
        photoAuthor: result.credit.author ?? null,
        photoLicense: result.credit.license ?? null,
        photoLicenseUrl: result.credit.licenseUrl ?? null,
        photoSourceUrl: result.credit.sourceUrl ?? null,
      },
    });
    console.log(`  COMMITTED: ${t.name}`);
  }

  for (const t of PLACE_AND_OFFICIAL_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`書き込み直前に台帳が見つかりません: ${t.name}`);
    const result = await uploadCommonsFile(t.fileTitle, t.name, BLOB_PREFIX);
    if (!result) throw new Error(`画像の取得・ライセンス確認に失敗しました(${t.fileTitle})`);
    console.log(`取得: ${result.url}`, result.credit);
    await prisma.placeMaster.update({
      where: { id: place.id },
      data: {
        photoUrl: result.url,
        photoAuthor: result.credit.author ?? null,
        photoLicense: result.credit.license ?? null,
        photoLicenseUrl: result.credit.licenseUrl ?? null,
        photoSourceUrl: result.credit.sourceUrl ?? null,
      },
    });
    await prisma.photo.update({
      where: { id: t.photoId },
      data: {
        url: result.url,
        sourceUrl: result.credit.sourceUrl ?? null,
        author: result.credit.author ?? null,
        license: result.credit.license ?? null,
        licenseUrl: result.credit.licenseUrl ?? null,
      },
    });
    console.log(`  COMMITTED: ${t.name}(台帳+公式しおり)`);
  }
}
main().finally(() => prisma.$disconnect());
