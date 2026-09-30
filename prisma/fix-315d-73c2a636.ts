/**
 * #315の続き(法務の指摘、2026-09-30 20:14 JST)。
 * タイトルの「日本初の」が言い切りのままだったため、本文・description
 * と揃えてヘッジした。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315d-73c2a636.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const old = "大原美術館、日本初の西洋美術中心の私立美術館プラン";
  const next = "大原美術館、日本初とされる西洋美術中心の私立美術館プラン";
  if (itin.title === old) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: next } });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
