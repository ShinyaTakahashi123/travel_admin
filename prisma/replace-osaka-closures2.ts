/**
 * 大阪松竹座（2026年5月閉場・解体決定）のもう1件の差し替え漏れ対応
 * 「アメリカ村で古着ハンティング、若者文化を楽しむミナミ散策プラン」(fe97b3b3) → 法善寺横丁
 * 実行: npx tsx prisma/replace-osaka-closures2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const commit = process.argv.includes("--commit");

const ITINERARY_ID = "fe97b3b3-ed31-428e-bdac-1ccebda6bb24";
const SPOT_ID = "0902c353-4bf9-4ecf-b0d6-b5665b7f277e";

const newName = "法善寺横丁";
const newAddress = "大阪市中央区難波1丁目（法善寺横丁）";
const newLat = 34.6681845;
const newLng = 135.5026705;

const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/9/91/Hozenji_Yokocho_2023-11.jpg";
const imageFilePage = "https://commons.wikimedia.org/wiki/File:Hozenji_Yokocho_2023-11.jpg";
const imageAuthor = "Mr.ちゅらさん";
const imageLicense = "CC BY-SA 4.0";
const imageLicenseUrl = "https://creativecommons.org/licenses/by-sa/4.0/";
const blobPath = "osaka-hozenji-yokocho/street2.jpg";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID }, select: { name: true } });
  console.log(`[${ITINERARY_ID}] ${spot?.name} → ${newName}`);

  if (commit) {
    await prisma.spot.updateMany({
      where: { id: SPOT_ID },
      data: { name: newName, address: newAddress, lat: newLat, lng: newLng },
    });

    const res = await fetch(imageUrl, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
    const buf = Buffer.from(await res.arrayBuffer());
    const jpeg = await toWebJpeg(buf);
    const blob = await put(blobPath, jpeg, { access: "public", addRandomSuffix: true });

    await prisma.photo.deleteMany({ where: { spotId: SPOT_ID } });
    await prisma.photo.create({
      data: {
        spotId: SPOT_ID,
        url: blob.url,
        sourceUrl: imageFilePage,
        author: imageAuthor,
        license: imageLicense,
        licenseUrl: imageLicenseUrl,
      },
    });
    console.log("  写真を差し替えました:", blob.url);
  }

  const it = await prisma.itinerary.findUnique({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (it?.description?.includes("大阪松竹座")) {
    const newDesc = it.description.replace("大阪松竹座", "法善寺横丁");
    console.log(`\n[説明文パッチ]`);
    console.log(`  旧: ${it.description}`);
    console.log(`  新: ${newDesc}`);
    if (commit) {
      await prisma.itinerary.updateMany({ where: { id: ITINERARY_ID }, data: { description: newDesc } });
    }
  }

  console.log(commit ? "\n反映しました。紹介文は別途登録してください。" : "\n確認モードのため反映していません。--commit で反映します。");
  await prisma.$disconnect();
}
main();
