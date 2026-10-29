/**
 * 初日・最終日の見直し #149 78eab247「朝市と元町の坂、湯の川と五稜郭をめぐる函館さんぽ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（10か所）: 函館朝市（朝食）8:30 → 摩周丸 → 八幡坂 → ハリストス正教会 → 船魂神社 → 金森赤レンガ倉庫（昼食）→ 函館公園 → 函館八幡宮 → 湯倉神社 → 湯の川温泉の足湯 16:25〜16:40
 * 直した初日（8か所）: JR函館駅に11時ごろ → 函館朝市 11:05 → 摩周丸 → 金森赤レンガ倉庫（昼食 12:29〜）→ 八幡坂 → ハリストス正教会 → 函館公園 → 函館八幡宮 → 市電 → 湯の川温泉の足湯 16:15〜16:30
 *   船魂神社・湯倉神社を外す（11時からでは10か所が入らない。タイトルに出てこない。写真なし。企画運営 10/30）
 *   朝市は11時台に歩いてめぐる形にし、スポット名の「（朝食）」と「朝ごはんは、ここで…」を直す。昼食は説明文どおり金森赤レンガ倉庫。
 *   摩周丸のあとに金森赤レンガ倉庫（港沿い）、そこから八幡坂へ上る順にする（八幡坂のメモの「さきほど見学した摩周丸」はそのまま合う）
 *   歩き（道のり。routing.openstreetmap.de の foot）: 駅→朝市 約5分、朝市→摩周丸 268m・4分、摩周丸→金森 966m・13分、金森→八幡坂 661m・9分、八幡坂→ハリストス 159m・2分、
 *     ハリストス→函館公園 962m・13分、函館公園→八幡宮 962m・13分（12→13）、八幡宮→谷地頭電停 938m・13分（10→13）＋市電35分＋電停→足湯 57m・1分
 *   滞在はどれも、もとより短いか同じ（朝市 60→32分、摩周丸 60→35分、金森 60→50分、八幡坂 15→10分、ハリストス 30→25分、函館公園 50→25分、八幡宮 30分、足湯 15分）
 * 説明文: 「朝ごはんから」と、外した船魂神社の「神社」、順番を直す
 * 座標: 2日目 五稜郭公園 → メモにある way 260879409「五稜郭跡 箱館奉行所」（いまは公園の中心の点。約40m）。
 *   ほかは OSM の点と同じ（朝市 way 1117395054、摩周丸 way 263925780、八幡坂 node 5329294424、ハリストス way 254175356、金森 node 2476094422、八幡宮 way 1213037094、
 *   足湯 node 2700680941、函館山 展望台 node 5603043222、立待岬 node 4912828921 など）。函館公園 → 公園の中の way 412452520「市立函館博物館」（企画運営 10/30。公園の形の中心は使わない）。
 *   見晴公園は、中に名前のある施設・入口の点が OSM になく、公園の way の点のまま。
 *   歩き（博物館の点から）: ハリストス→函館公園 1,075m・14分、函館公園→八幡宮 847m・11分
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-149-78eab247.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "78eab247-c4ae-4d91-b3d0-e30d0f0c1998";
const DAY1_ID = "38daf822-aa36-46f0-830c-71823a3f2423";
const ASAICHI = "4448481d-c1cd-41bb-9a7b-3392e9990012";
const MASHU = "2569b86a-58b3-477e-ba5c-be38d880ceb1";
const HACHIMANZAKA = "6f2628ad-5870-4616-9665-433e22d2498b";
const HARISUTOSU = "eb7647b4-be95-44bd-916f-6912609a00cd";
const FUNADAMA = "0e9dfeac-1f67-4ae8-8278-be296a7bc09a";
const KANEMORI = "6fae6c98-41b6-4e5f-8d1f-f61d1f663ce2";
const PARK = "73968444-3bb6-42e0-9109-b162c147fd45";
const HACHIMANGU = "ea742a2a-1fd7-4b21-adc0-dcf121ab9a11";
const YUKURA = "0d23b172-eab6-495a-9c78-9c";
const ASHIYU = "441f6e7b-6067-4d4f-8201-84695f4bb4fe";
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

const DESC_FROM = "1日目は函館朝市の朝ごはんから、青函連絡船の摩周丸、八幡坂と元町の教会や神社、金森赤レンガ倉庫での昼食、函館公園と函館八幡宮をめぐり、市電で湯の川温泉へ。";
const DESC_TO = "1日目は函館朝市から、青函連絡船の摩周丸、金森赤レンガ倉庫での昼食、八幡坂と元町の教会、函館公園と函館八幡宮をめぐり、市電で湯の川温泉へ。";
const ASAICHI_NAME_FROM = "函館朝市（朝食）";
const ASAICHI_NAME_TO = "函館朝市";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [ASAICHI]: [
    { from: "JR函館駅から歩いて約1分。", to: "JR函館駅に11時ごろ着いたら、駅前からすぐ。" },
    { from: "朝ごはんは、ここで海鮮丼などを味わいましょう。", to: "海鮮丼などの店も並び、市場の中を歩いて品定めができます。" },
  ],
  [KANEMORI]: [{ from: "船魂神社から港の方へ坂を下って歩いて約15分。", to: "摩周丸から港沿いを歩いて約13分。" }],
  [HACHIMANZAKA]: [{ from: "摩周丸から歩いて約20分。", to: "金森赤レンガ倉庫から坂を上って歩いて約9分。" }],
  [PARK]: [{ from: "金森赤レンガ倉庫から歩いて約20分。", to: "ハリストス正教会から歩いて約14分。" }],
  [HACHIMANGU]: [{ from: "函館公園から歩いて約12分、", to: "函館公園から歩いて約11分、" }],
  [ASHIYU]: [
    {
      from: "湯倉神社から歩いて約7分。",
      to: "八幡宮から谷地頭の電停へ歩いて約13分、市電で湯の川温泉の電停まで約35分、降りてすぐ（あわせて約50分）。",
    },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: "7bf7f756-dd14-4ed1-bea7-34cb0d189e92", from: [41.7969, 140.757156], to: [41.796933, 140.756726] },
  // 企画運営 10/30: 函館公園は公園の形から計算した中心の点なので、公園の中の名前のある施設 way 412452520「市立函館博物館」に
  { id: PARK, from: [41.756307, 140.715673], to: [41.755955, 140.714634] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: ASAICHI, h: 11, m: 5, stay: 32, legs: [] },
  { id: MASHU, h: 11, m: 41, stay: 35, legs: [walk(4)] },
  { id: KANEMORI, h: 12, m: 29, stay: 50, legs: [walk(13)] },
  { id: HACHIMANZAKA, h: 13, m: 28, stay: 10, legs: [walk(9)] },
  { id: HARISUTOSU, h: 13, m: 40, stay: 25, legs: [walk(2)] },
  { id: PARK, h: 14, m: 19, stay: 26, legs: [walk(14)] },
  { id: HACHIMANGU, h: 14, m: 56, stay: 30, legs: [walk(11)] },
  { id: ASHIYU, h: 16, m: 15, stay: 15, legs: [walk(13), train(35, "函館市電（谷地頭→湯の川温泉）"), walk(1)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  const ids = d1.spots.map((s) => s.id);
  const yukura = d1.spots.find((s) => s.id.startsWith(YUKURA));
  if (d1.id !== DAY1_ID || !yukura || ids.join() !== [ASAICHI, MASHU, HACHIMANZAKA, HARISUTOSU, FUNADAMA, KANEMORI, PARK, HACHIMANGU, yukura.id, ASHIYU].join()) throw new Error("1日目の構成が想定と違います");
  const removed = d1.spots.filter((s) => s.id === FUNADAMA || s.id === yukura.id);
  for (const s of removed) if (s.photos.length) throw new Error(`外すスポットに写真があります: ${s.name}`);
  const asaichi = d1.spots.find((s) => s.id === ASAICHI)!;
  if (asaichi.name !== ASAICHI_NAME_FROM) throw new Error(`朝市の名前が想定と違います（${asaichi.name}）`);
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
  const DAY1 = PLAN.map((p) => ({
    id: p.id,
    data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}), ...(p.id === ASAICHI ? { name: ASAICHI_NAME_TO } : {}) },
  }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${p.id === ASAICHI ? ASAICHI_NAME_TO + "（もとの名前 " + s.name + "）" : s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  console.log(`\n外すスポット: ${removed.map((s) => `${s.id}（${s.name}）`).join("・")}`);
  console.log(`\n説明文（直したあと）: ${description}`);
  const allSpots = it.days.flatMap((d) => d.spots);
  for (const c of COORDS) {
    const s = allSpots.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log("\n2日目は時刻を変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: removed.map((s) => s.id) });
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
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
