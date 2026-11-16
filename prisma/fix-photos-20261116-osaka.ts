/**
 * 大阪(3c5a333c-dfed-43e1-945a-f94fbb8205ae、承認待ち)の写真補充(2026-11-16、しおりえ(制作))。
 * 企画運営の依頼(11/16)。写真のなかった9か所に、Wikimedia Commonsの自由利用の写真を
 * 1枚ずつ、実際に画像を見て確かめたうえで追加する。表紙(thumbnailUrl)は既に設定済みのため触らない。
 *
 * 豊国神社は、同名の神社が京都・長浜(滋賀)にもあるため要注意。ここで使うFile:Hōkoku Shrine
 * (Osaka).jpgは、ja.wikipedia「豊國神社 (大阪市)」の本文画像で、大阪城公園内のものと確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "3c5a333c-dfed-43e1-945a-f94fbb8205ae";
const BLOB_PREFIX = "official-osaka-20261106";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "大阪歴史博物館", fileTitle: "Osaka Museum of History Osaka JPN 001.jpg" },
  { spotName: "西の丸庭園", fileTitle: "Nishinomaru Garden Osaka Castle01s5s3200.jpg" },
  { spotName: "豊国神社", fileTitle: "Hōkoku Shrine (Osaka).jpg" },
  { spotName: "玉造稲荷神社", fileTitle: "Tamatsukuri-inari-jinja haiden.jpeg" },
  { spotName: "太陽の塔", fileTitle: "Outside view of the Tower of the Sun in Osaka, Japan.jpg" },
  { spotName: "国立民族学博物館", fileTitle: "National Museum of Ethnology 20201109 03.jpg" },
  { spotName: "EXPO'70パビリオン", fileTitle: "EXPO '70 PAVILION.JPG" },
  { spotName: "自然観察学習館（moricara）", fileTitle: "Nature Observation and Study Hall.JPG" },
  { spotName: "ソラード（森の空中観察路）", fileTitle: "Panorama View Hill of Aerial Promenade.JPG" },
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
