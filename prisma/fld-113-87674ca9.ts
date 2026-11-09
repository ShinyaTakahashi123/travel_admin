/**
 * 初日・最終日の見直し #113 87674ca9「横山展望台と英虞湾、リアス海岸の真珠養殖の海を望む1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 車は OSRM（もとの値が ×1.5＋5 の内側ならそのまま、新しい区間・外れる区間は切り上げ＋5）。もとは「車（レンタカーなど）」だけで、借りる・返す場所がないので、伊勢市駅で借りて返す（手続き15分ずつ）
 * 1日目: 伊勢市駅 10:30ごろ → レンタカー（手続き15分）→ 車19（OSRM 14.0）→ 天の岩戸 11:04 → 車25（16.2、もとのまま）→ 横山展望台 12:09（65→40）→
 *   車14（8.9）→【新】鵜方のまわり 13:03〜13:53（昼食。もとは横山と大王埼灯台のあいだの移動の中に昼食）→ 車19（13.7）→ 大王埼灯台 14:12（60→45）→
 *   車15（9.0、もとのまま）→ 桐垣展望台 15:12（40→30）→ 車25（18.1、もとのまま）→ 金比羅山展望台 16:07〜16:57（90→50）→ 車35（29.7）で賢島のまわりの宿
 * 2日目（16:30 に出るのはもとのまま）: 宿 → 歩2（143m）→ 遊覧船 9:30 → 歩2で宿の駐車場（企画運営）→ 車23（18.0。もと10）→ 西山慕情が丘 10:55（30→28）→ 車25（21.2、もとのまま）→ 志摩大橋 11:48 →
 *   車39（33.5。もと25）→ ビン玉ロード 12:52（40→25）→ 車7（1.4）→【新】浜島港のまわり 13:24〜14:12（昼食。もとはビン玉ロードと伊雑宮のあいだの移動の中に昼食）→
 *   車23（17.3）→ 伊雑宮 14:35 → 車30（17.5、もとのまま）→ 伊勢神宮 内宮 15:35〜16:30 → 車12（6.3）で伊勢市駅、レンタカーを返す（15分）
 * 点: 遊覧船＝OSM「賢島」ferry_terminal node 8041577373（いまは乗り場の案内図 node 12548011111）／伊雑宮＝OSM「伊雜宮」place_of_worship way 820372787（Nominatim。いまは約80m東）／
 *   内宮＝ほかのしおり（c9b3ad40・659dc2d8）と同じ way 555110597 の値／
 *   昼食＝バス停「金谷」node 12495839377（まわりに あじへい・かめ吉・グリルボンネ・台湾料理 台北 などの食事処の点）・OSM「浜島」ferry_terminal node 8041604848
 *   （浜島町浜島の「お食事処 味幸」るるぶ https://rurubu.jp/andmore/spot/80025168）。どちらも店ではない名前の点
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-113-87674ca9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "87674ca9-f370-4383-9108-f19d9f510274";
const DAY1_ID = "1ef065ea-a1c3-4ada-ba5a-b10c9db79845";
const DAY2_ID = "25df8673-7102-42fa-9355-a28a394d5f07";
const IWATO = "e72c2cc6-cc9f-4017-ab2f-fe048f0860b7";
const YOKO = "7d1ea553-f8d9-4210-be08-981482599775";
const DAIO = "71b505a9-51aa-4167-88b6-600797855b39";
const KIRI = "1fb3d1bd-114e-4dac-b063-35975b0d9212";
const KONPIRA = "0610cb3b-dcf8-46aa-97e3-2c1e1eb9eeab";
const YURAN = "ea8e69c6-d904-4bf3-9011-7af24ce1c647";
const NISHI = "a979101e-71c0-430c-8e4c-a9800ec038c7";
const OHASHI = "1e1ee6e2-4c05-4948-9922-c0342f1e0767";
const BINDAMA = "4cb2a020-1f60-4d9c-801d-ef25a73419cc";
const IZO = "d376119b-f6cc-4ee5-b616-70a47bf54cb7";
const NAIKU = "91b98dbe-9cd0-485f-ac07-c091be1a0ea9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const walk = (min: number) => ({ mode: "walk" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [YURAN]: { from: [34.307416, 136.818854], to: [34.307421, 136.818912] },
  [IZO]: { from: [34.380084, 136.810024], to: [34.380136, 136.80911] },
  [NAIKU]: { from: [34.45684, 136.724025], to: [34.45689, 136.722978] },
};

const PRAY_FROM = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const LUNCH1 = "new-ugata";
const LUNCH2 = "new-hamajima";
const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "鵜方のまわり（昼食）",
    lat: 34.327759,
    lng: 136.839942,
    address: "三重県志摩市阿児町鵜方",
    memo: "横山展望台から車でおよそ14分。志摩市の中心・鵜方のまわりには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、車でおよそ19分、大王埼灯台へ向かいましょう。",
  },
  [LUNCH2]: {
    name: "浜島港のまわり（昼食）",
    lat: 34.295384,
    lng: 136.762384,
    address: "三重県志摩市浜島町浜島",
    memo: "ビン玉ロードから車でおよそ7分。漁港のある浜島の町には食事処もあるので、ここで昼食をとりましょう。食事を終えたら、車でおよそ23分、伊雑宮へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [IWATO]: [
    {
      from: "この旅は車（レンタカーなど）でめぐります。旅の始まりは、日本神話ゆかりの地として知られる天の岩戸へ。",
      to: "この旅は車でめぐります。伊勢市駅に10時半ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ19分、日本神話ゆかりの地として知られる天の岩戸から旅を始めます。",
    },
    { from: PRAY_FROM, to: PRAY_TO },
  ],
  [YOKO]: [
    { from: "天の岩戸から車で横山展望台へ。", to: "天の岩戸から車でおよそ25分、横山展望台へ。" },
    { from: "英虞湾の眺めを楽しんだら、昼食にしましょう。", to: "英虞湾の眺めを楽しんだら、車でおよそ14分の鵜方のまわりで昼食にしましょう。" },
  ],
  [DAIO]: [{ from: "昼食のあとは、大王崎の岸壁に立つ大王埼灯台へ。", to: "鵜方のまわりから車でおよそ19分、大王崎の岸壁に立つ大王埼灯台へ。" }],
  [KIRI]: [{ from: "大王埼灯台から車で、ともやま公園の中にある桐垣展望台へ。", to: "大王埼灯台から車でおよそ15分、ともやま公園の中にある桐垣展望台へ。" }],
  [KONPIRA]: [
    { from: "桐垣展望台から車で、志摩半島で", to: "桐垣展望台から車でおよそ25分、志摩半島で" },
    { from: "今夜は賢島のあたりに泊まります。", to: "この夜は、車でおよそ35分の賢島のまわりの宿に泊まりましょう。" },
  ],
  [YURAN]: [
    {
      from: "2日目は、近鉄の賢島駅の目の前にある乗り場から、遊覧船で英虞湾をめぐります（約50分）。",
      to: "賢島駅のまわりの宿から歩いておよそ2分、2日目は賢島駅の目の前にある乗り場から、遊覧船で英虞湾をめぐります（約50分）。",
    },
    { from: "出航の時間は公式の案内で確かめましょう。", to: "出航の時間は公式の案内で確かめましょう。遊覧を終えたら、歩いておよそ2分で宿の駐車場に戻り、車で西山慕情が丘へ向かいましょう。" },
  ],
  [NISHI]: [{ from: "賢島から車で西山慕情が丘へ。", to: "賢島の宿の駐車場から車でおよそ23分、西山慕情が丘へ。" }],
  [OHASHI]: [{ from: "英虞湾をまたぐ全長234mの、", to: "西山慕情が丘から車でおよそ25分。英虞湾をまたぐ全長234mの、" }],
  [BINDAMA]: [
    { from: "浜島町の海沿いに続く散策道で、", to: "志摩大橋から車でおよそ39分。浜島町の海沿いに続く散策道で、" },
    { from: "このあと、浜島のあたりで昼食にしましょう。", to: "このあと、車でおよそ7分の浜島港のまわりで昼食にしましょう。" },
  ],
  [IZO]: [
    { from: "昼食のあとは、車で志摩市磯部町の伊雑宮へ。", to: "浜島港のまわりから車でおよそ23分、志摩市磯部町の伊雑宮へ。" },
    { from: PRAY_FROM, to: PRAY_TO },
  ],
  [NAIKU]: [
    { from: "旅の締めくくりは、伊勢市の伊勢神宮 内宮へ。", to: "伊雑宮から車でおよそ30分、旅の締めくくりは伊勢市の伊勢神宮 内宮へ。" },
    { from: PRAY_FROM, to: PRAY_TO },
    {
      from: "英虞湾の海と伊勢の森をめぐった旅を、ここで締めくくりましょう。帰りも安全運転で。",
      to: "英虞湾の海と伊勢の森をめぐった旅を、ここで締めくくりましょう。見学を終えたら、車でおよそ12分の伊勢市駅の近くでレンタカーを返しましょう（返す手続きに15分ほど）。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: IWATO, h: 11, m: 4, stay: 40, legs: [] },
  { id: YOKO, h: 12, m: 9, stay: 40, legs: [car(25)] },
  { id: LUNCH1, h: 13, m: 3, stay: 50, legs: [car(14)] },
  { id: DAIO, h: 14, m: 12, stay: 45, legs: [car(19)] },
  { id: KIRI, h: 15, m: 12, stay: 30, legs: [car(15)] },
  { id: KONPIRA, h: 16, m: 7, stay: 50, legs: [car(25)] },
];
const DAY2: Plan = [
  { id: YURAN, h: 9, m: 30, stay: 60, legs: [] },
  { id: NISHI, h: 10, m: 55, stay: 28, legs: [walk(2), car(23)] },
  { id: OHASHI, h: 11, m: 48, stay: 25, legs: [car(25)] },
  { id: BINDAMA, h: 12, m: 52, stay: 25, legs: [car(39)] },
  { id: LUNCH2, h: 13, m: 24, stay: 48, legs: [car(7)] },
  { id: IZO, h: 14, m: 35, stay: 30, legs: [car(23)] },
  { id: NAIKU, h: 15, m: 35, stay: 55, legs: [car(30)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [IWATO, YOKO, DAIO, KIRI, KONPIRA].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [YURAN, NISHI, OHASHI, BINDAMA, IZO, NAIKU].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
    }
    memos[id] = m;
  }
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "近鉄", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n直したメモ:");
  for (const [id, m] of Object.entries(memos)) console.log(`■ ${all.find((x) => x.id === id)!.name}\n${m}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) =>
      NEW[p.id]
        ? {
            create: {
              name: NEW[p.id].name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: NEW[p.id].lat,
              lng: NEW[p.id].lng,
              address: NEW[p.id].address,
              memo: NEW[p.id].memo,
            },
          }
        : {
            id: p.id,
            data: {
              ...timeLegs(p.h, p.m, p.stay, p.legs),
              ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
              ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
            },
          }
    );
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
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
