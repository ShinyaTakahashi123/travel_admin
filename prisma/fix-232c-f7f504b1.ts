/**
 * #232 f7f504b1 の言い方の直し（しおりえ(制作補助2)、法務の指摘 10/11）
 * そうめんの里の本文で「揖保乃糸」が商品の銘柄名として出ていたので外す（施設名とスポット名はそのまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-232c-f7f504b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "f7f504b1-6c02-407f-9648-fd54bf0edf68";
const COMMIT = process.argv.includes("--commit");
const F = "播州の手延べそうめん「揖保乃糸」の起源や作り方、歴史を紹介する資料館で、";
const T = "播州の手延べそうめんの起源や作り方、歴史を紹介する資料館で、";

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "揖保乃糸資料館そうめんの里" } });
  if (spots.length !== 1 || !(spots[0].memo ?? "").includes(F)) throw new Error("構成が想定と違います");
  const memo = spots[0].memo!.replace(F, T);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: spots[0].id }, data: { memo } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
