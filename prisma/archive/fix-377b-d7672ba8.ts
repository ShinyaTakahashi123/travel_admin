/** #377 d7672ba8 本文・移動の説明から「無料」を外す（しおりえ(制作補助2)）。使い方: npm run prod -- npx tsx prisma/fix-377b-d7672ba8.ts [--commit] */
import { prisma } from "../src/lib/prisma";
const ITINERARY_ID = "d7672ba8-0106-459a-ba9b-b46a13b5e0b8";
async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const targets = spots.filter((s) => /無料/.test(`${s.memo ?? ""}${s.transitLine ?? ""}`));
  for (const s of targets) console.log(`${s.name}: memo「${(s.memo ?? "").match(/.{0,10}無料.{0,10}/g)}」 line「${s.transitLine}」`);
  if (!process.argv.includes("--commit")) return console.log("確認モード");
  await prisma.$transaction(targets.map((s) => prisma.spot.update({ where: { id: s.id }, data: { memo: s.memo?.replace(/無料送迎バス/g, "送迎バス"), transitLine: s.transitLine?.replace(/無料送迎バス/g, "送迎バス") } })));
  const after = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  console.log(`書き込みました。残り: ${after.filter((s) => /無料/.test(`${s.memo ?? ""}${s.transitLine ?? ""}`)).length}件`);
}
main().catch((e) => { console.error(e?.message); process.exit(1); }).finally(() => prisma.$disconnect());
