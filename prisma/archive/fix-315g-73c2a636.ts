/**
 * #315の続き(法務の気づき、2026-09-30 20:21 JST)。
 * descriptionに倉敷民藝館が入っていなかったため追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315g-73c2a636.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const old = "語らい座大原本邸や児島虎次郎記念館、国芳館、加計美術館、倉敷市立美術館など、";
  const next = "語らい座大原本邸や児島虎次郎記念館、国芳館、加計美術館、倉敷民藝館、倉敷市立美術館など、";
  if (itin.description?.includes(old)) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(old, next) } });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
