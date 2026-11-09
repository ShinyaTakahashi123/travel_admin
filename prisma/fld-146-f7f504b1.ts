/**
 * 初日・最終日の見直し #146 f7f504b1「姫路城と好古園、たつのの城下町と室津をめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（4か所）: 姫路城 9:00 → 好古園（昼食）→ 兵庫県立歴史博物館 → 姫路科学館 15:00〜16:30
 * 直した初日（4か所のまま）: JR姫路駅に11時ごろ → 歩いて約25分 → 姫路城 11:25 → 好古園（昼食 13:02〜）→ 歴史博物館 → 歩きとバス → 姫路科学館 16:00〜16:30
 *   どこも外さない（説明文に全部出てくる）
 *   歩き（道のり。routing.openstreetmap.de の foot）: 姫路駅→姫路城の点 1,987m・約26分、城→好古園 1,306m・約17分、好古園→博物館 1,181m・約16分、博物館→姫路駅 2,024m・約27分（＋神姫バス30分）
 *   姫路科学館は入館16:30まで（16:00 に着く）。「常設展示とプラネタリウムの両方を見るなら、早めに入館しましょう」は合わなくなるので、投影の時刻を確かめる一文にする
 *   滞在はどれも、もとより短い（姫路城 120→80分、好古園 90→60分、博物館 60→45分、科学館 90→30分）
 * 文: 書き出しの「歩きと電車」→「歩きとバス」（初日に電車は使わない）。「〜のもよいでしょう」（すすめる言い方）を直す
 * 座標（itinerary-rules 7章）: 2日目 龍野歴史文化資料館 → OSM node 1423044451「たつの市立龍野歴史文化資料館」（約115m）。
 *   ほかは OSM の点と同じ（姫路城は way 23707900 の点で、大天守のそば。そうめんの里 node 4346078912 など）
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-146-f7f504b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f7f504b1-6c02-407f-9648-fd54bf0edf68";
const DAY1_ID = "92a464b8-d17e-472e-b640-90ad9b9eeadc";
const CASTLE = "a2d4923a-9899-4647-a113-6aafd3b2c4f8";
const KOKOEN = "a9cb15b7-f2f4-457e-84f4-f81f8ae60e52";
const MUSEUM = "7694c5da-9868-416b-96dc-45bcc9db7003";
const SCIENCE = "eb760173-4c04-48ad-ba80-23df172311f6";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [CASTLE]: [{ from: "1日目は歩きと電車でめぐります。JR姫路駅から歩いて約20分。", to: "1日目は歩きとバスでめぐります。JR姫路駅に11時ごろ着いたら、歩いて約25分。" }],
  [KOKOEN]: [{ from: "城の西へ歩いて約15分。", to: "城の西へ歩いて約17分。" }],
  [MUSEUM]: [{ from: "好古園から城の北側を回って、歩いて約20分。", to: "好古園から城の北側を回って、歩いて約16分。" }],
  [SCIENCE]: [
    { from: "（あわせて約55分）。", to: "（あわせて約1時間）。バスの本数は多くないので、時刻は前もって公式の案内で確かめましょう。" },
    { from: "常設展示とプラネタリウムの両方を見るなら、早めに入館しましょう。", to: "プラネタリウムの投影の時刻は、公式の案内で確かめましょう。" },
    { from: "時間があれば、夜の姿を眺めに出かけるのもよいでしょう。", to: "時間があれば、夜の姿も眺めに出かけましょう。" },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: "df55c1a4-4e6b-458b-96cc-8a2a8393bb45", from: [34.868401, 134.545013], to: [34.868537, 134.546256] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: CASTLE, h: 11, m: 25, stay: 80, legs: [] },
  { id: KOKOEN, h: 13, m: 2, stay: 60, legs: [walk(17)] },
  { id: MUSEUM, h: 14, m: 18, stay: 45, legs: [walk(16)] },
  { id: SCIENCE, h: 16, m: 0, stay: 30, legs: [walk(27), bus(30, "神姫バス")] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  const allSpots = it.days.flatMap((d) => d.spots);
  for (const c of COORDS) {
    const s = allSpots.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const c of COORDS) await tx.spot.update({ where: { id: c.id }, data: { lat: c.to[0], lng: c.to[1] } });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
