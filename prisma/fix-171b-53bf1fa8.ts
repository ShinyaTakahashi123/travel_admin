/**
 * #171 53bf1fa8 の続き（しおりえ(制作補助2)）: audit の指摘（相楽園→湊川神社 1.4km に徒歩10分は速すぎ）で、徒歩20分にし、相楽園の滞在を35分（11:50〜12:25）にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-171b-53bf1fa8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "53bf1fa8-d837-4f00-84e2-f69b487fda25";
const FROM = "相楽園から南へ歩いて約10分。";
const TO = "相楽園から南へ歩いて約20分。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: { in: ["相楽園", "湊川神社"] } } });
  const s = spots.find((x) => x.name === "相楽園");
  const m = spots.find((x) => x.name === "湊川神社");
  if (!s || !m || s.stayDurationMin !== 45 || (m.memo ?? "").split(FROM).length !== 2) throw new Error("想定と違います");
  const memo = (m.memo ?? "").replace(FROM, TO);
  console.log(`相楽園 滞在45→35分 / 湊川神社 徒歩10→20分\n${memo}`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: s.id }, data: { stayDurationMin: 35 } }),
    prisma.spot.update({ where: { id: m.id }, data: { memo, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20, transitLine: null }] } } }),
  ]);
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
