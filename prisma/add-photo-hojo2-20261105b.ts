/**
 * 写真の少ないしおりに写真を足す(2026-11-05、しおりえ(制作補助2))その2。企画運営の依頼の7番目(bb5348fc 出雲・b81511f9 北谷)。表紙は変えない。
 * 前の回(add-photo-hojo2-20261105.ts、633ab74)と同じ作り。
 *
 * 使う前に、Commons のファイルの説明・分類を確かめ、行き先の場所と合うものだけを選んだ。
 * - 出雲弥生の森博物館と西谷墳墓群: 説明「Scenery of Nishidani graves 4th, 3rd and 2nd」、分類「Nishidani Ancient Graves」(弥生時代の墳丘墓の景色)
 * - 荒神谷博物館と荒神谷遺跡: 説明「Koujindani remains discovery site of bronze swords and halberds and doutaku」、分類「Koujindani Remains」
 * - 加茂岩倉遺跡は、Commons に遺跡そのものの自由利用の写真がなく(博物館の銅鐸の写真だけ)、見送った。命主社・出雲阿国の墓(墓)も使わない
 * - 中城城跡: 説明「Main gate of Nakagusuku Castle ruins」、分類「Main Gate, Nakagusuku Castle」
 * - 中村家住宅: 説明「Nakamura House in Kitanakagusuku」、分類「Nakamura House (Kitanakagusuku)」
 * 確認モードでは、Commons からライセンスと出典を読むだけ(画像の保存・DBの書き込みはしない)。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/add-photo-hojo2-20261105b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { fetchCommonsImageInfo, uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261105-h2b";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "bb5348fc", spotName: "出雲弥生の森博物館と西谷墳墓群", fileTitle: "Nishidani Garves 01.JPG", caption: "西谷墳墓群" },
  { itinPrefix: "bb5348fc", spotName: "荒神谷博物館と荒神谷遺跡", fileTitle: "Koujindani Remains 01.JPG", caption: "荒神谷遺跡" },
  { itinPrefix: "b81511f9", spotName: "中城城跡", fileTitle: "Nakagusuku-Castle Entrance.jpg", caption: "中城城跡" },
  { itinPrefix: "b81511f9", spotName: "中村家住宅", fileTitle: "Nakamura House Kitanakagusuku01n3104.jpg", caption: "中村家住宅" },
];

async function findSpot(task: Task) {
  const rows: { id: string }[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like $1`, `${task.itinPrefix}%`);
  if (rows.length !== 1) throw new Error(`${task.itinPrefix}: しおりが1本に決まりません(${rows.length})`);
  const spots = await prisma.spot.findMany({ where: { name: task.spotName, day: { itineraryId: rows[0].id } }, include: { photos: true } });
  if (spots.length !== 1) throw new Error(`${task.itinPrefix}: スポット「${task.spotName}」が1つに決まりません(${spots.length})`);
  if (spots[0].photos.length > 0) throw new Error(`${task.itinPrefix}: 「${task.spotName}」にはすでに写真があります`);
  const count = await prisma.photo.count({ where: { spot: { day: { itineraryId: rows[0].id } } } });
  return { spot: spots[0], count };
}

async function main() {
  for (const task of TASKS) {
    const { count } = await findSpot(task);
    const info = await fetchCommonsImageInfo(task.fileTitle);
    if (!info) throw new Error(`${task.itinPrefix}: 「${task.fileTitle}」のライセンスが自由利用でないか、取得できません`);
    console.log(`■ ${task.itinPrefix}(今 ${count}枚)「${task.spotName}」← ${task.fileTitle}\n  キャプション: ${task.caption}\n  出典: ${info.credit.sourceUrl}\n  作者: ${info.credit.author} ／ ライセンス: ${info.credit.license} ${info.credit.licenseUrl ?? ""}`);
    await new Promise((r) => setTimeout(r, 1500));
  }

  if (!COMMIT) return console.log("\n確認モードはここまで。内容に問題なければ --commit で取得・書き込みます。");

  for (const task of TASKS) {
    const { spot } = await findSpot(task);
    const result = await uploadCommonsFile(task.fileTitle, task.spotName, BLOB_PREFIX);
    if (!result) throw new Error(`${task.itinPrefix}: 画像の取得・ライセンス確認に失敗しました(${task.fileTitle})`);
    await prisma.photo.create({
      data: {
        spotId: spot.id,
        url: result.url,
        caption: task.caption,
        sourceUrl: result.credit.sourceUrl ?? null,
        author: result.credit.author ?? null,
        license: result.credit.license ?? null,
        licenseUrl: result.credit.licenseUrl ?? null,
      },
    });
    console.log(`${task.itinPrefix} 「${task.spotName}」を書き込みました: ${result.url}`);
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
