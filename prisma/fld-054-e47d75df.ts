/**
 * 初日・最終日の見直し #54 e47d75df「堂ヶ島の絶景クルーズと下田の街、西伊豆・南伊豆を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目）
 * 車の分数は OSRM（決まりの ×1.5＋5 を超えるか、道のりより短いものだけ直す。新しい区間は OSRM の切り上げ＋5）。歩きは routed-foot
 * 1日目: 修善寺駅 10:30ごろ → レンタカー（手続き15分）→ 車50（OSRM 33.6、もとのまま）→ 黄金崎 11:35〜12:00 → 車14（新しい区間、OSRM 8.2）→
 *   大田子海岸 12:14 → 車8 → 堂ヶ島 12:47〜14:07（昼食）→ 車7（新しい区間、OSRM 1.6）→ 沢田公園露天風呂 14:14 → 車10（新しい区間、OSRM 4.4）→
 *   伊豆の長八美術館 15:19 → 歩3（207m）→ なまこ壁通り 16:12〜16:57。滞在はすべてもとのまま
 *   黄金崎クリスタルパーク・三四郎島のトンボロ（春〜夏の干潮時だけ。季節は通年）・室岩洞は外す（11時からでは収まらない。タイトル・説明文にない。写真なし）
 * 2日目: 下田公園 9:30 → 歩19（1,406m。もと14）→ 唐人お吉記念館 10:49 → 歩8 → 了仙寺 11:27 → 歩3（154m。もと6）→ ペリーロードのまわり 12:05（昼食）→
 *   歩10（746m。もと8）→ 下田海中水族館 13:10〜14:10（65→60）→ 歩4（261m）で下田公園のそばの車に戻り、車9（OSRM 3.7。もとは歩20、実際は2,657m・約36分）→
 *   下田ロープウェイ 14:23（乗り場の正面に無料駐車場 35台、https://ropeway.co.jp/access/）→ 車10 → 龍宮窟 15:18 → 車25（OSRM 19.1、もとの15は道のりより短い）→
 *   石廊崎 16:13〜16:56（45→43。もとの終わり 16:56 のまま）→ 下田駅まで車35
 * 点: 大田子海岸＝OSM「大田子海岸　夕日展望所」node 7802253329（いまは浜の way の中心）／堂ヶ島＝OSM「堂ヶ島」tourism=attraction node 6253248358（いまは place=neighbourhood の点）／
 *   ペリーロード＝way 659304163 の node 3517333389（いまは道の Nominatim の中心）／なまこ壁通り＝way 136812296 の node 5399909673（同）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-054-e47d75df.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e47d75df-1663-40f4-a7de-7185cede3cea";
const DAY1_ID = "f1fb182f-107c-48bb-bd5f-c96c9320df8b";
const DAY2_ID = "be05f562-6fe5-464b-8809-280a6bb4332f";
const OGON = "00aec738-46cc-4799-a844-cd0b3e25000d";
const CRYS = "39e1183b-7a5b-41c7-a1a6-14de949eb0b9";
const OTAGO = "acd9ad85-fd03-4fd8-8400-5abc6e0618f2";
const DOGA = "6c1be77f-5009-4ff0-a78a-e1d5da2fe49b";
const TOMBO = "a8b0ac77-c1d4-4096-abc4-10aba7c8651b";
const SAWA = "9a268783-9324-443a-9d5c-578bd92e8d23";
const MURO = "eed4dddf-0124-4e84-857f-7cac9a62eb8f";
const CHOU = "0d7a3246-9c16-4c51-a5fd-342af1479a25";
const NAMA = "1fa9c13f-e3c0-49e7-82f9-f027eab72132";
const PARK = "bb319556-e3fc-4e8e-8375-691b7f1b08a3";
const OKICHI = "6007b50e-a2e1-4f58-adc1-001e8e9f3e9c";
const RYO = "3e32659d-7068-4b9c-af72-ee14ab6a0a89";
const PERRY = "f165f499-c88c-4aa0-9f41-ace95155c651";
const AQUA = "88cf0b3e-4be9-410a-b6a3-7440c53ba728";
const ROPE = "addfccbd-3551-4ab7-97d0-1a709c3363cd";
const RYUGU = "a978d4fc-c25d-432b-a014-cad379404b39";
const IRO = "b7da322d-4172-4300-b63b-037656c4c7e9";
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

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [OTAGO]: { from: [34.808857, 138.765923], to: [34.809366, 138.765904] },
  [DOGA]: { from: [34.784116, 138.768452], to: [34.78241, 138.767418] },
  [PERRY]: { from: [34.671619, 138.943458], to: [34.671711, 138.943255] },
  [NAMA]: { from: [34.750121, 138.777813], to: [34.75019, 138.777791] },
};

const PRAY_FROM = "静かに、敬意を持ってお参りしましょう。";
const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [OGON]: [
    { from: "修善寺駅前でレンタカーを借り、車でおよそ50分、黄金崎に着きます。", to: "修善寺駅に10時半ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車でおよそ50分、黄金崎に着きます。" },
    { from: "この後は、車でおよそ5分、黄金崎クリスタルパークへ向かいましょう。", to: "この後は、車でおよそ14分、大田子海岸へ向かいましょう。" },
  ],
  [OTAGO]: [{ from: "黄金崎クリスタルパークから車でおよそ8分、", to: "黄金崎から車でおよそ14分、" }],
  [DOGA]: [{ from: "この後は、歩いておよそ9分、三四郎島のトンボロへ向かいましょう。", to: "この後は、車でおよそ7分、沢田公園露天風呂へ向かいましょう。" }],
  [SAWA]: [
    { from: "三四郎島のトンボロから歩いておよそ14分、", to: "堂ヶ島から車でおよそ7分、" },
    { from: "この後は、車でおよそ8分、室岩洞へ向かいましょう。", to: "この後は、車でおよそ10分、伊豆の長八美術館へ向かいましょう。" },
  ],
  [CHOU]: [{ from: "室岩洞から車でおよそ5分、", to: "沢田公園露天風呂から車でおよそ10分、" }],
  [NAMA]: [{ from: "見学を終えたら、車でおよそ10分、松崎の宿へ向かいましょう。", to: "この夜は、松崎のまわりの宿に泊まりましょう。" }],
  [PARK]: [{ from: "この後は、歩いておよそ14分、唐人お吉記念館へ向かいましょう。", to: "この後は、歩いておよそ19分、唐人お吉記念館へ向かいましょう。" }],
  [OKICHI]: [{ from: "下田公園から歩いておよそ14分、", to: "下田公園から歩いておよそ19分、" }],
  [RYO]: [
    { from: PRAY_FROM, to: PRAY_TO },
    { from: "この後は、歩いておよそ6分、ペリーロードのまわりへ向かいましょう。", to: "この後は、歩いておよそ3分、ペリーロードのまわりへ向かいましょう。" },
  ],
  [PERRY]: [
    { from: "了仙寺から歩いておよそ6分、", to: "了仙寺から歩いておよそ3分、" },
    { from: "食事を終えたら、歩いておよそ8分、下田海中水族館へ向かいましょう。", to: "食事を終えたら、歩いておよそ10分、下田海中水族館へ向かいましょう。" },
  ],
  [AQUA]: [
    { from: "ペリーロードのまわりから歩いておよそ8分、", to: "ペリーロードのまわりから歩いておよそ10分、" },
    {
      from: "見学を終えたら、歩いておよそ20分、下田ロープウェイへ向かいましょう。",
      to: "見学を終えたら、歩いておよそ4分、下田公園のそばに止めた車に戻り、車でおよそ9分、下田ロープウェイへ向かいましょう。",
    },
  ],
  [ROPE]: [
    { from: "下田海中水族館から歩いておよそ20分、下田ロープウェイの駅に着きます。", to: "下田海中水族館から車でおよそ9分、下田ロープウェイの乗り場に着きます。乗り場の正面に駐車場があります。" },
    { from: "見学を終えたら、ロープウェイで下り、歩いて停めていた車に戻り、車でおよそ10分、龍宮窟へ向かいましょう。", to: "見学を終えたら、ロープウェイで下り、車でおよそ10分、龍宮窟へ向かいましょう。" },
  ],
  [RYUGU]: [{ from: "この後は、車でおよそ15分、石廊崎へ向かいましょう。", to: "この後は、車でおよそ25分、石廊崎へ向かいましょう。" }],
  [IRO]: [
    { from: "龍宮窟から、車でおよそ15分、", to: "龍宮窟から、車でおよそ25分、" },
    { from: PRAY_FROM, to: PRAY_TO },
    {
      from: "下田駅の近くでレンタカーを返し(借りた店と別の場所で返せるか、前もって確かめましょう)、",
      to: "下田駅の近くでレンタカーを返し(返す手続きに15分ほど。借りた店と別の場所で返せるか、前もって確かめましょう)、",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: OGON, h: 11, m: 35, stay: 25, legs: [] },
  { id: OTAGO, h: 12, m: 14, stay: 25, legs: [car(14)] },
  { id: DOGA, h: 12, m: 47, stay: 80, legs: [car(8)] },
  { id: SAWA, h: 14, m: 14, stay: 55, legs: [car(7)] },
  { id: CHOU, h: 15, m: 19, stay: 50, legs: [car(10)] },
  { id: NAMA, h: 16, m: 12, stay: 45, legs: [walk(3)] },
];
const DAY2: Plan = [
  { id: PARK, h: 9, m: 30, stay: 60, legs: [] },
  { id: OKICHI, h: 10, m: 49, stay: 30, legs: [walk(19)] },
  { id: RYO, h: 11, m: 27, stay: 35, legs: [walk(8)] },
  { id: PERRY, h: 12, m: 5, stay: 55, legs: [walk(3)] },
  { id: AQUA, h: 13, m: 10, stay: 60, legs: [walk(10)] },
  { id: ROPE, h: 14, m: 23, stay: 45, legs: [walk(4), car(9)] },
  { id: RYUGU, h: 15, m: 18, stay: 30, legs: [car(10)] },
  { id: IRO, h: 16, m: 13, stay: 43, legs: [car(25)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [OGON, CRYS, OTAGO, DOGA, TOMBO, SAWA, MURO, CHOU, NAMA].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [PARK, OKICHI, RYO, PERRY, AQUA, ROPE, RYUGU, IRO].join()) throw new Error("2日目の構成が想定と違います");
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
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "クリスタル", "トンボロ", "室岩洞", "停めていた", "敬意を持って"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n外す: 黄金崎クリスタルパーク・三四郎島のトンボロ・室岩洞（1日目）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) => ({
      id: p.id,
      data: {
        ...timeLegs(p.h, p.m, p.stay, p.legs),
        ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
        ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
      },
    }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [CRYS, TOMBO, MURO] });
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
