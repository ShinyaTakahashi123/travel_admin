/**
 * 初日・最終日の見直し #109 df1b08b1「尖閣湾と大野亀、佐渡島の海岸線をめぐる絶景ドライブ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 14時ごろ）
 * 車の分数は OSRM（もとの値は ×1.5＋5 の内側ならそのまま。外のものは切り上げ＋5）。歩きは routed-foot
 * 1日目: 両津港 10:30ごろ → レンタカー（手続き15分）→ 車66（OSRM 60.1。もとの45は道のりより短い）→ 弾埼灯台 11:51（40→30。遠い場所の例外で11:45をすぎる）→
 *   車10（OSRM 5.0。もとの15は ×1.5＋5 を超える）→ 二ツ亀 12:31（55→25）→ 車10（OSRM 4.9、もとのまま）→ 大野亀 13:06〜13:56（昼食。80→50）→
 *   車89（OSRM 84.0。もとの70は道のりより短い）→ 大間港 15:25（30→20）→ 車7（OSRM 1.2）→ 佐渡奉行所跡 15:52〜16:42 → 奉行所跡のまわりの相川の宿
 *   弁慶のはさみ岩・道遊の割戸は外す（説明文にない。11時からでは収まらない。写真なし）
 * 2日目（終わり 16:30 はもとのまま）: 宿 → 歩8（628m）→ 旧相川拘置支所 9:03（もと9:00）→ 車18（OSRM 12.6。もとの25は ×1.5＋5 を超える）→ 夫婦岩 10:01 →
 *   車35 → 尖閣湾揚島遊園 11:26〜12:56（昼食）→ 車65 → トキのテラス 14:01 → 車22（OSRM 16.7。もとの15は道のりより短い）→ 両津郷土博物館 15:08 →
 *   歩2（点を湖の岸にしたため、もとは車5）→ 加茂湖 15:55〜16:30 → 車18（OSRM 12.4。もとの10は道のりより短い）で両津港、レンタカーを返す
 * 点: 加茂湖＝湖の way 91543596 の生の node 1063420145（いまは湖の中心。博物館から約96mの岸）。二ツ亀はいまの「二ツ亀」の名前の駐車場の way のまま（法務に確認）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-109-df1b08b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "df1b08b1-02e9-4397-a71e-46c51bebbf88";
const DAY1_ID = "7f9f685f-9008-4b5a-ad67-22d8e08ac0a5";
const DAY2_ID = "67c66d1f-a35f-47ce-8a0d-f934869e1cdb";
const DAN = "20ff7e46-68cf-465c-b592-49058a4bd752";
const FUTA = "b346aa4b-dc5e-495d-88e3-0debff413714";
const ONO = "6bcb4212-2616-4b46-8176-ae0941ca7b3d";
const OMA = "59b7a150-9c30-45de-bb48-f523a7a2ce7a";
const HASAMI = "759b97d1-03d0-4389-b5b1-cc02cb67b855";
const WARITO = "87ad3e0d-9d8a-4635-a143-262f523eadef";
const BUGYO = "d863bfbc-0adf-4bf2-85b2-01d49a8fe483";
const KOCHI = "9cb5e65e-a294-4ea9-bdaa-b0aaec13545c";
const MEOTO = "72975fa2-9211-41e1-a4ca-ce92e4b5797b";
const SENKAKU = "ebe32c20-075f-4c92-940f-f5ad3270c0d0";
const TOKI = "5e48fd7f-6788-400f-9a82-1b48f99d0362";
const HAKU = "c996db46-15c5-4cbe-9bed-75e344bef010";
const KAMO = "1c6d240b-8112-41b9-bbfd-78d7207b4a9d";
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
  [KAMO]: { from: [38.065524, 138.43442], to: [38.060379, 138.423654] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [DAN]: [
    {
      from: "フェリーで両津港に着いたら、港の近くでレンタカーを借りて、車で約45分の島の最も北の端へ。",
      to: "フェリーで両津港に10時半ごろ着いたら、港の近くでレンタカーを借りて（手続きに15分ほど）、車で約66分の島の最も北の端へ。",
    },
  ],
  [FUTA]: [{ from: "灯台から車で約15分。", to: "灯台から車で約10分。" }],
  [ONO]: [{ from: "静かに、敬意をもって訪ねましょう。", to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。" }],
  [OMA]: [{ from: "車で約1時間10分の相川へ。", to: "車で約89分の相川へ。" }],
  [BUGYO]: [
    { from: "割戸から車で約5分、相川の町なかへ。", to: "大間港から車で約7分、相川の町なかへ。" },
    { from: "この夜は、相川の宿に泊まりましょう。", to: "この夜は、奉行所跡のまわりの相川の宿に泊まりましょう。" },
  ],
  [KOCHI]: [{ from: "相川の宿から、京町通りを山側へ上ったところ。", to: "相川の宿から、京町通りを山側へ歩いておよそ8分上ったところ。" }],
  [MEOTO]: [{ from: "七浦海岸を車で約25分。", to: "七浦海岸を車で約18分。" }],
  [HAKU]: [{ from: "トキのテラスから車で約15分、", to: "トキのテラスから車で約22分、" }],
  [KAMO]: [
    { from: "博物館から車で約5分、湖のほとりへ。", to: "博物館から歩いて約2分、湖のほとりへ。" },
    {
      from: "周囲約17kmの新潟県でいちばん大きな湖で、もとは淡水でしたが、",
      to: "周囲約17kmで、新潟県でいちばん大きな湖とされ、もとは淡水でしたが、",
    },
    { from: "帰りは、車で約10分の両津港へ戻り、レンタカーを返しましょう。", to: "帰りは、車で約18分の両津港へ戻り、レンタカーを返しましょう(返す手続きに15分ほど)。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: DAN, h: 11, m: 51, stay: 30, legs: [] },
  { id: FUTA, h: 12, m: 31, stay: 25, legs: [car(10)] },
  { id: ONO, h: 13, m: 6, stay: 50, legs: [car(10)] },
  { id: OMA, h: 15, m: 25, stay: 20, legs: [car(89)] },
  { id: BUGYO, h: 15, m: 52, stay: 50, legs: [car(7)] },
];
const DAY2: Plan = [
  { id: KOCHI, h: 9, m: 3, stay: 40, legs: [] },
  { id: MEOTO, h: 10, m: 1, stay: 50, legs: [car(18)] },
  { id: SENKAKU, h: 11, m: 26, stay: 90, legs: [car(35)] },
  { id: TOKI, h: 14, m: 1, stay: 45, legs: [car(65)] },
  { id: HAKU, h: 15, m: 8, stay: 45, legs: [car(22)] },
  { id: KAMO, h: 15, m: 55, stay: 35, legs: [walk(2)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [DAN, FUTA, ONO, OMA, HASAMI, WARITO, BUGYO].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [KOCHI, MEOTO, SENKAKU, TOKI, HAKU, KAMO].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const w of ["ください", "おすすめ", "よいでしょう", "割戸", "はさみ岩", "ホテル", "旅館"])
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
  console.log("\n外す: 弁慶のはさみ岩・道遊の割戸（1日目、写真なし）");
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [HASAMI, WARITO] });
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
