/**
 * 和歌山(e1d8a79a-3c56-4eda-b220-0aeb5e7d5451、承認待ち)の写真補充・2回目(2026-11-17、しおりえ(制作補助))。
 * 企画運営の依頼。昼食以外で写真のなかったスポットに、Wikimedia Commons の自由利用の写真を
 * 1枚ずつ、実際に画像を見て確かめたうえで追加する(法務2の確認済み・11/17)。
 * 近代美術館はCommonsのレート制限で画像を確認できず、今回は見送り。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "e1d8a79a-3c56-4eda-b220-0aeb5e7d5451";
const BLOB_PREFIX = "official-wakayama-20261117b";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "岡口門", fileTitle: "Wakayama Castle Okaguchimon.jpg" },
  { spotName: "県立博物館", fileTitle: "Wakayama Prefectural Museum1.jpg" },
  { spotName: "紀伊風土記の丘", fileTitle: "Pit House in Kiifudoki-no-oka museum of history.jpg" },
  { spotName: "西之丸庭園(紅葉渓庭園)", fileTitle: "Momijidaniteien1 (Wakayama Castle).jpg" },
  { spotName: "紀州東照宮", fileTitle: "Kisyu Toshogu tomon.jpg" },
  { spotName: "和歌浦天満宮", fileTitle: "Wakaura Tenmangu haiden+honden.jpg" },
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
