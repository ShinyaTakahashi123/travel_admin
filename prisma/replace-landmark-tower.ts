/**
 * 横浜ランドマークタワー（展望フロア「スカイガーデン」が2026年1月1日から休止、再開2028年以降）を
 * 横浜港大さん橋国際客船ターミナル（屋上「くじらのせなか」）に差し替える
 * 実行: npx tsx prisma/replace-landmark-tower.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const commit = process.argv.includes("--commit");

const ITINERARY_ID = "76319c13-42b7-4093-aa4f-6ef2dd45fd0d";
const SPOT_ID = "de949c6e-e72e-44ab-9410-e46084d601fc";

const newName = "横浜港大さん橋国際客船ターミナル";
const newAddress = "横浜市中区海岸通1-1-4";
const newLat = 35.4519425;
const newLng = 139.6479434;
const newMemo =
  "みなとみらい線・日本大通り駅から徒歩約7分、世界各国のクルーズ客船が発着する、横浜港の海の玄関口が横浜港大さん橋国際客船ターミナルです。大さん橋ふ頭そのものは1894年(明治27年)に完成した歴史ある埠頭で、現在のターミナル施設は2002年に建て替えられました。世界41か国から660点もの応募があった国際設計競技で選ばれた、建築家ユニット「フォーリン・オフィス・アーキテクツ」によるデザインが特徴です。屋上に広がる広場は、建物の屋根が波のうねりのようなゆるやかな2つの山形を描いていることから「くじらのせなか」の愛称で親しまれています。天然芝とウッドデッキが広がるこの屋上広場は24時間無料で開放されていて、みなとみらいのビル群と海を一望できる、横浜屈指の絶景スポットです。潮風を感じながら景色を楽しんだら、次はみなとみらいのシンボル、横浜赤レンガ倉庫へ向かいましょう。";

const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/ec/Oosanbashi_futo_building01s3200.jpg";
const imageFilePage = "https://commons.wikimedia.org/wiki/File:Oosanbashi_futo_building01s3200.jpg";
const imageAuthor = "663highland";
const imageLicense = "CC BY 2.5";
const imageLicenseUrl = "https://creativecommons.org/licenses/by/2.5/";
const blobPath = "yokohama-osanbashi/terminal.jpg";

function len(s: string) {
  return [...s].length;
}

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID }, select: { name: true, memo: true } });
  console.log(`[${ITINERARY_ID}] ${spot?.name} → ${newName}`);
  console.log(`  新memo(${len(newMemo)}字): ${newMemo}`);
  if (len(newMemo) < 150) console.log("  !! 150字未満");

  if (commit) {
    await prisma.spot.updateMany({
      where: { id: SPOT_ID },
      data: { name: newName, address: newAddress, lat: newLat, lng: newLng, memo: newMemo },
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

  // 説明文パッチ
  const it = await prisma.itinerary.findUnique({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (it?.description?.includes("横浜ランドマークタワー")) {
    const newDesc = it.description.replace("横浜ランドマークタワー", "横浜港大さん橋「くじらのせなか」");
    console.log(`\n[説明文パッチ]`);
    console.log(`  旧: ${it.description}`);
    console.log(`  新: ${newDesc}`);
    if (commit) {
      await prisma.itinerary.updateMany({ where: { id: ITINERARY_ID }, data: { description: newDesc } });
    }
  }

  console.log(commit ? "\n反映しました。" : "\n確認モードのため反映していません。--commit で反映します。");
  await prisma.$disconnect();
}
main();
