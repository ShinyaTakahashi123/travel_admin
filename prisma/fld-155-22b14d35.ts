/**
 * 初日・最終日の見直し #155 22b14d35「児島ジーンズストリートと鷲羽山、倉敷デニムの町と瀬戸内海の絶景1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は移動の時間が道のりと合っていなかったので直す（終わりは今と同じ 16:30）
 * いまの初日（7か所）: 旧野﨑家住宅 9:30 → ジーンズストリート → 児島駅前（昼食）→ 由加神社本宮 → 由加山蓮台寺 → 熊野神社 → 五流尊瀧院 15:55〜16:30
 * 直した初日（7か所のまま）: JR児島駅に11時ごろ → 駅前でレンタカー（駅レンタカー児島営業所など、手続きに15分ほど）→ 車で約10分（OSRM 4分＋駐車）→
 *   旧野﨑家住宅 11:25 → ジーンズストリート → 児島駅前（昼食 13:04〜）→ 由加山蓮台寺 → 由加神社本宮 → 熊野神社 → 五流尊瀧院 16:13〜16:33
 *   由加山は蓮台寺を先にする（客殿の拝観は時期により 9:00〜15:00 の案内があるため、14:04〜14:39 にする。sp.jorudan.co.jp/newyear/spot_113136.html）
 *   歩き（道のり。routing.openstreetmap.de の foot）: 野﨑家→ジーンズ 519m・7分（すぐ→7）、ジーンズ→車 7分（5→7）、蓮台寺→由加神社 677m・10分（すぐ→10）、
 *     熊野神社→五流尊瀧院 630m・9分（5→9）
 *   車（OSRM）: 児島駅→由加山 16分（20のまま）、由加山→熊野神社 14分（15のまま）
 *   滞在はどれも、もとより短い（野﨑家 70→50、ジーンズ 55→30、昼食 50→40、蓮台寺 60→35、由加神社 40→25、熊野 45→30、五流 35→20）
 * 2日目（終わりは 16:30 で今と同じ）: 祇園神社→架橋記念公園 1,151m・16分（12→16）、公園→車（下津井の町）1,188m・16分（10→16）、
 *   下津井→渋川 OSRM 30分＋駐車で 35分（20→35）。架橋記念公園の滞在 75→60分、水族館 80→70分で合わせる。
 *   レンタカーを児島駅で借りるので、帰りも児島駅で返す（OSRM 23分＋α で約30分）
 * 座標（itinerary-rules 7章）: ジーンズストリート → 道の線の中心は使わず、通りの店の node 5006154021「兒島 Jeans Street」／
 *   渋川マリン水族館 → node 1423614642「市立玉野海洋博物館」（aquarium。いまの点は約12m離れた出どころのわからない点）
 *   ほかは確かめたうえでそのまま（野﨑家・五流尊瀧院・熊野神社＝OSM way の Nominatim の中心、由加神社＝OSM node、蓮台寺・架橋記念公園＝OSM に点がなく国土地理院の番地、
 *   鷲羽山＝OSM の山頂 node、回船問屋＝OSM node、下津井漁港＝OSM node、祇園神社＝OSM node、児島駅＝OSM node）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-155-22b14d35.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "22b14d35-9cbe-40b0-a878-fcc19927489b";
const DAY1_ID = "bde2bcd2-cebe-439c-a908-ff8dcbbecc87";
const NOZAKI = "1ae87e7a-07b2-42bf-af69-1095866a6603";
const JEANS = "a751e2f0-0a61-44d8-876a-817b1a20d158";
const LUNCH = "5fa08e83-f81a-4d71-a117-2f59d60b90a7";
const YUGA = "edf93e3d-8226-49f8-ad91-d5cec0699a78";
const RENDAIJI = "549f5c2a-3187-48c9-95ea-8679ea327b11";
const KUMANO = "65066f7d-c5b0-49eb-99f7-54858fe86434";
const GORYU = "5516fc4e-8c8c-416a-9505-7bffc60bb1dd";
const GION = "64f00cd1-e39e-4c6c-a2fd-32950b46d787";
const KAKYO = "dda85938-324c-481f-96f3-d881a5fe97d0";
const AQUA = "4a834b56-6830-4c24-99d1-31a975042794";
const ORIG_ORDER = [NOZAKI, JEANS, LUNCH, YUGA, RENDAIJI, KUMANO, GORYU];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [NOZAKI]: [
    {
      from: "この旅は車でめぐります。JR岡山駅前でレンタカーを借りて、車で約40分。",
      to: "この旅は車でめぐります。JR児島駅に11時ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車で約10分。",
    },
  ],
  [JEANS]: [{ from: "野﨑家の屋敷から南へ歩いてすぐ。", to: "野﨑家の屋敷から南へ歩いて約7分。" }],
  [LUNCH]: [{ from: "車に戻り、約5分。", to: "車に戻り（歩いて約7分）、約5分。" }],
  [RENDAIJI]: [{ from: "由加神社本宮から歩いてすぐ。", to: "児島駅から車で約20分、由加山の中腹へ。" }],
  [YUGA]: [{ from: "児島駅から車で約20分、由加山の中腹へ。", to: "由加山蓮台寺から歩いて約10分。" }],
  [GORYU]: [{ from: "熊野神社から歩いて約5分。", to: "熊野神社から歩いて約9分。" }],
};
const DAY2_MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KAKYO]: [{ from: "祇園神社から歩いて約12分。", to: "祇園神社から歩いて約16分。" }],
  [AQUA]: [
    { from: "車に戻り、約20分、玉野の渋川へ。", to: "車に戻り（歩いて約16分）、車で約35分、玉野の渋川へ。" },
    { from: "帰りは、岡山駅まで車で約50分、レンタカーを返しましょう。", to: "帰りは、児島駅まで車で約30分、レンタカーを返しましょう。" },
  ],
};
const DAY2_TIMES: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KAKYO, h: 13, m: 29, stay: 60, legs: [walk(16)] },
  { id: AQUA, h: 15, m: 20, stay: 70, legs: [walk(16), car(35)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: JEANS, from: [34.46905, 133.802441], to: [34.468634, 133.803106] },
  { id: AQUA, from: [34.455051, 133.905331], to: [34.454952, 133.905395] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: NOZAKI, h: 11, m: 25, stay: 50, legs: [] },
  { id: JEANS, h: 12, m: 22, stay: 30, legs: [walk(7)] },
  { id: LUNCH, h: 13, m: 4, stay: 40, legs: [walk(7), car(5)] },
  { id: RENDAIJI, h: 14, m: 4, stay: 35, legs: [car(20)] },
  { id: YUGA, h: 14, m: 49, stay: 25, legs: [walk(10)] },
  { id: KUMANO, h: 15, m: 34, stay: 30, legs: [walk(5), car(15)] },
  { id: GORYU, h: 16, m: 13, stay: 20, legs: [walk(9)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== ORIG_ORDER.join()) throw new Error("1日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）`);
    if (MEMO_EDITS[p.id]) console.log(`  ${apply(p.id, MEMO_EDITS[p.id]).slice(0, 70)}…`);
    prevEnd = st + p.stay;
  }
  // 2日目: 祇園神社 12:43〜13:13 → 歩き16 → 架橋記念公園 13:29〜14:29 → 歩き16＋車35 → 水族館 15:20〜16:30（終わりは今と同じ）
  const gion = d2.spots.find((s) => s.id === GION);
  const aqua = d2.spots.find((s) => s.id === AQUA);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  if (!gion || hmOf(gion.visitTime) !== "12:43" || gion.stayDurationMin !== 30 || !aqua || hmOf(aqua.visitTime) !== "15:10" || aqua.stayDurationMin !== 80 || d2.spots.at(-1)?.id !== AQUA)
    throw new Error("2日目の構成が想定と違います");
  console.log("\n2日目: 祇園神社 12:43-13:13 → walk16 → 瀬戸大橋架橋記念公園 13:29-14:29（75→60分）→ walk16+car35 → 渋川マリン水族館 15:20-16:30（80→70分。終わりは今と同じ）");
  for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) console.log(`  2日目 ${all.find((s) => s.id === id)?.name}: ${apply(id, edits).slice(0, 40)}…${apply(id, edits).slice(-40)}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const p of DAY2_TIMES) await tx.spot.update({ where: { id: p.id }, data: timeLegs(p.h, p.m, p.stay, p.legs) });
      for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) await tx.spot.update({ where: { id }, data: { memo: apply(id, edits) } });
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
