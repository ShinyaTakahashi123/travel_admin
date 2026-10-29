/**
 * 初日・最終日の見直し #160 dc8d9ae8「池間大橋と来間大橋、宮古島の橋めぐりを楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は車の時間が道のりと合っていなかった1区間を直す（終わりは16:38で範囲内）
 * いまの初日（10か所）: 池間大橋 9:00 → 西平安名崎 → 雪塩ミュージアム → 島尻マングローブ林 → 海中公園（昼食）→ 砂山ビーチ → 伊良部大橋 → 牧山展望台 → 渡口の浜 → 通り池 16:15〜16:50
 * 直した初日（8か所）: 宮古空港に11時ごろ → 空港の近くでレンタカー（手続きに15分ほど）→ 車で約30分（OSRM 22分＋駐車）→
 *   池間大橋 11:45 → 西平安名崎 → 島尻マングローブ林 → 海中公園（昼食 13:26〜）→ 砂山ビーチ → 伊良部大橋 → 牧山展望台 → 通り池 16:33〜16:53
 *   雪塩ミュージアムと渡口の浜を外す（11時からでは入りきらないため。どちらも写真なし。説明文にあるマングローブ林は残す）
 *   車（OSRM＋駐車5分）: 池間大橋（池間島側）→西平安名崎 8分→13（5→13）、西平安名崎→マングローブ林 9分→14、マングローブ林→海中公園 9分→14（5→14）、牧山展望台→通り池 17分→22。ほかはもとの値が OSRM 以上なのでそのまま
 *   滞在はどれも、もとより短い（池間 40→20、西平安名 30→20、マングローブ 30→20、海中公園 75→60、砂山 45→30、伊良部 20→15、牧山 30→20、通り池 35→20）
 * 2日目: 与那覇前浜→熱帯植物園 OSRM 13分（もとの25分は OSRM×1.5＋5 を超えるので、＋駐車で18分に）。植物園 11:43、博物館 13:08、ドイツ文化村 14:33、東平安名崎 15:58〜16:38。
 *   最後の東平安名崎に帰りの一文がなかったので足す（宮古空港まで OSRM 22分＋α で約30分）。「確かめてください」を直す
 * 座標（itinerary-rules 7章）: 今の点の多くが OSM の値を5けたに丸めたものだったので、OSM の点（node、または way の Nominatim の点）にそろえる:
 *   池間大橋＝池間島側のたもとの node 6395030564「池間大橋」（記念碑。メモの「池間島側まで渡ってから振り返る」に合う）、
 *   伊良部大橋・来間大橋・島尻マングローブ林＝今の点が地理院の地名の点（同じ値）なので、そのまま（企画運営 10/30）、西平安名崎・牧山展望台・通り池・竜宮城展望台・総合博物館・東平安名崎＝同じ名前の node、
 *   海中公園＝同じ名前の way、うえのドイツ文化村＝メモにある「博愛記念館」の way、熱帯植物園・体験工芸村＝園の案内板 node（園の面の中心は使わない）、
 *   砂山ビーチ・与那覇前浜＝OSM に砂浜の面しかないので、その way の Nominatim の点
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-160-dc8d9ae8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "dc8d9ae8-acd1-48d8-9360-d6acfc7b9cd5";
const DAY1_ID = "aa204010-7162-469a-b084-d99fad938767";
const DAY2_ID = "7945d848-1794-4f1e-841c-b4cbe948014e";
const IKEMA = "15228531-e154-47ec-9909-d789b6383451";
const NISHIHENNA = "418a596b-8ba0-4b2b-94af-0a37e2efe177";
const YUKISHIO = "ed19619e-1d8e-4a92-8588-5173088474e6";
const MANGROVE = "7fbd808a-f75c-4962-b402-d1d05690fca5";
const KAICHU = "e2d9a995-bd5b-45b3-80ba-59c2f5554ead";
const SUNAYAMA = "41b2bf07-9b34-4db0-92a4-02f07ea1edbb";
const IRABU = "eacaf970-a037-4e1b-ae17-a9ca23eda0dd";
const MAKIYAMA = "13eda56e-2704-410c-8812-43d13c39eb20";
const TOGUCHI = "11cd2b56-49eb-4062-bc60-11f988a9959c";
const TORIIKE = "0f858141-b595-42d6-b133-99e67c379251";
const KURIMA = "5fe9bbf5-9c69-4ee6-9856-88633e9c65b1";
const RYUGU = "4ed68ac3-892b-467c-b3b4-d68ca22d4bf2";
const MAEHAMA = "d408ff1f-1c37-4fb0-9c6d-1f88b173c58d";
const SHOKUBUTSU = "7d93bebd-3057-415a-a075-d0492bb2c45a";
const HAKUBUTSU = "5b5d5071-2275-457c-adb9-ac033a2b8c8d";
const DOITSU = "767a4556-9d58-43df-ba17-ab20be00723e";
const HIGASHIHENNA = "e79bc238-0a1f-4c26-b343-bb71ee99404f";
const ORIG_DAY1 = [IKEMA, NISHIHENNA, YUKISHIO, MANGROVE, KAICHU, SUNAYAMA, IRABU, MAKIYAMA, TOGUCHI, TORIIKE];
const ORIG_DAY2 = [KURIMA, RYUGU, MAEHAMA, SHOKUBUTSU, HAKUBUTSU, DOITSU, HIGASHIHENNA];
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
  [IKEMA]: [{ from: "宮古空港から車で約30分。", to: "この旅は車でめぐります。宮古空港に11時ごろ着いたら、空港の近くでレンタカーを借りて（手続きに15分ほど）、車で約30分。" }],
  [NISHIHENNA]: [{ from: "池間大橋のたもとから車で約5分、", to: "池間大橋のたもとから車で約13分、" }],
  [MANGROVE]: [{ from: "雪塩ミュージアムから車で約10分、", to: "西平安名崎から車で約14分、" }],
  [KAICHU]: [{ from: "マングローブ林から車で約5分。", to: "マングローブ林から車で約14分。" }],
  [TORIIKE]: [{ from: "渡口の浜から車で約15分、", to: "牧山展望台から車で約22分、" }],
  [SHOKUBUTSU]: [
    { from: "与那覇前浜から車で約25分、", to: "与那覇前浜から車で約18分、" },
    { from: "公式の案内で確かめてください。", to: "公式の案内で確かめましょう。" },
  ],
  [HIGASHIHENNA]: [
    {
      from: "2日間の橋めぐりの締めくくりに、島の端から広い海を眺めましょう。",
      to: "2日間の橋めぐりの締めくくりに、島の端から広い海を眺めましょう。帰りは、宮古空港まで車で約30分、レンタカーを返しましょう。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: IKEMA, h: 11, m: 45, stay: 20, legs: [] },
  { id: NISHIHENNA, h: 12, m: 18, stay: 20, legs: [car(13)] },
  { id: MANGROVE, h: 12, m: 52, stay: 20, legs: [car(14)] },
  { id: KAICHU, h: 13, m: 26, stay: 60, legs: [car(14)] },
  { id: SUNAYAMA, h: 14, m: 41, stay: 30, legs: [car(15)] },
  { id: IRABU, h: 15, m: 26, stay: 15, legs: [car(15)] },
  { id: MAKIYAMA, h: 15, m: 51, stay: 20, legs: [car(10)] },
  { id: TORIIKE, h: 16, m: 33, stay: 20, legs: [car(22)] },
];
const DAY2_TIMES: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHOKUBUTSU, h: 11, m: 43, stay: 80, legs: [car(18)] },
  { id: HAKUBUTSU, h: 13, m: 8, stay: 60, legs: [car(5)] },
  { id: DOITSU, h: 14, m: 33, stay: 60, legs: [car(25)] },
  { id: HIGASHIHENNA, h: 15, m: 58, stay: 40, legs: [car(25)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: IKEMA, from: [24.920405, 125.26078], to: [24.924621, 125.25513] },
  { id: NISHIHENNA, from: [24.91023, 125.25521], to: [24.910234, 125.255214] },
  { id: KAICHU, from: [24.87875, 125.27472], to: [24.878747, 125.274718] },
  { id: SUNAYAMA, from: [24.83938, 125.28061], to: [24.83939, 125.280561] },
  { id: MAKIYAMA, from: [24.81778, 125.21832], to: [24.817785, 125.218322] },
  { id: TORIIKE, from: [24.8242, 125.13628], to: [24.824205, 125.136276] },
  { id: RYUGU, from: [24.72604, 125.25167], to: [24.726036, 125.251667] },
  { id: MAEHAMA, from: [24.73598, 125.26301], to: [24.736045, 125.261195] },
  { id: SHOKUBUTSU, from: [24.80059, 125.3162], to: [24.80059, 125.315203] },
  { id: HAKUBUTSU, from: [24.79693, 125.31769], to: [24.796933, 125.317688] },
  { id: DOITSU, from: [24.71913, 125.32428], to: [24.719127, 125.324277] },
  { id: HIGASHIHENNA, from: [24.71881, 125.46914], to: [24.718813, 125.469141] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== ORIG_DAY1.join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== ORIG_DAY2.join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  for (const id of [YUKISHIO, TOGUCHI]) {
    const s = d1.spots.find((x) => x.id === id)!;
    console.log(`外す: ${s.name}（写真 ${s.photos.length} 枚）`);
  }
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: typeof PLAN, spots: typeof d1.spots, startEnd = -1) => {
    console.log(`\n${label}`);
    let prevEnd = startEnd;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      if (MEMO_EDITS[p.id]) for (const e of MEMO_EDITS[p.id]) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", PLAN, d1.spots);
  // 2日目: 与那覇前浜 10:25〜11:25（もとのまま）から
  const mae = d2.spots.find((s) => s.id === MAEHAMA)!;
  if (hmOf(mae.visitTime) !== "10:25" || mae.stayDurationMin !== 60) throw new Error("2日目の与那覇前浜が想定と違います");
  show("2日目（与那覇前浜 10:25〜11:25 のあと）", DAY2_TIMES, d2.spots, 11 * 60 + 25);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [YUKISHIO, TOGUCHI] });
      for (const p of DAY2_TIMES) await tx.spot.update({ where: { id: p.id }, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
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
