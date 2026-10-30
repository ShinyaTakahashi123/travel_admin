/**
 * 函館の点のそろえに続く直し（しおりえ(制作補助2)、法務・企画運営 10/30 OK）
 * bb3ae76a（#2）・c09412a7 の2日目、函館朝市→函館市文学館「歩いて16分」が道のりより短い
 *   bb3ae76a: foot 1,415m・18.9分 → 19分。文学館 10:23→10:26、滞在35→32分（10:58 に出るのは同じ）
 *   c09412a7: foot 1,361m・18.1分（朝市の点が別）→ 18分。文学館 10:23→10:25、滞在35→33分
 * メモに分数はないので文は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-048c-hakodate-legs.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ROWS = [
  { it: "bb3ae76a", id: "8f04f23f-62b4-45e3-8c82-d52335795f1f", h: 10, m: 26, stay: 32, walk: 19 },
  { it: "c09412a7", id: "5b7893f4-e384-4000-a7fa-dc3279c4bdf5", h: 10, m: 25, stay: 33, walk: 18 },
];

async function main() {
  for (const r of ROWS) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: r.id }, include: { transitLegs: true, day: { select: { itineraryId: true } } } });
    const vt = s.visitTime!;
    const legs = s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
    if (!s.day.itineraryId.startsWith(r.it) || vt.getUTCHours() !== 10 || vt.getUTCMinutes() !== 23 || s.stayDurationMin !== 35 || legs !== "walk16")
      throw new Error(`${r.it} ${s.name}: いまの値が想定と違います（${vt.toISOString()} ${s.stayDurationMin} ${legs}）`);
    console.log(`${r.it} ${s.name}: 10:23 滞在35 walk16 → ${r.h}:${r.m} 滞在${r.stay} walk${r.walk}（${r.h}:${r.m + r.stay} に出る）`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    ROWS.map((r) =>
      prisma.spot.update({
        where: { id: r.id },
        data: { visitTime: t(r.h, r.m), stayDurationMin: r.stay, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: r.walk, transitLine: null }] } },
      })
    )
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
