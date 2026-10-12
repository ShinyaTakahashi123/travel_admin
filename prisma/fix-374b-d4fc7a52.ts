/**
 * #374の続き。企画運営の2点指摘に対応。
 * 1. 名古屋市役所本庁舎の結び「お帰りください」は「ください」を使わないため、
 *    「戻りましょう」に直す。
 * 2. 熱田神宮「伊勢神宮に次ぐ格式を持つ神社として」が言い切りだったため、
 *    同じ文に「とされ」を入れる。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-374b-d4fc7a52.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "c026e077-d36a-4405-80ae-88308a469a2f";

async function main() {
  const atsuta = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "熱田神宮" } });
  const yakusho = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "名古屋市役所本庁舎" } });

  if (!yakusho.memo?.includes("お帰りください")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: atsuta.id },
    data: {
      memo: atsuta.memo?.replace(
        "伊勢神宮に次ぐ格式を持つ神社として、古くから「熱田さん」の愛称で親しまれてきました。",
        "伊勢神宮に次ぐ格式を持つ神社とされ、古くから「熱田さん」の愛称で親しまれてきました。"
      ),
    },
  });

  await prisma.spot.update({
    where: { id: yakusho.id },
    data: {
      memo: yakusho.memo?.replace(
        "見学を終えたら、名鉄・JR・地下鉄の各駅から、名古屋駅方面へお帰りください。",
        "見学を終えたら、名鉄・JR・地下鉄の各駅から、名古屋駅方面へ戻りましょう。"
      ),
    },
  });

  console.log("#374続き: 熱田神宮にヘッジを追加、市役所本庁舎の結びの言い回しを修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
