/**
 * 初日・最終日の見直し #170 56395886「浅草寺の参道と上野の森、上野・浅草満喫旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・電車と歩き。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直す）
 * いまの初日（5か所）: 上野東照宮 9:00 → 上野動物園 9:45〜12:15（150分）→ 上野恩賜公園 → 東京国立博物館 13:10〜15:10 → 浅草花やしき 15:30〜16:30
 * 直した初日（5か所のまま）: JR上野駅（公園口）に11時ごろ → 歩15（foot 1,187m）→ 上野東照宮 11:15〜11:45 → 歩4（313m）→ 上野動物園 11:49〜13:29（園内で昼食）→
 *   歩4（285m）→ 上野恩賜公園（大噴水）13:33〜14:03 → 歩4（300m）→ 東京国立博物館 14:07〜15:37 →
 *   歩14（本館→東京メトロ上野駅 1,113m）＋銀座線5分＋歩9（浅草駅1番出口→花やしき 691m）→ 浅草花やしき 16:05〜16:50
 *   滞在はどれも、もとより短い（東照宮 40→30、動物園 150→100（1か所は90〜100分まで）、公園 40→30、博物館 120→90、花やしき 60→45）
 * 2日目: 移動を測り直す（foot）: 雷門→仲見世 1→2（155m）、仲見世→浅草寺（本堂）5→3（223m）、浅草寺→隅田公園 10（765m）、隅田公園→リバーウォーク 5→4（257m）、
 *   スカイツリー→すみだ北斎美術館 電車25 → 歩7（押上駅まで 508m）＋電車10（半蔵門線・乗り換え・総武線）＋歩13（両国駅→美術館 985m）、北斎美術館→旧安田庭園 10→11（847m）。
 *   旧安田庭園 16:09〜16:34。スカイツリーの昼食の文を、着いてすぐ（12:28ごろ）に変える（昼食は11:30〜13:30ごろ）。1か所目に浅草駅1番出口からの行き方（foot 86m・2分。宿は「浅草の近く」なので駅を基準に、法務 10/30）
 * 座標（中心の建物・メモの物の点にする。itinerary-rules 355・371・372）:
 *   上野動物園: 動物園全体の way の中心 → way 145344139「上野動物園正門」の Nominatim
 *   上野恩賜公園: 公園の relation の中心（道から約20m）→ way 217744244「大噴水」の Nominatim（メモに大噴水を書く）
 *   東京国立博物館: 構内の way の中心 → relation 2737745「本館」の Nominatim（メモの最初の建物）
 *   浅草寺: 境内全体（雷門まで）の way の中心 → way 91008673（別名「観音堂」＝本堂）の Nominatim（メモの本堂）
 *   隅田公園: 両岸の公園の relation の中心（墨田区側）→ 台東区側の node 13359160501（tourism=viewpoint「View of Tokyo Skytree across Sumida river」。メモ「スカイツリーを眺める」）
 *   すみだ北斎美術館: 出どころ不明（way から5m）→ way 444853841「すみだ北斎美術館」の Nominatim
 *   旧安田庭園: 出どころ不明（地理院の番地の点とも11mずれ）→ relation 8410793「心字池」の Nominatim（メモの「心」の字の池）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-170-56395886.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "56395886-d541-4396-b650-e006867bef6a";
const DAY1_ID = "5dd5fe4a-7f3b-4653-b9b6-c26b7fdf9fd1";
const DAY2_ID = "9599b353-bdac-4c29-9018-dd14c2a94137";
const TOSHOGU = "af6f05f1-2ca9-41f9-a253-bed3fd3bacb5";
const ZOO = "e12d19d0-d6a6-4487-84ec-b4d225efbf91";
const PARK = "7ad36aed-fdd7-4674-a19f-63c5eb89a97a";
const TNM = "8c9563a2-277a-411b-9e50-bfa84127186e";
const HANAYASHIKI = "7576c498-58bc-4b2e-9be2-3ea4aa3d349f";
const KAMINARIMON = "bb582650-7a7e-4ef3-a84b-297cdbd3af18";
const NAKAMISE = "4d5358e8-0e94-4b56-aa9c-b6f4944e91f8";
const SENSOJI = "3e8bd13b-7cad-486f-a4da-aedaca3c8485";
const SUMIDAPARK = "56b844ec-e66e-45c9-98a9-886c328afded";
const RIVERWALK = "ccc43a13-271a-4434-9b9d-ff94c84b8aec";
const SKYTREE = "5feba797-ed01-4075-9d02-ab7917f6d898";
const HOKUSAI = "9cdb82f4-d19c-404e-a621-112c638a1c6c";
const YASUDA = "63642753-5679-4d7f-bafe-3a1162d5d0bc";
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

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TOSHOGU]: [
    {
      from: "旅の始まりは上野東照宮へ。",
      to: "この旅は電車と歩きでめぐります。JR上野駅に11時ごろ着いたら、公園口から歩いて約15分。旅の始まりは上野東照宮へ。",
    },
  ],
  [ZOO]: [{ from: "東照宮から歩いてすぐ。", to: "東照宮から歩いて約4分、正門から入ります。" }],
  [PARK]: [{ from: "動物園を出たら、上野恩賜公園を歩きましょう。", to: "動物園の正門を出たら、歩いて約4分、大噴水のある広場のあたりまで、上野恩賜公園を歩きましょう。" }],
  [TNM]: [{ from: "公園を北へ歩いて、東京国立博物館へ。", to: "大噴水から北へ歩いて約4分、東京国立博物館へ。" }],
  [HANAYASHIKI]: [{ from: "上野駅から東京メトロ銀座線で浅草へ。", to: "博物館から歩いて約14分の上野駅から、東京メトロ銀座線で約5分の浅草駅へ。駅から歩いて約9分。" }],
  [KAMINARIMON]: [{ from: "2日目は、浅草寺の総門・雷門から。", to: "2日目は、浅草駅（東京メトロ銀座線の1番出口）から歩いて約2分、浅草寺の総門・雷門から。" }],
  [SUMIDAPARK]: [{ from: "浅草寺から隅田川のほうへ歩いて、隅田公園へ。", to: "浅草寺から隅田川のほうへ歩いて約10分、隅田公園へ。" }],
  [SKYTREE]: [{ from: "展望台を楽しんだら、ふもとで昼食にしましょう。", to: "着いたら、まずふもとで昼食にしてから、展望台へ上りましょう。" }],
  [HOKUSAI]: [
    {
      from: "押上駅から電車を乗り継いで両国駅へ向かい、歩いてすみだ北斎美術館へ。",
      to: "スカイツリーから歩いて約7分の押上駅から、電車を乗り継いで両国駅へ向かい、駅から歩いて約13分ですみだ北斎美術館へ。",
    },
  ],
  [YASUDA]: [{ from: "北斎美術館から歩いて、旧安田庭園へ。", to: "北斎美術館から歩いて約11分、旧安田庭園へ。" }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: TOSHOGU, h: 11, m: 15, stay: 30, legs: [] },
  { id: ZOO, h: 11, m: 49, stay: 100, legs: [walk(4)] },
  { id: PARK, h: 13, m: 33, stay: 30, legs: [walk(4)] },
  { id: TNM, h: 14, m: 7, stay: 90, legs: [walk(4)] },
  { id: HANAYASHIKI, h: 16, m: 5, stay: 45, legs: [walk(14), train(5, "東京メトロ銀座線"), walk(9)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KAMINARIMON, h: 9, m: 0, stay: 20, legs: [] },
  { id: NAKAMISE, h: 9, m: 22, stay: 39, legs: [walk(2)] },
  { id: SENSOJI, h: 10, m: 4, stay: 50, legs: [walk(3)] },
  { id: SUMIDAPARK, h: 11, m: 4, stay: 40, legs: [walk(10)] },
  { id: RIVERWALK, h: 11, m: 48, stay: 25, legs: [walk(4)] },
  { id: SKYTREE, h: 12, m: 28, stay: 120, legs: [walk(15)] },
  { id: HOKUSAI, h: 14, m: 58, stay: 60, legs: [walk(7), train(10, "東京メトロ半蔵門線・JR総武線"), walk(13)] },
  { id: YASUDA, h: 16, m: 9, stay: 25, legs: [walk(11)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: ZOO, from: [35.715343, 139.768896], to: [35.716006, 139.772903] },
  { id: PARK, from: [35.714019, 139.773929], to: [35.716892, 139.775059] },
  { id: TNM, from: [35.719045, 139.775968], to: [35.718921, 139.775983] },
  { id: SENSOJI, from: [35.713403, 139.795527], to: [35.714728, 139.796747] },
  { id: SUMIDAPARK, from: [35.715507, 139.803143], to: [35.713605, 139.80167] },
  { id: HOKUSAI, from: [35.696331, 139.800487], to: [35.696378, 139.800472] },
  { id: YASUDA, from: [35.698384, 139.793834], to: [35.698312, 139.793331] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
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
  const show = (label: string, plan: typeof PLAN, spots: typeof d1.spots) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to || "（消す）" + e.from}`);
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
