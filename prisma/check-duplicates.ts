import { prisma } from "../src/lib/prisma";

async function main() {
  const its = await prisma.itinerary.findMany({
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } }, areas: { include: { area: true } } },
    orderBy: { createdAt: "asc" },
  });

  // 1) 日単位で全く同じスポット構成(名前・順序一致)の日を探す
  type DayKey = { itTitle: string; nights: number; dayNumber: number; key: string };
  const dayEntries: DayKey[] = [];
  for (const it of its) {
    for (const d of it.days) {
      const key = d.spots.map((s) => s.name).join(">");
      dayEntries.push({ itTitle: it.title, nights: it.nights, dayNumber: d.dayNumber, key });
    }
  }
  const byKey = new Map<string, DayKey[]>();
  for (const e of dayEntries) {
    if (!byKey.has(e.key)) byKey.set(e.key, []);
    byKey.get(e.key)!.push(e);
  }
  console.log("=== 完全一致する日(同じ5スポット・同じ順番) ===");
  let dupDayCount = 0;
  for (const [key, entries] of byKey) {
    if (entries.length > 1) {
      dupDayCount++;
      console.log(`- [${key}]`);
      for (const e of entries) console.log(`    ${e.nights}泊「${e.itTitle}」Day${e.dayNumber}`);
    }
  }
  if (dupDayCount === 0) console.log("なし");

  // 2) しおり単位で、使っているスポット集合(順不同)の重なり具合(Jaccard)を計算
  console.log("\n=== しおり間のスポット集合の重複率(同一エリア内、Jaccard>=0.5) ===");
  const itSpotSets = its.map((it) => ({
    title: it.title,
    nights: it.nights,
    area: it.areas[0]?.area?.name ?? "?",
    set: new Set(it.days.flatMap((d) => d.spots.map((s) => s.name))),
  }));
  let dupItCount = 0;
  for (let i = 0; i < itSpotSets.length; i++) {
    for (let j = i + 1; j < itSpotSets.length; j++) {
      const a = itSpotSets[i], b = itSpotSets[j];
      if (a.area !== b.area) continue;
      const inter = [...a.set].filter((x) => b.set.has(x)).length;
      const union = new Set([...a.set, ...b.set]).size;
      const jaccard = inter / union;
      if (jaccard >= 0.5) {
        dupItCount++;
        console.log(`- ${jaccard.toFixed(2)}: [${a.nights}泊]${a.title} <-> [${b.nights}泊]${b.title}`);
      }
    }
  }
  if (dupItCount === 0) console.log("なし");

  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
