/**
 * 初日・最終日の見直し #174 ecdd6ad8「金峯山寺と吉水神社、桜と信仰の山・吉野を歩く旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・電車と歩き。初日を11時ごろからにする。2日目はもとから 16:40 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * いまの初日（8か所）: 吉野神宮 9:00 → ロープウェイ → 金峯山寺 → 吉水神社 → 吉野山（中千本の町並み・昼食）12:30 → 桜本坊 → 竹林院群芳園 → 如意輪寺 15:20〜16:30
 * 直した初日（8か所のまま。昼食を13:30までに始めるため、町並みを吉水神社の前に入れ替える。foot で測り直し）:
 *   近鉄 吉野神宮駅に11時ごろ → 歩20（1,562m）→ 吉野神宮 11:20〜11:40 → 歩30（2,345m）→ ロープウェイ（千本口駅）12:10〜12:25 → 歩10（吉野山駅→蔵王堂 671m）→ 金峯山寺 12:35〜13:05 →
 *   歩6（410m）→ 吉野山（町並み・昼食）13:11〜14:01 → 歩3（186m）→ 吉水神社 14:04〜14:34 → 歩10（762m）→ 桜本坊 14:44〜15:04 → 歩3（184m）→ 竹林院群芳園 15:07〜15:37 →
 *   歩20（1,455m、もとのまま）→ 如意輪寺 15:57〜16:37
 *   滞在はどれも、もと以下（神宮 40→20、ロープウェイ 15、金峯山寺 60→30、町並み 60→50、吉水 40→30、桜本坊 30→20、竹林院 45→30、如意輪寺 70→40）
 *   如意輪寺に宿の一文。竹林院の「この日の宿にするのもよいでしょう」を直す。「確かめてください」を「確かめましょう」に（ロープウェイ・金峯山寺・2日目の金峯神社）
 * 2日目の1か所目: バスの乗る時間は公式に所要の記載が見つからない（tabi-mag に観桜期は竹林院前〜奥千本の折り返し運転とあるだけ）ので、OSRM（竹林院前→奥千本口 4,346m・10.5分）をもとに「約11分」、
 *   奥千本口→金峯神社 foot 325m・5分（法務 10/30）。季節は春だけで、桜の時期のバスと合う（企画運営 10/30）
 * 2日目: 橿原神宮→神武天皇陵 15→17（foot 1,283m）。終わりを今（16:40）より遅くしないため、陵の滞在 20→18。帰りの一文に畝傍御陵前駅まで約14分（1,061m）。
 *   ほかの移動は foot で確かめ、どれももとの分以内（金峯神社→西行庵 1,491m・19分／20、西行庵→高城山展望台 1,681m・22分／30、展望台→水分神社 767m・10分／15、水分→花矢倉 198m・3分／10、
 *   花矢倉→吉野山駅 2,980m・38分＋ロープウェイ＋近鉄約45分＋橿原神宮前駅→神宮 799m・10分／105）
 * 座標（もとは5けたに丸めた値や出どころ不明 → OSM の値に）:
 *   吉野神宮 relation 3488668、ロープウェイ way 160208868「千本口駅」、金峯山寺 way 179810887「蔵王堂」（メモの本堂）、吉水神社 way 218660992、桜本坊 node 2863675701、
 *   竹林院群芳園 way 470662668「竹林院」、如意輪寺 way 1123815888、西行庵 node 2725021174、高城山展望台 node 2863464401「高城山展望台」（もとは山頂の点から11m・展望台から90m）、
 *   吉野水分神社 way 218659903、花矢倉展望台 node 1902425518。吉野山・金峯神社・橿原神宮・神武天皇陵（way 807692778 の Nominatim）はそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-174-ecdd6ad8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ecdd6ad8-31a0-4e4d-9816-7297a3025225";
const DAY1_ID = "ee2bc50c-986a-4eb1-bf3b-b81135341eaa";
const DAY2_ID = "9796ff91-05ec-479c-8a7b-fd8b122f5f70";
const JINGU = "f495bb2b-3bb8-4ff3-a44f-f36af561ba46";
const ROPEWAY = "6579d4aa-757f-404c-b753-4418aaded504";
const KIMPUSEN = "aeb8bbe6-5b7e-4a8c-bf55-4b7ec7e1a8e7";
const YOSHIMIZU = "2547f320-6dd3-4841-8345-bdbc1f407c86";
const MACHI = "1d9ab461-2388-4335-9752-9e45ce916bc3";
const SAKURAMOTO = "cbbaedcb-af8c-4bc9-8508-ebd5e6f7c6c7";
const CHIKURIN = "a8c4b703-2194-435e-8435-925aa361dd11";
const NYOIRIN = "13fdb997-4ce3-4f26-b42d-4a6e75ce0480";
const KIMPU = "f56c027c-b210-4741-9ca8-803b61f0b709";
const SAIGYO = "f6bc35ee-6c94-4ffe-bf46-8520ebf7b599";
const TAKAGI = "206653c7-c910-4e06-b722-5ab21fdcfe19";
const MIKUMARI = "3f16a0ce-0962-4358-8c2d-166154e1ec47";
const HANAYAGURA = "675df3e1-ed34-4122-b7d0-269a9e67a7ce";
const KASHIHARA = "eb53614e-4fe9-4e86-993b-2bb9e39799c4";
const JINMU = "30b53798-9017-44d1-b681-d19a9d84f1ca";
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
  [JINGU]: [{ from: "近鉄吉野線の吉野神宮駅から歩いて約20分。", to: "この旅は電車と歩きでめぐります。近鉄吉野線の吉野神宮駅に11時ごろ着いたら、歩いて約20分。" }],
  [ROPEWAY]: [{ from: "公式の案内で確かめてください。", to: "公式の案内で確かめましょう。" }],
  [KIMPUSEN]: [{ from: "（修理の状況は公式の案内で確かめてください）", to: "（修理の状況は公式の案内で確かめましょう）" }],
  [MACHI]: [{ from: "吉水神社の鳥居の前に続く、中千本の町並みです。", to: "金峯山寺から歩いて約6分、吉水神社の鳥居の前に続く、中千本の町並みです。" }],
  [YOSHIMIZU]: [{ from: "金峯山寺から歩いて約10分。", to: "昼食のあと、町並みから歩いて約3分。" }],
  [SAKURAMOTO]: [{ from: "中千本の町並みから歩いて約10分のお寺です。", to: "吉水神社から歩いて約10分のお寺です。" }],
  [CHIKURIN]: [
    { from: "桜本坊から歩いてすぐ、", to: "桜本坊から歩いて約3分、" },
    { from: "竹林院は宿坊でもあるので、この日の宿にするのもよいでしょう。", to: "竹林院は宿坊でもあります。" },
  ],
  [NYOIRIN]: [{ from: "静かに、敬意をもってお参りください。", to: "静かに、敬意をもってお参りください。この夜は、中千本の宿に泊まりましょう。" }],
  [KIMPU]: [
    { from: "2日目は、中千本から奥千本口へ向かうバスで奥千本へ（", to: "2日目は、中千本の竹林院前から奥千本口へ向かうバスで約11分、奥千本口から歩いて約5分で奥千本へ（" },
    { from: "時刻は公式の案内で確かめてください。", to: "時刻は公式の案内で確かめましょう。" },
  ],
  [JINMU]: [
    { from: "橿原神宮の北門から歩いて約15分。", to: "橿原神宮の北門から歩いて約17分。" },
    { from: "帰りは近鉄の畝傍御陵前駅か橿原神宮前駅へ向かいます。", to: "帰りは、歩いて約14分の近鉄の畝傍御陵前駅か、橿原神宮前駅へ向かいます。" },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: JINGU, h: 11, m: 20, stay: 20, legs: [] },
  { id: ROPEWAY, h: 12, m: 10, stay: 15, legs: [walk(30)] },
  { id: KIMPUSEN, h: 12, m: 35, stay: 30, legs: [walk(10)] },
  { id: MACHI, h: 13, m: 11, stay: 50, legs: [walk(6)] },
  { id: YOSHIMIZU, h: 14, m: 4, stay: 30, legs: [walk(3)] },
  { id: SAKURAMOTO, h: 14, m: 44, stay: 20, legs: [walk(10)] },
  { id: CHIKURIN, h: 15, m: 7, stay: 30, legs: [walk(3)] },
  { id: NYOIRIN, h: 15, m: 57, stay: 40, legs: [walk(20)] },
];
const DAY1_NOW = [JINGU, ROPEWAY, KIMPUSEN, YOSHIMIZU, MACHI, SAKURAMOTO, CHIKURIN, NYOIRIN];
const DAY2_NOW = [KIMPU, SAIGYO, TAKAGI, MIKUMARI, HANAYAGURA, KASHIHARA, JINMU];
const JINMU_PLAN = { h: 16, m: 22, stay: 18, legs: [walk(17)] as Leg[] };

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: JINGU, from: [34.38461, 135.84555], to: [34.384633, 135.845506] },
  { id: ROPEWAY, from: [34.37519, 135.85396], to: [34.375188, 135.853961] },
  { id: KIMPUSEN, from: [34.36838, 135.85885], to: [34.368377, 135.85885] },
  { id: YOSHIMIZU, from: [34.36728, 135.86193], to: [34.367286, 135.861898] },
  { id: SAKURAMOTO, from: [34.36117, 135.86328], to: [34.361173, 135.863284] },
  { id: CHIKURIN, from: [34.36027, 135.86286], to: [34.360271, 135.862855] },
  { id: NYOIRIN, from: [34.36466, 135.86756], to: [34.364713, 135.867565] },
  { id: SAIGYO, from: [34.33826, 135.88046], to: [34.338264, 135.880456] },
  { id: TAKAGI, from: [34.350349, 135.878053], to: [34.349545, 135.878171] },
  { id: MIKUMARI, from: [34.35394, 135.87314], to: [34.353956, 135.873111] },
  { id: HANAYAGURA, from: [34.35544, 135.8718], to: [34.355444, 135.871802] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1_NOW.join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_NOW.join()) throw new Error("2日目の構成が想定と違います");
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
  const kashi = d2.spots.find((s) => s.id === KASHIHARA)!;
  const kashiEnd = kashi.visitTime!.getUTCHours() * 60 + kashi.visitTime!.getUTCMinutes() + (kashi.stayDurationMin ?? 0);
  const jst = JINMU_PLAN.h * 60 + JINMU_PLAN.m;
  for (const s of d2.spots) {
    if (s.id === JINMU) console.log(`${hm(jst)}-${hm(jst + JINMU_PLAN.stay)} walk17 (前から${jst - kashiEnd}分${jst - kashiEnd !== 17 ? " ⚠" : ""}) ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    else console.log(`${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.name}（そのまま）`);
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
      await tx.spot.update({ where: { id: KIMPU }, data: { memo: apply(KIMPU, MEMO_EDITS[KIMPU]) } });
      await tx.spot.update({ where: { id: JINMU }, data: { ...timeLegs(JINMU_PLAN.h, JINMU_PLAN.m, JINMU_PLAN.stay, JINMU_PLAN.legs), memo: apply(JINMU, MEMO_EDITS[JINMU]) } });
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
