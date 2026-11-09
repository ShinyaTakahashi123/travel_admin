/**
 * 初日・最終日の見直し #162 429aa0c4「白良浜と温泉、南紀白浜のリゾート気分を満喫する1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日（夏）。初日を11時ごろからにする。2日目は車の時間が道のりより短かった1区間を直す（終わりは今と同じ）
 * いまの初日（5か所）: 白良浜 9:30 → 崎の湯（歩き15分）→ 白浜海中展望塔 →（車8分）京都大学白浜水族館（昼食）→ 南方熊楠記念館 15:29〜16:34
 * 直した初日（5か所のまま）: JR白浜駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車で約18分（OSRM 13分＋駐車）→
 *   白良浜 11:33〜13:03（浜のまわりで昼食）→ 車8 → 崎の湯 13:11 → 歩8 → 海中展望塔 14:19 → 歩8で崎の湯の車に戻り＋車13 → 水族館 15:10 → 歩7 → 南方熊楠記念館 16:07〜16:32
 *   もとは白良浜から崎の湯まで歩き、海中展望塔から「車で」水族館へ向かっていて、車の置き場所が合わなかった。白良浜→崎の湯を車にして、車を崎の湯のそばに置く形にする
 *   昼食はもと水族館の見学のあと（15時すぎ）だったので、白良浜に移す
 *   車（OSRM＋駐車5分）: 白良浜→崎の湯 3→8、崎の湯→水族館 8→13。歩き（foot）: 崎の湯→展望塔 530m・8分（3→8）、水族館→熊楠記念館 485m・7分（3→7）
 *   閉まる時刻: 水族館・南方熊楠記念館とも入館16:30まで（16:07 に着く）
 *   滞在はどれも、もとより短い（白良浜 120→90、崎の湯 75→60、展望塔 30、水族館 105→50、熊楠 65→25）
 *   崎の湯に「長湯を避けて、こまめに水分をとりましょう。」を足す。南方熊楠記念館に宿の一文「今夜は、白浜温泉に泊まります。」を足す（なかった）
 * 2日目: 円月島→千畳敷 OSRM 10分＋駐車で15分（8→15）。とれとれ市場の滞在 90→83分で合わせ、アドベンチャーワールド 13:44〜16:44 はもとのまま。
 *   ほかの区間はもとの値が OSRM 以上なのでそのまま。最後に帰りの一文がなかったので足す（白浜駅まで OSRM 10分＋駐車）
 * 座標（itinerary-rules 7章）: 白良浜 → 浜の上の node 12845266546「和歌山県朝日夕陽百選 白良浜」（いまの点は出どころ不明）／水族館 → node 1423051676（約40m）／
 *   円月島 → OSM の島 relation 14373097「円月島(高嶋)」の Nominatim の値（法務 10/30）／千畳敷 → node 2430716147「Senjyo Jiki」（viewpoint。岩の面の中心は使わない）／
 *   アドベンチャーワールド → いまの値は園の way 248451390（theme_park）の Nominatim の値。名前つきの入口・案内所の点が OSM にないので、そのまま（企画運営の例外 10/30）
 *   ほかは確かめたうえでそのまま（崎の湯・南方熊楠記念館・三段壁＝OSM node、海中展望塔・とれとれ市場＝OSM way）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-162-429aa0c4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "429aa0c4-7d53-4cb8-b830-cbf7885a1f29";
const DAY1_ID = "a67075ac-48c9-4bc3-96a9-8b223970742f";
const SHIRARA = "4b7bc75e-47a6-409c-9f8a-fcb6b4aeae0b";
const SAKINOYU = "4810ea5d-fbf4-49b2-8f4f-05567e5c03df";
const TENBOTO = "48ff34d5-345b-4715-b4d0-339bd96f296e";
const SUIZOKU = "bdfb7ab7-7e49-4b0e-81bb-e0474c9a642d";
const KUMAGUSU = "b0270b52-5927-4f59-ad6d-70bf508f32c5";
const ENGETSU = "11106436-81e7-4784-8d84-cee2959ac8fd";
const SENJOJIKI = "e5e9b534-1253-4158-a727-8e2a2fce451e";
const SANDANBEKI = "e0f51079-fa3c-4e79-bd84-ddfea60984cd";
const TORETORE = "47da6e35-314c-4469-be6c-5124a0026ce1";
const AW = "03cd6cb6-cf2a-4b63-8477-74ea092d3286";
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
  [SHIRARA]: [
    {
      from: "白良浜は、「南紀白浜」という地名の由来",
      to: "この旅は車でめぐります。JR白浜駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約18分。白良浜は、「南紀白浜」という地名の由来",
    },
    {
      from: "南国リゾートさながらの開放的なひとときを過ごしましょう。",
      to: "南国リゾートさながらの開放的なひとときを過ごしましょう。浜のまわりの店で、昼食にしましょう。",
    },
  ],
  [SAKINOYU]: [
    { from: "白良浜からは歩いて15分ほどです。", to: "白良浜からは車で8分ほどです。" },
    { from: "入浴の際は、ほかの入浴客を撮らないようにしましょう。", to: "入浴の際は、ほかの入浴客を撮らないようにしましょう。長湯を避けて、こまめに水分をとりましょう。" },
  ],
  [TENBOTO]: [{ from: "崎の湯からは歩いて3分ほどです。", to: "崎の湯からは歩いて8分ほどです。" }],
  [SUIZOKU]: [
    { from: "白浜海中展望塔からは車で8分ほどです。", to: "白浜海中展望塔から崎の湯のそばの車まで歩いて戻り（8分ほど）、車で13分ほどです。" },
    { from: "周辺には飲食店もあるので、ゆっくり見学したあとは、ここで昼食をとりましょう。", to: "" },
  ],
  [KUMAGUSU]: [
    { from: "京都大学白浜水族館からは徒歩3分ほどです。", to: "京都大学白浜水族館からは徒歩7分ほどです。" },
    { from: "館内からは、南紀の海を一望することができます。", to: "館内からは、南紀の海を一望することができます。今夜は、白浜温泉に泊まります。" },
  ],
  [SENJOJIKI]: [{ from: "円月島からは車で8分ほどです。", to: "円月島からは車で15分ほどです。" }],
  [AW]: [
    {
      from: "休園日があるので、訪れる前に公式の案内で確かめましょう。",
      to: "休園日があるので、訪れる前に公式の案内で確かめましょう。帰りは、JR白浜駅の近くでレンタカーを返しましょう。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHIRARA, h: 11, m: 33, stay: 90, legs: [] },
  { id: SAKINOYU, h: 13, m: 11, stay: 60, legs: [car(8)] },
  { id: TENBOTO, h: 14, m: 19, stay: 30, legs: [walk(8)] },
  { id: SUIZOKU, h: 15, m: 10, stay: 50, legs: [walk(8), car(13)] },
  { id: KUMAGUSU, h: 16, m: 7, stay: 25, legs: [walk(7)] },
];
const DAY2_TIMES: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SENJOJIKI, h: 10, m: 15, stay: 45, legs: [car(15)] },
  { id: SANDANBEKI, h: 11, m: 3, stay: 60, legs: [car(3)] },
  { id: TORETORE, h: 12, m: 13, stay: 83, legs: [car(10)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: SHIRARA, from: [33.681619, 135.34469], to: [33.680974, 135.345016] },
  { id: SUIZOKU, from: [33.69286, 135.337932], to: [33.69278, 135.337524] },
  { id: ENGETSU, from: [33.689996, 135.336431], to: [33.690059, 135.336459] },
  { id: SENJOJIKI, from: [33.670823, 135.33047], to: [33.670962, 135.330861] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.spots.map((s) => s.id).join() !== [ENGETSU, SENJOJIKI, SANDANBEKI, TORETORE, AW].join()) throw new Error("2日目の構成が想定と違います");
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
  const show = (label: string, plan: typeof PLAN, spots: typeof d1.spots, startEnd = -1) => {
    console.log(`\n${label}`);
    let prevEnd = startEnd;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to || "（消す）" + e.from}`);
      prevEnd = st + p.stay;
    }
    return prevEnd;
  };
  show("1日目（直したあと）", PLAN, d1.spots);
  const eng = d2.spots.find((s) => s.id === ENGETSU)!;
  const aw = d2.spots.find((s) => s.id === AW)!;
  if (hmOf(eng.visitTime) !== "09:30" || eng.stayDurationMin !== 30 || hmOf(aw.visitTime) !== "13:44") throw new Error("2日目の時刻が想定と違います");
  const end = show("2日目（円月島 9:30〜10:00 のあと）", DAY2_TIMES, d2.spots, 10 * 60);
  console.log(`→ car8 (前から${13 * 60 + 44 - end}分) アドベンチャーワールド 13:44〜16:44（もとのまま）`);
  for (const e of MEMO_EDITS[AW]) console.log(`  → ${e.to}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const p of DAY2_TIMES) await tx.spot.update({ where: { id: p.id }, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
      await tx.spot.update({ where: { id: AW }, data: { memo: apply(AW, MEMO_EDITS[AW]) } });
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
