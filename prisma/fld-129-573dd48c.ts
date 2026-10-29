/**
 * 初日・最終日の見直し #129 573dd48c「京橋と林原美術館、旭川のほとりで水辺と美術を楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（6か所）: 京橋 9:00 → 旭川さくらみち → 岡山後楽園（昼食）→ 岡山神社 → 岡山県立博物館 → 夢二郷土美術館 15:33〜16:38
 * 直した初日（6か所のまま）: JR岡山駅に11時ごろ → 路面電車で西大寺町、歩いて京橋 11:20 → 旭川さくらみち → 岡山後楽園（昼食）→ 岡山神社 → 岡山県立博物館 → 夢二郷土美術館 15:58〜16:43 → 岡山の町の宿
 *   入口と1か所目（企画運営 10/29）: JR岡山駅から路面電車（東山行き）約15分「西大寺町」、歩いて約5分
 *     出典: okayama-kanko.jp/spot/detail_12501.html（備前岡山京橋朝市。JR岡山駅から路面電車（東山行き）約15分「西大寺町」下車、徒歩約5分）
 *   説明文の1日目（京橋・桜並木の遊歩道・後楽園・岡山神社）はすべて残す。どれも外さずに入る
 *   閉まる時刻（決まり7）: 岡山県立博物館 10〜3月は9:30〜17:00（pref.okayama.jp/site/kenhaku/）→ 15:54 に出る
 *     夢二郷土美術館 9:00〜17:00、入館は16:30まで（yumeji-art-museum.com）→ 15:58 に着く
 *   移動の時間は延ばさず、滞在を短くした（京橋 35→25分、さくらみち 55→30分、後楽園 160→120分、博物館 85→45分、夢二 65→45分）
 * 本文: 京橋に書き出しを足す。後楽園の書き出し「歩いてすぐ」は移動が8分なので「歩いて8分ほど」に。夢二郷土美術館に宿の一文を足す
 *   2日目: 岡山県立美術館の書き出しが「林原美術館からは歩いて3分ほど」になっているが、前は岡山城で移動は歩き8分なので「岡山城からは歩いて8分ほど」に直す（時刻は変えない）
 *   2日目（企画運営 10/29）: オリエント美術館・シティミュージアムの「〜てみてください」を「〜しましょう」に。シティミュージアムに帰りの一文（JR岡山駅へ歩いて約5分。直線で約200m）
 * 説明文・タイトルは変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-129-573dd48c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "573dd48c-8210-408d-9f3e-422e03e507bb";
const DAY1_ID = "16a82646-8e55-4658-8a98-c39063cb4866";
const KYOBASHI = "ec7ea7f3-bb5b-4e70-915a-68717bf9cac3";
const SAKURA = "6eb328ce-8fcd-43b6-8afb-e2c42014eacd";
const KORAKUEN = "4af06ef1-d87c-4e22-b3df-5dc2a293c193";
const JINJA = "e1d71346-2fbd-4ff7-b555-91af89c9d795";
const HAKUBUTSU = "8100c713-f208-4392-9f9c-50a6804f4442";
const YUMEJI = "0a1c4bf1-e90b-44ac-87d3-6a3967074f44";
const KENBI = "16aa3f99-bbe0-4a02-9cd8-9ee2571d32be";
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

const KYOBASHI_HEAD = "岡山市街を流れる旭川に架かる橋で、";
const YUMEJI_LAST = "年に2回の企画展もあわせて開催しています。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KYOBASHI]: [
    {
      from: KYOBASHI_HEAD,
      to: "この旅は路面電車と歩きでめぐります。JR岡山駅に11時ごろ着いたら、路面電車（東山行き）で約15分の「西大寺町」で降り、歩いて約5分の京橋から旅を始めます。京橋は、" + KYOBASHI_HEAD,
    },
  ],
  [KORAKUEN]: [{ from: "旭川さくらみちからは歩いてすぐです。", to: "旭川さくらみちからは歩いて8分ほどです。" }],
  [YUMEJI]: [{ from: YUMEJI_LAST, to: YUMEJI_LAST + "1日目はここまでです。今夜は岡山の町の宿に泊まります。" }],
};
const DAY2_MEMOS = [
  { id: KENBI, from: "林原美術館からは歩いて3分ほどです。", to: "岡山城からは歩いて8分ほどです。" },
  { id: "94ff5021-86ee-4b36-9852-ced107ccbf2a", from: "ゆっくりとめぐってみてください。", to: "ゆっくりとめぐりましょう。" },
  {
    id: "cfca39a1-65b9-4725-abe0-c04131334def",
    from: "岡山の歩みをじっくりとたどってみてください。",
    to: "岡山の歩みをじっくりとたどりましょう。帰りは、JR岡山駅へ歩いて戻りましょう（約5分）。",
  },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KYOBASHI, h: 11, m: 20, stay: 25, legs: [] },
  { id: SAKURA, h: 11, m: 51, stay: 30, legs: [walk(6)] },
  { id: KORAKUEN, h: 12, m: 29, stay: 120, legs: [walk(8)] },
  { id: JINJA, h: 14, m: 36, stay: 30, legs: [walk(7)] },
  { id: HAKUBUTSU, h: 15, m: 9, stay: 45, legs: [walk(3)] },
  { id: YUMEJI, h: 15, m: 58, stay: 45, legs: [walk(4)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KYOBASHI, SAKURA, KORAKUEN, JINJA, HAKUBUTSU, YUMEJI].join()) throw new Error("1日目の構成が想定と違います");
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
  console.log("\n2日目は時刻を変えない。本文だけ直す:");
  const day2 = DAY2_MEMOS.map((e) => {
    const s = it.days[1].spots.find((x) => x.id === e.id);
    if (!s || (s.memo ?? "").split(e.from).length !== 2) throw new Error(`2日目 ${e.id} の置き換え元が見つかりません`);
    const memo = s.memo!.replace(e.from, e.to);
    console.log(`\n${s.name}\n  本文: ${memo}`);
    return { id: e.id, memo };
  });
  console.log(`\n説明文は変えない: ${it.description}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const d of day2) await tx.spot.update({ where: { id: d.id }, data: { memo: d.memo } });
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
