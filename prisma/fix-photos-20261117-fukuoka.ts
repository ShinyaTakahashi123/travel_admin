/**
 * 福岡(82dc7b17-9451-4569-b46d-c7c9d42153b7、承認待ち)の写真補充(2026-11-17、しおりえ(制作補助2))。
 * 仕様 docs/specs/20261116-new-itineraries-round2.md 第3弾「写真は昼食以外にできるだけ1枚ずつ」。
 * 写真のなかったスポットに、Wikimedia Commons の自由利用の写真を1枚ずつ、実際に画像を見て確かめたうえで追加する
 * (人の顔・店の看板・ポスター・地図・合成なし)。表紙は触らない。
 * - 宗像大社・櫻井神社・千如寺の公式に、境内の撮影を禁じる決まりは見当たらない(千如寺は「個人の撮影につきましては、ご自由に」)
 * - 志賀海神社は、Commons にその場所と分かる使える写真が見つからず足さない(道や海の写真だけ)
 * - 櫻井神社の楼門の写真(Sakurai Shrine Romon Main gate 001.jpg)は、人の顔のポスターが写るため使わない
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "82dc7b17-9451-4569-b46d-c7c9d42153b7";
const BLOB_PREFIX = "official-fukuoka-20261117";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "宗像大社 辺津宮", fileTitle: "Honden of Munakata Grand Shrine (Hetsu Shrine).JPG" },
  { spotName: "金印公園", fileTitle: "Kin-in Park01.jpg" },
  { spotName: "櫻井神社", fileTitle: "Sakurai Shrine Sando＿001.jpg" },
  { spotName: "白糸の滝", fileTitle: "Shiraito Falls.jpg" },
  { spotName: "雷山千如寺大悲王院", fileTitle: "Sennyo-ji Kaede 001.jpg" },
  { spotName: "伊都国歴史博物館", fileTitle: "Itokoku History Museum.JPG" },
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
