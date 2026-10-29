/**
 * 初日・最終日の見直し #164 3faebe45「筑波山の絶景をロープウェイと登山道で、山麓の宿に泊まる1泊2日プラン」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は「車でめぐります」の行程なので、初日からレンタカーにする（企画運営 10/30 の案B）。2日目の車の時間も直す
 * いまの初日（8か所）: 筑波山神社 9:00 → 梅林 → シャトルバス → ロープウェイ → 女体山 → 御幸ヶ原（昼食）→ 男体山 → 弁慶七戻り → つつじヶ丘 16:30〜17:00
 * 直した初日（7か所）: つくば駅に10時30分ごろ（10:30 着で11:45 までに1か所目に着けるので、遠い場所の例外は使わない。法務 10/30）→ 駅の近くでレンタカー（手続きに15分ほど）→
 *   車で約35分（OSRM 31分＋駐車）→ 筑波山神社 11:20〜11:50 → 車33分（OSRM 28分＋駐車）でつつじヶ丘に車を置く → ロープウェイ 12:23 → 女体山 12:43 →
 *   御幸ヶ原（昼食 13:13〜14:13）→ 男体山 14:28 → 弁慶七戻り 15:38 → つつじヶ丘 16:38〜16:53（車に戻る）
 *   筑波山梅林を外す（入りきらないため。タイトル・説明文になし）
 *   登山道の区間はもとの値のまま（女体山駅→女体山 10、女体山→御幸ヶ原 15、御幸ヶ原→男体山 15、男体山→弁慶七戻り 40、弁慶七戻り→つつじヶ丘 45）。
 *     公式の区間時間（茨城県の筑波山の地図 PDF）は読み取れず、登山情報の目安（おたつ石コース下り35分＝timesclub.jp ほか）より長めの値
 *   つつじヶ丘への道筋を直す: もとは「白雲橋コースをさらに下って」。白雲橋コースとおたつ石コースは弁慶茶屋跡で分かれる（yamap・hinata の記録）ので、
 *     「白雲橋コースを弁慶茶屋跡まで下り、おたつ石コースに入って」に
 *   滞在はどれも、もとより短い（神社 60→30、ロープウェイ 20→10、女体山 30→15、御幸ヶ原 95→60、男体山 30、弁慶 15、つつじヶ丘 30→15）
 *   季節から「冬」を外す（日の入りの前後に山道を下りきる形になり、冬は道が凍ることもあるため。企画運営 10/30）
 * 2日目: 車（OSRM＋駐車5分）平沢→地図と測量の科学館 17→22（15→22）、エキスポ→地質標本館 16→21（8→21）、地質標本館→宇宙センター 13→18（5→18）。
 *   エキスポセンター 120→100分、宇宙センター 90→77分で合わせ、終わり16:55は今と同じ。1か所目に宿からの行き方（神社→北条 OSRM 14分＋駐車）を足し、
 *   「2日目は、ここから先、車でめぐります。」を外す。最後に帰りの一文（つくば駅の近くでレンタカーを返す）
 * 座標（itinerary-rules 7章）: ロープウェイ → いまはロープウェイの線（空中）の中心。下の駅の node 389746306（aerialway=station「つつじヶ丘」。法務 10/30）／
 *   女体山 → いまは地理院の地名「女体山御本殿」の点だが、OSM の way 577718534「筑波山神社女体山御本殿」と約330m離れている。OSM を使う／
 *   つつじヶ丘 → いまの点は出どころ不明。メモの「レストラン」に合う way 92831859「つつじヶ丘レストハウス」／地図と測量の科学館 → node 335886120（約95m）
 *   そのまま: 筑波山神社＝way の Nominatim 値、御幸ヶ原＝小さな広場の way の Nominatim 値、男体山・弁慶七戻り・地質標本館＝node、平沢官衙遺跡・エキスポ＝way の Nominatim 値、
 *   北条＝同じ名前のバス停（町並みで、ほかに名前の点がない。7章(b)）、
 *   宇宙センター → JAXA の敷地の中心をやめ、展示館のとなりの way 739510239「ロケット広場」の Nominatim 値（メモがロケット・展示館のこと。法務 10/30）
 * タイトル・説明文は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-164-3faebe45.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";
const DAY1_ID = "2c353133-2cfb-4d01-9819-1df797423598";
const JINJA = "e6ce686f-9eb7-439f-b34a-a77a878b3924";
const BAIRIN = "856c2d91-3438-4925-a203-3d4de6f22940";
const ROPEWAY = "7061114b-1507-46d2-82fb-c5c278a4bbd1";
const NYOTAI = "c43ddf8b-370e-44c2-9f69-818d2d854487";
const MIYUKI = "811740b5-14fc-4b92-bf7a-7c8878f3ac1c";
const NANTAI = "ab761005-3825-4e9f-81ee-2099dae00ea9";
const BENKEI = "e47191b0-0947-4a2d-9bc7-871beab65db1";
const TSUTSUJI = "9daef40b-6582-40de-a1e0-39b4992f7290";
const HOJO = "dde55b91-641d-40bb-9f70-29ae21222a3f";
const HIRASAWA = "22ff5d9a-0414-4447-8cb4-1093bc1ea314";
const CHIZU = "8e1d83af-8cec-4cb4-ad82-f0fa50acbdcc";
const EXPO = "14e96d01-98a5-4e72-a639-cc781ee481ee";
const CHISHITSU = "75f8e899-be40-4908-8218-7f94ffc68510";
const UCHU = "6d32fc03-4a98-4dae-9eab-4b35c34e3324";
const ORIG_DAY1 = [JINJA, BAIRIN, ROPEWAY, NYOTAI, MIYUKI, NANTAI, BENKEI, TSUTSUJI];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [JINJA]: [
    {
      from: "筑波山神社は、『万葉集』にも",
      to: "この旅は車でめぐります。つくばエクスプレスのつくば駅に10時30分ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約35分。筑波山神社は、『万葉集』にも",
    },
  ],
  [ROPEWAY]: [{ from: "筑波山梅林からは、筑波山シャトルバスでおよそ15分、つつじヶ丘へ向かいます。", to: "筑波山神社から車で約33分、つつじヶ丘の駐車場に車を置きます。" }],
  [NANTAI]: [
    {
      from: "足元に気をつけながら歩きましょう。静かに、敬意をもってお参りしましょう。",
      to: "足元に気をつけながら歩きましょう。静かに、敬意をもってお参りしましょう。秋は日が短いので、明るいうちに下山しましょう。時間が押したときは、女体山のロープウェイの駅から、つつじヶ丘へ下りることもできます。運行の時間は公式の案内で確かめましょう。",
    },
  ],
  [TSUTSUJI]: [
    {
      from: "弁慶七戻りからは、白雲橋コースをさらに下って、徒歩およそ45分です。",
      to: "弁慶七戻りからは、白雲橋コースを弁慶茶屋跡まで下り、おたつ石コースに入って、つつじヶ丘まで徒歩およそ45分です。",
    },
    { from: "つつじヶ丘からは、今夜宿泊する山麓の宿へ向かいましょう。", to: "車に戻り、この夜は、筑波山神社のあたりの宿に泊まりましょう。" },
  ],
  [HOJO]: [
    { from: "北条は、江戸時代に", to: "2日目は、宿から車で約20分。北条は、江戸時代に" },
    { from: " 2日目は、ここから先、車でめぐります。", to: "" },
  ],
  [CHIZU]: [{ from: "平沢官衙遺跡からは車で15分ほどです。", to: "平沢官衙遺跡からは車で22分ほどです。" }],
  [CHISHITSU]: [{ from: "つくばエキスポセンターからは車で8分ほどです。", to: "つくばエキスポセンターからは車で21分ほどです。" }],
  [UCHU]: [
    { from: "地質標本館からは車で5分ほどです。", to: "地質標本館からは車で18分ほどです。" },
    { from: "見学を終えたら、車でつくば駅・首都圏方面へ戻りましょう。", to: "帰りは、つくば駅の近くでレンタカーを返しましょう。" },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: JINJA, h: 11, m: 20, stay: 30, legs: [] },
  { id: ROPEWAY, h: 12, m: 23, stay: 10, legs: [car(33)] },
  { id: NYOTAI, h: 12, m: 43, stay: 15, legs: [walk(10)] },
  { id: MIYUKI, h: 13, m: 13, stay: 60, legs: [walk(15)] },
  { id: NANTAI, h: 14, m: 28, stay: 30, legs: [walk(15)] },
  { id: BENKEI, h: 15, m: 38, stay: 15, legs: [walk(40)] },
  { id: TSUTSUJI, h: 16, m: 38, stay: 15, legs: [walk(45)] },
];
const DAY2_TIMES: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: CHIZU, h: 11, m: 27, stay: 45, legs: [car(22)] },
  { id: EXPO, h: 12, m: 19, stay: 100, legs: [car(7)] },
  { id: CHISHITSU, h: 14, m: 20, stay: 60, legs: [car(21)] },
  { id: UCHU, h: 15, m: 38, stay: 77, legs: [car(18)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: ROPEWAY, from: [36.222366, 140.112651], to: [36.219807, 140.118879] },
  { id: NYOTAI, from: [36.228507, 140.106497], to: [36.225472, 140.106641] },
  { id: TSUTSUJI, from: [36.219807, 140.118879], to: [36.219391, 140.11938] },
  { id: CHIZU, from: [36.104961, 140.085052], to: [36.104107, 140.085535] },
  { id: UCHU, from: [36.068126, 140.126778], to: [36.068118, 140.129388] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== ORIG_DAY1.join()) throw new Error("1日目の構成が想定と違います");
  if (d2.spots.map((s) => s.id).join() !== [HOJO, HIRASAWA, CHIZU, EXPO, CHISHITSU, UCHU].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const bai = d1.spots.find((s) => s.id === BAIRIN)!;
  console.log(`外す: ${bai.name}（写真 ${bai.photos.length} 枚）`);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: typeof PLAN, spots: typeof d1.spots, startEnd = -1) => {
    console.log(`\n${label}`);
    let prevEnd = startEnd;
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
  const hir = d2.spots.find((s) => s.id === HIRASAWA)!;
  if (hmOf(hir.visitTime) !== "10:05" || hir.stayDurationMin !== 60) throw new Error("2日目の平沢官衙遺跡が想定と違います");
  console.log("\n2日目: 北条 9:00〜10:00 → 車5 → 平沢官衙遺跡 10:05〜11:05（もとのまま）");
  for (const e of MEMO_EDITS[HOJO]) console.log(`  北条 → ${e.to || "（消す）" + e.from}`);
  show("2日目（平沢のあと）", DAY2_TIMES, d2.spots, 11 * 60 + 5);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (it.seasons.join() !== "spring,summer,autumn,winter") throw new Error("季節が想定と違います");
  console.log("季節: spring,summer,autumn,winter → spring,summer,autumn");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: ["spring", "summer", "autumn"] } });
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [BAIRIN] });
      await tx.spot.update({ where: { id: HOJO }, data: { memo: apply(HOJO, MEMO_EDITS[HOJO]) } });
      for (const p of DAY2_TIMES) await tx.spot.update({ where: { id: p.id }, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
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
