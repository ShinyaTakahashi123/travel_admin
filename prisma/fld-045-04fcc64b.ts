/**
 * 初日・最終日の見直し #45 04fcc64b「GALA湯沢と岩原でスキー、越後湯沢温泉に泊まる雪国の1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a）
 * 1泊2日・新幹線とゴンドラ（2日目は車）。初日を11時ごろからにする。2日目はもとから 16:42 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 直した初日（3か所）: ガーラ湯沢駅に11時ごろ（駅がスキーセンター）→ カワバンガ 11:00〜11:30 → ゴンドラ7（もとのまま）→ ゲレンデ 11:37〜15:07（昼食はスキーセンターの食堂、もとの文）→
 *   ゴンドラ7＋歩3 → SPAガーラの湯 15:17〜16:32
 *   ゆきあそびパークは外す（企画運営 10/30）: 公式の案内ではゴンドラを上がった中央エリアにあり（もとのメモの「山麓に戻り」は違う）、OSM にパークそのものの点がなく、
 *   もとの点はカワバンガと同じ駅の点だったため。ゲレンデのメモで紹介する（JR東日本 2018/10/31 の発表・GALA湯沢の公式ニュース）。説明文の「雪遊び」はパークの名前ではないのでそのまま
 *   滞在はどれも、もとより短い（カワバンガ 35→30、ゲレンデ 250→210、SPA 90→75）
 * 2日目: 越後湯沢駅→岩原スキー場 車10 → 18（OSRM 12.9分＋駐車、もとは OSRM より短い）、岩原→雪国館 車9 → 19（OSRM 13.1分＋駐車）、
 *   雪国館→越後湯沢駅のまわり 歩7 → 車7（OSRM 1.5分＋駐車。駅でレンタカーを返すので車）。終わりを今より遅くしないため、岩原スキー場 330→320（雪国館 14:39 からはもとのまま、足湯 16:22〜16:42）
 *   帰りの一文に越後湯沢駅まで歩いて約1分
 * 座標: どれも OSM の値でそのまま（ゲレンデは山頂の node「高津倉山」、メモの山頂）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-045-04fcc64b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "04fcc64b-72d2-4b60-8484-ca892ff27f12";
const DAY1_ID = "cc8c5a88-cddf-4370-8845-ab5ec463618e";
const DAY2_ID = "cb0dbe03-1289-4449-b645-16aa9d8e8af7";
const KAWABANGA = "3c3f8f2d-4790-453a-8ce3-466e9cb0817e";
const GERENDE = "745e8513-e48e-4d67-955a-1ced80e604d2";
const YUKIASOBI = "074dc552-2695-4bd3-950f-64ae4bd79975";
const SPA = "50a33052-d758-47e2-99fa-798b45a36e30";
const IWAPPARA = "7a4b9875-1fb5-428a-a467-a8cc8d65ba11";
const YUKIGUNI = "bfc5e445-f7c3-4060-bb91-1e2bd088fc4a";
const EKIMAWARI = "39a3aa31-286b-4d6a-939e-105e34970562";
const ASHIYU = "702c4cd0-2b47-4767-9e03-d57322709ad0";
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
  [KAWABANGA]: [{ from: "東京駅から上越新幹線でおよそ71分、ガーラ湯沢駅に着きます。", to: "東京駅から上越新幹線でおよそ71分、11時ごろガーラ湯沢駅に着きます。" }],
  [GERENDE]: [
    {
      from: "この後は、ゴンドラで山麓へ戻り、ゆきあそびパークへ向かいましょう。",
      to: "ゴンドラを上がった中央エリアには、ソリや雪遊びが楽しめる「ゆきあそびパーク」もあります。この後は、ゴンドラで山麓へ戻り、SPAガーラの湯へ向かいましょう。",
    },
  ],
  [SPA]: [{ from: "ゆきあそびパークから歩いてすぐ、SPAガーラの湯に着きます。", to: "ゴンドラで山麓へ戻り、駅から歩いてすぐ（約3分）、SPAガーラの湯に着きます。" }],
  [IWAPPARA]: [
    { from: "レンタカーを借りて、車でおよそ10分、岩原スキー場に着きます。", to: "レンタカーを借りて（手続きに15分ほど）、車でおよそ18分、岩原スキー場に着きます。" },
    { from: "この後は、車でおよそ9分、雪国館へ向かいましょう。", to: "この後は、車でおよそ19分、雪国館へ向かいましょう。" },
  ],
  [YUKIGUNI]: [
    { from: "岩原スキー場から車でおよそ9分、", to: "岩原スキー場から車でおよそ19分、" },
    { from: "この後は、歩いておよそ7分、越後湯沢駅のまわりへ向かいましょう。", to: "この後は、車でおよそ7分、越後湯沢駅のまわりへ向かいましょう。" },
  ],
  [EKIMAWARI]: [{ from: "雪国館から歩いておよそ7分、", to: "雪国館から車でおよそ7分、" }],
  [ASHIYU]: [{ from: "見学を終えたら、歩いて越後湯沢駅へ向かい、", to: "見学を終えたら、歩いて約1分の越後湯沢駅へ向かい、" }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KAWABANGA, h: 11, m: 0, stay: 30, legs: [] },
  { id: GERENDE, h: 11, m: 37, stay: 210, legs: [] },
  { id: SPA, h: 15, m: 17, stay: 75, legs: [] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: IWAPPARA, h: 9, m: 0, stay: 320, legs: [] },
  { id: YUKIGUNI, h: 14, m: 39, stay: 50, legs: [car(19)] },
  { id: EKIMAWARI, h: 15, m: 36, stay: 45, legs: [car(7)] },
  { id: ASHIYU, h: 16, m: 22, stay: 20, legs: [walk(1)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KAWABANGA, GERENDE, YUKIASOBI, SPA].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  // ゴンドラ（other 7分）はもとのまま
  const keep = (id: string) => all.find((s) => s.id === id)!.transitLegs.map((l) => ({ mode: l.transitMode as Leg["mode"], min: l.transitDurationMin ?? 0, line: l.transitLine ?? undefined }));
  PLAN[1].legs = keep(GERENDE);
  PLAN[2].legs = [...keep(YUKIASOBI), walk(3)];
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
  console.log("\n外す: ゆきあそびパーク（1日目。点がなく、ゲレンデのメモで紹介）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: typeof PLAN) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx, remove: [YUKIASOBI] });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
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
