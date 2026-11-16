/**
 * 沖縄(917fe34f-f92a-4637-8c7d-a8898d2a012c、承認待ち)の写真補充(2026-11-16、しおりえ(制作補助2))。
 * 企画運営の依頼(11/16)。昼食以外で写真のなかったスポットに、Wikimedia Commons の自由利用の写真を
 * 1枚ずつ、実際に画像を見て確かめたうえで追加する(人の顔・店の看板・地図・合成なし)。表紙は触らない。
 * - 知念城跡は、Commons に使える写真が見つからなかったため足さない
 * - 海中道路の File:Kaichu-Doro.jpg は、作者「N」・出典が個人のサイトで、作者がはっきりしないため使わない
 * - 作者名の「~commonswiki」は、アカウントの統合で付いた印で作った人の名前ではないため外す(8章 撮影者名の書き方)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "917fe34f-f92a-4637-8c7d-a8898d2a012c";
const BLOB_PREFIX = "official-okinawa-20261116";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "おきなわワールド（玉泉洞）", fileTitle: "Gyokusendo Nanjo Okinawa Japan17s3104.jpg" },
  { spotName: "糸数城跡", fileTitle: "Itokazu Castle.jpg" },
  { spotName: "海の駅あやはし館（海中道路）", fileTitle: "Seaside Station Ayahashi.jpg" },
  { spotName: "シルミチュー", fileTitle: "Shirumichu Sacred Cave 01.JPG" },
  { spotName: "アマミチューの墓", fileTitle: "Tomb of Amamichu 01.JPG" },
  { spotName: "果報バンタ", fileTitle: "Kafu Banta 202107.jpg" },
  { spotName: "仲原遺跡", fileTitle: "Nakabaru Historic Site 2.jpg" },
];

const cleanAuthor = (a: string | null | undefined) => (a ? a.replace(/~commonswiki$/i, "").trim() : a);

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
    const author = cleanAuthor(uploaded.credit.author);
    await prisma.photo.create({
      data: {
        spotId: spot.id,
        url: uploaded.url,
        caption: t.spotName,
        sourceUrl: uploaded.credit.sourceUrl,
        author,
        license: uploaded.credit.license,
        licenseUrl: uploaded.credit.licenseUrl,
      },
    });
    console.log(`    書き込みました -> ${uploaded.url} (${author} / ${uploaded.credit.license})`);
  }

  if (!commit) console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
}
main().finally(() => prisma.$disconnect());
