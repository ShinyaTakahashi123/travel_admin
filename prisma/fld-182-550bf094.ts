/**
 * 初日・最終日の見直し #182 550bf094「道頓堀と新世界のレトロ感、なにわ食い倒れ旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・歩き。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 直した初日（9か所のまま。foot で測り直し）: なんば駅に11時ごろ → 歩7（531m）→ なんばグランド花月 11:07〜11:27 → 歩16（1,280m、もと15）→ 今宮戎神社 11:43〜12:03 →
 *   歩14（1,110m、もとの15）→ 道具屋筋 12:18〜12:38 → 歩6（454m、もと5）→ 黒門市場（昼食）12:44〜13:34 → 歩11（841m、もと10）→ 生國魂神社 13:45〜14:05 → 歩10（753m）→
 *   高津宮 14:15〜14:35 → 歩15（1,142m）→ 法善寺横丁 14:50〜15:15 → 歩2 → 上方浮世絵館 15:17〜15:52 → 歩5 → 道頓堀 15:57〜16:42
 *   滞在はどれも、もとより短い（花月 50→20、今宮戎 30→20、道具屋筋 40→20、黒門 60→50、生國魂 30→20、高津宮 25→20、法善寺 30→25、浮世絵館 50→35、道頓堀 58→45）
 * 2日目: アメリカ村→難波八阪神社、難波八阪神社→通天閣が「電車10分」だったが、近くに使う電車がなく foot で 1,512m・19分、1,764m・23分なので歩きに。心斎橋筋→アメリカ村 5→6、
 *   新世界→四天王寺 20→15（金堂まで 1,161m）。終わりを今より遅くしないため、心斎橋筋 58→52、アメリカ村 67→56。
 *   心斎橋筋 9:00 → アメリカ村 9:58 → 難波八阪神社 11:13 → 通天閣 12:26 → 新世界（昼食）13:29 → 四天王寺 14:25 → 慶沢園 15:40〜16:30
 *   1か所目になんば駅からの歩き（593m・約8分）、帰りの一文に天王寺駅まで約5分（344m）
 * 座標（もとは4けたに丸めた値や出どころ不明 → OSM の値）: 花月 node 447585568、今宮戎 way 447890316、道具屋筋 node 4190281189、黒門市場 node 4161997589（marketplace）、
 *   生國魂 way 603542168、道頓堀 way 174727837（通り）、心斎橋筋 way 895630634（通り）、アメリカ村 node 4586410090、難波八阪神社 way 637023828、通天閣 way 254319878、
 *   新世界 node 4190308689、四天王寺 way 258846859「金堂」（もとは約380m の境内の way の中心。メモの金堂）、慶沢園 node 5570935832「慶沢園」（石碑。もとは約180m の園の way の中心で、大池がある）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-182-550bf094.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "550bf094-cd88-4920-8866-26c35fcba842";
const DAY1_ID = "9aa06298-19c5-4656-b9eb-bc33b57ca9c6";
const DAY2_ID = "b3f4b200-fe6c-4201-9354-eb65465e8a64";
const KAGETSU = "694f424b-b885-43e6-b67e-84212fb81336";
const IMAMIYA = "6f8a2efe-950c-4d5d-9b9d-1dd824cf1b17";
const DOGUYA = "a4c8df66-bd49-4778-8c2c-bde372119a94";
const KUROMON = "9497e5f7-19a9-4d7c-a81d-803f42a95054";
const IKUTAMA = "3e0aed97-0380-4fda-b4d4-95fcd103feb3";
const KOZU = "8dcc6670-0e22-4bc2-a903-913e3e0d24ce";
const HOZENJI = "5e746937-a456-494b-a7f9-36b3a5a1504b";
const UKIYOE = "499149c8-b38a-4cde-9c36-71bbaff23dc0";
const DOTONBORI = "4ac94450-4892-448e-8772-f765c443fe40";
const SHINSAIBASHI = "d445423f-b169-4b0e-80c8-8d60649011e6";
const AMEMURA = "b42ac578-36af-4b68-ae13-9a03e0219035";
const YASAKA = "67b8dd10-1ac5-487a-9e28-b2d23826cd94";
const TSUTENKAKU = "e539c2b5-c287-42a3-a47f-cfca506d52d7";
const SHINSEKAI = "fc4d46bf-b805-4976-8b90-d26f6014aec2";
const SHITENNOJI = "c1b02340-dd41-4f31-b4d0-32a2723d3224";
const KEITAKUEN = "cd22cee5-0226-4cc7-ac61-16d738b75419";
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
  [KAGETSU]: [{ from: "なんば駅から歩いてすぐ、大阪のお笑い", to: "この旅は歩いてめぐります。なんば駅に11時ごろ着いたら、歩いて約7分。大阪のお笑い" }],
  [IMAMIYA]: [{ from: "花月から南へ歩いて、", to: "花月から南へ歩いて約16分、" }],
  [DOGUYA]: [{ from: "今宮戎神社から北へ歩いて、", to: "今宮戎神社から北へ歩いて約15分、" }],
  [KUROMON]: [{ from: "道具屋筋を抜けて、", to: "道具屋筋から歩いて約6分、" }],
  [IKUTAMA]: [{ from: "黒門市場から東へ歩いて、", to: "黒門市場から東へ歩いて約11分、" }],
  [KOZU]: [{ from: "生國魂神社から北へ歩いて、", to: "生國魂神社から北へ歩いて約10分、" }],
  [HOZENJI]: [{ from: "高津宮から坂を下って西へ歩き、", to: "高津宮から坂を下って西へ約15分歩き、" }],
  [UKIYOE]: [{ from: "法善寺の西側の角地に建つ、", to: "法善寺横丁から歩いて約2分、法善寺の西側の角地に建つ、" }],
  [DOTONBORI]: [{ from: "上方浮世絵館から歩いて、", to: "上方浮世絵館から歩いて約5分、" }],
  [SHINSAIBASHI]: [{ from: "2日目は心斎橋筋商店街からスタートです。", to: "2日目は、なんば駅から歩いて約8分の心斎橋筋商店街からスタートです。" }],
  [AMEMURA]: [{ from: "心斎橋筋商店街から少し歩いて、", to: "心斎橋筋商店街から歩いて約6分、" }],
  [YASAKA]: [{ from: "アメリカ村から移動して、", to: "アメリカ村から南へ歩いて約19分、" }],
  [TSUTENKAKU]: [{ from: "難波八阪神社から移動して、", to: "難波八阪神社から南東へ歩いて約23分、" }],
  [SHINSEKAI]: [{ from: "通天閣から歩いてすぐ、", to: "通天閣から歩いて約5分、" }],
  [SHITENNOJI]: [{ from: "新世界から歩いて約20分。", to: "新世界から歩いて約15分。" }],
  [KEITAKUEN]: [
    { from: "四天王寺から歩いて、", to: "四天王寺から歩いて約15分、" },
    { from: "帰りは、天王寺駅から。", to: "帰りは、歩いて約5分の天王寺駅から。" },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KAGETSU, h: 11, m: 7, stay: 20, legs: [] },
  { id: IMAMIYA, h: 11, m: 43, stay: 20, legs: [walk(16)] },
  { id: DOGUYA, h: 12, m: 18, stay: 20, legs: [walk(15)] },
  { id: KUROMON, h: 12, m: 44, stay: 50, legs: [walk(6)] },
  { id: IKUTAMA, h: 13, m: 45, stay: 20, legs: [walk(11)] },
  { id: KOZU, h: 14, m: 15, stay: 20, legs: [walk(10)] },
  { id: HOZENJI, h: 14, m: 50, stay: 25, legs: [walk(15)] },
  { id: UKIYOE, h: 15, m: 17, stay: 35, legs: [walk(2)] },
  { id: DOTONBORI, h: 15, m: 57, stay: 45, legs: [walk(5)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHINSAIBASHI, h: 9, m: 0, stay: 52, legs: [] },
  { id: AMEMURA, h: 9, m: 58, stay: 56, legs: [walk(6)] },
  { id: YASAKA, h: 11, m: 13, stay: 50, legs: [walk(19)] },
  { id: TSUTENKAKU, h: 12, m: 26, stay: 58, legs: [walk(23)] },
  { id: SHINSEKAI, h: 13, m: 29, stay: 41, legs: [walk(5)] },
  { id: SHITENNOJI, h: 14, m: 25, stay: 60, legs: [walk(15)] },
  { id: KEITAKUEN, h: 15, m: 40, stay: 50, legs: [walk(15)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: KAGETSU, from: [34.6656, 135.5033], to: [34.664964, 135.503699] },
  { id: IMAMIYA, from: [34.655264, 135.502306], to: [34.65528, 135.502347] },
  { id: DOGUYA, from: [34.666, 135.5044], to: [34.66398, 135.503492] },
  { id: KUROMON, from: [34.6656, 135.5064], to: [34.665328, 135.506979] },
  { id: IKUTAMA, from: [34.665277, 135.512678], to: [34.665273, 135.512697] },
  { id: DOTONBORI, from: [34.6687, 135.5013], to: [34.668724, 135.503184] },
  { id: SHINSAIBASHI, from: [34.6725, 135.5013], to: [34.670674, 135.501326] },
  { id: AMEMURA, from: [34.6725, 135.4989], to: [34.672085, 135.497947] },
  { id: YASAKA, from: [34.6614, 135.4986], to: [34.661482, 135.496733] },
  { id: TSUTENKAKU, from: [34.6524, 135.5061], to: [34.652539, 135.50631] },
  { id: SHINSEKAI, from: [34.652, 135.5064], to: [34.65209, 135.506191] },
  { id: SHITENNOJI, from: [34.654719, 135.516798], to: [34.653878, 135.516447] },
  { id: KEITAKUEN, from: [34.649714, 135.511346], to: [34.649433, 135.510419] },
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
