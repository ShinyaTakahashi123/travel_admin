/**
 * #159の続き。fix-159dで昼食のtransitLegsを4分に変えたが、本文の
 * 「六時の鐘から歩いて6分ほど」が直し漏れていた(itinerary-auditでは
 * 検知されない、本文と数字のずれ)。4分に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-159e-4072c8d3.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "6d957fc9-237e-44e8-aa16-0c2ca9def561";

async function main() {
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "門前町で昼食" } });

  if (!lunch.memo?.includes("六時の鐘から歩いて6分ほど")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: lunch.id },
    data: { memo: lunch.memo.replace("六時の鐘から歩いて6分ほど", "六時の鐘から歩いて4分ほど") },
  });

  console.log("#159続き: 昼食の書き出しの移動時間の直し漏れを修正(6分→4分)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
