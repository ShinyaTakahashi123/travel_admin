/**
 * #26 水神社に写真を追加。OSMのwikimedia_commonsタグに直接リンクされていた
 * 実写真(水神社_うきは市吉井町.jpg、CC BY-SA 4.0)。石の鳥居・狛犬が写っており、
 * 座標もOSMの地物と一致することを確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea-ukiha-mizujinja";

async function main() {
  const spot = await prisma.spot.findFirst({ where: { name: "水神社", dayId: "49402151-658e-46b0-8e52-ece5a1098171" }, include: { photos: true } });
  if (!spot) throw new Error("想定と違います");
  if (spot.photos.length > 0) throw new Error("既に写真があります(想定外)");

  const photo = await uploadCommonsFile("水神社 うきは市吉井町.jpg", "水神社", BLOB_PREFIX);
  if (!photo) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", photo.url, photo.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.photo.create({
    data: {
      spotId: spot.id,
      url: photo.url,
      caption: "水神社",
      sourceUrl: photo.credit.sourceUrl ?? null,
      author: photo.credit.author ?? null,
      license: photo.credit.license ?? null,
      licenseUrl: photo.credit.licenseUrl ?? null,
    },
  });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
