/**
 * 奈良(b05b1752-53ae-44cb-b380-52695010f09d、承認待ち)の写真補充・2回目(2026-11-16、しおりえ(制作補助))。
 * 企画運営の依頼(11/16)。ローマ字名・カテゴリでも探し直し、3か所に写真を追加する。
 * - 法隆寺: 松並木の参道(境内の外)から撮った写真。ユーザーの決定(境内の外から撮ったものだけ)に合う
 * - 柳澤神社・春岳院: 参道・門の写真
 * - 町家物語館・斑鳩文化財センターは、ローマ字名・カテゴリでも探したが見つからず、今回も見送り
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "b05b1752-53ae-44cb-b380-52695010f09d";
const BLOB_PREFIX = "official-nara-20261116b";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "法隆寺", fileTitle: "Pine Trees Sando of Horyuji Temple.JPG" },
  { spotName: "柳澤神社", fileTitle: "Yanagisawa-jinja, sandou.jpg" },
  { spotName: "春岳院", fileTitle: "春岳院DSC00330.jpg" },
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
