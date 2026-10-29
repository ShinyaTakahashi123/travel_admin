/**
 * 初日・最終日の見直し #152 ff3e9cd9「片山津・山代・山中温泉とあやとりはし、加賀温泉郷3つの湯めぐり1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・初日は車。初日を11時ごろからにする（最終日は1泊2日なので時刻は今のまま）
 * いまの初日（6か所）: 片山津温泉 9:00 → 雪の科学館 → 那谷寺 → 山代温泉の温泉街（昼食）→ 九谷焼窯跡展示館 → 古総湯 15:20〜16:30
 * 直した初日（6か所のまま）: JR加賀温泉駅に11時ごろ → 駅の近くでレンタカー（手続き15分ほど）→ 車で約10分 → 片山津温泉 11:25 → 雪の科学館 →
 *   山代温泉の温泉街（昼食 12:57〜）→ 那谷寺 → 九谷焼窯跡展示館 → 古総湯 16:01〜16:31
 *   どこも外さない。昼食を13:30までにするため、雪の科学館のあとに山代温泉で昼食にして、那谷寺をそのあとにする
 *   車（OSRM の時間を少し丸め、駐車のある区間は＋5分まで。企画運営 10/30）: 駅→片山津 4.7km・6分→約10分、片山津→科学館 1.6km・3分→8分、科学館→山代 7.9km・9分→14分、
 *     山代→那谷寺 6.5km・7分→12分、那谷寺→窯跡展示館 5.8km・6分→11分。窯跡展示館→古総湯は歩き 842m・11分（routing.openstreetmap.de の foot）
 *   閉まる時刻: 那谷寺は 9:15〜16:00（13:59〜14:59）、九谷焼窯跡展示館は 16:30まで（15:10〜15:50）
 *   滞在はどれも、もとより短い（片山津 50→30分、科学館 60→40分、山代 55→50分、那谷寺 70→60分、窯跡 70→40分、古総湯 70→30分）
 * 2日目: こおろぎ橋→あやとりはし 20→15分（遊歩道 約1.3km・片道約30分のほぼ中間）、菊の湯→うるし座はタクシー15分→歩き15分（1,131m）。1か所目を 9:05 に（決まり②）
 * 入浴の一言（法務）: 片山津・古総湯・菊の湯に「長湯を避けて、こまめに水分をとりましょう。」
 * 文: 片山津の「朝から開いているので、ひと風呂浴びてから出発するのもよいでしょう。」を外す（初日が11時からになり、すすめる言い方のため）。
 *   2日目の「確かめてください」2か所を「確かめましょう」に（時刻は変えない）
 * 座標（itinerary-rules 7章）: 山代温泉の温泉街 → OSM node 9110143949「山代温泉」（place=quarter。いまの点は名前のある地物と合わない）／
 *   2日目 あやとりはし → way 197605955「綾取り橋」（約0.4m）／2日目 山中座 → node 5705680748「山中座」（いまの点は となりの菊の湯（女湯）の点）。
 *   ほかは OSM の点と同じ（片山津総湯 way 890103377、科学館 way 549844453、那谷寺 way 435569361、芭蕉堂 node 5705680731、うるし座 node 5705680734 など）
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-152-ff3e9cd9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ff3e9cd9-724f-4c8c-80bf-0c0807335c48";
const DAY1_ID = "66266a45-8e0f-4d26-b144-a5d6a995a7cd";
const KATAYAMAZU = "c2ed361f-644c-4773-9a89-2b9529c8739f";
const YUKI = "f51dd917-8cf3-41b3-a81d-4bc3863b17cc";
const NATADERA = "98329eaa-d311-47bc-b399-1a4de2825dc0";
const YAMASHIRO = "2fae0a92-781a-4d82-a328-86a3ee2bba0a";
const KAMAATO = "365d99d6-6de0-44d7-baee-fc88551a4fd3";
const KOSOYU = "bff9490d-d71d-42dd-b4bf-5a9b9651d1db";
const AYATORI = "61714f7b-ec6b-437d-a25d-eb6acd22091e";
const YAMANAKAZA = "d7d74165-900b-4daf-9666-4fee9b88c1e4";
const KIKUNOYU = "868f239c-4299-4f32-ad6b-238d37c80d98";
const URUSHIZA = "599bc5f5-bc10-484a-a950-e56f8b17eff6";
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

// 法務 10/30: 入浴を勧める3か所に、決まりの「長湯を避けて、こまめに水分をとりましょう。」を足す（itinerary-rules 入浴の一言）
const BATH_FROM = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。";
const BATH_TO = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";
const KOOROGI = "65e0172c-d0ac-4a0f-b30b-2dd576c5d03d";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KATAYAMAZU]: [
    {
      from: "柴山潟のほとりに広がる片山津温泉の総湯から旅を始めましょう。",
      to: "この旅の1日目は車でめぐります。JR加賀温泉駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約10分。柴山潟のほとりに広がる片山津温泉の総湯から旅を始めましょう。",
    },
    { from: "朝から開いているので、ひと風呂浴びてから出発するのもよいでしょう。", to: "" },
    { from: BATH_FROM, to: BATH_TO },
  ],
  [YUKI]: [{ from: "総湯から車で約10分。", to: "総湯から車で約8分。" }],
  [YAMASHIRO]: [{ from: "那谷寺から車で約20分、山代温泉へ。", to: "雪の科学館から車で約15分、山代温泉へ。" }],
  [NATADERA]: [{ from: "雪の科学館から車で約25分。", to: "山代温泉から車で約12分。" }],
  [KAMAATO]: [{ from: "湯の曲輪から歩いて約10分。", to: "那谷寺から車で約11分、ふたたび山代温泉へ。" }],
  [KOSOYU]: [
    { from: "窯跡展示館から湯の曲輪へ戻って歩いて約10分。", to: "窯跡展示館から湯の曲輪へ戻って歩いて約11分。" },
    { from: BATH_FROM, to: BATH_TO },
  ],
};
// 2日目（企画運営 10/30）: こおろぎ橋→あやとりはし 20→15分（鶴仙渓の遊歩道は こおろぎ橋〜黒谷橋 約1.3km・片道約30分で、あやとりはしはほぼ中間。tabi-mag.jp/is0178/）。
//   菊の湯→うるし座はタクシー15分ではなく歩き 1,131m・15分（routing.openstreetmap.de の foot）。
//   5分短くなった分は、決まり②で1か所目のこおろぎ橋を 9:00→9:05 にする（あやとりはしから後ろは今のまま）
const DAY2_MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [AYATORI]: [{ from: "こおろぎ橋から鶴仙渓に沿って歩いて約20分。", to: "こおろぎ橋から鶴仙渓に沿って歩いて約15分。" }],
  [KIKUNOYU]: [
    { from: BATH_FROM, to: BATH_TO },
    { from: "休館日は公式の案内で確かめてください。", to: "休館日は公式の案内で確かめましょう。" },
  ],
  [URUSHIZA]: [
    { from: "温泉街からタクシーで約15分。", to: "温泉街から歩いて約15分。" },
    { from: "閉館の時間と休館日は公式の案内で確かめてください。", to: "閉館の時間と休館日は公式の案内で確かめましょう。" },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: YAMASHIRO, from: [36.288592, 136.361351], to: [36.289873, 136.363033] },
  { id: AYATORI, from: [36.245468, 136.375788], to: [36.245472, 136.375787] },
  { id: YAMANAKAZA, from: [36.247018, 136.37278], to: [36.247158, 136.372842] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KATAYAMAZU, h: 11, m: 25, stay: 30, legs: [] },
  { id: YUKI, h: 12, m: 3, stay: 40, legs: [car(8)] },
  { id: YAMASHIRO, h: 12, m: 57, stay: 50, legs: [car(14)] },
  { id: NATADERA, h: 13, m: 59, stay: 60, legs: [car(12)] },
  { id: KAMAATO, h: 15, m: 10, stay: 40, legs: [car(11)] },
  { id: KOSOYU, h: 16, m: 1, stay: 30, legs: [walk(11)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KATAYAMAZU, YUKI, NATADERA, YAMASHIRO, KAMAATO, KOSOYU].join()) throw new Error("1日目の構成が想定と違います");
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
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + apply(p.id, MEMO_EDITS[p.id]) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) console.log(`\n2日目 ${all.find((s) => s.id === id)?.name}: ${apply(id, edits).slice(-60)}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  const k = d2.spots[0];
  const u = d2.spots.find((s) => s.id === URUSHIZA);
  if (k?.id !== KOOROGI || !k.visitTime || hm(k.visitTime.getUTCHours() * 60 + k.visitTime.getUTCMinutes()) !== "09:00" || k.stayDurationMin !== 30 || !u) throw new Error("2日目の構成が想定と違います");
  console.log(`\n2日目: こおろぎ橋 9:00→9:05（滞在30分のまま）→ 歩き15分 → あやとりはし 9:50（変えない）。うるし座はタクシー15分→歩き15分（時刻は変えない）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) await tx.spot.update({ where: { id }, data: { memo: apply(id, edits) } });
      await tx.spot.update({ where: { id: KOOROGI }, data: { visitTime: t(9, 5) } });
      await tx.spot.update({ where: { id: URUSHIZA }, data: { transitLegs: { deleteMany: {}, create: legsCreate([walk(15)]) } } });
      await tx.spot.update({ where: { id: AYATORI }, data: { transitLegs: { deleteMany: {}, create: legsCreate([walk(15)]) } } });
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
