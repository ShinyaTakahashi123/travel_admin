/**
 * 初日・最終日の見直し #142 0534e5d3「雪の白川郷と飛騨高山。冬の合掌造り集落をめぐる旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・冬。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（7か所）: 宮川朝市 9:00 → 高山祭屋台会館 → 櫻山八幡宮 → 古い町並（昼食）→ 飛騨国分寺 → 中橋 → 高山陣屋 14:55〜16:30
 * 直した初日（7か所のまま）: JR高山駅に11時ごろ → 歩いて約13分 → 宮川朝市 11:13 → 古い町並（昼食 11:46〜）→ 中橋 → 高山陣屋 → 飛騨国分寺 → 屋台会館 → 櫻山八幡宮 16:07〜16:37
 *   どこも外さない（説明文に全部出てくる）。冬は高山陣屋・屋台会館とも16:30まで（陣屋 11〜2月、屋台会館 12〜2月。kankou-gifu.jp/spot/detail_1244.html・mapple）なので、
 *     陣屋を昼すぎに、屋台会館を夕方の早めにし、最後は境内を歩く櫻山八幡宮にする。宿の一文を陣屋から八幡宮へ
 *   歩き（道のり。routing.openstreetmap.de の foot）: 駅→朝市 1,006m・約13分、朝市→町並 428m・約6分、町並→中橋 196m・約3分、中橋→陣屋 157m・約3分、
 *     陣屋→国分寺 942m・約13分、国分寺→屋台会館 1,231m・約17分、屋台会館→八幡宮 287m（もとの5分のまま）
 *   滞在はどれも、もとより短い（朝市 40→27分、町並 90→70分、中橋 20→10分、陣屋 95→70分、国分寺 30→25分、屋台会館 60→45分、八幡宮 30分）
 * 説明文: 1日目の順番に合わせて直す
 * 座標（itinerary-rules 7章）: 2日目 明善寺郷土館 → OSM way 236248630「明善寺郷土館」（約15m）。ほかは OSM の点と同じ
 *   （屋台会館 way 490918179、古い町並 way 1514383783「三町伝統的建造物群保存地区」、荻町集落 node 683765481「白川郷」、神田家 way 236248699 など）
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-142-0534e5d3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0534e5d3-5ada-405b-8781-ed4c0414dc75";
const DAY1_ID = "3bb05cca-ee70-47be-a5b8-b742b84f13a7";
const ASAICHI = "8887443d-31ca-4c3c-97d5-14cde83059e4";
const YATAI = "ebaf2121-00f6-4a9e-bad2-d45d70b94287";
const HACHIMAN = "753c54b7-344b-4639-a8a1-3a07b44ace73";
const MACHINAMI = "706ee2f0-3d5e-4fb2-9ad0-96db97d8db11";
const KOKUBUNJI = "619dcab9-2a4c-4a6d-8438-682cf00d614f";
const NAKAHASHI = "b730515c-4128-403c-b218-ebe2e81fe251";
const JINYA = "464a5142-7c70-4eec-85fb-6c625d958a03";
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

const DESC_FROM = "1日目は朝市から始めて、祭屋台の会館や古い町並、飛騨国分寺、高山陣屋と、雪の飛騨高山を歩いてめぐります。";
const DESC_TO = "1日目は朝市から始めて、古い町並、高山陣屋、飛騨国分寺、祭屋台の会館と、雪の飛騨高山を歩いてめぐります。";
const NIGHT = "この夜は、高山の宿に泊まりましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [ASAICHI]: [{ from: "JR高山駅から歩いて約10分。", to: "JR高山駅に11時ごろ着いたら、歩いて約13分。" }],
  [MACHINAMI]: [{ from: "八幡宮の参道を南へ下り、歩いて約20分。", to: "朝市から東へ歩いて約6分。" }],
  [NAKAHASHI]: [{ from: "国分寺から南東へ歩いて約20分。", to: "古い町並から歩いて約3分。" }],
  [JINYA]: [
    { from: "中橋を渡り、歩いて約5分。", to: "中橋を渡り、歩いて約3分。" },
    { from: NIGHT, to: "" },
  ],
  [KOKUBUNJI]: [{ from: "古い町並から宮川を渡り、駅の方へ歩いて約20分。", to: "高山陣屋から駅の方へ歩いて約13分。" }],
  [YATAI]: [{ from: "朝市から宮川沿いを北へ歩いて約15分。", to: "国分寺から宮川を渡り、北へ歩いて約17分。" }],
  [HACHIMAN]: [{ from: "お参りしましょう。", to: "お参りしましょう。" + NIGHT }],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: "b3a80e59-c6e4-4d52-8d20-ff73f99aaee4", from: [36.25591, 136.906591], to: [36.256043, 136.9066] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: ASAICHI, h: 11, m: 13, stay: 27, legs: [] },
  { id: MACHINAMI, h: 11, m: 46, stay: 70, legs: [walk(6)] },
  { id: NAKAHASHI, h: 12, m: 59, stay: 10, legs: [walk(3)] },
  { id: JINYA, h: 13, m: 12, stay: 70, legs: [walk(3)] },
  { id: KOKUBUNJI, h: 14, m: 35, stay: 25, legs: [walk(13)] },
  { id: YATAI, h: 15, m: 17, stay: 45, legs: [walk(17)] },
  { id: HACHIMAN, h: 16, m: 7, stay: 30, legs: [walk(5)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [ASAICHI, YATAI, HACHIMAN, MACHINAMI, KOKUBUNJI, NAKAHASHI, JINYA].join()) throw new Error("1日目の構成が想定と違います");
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const description = (it.description ?? "").replace(DESC_FROM, DESC_TO);
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
