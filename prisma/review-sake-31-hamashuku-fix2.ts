/**
 * #31の直し(自己点検)。肥前浜宿酒蔵通り・旧乗田家住宅・浜庄津町浜金屋町の町並みに
 * 写真が0枚だったため、Commonsから取得して追加。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "sake31-hamashuku";

const targets = [
  { spotId: "d75d3d35-08be-4ec7-8f49-3bcace20f45b", name: "肥前浜宿酒蔵通り", file: "Shuzo-dori Street in Hama-Nakamachi Hachihongishuku Area 3.jpg" },
  { spotId: "4750404f-3dd2-4eba-bd1c-166949ae8ad3", name: "旧乗田家住宅", file: "Old Norita-ke House Saga Kashima.JPG" },
];

async function main() {
  const hamakanaya = await prisma.spot.findFirst({ where: { name: "浜庄津町浜金屋町の町並み" }, include: { photos: true } });
  if (!hamakanaya) throw new Error("浜金屋町のスポットが見つかりません(先にreview-sake-31-hamashuku.tsを実行してください)");

  const prepared: { spotId: string; name: string; photo: NonNullable<Awaited<ReturnType<typeof uploadCommonsFile>>> }[] = [];

  for (const t of targets) {
    const spot = await prisma.spot.findUnique({ where: { id: t.spotId }, include: { photos: true } });
    if (!spot) throw new Error("見つかりません: " + t.name);
    if (spot.photos.length > 0) throw new Error("既に写真があります(想定外): " + t.name);
    const photo = await uploadCommonsFile(t.file, t.name, BLOB_PREFIX);
    if (!photo) throw new Error("画像の取得・ライセンス確認に失敗しました: " + t.name);
    console.log("取得:", t.name, photo.url, photo.credit);
    prepared.push({ spotId: t.spotId, name: t.name, photo });
  }

  if (hamakanaya.photos.length === 0) {
    const photo = await uploadCommonsFile("Hamashozumachi Kayabuki-machiya houses.JPG", "浜庄津町浜金屋町の町並み", BLOB_PREFIX);
    if (!photo) throw new Error("画像の取得・ライセンス確認に失敗しました: 浜庄津町浜金屋町の町並み");
    console.log("取得:", "浜庄津町浜金屋町の町並み", photo.url, photo.credit);
    prepared.push({ spotId: hamakanaya.id, name: "浜庄津町浜金屋町の町並み", photo });
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (const p of prepared) {
    await prisma.photo.create({
      data: {
        spotId: p.spotId, url: p.photo.url, caption: p.name,
        sourceUrl: p.photo.credit.sourceUrl ?? null, author: p.photo.credit.author ?? null,
        license: p.photo.credit.license ?? null, licenseUrl: p.photo.credit.licenseUrl ?? null,
      },
    });
  }
  console.log("  COMMITTED:", prepared.length, "件");
}
main().finally(() => prisma.$disconnect());
