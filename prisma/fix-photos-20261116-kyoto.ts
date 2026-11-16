/**
 * 京都(b259c699-71d2-4923-84f4-cc6e2d6cecd3、承認待ち)の写真補充(2026-11-16、しおりえ(制作))。
 * 企画運営の依頼(11/16)。写真のなかった11か所に、Wikimedia Commonsの自由利用の写真を
 * 1枚ずつ、実際に画像を見て確かめたうえで追加する。表紙(thumbnailUrl)は既に設定済みのため触らない。
 *
 * 貴船神社は本宮(既に写真あり)・結社(Yui-no-yashiro)・奥宮(Okumiya)の3か所が別スポットなので、
 * ファイル名で場所が一致することを確認済み。奥の院魔王殿も鞍馬寺本殿(既に写真あり)とは別の点。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "b259c699-71d2-4923-84f4-cc6e2d6cecd3";
const BLOB_PREFIX = "official-kyoto-20261106";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "京都御所", fileTitle: "Kyoto-gosho Kenreimon (closed).JPG" },
  { spotName: "鴨川デルタ", fileTitle: "鴨川デルタ2.jpg" },
  { spotName: "旧三井家下鴨別邸", fileTitle: "旧三井家下鴨別邸主屋.jpg" },
  { spotName: "河合神社", fileTitle: "Kamo-Mioya-jinja, Kawai-jinja keidai.jpg" },
  { spotName: "京都府立植物園", fileTitle: "KyotoBotanicalGarden.jpg" },
  { spotName: "奥の院魔王殿", fileTitle: "Kurama-dera Okunoin Maoden.jpg" },
  { spotName: "貴船神社 結社", fileTitle: "Kifune-jinja Shintô Shrine - Yui-no-yashiro.jpg" },
  { spotName: "貴船神社 奥宮", fileTitle: "Kifune-jinja okumiya-honden.jpeg" },
  { spotName: "八大神社", fileTitle: "Hatidaijinja.jpg" },
  { spotName: "圓光寺", fileTitle: "Enkō-ji, Main Gate 01.jpg" },
  { spotName: "曼殊院門跡", fileTitle: "Mansyuin7327.jpg" },
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
