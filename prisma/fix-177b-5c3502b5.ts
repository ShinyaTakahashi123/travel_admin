/**
 * #177 5c3502b5 の続き（しおりえ(制作補助2)）: 監査の「徒歩が速すぎ 1.1km/10分」を直す
 *   金刀比羅宮の点は御本宮なので、門前町から785段の石段を上る時間を移動に入れる（歩き約40分、着くのは13:00）。滞在は120分（表書院・宝物館と御本宮）
 *   帰りの石段を下る時間も、琴平海洋博物館への移動に入れる（約30分、着くのは15:30のまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-177b-5c3502b5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5c3502b5-0318-4f0d-bb31-797899970ef5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const PLAN = [
  { name: "金刀比羅宮", h: 13, m: 0, stay: 120, walk: 40, from: "門前町から表参道を歩いて約10分で、石段の上り口へ。", to: "門前町から表参道を歩き、785段の石段を上って、御本宮まで約40分。" },
  { name: "琴平海洋博物館", h: 15, m: 30, stay: 60, walk: 30, from: "石段を下り、表参道の脇へ歩いて約20分。", to: "御本宮から石段を下り、表参道の脇へ、あわせて約30分。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } }, include: { transitLegs: true } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    const memo = s[0].memo ?? "";
    if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
    const neu = memo.replace(p.from, p.to);
    console.log(`${p.name}: ${p.h}:${String(p.m).padStart(2, "0")} 滞在${p.stay}分 歩き${p.walk}分\n  ${neu.slice(0, 80)}…`);
    return { id: s[0].id, data: { visitTime: t(p.h, p.m), stayDurationMin: p.stay, memo: neu, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk" as const, transitDurationMin: p.walk, transitLine: null }] } } };
  });
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const o of ops) await tx.spot.update({ where: { id: o.id }, data: o.data });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
