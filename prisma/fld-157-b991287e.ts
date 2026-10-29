/**
 * 初日・最終日の見直し #157 b991287e「合掌造り民家園と明善寺、白川郷の暮らしをじっくり学ぶ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は移動の時間が道のりと合っていなかったので直す（終わりは今と同じ）
 * いまの初日（7か所）: 合掌造り民家園 9:30 → 明善寺郷土館 → 本覚寺 → 長瀬家（昼食）→ 和田家 → 荻町城跡展望台 → 白川郷の湯 15:35〜16:55
 * 直した初日（7か所のまま）: JR高山駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車でおよそ50分（OSRM 45分＋駐車）→
 *   民家園 12:05（着いてすぐ昼食。遠い場所の例外 itinerary-rules 62。昼食は長瀬家から民家園に移す）→ 明善寺郷土館 → 本覚寺 → 長瀬家 → 和田家 → 展望台 → 白川郷の湯 16:34〜16:59
 *   歩き（道のり。routing.openstreetmap.de の foot）: 民家園→明善寺 537m・8分（9→8）、明善寺→本覚寺 286m・4分（3→4）、本覚寺→長瀬家 275m・4分（3→4）、
 *     長瀬家→和田家 340m・5分（4→5）、和田家→展望台 652m（上り坂なので、もとの18分のまま）、展望台→白川郷の湯 729m・10分（3→10）
 *   滞在はどれも、もとより短い（民家園 115→90（昼食を含む）、明善寺 35→25、本覚寺 25→15、長瀬家 40→30、和田家 70→40、展望台 40→20、湯 80→25）
 * 2日目（終わりは今と同じ。道の駅 16:26〜16:56）: であい橋→集落 6分（9→6。点を直したため）、集落→神田家 2分（6→2）、神田家→八幡神社 424m・6分（5→6）、
 *   菅沼→相倉 OSRM 10分＋駐車で15分（9→15）。滞在は変えず、菅沼 13:28→13:22、相倉 14:47 着で、道の駅 16:26 からはもとのまま
 * 座標（itinerary-rules 7章）: 民家園 → 民家園の敷地の面（way 662319019「荻町集落2」）の中心をやめ、園内の way 236408773「信称寺本堂」（メモの「お寺なども含めて」）／
 *   荻町合掌造り集落 → いまは「白川郷（荻町）」のバスターミナルの点。メモは朝の集落の散策なので、node 683765481「白川郷」（世界遺産の点）に／
 *   道の駅白川郷 → OSM は道の駅の面（way 435718496）だけで、名前のある建物の点がない。地理院の番地も大字（飯島）の点しか出ないので、道の駅の way の Nominatim の点に
 *   ほかは確かめたうえでそのまま（明善寺・本覚寺・長瀬家・和田家・白川郷の湯・神田家・白川八幡神社＝OSM way の Nominatim の中心、展望台・菅沼・相倉＝OSM node、であい橋＝橋の way）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-157-b991287e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b991287e-ca74-46a8-a190-55ce8cd37fe0";
const DAY1_ID = "ef26a9e0-4a9b-4732-b80f-84742164b5f2";
const MINKAEN = "4dffce3e-9971-497a-beef-24f57c65404d";
const MYOZENJI = "38b25bdb-2d4a-4d59-b2eb-7959afe92056";
const HONKAKUJI = "519c54a5-da6a-4a9b-aa10-0bb3c4d10921";
const NAGASE = "06dba380-7097-4c0e-a886-3c3d662699b4";
const WADA = "f0620fbe-1a1f-4579-b40c-df1223c3ed55";
const TENBO = "d53d2b1f-f533-4354-b43d-66172ebc2116";
const YU = "e4889630-ee86-4d05-9e51-1ccba1ed69d5";
const DEAI = "6aefdd32-5288-4838-8d12-f0420b3d2aa9";
const SHURAKU = "e6e6ac10-fda1-4ea3-bd4c-aa7c055ae713";
const KANDA = "52de25d1-860d-4c14-bedc-810e5465d8dc";
const HACHIMAN = "5c94b3b0-34ee-405e-8093-df308bb8da1a";
const SUGANUMA = "9b1965ca-e1d8-4495-989b-04d1f3eb22ca";
const AINOKURA = "bf35897e-b582-42d4-9474-7c55a4b07c74";
const MICHINOEKI = "4ba39cd2-9d4f-4ca8-8058-51cc8440eb89";
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

// スポットごとの置き換え（1つのメモに1回だけ）
const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [MINKAEN]: [
    {
      from: "高山駅でレンタカーを借りたら、車でおよそ50分の野外博物館合掌造り民家園へ向かいましょう。旅は、ここからスタートです。",
      to: "この旅は車でめぐります。JR高山駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ50分。着いたら、まずこのあたりで昼食にしましょう。旅は、野外博物館合掌造り民家園からスタートです。",
    },
  ],
  [NAGASE]: [{ from: "到着したら、まずこのあたりで昼食をとりましょう。", to: "" }],
};
// 分の数（前のスポットの締めと、次のスポットの書き出しの2か所ずつ）
const MINUTE_EDITS: { from: string; to: string }[] = [
  { from: "およそ9分の明善寺郷土館", to: "およそ8分の明善寺郷土館" },
  { from: "およそ3分の本覚寺", to: "およそ4分の本覚寺" },
  { from: "およそ3分の長瀬家", to: "およそ4分の長瀬家" },
  { from: "およそ4分の和田家", to: "およそ5分の和田家" },
  { from: "およそ3分の白川郷の湯", to: "およそ10分の白川郷の湯" },
  { from: "およそ9分の荻町合掌造り集落", to: "およそ6分の荻町合掌造り集落" },
  { from: "およそ6分の神田家", to: "およそ2分の神田家" },
  { from: "およそ5分の白川八幡神社", to: "およそ6分の白川八幡神社" },
  { from: "およそ9分の相倉集落", to: "およそ15分の相倉集落" },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: MINKAEN, h: 12, m: 5, stay: 90, legs: [] },
  { id: MYOZENJI, h: 13, m: 43, stay: 25, legs: [walk(8)] },
  { id: HONKAKUJI, h: 14, m: 12, stay: 15, legs: [walk(4)] },
  { id: NAGASE, h: 14, m: 31, stay: 30, legs: [walk(4)] },
  { id: WADA, h: 15, m: 6, stay: 40, legs: [walk(5)] },
  { id: TENBO, h: 16, m: 4, stay: 20, legs: [walk(18)] },
  { id: YU, h: 16, m: 34, stay: 25, legs: [walk(10)] },
];
const DAY2_TIMES: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHURAKU, h: 9, m: 21, stay: 80, legs: [walk(6)] },
  { id: KANDA, h: 10, m: 43, stay: 90, legs: [walk(2)] },
  { id: HACHIMAN, h: 12, m: 19, stay: 35, legs: [walk(6)] },
  { id: SUGANUMA, h: 13, m: 22, stay: 70, legs: [car(28)] },
  { id: AINOKURA, h: 14, m: 47, stay: 70, legs: [car(15)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: MINKAEN, from: [36.255021, 136.90153], to: [36.255371, 136.902347] },
  { id: SHURAKU, from: [36.261995, 136.906877], to: [36.257345, 136.906832] },
  { id: MICHINOEKI, from: [36.279026, 136.90195], to: [36.278993, 136.901862] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const memos = new Map(all.map((s) => [s.id, s.memo ?? ""]));
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    let m = memos.get(id)!;
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    memos.set(id, m);
  }
  for (const e of MINUTE_EDITS) {
    let n = 0;
    for (const [id, m] of memos) {
      const k = m.split(e.from).length - 1;
      if (k) memos.set(id, m.split(e.from).join(e.to));
      n += k;
    }
    if (n !== 2) throw new Error(`「${e.from}」が ${n} 回（2回のはず）`);
  }
  const changed = all.filter((s) => memos.get(s.id) !== (s.memo ?? "")).map((s) => s.id);
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(changed.includes(p.id) ? { memo: memos.get(p.id)! } : {}) } }));
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    prevEnd = st + p.stay;
  }
  // 2日目: であい橋 9:00〜9:15（もとのまま）… 相倉 14:47〜15:57 → 車29 → 道の駅 16:26（もとのまま）
  const deai = d2.spots.find((s) => s.id === DEAI);
  const eki = d2.spots.find((s) => s.id === MICHINOEKI);
  if (!deai || hmOf(deai.visitTime) !== "09:00" || deai.stayDurationMin !== 15 || !eki || hmOf(eki.visitTime) !== "16:26" || d2.spots.length !== 7) throw new Error("2日目の構成が想定と違います");
  console.log("\n2日目");
  let pe = 9 * 60 + 15;
  for (const p of DAY2_TIMES) {
    const st = p.h * 60 + p.m;
    const s = d2.spots.find((x) => x.id === p.id)!;
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs[0].mode}${p.legs[0].min} (前から${st - pe}分${st - pe !== p.legs[0].min ? " ⚠" : ""}) ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    pe = st + p.stay;
  }
  console.log(`→ car29 (前から${16 * 60 + 26 - pe}分) 道の駅白川郷 16:26（もとのまま）`);
  console.log("\nメモを直すスポット:");
  for (const id of changed) console.log(`- ${all.find((s) => s.id === id)?.name}: ${memos.get(id)!.slice(0, 120)}…${memos.get(id)!.slice(-60)}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const p of DAY2_TIMES) await tx.spot.update({ where: { id: p.id }, data: timeLegs(p.h, p.m, p.stay, p.legs) });
      for (const id of changed.filter((id) => !PLAN.some((p) => p.id === id))) await tx.spot.update({ where: { id }, data: { memo: memos.get(id)! } });
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
