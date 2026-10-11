/**
 * #166 4f2248ea の続き（しおりえ(制作補助2)）: 三重県庁舎の滞在を35分→30分にして、昼食までの歩き10分と時刻を合わせる（11:25〜11:55）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-166b-4f2248ea.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "4f2248ea-f024-4a28-9377-bf9131da664a";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "三重県庁舎" } });
  if (s.length !== 1 || s[0].stayDurationMin !== 35) throw new Error(`想定と違います ${s.length} ${s[0]?.stayDurationMin}`);
  console.log(`三重県庁舎 ${s[0].id} 滞在 35 → 30`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: s[0].id }, data: { stayDurationMin: 30 } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
