/**
 * 7ec2843d の組み直し(fix-yokohama-7ec2843d.ts)のあとに写真を足して、表紙を替える(2026-11-05、しおりえ(制作補助2))。
 * 組み直しで今の2枚(コスモワールド・赤レンガ倉庫)がスポットと一緒に消え、表紙(thumbnailUrl)が赤レンガ倉庫の写真のまま残るため。
 * - 日本丸メモリアルパーク ← File:Yokohama Nipponmaru 4.jpg(説明「Nippon Maru memorial park in Minatomirai 21, Yokohama」、
 *   分類「Nippon Maru (ship, 1930)」)。表紙にする
 * - 横浜税関 資料展示室 ← File:The Yokohama Customs Building and the Queen’s Tower.jpg(説明「The Yokohama Customs Building and the Queen’s Tower.」、
 *   分類「Yokohama Customs Headquarters」、撮影地 35.448253,139.645072)
 * - 象の鼻パークは Commons に公園そのものの写真がなく(公園から撮った夜景だけ)、日本大通りは見つからず、足さない
 * 確認モードでは、Commons からライセンスと出典を読むだけ(画像の保存・DBの書き込みはしない)。組み直しの前に流すと、
 * 「スポットがまだない」と出る(書き込みは、組み直しのあとでないと止まる)。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/add-photo-7ec2843d-20261105.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { fetchCommonsImageInfo, uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "7ec2843d-c476-4133-9441-300181791c23";
const BLOB_PREFIX = "photoadd-20261105-7ec2";
const OLD_THUMB_HINT = "official-areas-03/"; // 今の表紙(赤レンガ倉庫の写真)の保存先

type Task = { spotName: string; fileTitle: string; caption: string; cover: boolean };
const TASKS: Task[] = [
  { spotName: "日本丸メモリアルパーク", fileTitle: "Yokohama Nipponmaru 4.jpg", caption: "帆船日本丸", cover: true },
  { spotName: "横浜税関 資料展示室", fileTitle: "The Yokohama Customs Building and the Queen’s Tower.jpg", caption: "横浜税関", cover: false },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, thumbnailUrl: true } });
  if (!it) throw new Error("しおりがありません");
  const count = await prisma.photo.count({ where: { spot: { day: { itineraryId: ITIN_ID } } } });
  console.log(`しおり: ${it.title}\n今の写真: ${count}枚／表紙: ${it.thumbnailUrl}`);
  let ready = true;
  for (const t of TASKS) {
    const spots = await prisma.spot.findMany({ where: { name: t.spotName, day: { itineraryId: ITIN_ID } }, include: { photos: true } });
    const info = await fetchCommonsImageInfo(t.fileTitle);
    if (!info) throw new Error(`「${t.fileTitle}」のライセンスが自由利用でないか、取得できません`);
    const state = spots.length === 1 ? (spots[0].photos.length ? "★すでに写真あり" : "OK") : spots.length === 0 ? "スポットがまだない(組み直しの前)" : "★スポットが1つに決まらない";
    if (state !== "OK") ready = false;
    console.log(`■ ${t.spotName}(${state})← ${t.fileTitle}${t.cover ? "(表紙にする)" : ""}\n  キャプション: ${t.caption}\n  出典: ${info.credit.sourceUrl}\n  作者: ${info.credit.author} ／ ライセンス: ${info.credit.license} ${info.credit.licenseUrl ?? ""}`);
    await new Promise((r) => setTimeout(r, 1500));
  }
  if (!COMMIT) return console.log("\n確認モードはここまで。組み直しの書き込みのあとに --commit で取得・書き込みます。");
  if (!ready) throw new Error("スポットの準備ができていません(組み直しの前か、すでに写真があります)");
  if (count !== 0) throw new Error(`写真が0枚ではありません(${count}枚)`);
  if (!it.thumbnailUrl?.includes(OLD_THUMB_HINT)) throw new Error(`表紙が想定と違います ${it.thumbnailUrl}`);

  for (const t of TASKS) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: t.spotName, day: { itineraryId: ITIN_ID } } });
    const result = await uploadCommonsFile(t.fileTitle, t.spotName, BLOB_PREFIX);
    if (!result) throw new Error(`画像の取得・ライセンス確認に失敗しました(${t.fileTitle})`);
    await prisma.photo.create({
      data: { spotId: spot.id, url: result.url, caption: t.caption, sourceUrl: result.credit.sourceUrl ?? null, author: result.credit.author ?? null, license: result.credit.license ?? null, licenseUrl: result.credit.licenseUrl ?? null },
    });
    if (t.cover) await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: result.url } });
    console.log(`「${t.spotName}」を書き込みました${t.cover ? "(表紙も替えた)" : ""}: ${result.url}`);
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
