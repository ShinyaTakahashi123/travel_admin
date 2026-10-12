/**
 * #233 f7ff855f の中町通りの本文の書き分け（しおりえ(制作補助2)、企画運営の指摘 10/11）
 * ほかの松本のしおりの中町通りの文と始まりや全体が似ていたので、出典（松本旅のしらべ https://visitmatsumoto.com/spot/detail_1082.html ）の別の話
 *   （かつての問屋街の面影・老舗と新しい店の共存・民芸家具やクラフトの店・カフェやレストラン）を取り上げて書き直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-233b-f7ff855f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "f7ff855f-7d65-4b94-80b6-7e44604d4259";
const COMMIT = process.argv.includes("--commit");
const MEMO =
  "博物館から車で約25分、町の中心へ戻ります（近くの駐車場に停めて歩きます）。かつて問屋が並んだころの面影を残す通りで、古くからの老舗と新しい店が肩を並べています。松本の民芸家具や手仕事の品を扱う店、カフェやレストランが続くので、白と黒の蔵の壁を眺めながら歩き、気になる店で昼食にしましょう。通りには今も人が暮らし、商いをしているので、静かに歩きましょう。";

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
