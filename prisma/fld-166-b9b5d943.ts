/**
 * 初日・最終日の見直し #166 b9b5d943「グルメも歴史も。那覇の街をまるごと楽しむ旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 2泊3日。初日を11時ごろからにする。3日目は歩きの時間が道のりより短かったので直す（終わりは今と同じ 16:30）。2日目は変えない
 * いまの初日（12か所）: 首里城公園 9:00 → 歓会門 → 円覚寺跡 → 弁財天堂 → 久慶門 → 園比屋武御嶽石門 → 玉陵 → 昼食 → 継世門 → 石畳道 → 識名宮 → 識名園 15:00〜16:30
 * 直した初日（8か所）: 那覇空港に11時ごろ → ゆいレールで首里駅（約27分）→ 歩いて約15分（930m・13分）→ 首里城公園 11:45 → 歓会門 → 園比屋武御嶽石門 → 玉陵 →
 *   首里の食事処（昼食 13:25〜）→ 石畳道 → 識名宮 → 識名園 15:28〜16:33
 *   円覚寺跡・弁財天堂・久慶門・継世門を外す（11時からでは入りきらないため。どれも写真なし。説明文にない）
 *   歩き（routing.openstreetmap.de の foot）: 首里城公園→歓会門 2分、歓会門→石門 1分、石門→玉陵 504m・7分、玉陵→食事処 695m・10分（数分→10）、
 *     食事処→石畳道 526m・8分、石畳道→識名宮 898m・13分（10→13）、識名宮→識名園 879m・12分
 *   滞在はどれも、もとより短い（首里城 55→30、歓会門 18→10、石門 15→10、玉陵 46→30、昼食 45、石畳道 40→30、識名宮 20→15、識名園 90→65）
 * 3日目（2泊以上の最終日は 14:30〜15:00 に出る。itinerary-rules 50。法務 10/30）: 奥武山公園・沖宮を外す（説明文になし。写真なし）。
 *   天尊廟→福州園 688m・10分（6→10）、福州園→旭橋駅 1,008m・14分＋ゆいレール1駅＋路線バス15分で旧海軍司令部壕 13:12、タクシー12分で瀬長島 14:14〜14:44。
 *   福州園 70→60、壕 50、瀬長島 50→30分。最後に帰りの一文（タクシーで那覇空港へ。OSRM 11分）
 *   旧海軍司令部壕→瀬長島は移動がタクシー（12分＝OSRM 12分）なのに文が「車で」だったので、タクシーの理由（道のり約5km＝OSRM 4,996m、歩くには遠い。企画運営 10/30）と「前もって呼んでおきましょう」を書き、説明文に「（一部タクシー）」を足す
 * 座標（itinerary-rules 7章）: 識名宮 → way 1030892685 の Nominatim 値（いまは約4mずれた出どころ不明の点）／波上宮 → way 1337981786 の Nominatim 値（約17m）／
 *   奥武山公園 → 公園の面の中心をやめ、メモにある node 6881542801「世持神社」
 *   首里の食事処で昼食 → 首里城公園と同じ点だったので、首里の通りのバス停 node 1798891080「首里城前」（店の点は使わない。企画運営 10/30。玉陵から 343m・5分、石畳道まで 483m・7分）。
 *   首里城公園の滞在を 30→35分に戻して（決まり①）、識名園を 16:32 に出る形に
 *   ほかは Nominatim・node と同じ値でそのまま（首里城公園・識名園＝公園 way、石門・玉陵・石畳道・天尊廟・福州園・沖宮・瀬長島＝way、波の上ビーチ＝砂浜 way、護国寺＝way、壕＝node）
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-166-b9b5d943.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";
const DAY1_ID = "f8749d6c-caf7-4c1c-b0bf-d32b38340b75";
const DAY3_ID = "85f38907-5364-4bf6-af12-0f5da2432ba0";
const SHURIJO = "e755d32a-02a7-499e-a77d-2f66c897d7ad";
const KANKAIMON = "f267d98f-b9a2-47a7-a3ff-aa8fe6773572";
const ENKAKUJI = "c2a18cf1-c70e-4609-b8b5-44325631548f";
const BENZAITEN = "f76e8ca3-56cc-4eaa-a34d-403c53294af7";
const KYUKEIMON = "adb9b025-954c-48f5-be32-cb8efa792e82";
const SEKIMON = "e24da1ca-8012-42f8-a72e-9db374975f1d";
const TAMAUDUN = "c24d3305-ef33-46e7-a64c-19f9ed0ae671";
const LUNCH = "2e4ce302-40bb-4011-a922-1e3cb8ca481e";
const KEISEIMON = "e934b929-3cd1-4dba-a077-dff2785d7b56";
const ISHIDATAMI = "58e30032-0cff-4223-baf8-ef14eac6af8e";
const SHIKINAGU = "d565a129-63d4-4a87-bfd0-5d07d7def7b4";
const SHIKINAEN = "2bfbaa2c-fcaa-46e8-a942-64ca9a5cbb2a";
const BEACH = "1ae5b3e0-71a4-4bfb-9fb6-834a01e18120";
const NAMINOUE = "27dd882f-3ddc-4231-bd38-b21fd2e3c2a4";
const GOKOKUJI = "185d7d98-865c-4329-b1df-79f079b71df3";
const TENSONBYO = "f2ff2c80-2a4a-4f6b-a711-ecca3d05b4f3";
const FUKUSHUEN = "538ea33d-7c7b-4d29-a052-578d075115c9";
const ONOYAMA = "33994316-704c-4e20-b767-6e8b7fdea42b";
const OKINOGU = "803f7c7b-1b91-467f-aab8-4a005bd7d2ae";
const KAIGUNGO = "726117bc-9e18-4bfc-9263-da63c6191ccc";
const SENAGA = "70eb117f-104a-45d6-aec2-6b919e82e587";
const ORIG_DAY1 = [SHURIJO, KANKAIMON, ENKAKUJI, BENZAITEN, KYUKEIMON, SEKIMON, TAMAUDUN, LUNCH, KEISEIMON, ISHIDATAMI, SHIKINAGU, SHIKINAEN];
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

const DESC_FROM = "欲張りプランです。";
const DESC_TO = "欲張りプランです（一部タクシー）。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHURIJO]: [
    {
      from: "ゆいレール首里駅から徒歩約15分、",
      to: "この旅はゆいレールと歩きでめぐります。那覇空港に11時ごろ着いたら、ゆいレールで首里駅へ（約27分）。首里駅から徒歩約15分、",
    },
  ],
  [KANKAIMON]: [{ from: "見学を終えたら、歩いてすぐの円覚寺跡へ向かいましょう。", to: "見学を終えたら、歩いてすぐの園比屋武御嶽石門へ向かいましょう。" }],
  [TAMAUDUN]: [{ from: "腹ごしらえに、歩いて数分の食事処で昼食をとりましょう。", to: "腹ごしらえに、歩いて5分ほどの食事処で昼食をとりましょう。" }],
  [LUNCH]: [
    { from: "お昼は、首里城公園からほど近いこのあたりで昼食をとりましょう。", to: "玉陵から歩いて5分ほど。お昼は、首里城公園からほど近いこのあたりで昼食をとりましょう。" },
    { from: "お腹を満たしたら、歩いて継世門へ向かいましょう。", to: "お腹を満たしたら、歩いて首里金城町石畳道へ向かいましょう。" },
  ],
  [ISHIDATAMI]: [{ from: "継世門から向かうのは、", to: "食事処から歩いて7分ほど、向かうのは、" }],
  [SHIKINAGU]: [{ from: "石畳道から歩いて10分ほど、", to: "石畳道から歩いて13分ほど、" }],
  [SHIKINAEN]: [{ from: "世界遺産めぐりの1日、最後に訪れるのは識名園です。", to: "識名宮から歩いて12分ほど。世界遺産めぐりの1日、最後に訪れるのは識名園です。" }],
  [FUKUSHUEN]: [
    { from: "天尊廟・天妃宮から、歩いて向かうのは福州園(ふくしゅうえん)です。", to: "天尊廟・天妃宮から歩いて10分ほど、次に向かうのは福州園(ふくしゅうえん)です。" },
    { from: "腹ごしらえを終えたら、奥武山公園へ向かいましょう。", to: "腹ごしらえを終えたら、旧海軍司令部壕へ向かいましょう。" },
  ],
  [KAIGUNGO]: [
    { from: "奥武山公園駅から路線バスで15分ほど、", to: "福州園から旭橋駅まで歩いて約14分、ゆいレールで1駅の奥武山公園駅へ行き、路線バスで15分ほど、" },
    {
      from: "見学を終えたら、車で瀬長島へ向かいます。",
      to: "見学を終えたら、瀬長島へ向かいます。旧海軍司令部壕から瀬長島までは道のりで約5km、歩くには遠いので、タクシーで向かいましょう（約12分）。タクシーは、前もって呼んでおきましょう。",
    },
  ],
  [SENAGA]: [
    { from: "旧海軍司令部壕から車で、", to: "旧海軍司令部壕からタクシーで約12分、" },
    {
      from: "那覇空港へ戻り、世界遺産や歴史、海の景色を巡った旅を振り返りながら、帰路につきましょう。",
      to: "帰りは、タクシーで那覇空港へ向かい（約11分）、帰りの飛行機に乗りましょう。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHURIJO, h: 11, m: 45, stay: 35, legs: [] },
  { id: KANKAIMON, h: 12, m: 22, stay: 10, legs: [walk(2)] },
  { id: SEKIMON, h: 12, m: 33, stay: 10, legs: [walk(1)] },
  { id: TAMAUDUN, h: 12, m: 50, stay: 30, legs: [walk(7)] },
  { id: LUNCH, h: 13, m: 25, stay: 45, legs: [walk(5)] },
  { id: ISHIDATAMI, h: 14, m: 17, stay: 30, legs: [walk(7)] },
  { id: SHIKINAGU, h: 15, m: 0, stay: 15, legs: [walk(13)] },
  { id: SHIKINAEN, h: 15, m: 27, stay: 65, legs: [walk(12)] },
];
const DAY3: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: BEACH, h: 9, m: 0, stay: 45, legs: [] },
  { id: NAMINOUE, h: 9, m: 50, stay: 30, legs: [walk(5)] },
  { id: GOKOKUJI, h: 10, m: 25, stay: 46, legs: [walk(5)] },
  { id: TENSONBYO, h: 11, m: 13, stay: 15, legs: [walk(2)] },
  { id: FUKUSHUEN, h: 11, m: 38, stay: 60, legs: [walk(10)] },
  { id: KAIGUNGO, h: 13, m: 12, stay: 50, legs: [walk(14), { mode: "train", min: 5, line: "ゆいレール（旭橋→奥武山公園）" }, { mode: "bus", min: 15, line: "路線バス" }] },
  { id: SENAGA, h: 14, m: 14, stay: 30, legs: [{ mode: "taxi", min: 12 }] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: SHIKINAGU, from: [26.210156, 127.713408], to: [26.210173, 127.713446] },
  { id: NAMINOUE, from: [26.220407, 127.671192], to: [26.22056, 127.671136] },
  { id: LUNCH, from: [26.217434, 127.719103], to: [26.219138, 127.715718] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true, transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, , d3] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== ORIG_DAY1.join()) throw new Error("1日目の構成が想定と違います");
  if (d3.id !== DAY3_ID || d3.spots.map((s) => s.id).join() !== [BEACH, NAMINOUE, GOKOKUJI, TENSONBYO, FUKUSHUEN, ONOYAMA, OKINOGU, KAIGUNGO, SENAGA].join()) throw new Error("3日目の構成が想定と違います");
  if (!it.description || it.description.split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const go = d3.spots.find((s) => s.id === KAIGUNGO)!;
  const se = d3.spots.find((s) => s.id === SENAGA)!;
  console.log(`もとの移動: 壕 ${go.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ?? ""}`).join("+")}／瀬長島 ${se.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+")}`);
  const all = [...d1.spots, ...d3.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const removed = [ENKAKUJI, BENZAITEN, KYUKEIMON, KEISEIMON].map((id) => d1.spots.find((s) => s.id === id)!);
  console.log(`外す: ${removed.map((s) => `${s.name}（写真${s.photos.length}）`).join("、")}`);
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
  show("3日目（直したあと）", DAY3, d3.spots);
  console.log(`\n説明文: …${DESC_FROM} → …${DESC_TO}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: typeof PLAN) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(DESC_FROM, DESC_TO) } });
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx, remove: [ENKAKUJI, BENZAITEN, KYUKEIMON, KEISEIMON] });
      await setDaySpotOrder(DAY3_ID, items(DAY3) as never, { tx, remove: [ONOYAMA, OKINOGU] });
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
