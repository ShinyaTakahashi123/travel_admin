/**
 * #418 4e2f62fc の追いの修正その2（しおりえ(制作補助2)、企画運営の指摘）
 * - 有明→豊洲→有明と戻る順だったので、戻らない順に並べ替える:
 *   水の科学館 → 東京ビッグサイト → そなエリア東京 →（ゆりかもめ）豊洲市場（見学と昼食）→（ゆりかもめ）宗谷 → 潮風公園
 * - 本文の書き出し（〜から、ゆりかもめで）と移動を順番に合わせる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-418c-4e2f62fc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4e2f62fc-db69-4fbf-af20-0bfe61f3ae62";
const DAY1_ID = "35b23b44-87d6-4adb-aa2a-25fe79778478";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

type Plan = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; line: string | null; replace?: [string, string] };
const PLAN: Plan[] = [
  { name: "東京都水の科学館", h: 9, m: 30, stay: 60, mode: null, dur: null, line: null },
  { name: "東京ビッグサイト", h: 10, m: 40, stay: 30, mode: "walk", dur: 10, line: null, replace: ["豊洲市場からゆりかもめで東京ビッグサイト駅へ。", "水の科学館から歩いて約10分。"] },
  { name: "そなエリア東京", h: 11, m: 20, stay: 80, mode: "walk", dur: 10, line: null, replace: ["水の科学館から歩いて約10分、", "東京ビッグサイトから歩いて約10分、"] },
  { name: "豊洲市場", h: 13, m: 0, stay: 80, mode: "train", dur: 20, line: "ゆりかもめ（有明→市場前）", replace: ["そなエリア東京からゆりかもめで市場前駅へ。", "そなエリア東京から、ゆりかもめの有明駅から市場前駅へ。"] },
  { name: "南極観測船「宗谷」", h: 14, m: 40, stay: 60, mode: "train", dur: 20, line: "ゆりかもめ（市場前→東京国際クルーズターミナル）", replace: ["ゆりかもめで東京国際クルーズターミナル駅へ。", "豊洲市場からゆりかもめで東京国際クルーズターミナル駅へ。"] },
  { name: "潮風公園", h: 15, m: 50, stay: 40, mode: "walk", dur: 10, line: null },
];

async function main() {
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.length !== 6) throw new Error("構成が想定と違います");
  const byName = new Map(days[0].spots.map((s) => [s.name, s]));
  const order = PLAN.map((p) => {
    const s = byName.get(p.name);
    if (!s) throw new Error(`スポットが見つかりません: ${p.name}`);
    let memo = s.memo ?? "";
    if (p.replace) {
      if (!memo.includes(p.replace[0])) throw new Error(`${p.name}: 本文が想定と違います`);
      memo = memo.replace(p.replace[0], p.replace[1]);
    }
    console.log(`${String(p.h).padStart(2, "0")}:${String(p.m).padStart(2, "0")} ${p.name} 滞在${p.stay} ${p.mode ?? "-"}/${p.dur ?? "-"} ${memo.slice(0, 30)}…`);
    return { id: s.id, data: { visitTime: t(p.h, p.m), stayDurationMin: p.stay, transitMode: p.mode, transitDurationMin: p.dur, transitLine: p.line, memo } };
  });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY1_ID, order, { tx }); }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
