/**
 * 初日・最終日の見直し #180 cf6ae961「渋谷の絶景展望台と明治神宮の杜、対照的な魅力を巡る旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・電車と歩き。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 直した初日（7か所のまま。歩きは foot で、もとが長すぎる区間も直す）: JR原宿駅に11時ごろ → 歩14（foot 1,046m、本殿まで）→ 明治神宮 11:14〜11:44 → 歩9（684m、もと10）→
 *   ミュージアム 11:53〜12:18 → 歩10（766m）→ 竹下通り 12:28〜12:43 → 歩4（318m、もと10）→ 表参道（昼食）12:47〜13:37 → 歩3（200m、もと5）→ 太田記念美術館 13:40〜14:15 →
 *   歩20（1,548m）→ 根津美術館 14:35〜15:26 → 歩4（247m、もと5）→ 岡本太郎記念館 15:30〜16:30
 *   滞在はどれも、もと以下（神宮 70→30、ミュージアム 45→25、竹下 30→15、表参道 65→50、太田 50→35、根津 70→51、岡本 60）
 * 2日目: 代々木公園の点を渋谷門にしたので、原宿駅→ 789m・10分、渋谷門→松濤美術館 20→23（1,778m）。終わりを今より遅くしないため、代々木公園の滞在 50→47（松濤美術館 10:10 からはもとのまま）。
 *   ほかの歩きは foot でもとの分以内（松濤→ハチ公 13／15、ハチ公→金王 10／10、金王→國學院 8／10、國學院→氷川 3／5、氷川→SKY 14／15）
 * 座標: 明治神宮 = relation 3603909「本殿」（もとは 1.3km の境内の way の中心）、ミュージアム = way 1135849071、竹下通り = way 26604007「竹下通り」（もとは出どころ不明）、
 *   代々木公園 = node 1520829226「渋谷門」（もとは 1.1km の公園の relation の中心。噴水池の中心は水の上なので、南の門に。公園を出て松濤へ向かう流れに合う。法務・企画運営 10/30）。ほかは OSM の値でそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-180-cf6ae961.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "cf6ae961-1b58-486b-8b4f-fcae6f7e0516";
const DAY1_ID = "eff3b5c3-c2ef-4353-8d11-865b40a19278";
const DAY2_ID = "ac35f46e-e525-449b-a565-c9d3ab5ca72f";
const JINGU = "1eb63361-9b2e-40b0-bb69-41cebed8ee2d";
const MUSEUM = "754029a0-c106-419f-8ff6-99e0d236690b";
const TAKESHITA = "e0e09e77-08db-4c13-bd32-d3720900a360";
const OMOTESANDO = "3b227569-bd06-408a-ada8-70d515a8999c";
const OTA = "8da93b80-fcd2-4c3d-aff4-e933430928a1";
const NEZU = "85172162-716b-46ee-a0b0-7f949765b8eb";
const OKAMOTO = "eb0de536-2c87-4abb-aac9-003ad91017fa";
const YOYOGI = "edfb129d-2006-47ec-b955-53f7d601ea73";
const SHOTO = "1a98eb77-d0d7-4af7-b576-b789c6f97fd4";
const DAY2_IDS = [
  YOYOGI,
  SHOTO,
  "2e2c8611-33a0-4420-9e80-19914bf6b571",
  "b912cbda-e110-42c5-8c21-82d18854fff4",
  "4f9aab9d-e137-4c01-8ca7-c0990b1fec07",
  "19e81fad-4dc6-4ff7-9a9b-f2cd173f6c55",
  "3db83972-2377-495c-b771-4d73611c524d",
];
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
  [JINGU]: [{ from: "JR山手線の原宿駅から歩いてすぐの入口から、", to: "JR山手線の原宿駅に11時ごろ着いたら、歩いてすぐの入口から、" }],
  [MUSEUM]: [{ from: "御社殿から南参道を戻って、明治神宮ミュージアムへ。", to: "御社殿から南参道を歩いて約9分戻って、明治神宮ミュージアムへ。" }],
  [TAKESHITA]: [{ from: "ミュージアムから原宿駅の方へ歩いて、竹下通りへ。", to: "ミュージアムから原宿駅の方へ歩いて約10分、竹下通りへ。" }],
  [OMOTESANDO]: [{ from: "竹下通りを抜けて、明治神宮へ続く表参道へ。", to: "竹下通りを抜けて歩いて約4分、明治神宮へ続く表参道へ。" }],
  [OTA]: [{ from: "表参道から少し入ったところにある太田記念美術館へ。", to: "表参道から少し入った、歩いて約3分の太田記念美術館へ。" }],
  [NEZU]: [{ from: "表参道を青山の方へ歩き、南青山の根津美術館へ（表参道駅からは歩いて約8分）。", to: "表参道を青山の方へ歩いて約20分、南青山の根津美術館へ（表参道駅からは歩いて約8分）。" }],
  [OKAMOTO]: [{ from: "根津美術館から歩いてすぐの岡本太郎記念館へ。", to: "根津美術館から歩いて約4分の岡本太郎記念館へ。" }],
  [YOYOGI]: [
    {
      from: "2日目は、JR山手線の原宿駅から歩いて約3分の代々木公園から。",
      to: "2日目は、JR山手線の原宿駅から歩いて約3分の入口から代々木公園へ入り、噴水のある池を見て、南の渋谷門まで（駅から約10分）。",
    },
  ],
  [SHOTO]: [{ from: "公園から南へ歩いて、", to: "渋谷門から公園を出て、南へ歩いて約23分、" }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: JINGU, h: 11, m: 14, stay: 30, legs: [] },
  { id: MUSEUM, h: 11, m: 53, stay: 25, legs: [walk(9)] },
  { id: TAKESHITA, h: 12, m: 28, stay: 15, legs: [walk(10)] },
  { id: OMOTESANDO, h: 12, m: 47, stay: 50, legs: [walk(4)] },
  { id: OTA, h: 13, m: 40, stay: 35, legs: [walk(3)] },
  { id: NEZU, h: 14, m: 35, stay: 51, legs: [walk(20)] },
  { id: OKAMOTO, h: 15, m: 30, stay: 60, legs: [walk(4)] },
];
const YOYOGI_PLAN = { h: 9, m: 0, stay: 47, legs: [] as Leg[] };
const SHOTO_PLAN = { h: 10, m: 10, stay: 60, legs: [walk(23)] as Leg[] };

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: JINGU, from: [35.674842, 139.699627], to: [35.675995, 139.699482] },
  { id: MUSEUM, from: [35.672274, 139.702168], to: [35.67235, 139.70217] },
  { id: TAKESHITA, from: [35.670907, 139.704861], to: [35.671161, 139.704955] },
  { id: YOYOGI, from: [35.671405, 139.695172], to: [35.668987, 139.696409] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_IDS.join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
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
  const yEnd = YOYOGI_PLAN.h * 60 + YOYOGI_PLAN.m + YOYOGI_PLAN.stay;
  const sSt = SHOTO_PLAN.h * 60 + SHOTO_PLAN.m;
  console.log(`代々木公園 ${hm(YOYOGI_PLAN.h * 60 + YOYOGI_PLAN.m)}-${hm(yEnd)}（滞在 50→47）→ 歩23 → 松濤美術館 ${hm(sSt)}${sSt - yEnd !== 23 ? " ⚠" : ""}（もと ${hmOf(d2.spots[1].visitTime)}）、以降そのまま（SHIBUYA SKY ${hmOf(d2.spots[6].visitTime)}＋${d2.spots[6].stayDurationMin}）`);
  for (const id of [YOYOGI, SHOTO]) for (const e of MEMO_EDITS[id]) console.log(`  → ${e.to}`);
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
      await tx.spot.update({ where: { id: YOYOGI }, data: { ...timeLegs(YOYOGI_PLAN.h, YOYOGI_PLAN.m, YOYOGI_PLAN.stay, YOYOGI_PLAN.legs), memo: apply(YOYOGI, MEMO_EDITS[YOYOGI]) } });
      await tx.spot.update({ where: { id: SHOTO }, data: { ...timeLegs(SHOTO_PLAN.h, SHOTO_PLAN.m, SHOTO_PLAN.stay, SHOTO_PLAN.legs), memo: apply(SHOTO, MEMO_EDITS[SHOTO]) } });
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
