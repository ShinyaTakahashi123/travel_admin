/**
 * #158の続き。企画運営の2点指摘に対応。
 * ①遠野市立博物館→卯子酉神社が「車で」だったが、この日はバス・歩き・
 *   タクシーで通しているため、タクシーに統一。
 * ②最後の五百羅漢の結び「遠野駅方面へ戻り、帰りましょう」に、タクシーで
 *   何分かを明記。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-158c-388f880b.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "474a27d0-c16e-4db3-939f-db0aecd9ee0f";

async function main() {
  const uneTori = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "卯子酉神社" } });
  const rakan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "五百羅漢" } });

  if (!uneTori.memo?.includes("車でおよそ8分")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: uneTori.id },
    data: {
      memo: uneTori.memo.replace("車でおよそ8分", "タクシーでおよそ8分"),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 8 }] },
    },
  });

  await prisma.spot.update({
    where: { id: rakan.id },
    data: {
      memo: rakan.memo?.replace(
        "見学を終えたら、遠野駅方面へ戻り、帰りましょう。",
        "見学を終えたら、タクシーでおよそ10分の遠野駅前へ戻り、帰りましょう。"
      ),
    },
  });

  console.log("#158続き: 博物館→卯子酉神社をタクシーに統一、五百羅漢の結びに戻り方を明記");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
