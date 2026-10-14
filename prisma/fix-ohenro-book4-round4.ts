/**
 * お遍路 本4(#11)の4回目の直し(企画運営指摘、2026-10-14)。対象はidで指定。
 * 1. 咸陽島の「お出かけましょう」の言い回しを直す
 * 2. かわうその里すさき・めじかの里土佐清水は、道の駅公式サイト
 *    (michi-no-eki.jp)でレストラン等の設備を直接確認できたため、
 *    その旨のメモに更新(店名は書かない)
 *    - かわうその里すさき: レストランあり(2階、11:00-17:00)
 *    - めじかの里土佐清水: レストラン・軽食喫茶ともあり
 * 3. 道の駅すくもは、公式サイトでレストラン・軽食とも「利用不可」表示だった
 *    ため、このスクリプトでは変更しない(企画運営に相談のうえ、別の行き先に
 *    差し替える予定)
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book4-round4.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book4-round4.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const KANYOJIMA_ID = "308169a9-e3e9-4935-82f9-942fdea4c002";

const KANYOJIMA_MEMO_NEW =
  "宿毛湾に浮かぶ2つの無人島からなる咸陽島は、潮が引くと海の中から陸続きの道が現れる「トンボロ現象」で知られ、歩いて渡ることができます。足もとは貝殻の付いた岩場でやや歩きにくいので、歩きやすい靴で出かけましょう。潮が満ちると道が消えるので、潮見表で時間を確かめ、満ちはじめる前に戻りましょう。春には桜が咲き誇る花見の名所として親しまれ、11月中旬から2月上旬ごろには、太陽が水平線に溶けるように沈む「だるま夕陽」が見られることでも知られています。隣接する咸陽島公園には、ビーチバレーなども楽しめる砂浜が広がります。";

async function main() {
  const kawauso = await prisma.spot.findFirst({ where: { name: "道の駅かわうその里すさき（昼食）" } });
  const mejika = await prisma.spot.findFirst({ where: { name: "道の駅めじかの里土佐清水（昼食）" } });
  if (!kawauso || !mejika) throw new Error("想定と違います");

  console.log("[確認OK] 咸陽島の言い回しを修正");
  console.log("[確認OK] かわうその里すさき・めじかの里土佐清水を公式確認済みの表現に更新");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: KANYOJIMA_ID }, data: { memo: KANYOJIMA_MEMO_NEW } });
  await prisma.spot.update({
    where: { id: kawauso.id },
    data: { memo: "須崎市にある道の駅です。地元の農産物直売所があり、2階にはレストランもあります(出典: 道の駅公式サイト)。ここで昼食にしましょう。" },
  });
  await prisma.spot.update({
    where: { id: mejika.id },
    data: { memo: "土佐清水市にある道の駅です。レストランや軽食・喫茶があります(出典: 道の駅公式サイト)。ここで昼食にしましょう。" },
  });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
