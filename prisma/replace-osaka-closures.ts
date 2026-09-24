/**
 * 大阪府: 閉館・休館スポットの差し替え（スポット名・住所・位置・写真のみ。紹介文は別途ライターが執筆）
 * 1. 大阪松竹座（2026年5月閉場・解体決定）→ 法善寺横丁（550bf094）
 * 2. 大阪市立東洋陶磁美術館（2026年8月〜2027年4月ごろ休館）→ 国立国際美術館（2fd67b8b、2件目の休館先）
 * 実行: npx tsx prisma/replace-osaka-closures.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const commit = process.argv.includes("--commit");

type Replacement = {
  itineraryId: string;
  spotId: string;
  newName: string;
  newAddress: string;
  newLat: number;
  newLng: number;
  imageUrl: string;
  imageFilePage: string;
  imageAuthor: string;
  imageLicense: string;
  imageLicenseUrl: string;
  blobPath: string;
};

const replacements: Replacement[] = [
  {
    itineraryId: "550bf094-cd88-4920-8866-26c35fcba842",
    spotId: "5e746937-a456-494b-a7f9-36b3a5a1504b",
    newName: "法善寺横丁",
    newAddress: "大阪市中央区難波1丁目（法善寺横丁）",
    newLat: 34.6681845,
    newLng: 135.5026705,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Hozenji_Yokocho_2023-11.jpg",
    imageFilePage: "https://commons.wikimedia.org/wiki/File:Hozenji_Yokocho_2023-11.jpg",
    imageAuthor: "Mr.ちゅらさん",
    imageLicense: "CC BY-SA 4.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    blobPath: "osaka-hozenji-yokocho/street.jpg",
  },
];

// 2fd67b8bの東洋陶磁美術館のspotIdは実行時に検索して特定する（複数しおりに同名スポットがあるため）
async function findSecondToyoCeramicSpotId(): Promise<string> {
  const spot = await prisma.spot.findFirst({
    where: { name: "大阪市立東洋陶磁美術館", day: { itineraryId: "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e" } },
    select: { id: true },
  });
  if (!spot) throw new Error("2fd67b8bの東洋陶磁美術館が見つかりません");
  return spot.id;
}

function len(s: string) {
  return [...s].length;
}

async function main() {
  const toyoSpotId = await findSecondToyoCeramicSpotId();
  const all: Replacement[] = [
    ...replacements,
    {
      itineraryId: "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e",
      spotId: toyoSpotId,
      newName: "国立国際美術館",
      newAddress: "大阪市北区中之島4丁目2-55",
      newLat: 34.6916929,
      newLng: 135.492151,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/National_Museum_of_Art_Osaka_in_201407.JPG",
      imageFilePage: "https://commons.wikimedia.org/wiki/File:National_Museum_of_Art_Osaka_in_201407.JPG",
      imageAuthor: "Mc681",
      imageLicense: "CC BY-SA 4.0",
      imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      blobPath: "osaka-kokuritsu-kokusai-bijutsukan/building.jpg",
    },
  ];

  for (const r of all) {
    const spot = await prisma.spot.findUnique({ where: { id: r.spotId }, select: { name: true } });
    console.log(`\n[${r.itineraryId}] ${spot?.name} → ${r.newName}`);

    if (commit) {
      await prisma.spot.updateMany({
        where: { id: r.spotId },
        data: { name: r.newName, address: r.newAddress, lat: r.newLat, lng: r.newLng },
      });

      const res = await fetch(r.imageUrl, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
      const buf = Buffer.from(await res.arrayBuffer());
      const jpeg = await toWebJpeg(buf);
      const blob = await put(r.blobPath, jpeg, { access: "public", addRandomSuffix: true });

      await prisma.photo.deleteMany({ where: { spotId: r.spotId } });
      await prisma.photo.create({
        data: {
          spotId: r.spotId,
          url: blob.url,
          sourceUrl: r.imageFilePage,
          author: r.imageAuthor,
          license: r.imageLicense,
          licenseUrl: r.imageLicenseUrl,
        },
      });
      console.log("  写真を差し替えました:", blob.url);
    }
  }

  console.log(commit ? "\n反映しました。紹介文は別途 update-spot-memos-kyoto.ts / fix-spot-memos-by-id.ts で登録してください。" : "\n確認モードのため反映していません。--commit で反映します。");
  await prisma.$disconnect();
}
main();
