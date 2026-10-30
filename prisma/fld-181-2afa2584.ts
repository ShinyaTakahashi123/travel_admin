/**
 * 初日・最終日の見直し #181 2afa2584「鑁阿寺と足利学校、フラワーパークまで巡る大人の足利1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・1日目は歩き、2日目は車。初日を11時ごろからにする。2日目はもとから 16:30 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * 直した初日（7か所のまま。foot で測り直し）: JR足利駅に11時ごろ → 歩12（898m）→ 鑁阿寺 11:12〜11:47 → 歩5 → 足利学校 11:52〜12:32 → 歩5 → 太平記館（昼食）12:37〜13:27 →
 *   歩10 → 市立美術館 13:37〜14:07 → 歩15 → 織姫神社 14:22〜14:52 → 歩20 → 草雲美術館 15:12〜15:42 → 歩19（1,463m、もと15）→ 渡良瀬橋 16:01〜16:31
 *   滞在はどれも、もと以下（鑁阿寺 50→35、学校 60→40、太平記館 70→50、美術館 60→30、織姫 60→30、草雲 50→30、渡良瀬橋 30）
 *   織姫神社の「足利音頭にも『赤いお宮』と歌われる」を外す（歌詞の引用。作詞者の没年を確かめられないため）
 * 2日目: 栗田美術館→厄除け大師 車25 → 歩6（フラワーパークの車まで 443m）＋車13（OSRM 7.8分＋駐車。もとは OSRM 5.7分の×1.5＋5 を超えていた）。
 *   終わりが6分早くなるので、決まり②で樺崎八幡宮を 9:06 に（厄除け大師 15:45〜16:30、もとと同じ）。ほかの車は基準内（20／17.3、35／25.7）、フラワーパーク→栗田 歩10（443m・6分）はもとのまま。
 *   1か所目に足利駅でレンタカー・車で約15分（OSRM 10.0分＋駐車）、帰りの一文に足利駅まで車で約18分（OSRM 12.9分＋駐車）
 * 座標: 足利学校 = way 256397654「史跡足利学校」、織姫神社 = way 429990200、佐野厄除け大師 = way 450070889（building=temple）、
 *   あしかがフラワーパーク = way 278465756「大藤棚」（メモの大藤。もとは約300m の園の way の中心）。
 *   太平記館 = 公式の住所（伊勢町3丁目6-4）の地理院の番地「伊勢町三丁目6番」の点（OSM に建物の点がなく、もとは「太平記館駐車場」の way の点だった。駐車場は別の物の点なので、法務 10/30）。鑁阿寺は境内の way の中心が大御堂の前にあたるのでそのまま。ほかは OSM の値でそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-181-2afa2584.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2afa2584-ca85-4263-984e-82ae6f1d282c";
const DAY1_ID = "2fed77f6-4130-4743-a92b-8044a48829aa";
const DAY2_ID = "64e974e3-6585-489c-9892-a7f9c54259e5";
const BANNAJI = "b73aca80-7b51-4ece-a31a-6e953d00feca";
const GAKKO = "3c09b161-b312-45d8-936f-9559b3709f9a";
const TAIHEIKI = "0dc1ba30-a848-4a7c-9614-e6500689f0cb";
const BIJUTSU = "375d31e8-1456-4fe2-9b9d-a00e53c0913e";
const ORIHIME = "5ca11f97-8e6c-4aed-a934-9d082205751d";
const SOUN = "2e3093d6-8d06-494b-966f-e78d59fb8057";
const WATARASE = "84e8ba79-1519-436d-a529-f21d97095cf5";
const KABASAKI = "5d710284-ce22-423f-be61-d5263cc0239d";
const NAGUSA = "ed02a11b-5f03-45d3-8cd4-0491d16d72cb";
const FLOWER = "a61e18d2-e92a-4a91-906a-3c125e09f42d";
const KURITA = "2f487fac-9616-4e69-aea2-395c187dbecc";
const YAKUYOKE = "8ea1656a-68ac-431e-8190-3ca8db8929be";
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
  [BANNAJI]: [{ from: "源姓足利氏2代目の", to: "1日目は歩いてめぐります。JR足利駅に11時ごろ着いたら、歩いて約12分の鑁阿寺へ。源姓足利氏2代目の" }],
  [GAKKO]: [{ from: "鑁阿寺から歩いてすぐ。", to: "鑁阿寺から歩いて約5分。" }],
  [TAIHEIKI]: [{ from: "足利学校から歩いてすぐの、", to: "足利学校から歩いて約5分の、" }],
  [ORIHIME]: [{ from: "足利音頭にも「赤いお宮」と歌われる神社で、1,300年の歴史をもつ", to: "1,300年の歴史をもつ" }],
  [WATARASE]: [{ from: "草雲美術館から歩いて約15分。", to: "草雲美術館から歩いて約19分。" }],
  [KABASAKI]: [{ from: "2日目は車（レンタカーなど）でめぐります。まずは樺崎八幡宮へ。", to: "2日目は車でめぐります。JR足利駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約15分の樺崎八幡宮へ。" }],
  [YAKUYOKE]: [
    { from: "栗田美術館から車で、", to: "栗田美術館からフラワーパークの車まで歩いて約6分戻り、車で約13分、" },
    { from: "帰りは、レンタカーを返す場所まで安全運転で。", to: "帰りは、車で約18分の足利駅へ戻り、レンタカーを返しましょう。" },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: BANNAJI, h: 11, m: 12, stay: 35, legs: [] },
  { id: GAKKO, h: 11, m: 52, stay: 40, legs: [walk(5)] },
  { id: TAIHEIKI, h: 12, m: 37, stay: 50, legs: [walk(5)] },
  { id: BIJUTSU, h: 13, m: 37, stay: 30, legs: [walk(10)] },
  { id: ORIHIME, h: 14, m: 22, stay: 30, legs: [walk(15)] },
  { id: SOUN, h: 15, m: 12, stay: 30, legs: [walk(20)] },
  { id: WATARASE, h: 16, m: 1, stay: 30, legs: [walk(19)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KABASAKI, h: 9, m: 6, stay: 40, legs: [] },
  { id: NAGUSA, h: 10, m: 6, stay: 45, legs: [car(20)] },
  { id: FLOWER, h: 11, m: 26, stay: 140, legs: [car(35)] },
  { id: KURITA, h: 13, m: 56, stay: 90, legs: [walk(10)] },
  { id: YAKUYOKE, h: 15, m: 45, stay: 45, legs: [walk(6), car(13)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: TAIHEIKI, from: [36.334921, 139.454499], to: [36.334896, 139.454346] },
  { id: GAKKO, from: [36.335957, 139.453623], to: [36.335966, 139.453512] },
  { id: ORIHIME, from: [36.339251, 139.444901], to: [36.339236, 139.444877] },
  { id: FLOWER, from: [36.313806, 139.519842], to: [36.314396, 139.520405] },
  { id: YAKUYOKE, from: [36.310859, 139.571891], to: [36.310564, 139.571506] },
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
