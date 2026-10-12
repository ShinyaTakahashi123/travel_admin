/**
 * #180 62be3b8a の続き（しおりえ(制作補助2)）: 監査の「徒歩が速すぎ」2件を直す
 *   ① 中禅寺湖遊覧船の点は乗り場（船の駅中禅寺）なので、船に乗っている時間をイタリア大使館別荘記念公園への移動に入れる
 *      （遊覧船は乗り場で10分、移動は遊覧船約40分＋歩き3分。イタリア大使館別荘に着くのは13:16のまま）
 *   ② 湯ノ湖の点は湖の中心なので、ビジターセンターからの歩きを8分にする（着くのは10:53、滞在55分で11:48のまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-180b-62be3b8a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "62be3b8a-f393-4595-b524-bf4e5fc2e9ed";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type L = { mode: "walk" | "other"; min: number; line: string | null };
const PLAN: { name: string; h: number; m: number; stay: number; legs?: L[]; from?: string; to?: string }[] = [
  { name: "中禅寺湖遊覧船", h: 12, m: 23, stay: 10, from: "昼食の後、湖畔の「船の駅中禅寺」へ歩いて約5分。", to: "昼食の後、湖畔の遊覧船の乗り場「船の駅中禅寺」へ歩いて約5分。" },
  { name: "イタリア大使館別荘記念公園", h: 13, m: 16, stay: 60, legs: [{ mode: "other", min: 40, line: "中禅寺湖遊覧船" }, { mode: "walk", min: 3, line: null }], from: "桟橋から歩いて約3分。", to: "遊覧船で湖をめぐって約40分、大使館別荘記念公園の桟橋から歩いて約3分。" },
  { name: "湯ノ湖", h: 10, m: 53, stay: 55, legs: [{ mode: "walk", min: 8, line: null }], from: "ビジターセンターから湖岸へ歩いて約3分。", to: "ビジターセンターから湖岸へ歩いて約8分。" },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    let memo = s[0].memo ?? "";
    if (p.from) {
      if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
      memo = memo.replace(p.from, p.to!);
    }
    console.log(`${p.name}: ${p.h}:${String(p.m).padStart(2, "0")} 滞在${p.stay}分 ${p.legs ? p.legs.map((l) => l.mode + l.min).join("+") : "(移動はそのまま)"}\n  ${memo.slice(0, 70)}…`);
    return {
      id: s[0].id,
      data: {
        visitTime: t(p.h, p.m),
        stayDurationMin: p.stay,
        memo,
        ...(p.legs ? { transitLegs: { deleteMany: {}, create: p.legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line })) } } : {}),
      },
    };
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
