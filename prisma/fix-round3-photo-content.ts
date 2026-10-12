/**
 * 写真がなくなったしおりの写真探し ラウンド3。法務の指摘(公開中の全数点検で発見、
 * 私が今回新しく付けた写真ではなく、もとからあった写真)。
 *
 * 1. 371e874b(銀山温泉)「最上徳内記念館」: File:Mogami_Tokunai.jpg は1826年の
 *    最上徳内の肖像画で、記念館の建物の写真ではなかった。建物自体の写真に差し替える。
 * 2. 1a3f2d39(博多)「キャナルシティ博多」: File:Canalcityhakata2019.jpg は、建物に
 *    飲み物とヨーグルトの大きな広告看板が写っていた。看板の目立たない写真に差し替える。
 * 3. 1a3f2d39(博多)「川端通商店街」の撮影者欄「ぱちょぴ（投稿者）撮影」を「ぱちょぴ」に整える
 *    (任意の指摘。もとからの写真で、記念館・キャナルシティと同じ機会に直す)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofill-20261012-r3";

async function findItinId(prefix: string): Promise<string> {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${prefix}%'`);
  return rows[0].id;
}

async function main() {
  const ginzanId = await findItinId("371e874b");
  const mogami = await prisma.spot.findFirst({ where: { name: "最上徳内記念館", day: { itineraryId: ginzanId } }, include: { photos: true } });
  if (!mogami || mogami.photos.length !== 1) throw new Error("最上徳内記念館の既存写真が想定外です");
  const mogamiOld = mogami.photos[0];
  if (mogamiOld.sourceUrl !== "https://commons.wikimedia.org/wiki/File:Mogami_Tokunai.jpg") throw new Error("最上徳内記念館の出典が想定外です: " + mogamiOld.sourceUrl);
  console.log("[確認OK] 371e874b 最上徳内記念館 差し替え元:", mogamiOld.id);

  const hakataId = await findItinId("1a3f2d39");
  const ginItin = await prisma.itinerary.findUnique({ where: { id: ginzanId }, select: { thumbnailUrl: true } });
  const hakataItin = await prisma.itinerary.findUnique({ where: { id: hakataId }, select: { thumbnailUrl: true } });

  const canal = await prisma.spot.findFirst({ where: { name: "キャナルシティ博多", day: { itineraryId: hakataId } }, include: { photos: true } });
  if (!canal || canal.photos.length !== 1) throw new Error("キャナルシティ博多の既存写真が想定外です");
  const canalOld = canal.photos[0];
  if (canalOld.sourceUrl !== "https://commons.wikimedia.org/wiki/File:Canalcityhakata2019.jpg") throw new Error("キャナルシティ博多の出典が想定外です: " + canalOld.sourceUrl);
  console.log("[確認OK] 1a3f2d39 キャナルシティ博多 差し替え元:", canalOld.id, "現在の表紙と一致:", hakataItin!.thumbnailUrl === canalOld.url);

  const kawabata = await prisma.spot.findFirst({ where: { name: "川端通商店街", day: { itineraryId: hakataId } } });
  const kawabataPhoto = kawabata ? await prisma.photo.findFirst({ where: { spotId: kawabata.id } }) : null;
  if (!kawabataPhoto || kawabataPhoto.author !== "ぱちょぴ（投稿者）撮影") throw new Error("川端通商店街の撮影者が想定外です: " + kawabataPhoto?.author);
  console.log("[確認OK] 1a3f2d39 川端通商店街 撮影者整形:", kawabataPhoto.id);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  // 1. 最上徳内記念館
  const mogamiResult = await uploadCommonsFile("Mogami Tokunai Memorial Museum 1.jpg", "最上徳内記念館", BLOB_PREFIX);
  if (!mogamiResult) throw new Error("最上徳内記念館: 画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", mogamiResult.url, mogamiResult.credit);
  await prisma.photo.delete({ where: { id: mogamiOld.id } });
  const mogamiNew = await prisma.photo.create({
    data: {
      spotId: mogami.id,
      url: mogamiResult.url,
      caption: "最上徳内記念館",
      sourceUrl: mogamiResult.credit.sourceUrl ?? null,
      author: mogamiResult.credit.author ?? null,
      license: mogamiResult.credit.license ?? null,
      licenseUrl: mogamiResult.credit.licenseUrl ?? null,
    },
  });
  if (ginItin!.thumbnailUrl === mogamiOld.url) {
    await prisma.itinerary.update({ where: { id: ginzanId }, data: { thumbnailUrl: mogamiNew.url } });
    console.log("371e874b 表紙も差し替えました");
  }

  // 2. キャナルシティ博多
  const canalResult = await uploadCommonsFile("Canal City Hakata 20170930.jpg", "キャナルシティ博多", BLOB_PREFIX);
  if (!canalResult) throw new Error("キャナルシティ博多: 画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", canalResult.url, canalResult.credit);
  await prisma.photo.delete({ where: { id: canalOld.id } });
  const canalNew = await prisma.photo.create({
    data: {
      spotId: canal.id,
      url: canalResult.url,
      caption: "キャナルシティ博多",
      sourceUrl: canalResult.credit.sourceUrl ?? null,
      author: canalResult.credit.author ?? null,
      license: canalResult.credit.license ?? null,
      licenseUrl: canalResult.credit.licenseUrl ?? null,
    },
  });
  if (hakataItin!.thumbnailUrl === canalOld.url) {
    await prisma.itinerary.update({ where: { id: hakataId }, data: { thumbnailUrl: canalNew.url } });
    console.log("1a3f2d39 表紙も差し替えました");
  }

  // 3. 川端通商店街 撮影者整形
  await prisma.photo.update({ where: { id: kawabataPhoto.id }, data: { author: "ぱちょぴ" } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
