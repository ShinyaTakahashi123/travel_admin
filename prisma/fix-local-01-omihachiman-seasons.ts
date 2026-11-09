/**
 * seed-local-01-omihachiman.ts の登録直後に行う、季節(seasons)だけの直し。
 * handmade-gen には季節を付ける仕組みがないため、別スクリプトで同じ確認の中で行う
 * (itinerary-rules.md 433-434行、2026-11-02企画運営の決定)。
 *
 * 決め方: タイトルの主な題材で決める。「八幡堀と日牟禮八幡宮、近江商人の町をめぐる」は、
 * 特定の季節の題材(桜・紅葉・雪など)ではないため、季節を問わない内容として春夏秋冬の
 * 4つを付ける。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const TITLE = "八幡堀と日牟禮八幡宮、近江商人の町をめぐる近江八幡日帰りプラン";
const SEASONS = ["spring", "summer", "autumn", "winter"];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findFirstOrThrow({ where: { title: TITLE } });
  console.log(`対象: ${itin.title} (${itin.id})`);
  console.log(`現在のseasons: ${JSON.stringify(itin.seasons)}`);
  console.log(`新しいseasons: ${JSON.stringify(SEASONS)}(季節を問わない内容のため4つ)`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.itinerary.update({ where: { id: itin.id }, data: { seasons: SEASONS } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
