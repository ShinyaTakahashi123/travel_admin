/**
 * 初日・最終日の見直し #154 980d1330「佐賀県立博物館と旧古賀銀行、アートと明治レトロ建築を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は歩きの時間が道のりと合っていなかったので直す（終わりは今と同じ）
 * いまの初日（8か所）: 佐賀県立博物館・美術館 9:00 → 鯱の門 → 本丸歴史館 → 大隈重信記念館（昼食）→ 佐嘉神社 → 徴古館 → 松原川親水公園 → バルーンミュージアム 15:59〜16:59
 * 直した初日（8か所のまま）: JR佐賀駅に11時ごろ → 佐賀駅バスセンターから市営バスで「博物館前」へ（約15分。佐賀県立美術館の公式の行き方 museum.or.jp/museum/7112 ほか）→
 *   博物館・美術館 11:20 → 鯱の門 → 本丸歴史館 → 大隈重信記念館（昼食 13:18〜）→ 佐嘉神社 → 徴古館 → 松原川親水公園 → バルーンミュージアム 16:02〜16:32
 *   どこも外さない。歩き（道のり。routing.openstreetmap.de の foot）: 博物館→鯱の門 382m・5分（7→5）、鯱→本丸 130m・2分、本丸→大隈 961m・13分（9→13）、
 *     大隈→佐嘉神社 1,101m・15分（9→15）、佐嘉→徴古館 252m・4分（2→4）、徴古館→松原川 242m・3分（そのまま）、松原川→バルーン 183m・2分（5→2）
 *   閉まる時刻: 徴古館 16:00まで（15:42 に出る）、バルーンミュージアム 入館16:30まで（16:02 に着く）
 *   滞在はどれも、もとより短い（博物館 110→50分、鯱の門 8分、本丸 85→40分、大隈 90→70分、佐嘉 30→25分、徴古館 40→30分、松原川 20→15分、バルーン 60→30分）
 * 2日目（8か所のまま。終わりは16:29で今と同じ）: 旧三省銀行→龍造寺八幡宮 1,155m・15分（11→15）、龍造寺八幡宮→与賀神社 1,152m・15分（12→15）。与賀神社の滞在 90→83分で合わせる。
 *   帰りの「お戻りください」を直す
 * 座標（itinerary-rules 7章）: 博物館・美術館 → OSM way 249574451「佐賀県立博物館」（いまの点は約500m北）／佐嘉神社 → node 5599101701「佐嘉神社 拝殿」／
 *   松原川親水公園 → メモの「カッパの像」のうち、川沿いの node 9776411618「父さんカッパ」（佐嘉神社 拝殿から約88m。川の way の中心は使わない）／2日目 神野公園 → メモにある way 185105172「神野のお茶屋」（公園の中心は使わない）／
 *   2日目 県庁展望ホール → node 6241383282「展望ホール (SAGA360)」（約17m）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-154-980d1330.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "980d1330-f50d-4601-a865-f0b803f3c60c";
const DAY1_ID = "419ad1f0-e55c-400b-9d2d-4cab850e14a3";
const MUSEUM = "49940459-4151-4dbd-b246-0a46993b54c8";
const SHACHI = "2d5d7ed8-666b-4538-9ab0-9f452196e107";
const HONMARU = "7d6902a1-bc14-4ce7-b2ad-709fb24c2a2c";
const OKUMA = "fc7fb527-f2ec-4c56-8a97-a74d99616b22";
const SAGA_JINJA = "37f771e5-d997-43b9-b342-87c15b75bfe8";
const CHOKOKAN = "96bdf76c-0168-49a7-bc87-b5c9361dccc5";
const MATSUBARA = "497c74e0-4ae3-49df-9552-83bed7074acc";
const BALLOON = "e9df9f4b-6178-4382-a4a2-87bc72f11814";
const SANSEI = "d604c819-4525-4a12-8b45-79372685b47c";
const RYUZOJI = "57c37709-336b-4262-a620-2ceccc91b812";
const YOKA = "772086c6-1ea0-4535-80a9-7cfcda4bc0e8";
const JINNO = "4dc21293-f2da-4443-99d5-4e91c4f706a0";
const TENBO = "aa2e7bf0-177c-49c7-b6a6-f9cac607d13a";
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
  [MUSEUM]: [
    {
      from: "佐賀県立博物館・美術館は、",
      to: "この旅は歩きとバスでめぐります。JR佐賀駅に11時ごろ着いたら、佐賀駅バスセンターから市営バスで「博物館前」へ（約15分）。佐賀県立博物館・美術館は、",
    },
    { from: "続いては、歩いておよそ7分の鯱の門へ向かいましょう。", to: "続いては、歩いておよそ5分の鯱の門へ向かいましょう。" },
  ],
  [SHACHI]: [{ from: "佐賀県立博物館・美術館からは歩いておよそ7分です。", to: "佐賀県立博物館・美術館からは歩いておよそ5分です。" }],
  [HONMARU]: [{ from: "続いては、歩いておよそ9分の大隈重信記念館へ向かいましょう。", to: "続いては、歩いておよそ13分の大隈重信記念館へ向かいましょう。" }],
  [OKUMA]: [
    { from: "佐賀城本丸歴史館からは歩いておよそ9分です。", to: "佐賀城本丸歴史館からは歩いておよそ13分です。" },
    { from: "続いては、歩いておよそ9分の佐嘉神社へ向かいましょう。", to: "続いては、歩いておよそ15分の佐嘉神社へ向かいましょう。" },
  ],
  [SAGA_JINJA]: [
    { from: "大隈重信記念館からは歩いておよそ9分です。", to: "大隈重信記念館からは歩いておよそ15分です。" },
    { from: "続いては、歩いておよそ2分の徴古館へ向かいましょう。", to: "続いては、歩いておよそ4分の徴古館へ向かいましょう。" },
  ],
  [CHOKOKAN]: [
    { from: "佐嘉神社からは歩いておよそ2分です。", to: "佐嘉神社からは歩いておよそ4分です。" },
  ],
  [MATSUBARA]: [
    { from: "続いては、歩いておよそ5分の佐賀バルーンミュージアムへ向かいましょう。", to: "続いては、歩いておよそ2分の佐賀バルーンミュージアムへ向かいましょう。" },
  ],
  [BALLOON]: [{ from: "松原川親水公園からは歩いておよそ5分です。", to: "松原川親水公園からは歩いておよそ2分です。" }],
};
const DAY2_MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SANSEI]: [{ from: "続いては、歩いておよそ11分の龍造寺八幡宮へ向かいましょう。", to: "続いては、歩いておよそ15分の龍造寺八幡宮へ向かいましょう。" }],
  [RYUZOJI]: [
    { from: "旧三省銀行からは歩いておよそ11分です。", to: "旧三省銀行からは歩いておよそ15分です。" },
    { from: "続いては、歩いておよそ12分の与賀神社へ向かいましょう。", to: "続いては、歩いておよそ15分の与賀神社へ向かいましょう。" },
  ],
  [YOKA]: [{ from: "龍造寺八幡宮からは歩いておよそ12分です。", to: "龍造寺八幡宮からは歩いておよそ15分です。" }],
  [TENBO]: [{ from: "帰りは、JR佐賀駅までバスや徒歩でお戻りください。", to: "帰りは、JR佐賀駅までバスか歩きで戻りましょう。" }],
};
const DAY2_TIMES: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: RYUZOJI, h: 11, m: 56, stay: 40, legs: [walk(15)] },
  { id: YOKA, h: 12, m: 51, stay: 83, legs: [walk(15)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: MUSEUM, from: [33.2495, 130.2999], to: [33.24498, 130.300534] },
  { id: SAGA_JINJA, from: [33.251144, 130.302719], to: [33.251821, 130.302555] },
  { id: MATSUBARA, from: [33.2508, 130.3018], to: [33.252232, 130.301752] },
  { id: JINNO, from: [33.266058, 130.280924], to: [33.26675, 130.281381] },
  { id: TENBO, from: [33.249532, 130.299044], to: [33.249381, 130.299059] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: MUSEUM, h: 11, m: 20, stay: 50, legs: [] },
  { id: SHACHI, h: 12, m: 15, stay: 8, legs: [walk(5)] },
  { id: HONMARU, h: 12, m: 25, stay: 40, legs: [walk(2)] },
  { id: OKUMA, h: 13, m: 18, stay: 70, legs: [walk(13)] },
  { id: SAGA_JINJA, h: 14, m: 43, stay: 25, legs: [walk(15)] },
  { id: CHOKOKAN, h: 15, m: 12, stay: 30, legs: [walk(4)] },
  { id: MATSUBARA, h: 15, m: 45, stay: 15, legs: [walk(3)] },
  { id: BALLOON, h: 16, m: 2, stay: 30, legs: [walk(2)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
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
    prevEnd = st + p.stay;
  }
  // 2日目: 旧三省銀行 11:01〜11:41 → 龍造寺 11:56〜12:36 → 与賀 12:51〜14:14 → バス15分 → 神野公園 14:29（もとのまま）
  const sansei = d2.spots.find((s) => s.id === SANSEI);
  const jinno = d2.spots.find((s) => s.id === JINNO);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  if (!sansei || hmOf(sansei.visitTime) !== "11:01" || sansei.stayDurationMin !== 40 || !jinno || hmOf(jinno.visitTime) !== "14:29") throw new Error("2日目の構成が想定と違います");
  console.log("\n2日目: 旧三省銀行 11:01-11:41 → walk15 → 龍造寺八幡宮 11:56-12:36 → walk15 → 与賀神社 12:51-14:14（90→83分）→ バス15分 → 神野公園 14:29（もとのまま）");
  for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) console.log(`  2日目 ${all.find((s) => s.id === id)?.name}: ${apply(id, edits).slice(0, 30)}…${apply(id, edits).slice(-30)}`);
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
