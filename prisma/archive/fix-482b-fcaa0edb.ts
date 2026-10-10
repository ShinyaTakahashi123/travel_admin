/**
 * #482 fcaa0edb の写真の直し（しおりえ(制作補助2)）
 *   表紙の八坂の塔の写真は、坂道に人が中くらいの大きさで何人も写るので、表紙からは外す（スポットの写真としては残す。後ろ姿で、顔はぼかしてある）
 *   → 清水寺に、人が小さくしか写らない本堂と舞台の写真を付けて表紙にする
 *   https://commons.wikimedia.org/wiki/File:Kiyomizu-dera,_Kyoto,_November_2016_-01.jpg（Martin Falbisoner、CC BY-SA 4.0。説明「Kiyomizu-dera, Kyoto, Japan」）
 *   八坂庚申堂の写真（Yasaka_Koshin-do_on_Yumemizaka_of_Kyoto.jpg）は、右に人の顔の大きなポスターが写るので外す（ほかの候補も、顔や手書きの願いごとが読めるものだったので、付けない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-482b-fcaa0edb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "fcaa0edb-3539-47f5-ae75-4ee183f27044";
const PAGE = "https://commons.wikimedia.org/wiki/File:Kiyomizu-dera,_Kyoto,_November_2016_-01.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Kiyomizu-dera,_Kyoto,_November_2016_-01.jpg?width=2000";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const kiyo = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "清水寺" });
  const koshin = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "八坂庚申堂" });
  const kp = await prisma.photo.findMany({ where: { spotId: koshin.id } });
  if (kp.length !== 1 || !(kp[0].sourceUrl ?? "").includes("Yasaka_Koshin-do_on_Yumemizaka")) throw new Error("庚申堂の写真が想定と違います");
  if ((await prisma.photo.count({ where: { spotId: kiyo.id } })) !== 0) throw new Error("清水寺にもう写真があります");
  console.log(`外す写真: ${kp[0].sourceUrl}／清水寺に付ける写真: ${PAGE}（表紙にも）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-482/kiyomizu-dera.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: kp[0].id } });
    await tx.photo.create({ data: { spotId: kiyo.id, url: blob.url, sourceUrl: PAGE, author: "Martin Falbisoner", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: blob.url } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
