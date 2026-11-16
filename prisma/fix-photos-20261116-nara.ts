/**
 * 奈良(b05b1752-53ae-44cb-b380-52695010f09d、承認待ち)の写真補充(2026-11-16、しおりえ(制作補助))。
 * 企画運営の依頼(11/16)。昼食以外で写真のなかったスポットに、Wikimedia Commons の自由利用の写真を
 * 1枚ずつ、実際に画像を見て確かめたうえで追加する(人の顔・店の看板・地図・合成なし)。表紙は触らない。
 * - 法隆寺は、境内の外から撮った写真が見つからなかったため、今回も足さない(ユーザーの決定11/16)
 * - 斑鳩文化財センター・龍田大社の摂社・郡山城跡以外の柳澤神社・春岳院・町家物語館は、Commonsに
 *   使える写真が見つからなかったため足さない
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "b05b1752-53ae-44cb-b380-52695010f09d";
const BLOB_PREFIX = "official-nara-20261116";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "中宮寺", fileTitle: "Chuguji Hondo 2008.jpg" },
  { spotName: "柳沢文庫", fileTitle: "柳沢文庫DSC00095.jpg" },
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
