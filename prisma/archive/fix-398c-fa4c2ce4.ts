/**
 * #398 fa4c2ce4 の追いの修正その2（しおりえ(制作補助2)、企画運営の指示）
 * - 表紙がなくなったので、被写体が合っている「一斗俵沈下橋」の写真を付け、しおりの表紙にも使う
 *   写真: https://commons.wikimedia.org/wiki/File:一斗俵沈下橋_-_panoramio.jpg（sk01、CC BY-SA 3.0。位置情報 33.284420,133.109800 が橋の位置と一致、目で見て欄干のない沈下橋であることを確認）
 * - 源流点の写真の候補（四万十川源流点_-_panoramio.jpg）は、谷の案内板を写したもので源流点そのものではなく、透かし文字もあるので使わない（源流点は写真なしのまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-398c-fa4c2ce4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "fa4c2ce4-3769-458a-888f-3212199fd34a";
const COMMIT = process.argv.includes("--commit");
const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/4/44/%E4%B8%80%E6%96%97%E4%BF%B5%E6%B2%88%E4%B8%8B%E6%A9%8B_-_panoramio.jpg";
const FILE_PAGE = "https://commons.wikimedia.org/wiki/File:%E4%B8%80%E6%96%97%E4%BF%B5%E6%B2%88%E4%B8%8B%E6%A9%8B_-_panoramio.jpg";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "一斗俵沈下橋" });
  const existing = await prisma.photo.count({ where: { spotId: spot.id } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  console.log(`一斗俵沈下橋の今の写真: ${existing}枚 / 表紙: ${it.thumbnailUrl ?? "なし"}`);
  if (existing !== 0 || it.thumbnailUrl) throw new Error("想定と違います（写真または表紙がすでにあります）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE_URL, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const jpeg = await toWebJpeg(Buffer.from(await res.arrayBuffer()));
  const blob = await put("fix-398/ittohyo-chinkabashi.jpg", jpeg, { access: "public", addRandomSuffix: true });
  await prisma.$transaction(async (tx) => {
    await tx.photo.create({
      data: { spotId: spot.id, url: blob.url, sourceUrl: FILE_PAGE, author: "sk01", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0" },
    });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: blob.url } });
  });
  console.log("\n書き込みました:", blob.url);
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
