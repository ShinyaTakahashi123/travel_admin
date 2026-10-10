/**
 * #24 657f4a15（箱根）企画運営の指摘(2026-09-30 10:53): 彫刻の森美術館60分では
 * 野外展示を見つつ昼食をとるのは無理がある。彫刻の森美術館を90分(+30分)にし、
 * 延びた分は強羅公園(-5)・箱根ガラスの森美術館(-5)・ポーラ美術館(-10)・
 * 強羅温泉(-10)を少しずつ縮めて調整。Day1の終わりは変わらず16:45。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "657f4a15-8f20-4d44-ac20-fa757f002d63";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({
    where: { itineraryId: ITIN, dayNumber: 1 },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });
  const byName = (n: string) => day1.spots.find((s) => s.name === n)!;

  const spots: SpotOrderItem[] = [
    { id: byName("箱根美術館").id, data: {} },
    { id: byName("強羅公園").id, data: { visitTime: t(10, 18), stayDurationMin: 25 } },
    { id: byName("彫刻の森美術館").id, data: { visitTime: t(10, 52), stayDurationMin: 90 } },
    { id: byName("早雲山駅").id, data: { visitTime: t(12, 37), stayDurationMin: 15 } },
    { id: byName("大涌谷").id, data: { visitTime: t(13, 0), stayDurationMin: 40 } },
    { id: byName("箱根ガラスの森美術館").id, data: { visitTime: t(13, 55), stayDurationMin: 45 } },
    { id: byName("ポーラ美術館").id, data: { visitTime: t(14, 48), stayDurationMin: 55 } },
    { id: byName("強羅温泉").id, data: { visitTime: t(15, 55), stayDurationMin: 50 } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of spots) {
    const d = (x as { id: string; data: Record<string, unknown> });
    const orig = day1.spots.find((s) => s.id === d.id)!;
    const vt = (d.data.visitTime as Date) ?? orig.visitTime!;
    const st = (d.data.stayDurationMin as number) ?? orig.stayDurationMin!;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
