/**
 * 初日・最終日の見直し #143 83518f0d「グルメも名所も。札幌の魅力をぎゅっと詰め込んだ旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（6か所）: 北海道神宮 9:00 → 白い恋人パーク → 北海道大学 → 北海道庁旧本庁舎 → 大通公園 → 狸小路商店街 15:50〜16:30
 * 直した初日（6か所のまま）: JR札幌駅に11時ごろ → 地下鉄で宮の沢駅、歩き（約35分）→ 白い恋人パーク 11:35（昼食つき）→ 地下鉄で円山公園駅、歩き → 北海道神宮 13:15 →
 *   地下鉄でさっぽろ駅、歩き → 北海道大学（正門そばのエルムの森）14:30 → 旧本庁舎 → 大通公園 → 狸小路 16:27〜16:52
 *   どこも外さない（説明文に全部出てくる）。昼食を13:30までにするため、白い恋人パーク（館内にカフェ・レストランがある。rurubu・gltjp）を先にして昼食も入れる
 *   白い恋人パークは 10:00〜（rurubu.jp/andmore/spot/80000330）。北海道神宮は冬も16:00まで開いている。旧本庁舎は 8:45〜21:00（sapporo.travel）
 *   移動（歩きは道のり。routing.openstreetmap.de の foot）: 札幌駅→白い恋人 約35分（地下鉄 南北線・東西線＋宮の沢駅から688m・約9分）、
 *     白い恋人→神宮 約35分（宮の沢駅へ約9分＋東西線＋円山公園駅から938m・約12分）、神宮→北大 約40分（円山公園駅へ約12分＋東西線・南北線＋さっぽろ駅から約8分）、
 *     北大（エルムの森）→旧本庁舎 1,206m・約16分（もとの25分は構内の真ん中の点から）、旧本庁舎→大通 572m・約8分、大通→狸小路 557m・約7分
 *   滞在はどれも、もとより短い（白い恋人 75→65分（昼食を含む）、神宮 50→35分、北大 60→35分、旧本庁舎 45→34分、大通 35→17分、狸小路 40→25分）
 * 説明文: 1日目の書き出しの順番を直す
 * 座標（itinerary-rules 7章）: 北海道大学 → OSM way 309551926「北海道大学 インフォメーションセンター エルムの森」（いまは構内の真ん中の計算上の点で、正門から約1km北。メモは「正門そばのエルムの森でマップを」から始まる）。狸小路商店街はそのまま（OSM node 10699550143「狸小路」と同じ点。relation の中心は計算上の点なので使わない。企画運営 10/30）／2日目 中島公園 → メモに出てくる茶室 OSM way 302546256「八窓庵」（historic=building）。公園の way の中心は計算上の点なので使わない（法務 10/30）。ほかは OSM の点と同じ
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-143-83518f0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "83518f0d-2bb9-44db-a3f1-bf8193c73dcf";
const DAY1_ID = "efdcb0f0-c389-4751-8b1c-bc263fa70fe3";
const JINGU = "dabeee47-03d6-4930-8d49-19803a745605";
const SHIROI = "a64fc7c6-f0cf-4db1-b548-93032af5b394";
const HOKUDAI = "ed41aa59-56ec-4856-a258-be18ed01daff";
const AKARENGA = "3837bba8-ad6b-4fcd-b6af-5cec98239fe1";
const ODORI = "75c2cd33-b0a2-4af3-87d1-8ee9c813a2fc";
const TANUKI = "099f2144-1577-4c84-b1b7-d965850373bc";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const DESC_FROM = "1日目は北海道神宮から白い恋人パーク、";
const DESC_TO = "1日目は白い恋人パークから北海道神宮、";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHIROI]: [
    {
      from: "円山公園駅から地下鉄東西線で、白い恋人パークへ。",
      to: "この旅は地下鉄・バスと歩きでめぐります。JR札幌駅に11時ごろ着いたら、地下鉄（南北線・東西線）で宮の沢駅へ行き、歩いて白い恋人パークへ（あわせて約35分）。",
    },
    { from: "このあと、昼食にしましょう。", to: "館内にはカフェやレストランもあるので、ここで昼食にしましょう。" },
  ],
  [JINGU]: [
    {
      from: "地下鉄東西線の円山公園駅から歩いて、北海道神宮へ。",
      to: "白い恋人パークから宮の沢駅へ戻り、地下鉄東西線で円山公園駅へ。駅から歩いて北海道神宮へ（あわせて約35分）。",
    },
  ],
  [HOKUDAI]: [
    {
      from: "昼食のあとは地下鉄で札幌駅方面へ戻り、北海道大学へ。",
      to: "北海道神宮から円山公園駅へ歩き、地下鉄でさっぽろ駅へ戻り、歩いて北海道大学の正門へ（あわせて約40分）。",
    },
    // 「おすすめ」は使わない決まり
    { from: "でマップを手に入れるのがおすすめです。", to: "で、構内のマップを手に入れましょう。" },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: HOKUDAI, from: [43.079563, 141.337322], to: [43.070817, 141.347481] },
  { id: "82948be3-5265-4fb2-af8a-b7e9ac02a764", from: [43.043888, 141.354035], to: [43.046986, 141.353141] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHIROI, h: 11, m: 35, stay: 65, legs: [] },
  { id: JINGU, h: 13, m: 15, stay: 35, legs: [train(35, "札幌市営地下鉄東西線")] },
  { id: HOKUDAI, h: 14, m: 30, stay: 35, legs: [train(40, "札幌市営地下鉄")] },
  { id: AKARENGA, h: 15, m: 21, stay: 34, legs: [walk(16)] },
  { id: ODORI, h: 16, m: 3, stay: 17, legs: [walk(8)] },
  { id: TANUKI, h: 16, m: 27, stay: 25, legs: [walk(7)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [JINGU, SHIROI, HOKUDAI, AKARENGA, ODORI, TANUKI].join()) throw new Error("1日目の構成が想定と違います");
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const description = (it.description ?? "").replace(DESC_FROM, DESC_TO);
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
  const allSpots = it.days.flatMap((d) => d.spots);
  for (const c of COORDS) {
    const s = allSpots.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log(`\n説明文（直したあと）: ${description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const c of COORDS) await tx.spot.update({ where: { id: c.id }, data: { lat: c.to[0], lng: c.to[1] } });
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
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
