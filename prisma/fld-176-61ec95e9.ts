/**
 * 初日・最終日の見直し #176 61ec95e9「なかはくと闇無浜神社、中津の歴史と信仰を深掘りする1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・車と歩き。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 昼食がどちらの日も移動の中に隠れていた（初日 教会 12:15 → 自性寺 13:40 が歩き10分、2日目 合元寺 12:40 → 中津城 13:35 が歩き10分）ので、昼食のスポットを立てる
 * 直した初日（6か所＋昼食）: JR中津駅に11時ごろ → レンタカー（手続きに15分ほど）→ 車12（OSRM 6.2分＋駐車）→ 薦神社 11:27〜11:57 → 車15（OSRM 6.9分、もとのまま）→
 *   なかはく 12:12〜12:57 → 歩3（foot 196m）→ カトリック教会 13:00〜13:15 → 歩3（165m）→【足す】中津の城下町で昼食 13:18〜14:03（点＝node 5985163465「城下町道案内」の案内図）→
 *   歩8（639m）→ 自性寺 14:11〜14:56 → 歩7（511m）→ 村上医家史料館 15:03〜15:50 → 歩10（767m）→ 円応寺 16:00〜16:30
 *   滞在はどれも、もとより短い（薦 50→30、なかはく 100→45、教会 25→15、自性寺 60→45、村上 60→47、円応寺 30）
 * 2日目: 福澤旧居→大江医家 5→6（foot 466m）。合元寺→【足す】新博多町のあたりで昼食 12:47〜13:25（点＝way 214168279「新博多町アーケード」の Nominatim、foot 470m・6分）→ 歩10（790m）→ 中津城 13:35（もとと同じ）。
 *   中津城から先はそのまま（車 25／OSRM 15.3、10／4.7 はどちらも OSRM×1.5＋5 以内）、青の洞門 15:50〜16:30。1か所目は、宿から車で中津城のそばの駐車場へ（中津駅→中津城 OSRM 3.3分＋駐車＝約9分）、歩いて闇無浜神社へ（foot 967m・約13分）。午前は歩いて回り、中津城の駐車場の車で羅漢寺へ（企画運営 10/30: 1日目から続く車の流れに合わせる）、帰りの一文に中津駅まで車で約15分（OSRM 9.8分＋α）
 * 言葉: 教会の「敬意をもって見学してください」を「見学しましょう」に（祈りの一文ではないため）
 * 座標: どれも OSM の値でそのまま（srccheck）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-176-61ec95e9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "61ec95e9-752c-4fff-a7d4-b5b0f251159b";
const DAY1_ID = "16aae2d4-143a-4f19-b28d-9447ec5bae76";
const DAY2_ID = "e176cb3d-259f-4e20-a96d-6156ae9a6143";
const KOMO = "27030288-70e3-45a1-8b21-15ff975049d6";
const NAKAHAKU = "a7476a28-ab81-4801-b3a1-cf78e8bb43be";
const CHURCH = "49e94069-9588-454d-a207-9418d61a5f13";
const JISHOJI = "005795bc-65fc-4b87-bea3-dcb50e74edbe";
const MURAKAMI = "6d9114b0-1799-4c7b-b148-34785df10015";
const ENNOJI = "6cd1a587-1e26-4558-8120-3fb40cb833b8";
const KURANASHI = "b854f9c8-4d5c-4518-a990-edda431eb5c5";
const FUKUZAWA = "10debd9f-60fb-4d5e-a518-cdcc213227d9";
const OE = "4013dad2-a2a6-4879-bcbc-ba33d7ef72d3";
const GOGANJI = "527fbea7-4cf0-458c-8ce7-2fed53bbc4e5";
const CASTLE = "a63641b6-b934-4ef1-afdd-6270d76c5256";
const RAKANJI = "cf0af447-7541-452d-82ec-c872370f717a";
const AONODOMON = "895ac4c8-3963-4ec8-9042-e049ad9c3133";
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
  [KOMO]: [
    {
      from: "旅の始まりは、大貞神社とも呼ばれる薦神社から。",
      to: "この旅は車と歩きでめぐります。JR中津駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約12分。旅の始まりは、大貞神社とも呼ばれる薦神社から。",
    },
  ],
  [CHURCH]: [
    { from: "なかはくから歩いてすぐ。", to: "なかはくから歩いて約3分。" },
    { from: "静かに、敬意をもって見学してください。", to: "静かに、敬意をもって見学しましょう。" },
  ],
  [JISHOJI]: [{ from: "昼食のあとは自性寺へ。", to: "昼食のあとは、歩いて約8分の自性寺へ。" }],
  [KURANASHI]: [{ from: "2日目は闇無浜（くらなしはま）神社から。", to: "2日目は、宿から車で中津城のそばの駐車場へ（中津駅のあたりから車で約9分）。車を止めて、歩いて約13分の闇無浜（くらなしはま）神社から。" }],
  [RAKANJI]: [{ from: "中津城を見たら、宿に置いていた車に乗り、", to: "中津城を見たら、駐車場の車に乗り、" }],
  [OE]: [{ from: "福澤旧居から歩いて約5分。", to: "福澤旧居から歩いて約6分。" }],
  [GOGANJI]: [
    { from: "大江医家史料館から歩いてすぐ。", to: "大江医家史料館から歩いて約5分。" },
    { from: "このあと、寺町のあたりで昼食にしましょう。", to: "このあと、歩いて約6分の新博多町のあたりで昼食にしましょう。" },
  ],
  [CASTLE]: [{ from: "昼食のあとは、中津川の河口に建つ中津城へ。", to: "昼食のあとは、歩いて約10分、中津川の河口に建つ中津城へ。" }],
  [AONODOMON]: [
    { from: "旅の締めくくりは、山国川沿いの青の洞門へ。", to: "旅の締めくくりは、羅漢寺から車で約10分、山国川沿いの青の洞門へ。" },
    { from: "帰りは、車で中津駅のほうへ戻ります。", to: "帰りは、車で約15分の中津駅のほうへ戻り、レンタカーを返しましょう。" },
  ],
};

const LUNCH1 = {
  name: "中津の城下町で昼食",
  lat: 33.604162,
  lng: 131.184735,
  address: "大分県中津市",
  memo: "中津カトリック教会から歩いて約3分。中津城の城下町のあたりで、昼食にしましょう。",
  h: 13,
  m: 18,
  stay: 45,
  legs: [walk(3)] as Leg[],
};
const LUNCH2 = {
  name: "新博多町のあたりで昼食",
  lat: 33.601491,
  lng: 131.186736,
  address: "大分県中津市",
  memo: "合元寺から歩いて約6分。新博多町のアーケードのあたりで、昼食にしましょう。",
  h: 12,
  m: 47,
  stay: 38,
  legs: [walk(6)] as Leg[],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KOMO, h: 11, m: 27, stay: 30, legs: [] },
  { id: NAKAHAKU, h: 12, m: 12, stay: 45, legs: [car(15)] },
  { id: CHURCH, h: 13, m: 0, stay: 15, legs: [walk(3)] },
  { id: JISHOJI, h: 14, m: 11, stay: 45, legs: [walk(8)] },
  { id: MURAKAMI, h: 15, m: 3, stay: 47, legs: [walk(7)] },
  { id: ENNOJI, h: 16, m: 0, stay: 30, legs: [walk(10)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KURANASHI, h: 9, m: 0, stay: 40, legs: [] },
  { id: FUKUZAWA, h: 9, m: 50, stay: 80, legs: [walk(10)] },
  { id: OE, h: 11, m: 16, stay: 50, legs: [walk(6)] },
  { id: GOGANJI, h: 12, m: 11, stay: 30, legs: [walk(5)] },
  { id: CASTLE, h: 13, m: 35, stay: 50, legs: [walk(10)] },
  { id: RAKANJI, h: 14, m: 50, stay: 50, legs: [car(25)] },
  { id: AONODOMON, h: 15, m: 50, stay: 40, legs: [car(10)] },
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
  rows1.splice(3, 0, { ...LUNCH1, orig: "足す", edits: [LUNCH1.memo] });
  const rows2 = rowsOf(DAY2, d2.spots);
  rows2.splice(4, 0, { ...LUNCH2, orig: "足す", edits: [LUNCH2.memo] });
  show("1日目（直したあと）", rows1);
  show("2日目（直したあと）", rows2);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const item = (p: (typeof PLAN)[number]) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
  const create = (x: typeof LUNCH1) => ({
    create: { name: x.name, visitTime: t(x.h, x.m), stayDurationMin: x.stay, transitLegs: { create: legsCreate(x.legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, [...PLAN.slice(0, 3).map(item), create(LUNCH1), ...PLAN.slice(3).map(item)] as never, { tx });
      await setDaySpotOrder(DAY2_ID, [...DAY2.slice(0, 4).map(item), create(LUNCH2), ...DAY2.slice(4).map(item)] as never, { tx });
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
