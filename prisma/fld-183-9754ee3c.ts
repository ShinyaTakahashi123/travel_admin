/**
 * 初日・最終日の見直し #183 9754ee3c「鶴見岳ロープウェイと明礬温泉、絶景と湯の花の別府1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・バスと歩き、ロープウェイ。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 直した初日（7か所＋昼食。並びはもとのまま。11時始まりだと竹瓦小路の昼食が13:30を過ぎるので、山から下りて別府駅に戻ったところで昼食のスポットを立てる）:
 *   JR別府駅に11時ごろ → 亀の井バス20（もとの文の「約20分」）→ 別府ロープウェイ 11:20〜11:30 → ロープウェイ10（もとのまま）→ 鶴見岳の山上 11:40〜12:10 →
 *   ロープウェイ10＋亀の井バス25（別府駅まで）→【足す】別府駅のあたりで昼食 12:45〜13:30（点＝node 8269550070「別府」railway=station。メモが駅のあたり、362）→
 *   歩16（foot 1,228m）→ 別府公園 13:46〜14:06 → 歩25（1,931m、もと20）→ 竹瓦小路 14:31〜14:46 → 歩1（78m、もと5）→ 竹瓦温泉 14:47〜15:22 → 歩10 → 別府タワー 15:32〜15:52 →
 *   亀の井バス30（もとのまま）→ 竹細工伝統産業会館 16:22〜16:52
 *   滞在はどれも、もと以下（鶴見岳 75→30、公園 30→20、竹瓦小路 55→15、竹瓦温泉 60→35、タワー 35→20、竹細工 50→30）。竹瓦小路の「このあたりで昼食にしましょう」は消す
 * 2日目: 湯けむり展望台→いでゆ坂 15→17（foot 1,320m）、高崎山→うみたまご 5→6（403m）。終わりを今より遅くしないため、いでゆ坂 70→68、高崎山 60→59（むし湯 12:50・うみたまご 15:40 はもとのまま）。
 *   帰りの一文に「バスで約15分の別府駅」（もとの文の「別府駅から…約15分」）
 * 座標: どれも OSM の値か、地理院の番地（竹細工伝統産業会館＝東荘園八丁目2番13号、OSM にない）でそのまま。別府公園は 27.3ha の公園の way の中心（園内に名前の点がない）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-183-9754ee3c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9754ee3c-be4b-4db8-838f-348335a26701";
const DAY1_ID = "1269630d-e48f-4539-8bfb-bedcdf071542";
const DAY2_ID = "fc4b113e-25bc-4a67-8677-01c71b3fa93c";
const ROPEWAY = "7e5138e2-687f-420f-9376-5fdbcc600d3e";
const TSURUMI = "a7697b07-6ebb-40fe-a885-5ca81561c183";
const PARK = "fc6139ff-5026-47b9-b4ad-d94e30887d65";
const KOJI = "71170685-8b55-49ca-955e-a61ab9c8a947";
const TAKEGAWARA = "3ceabe69-ddb8-4109-913a-b2cb5435ce5f";
const TOWER = "c7719467-c859-4580-8d8e-cd8268554f81";
const CRAFT = "351162d2-f92a-4889-9de4-46b7822f8592";
const MYOBAN = "259062e7-7f2b-4246-8b5c-82ab62252c39";
const YUKEMURI = "0f8f87cc-c944-41f1-87fb-969fbec12ab7";
const IDEYU = "91f2331b-44cb-402e-8466-3cc6271312f8";
const MUSHIYU = "c141b2d5-d5c5-4e05-8526-fb3fc245238d";
const TAKASAKI = "c97d0219-cf4e-4d34-922c-38f2dc98541b";
const UMITAMAGO = "df48eade-0e30-45b8-810f-eeb434e99f14";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [ROPEWAY]: [{ from: "JR別府駅から亀の井バスで約20分の、", to: "JR別府駅に11時ごろ着いたら、亀の井バスで約20分の、" }],
  [TSURUMI]: [
    {
      from: "鶴見岳は活火山です。火山の情報や規制を、気象庁や現地の最新の案内で確かめましょう。",
      to: "鶴見岳は活火山です。火山の情報や規制を、気象庁や現地の最新の案内で確かめましょう。このあと、ロープウェイで下りて、バスで別府駅へ戻り、昼食にしましょう。",
    },
  ],
  [PARK]: [{ from: "ロープウェイで下り、亀の井バスの別府駅西口行きで別府公園前へ。", to: "昼食のあと、別府駅から西へ歩いて約16分の別府公園へ。" }],
  [KOJI]: [
    { from: "別府公園から東へ、別府駅の前を通って竹瓦小路へ。", to: "別府公園から東へ、別府駅の前を通って歩いて約25分、竹瓦小路へ。" },
    { from: "このあたりで昼食にしましょう。", to: "" },
  ],
  [TAKEGAWARA]: [{ from: "竹瓦小路を抜けて、竹瓦温泉へ。", to: "竹瓦小路を抜けて、歩いて約1分の竹瓦温泉へ。" }],
  [TOWER]: [{ from: "竹瓦温泉から海の方へ歩いて、別府タワーへ。", to: "竹瓦温泉から海の方へ歩いて約10分、別府タワーへ。" }],
  [CRAFT]: [{ from: "別府タワーのそばからバスに乗り、竹細工伝産館前へ。", to: "別府タワーのそばからバスに乗り（待ち時間を入れて約30分）、竹細工伝産館前へ。" }],
  [IDEYU]: [{ from: "展望台から坂を下って、", to: "展望台から坂を下って約17分、" }],
  [UMITAMAGO]: [
    { from: "高崎山のふもと、道をはさんだうみたまごへ。", to: "高崎山のふもと、道をはさんで歩いて約6分のうみたまごへ。" },
    { from: "帰りは、バスで別府駅か大分駅へ。", to: "帰りは、バスで約15分の別府駅か、大分駅へ。" },
  ],
};

const LUNCH = {
  name: "別府駅のあたりで昼食",
  lat: 33.279616,
  lng: 131.500307,
  address: "大分県別府市駅前町",
  memo: "ロープウェイで下りて、亀の井バスで別府駅へ。別府駅のあたりで、昼食にしましょう。",
  h: 12,
  m: 45,
  stay: 45,
  legs: [other(10, "別府ロープウェイ"), bus(25, "亀の井バス")] as Leg[],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: ROPEWAY, h: 11, m: 20, stay: 10, legs: [] },
  { id: TSURUMI, h: 11, m: 40, stay: 30, legs: [] },
  { id: PARK, h: 13, m: 46, stay: 20, legs: [walk(16)] },
  { id: KOJI, h: 14, m: 31, stay: 15, legs: [walk(25)] },
  { id: TAKEGAWARA, h: 14, m: 47, stay: 35, legs: [walk(1)] },
  { id: TOWER, h: 15, m: 32, stay: 20, legs: [walk(10)] },
  { id: CRAFT, h: 16, m: 22, stay: 30, legs: [] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: MYOBAN, h: 9, m: 20, stay: 60, legs: [] },
  { id: YUKEMURI, h: 10, m: 50, stay: 30, legs: [] },
  { id: IDEYU, h: 11, m: 37, stay: 68, legs: [walk(17)] },
  { id: MUSHIYU, h: 12, m: 50, stay: 50, legs: [walk(5)] },
  { id: TAKASAKI, h: 14, m: 35, stay: 59, legs: [] },
  { id: UMITAMAGO, h: 15, m: 40, stay: 50, legs: [walk(6)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  // もとの移動をそのまま使う区間（ロープウェイ10分、タワー→竹細工のバス30分、明礬→展望台のバス30分、むし湯→高崎山のバス55分）
  const keep = (id: string) => all.find((s) => s.id === id)!.transitLegs.map((l) => ({ mode: l.transitMode as Leg["mode"], min: l.transitDurationMin ?? 0, line: l.transitLine ?? undefined }));
  PLAN[1].legs = keep(TSURUMI);
  PLAN[6].legs = keep(CRAFT);
  DAY2[1].legs = keep(YUKEMURI);
  DAY2[4].legs = keep(TAKASAKI);
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
      return { ...p, name: s.name, orig: `${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分`, edits: (MEMO_EDITS[p.id] ?? []).map((e) => e.to || "（消す）" + e.from) };
    });
  const rows1 = rowsOf(PLAN, d1.spots);
  rows1.splice(2, 0, { ...LUNCH, orig: "足す", edits: [LUNCH.memo] });
  show("1日目（直したあと）", rows1);
  show("2日目（直したあと）", rowsOf(DAY2, d2.spots));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const item = (p: (typeof PLAN)[number]) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
  const create = (x: typeof LUNCH) => ({
    create: { name: x.name, visitTime: t(x.h, x.m), stayDurationMin: x.stay, transitLegs: { create: legsCreate(x.legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, [...PLAN.slice(0, 2).map(item), create(LUNCH), ...PLAN.slice(2).map(item)] as never, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2.map(item) as never, { tx });
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
