/**
 * 初日・最終日の見直し #167 4d1139e6「名古屋港水族館と東山動植物園、家族で楽しむ名古屋1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は歩きの時間が道のりと合っていなかったので直す（終わりは今と同じ 16:30）。昼食の文を時刻に合わせる
 * いまの初日（4か所）: 名古屋港水族館（昼食）9:30 → 南極観測船ふじ → 海洋博物館 → 電車55分 → リニア・鉄道館 14:40〜16:40
 * 直した初日（4か所のまま）: JR名古屋駅に11時ごろ → JRで金山駅、地下鉄名港線に乗り換えて名古屋港駅（あわせて約25分）→ 歩いて約5分 →
 *   水族館 11:30〜13:30（館内で昼食）→ ふじ 13:35 → 海洋博物館 14:10 → 電車55分（もとのまま）→ リニア・鉄道館 15:35〜16:35（入館は17:00まで）
 *   歩き（foot）: 水族館→ふじ 331m・5分（すぐ→5）。滞在はどれも、もとより短い（水族館 150→120、ふじ 45→30、博物館 45→30、リニア 120→60）
 * 2日目: 歩き（foot）動物園（正門）→植物園門 1,101m・15分（10→15）、植物園→スカイタワー 1,370m・19分（10→19）、科学館→大須観音 831m・12分（15→12）。
 *   動物園 150→139分で合わせ、大須観音 15:55〜16:30 は今と同じ。昼食の文は、動物園（9:00〜11:20）では早すぎるので、植物園（11:34〜）の書き出しへ移す。
 *   動物園のスポット名から「・昼食」を外す
 * 座標（itinerary-rules 7章）: 南極観測船ふじ → 海洋博物館と同じ点（OSM の node「名古屋海洋博物館・南極観測船ふじ」）だったので、ふじのそばの展示の node 13949151801「Snow Tractor」（雪上車）に。
 *   博物館は施設の node のまま／東山動植物園（動物園）は今の値のまま（way 352739621「東山動植物園正門」の Nominatim 値。法務 10/30）／ふじの雪上車の点は、ふじだけの点が OSM にないための企画運営の例外（10/30）／
 *   東山植物園 → way 771524794「東山動植物園植物園門」の Nominatim 値／名古屋市科学館 → いまは自転車貸出の node「科学館」。way 942000435「名古屋市科学館」の Nominatim 値／
 *   大須観音 → way 923032216 の Nominatim 値（約6m）。ほかは Nominatim と同じ値（水族館・スカイタワー・リニア・鉄道館）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-167-4d1139e6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4d1139e6-04e2-4f29-af49-e411ec4a06f3";
const DAY1_ID = "63c591bb-74b5-4925-bce8-149c3c65de8a";
const DAY2_ID = "96f0a3ce-308c-4419-9058-4f1272d48fd0";
const AQUARIUM = "22b0e3f4-ed1e-4813-9905-02a4294fd614";
const FUJI = "20f4221f-97e2-4594-b66f-963c33d6e3af";
const MUSEUM = "35b3e4e6-79dd-4b6d-a574-64eb0a283d6b";
const SCMAGLEV = "f91c51ea-d3b2-46fb-82d7-2892895ff7d0";
const ZOO = "de175a60-d7cb-470c-b5c3-e02f2ed6996a";
const BOTANICAL = "b0505c79-d131-4ff2-a46d-d86742b388cc";
const SKYTOWER = "e7351a58-85f5-4be7-99e4-f354ea12f794";
const SCIENCE = "d4914a90-6fd5-4332-98d1-cc18ae993021";
const OSU = "d359a8e4-d496-4b0c-9113-8c497f4320fa";
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

const ZOO_NAME_FROM = "東山動植物園（動物園・昼食）";
const ZOO_NAME_TO = "東山動植物園（動物園）";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [AQUARIUM]: [
    {
      from: "日本最大級ともいわれる水族館で、",
      to: "この旅は電車と歩きでめぐります。JR名古屋駅に11時ごろ着いたら、JRで金山駅へ、地下鉄名港線に乗り換えて名古屋港駅へ（あわせて約25分）、歩いて約5分。日本最大級ともいわれる水族館で、",
    },
  ],
  [FUJI]: [{ from: "水族館から歩いてすぐ。", to: "水族館から歩いて約5分。" }],
  [ZOO]: [{ from: "園内の食事処で昼食にしましょう。", to: "" }],
  [BOTANICAL]: [{ from: "動物園から歩いて約10分。", to: "動物園から歩いて約15分。お昼は、動植物園の中の食事処でとりましょう。" }],
  [SKYTOWER]: [{ from: "植物園から歩いて約10分。", to: "植物園から歩いて約19分。" }],
  [OSU]: [{ from: "科学館から南へ歩いて、大須観音へ。", to: "科学館から南へ歩いて約12分、大須観音へ。" }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: AQUARIUM, h: 11, m: 30, stay: 120, legs: [] },
  { id: FUJI, h: 13, m: 35, stay: 30, legs: [walk(5)] },
  { id: MUSEUM, h: 14, m: 10, stay: 30, legs: [walk(5)] },
  { id: SCMAGLEV, h: 15, m: 35, stay: 60, legs: [] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: ZOO, h: 9, m: 0, stay: 139, legs: [] },
  { id: BOTANICAL, h: 11, m: 34, stay: 60, legs: [walk(15)] },
  { id: SKYTOWER, h: 12, m: 53, stay: 40, legs: [walk(19)] },
  { id: SCIENCE, h: 14, m: 13, stay: 90, legs: [] },
  { id: OSU, h: 15, m: 55, stay: 35, legs: [walk(12)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: FUJI, from: [35.090664, 136.880528], to: [35.090693, 136.881005] },
  { id: BOTANICAL, from: [35.154258, 136.981239], to: [35.154212, 136.981231] },
  { id: SCIENCE, from: [35.165242, 136.898599], to: [35.164893, 136.899701] },
  { id: OSU, from: [35.159701, 136.899248], to: [35.159666, 136.89931] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  if (all.find((s) => s.id === ZOO)?.name !== ZOO_NAME_FROM) throw new Error("動物園のスポット名が想定と違います");
  // もとの移動をそのまま使う区間（リニア・鉄道館の電車55分、科学館の地下鉄40分）
  const keep = (id: string) => all.find((s) => s.id === id)!.transitLegs.map((l) => ({ mode: l.transitMode as Leg["mode"], min: l.transitDurationMin ?? 0, line: l.transitLine ?? undefined }));
  PLAN[3].legs = keep(SCMAGLEV);
  DAY2[3].legs = keep(SCIENCE);
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
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
  console.log(`\nスポット名: ${ZOO_NAME_FROM} → ${ZOO_NAME_TO}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: typeof PLAN) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}), ...(p.id === ZOO ? { name: ZOO_NAME_TO } : {}) } }));
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
