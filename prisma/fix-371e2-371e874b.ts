/**
 * 371e874b(銀山温泉じっくり1泊2日)の徳良湖の完成年を直す。
 * 企画運営の指摘: 「1920年に完成」は誤りで、制作がtabi-mag.jp/yg0240/で
 * 確かめた「大正10年(1921)5月27日に完成」が正しい。
 * (自分でも同じURLを開いて確認済み)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-371e2-371e874b.ts
 */
import { prisma } from "../src/lib/prisma";

const SPOT_ID = "a42f17d2-2f35-47ce-8abd-680a7ac865e6";

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT_ID } });
  if (!spot.memo?.includes("1920年に完成しました")) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({
    where: { id: SPOT_ID },
    data: { memo: spot.memo.replace("1920年に完成しました", "1921年に完成しました") },
  });
  console.log("371e874b続き: 徳良湖の完成年を1920年→1921年に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
