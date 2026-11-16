/**
 * 和歌山(e1d8a79a-3c56-4eda-b220-0aeb5e7d5451、承認待ち)の写真補充(2026-11-17、しおりえ(制作補助))。
 * 内容確認2の指摘(8章423行): 表紙は、しおりのスポットに付いた写真と同じものにする。
 * 和歌山城のスポットに、表紙と同じ写真(Wakayama Castle, Tenshu and Ohashi-rouka.jpg)を追加する。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "e1d8a79a-3c56-4eda-b220-0aeb5e7d5451";
const BLOB_PREFIX = "official-wakayama-20261117";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "和歌山城", fileTitle: "Wakayama Castle, Tenshu and Ohashi-rouka.jpg" },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITINERARY_ID }, select: { id: true, title: true, status: true, thumbnailUrl: true } });
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
    if (!commit) {
      console.log(`    表紙を ${it.thumbnailUrl} → (このFile:のアップロード後のURL)にそろえる`);
      continue;
    }

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

    console.log(`    表紙を ${it.thumbnailUrl} → ${uploaded.url} にそろえる`);
    await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: uploaded.url } });
    console.log(`    表紙を書き込みました -> ${uploaded.url}`);
  }

  if (!commit) console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
}
main().finally(() => prisma.$disconnect());
