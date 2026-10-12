/**
 * fix-flagged-official-photos-batch1.ts で八坂庚申堂の写真を直したとき、同じ場所を
 * 使うもう1本の公式しおり(fcaa0edb、清水寺から祇園へ)の八坂庚申堂スポットには、
 * 直す前からそもそも写真が1枚もなかったことが分かった(法務10/13 00:08の指摘で判明。
 * 今回の差し替えで消したものではない)。同じ良い写真を使って、ついでに1枚足す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "2fdd94a5-cfe3-4e79-961e-3b2636d960cb";
const PHOTO_URL = "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/photofix-20261013-b1/%E5%85%AB%E5%9D%82%E5%BA%9A%E7%94%B3%E5%A0%82-p1eknkWgviXBetT5wikoFSjkNC9FpI.jpg";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID }, include: { photos: true } });
  if (!spot) throw new Error("スポットが見つかりません: " + SPOT_ID);
  if (spot.name !== "八坂庚申堂") throw new Error("スポット名が想定と違います: " + spot.name);
  if (spot.photos.length > 0) throw new Error("すでに写真があります");
  console.log(`[確認OK] ${spot.name} に写真を1枚足します`);

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.photo.create({
    data: {
      spotId: SPOT_ID,
      url: PHOTO_URL,
      caption: "八坂庚申堂",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Yasaka_Koshindo,_May_2017.jpg",
      author: "Celuici",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    },
  });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
