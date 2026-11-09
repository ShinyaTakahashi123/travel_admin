/**
 * 初日・最終日の見直し #140 8aa6d1e5「自然と文学、吉祥寺・三鷹をのんびり楽しむ旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（7か所）: 武蔵野八幡宮 9:10 → サンロード → ハモニカ横丁 → 井の頭恩賜公園（昼食）→ 井の頭自然文化園 → 深大寺 → 神代植物公園 15:30〜16:30
 * 直した初日（7か所のまま）: 吉祥寺駅に11時ごろ → 歩いて約7分 → 武蔵野八幡宮 11:07 → … → 井の頭恩賜公園（昼食 12:32〜）→ 自然文化園 → バスで神代植物公園 15:27 → 深大寺 16:17〜16:47
 *   どこも外さない（説明文に全部出てくる）
 *   神代植物公園は 9:30〜17:00・入園16:00まで（東京都の発表 metro.tokyo.lg.jp/documents/d/tosei/20260121_05_02）。深大寺のあとでは間に合わないので、植物公園を先にして深大寺をあとにする
 *     → 2か所の書き出しと、「今夜は、バスで吉祥寺へ戻って泊まります。」の位置を入れかえる
 *   移動の時間は今のまま。滞在を短くした（八幡宮 30→20分、サンロード 40→25分、ハモニカ横丁 35→20分、井の頭恩賜公園 75→60分、自然文化園 70→60分、植物公園 60→45分、深大寺 50→30分）
 * 座標（itinerary-rules 7章）: サンロード → OSM way 185393652（highway=pedestrian。約25m）／井の頭恩賜公園はそのまま（池にかかる七井橋 OSM way 31877607 と同じ点。法務 10/29）／
 *   2日目 太宰治文学サロン → OSM になし。地理院「三鷹市下連雀三丁目16番」の点／2日目 国立天文台 → node 1985739823「国立天文台三鷹」（正門の守衛所の近く）
 * 説明文・タイトル・季節は変えない（説明文は「深大寺と神代植物公園」の順だが、どちらも行くので直さない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-140-8aa6d1e5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8aa6d1e5-c110-4e37-b4fa-916fc19c8417";
const DAY1_ID = "91076c4b-1a20-433a-96a4-44bd22d2ec67";
const HACHIMAN = "d675d1a0-95cf-4f88-a110-9b1c8ee0b5d5";
const SUNROAD = "37681a23-570e-40b1-8564-bf5f989142d3";
const HAMONICA = "5802a3ba-6224-48d6-93d3-f5168a1ab052";
const INOKASHIRA = "67b144c0-4b88-4a40-aca8-b6e8d5c5aea6";
const BUNKAEN = "6c07e08a-f92d-4ae6-a155-b344e725dabd";
const JINDAIJI = "c13c510d-c914-4c82-9388-faea3ff25e9d";
const JINDAI_PARK = "43fef9f1-8a08-49df-bb8f-6d1b539cb83c";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const NIGHT = "今夜は、バスで吉祥寺へ戻って泊まります。";
const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [HACHIMAN]: [{ from: "JR・京王井の頭線の吉祥寺駅から歩いて約7分の武蔵野八幡宮へ。", to: "JR・京王井の頭線の吉祥寺駅に11時ごろ着いたら、歩いて約7分の武蔵野八幡宮へ。" }],
  [JINDAI_PARK]: [
    { from: "深大寺のとなりの都立神代植物公園へ。", to: "吉祥寺駅の南口へ戻り、小田急バスの深大寺行きで約30分。終点から歩いて、深大寺のとなりの都立神代植物公園へ。" },
    { from: NIGHT, to: "" },
  ],
  [JINDAIJI]: [
    { from: "吉祥寺駅の南口へ戻り、小田急バスの深大寺行きで約30分の深大寺へ。", to: "神代植物公園から歩いてすぐの深大寺へ。" },
    // 企画運営 10/29: 宿の一文は今の形に
    { from: "お参りください。", to: "お参りください。この夜は、バスで吉祥寺へ戻り、吉祥寺のあたりの宿に泊まりましょう。" },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: SUNROAD, from: [35.704843, 139.580385], to: [35.705045, 139.580509] },
  { id: "fe66a084-954f-497c-9ea8-0b540a27853b", from: [35.700108, 139.562317], to: [35.700394, 139.562546] },
  { id: "a648a155-ff67-48f4-b004-6856033373cf", from: [35.674268, 139.538553], to: [35.675214, 139.537804] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: HACHIMAN, h: 11, m: 7, stay: 20, legs: [] },
  { id: SUNROAD, h: 11, m: 32, stay: 25, legs: [walk(5)] },
  { id: HAMONICA, h: 12, m: 2, stay: 20, legs: [walk(5)] },
  { id: INOKASHIRA, h: 12, m: 32, stay: 60, legs: [walk(10)] },
  { id: BUNKAEN, h: 13, m: 42, stay: 60, legs: [walk(10)] },
  { id: JINDAI_PARK, h: 15, m: 27, stay: 45, legs: [bus(45, "小田急バス")] },
  { id: JINDAIJI, h: 16, m: 17, stay: 30, legs: [walk(5)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [HACHIMAN, SUNROAD, HAMONICA, INOKASHIRA, BUNKAEN, JINDAIJI, JINDAI_PARK].join()) throw new Error("1日目の構成が想定と違います");
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m.trim();
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
  const allSpots = it.days.flatMap((d) => d.spots);
  for (const c of COORDS) {
    const s = allSpots.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
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
