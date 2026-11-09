/**
 * 初日・最終日の見直し #131 6e2f29bb「外湯めぐりと松葉ガニ。冬の城崎温泉でゆかた散歩」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（8か所）: 玄武洞公園 9:00 → 四所神社 → 御所の湯 →（昼食）→ 城崎麦わら細工伝承館 → 一の湯 → 大谿川の柳並木 → 柳湯 → まんだら湯 15:40〜16:30
 * 直した初日（7か所）: 城崎温泉駅に11時ごろ → タクシーで玄武洞公園 11:10 → 四所神社 → 御所の湯 →（温泉街で昼食）→ 一の湯 → 大谿川の柳並木 → 柳湯 → まんだら湯 16:05〜16:55 → 城崎温泉の宿
 *   入口と1か所目（企画運営 10/29）: 入口は城崎温泉駅。タクシーで約10分（法務 10/29: もとの「約5分」は駅から約4〜5kmあるので直す。柳湯の「いちばん小さな湯」も「いちばん小さいといわれる湯」に）
 *   説明文の1日目（玄武洞・四所神社・御所の湯・一の湯・柳湯・まんだら湯）はすべて残す
 *   城崎麦わら細工伝承館は外す（2日目は今のままで入れる時間がない。タイトル・説明文に出てこない。写真なし）
 *   昼食は、もとと同じく御所の湯と次の外湯のあいだ（御所の湯の本文に「このあと、温泉街で昼食にしましょう」がある）。13:05〜14:00（歩き5分を含む）
 *   柳湯・まんだら湯は午後から開く外湯（本文にもある）→ 15:25・16:05 に着く
 *   移動の時間は延ばさず、滞在を短くした（玄武洞 60→40分、御所の湯 48→43分、一の湯 50→45分、柳並木 38→28分）
 * 本文: 玄武洞の書き出しに着く時刻を足す。一の湯の書き出しを、昼食のあとに合わせる
 * 説明文・タイトルは変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-131-6e2f29bb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6e2f29bb-45c2-494a-83c1-8e42e11552c1";
const DAY1_ID = "278062c4-541a-4152-b871-16121ae9c38b";
const GENBUDO = "66a2e6d4-eaaf-46f0-8472-560d90ea2d6e";
const SHISHO = "fed7f0d0-58f7-4fb3-81fe-de1656c71f5b";
const GOSHO = "6048f7ad-4adb-4f44-8a8a-19720a461b5a";
const MUGIWARA = "2bf6a6ac-8513-4379-a2c5-c4723f33beef";
const ICHI = "983157d4-8b39-4b6f-8f11-bb866cfd736f";
const YANAGI_NAMIKI = "71373291-0cb9-4fb2-a18c-eb1e37de47b7";
const YANAGIYU = "30bc31eb-6204-43b4-a8ef-5bc766694975";
const MANDARA = "9bd4e88c-da75-43a6-b5f1-2c0040f52c26";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [GENBUDO]: [{ from: "旅の始まりは、城崎温泉駅からタクシーで約5分の玄武洞公園へ。", to: "城崎温泉駅に11時ごろ着いたら、タクシーで約10分の玄武洞公園から旅を始めます。" }],
  [YANAGIYU]: [{ from: "外湯の中ではいちばん小さな湯ですが", to: "外湯の中ではいちばん小さいといわれる湯ですが" }],
  [ICHI]: [{ from: "麦わら細工伝承館から歩いてすぐ。", to: "昼食のあとは、温泉街の中ほどにある一の湯へ。" }],
};

// 御所の湯 13:05 に出て、温泉街で昼食（約55分）、歩いて5分で一の湯 14:05
const LUNCH_GAP = 55;
const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[]; gap?: number }[] = [
  { id: GENBUDO, h: 11, m: 10, stay: 40, legs: [] },
  { id: SHISHO, h: 12, m: 0, stay: 20, legs: [taxi(10)] },
  { id: GOSHO, h: 12, m: 22, stay: 43, legs: [walk(2)] },
  { id: ICHI, h: 14, m: 5, stay: 45, legs: [walk(5)], gap: LUNCH_GAP },
  { id: YANAGI_NAMIKI, h: 14, m: 52, stay: 28, legs: [walk(2)] },
  { id: YANAGIYU, h: 15, m: 25, stay: 30, legs: [walk(5)] },
  { id: MANDARA, h: 16, m: 5, stay: 50, legs: [walk(10)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [GENBUDO, SHISHO, GOSHO, MUGIWARA, ICHI, YANAGI_NAMIKI, YANAGIYU, MANDARA].join()) throw new Error("1日目の構成が想定と違います");
  if (d1.spots.find((s) => s.id === MUGIWARA)!.photos.length) throw new Error("外すスポットに写真があります");
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
    const min = p.legs.reduce((a, l) => a + l.min, 0) + (p.gap ?? 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${p.gap ? `（その前に昼食${p.gap}分）` : ""}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  console.log(`\n外すスポット: ${MUGIWARA}（城崎麦わら細工伝承館）`);
  console.log(`\n説明文は変えない: ${it.description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [MUGIWARA] }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
