/**
 * #162の続き。禁止語スキャン(同一文ヘッジ確認版)の指摘に対応。
 * 英勝寺の「鎌倉に唯一残る尼寺です」は、同じ文にヘッジの言葉がなかった
 * ため、「尼寺とされています」に修正した(明月院の「最初に訪れるのは」は
 * 1日目の最初のスポットという意味、寿福寺の「とも伝えられています」は
 * 「と伝え」の形と違うだけで実質ヘッジ済みのため、誤検知と判断し対応
 * 不要)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162h-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";

async function main() {
  const eishoji = await prisma.spot.findFirstOrThrow({ where: { name: "英勝寺" } });

  if (!eishoji.memo?.includes("鎌倉に唯一残る尼寺です")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: eishoji.id },
    data: {
      memo: eishoji.memo!.replace("鎌倉に唯一残る尼寺です。", "鎌倉に唯一残る尼寺とされています。"),
    },
  });

  console.log("#162続き: 英勝寺の「唯一」の言い切りにヘッジを追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
