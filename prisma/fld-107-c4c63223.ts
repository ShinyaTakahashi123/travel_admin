/**
 * 初日・最終日の見直し #107 c4c63223「大川の滝とヤクスギランド、滝と巨木の森を楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 14時ごろ）
 * 車の分数は OSRM（もとの値は ×1.5＋5 の内側ならそのまま。外のもの・新しい区間は切り上げ＋5）。歩きは routed-foot
 * 1日目: 宮之浦港 10:30ごろ → レンタカー（手続き15分）→ 車40（OSRM 39.7、もとのまま）→ 大川の滝 11:25（75→50）→ 車14（OSRM 7.1、もとのまま）→
 *   中間ガジュマル 12:29 → 車19（OSRM 13.2。もとの33は ×1.5＋5 を超える）→ 尾之間で昼食 13:16〜14:21 → 歩8（570m。もと5）→ 尾の間温泉 14:29 →
 *   車10 → 千尋の滝 15:39 → 車13（OSRM 7.9。もとの5は道のりより短い）→ トローキの滝 16:22〜16:52 → 車15（OSRM 9.7）で安房の宿
 *   屋久杉自然館は外す（説明文にない。11時からでは収まらない。写真なし）
 * 2日目（終わり 16:43 はもとのまま）: 安房の宿 → 車23（OSRM 17.5）→ ヤクスギランド 9:00 → 車25 → 安房で昼食 12:55 → 車28 → 益救神社 14:23 →
 *   歩12（908m。もと10）→ 屋久島町歴史民俗資料館 15:15〜16:43（90→88）→ 車8（OSRM 2.7）で宮之浦港、レンタカーを返す
 * 点: 安房で昼食＝OSM「屋久島観光協会 安房案内所」node 11342769459（いまは地区（place=quarter）の点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-107-c4c63223.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c4c63223-3f2b-4c45-a93e-030a42ff13a9";
const DAY1_ID = "49484bff-eb81-4dd8-9e01-858f422374fc";
const DAY2_ID = "679ad019-d7fe-4c8f-bef1-7f879ee847a8";
const OKAWA = "1f609cb9-a640-442a-b471-61e574304256";
const NAKA = "9be2adcf-c812-4b64-b01c-21dd06212724";
const ONO = "e666f5a8-743f-406c-ba54-afec07705ae1";
const ONSEN = "42097a95-3900-4534-ad70-fd35e75c6f18";
const SENPIRO = "d29ca554-deca-4539-8318-9d88293feee1";
const TOROKI = "3cd7d959-d829-4704-bc6d-60d17ac65bd9";
const SHIZEN = "1c24aa12-47de-4939-b5c5-2f86b36606ba";
const LAND = "37e34d4e-f2af-4878-b30e-79f0e96f2974";
const ANBO = "e96bf2ed-6313-47fd-95c8-464d010907df";
const MASUHI = "03e2891c-b276-4029-9149-d7c19bc47069";
const SHIRYO = "899fa941-4437-48d5-ad0b-2bbe8d4570c9";
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
  [ANBO]: { from: [30.319918, 130.65387], to: [30.316447, 130.655703] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [OKAWA]: [
    {
      from: "レンタカーは宮之浦で借り、車でおよそ40分、屋久島の旅は大川の滝から始まります。",
      to: "宮之浦港に10時半ごろ着いたら、港の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ40分、屋久島の旅は大川の滝から始まります。",
    },
    { from: "見学を終えたら、車で中間ガジュマルへ向かいましょう。", to: "見学を終えたら、車でおよそ14分、中間ガジュマルへ向かいましょう。" },
  ],
  [NAKA]: [
    { from: "大川の滝から車で15分ほど、", to: "大川の滝から車で14分ほど、" },
    { from: "見学を終えたら、車で尾之間へ向かいましょう。", to: "見学を終えたら、車でおよそ19分、尾之間へ向かいましょう。" },
  ],
  [ONO]: [
    { from: "中間ガジュマルから車で35分ほど、", to: "中間ガジュマルから車で19分ほど、" },
    { from: "お腹を満たしたら、歩いて尾の間温泉へ向かいましょう。", to: "お腹を満たしたら、歩いておよそ8分、尾の間温泉へ向かいましょう。" },
  ],
  [ONSEN]: [
    { from: "尾之間から歩いて5分ほど、", to: "尾之間から歩いて8分ほど、" },
    { from: "見学を終えたら、車で千尋の滝へ向かいましょう。", to: "湯から上がったら、車でおよそ10分、千尋の滝へ向かいましょう。" },
  ],
  [SENPIRO]: [{ from: "見学を終えたら、車でトローキの滝へ向かいましょう。", to: "見学を終えたら、車でおよそ13分、トローキの滝へ向かいましょう。" }],
  [TOROKI]: [
    { from: "千尋の滝から車で5分ほど、", to: "千尋の滝から車で13分ほど、" },
    { from: "見学を終えたら、車で屋久杉自然館へ向かいましょう。", to: "この夜は、車でおよそ15分の安房の宿に泊まりましょう。" },
  ],
  [LAND]: [
    { from: "2日目は、ヤクスギランドから始まります。", to: "安房の宿から車でおよそ23分、2日目は、ヤクスギランドから始まります。" },
    { from: "山の天気は変わりやすいため、雨具を用意しておくと安心です。", to: "山の天気は変わりやすいので、雨具と歩きやすい靴を用意し、決められた道を歩きましょう。" },
    { from: "見学を終えたら、車で安房へ向かいましょう。", to: "見学を終えたら、車でおよそ25分、安房へ向かいましょう。" },
  ],
  [MASUHI]: [
    { from: "静かに、敬意をもって参拝しましょう。", to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。" },
    { from: "見学を終えたら、歩いて屋久島町歴史民俗資料館へ向かいましょう。", to: "お参りを終えたら、歩いておよそ12分、屋久島町歴史民俗資料館へ向かいましょう。" },
  ],
  [SHIRYO]: [
    { from: "益救神社から歩いて10分ほど、", to: "益救神社から歩いて12分ほど、" },
    { from: "見学のあとは、すぐそばを流れる宮之浦川や、宮之浦港周辺を散策してみるのもおすすめです。", to: "すぐそばには宮之浦川が流れています。" },
    {
      from: "見学を終えたら、宮之浦の港へ戻り、レンタカーを返却して、大川の滝とヤクスギランドを巡った1泊2日の旅を締めくくりましょう。",
      to: "見学を終えたら、車でおよそ8分の宮之浦の港へ戻り、レンタカーを返して(返す手続きに15分ほど)、大川の滝とヤクスギランドを巡った1泊2日の旅を締めくくりましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: OKAWA, h: 11, m: 25, stay: 50, legs: [] },
  { id: NAKA, h: 12, m: 29, stay: 28, legs: [car(14)] },
  { id: ONO, h: 13, m: 16, stay: 65, legs: [car(19)] },
  { id: ONSEN, h: 14, m: 29, stay: 60, legs: [walk(8)] },
  { id: SENPIRO, h: 15, m: 39, stay: 30, legs: [car(10)] },
  { id: TOROKI, h: 16, m: 22, stay: 30, legs: [car(13)] },
];
const DAY2: Plan = [
  { id: LAND, h: 9, m: 0, stay: 210, legs: [] },
  { id: ANBO, h: 12, m: 55, stay: 60, legs: [car(25)] },
  { id: MASUHI, h: 14, m: 23, stay: 40, legs: [car(28)] },
  { id: SHIRYO, h: 15, m: 15, stay: 88, legs: [walk(12)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [OKAWA, NAKA, ONO, ONSEN, SENPIRO, TOROKI, SHIZEN].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [LAND, ANBO, MASUHI, SHIRYO].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const w of ["ください", "おすすめ", "よいでしょう", "屋久杉自然館", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
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
  console.log("\n外す: 屋久杉自然館（1日目、写真なし）");
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [SHIZEN] });
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
