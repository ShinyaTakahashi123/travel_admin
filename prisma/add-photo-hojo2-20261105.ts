/**
 * 組み直したしおりに写真を足す(2026-11-05、しおりえ(制作補助2))。企画運営の依頼(写真の少ない順:
 * a8d24b41 榛名・aea12c13 田貫湖・881f9752 佐渡・9d8e49e5 高野山・40f8801b 堂崎・7f972333 奈良)。表紙は変えない。
 *
 * 使う前に、Commons のファイルの説明・分類・撮影地の座標(あるもの)を確かめ、行き先の場所と合うものだけを選んだ。
 * - 榛名神社: 分類「Haiden, Haruna-jinja」「Built in Japan in 1806」(高崎市の榛名神社の拝殿)
 * - 榛名富士山頂: 説明「Mount Harunafuji, from Harunako Bus Stop」。山頂そのものの写真ではないので、キャプションは「榛名富士」
 * - 村山浅間神社: 説明「村山浅間神社(静岡県富士宮市)」、分類「Murayama-sengen-jinja」
 * - 人穴富士講遺跡: 説明「人穴富士講遺跡入口の鳥居」、分類「Hitoana Fuji-ko Iseki」(墓石の写真は使わない)
 * - 宿根木集落: 説明「宿根木集落」、分類「Shukunegi」(撮影地の座標が佐渡の別の場所の「Shukunegi Post.jpg」は使わない)
 * - 女人堂: 説明「和歌山県伊都郡高野町、高野山の不動坂口にある女人堂」
 * - 楠原教会・水ノ浦教会: 説明「カトリック楠原教会」「カトリック水ノ浦教会」、撮影地の座標がしおりの点から約30m・約170m(外観)
 * - 奈良豆比古神社: 説明「奈良豆比古神社 拝殿」、撮影地の座標が神社の中
 * - 若草山: 説明「Wakakusayama in June 2019」、分類「Deer grazing on Mount Wakakusa」
 * 確認モードでは、Commons からライセンスと出典を読むだけ(画像の保存・DBの書き込みはしない)。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/add-photo-hojo2-20261105.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { fetchCommonsImageInfo, uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261105-h2";

type Task = { itinPrefix: string; spotName: string; fileTitle: string; caption: string };

const TASKS: Task[] = [
  { itinPrefix: "a8d24b41", spotName: "榛名神社", fileTitle: "Haruna jinja haiden.JPG", caption: "榛名神社" },
  { itinPrefix: "a8d24b41", spotName: "榛名富士山頂", fileTitle: "Haruna08.JPG", caption: "榛名富士" },
  { itinPrefix: "aea12c13", spotName: "村山浅間神社", fileTitle: "Murayama Sengen-jinja Shrine.jpg", caption: "村山浅間神社" },
  { itinPrefix: "aea12c13", spotName: "人穴富士講遺跡", fileTitle: "Hitoana Fuji-ko Iseki.jpg", caption: "人穴富士講遺跡" },
  { itinPrefix: "881f9752", spotName: "宿根木集落", fileTitle: "Sado Shukunegi.jpg", caption: "宿根木集落" },
  { itinPrefix: "9d8e49e5", spotName: "女人堂", fileTitle: "Nyonindo 001.jpg", caption: "女人堂" },
  { itinPrefix: "40f8801b", spotName: "楠原教会", fileTitle: "KusuharaChurch.jpg", caption: "楠原教会" },
  { itinPrefix: "40f8801b", spotName: "水ノ浦教会", fileTitle: "MizunouraChurch.jpg", caption: "水ノ浦教会" },
  { itinPrefix: "7f972333", spotName: "奈良豆比古神社", fileTitle: "Naratsuhiko-Jinja-Haiden.jpg", caption: "奈良豆比古神社" },
  { itinPrefix: "7f972333", spotName: "若草山", fileTitle: "Wakakusayama june 2019.jpg", caption: "若草山" },
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
