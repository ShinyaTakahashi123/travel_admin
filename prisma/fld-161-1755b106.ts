/**
 * 初日・最終日の見直し #161 1755b106「琵琶湖クルーズと大津の街、湖国をゆったり楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目の時刻はもとのまま（移動はどれも道のり以上）
 * いまの初日（6か所）: びわ湖大津港（クルーズ）9:30 → 琵琶湖疏水 → 近江神宮 → びわ湖大津館（昼食）→ 石山寺 → 瀬田の唐橋 15:18〜16:30
 * 直した初日（6か所のまま、順を入れ替え）: JR大津駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車で約17分（OSRM 12分＋駐車）→
 *   石山寺 11:32 → びわ湖大津館（昼食 12:53〜）→ 近江神宮 → 琵琶湖疏水（車をとめる）→ 歩き15分 → びわ湖大津港（ミシガン60 15:00〜16:00）→
 *   歩き15分で車に戻り、車17分 → 瀬田の唐橋 16:32〜16:47
 *   クルーズ: ミシガン60 は大津港 15:00 発 16:00 着（毎日運航は 4/1〜12/6・12/26〜1/3・3/7〜3/31。biwakokisen.co.jp/cruise/michigan/price_time/）。
 *     もとの「9:30から70分」は、9:40発の60分コースに合わせたものなので、15:00発の同じコースにする（滞在 70→67分）
 *   車（OSRM＋駐車5分）: 大津駅→石山寺 12→17、石山寺→大津館 16→21、大津館→近江神宮 5→10（もとの10のまま）、近江神宮→疏水 5→10、疏水→唐橋 12→17
 *   歩き（foot）: 疏水→大津港 1,066m・15分（往き・帰りとも）
 *   石山寺の入山は 16:00 まで（11:32 に着く）
 *   滞在はどれも、もとより短い（石山寺 75→60、大津館 60→50、近江神宮 50→20、疏水 30→15、大津港 70→67、唐橋 72→15）
 * 2日目: 時刻・移動はそのまま。車は日吉大社のあたりにとめて歩き、ケーブルで上ることを滋賀院門跡の締めに書く（企画運営 10/30）。滋賀院門跡の「おすすめです」を直し、最後の延暦寺の「琵琶湖クルーズから始まり」（初日の途中になったため）を直して、帰りの一文を足す
 * 座標（itinerary-rules 7章）: 石山寺 → いまは京阪石山寺駅の点（約750m北）。東大門の node 5537441988「大本山 石山寺」に／
 *   びわ湖大津館 → いまは度分秒の形（0.1秒）。node 9587065731「びわ湖大津館」に／琵琶湖疏水 → いまはバス停「三保ヶ崎」の点。メモの取水口のそば、node 5662647487「琵琶湖疏水」（大津閘門の案内板）に／
 *   三井寺 → node 4619790890「三井寺（園城寺）」に（いまは5けたに丸めた値）／日吉大社 → node 6713258717「日吉大社」（いまの点は出どころ不明）／
 *   滋賀院門跡 → node 3646873309「滋賀院」（いまの点は出どころ不明、約100m東）／延暦寺 → いまはケーブルのふもと寄りの山の中の点。メモの根本中堂の node 4073499068「根本中堂」（案内板）に
 *   ほかは確かめたうえでそのまま（大津港＝OSM way、近江神宮＝node、瀬田の唐橋＝node「瀬田の唐橋」、日吉東照宮＝way）
 * 季節から「冬」を外す（ミシガンの毎日運航は 4/1〜12/6・12/26〜1/3・3/7〜3/31。冬の平日は乗れない日が多い。#132 と同じ扱い。法務・企画運営 10/30）
 * タイトル・説明文は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-161-1755b106.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "1755b106-a197-4812-92d4-c57352d5dad5";
const DAY1_ID = "bca17e65-f547-4b45-b25c-3c13690ef120";
const KO = "685cdb97-9356-4c89-8389-76ce06d460bc";
const SOSUI = "78a37248-9607-4cb5-9ac4-b5907d685e41";
const OMI = "cb1c58ff-ea99-4a0c-89ef-5ef35134a5d7";
const OTSUKAN = "ae827798-cce6-49c6-ab8b-88e6173644d1";
const ISHIYAMA = "8b5346fb-fc21-47dd-ba30-5648473c6480";
const KARAHASHI = "da1dfc10-8e72-460b-a16c-f8053923b4d3";
const MIIDERA = "413d61b7-2c01-477c-b713-f2a6e4102ea6";
const HIYOSHI = "8fd62a06-ccca-4e75-bd90-e755b75eca84";
const SHIGAIN = "5b34b885-ac56-4259-a00e-b40751547bbf";
const ENRYAKU = "51e7e336-f06b-452e-bae8-3f1e35f48652";
const ORIG_ORDER = [KO, SOSUI, OMI, OTSUKAN, ISHIYAMA, KARAHASHI];
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
  [ISHIYAMA]: [
    {
      from: "続いて訪れるのは石山寺です。",
      to: "この旅は車でめぐります。JR大津駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約17分。旅の始まりは石山寺です。",
    },
    { from: "参拝を終えたら、歩いて瀬田の唐橋へ向かいましょう。", to: "参拝を終えたら、車で約20分、びわ湖大津館へ向かいましょう。" },
  ],
  [OTSUKAN]: [{ from: "散策のあとは、車で石山寺へ向かいましょう。", to: "散策のあとは、車で近江神宮へ向かいましょう。" }],
  [OMI]: [{ from: "参拝を終えたら、車でびわ湖大津館へ向かいましょう。", to: "参拝を終えたら、車で琵琶湖疏水へ向かいましょう。" }],
  [SOSUI]: [{ from: "見学を終えたら、車で近江神宮へ向かいましょう。", to: "見学を終えたら、車をとめたまま、歩いて約15分、びわ湖大津港へ向かいましょう。" }],
  [KO]: [
    {
      from: "本日の旅は、びわ湖大津港から琵琶湖クルーズで始めましょう。",
      to: "びわ湖大津港から、約1時間の琵琶湖クルーズに出ましょう。午後にも出る便があります。運航日と時刻は公式の案内で確かめましょう。",
    },
    { from: "下船したら、歩いて琵琶湖疏水へ向かいましょう。", to: "下船したら、歩いて車に戻り（約15分）、車で約17分、瀬田の唐橋へ向かいましょう。" },
  ],
};
const DAY2_MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHIGAIN]: [
    { from: "近くのそば処が並ぶ通りで、昼食をとるのもおすすめです。", to: "近くのそば処が並ぶ通りで、昼食にしましょう。" },
    {
      from: "見学を終えたら、坂本ケーブルに乗って延暦寺へ向かいましょう。",
      to: "見学を終えたら、車は日吉大社のあたりにとめたまま、歩いてケーブル坂本駅へ向かい、坂本ケーブルで延暦寺へ上りましょう。",
    },
  ],
  [ENRYAKU]: [
    {
      from: "琵琶湖クルーズから始まり、大津の街と比叡山の信仰をめぐった1泊2日の旅は、これで終わりです。",
      to: "琵琶湖クルーズと大津の街、比叡山の信仰をめぐった1泊2日の旅は、これで終わりです。帰りは、坂本ケーブルで山を下り、日吉大社のあたりにとめた車に戻って、JR大津駅でレンタカーを返しましょう。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: ISHIYAMA, h: 11, m: 32, stay: 60, legs: [] },
  { id: OTSUKAN, h: 12, m: 53, stay: 50, legs: [car(21)] },
  { id: OMI, h: 13, m: 53, stay: 20, legs: [car(10)] },
  { id: SOSUI, h: 14, m: 23, stay: 15, legs: [car(10)] },
  { id: KO, h: 14, m: 53, stay: 67, legs: [walk(15)] },
  { id: KARAHASHI, h: 16, m: 32, stay: 15, legs: [walk(15), car(17)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: ISHIYAMA, from: [34.967288, 135.903394], to: [34.960711, 135.907621] },
  { id: OTSUKAN, from: [35.026389, 135.868583], to: [35.026715, 135.867743] },
  { id: SOSUI, from: [35.013168, 135.86038], to: [35.012092, 135.857444] },
  { id: MIIDERA, from: [35.013358, 135.85285], to: [35.01339, 135.852847] },
  { id: HIYOSHI, from: [35.072373, 135.864358], to: [35.071122, 135.865569] },
  { id: SHIGAIN, from: [35.069698, 135.868317], to: [35.069465, 135.867214] },
  { id: ENRYAKU, from: [35.067127, 135.852036], to: [35.070178, 135.841546] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== ORIG_ORDER.join()) throw new Error("1日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
    prevEnd = st + p.stay;
  }
  if (it.seasons.join() !== "spring,summer,autumn,winter") throw new Error("季節が想定と違います");
  console.log("\n季節: spring,summer,autumn,winter → spring,summer,autumn（冬は平日のクルーズがないため。企画運営 10/30）");
  if (d2.spots.at(-1)?.id !== ENRYAKU || hmOf(d2.spots.at(-1)!.visitTime) !== "13:50") throw new Error("2日目の構成が想定と違います");
  console.log("\n2日目（時刻はもとのまま）");
  for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) for (const e of edits) console.log(`  ${all.find((s) => s.id === id)?.name} → ${e.to}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: ["spring", "summer", "autumn"] } });
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) await tx.spot.update({ where: { id }, data: { memo: apply(id, edits) } });
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
