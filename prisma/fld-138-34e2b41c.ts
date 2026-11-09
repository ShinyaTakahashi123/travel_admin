/**
 * 初日・最終日の見直し #138 34e2b41c「温泉津温泉、世界遺産の湯治場を楽しむ石見銀山1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（8か所）: 鞆ケ浦 9:00 → 琴ヶ浜 → 仁摩サンドミュージアム → 沖泊 → 温泉津の町並み（昼食）→ 龍御前神社 → 恵珖寺 → 薬師湯 15:34〜16:34
 * 直した初日（7か所）: JR大田市駅に11時ごろ → 駅の近くでレンタカー（手続き約15分）、車で約15分 → 鞆ケ浦 11:30 → 琴ヶ浜 → 沖泊 → 温泉津の町並み（昼食 13:24〜）→ 龍御前神社 → 恵珖寺 → 薬師湯 15:45〜16:45
 *   入口: 大田市駅の近くにレンタカーの店がある（駅探・ekiten の大田市駅周辺の一覧。店の名前は書かない）。大田市駅→鞆ケ浦 約17.8km（OSRM、約15分）。手続きは #68 と同じく約15分（企画運営・法務 10/29。手続きと運転を分けて書く）
 *   仁摩サンドミュージアムを外す（タイトル・説明文に出てこない。入れると昼食が13:30を過ぎる。表紙ではない写真が1枚あり、スポットといっしょに外れる）
 *   琴ヶ浜→沖泊 約8.7km（OSRM 約11分）→ 車12分。沖泊→温泉津 はもとの8分のまま
 *   移動の時間は延ばさず、滞在を短くした（琴ヶ浜 35→30分、沖泊 40→28分、温泉津の町並み 60→56分。鞆ケ浦30分はもとのまま）。入口 11時ごろ＋手続き15分＋運転15分で鞆ケ浦 11:30
 * 座標（itinerary-rules 7章）: 琴ヶ浜 → OSM way 719129435「琴ヶ浜」（natural=beach。いまの点は約250m離れている）／恵珖寺 → way 669255593「惠光寺」（building=temple）
 *   鞆ケ浦は地理院の地名「鞆ヶ浦」の点と同じ。温泉津の町並みは OSM「温泉津観光案内所 ゆう・ゆう館」node 6476789780 と同じ。沖泊は OSM・地理院に名前つきの点がないので、約220mの OSM way 669451350「櫛島キャンプ場」（tourism=camp_site）の点にする（7章(a)・企画運営 10/29 案A）。
 *   島へは車の通れる橋（OSM way 669444452 bridge=yes highway=service）でつながり、OSRM の車の道案内もこの点の4m先まで届く（琴ヶ浜から9.6km、温泉津まで2.1km）
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-138-34e2b41c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "34e2b41c-5c39-43ef-917d-aa859b7a4f16";
const DAY1_ID = "3224a95f-81c0-4e91-b3c5-d7f41e37e815";
const TOMO = "28f0150c-2154-4526-80c7-bd77083f52bb";
const KOTO = "b454474e-1678-4c74-a629-ea19b5b72196";
const SAND = "0a451277-d609-4358-951f-893e05290c3d";
const OKI = "0aa62935-01cf-442c-8512-780944cfaee6";
const YUNOTSU = "00218b58-665a-41de-9d7d-78256d5e2d5b";
const TATSU = "134578b3-47bb-40f3-b46e-dac6cd25fd84";
const EKO = "5bfac4bd-ba87-4d09-8fcd-1645f0e6b961";
const YAKUSHI = "3977f9c4-3477-44a8-91a8-205f872726f0";
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
  [TOMO]: [
    {
      from: "鞆ケ浦は、石見銀山の開発が始まったばかりの",
      to: "この旅は車でめぐります。JR大田市駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約15分。鞆ケ浦は、石見銀山の開発が始まったばかりの",
    },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: KOTO, from: [35.131541, 132.386797], to: [35.131539, 132.389592] },
  { id: EKO, from: [35.095808, 132.348829], to: [35.095797, 132.348992] },
  { id: OKI, from: [35.100775, 132.343592], to: [35.101762, 132.340624] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: TOMO, h: 11, m: 30, stay: 30, legs: [] },
  { id: KOTO, h: 12, m: 6, stay: 30, legs: [car(6)] },
  { id: OKI, h: 12, m: 48, stay: 28, legs: [car(12)] },
  { id: YUNOTSU, h: 13, m: 24, stay: 56, legs: [car(8)] },
  { id: TATSU, h: 14, m: 25, stay: 30, legs: [walk(5)] },
  { id: EKO, h: 15, m: 0, stay: 40, legs: [walk(5)] },
  { id: YAKUSHI, h: 15, m: 45, stay: 60, legs: [walk(5)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [TOMO, KOTO, SAND, OKI, YUNOTSU, TATSU, EKO, YAKUSHI].join()) throw new Error("1日目の構成が想定と違います");
  const sand = d1.spots.find((x) => x.id === SAND)!;
  for (const ph of sand.photos) {
    if (ph.url === it.thumbnailUrl) throw new Error("外すスポットの写真が表紙です");
    console.log(`外すスポットの写真（スポットといっしょに外れる）: ${ph.id} ${ph.url.slice(0, 80)}…`);
  }
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  const allSpots = it.days.flatMap((d) => d.spots);
  for (const c of COORDS) {
    const s = allSpots.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log(`\n外すスポット: ${SAND}（仁摩サンドミュージアム）`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [SAND] });
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
