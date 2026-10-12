/**
 * #161の続き。報告前の自己点検で、自分で書いた2つの事実の誤りに気づき修正。
 * ①岬の分教場: 閉校年を「平成28年(2016)」と書いたが、実際は「昭和46年
 *   (1971)」だった(WebSearchで確認)。
 * ②坂手港: 「スターアンガー」の作者を「やなぎみわ」と書いたが、実際は
 *   「ヤノベケンジ」だった(WebSearchで確認)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-161c-464a25fa.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY2_ID = "c9f825d6-5aa0-4e33-b608-cfcadc4977f3";

async function main() {
  const bunkyojo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "岬の分教場" } });
  const sakate = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "坂手港" } });

  if (!bunkyojo.memo?.includes("平成28年")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: bunkyojo.id },
    data: {
      memo: bunkyojo.memo!.replace(
        "平成28年(2016)に閉校となり",
        "昭和46年(1971)に閉校となり"
      ),
    },
  });

  await prisma.spot.update({
    where: { id: sakate.id },
    data: {
      memo: sakate.memo!.replace(
        "現代美術家・やなぎみわが手がけた",
        "現代美術家・ヤノベケンジが手がけた"
      ),
    },
  });

  console.log("#161続き: 岬の分教場の閉校年(1971)、坂手港の作者名(ヤノベケンジ)を修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
