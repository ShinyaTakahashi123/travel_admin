/**
 * #155の続き。企画運営の指摘に対応。
 * 三里塚記念公園を第2ターミナル展望デッキと第1ターミナル展望デッキの間に
 * 挿入した際、第2ターミナル展望デッキの結びの文が「車で第1ターミナルへ
 * 向かいましょう」のまま直し漏れていた(実際の次の行き先は三里塚記念公園)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-155d-2bd38fc7.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "c45d8cd1-2b3e-4d6f-9988-ede8fb90e82d";

async function main() {
  const t2deck = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "成田国際空港第2ターミナル展望デッキ" } });

  if (!t2deck.memo?.includes("見学を終えたら、車で第1ターミナルへ向かいましょう。")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: t2deck.id },
    data: {
      memo: t2deck.memo.replace(
        "見学を終えたら、車で第1ターミナルへ向かいましょう。",
        "見学を終えたら、車で三里塚記念公園へ向かいましょう。"
      ),
    },
  });

  console.log("#155続き: 第2ターミナル展望デッキの結びの文を、次の行き先(三里塚記念公園)に合わせて修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
