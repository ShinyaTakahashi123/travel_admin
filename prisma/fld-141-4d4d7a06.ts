/**
 * 初日・最終日の見直し #141 4d4d7a06「草津白根山のふもとと西の河原、自然を満喫する草津1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・車の旅。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（8か所）: 殺生河原 9:00 → 草津熱帯圏 → 片岡鶴太郎美術館 → 西の河原公園 → 湯畑（昼食）→ 熱乃湯 → 白根神社 → 地蔵の湯 16:00〜16:30
 * 直した初日（7か所）: 草津温泉バスターミナルに11時ごろ → 近くでレンタカー（手続き約15分）→ 車で約10分 → 殺生河原 11:25 → 車で温泉街へ → 湯畑（昼食 12:00〜）→ 熱乃湯 →
 *   歩いて 草津熱帯圏 → 片岡鶴太郎美術館 → 西の河原公園 → 白根神社 16:24〜16:54
 *   昼食を13:30までにするため、殺生河原のあとに温泉街へ戻って湯畑で昼食にし、熱帯圏・西の河原は午後に歩く
 *   地蔵の湯を外す（タイトル・説明文に出てこない。写真なし）。宿の一文は白根神社へ
 *   車の時間: バスターミナル→殺生河原 7.1km、殺生河原→湯畑 7.3km。OSRM は約5〜6分（時速80km台に当たり、山道では速すぎる）なので約10分。もとは「約15分」（企画運営 10/29 OK）
 *   歩き（道のり。routing.openstreetmap.de の foot）: 湯畑→熱乃湯 78m・1分（2分のまま）、熱乃湯→熱帯圏 806m・約11分（上りなので12分）、
 *     熱帯圏→美術館 1,185m・約16分（もとの15分を16分に）、美術館→西の河原 300m・約4分（5分のまま）、西の河原→白根神社 789m・約11分（10分を11分に。囲山へ上る）
 *   滞在はどれも、もとより短いか同じ（殺生河原 30→25分、湯畑 75→65分、熱乃湯 30分、熱帯圏 70→45分、美術館 45→34分、西の河原 55→44分、白根神社 35→30分）
 *   レンタカー: 草津温泉に駅レンタカーの営業所がある（アソビューの一覧）。店の名前は書かない
 * 説明文: 順番が変わったので、1日目の部分を直す
 * 座標（itinerary-rules 7章）: 湯畑 → OSM relation 12852884「湯畑」（約2m）／2日目 草津町温泉図書館 → node 1742251452「温泉図書館」（約22m）
 *   2日目 嫗仙の滝 → node 759302173「嫗仙の滝」（いまは駐車場 way 962111926 の点。法務 10/30）。ほかは OSM の点と同じ
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-141-4d4d7a06.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4d4d7a06-3c87-44a4-93cc-0c9fc0905ac6";
const DAY1_ID = "f3f3ba41-0906-4dd3-954b-5558c0fd85ea";
const SESSHO = "862304b7-de2b-4f23-8bce-ed0e2c04ed8f";
const NETTAI = "5b41a2e1-4c20-4ef3-83dc-9e057e9b03cd";
const BIJUTSU = "ebaf6303-c444-4f70-9199-1e10eede87da";
const SAINO = "b357f2b7-ecbc-4e24-abca-e85fd005714e";
const YUBATAKE = "dd1bfb4e-6675-40be-9f8e-b6d2a9490863";
const NETSUNOYU = "941a011d-007b-4383-acac-091d24acdf5e";
const SHIRANE = "a1bfd4c8-ee88-449f-82ff-9f3f7c855fe1";
const JIZO = "95377637-8aa1-46df-8cc3-3d66bd08101c";
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

const DESC_FROM = "硫黄のにおいが漂う殺生河原から、温泉熱を利用したドームの草津熱帯圏、湯煙が上がる西の河原公園を歩き、草津温泉のシンボル・湯畑のまわりで昼食を。熱乃湯や白根神社もめぐります。";
const DESC_TO = "硫黄のにおいが漂う殺生河原から、草津温泉のシンボル・湯畑のまわりで昼食を。熱乃湯、温泉熱を利用したドームの草津熱帯圏、湯煙が上がる西の河原公園、白根神社を歩いてめぐります。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SESSHO]: [
    {
      from: "旅の始まりは、草津温泉のバスターミナルから車で約15分の殺生河原へ。",
      to: "草津温泉バスターミナルに11時ごろ着いたら、近くでレンタカーを借りて（手続きに15分ほど）、車で約10分の殺生河原へ。",
    },
  ],
  [YUBATAKE]: [{ from: "西の河原公園から歩いて約15分。", to: "殺生河原から車で温泉街へ戻り、約10分。車を駐車場に置いて、ここからは歩いてめぐります。" }],
  [NETTAI]: [{ from: "殺生河原から車で約15分。", to: "熱乃湯から歩いて約12分。" }],
  [BIJUTSU]: [{ from: "草津熱帯圏から歩いて約15分", to: "草津熱帯圏から歩いて約16分" }],
  [SHIRANE]: [
    { from: "熱乃湯から歩いて約10分。", to: "西の河原公園から歩いて約11分。" },
    { from: "お参りください。", to: "お参りください。この夜は、草津温泉の宿に泊まりましょう。" },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: YUBATAKE, from: [36.622927, 138.59674], to: [36.622939, 138.59673] },
  { id: "e49c20db-a5e8-4054-ba3c-e24653f18a65", from: [36.620524, 138.596367], to: [36.620695, 138.596497] },
  // 法務 10/30: 嫗仙の滝は駐車場の点だった → 滝そのもの OSM node 759302173（waterway=waterfall。駐車場から約530m南）。メモに「駐車場から滝つぼまで…約30分」がもとからある
  { id: "e8cd9f26-eb21-42b6-9691-f62c504f083d", from: [36.612253, 138.617086], to: [36.607518, 138.617555] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SESSHO, h: 11, m: 25, stay: 25, legs: [] },
  { id: YUBATAKE, h: 12, m: 0, stay: 65, legs: [car(10)] },
  { id: NETSUNOYU, h: 13, m: 7, stay: 30, legs: [walk(2)] },
  { id: NETTAI, h: 13, m: 49, stay: 45, legs: [walk(12)] },
  { id: BIJUTSU, h: 14, m: 50, stay: 34, legs: [walk(16)] },
  { id: SAINO, h: 15, m: 29, stay: 44, legs: [walk(5)] },
  { id: SHIRANE, h: 16, m: 24, stay: 30, legs: [walk(11)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [SESSHO, NETTAI, BIJUTSU, SAINO, YUBATAKE, NETSUNOYU, SHIRANE, JIZO].join()) throw new Error("1日目の構成が想定と違います");
  if (d1.spots.find((x) => x.id === JIZO)!.photos.length) throw new Error("外すスポットに写真があります");
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
  console.log(`\n外すスポット: ${JIZO}（地蔵の湯）`);
  console.log(`\n説明文（直したあと）: ${description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [JIZO] });
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
