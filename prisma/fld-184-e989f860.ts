/**
 * 初日・最終日の見直し #184 e989f860「小泉八雲記念館と塩見縄手、文学と武家屋敷を歩く1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・バスと歩き。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 直した初日（9か所のまま。foot で測り直し、もとが長すぎる区間も直す）: JR松江駅に11時ごろ → レイクラインバス16（もとの文）→ 小泉八雲記念館 11:16〜11:46 → 歩1（62m、もと5）→
 *   旧居 11:47〜12:07 → 歩2（130m、もと5）→ 武家屋敷 12:09〜12:29 → 歩2（96m、もと5）→ 田部美術館 12:31〜12:56 → 歩5 → 塩見縄手（昼食）13:01〜13:51 → 歩10（748m）→
 *   明々庵 14:01〜14:26 → 歩12（925m、もと15）→ 普門院 14:38〜15:08 → 歩5（393m、もと10）→ 松江歴史館 15:13〜15:58 → 歩8（577m、もと10）→ 城山稲荷神社 16:06〜16:31
 *   滞在はどれも、もとより短い（記念館 60→30、旧居 35→20、武家屋敷 40→20、田部 45→25、塩見縄手 60→50、明々庵 30→25、普門院 35→30、歴史館 45、稲荷 25）
 * 2日目: 八重垣神社→神魂神社 20→24（foot 1,847m）、カラコロ工房→月照寺 25→20（1,552m）、月照寺→県立美術館 25→34（2,692m）。終わりを今より遅くしないため、
 *   八重垣神社 40→36、月照寺 65→61（神魂神社 10:20・美術館 15:15 はもとのまま）。帰りの一文を松江駅まで約19分に（1,446m、もと約15分）
 * 座標（もとは出どころ不明・1〜7m）: 記念館 way 317465585、旧居 way 317465587、武家屋敷 way 317466193、塩見縄手 way 1082906437「塩見縄手」（もとは「小泉八雲記念館前」の点の近く）、
 *   明々庵 way 1081159332、松江歴史館 way 311398093。ほかは OSM の値でそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-184-e989f860.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e989f860-3015-44c3-ba91-7ce62baee317";
const DAY1_ID = "bbc9494e-bb19-4577-bf89-f6c675ce0a1a";
const DAY2_ID = "53f7a26b-3db9-495b-87a0-c95ac9631d22";
const KINENKAN = "504c47a5-6331-439a-a476-0f3e227e2e63";
const KYUKYO = "2f4f83f2-f724-416d-93a5-b9437f563e3e";
const BUKE = "c6bbf320-5fb1-4625-b065-61e81ffd9a19";
const TANABE = "14f2ce99-ff02-4b59-9d71-857768d2cd05";
const SHIOMI = "652107e3-af5c-476f-89fd-3fbcca22610a";
const MEIMEIAN = "b25fb7cb-c8e1-4d82-91db-139dee6c176c";
const FUMONIN = "c37b06f3-f1d2-4b41-aa9c-570e18458075";
const REKISHIKAN = "665191d8-be56-49d3-b069-1d988b7eceed";
const INARI = "6813140a-e74b-43ed-9f17-3b383ff795ac";
const YAEGAKI = "8e871c21-227e-43ac-8660-2595c5314b09";
const KAMOSU = "75b51156-aa6f-4009-9759-39320b13a7f4";
const FUDOKI = "e88a867a-f9ac-4f1e-8de3-efd6ace05039";
const KARAKORO = "0d6c307b-d099-4153-8a73-473a123f1ab7";
const GESSHOJI = "f4b9e858-129a-4ec7-810a-7ea69c86a6e6";
const BIJUTSUKAN = "17a51305-d5ae-4bb5-8ec4-7bcd4597ebfc";
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
  [KINENKAN]: [{ from: "JR松江駅からぐるっと松江レイクラインバスで約16分、", to: "JR松江駅に11時ごろ着いたら、市内を回る周遊バスで約16分、" }],
  [KYUKYO]: [{ from: "記念館のとなりの小泉八雲旧居へ。", to: "記念館のとなり、歩いて約1分の小泉八雲旧居へ。" }],
  [BUKE]: [{ from: "旧居から歩いて、塩見縄手のほぼ中央にある武家屋敷へ。", to: "旧居から歩いて約2分、塩見縄手のほぼ中央にある武家屋敷へ。" }],
  [TANABE]: [{ from: "武家屋敷のそばの田部美術館へ。", to: "武家屋敷から歩いて約2分の田部美術館へ。" }],
  [SHIOMI]: [{ from: "美術館を出て、塩見縄手の通りを歩きます。", to: "美術館を出て、塩見縄手の通りを歩きます（約5分）。" }],
  [MEIMEIAN]: [{ from: "塩見縄手から坂を上り、", to: "昼食のあと、塩見縄手から歩いて約10分、坂を上り、" }],
  [FUMONIN]: [{ from: "明々庵から東へ歩いて、", to: "明々庵から東へ歩いて約12分、" }],
  [REKISHIKAN]: [{ from: "普門院から西へ歩いて、", to: "普門院から西へ歩いて約5分、" }],
  [INARI]: [{ from: "歴史館から城山を歩いて、", to: "歴史館から城山を歩いて約8分、" }],
  [KAMOSU]: [{ from: "八重垣神社から東へ歩いて、", to: "八重垣神社から東へ歩いて約24分、" }],
  [FUDOKI]: [{ from: "神魂神社から歩いて、", to: "神魂神社から歩いて約10分、" }],
  [GESSHOJI]: [{ from: "カラコロ工房から西へ歩いて、", to: "カラコロ工房から西へ歩いて約20分、" }],
  [BIJUTSUKAN]: [
    { from: "月照寺から南へ歩いて、", to: "月照寺から南へ歩いて約34分、" },
    { from: "帰りは、松江駅まで歩いて約15分です。", to: "帰りは、松江駅まで歩いて約19分です。" },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KINENKAN, h: 11, m: 16, stay: 30, legs: [] },
  { id: KYUKYO, h: 11, m: 47, stay: 20, legs: [walk(1)] },
  { id: BUKE, h: 12, m: 9, stay: 20, legs: [walk(2)] },
  { id: TANABE, h: 12, m: 31, stay: 25, legs: [walk(2)] },
  { id: SHIOMI, h: 13, m: 1, stay: 50, legs: [walk(5)] },
  { id: MEIMEIAN, h: 14, m: 1, stay: 25, legs: [walk(10)] },
  { id: FUMONIN, h: 14, m: 38, stay: 30, legs: [walk(12)] },
  { id: REKISHIKAN, h: 15, m: 13, stay: 45, legs: [walk(5)] },
  { id: INARI, h: 16, m: 6, stay: 25, legs: [walk(8)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: YAEGAKI, h: 9, m: 20, stay: 36, legs: [] },
  { id: KAMOSU, h: 10, m: 20, stay: 30, legs: [walk(24)] },
  { id: FUDOKI, h: 11, m: 0, stay: 45, legs: [walk(10)] },
  { id: KARAKORO, h: 12, m: 20, stay: 60, legs: [] },
  { id: GESSHOJI, h: 13, m: 40, stay: 61, legs: [walk(20)] },
  { id: BIJUTSUKAN, h: 15, m: 15, stay: 75, legs: [walk(34)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: KINENKAN, from: [35.479296, 133.049142], to: [35.479305, 133.04912] },
  { id: KYUKYO, from: [35.479225, 133.049374], to: [35.479233, 133.049374] },
  { id: BUKE, from: [35.478593, 133.05069], to: [35.478615, 133.050688] },
  { id: SHIOMI, from: [35.478792, 133.049674], to: [35.477834, 133.05126] },
  { id: MEIMEIAN, from: [35.478821, 133.05227], to: [35.478831, 133.052267] },
  { id: REKISHIKAN, from: [35.475224, 133.053506], to: [35.47516, 133.053497] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  // もとの移動をそのまま使う区間（風土記の丘→カラコロ工房の一畑バス35分）
  DAY2[3].legs = all.find((s) => s.id === KARAKORO)!.transitLegs.map((l) => ({ mode: l.transitMode as Leg["mode"], min: l.transitDurationMin ?? 0, line: l.transitLine ?? undefined }));
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
  const show = (label: string, plan: typeof PLAN, spots: typeof d1.spots) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", PLAN, d1.spots);
  show("2日目（直したあと）", DAY2, d2.spots);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: typeof PLAN) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
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
