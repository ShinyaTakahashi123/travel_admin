/**
 * #162の続き。法務の指摘に対応(記録 2be2e16)。
 * ①鎌倉宮の「幽閉され、非業の最期を遂げたと伝えられる、その終焉の地に
 *   建てられました」(むごい亡くなり方の書き方)を、「幽閉されたと伝わる
 *   地に建てられました」に修正(土牢の一文は残した)。
 * ②(任意)寿福寺の実朝・政子と伝わる五輪塔の文のあとに、「お墓のまわり
 *   では静かに過ごしましょう」を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162i-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";

async function main() {
  const kamakuragu = await prisma.spot.findFirstOrThrow({ where: { name: "鎌倉宮" } });
  const jufukuji = await prisma.spot.findFirstOrThrow({ where: { name: "寿福寺" } });

  if (!kamakuragu.memo?.includes("非業の最期を遂げたと伝えられる")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: kamakuragu.id },
    data: {
      memo: kamakuragu.memo!.replace(
        "足利尊氏との対立の末にこの地にあった東光寺に幽閉され、非業の最期を遂げたと伝えられる、その終焉の地に建てられました。",
        "足利尊氏との対立の末、この地にあった東光寺に幽閉されたと伝わる地に建てられました。"
      ),
    },
  });

  await prisma.spot.update({
    where: { id: jufukuji.id },
    data: {
      memo: jufukuji.memo!.replace(
        "境内奥のやぐらには、源実朝と北条政子の墓と伝わる五輪塔も残されています。",
        "境内奥のやぐらには、源実朝と北条政子の墓と伝わる五輪塔も残されています。お墓のまわりでは静かに過ごしましょう。"
      ),
    },
  });

  console.log("#162続き: 鎌倉宮の亡くなり方の書き方を修正、寿福寺に墓所での配慮の一文を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
