/**
 * 初日・最終日の見直し #179 5c06f01a「新町川水際公園とひょうたん島クルーズ、水の都・徳島1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・歩きと電車・バス。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 直した初日（6か所のまま。foot で測り直し）: JR徳島駅に11時ごろ → 歩9（691m）→ 徳島城博物館 11:09〜11:39 → 歩12（885m、もと15）→ 新町川水際公園 11:51〜12:06 →
 *   歩2（153m）→ ひょうたん島クルーズ 12:08〜13:13（もとのまま、船を降りたら昼食）→ 歩10（742m、もと15）→ 瑞巌寺 13:23〜13:58 → 歩5（364m）→ 阿波おどり会館 14:03〜15:08 →
 *   ロープウェイ10（もとのまま）→ 眉山 15:18〜16:33
 *   滞在はどれも、もと以下（博物館 60→30、公園 45→15、クルーズ 65、瑞巌寺 55→35、会館 70→65、眉山 75）
 * 2日目: 霊山寺→ドイツ館 10→13（foot 984m）。終わりを今より遅くしないため、ドイツ館の滞在 50→47（15:43〜16:30）。
 *   美術館→渦の道（733m・10分）、板東駅→霊山寺（799m・10分）はもとの中。帰りの一文に板東駅まで歩いて約21分（1,651m）。電車の分は出典が見つからないので書かない
 * 座標（もとは出どころ不明・4〜51m → OSM の値）: 新町川水際公園 = way 290326493「新町川・阿波製紙水際公園」、ひょうたん島クルーズ = way 290326241「新町川遊覧船乗り場 (ひょうたん島クルーズ)」、
 *   阿波おどり会館 = way 226021281、鳴門市ドイツ館 = way 320024675。大塚国際美術館は relation 4205190 の Nominatim（34.2325795）を6けたにした値でそのまま。ほかは OSM の値でそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-179-5c06f01a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5c06f01a-0086-43c1-b99b-aa2213773dd4";
const DAY1_ID = "69a8d145-48b0-4884-adc6-883d320c7ab5";
const DAY2_ID = "a223b7a5-7bc1-46cd-8d06-2d7201722fc6";
const HAKU = "4d521713-e16c-482a-bb21-715128418cff";
const PARK = "94bd3958-a315-4414-a7fb-25090841b33e";
const CRUISE = "d5be62ee-b65c-4f42-968a-dd99b7e680ca";
const ZUIGANJI = "a8a38648-41a6-4925-80ab-96c0ed52f88a";
const KAIKAN = "df9b9a5d-3733-4f01-b437-6dbd24d59b03";
const BIZAN = "a9e84ae0-0732-42ab-a963-31c722213e67";
const KANCHOSEN = "81ac7f28-92f2-410e-9e2e-e3ce1271dd3e";
const OTSUKA = "e89b4eaf-8c48-4e08-924f-3326ef30b6c9";
const UZUNOMICHI = "a400c664-4928-4ff7-a078-688a443ec3c6";
const RYOZENJI = "de74a81c-6b91-4b41-9748-bf478a40c79b";
const DOITSUKAN = "73f10b2e-a4f5-4a01-8507-556ade207d2e";
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

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [HAKU]: [{ from: "JR徳島駅から歩いて約10分の、", to: "JR徳島駅に11時ごろ着いたら、歩いて約9分の、" }],
  [PARK]: [{ from: "博物館から歩いて、新町川水際公園へ。", to: "博物館から歩いて約12分、新町川水際公園へ。" }],
  [CRUISE]: [{ from: "公園の中の乗り場から、", to: "公園から歩いて約2分の乗り場から、" }],
  [ZUIGANJI]: [{ from: "新町橋を渡って、眉山のふもとの瑞巌寺へ。", to: "昼食のあと、新町橋を渡って歩いて約10分、眉山のふもとの瑞巌寺へ。" }],
  [KAIKAN]: [{ from: "瑞巌寺から歩いてすぐの阿波おどり会館へ。", to: "瑞巌寺から歩いて約5分の阿波おどり会館へ。" }],
  [UZUNOMICHI]: [{ from: "美術館から鳴門公園を歩いて、渦の道へ。", to: "美術館から鳴門公園を歩いて約10分、渦の道へ。" }],
  [DOITSUKAN]: [
    { from: "霊山寺から歩いて、鳴門市ドイツ館へ。", to: "霊山寺から歩いて約13分、鳴門市ドイツ館へ。" },
    { from: "帰りは、板東駅からJR高徳線で徳島駅へ。", to: "帰りは、歩いて約21分の板東駅から、JR高徳線で徳島駅へ。" },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: HAKU, h: 11, m: 9, stay: 30, legs: [] },
  { id: PARK, h: 11, m: 51, stay: 15, legs: [walk(12)] },
  { id: CRUISE, h: 12, m: 8, stay: 65, legs: [walk(2)] },
  { id: ZUIGANJI, h: 13, m: 23, stay: 35, legs: [walk(10)] },
  { id: KAIKAN, h: 14, m: 3, stay: 65, legs: [walk(5)] },
  { id: BIZAN, h: 15, m: 18, stay: 75, legs: [] },
];
const DAY2_IDS = [KANCHOSEN, OTSUKA, UZUNOMICHI, RYOZENJI, DOITSUKAN];
const DOITSU_PLAN = { h: 15, m: 43, stay: 47, legs: [walk(13)] as Leg[] };

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: PARK, from: [34.07033, 134.549892], to: [34.070356, 134.549871] },
  { id: CRUISE, from: [34.069249, 134.550602], to: [34.069275, 134.550571] },
  { id: KAIKAN, from: [34.070194, 134.545077], to: [34.070151, 134.545018] },
  { id: DOITSUKAN, from: [34.164265, 134.498856], to: [34.164694, 134.49905] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_IDS.join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  // 眉山のロープウェイ（other 10分）はもとのまま
  PLAN[5].legs = all.find((s) => s.id === BIZAN)!.transitLegs.map((l) => ({ mode: l.transitMode as Leg["mode"], min: l.transitDurationMin ?? 0, line: l.transitLine ?? undefined }));
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  for (const [id, edits] of Object.entries(MEMO_EDITS)) apply(id, edits);
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
  console.log("\n2日目");
  for (const s of d2.spots) {
    const d = s.id === DOITSUKAN;
    console.log(`${d ? hm(DOITSU_PLAN.h * 60 + DOITSU_PLAN.m) : hmOf(s.visitTime)} 滞在${d ? DOITSU_PLAN.stay : s.stayDurationMin}分 ${s.name}${d ? `（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分、歩き10→13、終わり ${hm(DOITSU_PLAN.h * 60 + DOITSU_PLAN.m + DOITSU_PLAN.stay)}）` : ""}`);
    for (const e of MEMO_EDITS[s.id] ?? []) console.log(`  → ${e.to}`);
  }
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items as never, { tx });
      await tx.spot.update({ where: { id: UZUNOMICHI }, data: { memo: apply(UZUNOMICHI, MEMO_EDITS[UZUNOMICHI]) } });
      await tx.spot.update({ where: { id: DOITSUKAN }, data: { ...timeLegs(DOITSU_PLAN.h, DOITSU_PLAN.m, DOITSU_PLAN.stay, DOITSU_PLAN.legs), memo: apply(DOITSUKAN, MEMO_EDITS[DOITSUKAN]) } });
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
