/**
 * #418 4e2f62fc の追いの修正（しおりえ(制作補助2)）
 * - 東京ビッグサイトの写真（Tokyo_Big_Sight_Station,...jpg）は、ゆりかもめの駅のホームの写真で建物ではないので替える
 *   https://commons.wikimedia.org/wiki/File:Tokyo_Big_Sight_exterior_2024-02-12.jpg（Masahiko OHKUBO、CC BY 2.0、位置情報 35.629766,139.794083 が一致、目で見て会議棟と看板を確認）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-418b-4e2f62fc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "4e2f62fc-db69-4fbf-af20-0bfe61f3ae62";
const COMMIT = process.argv.includes("--commit");
const IMAGE = "https://upload.wikimedia.org/wikipedia/commons/5/55/Tokyo_Big_Sight_exterior_2024-02-12.jpg";
const PAGE = "https://commons.wikimedia.org/wiki/File:Tokyo_Big_Sight_exterior_2024-02-12.jpg";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "東京ビッグサイト" });
  const ph = await prisma.photo.findMany({ where: { spotId: s.id } });
  if (ph.length !== 1 || !ph[0].sourceUrl?.includes("Tokyo_Big_Sight_Station")) throw new Error("写真が想定と違います");
  console.log(`替える写真: ${ph[0].sourceUrl}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-418/tokyo-big-sight.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  await prisma.photo.update({ where: { id: ph[0].id }, data: { url: blob.url, sourceUrl: PAGE, author: "Masahiko OHKUBO", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0" } });
  console.log("\n書き込みました:", blob.url);
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
