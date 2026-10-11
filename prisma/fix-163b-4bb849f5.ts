/**
 * #163の続き。禁止語スキャン(同一文ヘッジ確認版)の指摘に対応。
 * 兼六園の「日本三名園に数えられる」は、同じ文にヘッジがなかったため、
 * 「日本三名園の一つとされる」に修正した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-163b-4bb849f5.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "515a906f-e44c-48e7-9563-9a2aaf9deaee";

async function main() {
  const kenrokuen = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "兼六園" } });

  if (!kenrokuen.memo?.includes("日本三名園に数えられる")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: kenrokuen.id },
    data: {
      memo: kenrokuen.memo!.replace(
        "水戸の偕楽園、岡山の後楽園とあわせて日本三名園に数えられる、加賀藩前田家ゆかりの大名庭園・兼六園に到着です。",
        "水戸の偕楽園、岡山の後楽園とあわせて日本三名園の一つとされる、加賀藩前田家ゆかりの大名庭園・兼六園に到着です。"
      ),
    },
  });

  console.log("#163続き: 兼六園の「日本三名園」の言い切りにヘッジを追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
