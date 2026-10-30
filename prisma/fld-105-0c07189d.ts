/**
 * 初日・最終日の見直し #105 0c07189d「堀切峠から都井岬の野生馬へ、油津と飫肥をめぐる日南海岸ドライブ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 14時ごろ、#105〜#109 も制作補助2）
 * 車の分数は OSRM（もとの値は ×1.5＋5 の内側ならそのまま。それより長いもの・新しい区間は切り上げ＋5）。歩きは routed-foot
 * 1日目: 宮崎空港 10:30ごろ → レンタカー（手続き15分）→ 車30（OSRM 21.7、もとのまま）→ 堀切峠 11:15 → 車50（OSRM 42.9、もとのまま）→
 *   堀川運河 12:35（45→35）→ 歩4（298m）→【新】油津のまわり 13:14〜13:59（昼食）→ 歩5（356m）→ 油津赤レンガ館 14:04 →
 *   歩9（645m）＋車39（OSRM 33.3）→ 旧吉松家住宅 15:12 → 車25（OSRM 19.2、もとのまま）→ 幸島 16:17〜16:47 → 車24（OSRM 18.7）で串間の町の宿
 *   道の駅フェニックス・道の駅くしま（もとの昼食）・御崎神社は外す（説明文にない。11時からでは収まらない。写真なし）
 * 2日目（終わり 16:30 はもとのまま）: 宿 → 車30（OSRM 19.0、もとのまま）→ 都井岬灯台 9:30（もと9:00）→ 車5 → 都井岬 10:20 → 車25（OSRM 19.6。
 *   もとの55は ×1.5＋5 を超える）→ 道の駅なんごう 11:45〜12:35（昼食）→ 車30 → 小村記念館 13:05 → 歩2（123m。もと5）→ 豫章館 13:57 → 歩1（48m）→
 *   【新】飫肥城 大手門 14:43〜14:51（OSM 門の way 399448842。車の時間を測り直すと9:30始まりでも16:21に終わり16:30に届かないため。決まり369の③）→
 *   歩2（100m）→ 松尾の丸 14:53 → 歩2（127m。もと「すぐ」5）→ 飫肥城歴史資料館 15:35〜16:30 → 車60（OSRM 45.8、もとのまま）で宮崎空港、レンタカーを返す
 * 点: 油津のまわり＝OSM バス停「春日」node 5919599373（店ではない名前の点）／大手門＝OSM「大手門」way 399448842／
 *   幸島＝島の relation 8399663 の外形の生の node 1441250985（いまは島の relation の中心。対岸の石波の浜にいちばん近い岸の点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-105-0c07189d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0c07189d-03ef-438f-9d27-1cc1a01a262e";
const DAY1_ID = "3c847a03-5d67-4730-801c-4edfe926f37f";
const DAY2_ID = "4cb22477-20b1-4be0-b926-b776e08a376e";
const HORI = "f3e35b62-e7fb-4bfe-867e-e194d395dc69";
const PHOENIX = "73e4fb5b-1b9d-42ec-9a54-b72492fd8608";
const UNGA = "7f3086a6-0a17-4efa-bae0-2c3860eacae8";
const AKA = "ff549bc7-c89d-4581-adfd-f26efdcc8eab";
const KUSHIMA = "b233d68b-2765-4d65-992e-2d6b08e853e0";
const YOSHI = "2417e457-d6ff-4116-94b1-bddee2884730";
const KOJI = "9c4a9e56-3ca7-474c-917c-8d82272ee1f1";
const MISAKIJ = "015528a2-3860-4a39-84fe-15939a43ba93";
const TOUDAI = "7f98bf39-d965-4e92-9184-3e8fdd5de56d";
const TOI = "1cc1f256-038d-4954-920f-3225c4d03c71";
const NANGO = "810dd434-e0a5-4988-93dc-4e504df92692";
const KOMURA = "5fdb4ae3-92c2-4540-ada2-e0f4b1543145";
const YOSHO = "b545483b-e565-473d-a49d-34cae0b24bba";
const MATSUO = "e157bc4a-fb6f-431d-ba08-17e4bba63c40";
const SHIRYO = "dbb4cad4-e2dd-4363-ab6a-9fcf40a327a4";
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
  [KOJI]: { from: [31.452577, 131.375683], to: [31.451939, 131.37228] },
};

const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  "new-aburatsu": {
    name: "油津のまわり",
    lat: 31.586144,
    lng: 131.402473,
    address: "宮崎県日南市油津",
    memo: "堀川運河から歩いて約4分。油津の町なかには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いて約5分、油津赤レンガ館へ向かいましょう。",
  },
  "new-otemon": {
    name: "飫肥城 大手門",
    lat: 31.627711,
    lng: 131.35183,
    address: "宮崎県日南市飫肥",
    memo: "豫章館から歩いて約1分。飫肥城の跡の入口にあたる大手門です。門のまわりの石垣や、木でつくられた門の姿を間近に見ましょう。この後は、歩いて約2分、松尾の丸へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [HORI]: [
    { from: "宮崎空港の近くでレンタカーを借りて、海沿いを南へ車で約30分。", to: "宮崎空港に10時半ごろ着いたら、空港の近くでレンタカーを借りて（手続きに15分ほど）、海沿いを南へ車で約30分。" },
    { from: "道を渡るときは気をつけましょう。", to: "道を渡るときは気をつけましょう。この後は、海沿いを南へ車で約50分、油津の堀川運河へ向かいましょう。" },
  ],
  [UNGA]: [
    { from: "道の駅から海沿いを南へ、車で約50分の油津へ。", to: "堀切峠から海沿いを南へ、車で約50分の油津へ。" },
    { from: "水辺では足元に気をつけましょう。", to: "水辺では足元に気をつけましょう。この後は、歩いて約4分、油津の町なかへ向かいましょう。" },
  ],
  [AKA]: [
    { from: "運河から歩いて約5分。", to: "油津の町なかから歩いて約5分。" },
    { from: "開いている時間は公式の案内で確かめましょう。", to: "開いている時間は公式の案内で確かめましょう。見学を終えたら、歩いて約9分で車に戻り、南へ車で約39分、串間の旧吉松家住宅へ向かいましょう。" },
  ],
  [YOSHI]: [{ from: "道の駅から車で約5分。", to: "油津赤レンガ館から、歩いて約9分で車に戻り、南へ車で約39分。" }],
  [KOJI]: [{ from: "サルを見かけても近づきすぎず、食べ物を与えないようにしましょう。", to: "サルを見かけても近づきすぎず、食べ物を与えないようにしましょう。この夜は、車で約24分の串間の町の宿に泊まりましょう。" }],
  [TOI]: [{ from: "馬に近づきすぎず（5〜10m以上はなれる）、食べ物を与えないようにしましょう。", to: "馬に近づきすぎず（5〜10m以上はなれる）、さわったり、食べ物を与えたりしないようにしましょう。" }],
  [NANGO]: [{ from: "都井岬から海沿いを北へ、車で約55分。", to: "都井岬から海沿いを北へ、車で約25分。" }],
  [YOSHO]: [{ from: "記念館から歩いて約5分。", to: "記念館から歩いて約2分。" }],
  [MATSUO]: [{ from: "豫章館から歩いて約5分。", to: "大手門から歩いて約2分。" }],
  [SHIRYO]: [
    { from: "松尾の丸から歩いてすぐ。", to: "松尾の丸から歩いて約2分。" },
    { from: "帰りは、車で約60分の宮崎空港の近くでレンタカーを返しましょう。", to: "見学を終えたら、車で約60分の宮崎空港の近くでレンタカーを返し(返す手続きに15分ほど)、帰りましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: HORI, h: 11, m: 15, stay: 30, legs: [] },
  { id: UNGA, h: 12, m: 35, stay: 35, legs: [car(50)] },
  { id: "new-aburatsu", h: 13, m: 14, stay: 45, legs: [walk(4)] },
  { id: AKA, h: 14, m: 4, stay: 20, legs: [walk(5)] },
  { id: YOSHI, h: 15, m: 12, stay: 40, legs: [walk(9), car(39)] },
  { id: KOJI, h: 16, m: 17, stay: 30, legs: [car(25)] },
];
const DAY2: Plan = [
  { id: TOUDAI, h: 9, m: 30, stay: 45, legs: [] },
  { id: TOI, h: 10, m: 20, stay: 60, legs: [car(5)] },
  { id: NANGO, h: 11, m: 45, stay: 50, legs: [car(25)] },
  { id: KOMURA, h: 13, m: 5, stay: 50, legs: [car(30)] },
  { id: YOSHO, h: 13, m: 57, stay: 45, legs: [walk(2)] },
  { id: "new-otemon", h: 14, m: 43, stay: 8, legs: [walk(1)] },
  { id: MATSUO, h: 14, m: 53, stay: 40, legs: [walk(2)] },
  { id: SHIRYO, h: 15, m: 35, stay: 55, legs: [walk(2)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [HORI, PHOENIX, UNGA, AKA, KUSHIMA, YOSHI, KOJI, MISAKIJ].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [TOUDAI, TOI, NANGO, KOMURA, YOSHO, MATSUO, SHIRYO].join()) throw new Error("2日目の構成が想定と違います");
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
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "フェニックスから", "道の駅くしま", "御崎神社", "ホテル", "旅館"])
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
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n外す: 道の駅フェニックス・道の駅くしま・御崎神社（1日目、写真なし）");
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [PHOENIX, KUSHIMA, MISAKIJ] });
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
