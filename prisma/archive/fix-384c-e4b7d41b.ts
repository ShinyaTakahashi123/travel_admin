/**
 * #384 e4b7d41b の事故対応。別件(#326)の修正作業中、スコープなしの
 * where:{name:"光泉寺"} 検索を誤って使い、このしおり(#384)の光泉寺の
 * visitTimeを12:08に書き換えてしまった。fix-384-e4b7d41b.tsの
 * order配列(KOSENJI_ID: t(10, 20))で確認したとおり、正しい値は
 * 10:20のため、元に戻す。他のフィールドは触れていない。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-384c-e4b7d41b.ts
 */
import { prisma } from "../src/lib/prisma";

const KOSENJI_ID = "d54de6d9-6bbc-4d12-b727-58fe85a45e5f";

async function main() {
  const before = await prisma.spot.findUniqueOrThrow({ where: { id: KOSENJI_ID } });
  const beforeMin = before.visitTime!.getUTCHours() * 60 + before.visitTime!.getUTCMinutes();
  console.log("before:", beforeMin, "(", Math.floor(beforeMin / 60), ":", beforeMin % 60, ")");

  await prisma.spot.update({
    where: { id: KOSENJI_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 20)) },
  });

  const after = await prisma.spot.findUniqueOrThrow({ where: { id: KOSENJI_ID } });
  const afterMin = after.visitTime!.getUTCHours() * 60 + after.visitTime!.getUTCMinutes();
  console.log("after:", afterMin, "(should be 620 = 10:20)");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
