/**
 * 写真がなくなったしおりの写真探し ラウンド2。表紙の棚卸し(法務・企画運営の指摘)。
 * 公開中のしおりのうち、表紙が自分のスポットの写真を指していない3本を直す。
 *
 * - b6c6744a(函館): 表紙が1c95d06dの「函館山」の写真を指していた。このしおりに函館山の
 *   スポットはないが、「金森赤レンガ倉庫」に自分のスポットの写真があるため、それを表紙にする。
 * - 1a3f2d39(博多): 表紙が83450b2aの「ベイサイドプレイス博多」の写真(場所も別)を指していた。
 *   このしおりのタイトルにもある「櫛田神社」に自分のスポットの写真があるため、それを表紙にする。
 * - 371e874b(銀山温泉): 表紙がb461a3e0の「銀山温泉」の写真(同じ場所の写真)を指していた。
 *   このしおり自身の「銀山温泉街」「しろがね湯」などの銀山温泉の中心スポットにはまだ写真がないため、
 *   同じ実在の場所を写した自由利用の写真(Evening twilight in Ginzan Onsen town, CC BY-SA 4.0,
 *   さかおり。既存のb461a3e0の写真と同じ出典ファイル)を、このしおり自身の「大正ロマンの旅館の
 *   町並み(能登屋・藤屋ほか)」スポットに新しく取り込んで表紙にする。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofill-20261012-r2";

async function findItinId(prefix: string): Promise<string> {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${prefix}%'`);
  return rows[0].id;
}

async function main() {
  // --- b6c6744a: 既存の自分のスポット写真を表紙にするだけ ---
  const hakodateId = await findItinId("b6c6744a");
  const akarenga = await prisma.spot.findFirst({ where: { name: "金森赤レンガ倉庫", day: { itineraryId: hakodateId } }, include: { photos: true } });
  if (!akarenga || akarenga.photos.length !== 1) throw new Error("b6c6744a: 金森赤レンガ倉庫の写真が想定外です");
  console.log("[確認OK] b6c6744a → 金森赤レンガ倉庫を表紙に:", akarenga.photos[0].url);

  // --- 1a3f2d39: 既存の自分のスポット写真を表紙にするだけ ---
  const hakataId = await findItinId("1a3f2d39");
  const kushida = await prisma.spot.findFirst({ where: { name: "櫛田神社", day: { itineraryId: hakataId } }, include: { photos: true } });
  if (!kushida || kushida.photos.length !== 1) throw new Error("1a3f2d39: 櫛田神社の写真が想定外です");
  console.log("[確認OK] 1a3f2d39 → 櫛田神社を表紙に:", kushida.photos[0].url);

  // --- 371e874b: 新しく自分のスポットに写真を取り込んでから表紙にする ---
  const ginzanId = await findItinId("371e874b");
  const taisho = await prisma.spot.findFirst({ where: { id: "1deb073e-49f2-4aa8-a41c-2411948df60c" }, include: { photos: true } });
  if (!taisho) throw new Error("371e874b: 大正ロマンの旅館の町並みが見つかりません");
  if (taisho.photos.length > 0) throw new Error("371e874b: すでに写真があります");
  console.log("[確認OK] 371e874b → 大正ロマンの旅館の町並みに新規取り込み");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: hakodateId }, data: { thumbnailUrl: akarenga.photos[0].url } });
  console.log("b6c6744a 表紙を更新");

  await prisma.itinerary.update({ where: { id: hakataId }, data: { thumbnailUrl: kushida.photos[0].url } });
  console.log("1a3f2d39 表紙を更新");

  const result = await uploadCommonsFile("Evening twilight in Ginzan Onsen town January 2022 A.jpg", "銀山温泉街", BLOB_PREFIX);
  if (!result) throw new Error("371e874b: 画像の取得・ライセンス確認に失敗しました");
  console.log("371e874b 取得:", result.url, result.credit);
  const newPhoto = await prisma.photo.create({
    data: {
      spotId: taisho.id,
      url: result.url,
      caption: "大正ロマンの旅館の町並み",
      sourceUrl: result.credit.sourceUrl ?? null,
      author: result.credit.author ?? null,
      license: result.credit.license ?? null,
      licenseUrl: result.credit.licenseUrl ?? null,
    },
  });
  await prisma.itinerary.update({ where: { id: ginzanId }, data: { thumbnailUrl: newPhoto.url } });
  console.log("371e874b 表紙を更新");

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
