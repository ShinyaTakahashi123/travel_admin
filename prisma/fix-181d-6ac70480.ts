/**
 * #181 6ac70480 の続き（しおりえ(制作補助2)）: 企画運営の確認（2026-10-11）で、タイトルを内容に合わせる
 *   「町家とカフェ、奈良町をぶらり歩く1泊2日ゆったり旅」は、2日目の西ノ京・平城宮跡が入っておらず、カフェの話もほぼないので、
 *   「ならまちの古寺と西ノ京・平城宮跡をめぐる奈良1泊2日」にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-181d-6ac70480.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "6ac70480-f655-419c-a820-8a2a46acbfd5";
const OLD = "町家とカフェ、奈良町をぶらり歩く1泊2日ゆったり旅";
const TITLE = "ならまちの古寺と西ノ京・平城宮跡をめぐる奈良1泊2日";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true } });
  if (it.title !== OLD) throw new Error(`タイトルが想定と違います: ${it.title}`);
  console.log(`${OLD} → ${TITLE}`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
