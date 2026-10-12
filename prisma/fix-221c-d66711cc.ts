/**
 * #221 d66711cc の写真の直し（しおりえ(制作補助2)）
 * 1日目の最初のスポット（もとサンライズ糸山、今は今治糸山レンタサイクル）の写真は、説明が「サンライズ糸山」でも、
 *   ウィキメディア・コモンズの撮影位置が 34.304290,133.150635（尾道・向島のあたり）で、ファイル名も「尾道市街地～向島（しまなみ海道起点）」だった
 *   （https://commons.wikimedia.org/wiki/File:%E3%81%97%E3%81%BE%E3%81%AA%E3%81%BF%E6%B5%B7%E9%81%93.jpg ）。糸山ではないので外す
 * 表紙（thumbnailUrl）は、2日目の多々羅大橋の写真（Tatara_Bridge.jpg）にする。photo-cache.json にこの写真の行はない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-221c-d66711cc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "d66711cc-25fd-406e-b98d-3155df878f5c";
const WRONG_PHOTO = "e1c08f87-781b-44df-82cb-5be49d64847a";
const TATARA_PHOTO = "fcafe33a-5aac-45c4-b57e-4c84fd5048d9";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  const wrong = await prisma.photo.findUniqueOrThrow({ where: { id: WRONG_PHOTO }, include: { spot: true } });
  const tatara = await prisma.photo.findUniqueOrThrow({ where: { id: TATARA_PHOTO }, include: { spot: true } });
  if (wrong.spot.name !== "今治糸山レンタサイクル" || tatara.spot.name !== "多々羅大橋" || it.thumbnailUrl !== wrong.url) throw new Error("構成が想定と違います");
  console.log(`外す: ${wrong.url}\n表紙: ${tatara.url}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: tatara.url } }),
    prisma.photo.delete({ where: { id: WRONG_PHOTO } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
