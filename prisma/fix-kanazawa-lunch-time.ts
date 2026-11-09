/**
 * 法務の10章見直し、金沢(b9644a96)の1件。昼食（近江町市場）の始まりが13:31で、
 * 決まり（1章、昼食は13:30まで）を1分超えていた。金沢城公園の滞在を60分→59分に
 * 1分短くして吸収（決まりA、延ばさず短くするのは常に可）。近江町市場13:31→13:30、
 * 以降の主計町茶屋街14:41→14:40、ひがし茶屋街15:17→15:16も1分ずつ早まる
 * （終わりは16:32→16:31で、日帰りの発車の範囲内のまま）。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "b9644a96-7df9-49c3-9e53-143e26595368";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const timeShifts: { name: string; oldTime: [number, number]; newTime: [number, number] }[] = [
  { name: "近江町市場", oldTime: [13, 31], newTime: [13, 30] },
  { name: "主計町茶屋街", oldTime: [14, 41], newTime: [14, 40] },
  { name: "ひがし茶屋街", oldTime: [15, 17], newTime: [15, 16] },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const kanazawajo = await prisma.spot.findFirstOrThrow({ where: { name: "金沢城公園", day: { itineraryId: ITIN_ID } } });
  if (kanazawajo.stayDurationMin !== 60) throw new Error("金沢城公園: stayDurationMin現在値が期待と不一致");

  const timeUpdates: { id: string; name: string; oldTime: [number, number]; newTime: [number, number] }[] = [];
  for (const ts of timeShifts) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: ts.name, day: { itineraryId: ITIN_ID } } });
    const expected = t(ts.oldTime[0], ts.oldTime[1]).getTime();
    if (spot.visitTime?.getTime() !== expected) throw new Error(`${ts.name}: visitTime現在値が期待と不一致`);
    timeUpdates.push({ id: spot.id, name: ts.name, oldTime: ts.oldTime, newTime: ts.newTime });
  }

  console.log(`\n[金沢城公園] 滞在: 60分 → 59分`);
  for (const tu of timeUpdates) {
    console.log(`[${tu.name}] ${tu.oldTime[0]}:${String(tu.oldTime[1]).padStart(2, "0")} → ${tu.newTime[0]}:${String(tu.newTime[1]).padStart(2, "0")}`);
  }
  console.log("ひがし茶屋街の終わり: 16:32 → 16:31（日帰りの発車の範囲内のまま）");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: kanazawajo.id }, data: { stayDurationMin: 59 } });
    for (const tu of timeUpdates) {
      await tx.spot.update({ where: { id: tu.id }, data: { visitTime: t(tu.newTime[0], tu.newTime[1]) } });
    }
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
