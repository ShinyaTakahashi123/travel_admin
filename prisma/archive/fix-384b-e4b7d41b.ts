/** #384 e4b7d41b 法務の任意の提案: 大滝乃湯の合わせ湯に「のぼせないよう、無理をせずに」を足す（しおりえ(制作補助2)）。使い方: npm run prod -- npx tsx prisma/fix-384b-e4b7d41b.ts [--commit] */
import { prisma } from "../src/lib/prisma";
const ITINERARY_ID = "e4b7d41b-b1a3-464f-ba14-431c01970e13";
const A = "昔ながらの草津の入り方を体験できます。";
const B = "昔ながらの草津の入り方を体験できます。熱い湯もあるので、のぼせないよう、無理をせずに入りましょう。";
async function main() {
  const sp = await prisma.spot.findFirstOrThrow({ where: { name: "大滝乃湯", day: { itineraryId: ITINERARY_ID } } });
  if (!sp.memo?.includes(A) || sp.memo.includes("のぼせない")) throw new Error("対象の文が見つからないか、すでに直っています");
  console.log(`${sp.id}\n後: ${sp.memo.replace(A, B)}`);
  if (!process.argv.includes("--commit")) return console.log("確認モード");
  await prisma.spot.update({ where: { id: sp.id }, data: { memo: sp.memo.replace(A, B) } });
  console.log("書き込みました。");
}
main().catch((e) => { console.error(e?.message); process.exit(1); }).finally(() => prisma.$disconnect());
