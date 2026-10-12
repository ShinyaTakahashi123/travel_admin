/**
 * 台帳への写真追加バッチ1で、法務の抜き取り確認(2026-10-13 00:50)により
 * 「その場所そのものの写真ではない」と指摘された5件+任意の2件を直す。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-1";

type Task = { name: string; prefecture: string; fileTitle: string; reason: string };

const TASKS: Task[] = [
  { name: "ジョン万次郎資料館", prefecture: "高知県", fileTitle: "ジョン万次郎資料館 Sep 6, 2019.jpg", reason: "旧写真は中浜万次郎本人の肖像写真で、資料館の建物ではなかった" },
  { name: "すすきの", prefecture: "北海道", fileTitle: "Susukino station (shiden).JPG", reason: "旧写真はKIRIN・NIKKA等の会社の大きな広告看板が中心だった" },
  { name: "ぽんしゅ館 新潟驛店 利き酒番所", prefecture: "新潟県", fileTitle: "Niigata Station Ponsyukan2.jpg", reason: "旧写真は工事中の新潟駅で、店が写っていなかった" },
  { name: "キトラ古墳壁画体験館「四神の館」", prefecture: "奈良県", fileTitle: "Sijinnoyakata.jpg", reason: "旧写真は古墳の墳丘で、体験館の建物ではなかった" },
  { name: "ザ・ヴェランダ石打丸山", prefecture: "新潟県", fileTitle: "Ishiuchi Skiing Resort.jpg", reason: "旧写真は田んぼの中の一軒家が中心で、個人の家のおそれがあった" },
  { name: "けやきひろば", prefecture: "埼玉県", fileTitle: "Keyaki Hiroba 20130821, 001.jpg", reason: "旧写真はさいたまスーパーアリーナで、けやきひろばではなかった(任意の指摘)" },
  { name: "ドムトールン", prefecture: "長崎県", fileTitle: "Domtoren of Huis Ten Bosch 20140118-1.jpg", reason: "旧写真は塔からの眺めで、塔そのものが写っていなかった(任意の指摘)" },
];

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  for (const t of TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const t of TASKS) {
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
}
main().finally(() => prisma.$disconnect());
