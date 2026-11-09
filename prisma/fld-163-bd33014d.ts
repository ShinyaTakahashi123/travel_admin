/**
 * 初日・最終日の見直し #163 bd33014d「稲佐山の眺めと出島、鎖国時代の長崎をたどる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は歩きの時間が道のりより短かったので直す（終わりは今と同じ 16:55）
 * いまの初日（8か所）: 眼鏡橋 8:45 → 興福寺 → 崇福寺 → 土神堂 → 浜町アーケード（昼食）→ 歴史文化博物館 → 県美術館 → バス・ロープウェイ → 稲佐山 15:39〜16:44
 * 直した初日（7か所）: JR長崎駅に11時ごろ → 路面電車で約4分「めがね橋」電停 → 歩いて約4分 → 眼鏡橋 11:12 → 興福寺 → 崇福寺 → 浜町アーケード（昼食 12:58〜）→
 *   歴史文化博物館 → 県美術館 → 歩8分で新地中華街バス停 → バス20分 → ロープウェイ6分 → 稲佐山 16:23〜16:53
 *   土神堂を外す（11時からでは入りきらないため。写真なし。タイトル・説明文にない）
 *   歩き（routing.openstreetmap.de の foot）: 電停→眼鏡橋 262m・4分（3→4）、眼鏡橋→興福寺 457m・7分（すぐ→7）、興福寺→崇福寺 877m・12分（数分→12）、
 *     崇福寺→浜町 850m・12分、浜町→博物館 1,309m・18分（10→18）、博物館→美術館 2,054m・28分（20→28）、美術館→新地中華街バス停 559m・8分（なかった）
 *   滞在はどれも、もとより短い（眼鏡橋 40→20、興福寺 40→25、崇福寺 45→30、浜町 55→50、博物館 65→45、美術館 60→30、稲佐山 65→30）
 *   博物館の「予習をしておくのもおすすめです」を直す
 * 2日目: 歩き（foot）26聖人→出島 1,541m・21分（15→21）、出島→ワーフ 7分（3→7）、ワーフ→水辺の森 7分（すぐ→7）、水辺の森→大浦天主堂 12分（10→12）、
 *   大浦天主堂→オランダ坂 729m・10分（すぐ→10）、十二番館→孔子廟 510m・7分（4→7）。出島 90→80分、大浦天主堂 65→55分で合わせ、孔子廟 16:20〜16:55（今と同じ）
 * 2日目の1か所目に、宿からの行き方を足す（JR長崎駅 node 7550110002 から foot で 593m・8分。法務 10/30）
 * 座標（itinerary-rules 7章）: 眼鏡橋 → OSM node 5336401732「眼鏡橋」（いまの点は出どころ不明、約18m）／長崎水辺の森公園 → 公園の面の中心をやめ、node 3260114902「長崎水辺の森公園」
 *   ほかは確かめたうえでそのまま（出島＝way「出島和蘭商館跡」・博物館・大浦天主堂・十二番館・出島ワーフ＝OSM way の Nominatim の値、
 *   オランダ坂＝坂道の way（footway）の Nominatim の値、興福寺・崇福寺・浜町・美術館・稲佐山・26聖人・孔子廟＝OSM node）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-163-bd33014d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "bd33014d-d57d-49c2-b7a7-3c34456fa368";
const DAY1_ID = "65d5aa55-629d-4837-86a8-c9cce884c526";
const DAY2_ID = "dd32bb08-f965-4553-b5a2-8837e4c5f644";
const MEGANE = "bfede5d0-d5ab-43be-a54a-cd2a28ef5254";
const KOFUKUJI = "949c8043-b410-4263-ad0e-0811d5619bc4";
const SOFUKUJI = "018bfd09-c637-448f-b9b4-73832f9bc40e";
const DOJINDO = "952e4fd1-776e-49fa-b839-1c44c4d4d0df";
const HAMAMACHI = "065eb03f-8417-4e91-9398-f4c70c98b235";
const REKIBUN = "70332905-3e9b-4cd1-8f81-0e07e4b6b12c";
const BIJUTSU = "368d0e06-dae6-448d-b2e6-cb36063cfabe";
const INASA = "529782c7-7313-47da-8369-ef598ff7f9e2";
const SEIJIN = "6826c86d-45b7-44cc-a8b5-a6ce0f6792f8";
const DEJIMA = "a95826b1-67c7-4d97-8629-d9a8f18094e4";
const WHARF = "03d02299-9c1e-4c92-acd9-c2a149d2e0be";
const MIZUBE = "9aee74d7-c20a-403b-8453-12190913e8f4";
const OURA = "bdebe0e0-2629-45a0-b443-6e65cc0c491f";
const ORANDA = "aa36e14b-19d8-4261-b160-cb337a51b968";
const JUNIBAN = "8fdc21ff-8c77-48a9-8ac4-316f9f0186e8";
const KOSHIBYO = "367255f8-2283-4625-a160-4da6fdfb98d4";
const ORIG_DAY1 = [MEGANE, KOFUKUJI, SOFUKUJI, DOJINDO, HAMAMACHI, REKIBUN, BIJUTSU, INASA];
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
  [MEGANE]: [
    {
      from: "長崎駅前から路面電車で約4分の「めがね橋」電停から歩いて約3分、",
      to: "この旅は路面電車・バスと歩きでめぐります。JR長崎駅に11時ごろ着いたら、長崎駅前から路面電車で約4分の「めがね橋」電停から歩いて約4分、",
    },
  ],
  [KOFUKUJI]: [{ from: "眼鏡橋から歩いてすぐ、次に訪れるのは興福寺です。", to: "眼鏡橋から歩いて7分ほど、次に訪れるのは興福寺です。" }],
  [SOFUKUJI]: [
    { from: "興福寺から歩いて数分、次に訪れるのは崇福寺です。", to: "興福寺から歩いて12分ほど、次に訪れるのは崇福寺です。" },
    { from: "見学を終えたら、歩いて土神堂へ向かいましょう。", to: "見学を終えたら、歩いて浜町アーケードへ向かいましょう。" },
  ],
  [REKIBUN]: [
    { from: "浜町アーケードから歩いて10分ほど、", to: "浜町アーケードから歩いて18分ほど、" },
    { from: "出島そのものは2日目に訪れる予定なので、ここで予習をしておくのもおすすめです。", to: "出島そのものは2日目に訪れるので、ここで予習をしておきましょう。" },
  ],
  [BIJUTSU]: [{ from: "長崎歴史文化博物館から歩いて20分ほど、", to: "長崎歴史文化博物館から歩いて28分ほど、" }],
  [INASA]: [{ from: "長崎県美術館から長崎バスで「ロープウェイ前」まで約20分、", to: "長崎県美術館から新地中華街バス停まで歩いて約8分、長崎バスで「ロープウェイ前」まで約20分、" }],
  [SEIJIN]: [{ from: "2日目は、西坂(にしざか)の丘に立つ", to: "2日目は、宿からJR長崎駅へ向かい、駅から歩いて約8分。西坂(にしざか)の丘に立つ" }],
  [DEJIMA]: [{ from: "日本二十六聖人記念館から歩いて15分ほど、", to: "日本二十六聖人記念館から歩いて21分ほど、" }],
  [MIZUBE]: [{ from: "出島ワーフから歩いてすぐ、", to: "出島ワーフから歩いて7分ほど、" }],
  [OURA]: [{ from: "長崎水辺の森公園から歩いて10分ほど、", to: "長崎水辺の森公園から歩いて12分ほど、" }],
  [ORANDA]: [{ from: "大浦天主堂から歩いてすぐ、", to: "大浦天主堂から歩いて10分ほど、" }],
  [KOSHIBYO]: [{ from: "東山手十二番館から歩いて4分ほど、", to: "東山手十二番館から歩いて7分ほど、" }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: MEGANE, h: 11, m: 12, stay: 20, legs: [] },
  { id: KOFUKUJI, h: 11, m: 39, stay: 25, legs: [walk(7)] },
  { id: SOFUKUJI, h: 12, m: 16, stay: 30, legs: [walk(12)] },
  { id: HAMAMACHI, h: 12, m: 58, stay: 50, legs: [walk(12)] },
  { id: REKIBUN, h: 14, m: 6, stay: 45, legs: [walk(18)] },
  { id: BIJUTSU, h: 15, m: 19, stay: 30, legs: [walk(28)] },
  { id: INASA, h: 16, m: 23, stay: 30, legs: [walk(8), { mode: "bus", min: 20, line: "長崎バス(新地中華街→ロープウェイ前)" }, { mode: "other", min: 6, line: "長崎ロープウェイ" }] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SEIJIN, h: 9, m: 0, stay: 70, legs: [] },
  { id: DEJIMA, h: 10, m: 31, stay: 80, legs: [walk(21)] },
  { id: WHARF, h: 11, m: 58, stay: 55, legs: [walk(7)] },
  { id: MIZUBE, h: 13, m: 0, stay: 50, legs: [walk(7)] },
  { id: OURA, h: 14, m: 2, stay: 55, legs: [walk(12)] },
  { id: ORANDA, h: 15, m: 7, stay: 45, legs: [walk(10)] },
  { id: JUNIBAN, h: 15, m: 53, stay: 20, legs: [walk(1)] },
  { id: KOSHIBYO, h: 16, m: 20, stay: 35, legs: [walk(7)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: MEGANE, from: [32.747165, 129.880102], to: [32.747293, 129.879989] },
  { id: MIZUBE, from: [32.740795, 129.868831], to: [32.740194, 129.869304] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== ORIG_DAY1.join()) throw new Error("1日目の構成が想定と違います");
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
  const dj = d1.spots.find((s) => s.id === DOJINDO)!;
  console.log(`外す: ${dj.name}（写真 ${dj.photos.length} 枚）`);
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
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx, remove: [DOJINDO] });
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
