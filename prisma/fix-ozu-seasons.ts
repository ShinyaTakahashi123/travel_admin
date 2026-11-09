/**
 * 大洲の日帰りしおり(5ce1979f、承認待ち)に季節(seasons)を付ける。
 * handmade-gen.ts にseasonsの項目がないため、登録時に空配列[]のままになっていた(法務指摘)。
 * 大洲城・臥龍山荘・神社仏閣めぐりで季節を問わない内容のため、春夏秋冬の4つを付ける。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-ozu-seasons.ts
 *   反映: npm run prod -- npx tsx prisma/fix-ozu-seasons.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5ce1979f-5a9d-4e9b-9f6f-8a24a0dc637d";
const SEASONS = ["spring", "summer", "autumn", "winter"];

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
  console.log(`title=${it.title}`);
  console.log(`直前: seasons=${JSON.stringify(it.seasons)}`);
  console.log(`直後: seasons=${JSON.stringify(SEASONS)}`);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: SEASONS } });
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
