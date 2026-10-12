/**
 * #372の続き。法務の指摘。千葉城の緯度を前回 35.6046 と書いてしまったが、
 * 正しい値は 35.604560 (=35.60456) で、小数点以下が丸まっていた
 * (タイプミス)。正しい値に修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-372f-d4523cde.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "305fcdd7-999d-4c5b-9e64-79445ec2bf41";

async function main() {
  const jo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉城（千葉市立郷土博物館）" } });
  if (jo.lat?.toString() === "35.60456") {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({ where: { id: jo.id }, data: { lat: 35.60456, lng: 140.127101 } });
  console.log("#372続き: 千葉城の緯度のタイプミスを修正(35.6046→35.60456)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
