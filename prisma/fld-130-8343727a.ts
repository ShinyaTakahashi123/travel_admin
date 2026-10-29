/**
 * 初日・最終日の見直し #130 8343727a「吉備路自転車道と半田山植物園、古墳と寺社・緑と水辺をめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（7か所）: 備中高松城址 9:30 → 作山古墳 → 吉備路もてなしの館（昼食）→ 備中国分寺 → こうもり塚古墳 → 宝福寺 → 総社宮 15:30〜16:30
 * 直した初日（7か所のまま）: JR備前一宮駅に10時45分ごろ → レンタサイクルで備中高松城址 11:15 → 作山古墳 → もてなしの館（昼食）→ 備中国分寺 → こうもり塚古墳 → 宝福寺 → 総社宮 16:00〜16:30 → 総社駅で自転車を返して岡山の宿
 *   説明文に7か所すべてが出てくるので、外さずに滞在を縮めて収める
 *   入口と1か所目（企画運営 10/29）: 入口は備前一宮駅。10:45 に着いて自転車を借り（約10分）、約20分で高松城址 11:15
 *   自転車の店（決まり7）: 総社駅前の店は 9:00〜18:00、11〜2月は17:00まで（mapple.net/article/10868/）。総社宮を 16:30 に出て、総社駅まで自転車で数分
 *     備前一宮駅前の店は 9:00〜17:00・受付15:30まで・乗り捨て可（okayama-kanko.jp/spot/detail_10012.html）
 *   移動の時間は延ばさず、滞在を短くした（高松城址 40→25分、作山古墳 40→30分、昼食 50→45分、国分寺 35→25分、こうもり塚 25→20分、宝福寺 70→40分、総社宮 60→30分）
 * 本文: 高松城址の書き出しに着く時刻を足す。総社宮の最後に、自転車を返す時刻に気をつける一文を足す
 * 説明文・タイトルは変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-130-8343727a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8343727a-f061-4eba-bdba-92d051fc3d0e";
const DAY1_ID = "85185f68-d836-4e1c-9ca7-3c404a000686";
const TAKAMATSU = "5bfbdf71-708c-44b7-affb-2cc4aa12a73f";
const TSUKURIYAMA = "e088f59d-8a61-4f32-8fcf-1ce6e351eeec";
const MOTENASHI = "67f65ad5-29b9-47a2-8978-bff124499da1";
const KOKUBUNJI = "062284f7-e34c-48cb-9e4b-e2f04b118a0f";
const KOMORI = "79db73a7-25f0-4cf1-afa4-9b005bf11e34";
const HOFUKUJI = "08cde95c-5837-43e1-b6ab-e512ad55e201";
const SOJAGU = "b4369b7c-f647-4ab3-b972-c2bf59bef081";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const cycle = (min: number) => ({ mode: "other" as const, min, line: "レンタサイクル" });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const SOJA_LAST = "このあとは JR総社駅で自転車を返し、JRで岡山へ戻って、岡山の町の宿に泊まりましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TAKAMATSU]: [
    {
      from: "1日目は自転車でめぐります。JR備前一宮駅の前でレンタサイクルを借りて",
      to: "1日目は自転車でめぐります。JR岡山駅から吉備線で備前一宮駅へ。10時45分ごろに着いたら、駅前でレンタサイクルを借りて",
    },
  ],
  [SOJAGU]: [{ from: SOJA_LAST, to: SOJA_LAST + "自転車の店は冬は早く閉まるので、返す時刻に気をつけましょう。" }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: TAKAMATSU, h: 11, m: 15, stay: 25, legs: [] },
  { id: TSUKURIYAMA, h: 12, m: 10, stay: 30, legs: [cycle(30)] },
  { id: MOTENASHI, h: 12, m: 50, stay: 45, legs: [cycle(10)] },
  { id: KOKUBUNJI, h: 13, m: 40, stay: 25, legs: [walk(5)] },
  { id: KOMORI, h: 14, m: 10, stay: 20, legs: [walk(5)] },
  { id: HOFUKUJI, h: 15, m: 0, stay: 40, legs: [cycle(30)] },
  { id: SOJAGU, h: 16, m: 0, stay: 30, legs: [cycle(20)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [TAKAMATSU, TSUKURIYAMA, MOTENASHI, KOKUBUNJI, KOMORI, HOFUKUJI, SOJAGU].join()) throw new Error("1日目の構成が想定と違います");
  // 移動の手段・時間はもとのまま（時刻と滞在だけ変える）
  for (const p of PLAN) {
    const cur = d1.spots.find((s) => s.id === p.id)!.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
    const next = p.legs.map((l) => `${l.mode}${l.min}`).join("+");
    if (cur !== next) throw new Error(`${p.id}: 移動がもとと違います（もと ${cur} / 新 ${next}）`);
  }
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  console.log(`\n説明文は変えない: ${it.description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY1_ID, DAY1 as never, { tx }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
