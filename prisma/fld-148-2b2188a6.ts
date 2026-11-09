/**
 * 初日・最終日の見直し #148 2b2188a6「成田山の門前町と水郷佐原、うなぎと朝の御護摩の1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま。2日目の朝の御護摩は、2日目以降の「朝早いことが見どころ」の例外のまま）
 * いまの初日（7か所）: 宗吾霊堂 9:10 → 薬師堂 → 成田観光館 → 表参道（昼食）→ 新勝寺 → 書道美術館 → 成田山公園 15:20〜16:30
 * 直した初日（7か所のまま）: 京成本線の宗吾参道駅に11時ごろ → 歩いて約13分 → 宗吾霊堂 11:13 → 京成で京成成田 → 薬師堂 12:25 → 観光館 → 表参道（昼食 13:03〜）→
 *   新勝寺 → 書道美術館 15:13〜15:43 → 成田山公園 15:45〜16:30
 *   どこも外さない（説明文に全部出てくる）
 *   歩き（道のり。routing.openstreetmap.de の foot）: 宗吾参道駅↔宗吾霊堂 980m・13分、京成成田駅→薬師堂 749m・10分、薬師堂→観光館 165m・2分、観光館→表参道 69m・1分、
 *     表参道→総門 139m・2分、総門→書道美術館 628m・8分、書道美術館→龍智の池 127m・2分
 *   宗吾霊堂→薬師堂: 歩き13分＋京成本線（宗吾参道→京成成田）9分＋歩き10分＝32分（もとは25分）
 *   成田山書道美術館は 9:00〜16:00・最終入館15:30、月曜休み（museum.or.jp/museum/2093 ほか）→ 15:13 に着く
 *   滞在はどれも、もとより短い（宗吾霊堂 60→40分、薬師堂 20→15分、観光館 35→20分、表参道 70→60分、新勝寺 75→60分、書道美術館 55→30分、公園 70→45分）
 * 座標（itinerary-rules 7章）: 宗吾霊堂はそのまま（OSM node 5755329622「Tōshō-ji Sogoreido」と同じ点。法務 10/30）／
 *   成田山新勝寺 → メモの「表参道を上りきって」の入口 way 149192592「総門」（いまは境内の landuse の中心）／
 *   成田山公園 → メモにある way 229786306「龍智の池」（いまは公園の中心）。
 *   ほかは OSM の点と同じ（観光館 node 9349991034、2日目 大本堂 way 149192547・中橋 way 1037960134・奥宮 way 1266670317 など）。表参道は通りの上の点のまま
 * 2日目（企画運営の指示「誤りは内容の誤りとして直す」）: 大本堂→伊能忠敬記念館の45分は、大本堂→JR成田駅 1,146m・約15分＋JR成田線 約33分＋佐原駅→記念館 860m・約12分で約1時間なので直す。
 *   記念館 10:50（滞在40→35分）、旧宅 11:30（20→15分）、町並み 11:50〜13:00（75→70分）。山車会館 13:05 から後ろは今のまま（終わりは変わらない）
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-148-2b2188a6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2b2188a6-1fba-436c-9f73-91658f0a6386";
const DAY1_ID = "369118a1-f766-4d75-b88b-af1dfe223ab4";
const SOGO = "a3667185-fd95-4ff6-b9dd-ea68ebc32656";
const YAKUSHIDO = "b03d6ada-ade4-46a6-99df-d0974390febf";
const KANKOKAN = "d010439f-0ec9-4337-8079-2154f30d55ea";
const OMOTESANDO = "1f90ccd8-a728-4821-b7c4-97636253dc42";
const SHINSHOJI = "ee9a9213-9b4d-4e9c-959d-a465259ff367";
const SHODO = "4cbea8d6-ae7e-49df-938b-ed6e1451091a";
const PARK = "879b63b6-1229-465d-9570-e3799dc14c8b";
const INO_MUSEUM = "6c3c2fd8-c94c-4ad9-8ffb-40b59da651d2";
const INO_HOUSE = "993d7b13-2ce7-4c90-a501-5ac1035f441c";
const MACHINAMI = "d7c12005-b393-4dbc-bcae-434847a05ed5";
const INO_FROM = "成田駅からJR成田線で佐原駅へ。駅から歩いて約15分の伊能忠敬記念館へ。";
const INO_TO =
  "大本堂から成田駅へ歩き（約15分）、JR成田線で佐原駅へ。駅から歩いて約12分の伊能忠敬記念館へ（あわせて約1時間。列車は本数が少ないので、時刻を前もって確かめましょう）。";
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
  [SOGO]: [{ from: "京成本線の宗吾参道駅から歩いて約15分の宗吾霊堂へ。", to: "京成本線の宗吾参道駅に11時ごろ着いたら、歩いて約13分の宗吾霊堂へ。" }],
  [YAKUSHIDO]: [
    {
      from: "宗吾参道駅から京成本線で京成成田駅へ出て、表参道を上り、成田山薬師堂へ。",
      to: "宗吾霊堂から宗吾参道駅へ歩いて戻り、京成本線で京成成田駅へ出て、表参道を上り、成田山薬師堂へ（あわせて約30分）。",
    },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: SHINSHOJI, from: [35.786331, 140.317224], to: [35.784642, 140.318105] },
  { id: PARK, from: [35.786567, 140.320777], to: [35.786781, 140.322361] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SOGO, h: 11, m: 13, stay: 40, legs: [] },
  { id: YAKUSHIDO, h: 12, m: 25, stay: 15, legs: [walk(13), train(9, "京成本線（宗吾参道→京成成田）"), walk(10)] },
  { id: KANKOKAN, h: 12, m: 42, stay: 20, legs: [walk(2)] },
  { id: OMOTESANDO, h: 13, m: 3, stay: 60, legs: [walk(1)] },
  { id: SHINSHOJI, h: 14, m: 5, stay: 60, legs: [walk(2)] },
  { id: SHODO, h: 15, m: 13, stay: 30, legs: [walk(8)] },
  { id: PARK, h: 15, m: 45, stay: 45, legs: [walk(2)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
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
  const d2 = it.days[1];
  const ino = d2.spots.find((x) => x.id === INO_MUSEUM);
  const kyutaku = d2.spots.find((x) => x.id === INO_HOUSE);
  const machinami = d2.spots.find((x) => x.id === MACHINAMI);
  if (!ino || !kyutaku || !machinami || d2.spots[1].id !== INO_MUSEUM || d2.spots[2].id !== INO_HOUSE || d2.spots[3].id !== MACHINAMI) throw new Error("2日目の構成が想定と違います");
  const inoMemo = ino.memo ?? "";
  if (inoMemo.split(INO_FROM).length !== 2) throw new Error("記念館の置き換え元が見つかりません");
  const inoNext = inoMemo.replace(INO_FROM, INO_TO);
  console.log(`\n2日目（移動の誤りを直す。山車会館から後ろは変えない）`);
  console.log(`10:50-11:25 walk15+train33+walk12 ${ino.name}（もと 10:35 滞在${ino.stayDurationMin}分）\n  本文: ${inoNext}`);
  console.log(`11:30-11:45 walk5 ${kyutaku.name}（もと 11:20 滞在${kyutaku.stayDurationMin}分）`);
  console.log(`11:50-13:00 walk5 ${machinami.name}（もと 11:45 滞在${machinami.stayDurationMin}分）→ 山車会館 13:05 はもとのまま`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      await tx.spot.update({ where: { id: INO_MUSEUM }, data: { ...timeLegs(10, 50, 35, [walk(15), train(33, "JR成田線（成田→佐原）"), walk(12)]), memo: inoNext } });
      await tx.spot.update({ where: { id: INO_HOUSE }, data: { visitTime: t(11, 30), stayDurationMin: 15 } });
      await tx.spot.update({ where: { id: MACHINAMI }, data: { visitTime: t(11, 50), stayDurationMin: 70 } });
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
