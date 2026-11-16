/**
 * 川崎大師(a640202e、承認待ち)の写真補充(2026-11-17、しおりえ(制作))。
 * 写真のなかった行き先に、Wikimedia Commonsの自由利用の写真を1枚ずつ、実際に画像を見て
 * 確かめたうえで追加する(法務11/17確認済み)。表紙は変えない。
 *
 * - 稲毛神社: Kawasaki Inage-jinja Torii.jpg(妖精書士、CC BY-SA 3.0)。鳥居越しに本殿、人は写っていない
 * - 總持寺: Soji-ji Sanmon.jpg(Suikotei、CC BY-SA 4.0)。三門の外観、門の下の人影は遠く小さい
 * 昼食の仲見世通りには、決まりにより写真を付けない。
 *
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-photos-20261117-kawasakidaishi.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "a640202e-80a7-47c7-94bd-728ab553da59";
const BLOB_PREFIX = "official-kawasakidaishi-20261117";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "稲毛神社", fileTitle: "Kawasaki Inage-jinja Torii.jpg" },
  { spotName: "總持寺", fileTitle: "Soji-ji Sanmon.jpg" },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITINERARY_ID }, select: { id: true, title: true, status: true } });
  if (!it) throw new Error("しおりが見つかりません");
  console.log(`■ ${it.title} (${it.status})`);

  for (const t of TARGETS) {
    const spot = await findSpotInItinerary(ITINERARY_ID, { spotName: t.spotName });
    const existing = await prisma.photo.count({ where: { spotId: spot.id } });
    if (existing !== 0) {
      console.log(`  - ${t.spotName}: 既に写真が${existing}枚あるためスキップ`);
      continue;
    }
    console.log(`  - ${t.spotName} (spotId=${spot.id}) <- File:${t.fileTitle}`);
    if (!commit) continue;

    const uploaded = await uploadCommonsFile(t.fileTitle, t.spotName, BLOB_PREFIX);
    if (!uploaded) throw new Error(`${t.spotName}: Commonsからの取得・ライセンス確認に失敗しました(File:${t.fileTitle})`);
    await prisma.photo.create({
      data: {
        spotId: spot.id,
        url: uploaded.url,
        caption: t.spotName,
        sourceUrl: uploaded.credit.sourceUrl,
        author: uploaded.credit.author,
        license: uploaded.credit.license,
        licenseUrl: uploaded.credit.licenseUrl,
      },
    });
    console.log(`    書き込みました -> ${uploaded.url} (${uploaded.credit.author} / ${uploaded.credit.license})`);
  }

  if (!commit) console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
}
main().finally(() => prisma.$disconnect());
