/**
 * #316の続き(description更新)。
 * 追加した瑞巌寺・五大堂などが入るよう、descriptionを書き直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-316c-73f0b468.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "73f0b468-46de-471e-9d7c-4e24bf3e1b10";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const old = "260余りの島々が浮かぶ松島湾を遊覧船で巡り、縁結びの橋・福浦橋も渡る。日本三景の絶景を海と陸から楽しむプランです。";
  const next = "260余りの島々が浮かぶ松島湾を遊覧船で巡り、縁結びの橋・福浦橋も渡る。瑞巌寺や五大堂など、日本三景の絶景を海と陸から楽しむプランです。";
  if (itin.description === old) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: next } });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
