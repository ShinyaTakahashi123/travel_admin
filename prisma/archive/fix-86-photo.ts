/**
 * #86 c77a7701 企画運営の指摘(2026-09-30 19:25)。秋田市民市場の表紙写真に
 * コンビニ(サンクス)の看板が大きく写っていたため、Wikimedia Commonsの
 * 「Akita Shimin Market」カテゴリから、市場の内部(鮮魚コーナー、市場自身の
 * 「50年」バナー、個々の店の看板のみ)を撮った代わりの写真に差し替える。
 * File:Akita Shimin Ichiba 20121229-2.jpg / 撮影者 掬茶 / CC BY-SA 4.0
 */
import fs from "fs";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const LOCAL_PATH =
  "C:/Users/SHINYA~1/AppData/Local/Temp/claude/c--03-ClaudeCode-01-study/493e8ab8-fbcc-4c80-acd8-8bac16cde999/scratchpad/candidate2.jpg";
const SOURCE_URL = "https://commons.wikimedia.org/wiki/File:Akita_Shimin_Ichiba_20121229-2.jpg";
const AUTHOR = "掬茶";
const LICENSE = "CC BY-SA 4.0";
const LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c77a7701%'`);
  const itinId = rows[0].id;
  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const spot = await findSpotInItinerary(itinId, { spotName: "秋田市民市場" });
  const photo = await prisma.photo.findFirst({ where: { spotId: spot.id } });
  if (!photo) throw new Error("写真が見つかりません");
  console.log("現在の写真:", photo.url);
  console.log("差し替え先(ローカル確認用):", LOCAL_PATH);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const buf = fs.readFileSync(LOCAL_PATH);
  const jpeg = await toWebJpeg(buf);
  const blob = await put(`commons-replacement/akita-shimin-ichiba.jpg`, jpeg, {
    access: "public",
    addRandomSuffix: true,
  });
  await prisma.photo.update({
    where: { id: photo.id },
    data: { url: blob.url, sourceUrl: SOURCE_URL, author: AUTHOR, license: LICENSE, licenseUrl: LICENSE_URL },
  });
  const updated = await prisma.itinerary.updateMany({
    where: { thumbnailUrl: photo.url },
    data: { thumbnailUrl: blob.url },
  });
  console.log(`差し替え完了 -> ${blob.url}（サムネイル更新: ${updated.count}件）`);
}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
