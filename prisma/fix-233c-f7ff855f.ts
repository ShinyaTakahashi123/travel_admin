/**
 * #233 f7ff855f の中町通りの本文の書き分けのやり直し（しおりえ(制作補助2)、企画運営の指摘 10/11）
 * fix-233b の文は、#f507e490 の中町通り（「老舗と新しい店が並び、松本民芸家具やクラフトの店、カフェや…」）とまだ似ていたので、
 *   出典（松本旅のしらべ https://visitmatsumoto.com/spot/detail_1082.html ）のうち、ほかのしおりが使っていない話
 *   （古き松本の雰囲気・世代を超えて愛される・松本城、縄手通りと共にめぐるのがおすすめ）で書き直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-233c-f7ff855f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "f7ff855f-7d65-4b94-80b6-7e44604d4259";
const COMMIT = process.argv.includes("--commit");
const MEMO =
  "博物館から車で約25分、町の中心へ戻ります（近くの駐車場に停めて歩きます）。白と黒の蔵が続く通りは、古い松本の空気を今に伝え、世代をこえて多くの人に親しまれています。店の並ぶ通りをのんびり歩き、気に入った食事の店で昼食をとりましょう。時間に余裕があれば、松本城や縄手通りと合わせて歩くのもおすすめです。通りには今も人が暮らし、商いをしているので、静かに歩きましょう。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "中町通り" } });
  if (spots.length !== 1 || !(spots[0].memo ?? "").startsWith("博物館から車で約25分")) throw new Error("構成が想定と違います");
  console.log(MEMO);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: spots[0].id }, data: { memo: MEMO } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
