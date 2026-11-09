/**
 * 初日・最終日の見直し #139 6e5b2d45「濃溝の滝と養老渓谷、房総の絶景自然を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・車の旅。初日を11時ごろからにする（最終日は1泊2日なので今のまま。最終日のメモ「帰りも安全運転で」から、家の車で来る形）
 * いまの初日（4か所）: 濃溝の滝 9:00 → 亀山湖（昼食）→ 大福山展望台 → 養老渓谷 14:20〜16:30
 * 直した初日（4か所のまま）: 館山自動車道の君津ICに11時ごろ → 車で約25分（OSRM 24.6km・約24分）→ 濃溝の滝 11:25 → 亀山湖（昼食 12:35〜）→ 大福山展望台 → 養老渓谷 15:15〜16:55
 *   どこも外さない（説明文に全部出てくる）。移動の時間は今のまま（亀山湖→大福山の40分は、県道の通行規制のまわり道を見込んだもの。
 *   千葉県の発表で、大福山に近い県道大多喜里見線（市原市月出）が2026年6月4日から全面通行止め・対策完了まで（pref.chiba.lg.jp/doukan/press/2026/ichiharashitsukide.html）。
 *   OSRM の17分は林道（坂畑線・大福山線）を通る道で、規制のまわり道を考えていないので、40分のまま）
 *   滞在を短くした（濃溝の滝 60→55分、亀山湖 75→60分、大福山 50→40分、養老渓谷 130→100分）
 * 座標（itinerary-rules 7章）: 濃溝の滝 → OSM node 6726463589「濃溝の滝」（waterway=waterfall。いまは約4mずれた点）／
 *   2日目の大多喜の城下町（渡辺家住宅）→ way 1375168067「渡辺家住宅」（約2m）
 *   ほかはOSMの点と同じ（養老渓谷＝way 126483152「養老渓谷観音橋」、粟又の滝＝node 4681426542、大多喜城＝node 1420729461、
 *   鵜原理想郷＝node 2713711768「手弱女平」、海中展望塔＝node 3379582849）
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-139-6e5b2d45.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6e5b2d45-92e1-4cfe-913d-b80babce8573";
const DAY1_ID = "d5b3d03a-13af-4203-9a01-6ec52963bf8d";
const NOMIZO = "70610f3e-8f58-47a2-ac55-cab768d7469c";
const KAMEYAMA = "935435c4-68d5-4ddd-9bab-13b18bfe8401";
const DAIFUKU = "e34a232f-eb9c-4d96-9bec-fbf93e9b9cf0";
const YORO = "69a50b2d-f9f6-4d80-b941-afbe7a26e1c8";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [NOMIZO]: [
    {
      from: "旅の始まりは、君津市の清水渓流広場（濃溝の滝・亀岩の洞窟）へ。",
      to: "この旅は車でめぐります。館山自動車道の君津ICに11時ごろ着いたら、車で約25分。旅の始まりは、君津市の清水渓流広場（濃溝の滝・亀岩の洞窟）へ。",
    },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: NOMIZO, from: [35.185382, 140.060211], to: [35.185361, 140.060249] },
  { id: "b98533bd-24bb-4f5f-9ddc-bafe43138d0d", from: [35.287015, 140.246088], to: [35.286999, 140.246088] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: NOMIZO, h: 11, m: 25, stay: 55, legs: [] },
  { id: KAMEYAMA, h: 12, m: 35, stay: 60, legs: [car(15)] },
  { id: DAIFUKU, h: 14, m: 15, stay: 40, legs: [car(40)] },
  { id: YORO, h: 15, m: 15, stay: 100, legs: [car(20)] },
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
