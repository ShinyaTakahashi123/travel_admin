/**
 * #359の続き。企画運営の指摘: 説明文「『特別名勝』に指定された日本庭園の最高峰、
 * 栗林公園」の「最高峰」は言い切りで、確かめられない評価のため、事実だけの
 * 書き方に変更。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-359b-bf4dd36f.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "bf4dd36f-c4db-4f50-bbd6-c0f763281a15";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const old = "「特別名勝」に指定された日本庭園の最高峰、栗林公園。";
  const next = "国の特別名勝に指定された大名庭園、栗林公園。";
  if (itin.description?.includes(old)) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(old, next) } });
    console.log("説明文: 「最高峰」を事実のみの書き方に変更");
  } else {
    console.log("既に対応済み");
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
