/**
 * 初日・最終日の見直し #106 220c7966「塩屋埼灯台と勿来関、いわきの海沿い絶景と歌枕の地1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 14時ごろ）
 * 車の分数は OSRM（もとの値は ×1.5＋5 の内側ならそのまま。それより長いものは切り上げ＋5）。歩きは routed-foot
 * 1日目（説明文に7か所とも出てくるので外さず、滞在を短くする）: いわき駅 10:30ごろ → レンタカー（手続き15分）→ 車20（OSRM 13.6、もとのまま）→
 *   草野心平記念文学館 11:05（70→50）→ 車20 → 飯野八幡宮 12:15（40→30）→ 車5 → いわき駅前（昼食）12:50〜13:35（50→45）→ 車12 →
 *   大國魂神社 13:47（38→25）→ 歩6（453m。もと5）→ 甲塚古墳 14:18（20→15）→ 歩6＋車15 → 塩屋埼灯台 14:54（65→50）→ 車3 →
 *   いわき震災伝承みらい館 15:47〜16:47（72→60）→ 車22（OSRM 16.2。もとの30は ×1.5＋5 を超える）でいわき湯本温泉の宿
 * 2日目（時刻はもとのまま、9:30〜16:30）: 車の区間はどれも ×1.5＋5 の内側。帰りの一文に返す手続きを足す
 * 点: 三崎公園＝地理院の番地「小名浜下神白大作93番地」（公式の住所。いまは公園の way の中心。メモの潮見台は OSM・地理院になし）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-106-220c7966.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "220c7966-7d85-4c62-85d1-4a047bd57338";
const DAY1_ID = "bd98e016-b5ad-41ff-ae92-671df737a24f";
const KUSANO = "9c8b336a-1766-4b64-81be-4d78d12909af";
const IINO = "95a3d64c-9530-435b-99f5-949fa3698387";
const LUNCH = "62083ca7-1307-41cb-8c1b-913538db1e78";
const OKUNI = "59b2147f-4cb6-46d5-b0a0-134b7b931ccc";
const KABUTO = "840e21ab-6fe5-471e-9694-4875985465c2";
const TOUDAI = "6df725a1-cfca-4a2d-9d93-a7d0cdb9a5fe";
const MIRAI = "4d67a0cf-d09f-4b13-967e-1053b64c21f4";
const MISAKI = "d88ff1f1-a984-4231-9ca6-9f8431570f5e";
const BIJUTSU = "4b361ad5-6341-4e0f-8dbe-8e3431134ab9";
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
  [MISAKI]: { from: [36.939763, 140.923001], to: [36.939354, 140.919952] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KUSANO]: [{ from: "JRいわき駅前でレンタカーを借りて、車で約20分。", to: "JRいわき駅に10時半ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車で約20分。" }],
  [KABUTO]: [
    { from: "神社から歩いて約5分。", to: "神社から歩いて約6分。" },
    { from: "古い時代のお墓なので、静かに外から眺めましょう。", to: "古墳のまわりでは、静かに過ごしましょう。" },
  ],
  [TOUDAI]: [{ from: "大國魂神社に戻り、車で約15分、薄磯の海辺へ。", to: "大國魂神社に歩いて約6分で戻り、車で約15分、薄磯の海辺へ。" }],
  [MIRAI]: [{ from: "今夜は、車で約30分のいわき湯本温泉の宿に泊まります。", to: "この夜は、車で約22分のいわき湯本温泉の宿に泊まりましょう。" }],
  [BIJUTSU]: [{ from: "帰りは、いわき駅まで車で約5分、レンタカーを返しましょう。", to: "帰りは、いわき駅まで車で約5分、レンタカーを返しましょう(返す手続きに15分ほど)。" }],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: KUSANO, h: 11, m: 5, stay: 50, legs: [] },
  { id: IINO, h: 12, m: 15, stay: 30, legs: [car(20)] },
  { id: LUNCH, h: 12, m: 50, stay: 45, legs: [car(5)] },
  { id: OKUNI, h: 13, m: 47, stay: 25, legs: [car(12)] },
  { id: KABUTO, h: 14, m: 18, stay: 15, legs: [walk(6)] },
  { id: TOUDAI, h: 14, m: 54, stay: 50, legs: [walk(6), car(15)] },
  { id: MIRAI, h: 15, m: 47, stay: 60, legs: [car(3)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KUSANO, IINO, LUNCH, OKUNI, KABUTO, TOUDAI, MIRAI].join()) throw new Error("1日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const id of [MISAKI, BIJUTSU]) if (!d2.spots.some((s) => s.id === id)) throw new Error("2日目の構成が想定と違います");
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
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of DAY1) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = all.find((x) => x.id === p.id)!;
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
    prevEnd = st + p.stay;
  }
  console.log("\n2日目: 時刻はもとのまま");
  for (const id of [MISAKI, BIJUTSU]) {
    const s = all.find((x) => x.id === id)!;
    if (COORDS[id]) console.log(`  ${s.name} 座標 ${COORDS[id].from.join(",")} → ${COORDS[id].to.join(",")}`);
    for (const e of MEMO_EDITS[id] ?? []) console.log(`  ${s.name} → ${e.to}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(
        DAY1_ID,
        DAY1.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}) } })) as never,
        { tx }
      );
      await tx.spot.update({ where: { id: MISAKI }, data: { lat: COORDS[MISAKI].to[0], lng: COORDS[MISAKI].to[1] } });
      await tx.spot.update({ where: { id: BIJUTSU }, data: { memo: memos[BIJUTSU] } });
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
