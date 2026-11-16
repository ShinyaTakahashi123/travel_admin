/**
 * 東京(b12da484-5761-4526-918e-12a8a325da85、承認待ち)の写真補充(2026-11-16、しおりえ(制作))。
 * 企画運営の依頼(11/16、ユーザー「写真が結構ないけど、取れなかった？」)。
 * 写真のなかった7か所に、Wikimedia Commonsの自由利用の写真を1枚ずつ、実際に画像を見て
 * 確かめたうえで追加する。表紙(thumbnailUrl)は既に設定済みのため触らない。
 *
 * 出典・ライセンス(すべてCC0/CC BY/CC BY-SA、看板・顔のはっきりした写り込みなし。確認内容は
 * 企画運営・法務への報告メッセージに記載):
 * - 皇居外苑: Imperial Palace Outer Gardens Tokyo Japan.jpg (MariaAngelesPhoto, CC BY 4.0)
 * - 日比谷公園: Hibiya Park (53081478089).jpg (Dick Thomas Johnson from Tokyo, Japan, CC BY 2.0)
 * - 銀座四丁目交差点: Headquarters of Wako at Ginza 4-Chome Crossroads.JPG (そらみみ, CC BY-SA 4.0)
 * - 増上寺: Zojoji temple.jpg (Stéfan Le Dû, CC BY-SA 2.5)
 * - 東京都庁舎第一本庁舎: Tokyo Metropolitan Government Building No.1 - Shinjuku, Tokyo - DSC05442.jpg (Daderot, CC0)
 * - 六本木ヒルズ森タワー: Roppongi-Mori-Tower-01.jpg (Rs1421, CC BY-SA 3.0)
 * - 東京ミッドタウン(檜町公園): Garden @ Tokyo Midtown @ Roppongi (14086800647).jpg (Guilhem Vellut from Annecy, France, CC BY 2.0)
 *
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-photos-20261116-tokyo.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "b12da484-5761-4526-918e-12a8a325da85";
const BLOB_PREFIX = "official-tokyo-20261106";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "皇居外苑", fileTitle: "Imperial Palace Outer Gardens Tokyo Japan.jpg" },
  { spotName: "日比谷公園", fileTitle: "Hibiya Park (53081478089).jpg" },
  { spotName: "銀座四丁目交差点", fileTitle: "Headquarters of Wako at Ginza 4-Chome Crossroads.JPG" },
  { spotName: "増上寺", fileTitle: "Zojoji temple.jpg" },
  { spotName: "東京都庁舎第一本庁舎", fileTitle: "Tokyo Metropolitan Government Building No.1 - Shinjuku, Tokyo - DSC05442.jpg" },
  { spotName: "六本木ヒルズ森タワー", fileTitle: "Roppongi-Mori-Tower-01.jpg" },
  { spotName: "東京ミッドタウン(檜町公園)", fileTitle: "Garden @ Tokyo Midtown @ Roppongi (14086800647).jpg" },
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
