/**
 * 03330540(冬の富良野・美瑛)の写真補充(2026-11-06、しおりえ(制作))。
 * 2026-10-12の写真補充作業(docs/content/20261012-photo-fill.md 165行)で保留になっていたもの。
 * 企画運営の指示(11/06)で再調査:
 * - 青い池・白ひげの滝・新栄の丘展望公園・四季彩の丘は、Wikimedia Commons(カテゴリ・サブカテゴリ
 *   「Shirogane Blue Pond by night」含む)にも、美瑛町・北海道などの公式写真ライブラリにも、
 *   冬(雪・氷)または季節不明の自由利用の写真が見つからなかった(前回調査と同じ結論)
 * - 富良野市博物館はWikipedia記事・Commonsともに写真なし
 * - 富良野チーズ工房は、牛の像の写真が人の顔がはっきり写っており不可、チーズの写真はブランドの
 *   ロゴが大きく写っており不可
 * - ふらのワイン工場のワインセラー内部(File:Furano Winery-2.jpg)が、屋内で季節が写らず、
 *   人の顔もないため使える(建物外観(Furano Winery.jpg)は夏とわかる緑の木々が写るため使わない)
 * 見つかったのがこの1枚のみのため、この1枚を使い、表紙もこれにする(企画運営11/06指示の案3)。
 * ライセンス: CC0(パブリックドメイン相当)、撮影者 Drivephotographer、
 * 出典 https://commons.wikimedia.org/wiki/File:Furano_Winery-2.jpg
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-photo-03330540.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const commit = process.argv.includes("--commit");
const ITIN_ID_PREFIX = "03330540";
const SPOT_ID = "4c1581da-23fc-4db6-8895-5dd900954cd6"; // ふらのワイン工場
const SPOT_NAME_EXPECT = "ふらのワイン工場";
const FILE_TITLE = "Furano Winery-2.jpg";

async function main() {
  const rows: { id: string }[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like $1`, `${ITIN_ID_PREFIX}%`);
  if (rows.length !== 1) throw new Error("しおりが1本に決まりません");
  const it = await prisma.itinerary.findUnique({ where: { id: rows[0].id }, select: { id: true, thumbnailUrl: true } });
  if (!it) throw new Error("しおりが見つかりません");
  if (it.thumbnailUrl) throw new Error(`既に表紙が設定されています: ${it.thumbnailUrl}`);

  const spot = await prisma.spot.findUnique({
    where: { id: SPOT_ID },
    include: { photos: true, day: { select: { itineraryId: true } } },
  });
  if (!spot) throw new Error("スポットが見つかりません");
  if (spot.name !== SPOT_NAME_EXPECT) throw new Error(`スポット名が想定と違います: ${spot.name}`);
  if (spot.day.itineraryId !== it.id) throw new Error("スポットがこのしおりに属していません");
  if (spot.photos.length !== 0) throw new Error(`既に写真があります(${spot.photos.length}枚)`);

  console.log(`■ ${spot.name} に File:${FILE_TITLE} を追加し、しおりの表紙にします。`);
  if (!commit) {
    console.log("確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }

  const uploaded = await uploadCommonsFile(FILE_TITLE, spot.name, "official-03330540");
  if (!uploaded) throw new Error("Commonsからの取得・ライセンス確認に失敗しました");
  console.log(`アップロードOK -> ${uploaded.url}`);

  await prisma.$transaction(async (tx) => {
    await tx.photo.create({
      data: {
        spotId: spot.id,
        url: uploaded.url,
        caption: spot.name,
        sourceUrl: uploaded.credit.sourceUrl,
        author: uploaded.credit.author,
        license: uploaded.credit.license,
        licenseUrl: uploaded.credit.licenseUrl,
      },
    });
    await tx.itinerary.update({ where: { id: it.id }, data: { thumbnailUrl: uploaded.url } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
