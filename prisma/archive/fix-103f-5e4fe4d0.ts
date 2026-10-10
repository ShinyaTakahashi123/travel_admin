/**
 * #103 5e4fe4d0 の直し(6回目)。企画運営(2026-10-01 11:31)の指摘:
 * fix-103eで、法務指摘により「あわら湯のまち広場」の誤った写真(1軒の旅館を
 * 写したもの)を削除した結果、しおりの写真が0枚・表紙もなしになっていた。
 * 決まり(写真は出典・撮影者名・ライセンスを記録、人の顔・店の看板が目立たない
 * ものを使う)に沿って、東尋坊の代わりの写真を1枚追加し、表紙にする。
 *
 * File:Tojinbo cliffs, Fukui Prefecture; September 2019 (01).jpg
 * 撮影者: 雷太(Raita Futo) / CC BY 2.0
 * 内容: 東尋坊の断崖の自然景観のみ。人の顔・店の看板は写っていない。
 * 開いたURL: https://commons.wikimedia.org/wiki/File:Tojinbo_cliffs,_Fukui_Prefecture;_September_2019_(01).jpg
 */
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/b/b2/Tojinbo_cliffs%2C_Fukui_Prefecture%3B_September_2019_%2801%29.jpg";
const SOURCE_URL = "https://commons.wikimedia.org/wiki/File:Tojinbo_cliffs,_Fukui_Prefecture;_September_2019_(01).jpg";
const AUTHOR = "雷太(Raita Futo)";
const LICENSE = "CC BY 2.0";
const LICENSE_URL = "https://creativecommons.org/licenses/by/2.0";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5e4fe4d0%'`);
  const itinId = rows[0].id;
  const tojinbo = await findSpotInItinerary(itinId, { spotName: "東尋坊" });
  const existing = await prisma.photo.findMany({ where: { spotId: tojinbo.id } });
  if (existing.length > 0) throw new Error("東尋坊にすでに写真があります。想定外です。");
  console.log("確認OK: 東尋坊に写真0件、新規追加の準備完了");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const imgRes = await fetch(IMAGE_URL);
  if (!imgRes.ok) throw new Error(`画像の取得に失敗しました: ${imgRes.status}`);
  const jpeg = await toWebJpeg(Buffer.from(await imgRes.arrayBuffer()));
  const blob = await put(`commons-replacement/tojinbo-cliffs.jpg`, jpeg, {
    access: "public",
    addRandomSuffix: true,
  });

  await prisma.photo.create({
    data: {
      spotId: tojinbo.id,
      url: blob.url,
      caption: "東尋坊",
      sourceUrl: SOURCE_URL,
      author: AUTHOR,
      license: LICENSE,
      licenseUrl: LICENSE_URL,
    },
  });
  await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: blob.url } });
  console.log(`追加・表紙設定完了 -> ${blob.url}`);
}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
