/**
 * 初日・最終日の見直し #172 9903e2ef「白糸の滝とタリアセン、自然を感じる軽井沢1泊2日リゾート旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・車。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * いまの初日（7か所）: 白糸の滝 9:00 → 旧三笠ホテル → 雲場池（このあと昼食。昼食は移動の中に隠れていた）→ ショー記念礼拝堂 13:00 → 旧碓氷峠 見晴台 → 熊野皇大神社 → 旧軽井沢銀座通り 15:30〜16:30
 * 直した初日（7か所＋昼食）: JR軽井沢駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車25（OSRM 19.4分＋駐車）→ 白糸の滝 11:40〜12:05 → 車20（OSRM 13.8分、もとのまま）→
 *   旧三笠ホテル 12:25〜12:50 → 車10（OSRM 6.2分、もとのまま）→ 雲場池 13:00〜13:20 → 車8（OSRM 2.8分＋駐車）→【足す】旧軽井沢で昼食 13:28〜14:18（点＝バス停 node 7005550866「旧軽井沢」。店の点は使わない）→
 *   歩11（foot 831m）→ ショー記念礼拝堂 14:29〜14:49 → 歩11（車まで）＋車9（OSRM 3.5分＋駐車）→ 旧碓氷峠 見晴台 15:09〜15:34 → 歩4（288m）→ 熊野皇大神社 15:38〜16:03 →
 *   歩4（見晴台の車まで）＋車9＋歩7（旧軽井沢バス停→銀座通り 516m）→ 旧軽井沢銀座通り 16:23〜16:53
 *   滞在はどれも、もとより短い（白糸 45→25、三笠 45→25、雲場池 50→20、礼拝堂 30→20、見晴台 50→25、神社 35→25、銀座通り 60→30）
 *   車: 礼拝堂→見晴台 15→9（OSRM×1.5＋5 を超えていた）
 * 2日目: 記念館→分去れ 10→12（foot 937m）、分去れ→タリアセン 車20 → 歩19（郷土館の車まで 1,454m）＋車11（OSRM 5.8分＋駐車）、タリアセン→野鳥の森 20→12（OSRM 6.4分）、
 *   野鳥の森→安東美術館 20→15（OSRM 9.2分）（どちらも OSRM×1.5＋5 を超えていた）。終わりが 16:29 になるので、決まり②で郷土館を 9:01 に（安東美術館 15:20〜16:30、もとと同じ）
 *   1か所目に軽井沢駅からの行き方（OSRM 9.5分＋駐車＝約15分）。タリアセンの「昼食をとるのもよいでしょう」を「昼食にしましょう」に（11:43〜13:43 の中）
 * 座標: 野鳥の森 = 出どころ不明（way「ピッキオ」から2m）→ way 1280085230「ピッキオ」の Nominatim（メモの入口のそばのビジターセンター）。
 *   安東美術館は OSM になく、地理院の番地（軽井沢東43番地）と同じでそのまま。ほか（白糸の滝・三笠ホテル・雲場池・礼拝堂・見晴台・神社・銀座通り・郷土館・記念館・分去れ・タリアセン）は OSM の値でそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-172-9903e2ef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9903e2ef-b144-43b3-885f-c552bc7cc906";
const DAY1_ID = "6a8e923f-5ccd-47aa-b0f4-10e51bd60187";
const DAY2_ID = "79a64fd4-2674-4b30-a37c-24d5cd25c4a4";
const SHIRAITO = "7921c54c-210f-49b8-8f26-534f63c414e0";
const MIKASA = "57c3ffc3-9919-402e-9d50-c95910875b15";
const KUMOBA = "41c7d26b-d461-4ed9-abe5-324daffdc00e";
const SHAW = "d88ba9a5-b16c-431c-9781-86ee374a92ec";
const MIHARASHI = "12145e11-1105-4fbd-b793-12e901c5b6ee";
const KUMANO = "4851616a-2f79-4176-9213-ce39b73068c2";
const GINZA = "5364d7c3-597e-4687-a339-c762fc3a8ea2";
const KYODOKAN = "ec501fe2-13d0-482b-a238-3c913f4ddade";
const HORI = "dbdb19e3-8478-4898-a4f4-165da5d27d23";
const WAKASARE = "445baa03-7e3a-4dde-aeef-7e9147426381";
const TALIESIN = "ebaf8e29-91d3-4ccf-baff-72a39d790da3";
const YACHO = "5a86fe33-78af-4729-bc62-1eb21fe1390e";
const ANDO = "56d3542f-da5f-4d00-84ae-36c79f33db62";
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
  [SHIRAITO]: [
    {
      from: "この旅は車（レンタカーなど）でめぐります。旅の始まりは白糸の滝へ。",
      to: "この旅は車でめぐります。JR軽井沢駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約25分。旅の始まりは白糸の滝へ。",
    },
  ],
  [MIKASA]: [{ from: "白糸の滝から車で旧三笠ホテルへ。", to: "白糸の滝から車で約20分、旧三笠ホテルへ。" }],
  [KUMOBA]: [
    { from: "旧三笠ホテルから車で雲場池へ。", to: "旧三笠ホテルから車で約10分、雲場池へ。" },
    { from: "このあと、昼食にしましょう。", to: "このあと、車で旧軽井沢へ向かい、昼食にしましょう。" },
  ],
  [SHAW]: [{ from: "昼食のあとは、旧軽井沢の軽井沢ショー記念礼拝堂へ。", to: "昼食のあとは、歩いて約11分、旧軽井沢の軽井沢ショー記念礼拝堂へ。" }],
  [MIHARASHI]: [
    {
      from: "礼拝堂から車で、標高1200mの旧碓氷峠 見晴台へ。",
      to: "礼拝堂から、車を止めた旧軽井沢バス停のあたりまで歩いて約11分。車で約9分、標高1200mの旧碓氷峠 見晴台へ。",
    },
  ],
  [KUMANO]: [{ from: "見晴台から歩いてすぐ、", to: "見晴台から歩いて約4分、" }],
  [GINZA]: [
    {
      from: "碓氷峠から車で、旧軽井沢のメインストリート・旧軽井沢銀座通りへ。",
      to: "見晴台の車まで歩いて約4分、車で約9分で旧軽井沢へ戻り、旧軽井沢バス停のあたりから歩いて約7分。旧軽井沢のメインストリート・旧軽井沢銀座通りへ。",
    },
  ],
  [KYODOKAN]: [{ from: "2日目は、車で中山道の宿場町だった追分へ。", to: "2日目は、軽井沢駅のあたりから車で約15分、中山道の宿場町だった追分へ。" }],
  [HORI]: [{ from: "郷土館から歩いて、堀辰雄文学記念館へ。", to: "郷土館から歩いて約10分、堀辰雄文学記念館へ。" }],
  [WAKASARE]: [{ from: "記念館からさらに西へ歩いて、", to: "記念館からさらに西へ歩いて約12分、" }],
  [TALIESIN]: [
    {
      from: "追分から車で、塩沢湖を中心に広がる軽井沢タリアセンへ。",
      to: "分去れから郷土館の車まで歩いて約19分、車で約11分。塩沢湖を中心に広がる軽井沢タリアセンへ。",
    },
    { from: "園内で昼食をとるのもよいでしょう。", to: "園内で昼食にしましょう。" },
  ],
  [YACHO]: [{ from: "タリアセンから車で、", to: "タリアセンから車で約12分、" }],
  [ANDO]: [{ from: "旅の締めくくりは、軽井沢駅の近くにある軽井沢安東美術館へ。", to: "旅の締めくくりは、野鳥の森から車で約15分、軽井沢駅の近くにある軽井沢安東美術館へ。" }],
};

const LUNCH = {
  name: "旧軽井沢で昼食",
  lat: 36.356625,
  lng: 138.633987,
  address: "長野県北佐久郡軽井沢町大字軽井沢",
  memo: "雲場池から車で約8分。旧軽井沢の町なかに車を止めて、旧軽井沢バス停のあたりで、昼食にしましょう。",
  h: 13,
  m: 28,
  stay: 50,
  legs: [car(8)] as Leg[],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHIRAITO, h: 11, m: 40, stay: 25, legs: [] },
  { id: MIKASA, h: 12, m: 25, stay: 25, legs: [car(20)] },
  { id: KUMOBA, h: 13, m: 0, stay: 20, legs: [car(10)] },
  { id: SHAW, h: 14, m: 29, stay: 20, legs: [walk(11)] },
  { id: MIHARASHI, h: 15, m: 9, stay: 25, legs: [walk(11), car(9)] },
  { id: KUMANO, h: 15, m: 38, stay: 25, legs: [walk(4)] },
  { id: GINZA, h: 16, m: 23, stay: 30, legs: [walk(4), car(9), walk(7)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KYODOKAN, h: 9, m: 1, stay: 45, legs: [] },
  { id: HORI, h: 9, m: 56, stay: 45, legs: [walk(10)] },
  { id: WAKASARE, h: 10, m: 53, stay: 20, legs: [walk(12)] },
  { id: TALIESIN, h: 11, m: 43, stay: 120, legs: [walk(19), car(11)] },
  { id: YACHO, h: 13, m: 55, stay: 70, legs: [car(12)] },
  { id: ANDO, h: 15, m: 20, stay: 70, legs: [car(15)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [{ id: YACHO, from: [36.363653, 138.591431], to: [36.363651, 138.591413] }];

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
  type Row = { h: number; m: number; stay: number; legs: Leg[]; name: string; orig: string; edits: string[] };
  const show = (label: string, rows: Row[]) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of rows) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${p.name}（もと ${p.orig}）`);
      for (const e of p.edits) console.log(`  → ${e}`);
      prevEnd = st + p.stay;
    }
  };
  const rowsOf = (plan: typeof PLAN, spots: typeof d1.spots): Row[] =>
    plan.map((p) => {
      const s = spots.find((x) => x.id === p.id)!;
      return { ...p, name: s.name, orig: `${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分`, edits: (MEMO_EDITS[p.id] ?? []).map((e) => e.to) };
    });
  const rows1 = rowsOf(PLAN, d1.spots);
  rows1.splice(3, 0, { ...LUNCH, orig: "足す", edits: [LUNCH.memo] });
  show("1日目（直したあと）", rows1);
  show("2日目（直したあと）", rowsOf(DAY2, d2.spots));
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const item = (p: (typeof PLAN)[number]) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
  const create = (x: typeof LUNCH) => ({
    create: { name: x.name, visitTime: t(x.h, x.m), stayDurationMin: x.stay, transitLegs: { create: legsCreate(x.legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, [...PLAN.slice(0, 3).map(item), create(LUNCH), ...PLAN.slice(3).map(item)] as never, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2.map(item) as never, { tx });
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
