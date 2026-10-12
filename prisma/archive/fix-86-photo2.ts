/**
 * #86 c77a7701 法務の指摘(2026-09-30 19:38)。fix-86-photoで差し替えた
 * 写真(20121229-2)は、手前の女性の横顔が大きく写っていたため、さらに
 * 差し替える。Akita_Shimin_Ichiba_20121229-1(同じCommonsカテゴリ)は、
 * 手前の人物が全員後ろ姿・下向き・虎の着ぐるみ(サングラスで顔が隠れている)
 * で、はっきり見える顔がない。外部チェーン店の看板もなく、市場自身の
 * 「50周年」バナーと「秋田市民市場」の案内板が写っている。
 */
import fs from "fs";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const LOCAL_PATH =
  "C:/Users/SHINYA~1/AppData/Local/Temp/claude/c--03-ClaudeCode-01-study/493e8ab8-fbcc-4c80-acd8-8bac16cde999/scratchpad/candidate1-final.jpg";
const SOURCE_URL = "https://commons.wikimedia.org/wiki/File:Akita_Shimin_Ichiba_20121229-1.jpg";
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

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const buf = fs.readFileSync(LOCAL_PATH);
  const jpeg = await toWebJpeg(buf);
  const blob = await put(`commons-replacement/akita-shimin-ichiba-2.jpg`, jpeg, {
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
