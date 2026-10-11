/**
 * #162の続き。禁止語スキャン(同一文ヘッジ確認版)の指摘に対応。
 * 円覚寺(既存、未変更の文)の「関東地方でも最大級の大きさを誇る名鐘として
 * 知られています」は、同じ文にヘッジの言葉がなかったため、「とされて
 * います」に修正した(明月院の「最初に訪れるのは」は、1日目の最初の
 * スポットという意味で言い切りではないため、誤検知と判断し対応不要)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162e-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY2_ID = "66dbae38-0451-4b6b-87ff-9dc1068d1a1f";

async function main() {
  const engakuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "円覚寺" } });

  if (!engakuji.memo?.includes("名鐘として知られています")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: engakuji.id },
    data: {
      memo: engakuji.memo!.replace(
        "関東地方でも最大級の大きさを誇る名鐘として知られています。",
        "関東地方でも最大級の大きさを誇る名鐘とされています。"
      ),
    },
  });

  console.log("#162続き: 円覚寺の「最大級」の言い切りにヘッジを追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
