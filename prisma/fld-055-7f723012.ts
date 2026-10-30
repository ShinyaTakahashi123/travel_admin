/**
 * 初日・最終日の見直し #55 7f723012「水沢うどんと石段の湯、伊香保温泉グルメ&湯めぐり1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目）
 * 群馬バスの伊香保・水沢の時刻表が公式で読み取れない（navitime の画面だけ）ため、伊香保と水沢・牧場のあいだはタクシーにする（#53 と同じ考え方）
 * タクシーの分数は OSRM の切り上げ＋5（新しい区間）。歩きは routed-foot
 * 1日目: 渋川駅 10:30ごろ → タクシー24（OSRM 18.2）→ 伊香保関所 10:54 → 歩5（333m。もと「すぐ」4）→ 伊香保神社 11:29（55→30）→ 歩5（313m。もと6）→
 *   石段街 12:04（60→40）→ タクシー11（OSRM 5.6）→ 水沢うどん街 12:55〜13:55（昼食。95→60）→ 歩3（207m。もと15）→ 水澤寺 13:58 → タクシー11（OSRM 5.6）→
 *   ハワイ王国公使別邸 15:09 → 歩3（182m）→ 徳冨蘆花記念文学館 15:52〜16:42
 * 2日目（終わりはもとの 16:33 より前）: 河鹿橋 9:30（もと9:00）→ 歩3（171m）→ 伊香保露天風呂 10:08 → 歩10（737m）→ 新しい昼食の場所「石段街の上のほう」11:28〜12:03
 *   （もとは見晴で昼食だったが、見晴駅のまわりに飲食店がない（OSM・案内記事）。不如帰駅の近くに飲食店 㐂楽 node 10137432481 など。ロープウェイの滞在は延ばさず、
 *   昼食の場所を足す（法務 10/30））→ 歩5（321m）→ 伊香保ロープウェイ（不如帰駅）12:08〜12:33（25のまま）→
 *   ロープウェイ4 → 見晴・伊香保森林公園 12:37〜13:37（110→60）→ ロープウェイ4＋歩12（830m。もと10）→ 竹久夢二伊香保記念館 13:53 → タクシー9（OSRM 3.3）→
 *   伊香保グリーン牧場 15:12〜16:32（95→80）→ タクシーで渋川駅まで約18分（OSRM 12.8）
 * 点: 石段街＝OSM「伊香保石段街」way 311066092 の node 3166133680（いまは地理院の点に近い丸めた値）／水沢うどん街＝OSM のバス停「水沢」node 3166136644
 *   （いまは 36.4903,138.9433 の丸めた点で、近くに名前つきの点がない。うどん店の並ぶ水澤寺の門前の点）／水澤寺＝OSM node 2472165186（いまは地理院の番地）／
 *   伊香保ロープウェイ＝OSM「不如帰」aerialway=station node 1034112967（いまは索道の線の中点）。ハワイ王国公使別邸は地理院の番地（伊香保32番地）のまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-055-7f723012.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7f723012-6fc6-4ba2-9c16-1d38bcf7540e";
const DAY1_ID = "19911d97-a749-4a87-9342-c8d30421b60c";
const DAY2_ID = "599917db-7e05-4445-855b-ba2381ef5fb9";
const SEKI = "a8d41f81-e2cf-4e2e-8403-f5133e9cacf1";
const JINJA = "ea30b979-1f45-4333-b659-e767b25d5d04";
const ISHI = "160fecbb-e225-4fcf-90dc-76826e72d216";
const UDON = "de33c5aa-980d-4428-8915-8bbc8efda1a2";
const TERA = "d4b00668-64db-4966-99f9-7eff687122fa";
const HAWAI = "054daa40-9d2b-4ec0-a400-c9ad4c18b71a";
const ROKA = "2adcda61-d90b-4d36-a1ac-f3bcab4e31f9";
const KAJIKA = "48640873-2faf-4e24-b824-d19949d66a3d";
const ROTEN = "8da25e07-44d4-4947-b096-917eae2ef8c2";
const ROPE = "2cd6c793-5ca4-45d6-b7aa-f93a612b2842";
const MIHARA = "61e2cb50-cd7d-465a-b509-c865a42fee0a";
const YUME = "86ea6a48-9a8a-4868-acaf-ef4b92e5fc8b";
const GREEN = "13832154-8b3a-4fc8-bb68-9e577fc691e5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });
const other = (min: number) => ({ mode: "other" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [ISHI]: { from: [36.4975, 138.917778], to: [36.498465, 138.916852] },
  [UDON]: { from: [36.4903, 138.9433], to: [36.479412, 138.947806] },
  [TERA]: { from: [36.479881, 138.945084], to: [36.479379, 138.945527] },
  [ROPE]: { from: [36.495111, 138.920215], to: [36.497103, 138.91934] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SEKI]: [
    { from: "渋川駅からバスでおよそ25分。", to: "渋川駅に10時半ごろ着いたら、駅前からタクシーでおよそ24分、伊香保関所に着きます。" },
    { from: "続いては、歩いてすぐの伊香保神社へ向かいましょう。", to: "続いては、歩いておよそ5分の伊香保神社へ向かいましょう。" },
  ],
  [JINJA]: [
    { from: "伊香保関所からは歩いてすぐです。", to: "伊香保関所からは歩いておよそ5分です。" },
    { from: "石段街を見下ろす境内で、静かに、敬意をもってお参りください。", to: `境内からは石段街を見下ろせます。${PRAY_TO}` },
    { from: "続いては、歩いておよそ6分の石段街へ向かいましょう。", to: "続いては、歩いておよそ5分の石段街へ向かいましょう。" },
  ],
  [ISHI]: [
    { from: "伊香保神社からは歩いておよそ6分です。", to: "伊香保神社からは歩いておよそ5分です。" },
    { from: "続いては、バスでおよそ15分の水沢うどん街へ向かいましょう。", to: "続いては、タクシーでおよそ11分の水沢うどん街へ向かいましょう。" },
  ],
  [UDON]: [
    { from: "石段街からはバスでおよそ15分です。", to: "石段街からはタクシーでおよそ11分です。" },
    { from: "続いては、歩いておよそ15分の水澤寺へ向かいましょう。", to: "続いては、歩いておよそ3分の水澤寺へ向かいましょう。" },
  ],
  [TERA]: [
    { from: "水沢うどん街からは歩いておよそ15分です。", to: "水沢うどん街からは歩いておよそ3分です。" },
    { from: "静かに、敬意をもってお参りください。", to: PRAY_TO },
    {
      from: "続いては、バスでおよそ20分のハワイ王国公使別邸へ向かいましょう。",
      to: "続いては、タクシーでおよそ11分、伊香保の温泉街のハワイ王国公使別邸へ向かいましょう。タクシーは、前もって予約しておくと安心です。",
    },
  ],
  [HAWAI]: [
    { from: "水澤寺からはバスでおよそ20分です。", to: "水澤寺からはタクシーでおよそ11分です。" },
    { from: "続いては、歩いてすぐの徳冨蘆花記念文学館へ向かいましょう。", to: "続いては、歩いておよそ3分の徳冨蘆花記念文学館へ向かいましょう。" },
  ],
  [ROKA]: [
    { from: "ハワイ王国公使別邸からは歩いてすぐです。", to: "ハワイ王国公使別邸からは歩いておよそ3分です。" },
    { from: "今夜はこの温泉街の宿に泊まります。", to: "この夜は、伊香保温泉の宿に泊まりましょう。" },
  ],
  [KAJIKA]: [{ from: "続いては、歩いてすぐの伊香保露天風呂へ向かいましょう。", to: "続いては、歩いておよそ3分の伊香保露天風呂へ向かいましょう。" }],
  [ROTEN]: [
    { from: "河鹿橋からは歩いてすぐです。", to: "河鹿橋からは歩いておよそ3分です。" },
    { from: "続いては、歩いておよそ8分の伊香保ロープウェイへ向かいましょう。", to: "続いては、歩いておよそ10分、石段街の上のほうへ向かいましょう。" },
  ],
  [ROPE]: [{ from: "伊香保露天風呂からは歩いておよそ8分です。", to: "石段街の上のほうからは歩いておよそ5分で、温泉街の不如帰駅に着きます。" }],
  [MIHARA]: [
    { from: "到着したら、まずこのあたりで昼食をとりましょう。", to: "" },
    { from: "ロープウェイで温泉街に戻り、歩いておよそ10分の竹久夢二伊香保記念館へ向かいましょう。", to: "ロープウェイで温泉街に戻り、歩いておよそ12分の竹久夢二伊香保記念館へ向かいましょう。" },
  ],
  [YUME]: [
    { from: "そこから歩いておよそ10分です。", to: "そこから歩いておよそ12分です。" },
    { from: "続いては、バスでおよそ20分の伊香保グリーン牧場へ向かいましょう。", to: "続いては、タクシーでおよそ9分の伊香保グリーン牧場へ向かいましょう。タクシーは、前もって予約しておくと安心です。" },
  ],
  [GREEN]: [
    { from: "竹久夢二伊香保記念館からはバスでおよそ20分です。", to: "竹久夢二伊香保記念館からはタクシーでおよそ9分です。" },
    { from: "見学を終えたら、バスで渋川駅まで戻りましょう(およそ15分)。", to: "見学を終えたら、タクシーでおよそ18分の渋川駅へ向かい、帰りましょう。" },
  ],
};

// 2日目の昼食の場所（新しく足す。点は OSM「伊香保石段街」way 311066092 の上の端の node 3166133681。法務 10/30）
const LUNCH = "new-lunch";
const LUNCH_SPOT = {
  name: "石段街の上のほう",
  lat: 36.496791,
  lng: 138.916195,
  memo:
    "伊香保露天風呂から歩いておよそ10分、石段街の上のほうに着きます。伊香保神社の下の、石段の上のほうから不如帰駅のまわりにかけては、飲食店があります。ここで昼食をとりましょう。食事を終えたら、歩いておよそ5分、伊香保ロープウェイの不如帰駅へ向かいましょう。",
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: SEKI, h: 10, m: 54, stay: 30, legs: [] },
  { id: JINJA, h: 11, m: 29, stay: 30, legs: [walk(5)] },
  { id: ISHI, h: 12, m: 4, stay: 40, legs: [walk(5)] },
  { id: UDON, h: 12, m: 55, stay: 60, legs: [taxi(11)] },
  { id: TERA, h: 13, m: 58, stay: 60, legs: [walk(3)] },
  { id: HAWAI, h: 15, m: 9, stay: 40, legs: [taxi(11)] },
  { id: ROKA, h: 15, m: 52, stay: 50, legs: [walk(3)] },
];
const DAY2: Plan = [
  { id: KAJIKA, h: 9, m: 30, stay: 35, legs: [] },
  { id: ROTEN, h: 10, m: 8, stay: 70, legs: [walk(3)] },
  { id: LUNCH, h: 11, m: 28, stay: 35, legs: [walk(10)] },
  { id: ROPE, h: 12, m: 8, stay: 25, legs: [walk(5)] },
  { id: MIHARA, h: 12, m: 37, stay: 60, legs: [other(4)] },
  { id: YUME, h: 13, m: 53, stay: 70, legs: [other(4), walk(12)] },
  { id: GREEN, h: 15, m: 12, stay: 80, legs: [taxi(9)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [SEKI, JINJA, ISHI, UDON, TERA, HAWAI, ROKA].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [KAJIKA, ROTEN, ROPE, MIHARA, YUME, GREEN].join()) throw new Error("2日目の構成が想定と違います");
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
  all.push({ ...LUNCH_SPOT, id: LUNCH, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "バス", "歩いてすぐ"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  console.log(`新しい昼食の場所: ${LUNCH_SPOT.name}（${LUNCH_SPOT.lat},${LUNCH_SPOT.lng}）\n  ${LUNCH_SPOT.memo}`);
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
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) =>
      p.id === LUNCH
        ? {
            create: {
              name: LUNCH_SPOT.name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: LUNCH_SPOT.lat,
              lng: LUNCH_SPOT.lng,
              memo: LUNCH_SPOT.memo,
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
