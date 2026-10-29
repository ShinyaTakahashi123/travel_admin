/**
 * 初日・最終日の見直し #125 b7eb511a「鬼岳と福江城跡、五島の火山地形と城下町を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日: 鬼岳 9:00 → 鐙瀬 → 福江港ターミナル（昼食）→ 福江城跡 → 五島観光歴史資料館 → 山本二三美術館 → 明星院 16:10〜16:50
 * 直した初日（6か所）: 鬼岳 11:30 → 鐙瀬 → 福江港ターミナル（昼食）→ 福江城跡 → 五島観光歴史資料館 → 明星院 16:10〜16:50 → 福江の宿
 *   企画運営の確認（10/29）: 港・空港に11時ごろ着いてレンタカーの手続きと15分の運転をすると、鬼岳に着くのは11:30ごろなので、11:30着にして後ろを詰めた
 *   タイトルの鬼岳・福江城跡と、説明文にある鐙瀬・資料館・明星院は残し、山本二三美術館を外す（2日目は今のままで入れる時間がない）
 *   移動の時間は延ばさず、滞在を少し短くした（鬼岳 80→40分、鐙瀬 70→40分、資料館 65→50分）。鬼岳の「山を半周するトレッキング」は時間に合わないので「火口の縁を歩く」までにする
 * 説明文・タイトルは変えない（山本二三美術館は説明文に書かれていない）
 * 資料館から明星院へは、福江港ターミナルの駐車場まで歩いて約10分（約500m）＋車で約10分
 * 本文は、つなぎの文だけを置き換える（ほかの文は 9/29 の見直しで法✅企✅になったまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-125-b7eb511a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b7eb511a-4379-407d-bf5e-dcaeb252229c";
const DAY1_ID = "881350bd-57fd-47de-b380-16b74bacd566";
const ONIDAKE = "ad616cff-5089-48d6-ab19-353b8fbd7d61";
const ABUSSE = "1d67411d-90b0-4179-a8d9-9b5394ff6024";
const PORT = "88486eb5-6c73-4456-8b8d-f2cdb32065de";
const CASTLE = "21f21b19-8de0-4ac5-9113-b227e380183a";
const MUSEUM = "78dfc14a-6717-4fe1-bbe8-5e7bbd6586ae";
const NIZO = "6a5be959-7535-4276-aca1-9adad9ec62a1";
const MYOJOIN = "6464c6a7-146c-4888-b5f4-4191464e311b";
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
  [ONIDAKE]: [
    {
      from: "この旅は車でめぐります。福江港や五島つばき空港の近くでレンタカーを借りて、車で約15分。",
      to: "この旅は車でめぐります。福江港や五島つばき空港に11時ごろ着いたら、近くでレンタカーを借りて、車で約15分。",
    },
    { from: "火口の縁を歩いたり、山を半周するトレッキングを楽しんだりしましょう。", to: "火口の縁を歩いて、草原の広がりを感じましょう。" },
  ],
  [MYOJOIN]: [
    {
      from: "美術館から福江港ターミナルの駐車場へ歩いて約15分で戻り、車で約10分（あわせて約25分）。",
      to: "資料館から福江港ターミナルの駐車場へ歩いて約10分で戻り、車で約10分（あわせて約20分）。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: ONIDAKE, h: 11, m: 30, stay: 40, legs: [] },
  { id: ABUSSE, h: 12, m: 25, stay: 40, legs: [car(15)] },
  { id: PORT, h: 13, m: 25, stay: 50, legs: [car(20)] },
  { id: CASTLE, h: 14, m: 25, stay: 30, legs: [walk(10)] },
  { id: MUSEUM, h: 15, m: 0, stay: 50, legs: [walk(5)] },
  { id: MYOJOIN, h: 16, m: 10, stay: 40, legs: [walk(10), car(10)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [ONIDAKE, ABUSSE, PORT, CASTLE, MUSEUM, NIZO, MYOJOIN].join()) throw new Error("1日目の構成が想定と違います");
  if (d1.spots.find((s) => s.id === NIZO)!.photos.length) throw new Error("外すスポットに写真があります");
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
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${(s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-")} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  console.log(`\n外すスポット: ${NIZO}（山本二三美術館）`);
  console.log(`\n説明文は変えない: ${it.description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [NIZO] }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
