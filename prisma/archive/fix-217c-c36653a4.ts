/**
 * #217 c36653a4 の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * 美国・黄金岬の写真（Islet_in_the_Sea_of_Japan,_Shakotan_Peninsula,_Hokkaido.jpg）は、Commons の説明が「積丹半島の先の小島」で、
 *   半島の東側の黄金岬（美国）からの眺めか確かめられないので外す（Blob は消さない）。表紙は天狗山のまま。
 *   photo-cache.json の「積丹半島（美国町）」のキーも消す（同じ場所に確かめられない写真が付き直らないように）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-217c-c36653a4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const PHOTO_ID = "739b70b5-8e6d-457a-9eab-22eead02571e";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const ph = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO_ID }, include: { spot: true } });
  if (!String(ph.sourceUrl).includes("Islet_in_the_Sea_of_Japan") || ph.spot.name !== "美国・黄金岬") throw new Error("写真が想定と違います");
  console.log(`写真を外す: ${ph.id}（${ph.sourceUrl}）スポット: ${ph.spot.name}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.photo.delete({ where: { id: PHOTO_ID } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
