/**
 * #159の続き。自前の禁止語スキャンで見つけた指摘に対応。
 * 金剛峯寺の結び「空海が高野山開創の際に最初に整備した聖地」に、
 * 同じ文の中でヘッジの言葉がなかったため追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-159b-4072c8d3.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "6d957fc9-237e-44e8-aa16-0c2ca9def561";

async function main() {
  const kongobuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "金剛峯寺" } });

  if (!kongobuji.memo?.includes("最初に整備した聖地、壇上伽藍")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: kongobuji.id },
    data: {
      memo: kongobuji.memo.replace(
        "空海が高野山開創の際に最初に整備した聖地、壇上伽藍へ向かいましょう。",
        "空海が高野山開創の際に最初に整備したと伝えられる聖地、壇上伽藍へ向かいましょう。"
      ),
    },
  });

  console.log("#159続き: 金剛峯寺の結びにヘッジを追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
