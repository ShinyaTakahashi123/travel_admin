/**
 * 緊急の直し: fix-kiwa-restructure.ts で、メモの文は直したのに、legの分の数字そのものを
 * 直すコードが抜けていた（丸山千枚田・布引の滝・紀州鉱山資料館・湯ノ口温泉の4件）。
 * 文と値がずれていたので、値だけをここで直す。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "0928e88e-380c-4702-9559-af6252822245";

const fixes: { name: string; oldMin: number; newMin: number }[] = [
  { name: "丸山千枚田", oldMin: 15, newMin: 6 },
  { name: "布引の滝", oldMin: 20, newMin: 27 },
  { name: "紀州鉱山資料館", oldMin: 15, newMin: 19 },
  { name: "湯ノ口温泉", oldMin: 15, newMin: 10 },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const updates: { id: string; name: string; oldMin: number; newMin: number }[] = [];
  for (const f of fixes) {
    const leg = await prisma.spotTransitLeg.findFirstOrThrow({ where: { spot: { name: f.name, day: { itineraryId: ITIN_ID } } } });
    if (leg.transitDurationMin !== f.oldMin) throw new Error(`${f.name}: leg現在値が期待と不一致(${leg.transitDurationMin})`);
    updates.push({ id: leg.id, name: f.name, oldMin: f.oldMin, newMin: f.newMin });
  }
  for (const u of updates) {
    console.log(`${u.name}: leg ${u.oldMin}分 → ${u.newMin}分`);
  }

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }
  await prisma.$transaction(async (tx) => {
    for (const u of updates) {
      await tx.spotTransitLeg.update({ where: { id: u.id }, data: { transitDurationMin: u.newMin } });
    }
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
