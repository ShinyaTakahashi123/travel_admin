/**
 * 初日・最終日の見直し #171 c27fe728「海辺の絶景とデジタルアート、お台場を楽しむ旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・電車と歩き。初日を11時ごろからにする。2日目はもとから 16:35 に終わる（移動の誤りだけ直す）
 * いまの初日（7か所）: 潮風公園 9:00 → 宗谷 → ダイバーシティ東京プラザ（昼食）→ フジテレビ → アクアシティ → お台場海浜公園 → 台場公園 15:40〜16:35
 * 直した初日（7か所のまま）: りんかい線 東京テレポート駅に11時ごろ → 歩14（foot 1,078m）→ 潮風公園 11:14〜11:39 → 歩15（1,165m）→ 宗谷 11:54〜12:34 →
 *   歩18（1,366m）→ ダイバーシティ（昼食）12:52〜13:42 → 歩4（289m）→ フジテレビ 13:46〜14:36 → 歩6（401m）→ アクアシティ 14:42〜15:02 →
 *   歩12（960m）→ お台場海浜公園（おだいばビーチ）15:14〜15:54 → 歩9（672m）→ 台場公園 16:03〜16:33
 *   滞在はどれも、もとより短い（潮風 45→25、宗谷 60→40、ダイバーシティ 70→50、フジ 70→50、アクア 40→20、海浜公園 50→40、台場公園 55→30）
 *   潮風公園の「朝の海」を「海」に。台場公園に宿の一文
 * 2日目: 移動を測り直す（foot）: 新豊洲駅→チームラボ 257m・4分（「すぐ」→約4分）、1か所目に宿からの行き方（ゆりかもめ 台場→新豊洲 直通15分、ekitan。法務 10/30）、チームラボ→市場 1,195m・15分（そのまま）、
 *   市場→ビッグサイトの電車20分はそのまま（市場前駅まで 569m・8分＋ゆりかもめ3駅＋駅から 325m・5分）、ビッグサイト→水の科学館 10→13（1,033m）、水の科学館→そなエリア 10→15（1,155m）。
 *   そなエリア 15:13〜16:35（1泊2日の最終日は終わりを今より遅くしないので、滞在 90→82分。企画運営 10/30）。帰りの一文（国際展示場駅まで 340m・5分）
 * 座標（itinerary-rules 355・371・372）:
 *   お台場海浜公園: 公園の relation の中心 → way 149124465「おだいばビーチ」の Nominatim（メモの砂浜）
 *   台場公園: 公園の relation の中心 → node 2805871803「第三台場」（historic。メモの第三台場）
 *   潮風公園: relation の中心 → 名前のある node 6817231205「潮風公園」（information=map）の点（企画運営 10/30、#9 嵐山公園と同じ考え方）
 *   ほか（宗谷・ダイバーシティ・フジテレビ・アクアシティ・チームラボ・豊洲市場・ビッグサイト・水の科学館・そなエリア）は OSM の値と同じでそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-171-c27fe728.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c27fe728-37c2-4ca0-9bac-06451d485ff2";
const DAY1_ID = "0fa1e254-2331-4a0a-ac5d-afb0ae492259";
const DAY2_ID = "a44ce9cd-7fce-461a-b7ab-5e1172d98bae";
const SHIOKAZE = "e24e6a97-9c8c-4795-a2bb-9758283cb865";
const SOYA = "6eb6905b-b02c-4c35-9874-ac5d19ef93e0";
const DIVER = "e00604cc-e9a1-4b67-94a4-1d7132069f0c";
const FUJI = "588e2d3c-ead0-4016-927e-11e4b9a7a673";
const AQUA = "6bf10dfe-2107-430e-ba69-73afaf3d0552";
const SEASIDE = "3bc09d38-5804-4696-bd99-45a9adfaa7a3";
const DAIBA = "a1644012-183c-459e-a851-02e6db4b5d16";
const TEAMLAB = "a960129e-1879-47c5-86c6-e780c18443c1";
const MARKET = "2675d7ea-0cce-49c5-b953-ab751eec2008";
const BIGSIGHT = "19fc7936-fdcd-49de-b938-f10ed38491b0";
const WATER = "076e6129-ea59-446a-9701-05df6f9536d6";
const SONA = "7801204d-6624-4424-9fe0-903789cceca5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHIOKAZE]: [
    {
      from: "臨海副都心の西側にある海沿いの公園です。",
      to: "この旅は電車と歩きでめぐります。りんかい線の東京テレポート駅に11時ごろ着いたら、歩いて約14分。臨海副都心の西側にある海沿いの公園です。",
    },
    { from: "朝の海を眺めながら、", to: "海を眺めながら、" },
  ],
  [SOYA]: [{ from: "潮風公園から歩いて約10分、", to: "潮風公園から歩いて約15分、" }],
  [DIVER]: [{ from: "宗谷から歩いて約15分、", to: "宗谷から歩いて約18分、" }],
  [FUJI]: [{ from: "ダイバーシティから歩いて約10分。", to: "ダイバーシティから歩いて約4分。" }],
  [AQUA]: [{ from: "フジテレビから歩いてすぐ、", to: "フジテレビから歩いて約6分、" }],
  [SEASIDE]: [{ from: "アクアシティお台場から歩いて約10分。", to: "アクアシティお台場から歩いて約12分。" }],
  [DAIBA]: [
    { from: "お台場海浜公園から歩いて約10分。", to: "お台場海浜公園の砂浜から歩いて約9分。" },
    {
      from: "催しの準備などで入れない期間があるので、公式の案内で確かめてから訪れましょう。",
      to: "催しの準備などで入れない期間があるので、公式の案内で確かめてから訪れましょう。この夜は、お台場の宿に泊まりましょう。",
    },
  ],
  [TEAMLAB]: [{ from: "ゆりかもめの新豊洲駅から歩いてすぐ。", to: "2日目は、お台場の宿からゆりかもめで新豊洲駅へ（台場駅から約15分）、駅から歩いて約4分。" }],
  [WATER]: [{ from: "東京ビッグサイトから歩いて約10分。", to: "東京ビッグサイトから歩いて約13分。" }],
  [SONA]: [
    { from: "水の科学館から歩いて約10分、", to: "水の科学館から歩いて約15分、" },
    {
      from: "休館日は公式の案内で確かめてから訪れましょう。",
      to: "休館日は公式の案内で確かめてから訪れましょう。お台場と有明の海辺をめぐった2日間の旅を、ここで締めくくりましょう。帰りは、歩いて約5分の、りんかい線の国際展示場駅から。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHIOKAZE, h: 11, m: 14, stay: 25, legs: [] },
  { id: SOYA, h: 11, m: 54, stay: 40, legs: [walk(15)] },
  { id: DIVER, h: 12, m: 52, stay: 50, legs: [walk(18)] },
  { id: FUJI, h: 13, m: 46, stay: 50, legs: [walk(4)] },
  { id: AQUA, h: 14, m: 42, stay: 20, legs: [walk(6)] },
  { id: SEASIDE, h: 15, m: 14, stay: 40, legs: [walk(12)] },
  { id: DAIBA, h: 16, m: 3, stay: 30, legs: [walk(9)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: TEAMLAB, h: 9, m: 0, stay: 90, legs: [] },
  { id: MARKET, h: 10, m: 45, stay: 120, legs: [walk(15)] },
  { id: BIGSIGHT, h: 13, m: 5, stay: 30, legs: [] },
  { id: WATER, h: 13, m: 48, stay: 70, legs: [walk(13)] },
  { id: SONA, h: 15, m: 13, stay: 82, legs: [walk(15)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: SHIOKAZE, from: [35.624224, 139.769091], to: [35.625865, 139.769314] },
  { id: SEASIDE, from: [35.631084, 139.777354], to: [35.632159, 139.777349] },
  { id: DAIBA, from: [35.633529, 139.771539], to: [35.633552, 139.77203] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  // もとの移動をそのまま使う区間（豊洲市場→東京ビッグサイトのゆりかもめ20分）
  const keep = (id: string) => all.find((s) => s.id === id)!.transitLegs.map((l) => ({ mode: l.transitMode as Leg["mode"], min: l.transitDurationMin ?? 0, line: l.transitLine ?? undefined }));
  DAY2[2].legs = keep(BIGSIGHT);
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
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to || "（消す）" + e.from}`);
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
