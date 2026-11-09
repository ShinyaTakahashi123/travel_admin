/**
 * 初日・最終日の見直し #178 3d13f9de「宮崎神宮とフローランテ宮崎、緑と花に包まれる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・車。初日を11時ごろからにする。2日目はもとから 16:34 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 直した初日（7か所のまま。もとは歩きのあと美術館で急に「ここで車に乗り換えて」だったので、はじめからレンタカーで神宮に止める。企画運営 10/30）:
 *   JR宮崎駅に11時ごろ → レンタカー（手続きに15分ほど）→ 車11（OSRM 5.7分＋駐車）→ 宮崎神宮 11:26〜11:56 → 歩9（foot 696m）→ 総合博物館 12:05〜12:45 → 歩9（641m）→
 *   護国神社 12:54〜13:09 → 歩14（1,049m）→ 総合文化公園（昼食。もとのメモのまま）13:23〜14:08 → 歩1 → 県立美術館 14:09〜14:39 → 歩13（神宮の車まで 1,027m）＋車11（OSRM 5.6分＋駐車）→
 *   平和台公園 15:03〜15:43 → 車15（OSRM 10.1分、もとのまま）→ 橘公園 15:58〜16:38
 *   滞在はどれも、もとより短い（神宮 60→30、博物館 80→40、護国 30→15、文化公園 80→45、美術館 45→30、平和台 60→40、橘 55→40）
 * 2日目: フローランテ→江田神社 8→7（OSRM 1.1分、もとは×1.5＋5 超え）、森林公園→サンビーチ 歩8 → 車9（点を直すと foot 2,220m・28分なので車。OSRM 3.7分＋駐車）。
 *   フローランテ 9:30 → 江田 10:47 → 住吉 11:40 → 森林公園（昼食）12:40〜14:00 → サンビーチ 14:09〜14:49 → 青島神社 15:19〜16:34（もとと同じ終わり）
 *   1か所目に宿（橘公園のあたり）から車で約14分（OSRM 9.0分＋駐車）、帰りの一文に宮崎駅まで車で約31分（OSRM 26.4分＋駐車）
 * 座標: 宮崎神宮 = node 9611934970（もとは4けた）。フローランテ宮崎 = way 1309500938 の Nominatim（もとの点は約1.35km 違う場所。園内に名前の点がなく、公園の way の中心＝企画運営の例外）。
 *   阿波岐原森林公園 = way 698820228「阿波岐原森林公園管理事務所」の Nominatim（もとは 391ha の公園の way の中心。企画運営 10/30）。
 *   サンビーチ一ツ葉 = みやざき臨海公園の way の中心のまま（同じ名前のバス停・駐車場の点がなく、企画運営の例外）。ほかは OSM の値でそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-178-3d13f9de.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "3d13f9de-a522-4db3-ac1d-35778ac017f1";
const DAY1_ID = "27b146d6-c78a-4093-8215-ad2713cb0764";
const DAY2_ID = "f13a1d16-8b23-4709-8121-a8324a9894d5";
const JINGU = "754ef8a0-8b4c-4164-a1a7-ffd16ae9cf66";
const HAKU = "3e4f3504-0500-49c4-b0e9-571e4d172be9";
const GOKOKU = "4b9250a8-76e1-4f44-a586-df1844487a45";
const BUNKA = "31f5d234-d313-4d65-b120-3513ddbd322e";
const BIJUTSU = "89583067-e45d-4408-a300-1df4238f4105";
const HEIWA = "ddb4e5e5-c704-46b7-ab1c-318499c1075a";
const TACHIBANA = "c09ca8c5-30bb-4837-8cde-8450d15525dd";
const FLORANTE = "4fa365e2-2fae-42fb-aa1c-f1fe24feefd8";
const EDA = "b2761d21-2b6d-4d77-9e39-ff6212467694";
const SUMIYOSHI = "e65fe73f-c506-44bb-bec0-9036ba8d446f";
const AWAKIGAHARA = "7ba0abf5-966b-4b76-977c-d0ec15bf3f1d";
const SUNBEACH = "ecd1ea12-1415-413b-ac0f-3b2a9c2df2c0";
const AOSHIMA = "cc81ee7b-822d-42d0-a30f-fd05e61a622e";
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
  [JINGU]: [
    {
      from: "宮崎神宮は、日本の初代天皇",
      to: "この旅は車でめぐります。JR宮崎駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約11分。宮崎神宮は、日本の初代天皇",
    },
  ],
  [HAKU]: [{ from: "宮崎神宮からは歩いて3分ほどです。", to: "宮崎神宮からは歩いて9分ほどです。" }],
  [GOKOKU]: [{ from: "宮崎県総合博物館からは徒歩5分ほどです。", to: "宮崎県総合博物館からは徒歩9分ほどです。" }],
  [BUNKA]: [{ from: "宮崎県護国神社からは徒歩6分ほどです。", to: "宮崎県護国神社からは徒歩14分ほどです。" }],
  [BIJUTSU]: [{ from: "宮崎県総合文化公園からは徒歩2分ほどです。", to: "宮崎県総合文化公園からは徒歩1分ほどです。" }],
  [HEIWA]: [{ from: "宮崎県立美術館からは、ここで車に乗り換えて10分ほどです。", to: "宮崎県立美術館から宮崎神宮の車まで歩いて13分ほど戻り、車で11分ほどです。" }],
  [FLORANTE]: [{ from: "フローランテ宮崎は、「花のまちづくり」", to: "2日目は、橘公園のあたりの宿から車で約14分。フローランテ宮崎は、「花のまちづくり」" }],
  [EDA]: [{ from: "フローランテ宮崎からは車で8分ほどです。", to: "フローランテ宮崎からは車で7分ほどです。" }],
  [AWAKIGAHARA]: [{ from: "住吉神社からは車で20分ほどです。", to: "住吉神社からは車で20分ほどです。公園の管理事務所のあたりから、松林の中を歩いてみましょう。" }],
  [SUNBEACH]: [{ from: "阿波岐原森林公園からは徒歩8分ほどです。", to: "阿波岐原森林公園の管理事務所のあたりからは、車で9分ほどです。" }],
  [AOSHIMA]: [{ from: " 参拝を終えたら、車で宮崎市街・宮崎空港方面へ戻りましょう。", to: "帰りは、車で約31分の宮崎駅へ戻り、レンタカーを返しましょう。" }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: JINGU, h: 11, m: 26, stay: 30, legs: [] },
  { id: HAKU, h: 12, m: 5, stay: 40, legs: [walk(9)] },
  { id: GOKOKU, h: 12, m: 54, stay: 15, legs: [walk(9)] },
  { id: BUNKA, h: 13, m: 23, stay: 45, legs: [walk(14)] },
  { id: BIJUTSU, h: 14, m: 9, stay: 30, legs: [walk(1)] },
  { id: HEIWA, h: 15, m: 3, stay: 40, legs: [walk(13), car(11)] },
  { id: TACHIBANA, h: 15, m: 58, stay: 40, legs: [car(15)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: FLORANTE, h: 9, m: 30, stay: 70, legs: [] },
  { id: EDA, h: 10, m: 47, stay: 45, legs: [car(7)] },
  { id: SUMIYOSHI, h: 11, m: 40, stay: 40, legs: [car(8)] },
  { id: AWAKIGAHARA, h: 12, m: 40, stay: 80, legs: [car(20)] },
  { id: SUNBEACH, h: 14, m: 9, stay: 40, legs: [car(9)] },
  { id: AOSHIMA, h: 15, m: 19, stay: 75, legs: [car(30)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: JINGU, from: [31.9385, 131.4235], to: [31.938358, 131.42351] },
  { id: FLORANTE, from: [31.9522, 131.4517], to: [31.953877, 131.465839] },
  { id: AWAKIGAHARA, from: [31.925287, 131.46384], to: [31.918669, 131.459577] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  for (const [id, edits] of Object.entries(MEMO_EDITS)) apply(id, edits);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: typeof PLAN, spots: typeof d1.spots) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", PLAN, d1.spots);
  show("2日目（直したあと）", DAY2, d2.spots);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: typeof PLAN) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
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
