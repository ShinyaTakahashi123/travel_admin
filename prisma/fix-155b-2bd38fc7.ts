/**
 * #155の続き。写真を開いて確認したところ、「成田国際空港第2ターミナル
 * 展望デッキ」に付いていた写真(ファイル名は「成田国際空港」とだけ)は、
 * 看板に「Narita Airport Terminal 1」とはっきり写っており、第1ターミナル
 * の写真だった。新設した「成田国際空港第1ターミナル展望デッキ」に付け替える。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-155b-2bd38fc7.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "c45d8cd1-2b3e-4d6f-9988-ede8fb90e82d";

async function main() {
  const t2deck = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "成田国際空港第2ターミナル展望デッキ" } });
  const t1deck = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "成田国際空港第1ターミナル展望デッキ" } });
  const photo = await prisma.photo.findFirst({ where: { spotId: t2deck.id } });

  if (!photo) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.photo.update({ where: { id: photo.id }, data: { spotId: t1deck.id } });

  console.log("#155続き: 第1ターミナルの写真を、第2ターミナル展望デッキから第1ターミナル展望デッキへ付け替え");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
