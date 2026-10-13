/**
 * 法務指摘(2026-10-13)の写真の直し。
 * 1. #26 居蔵の館: 誤った写真(日岡古墳出土の埴輪、別の場所)を削除し、
 *    建物自体の実写真(Igura House in Chikugo-Yoshii Area.jpg、CC BY-SA 4.0、
 *    「居蔵の館」の案内板が写り込んでいることを目視で確認済み)に差し替え
 * 2. #22 奈半利の町並み（昼食）: 誤った写真(中央公園の広場、町並みではない)を
 *    削除。代わりの実写真をCommonsで探したが、見つかったもの(奈半利駅からの
 *    眺め)は現代的な商業地の風景で、メモの内容(水切瓦・白壁の町並み)と
 *    合わないため使わず、写真なしにする
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea-ukiha-igura";

const IGURA_SPOT_ID = "ef991f1d-a925-4c5c-b8f4-666fb36fbf2c";
const IGURA_OLD_PHOTO_ID = "76cbb874-b0f3-43f1-a713-02a18d328dbd";

const NAHARI_OLD_PHOTO_ID = "5837237e-9e27-4538-96b4-fdcefffc1485";

async function main() {
  const iguraOldPhoto = await prisma.photo.findUnique({ where: { id: IGURA_OLD_PHOTO_ID } });
  const naharaiOldPhoto = await prisma.photo.findUnique({ where: { id: NAHARI_OLD_PHOTO_ID } });
  if (!iguraOldPhoto || !naharaiOldPhoto) throw new Error("想定と違います(すでに削除済みの可能性)");

  const newPhoto = await uploadCommonsFile("Igura House in Chikugo-Yoshii Area.jpg", "居蔵の館", BLOB_PREFIX);
  if (!newPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", newPhoto.url, newPhoto.credit);

  console.log("[確認OK] 居蔵の館の誤った写真を削除し、新しい写真に差し替え");
  console.log("[確認OK] 奈半利の町並み（昼食）の誤った写真を削除(代わりなし)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.photo.delete({ where: { id: IGURA_OLD_PHOTO_ID } });
  await prisma.photo.create({
    data: {
      spotId: IGURA_SPOT_ID,
      url: newPhoto.url,
      caption: "居蔵の館",
      sourceUrl: newPhoto.credit.sourceUrl ?? null,
      author: newPhoto.credit.author ?? null,
      license: newPhoto.credit.license ?? null,
      licenseUrl: newPhoto.credit.licenseUrl ?? null,
    },
  });

  await prisma.photo.delete({ where: { id: NAHARI_OLD_PHOTO_ID } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
