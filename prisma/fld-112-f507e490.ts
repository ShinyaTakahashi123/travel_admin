/**
 * 初日・最終日の見直し #112 f507e490「松本市美術館と旧開智学校、アートと近代建築を楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 歩きは routed-foot（新しい区間・もとの値が実測から外れる区間だけ直す）
 * 1日目: 松本駅 10:30ごろ → 歩23（1,716m）→ 旧制高等学校記念館 10:53（60→45）→ 歩8（561m。もと10）→ 松本市美術館 11:46（90→70）→ 歩10（701m）→
 *   中町通り 13:06〜13:56（昼食、60→50）→ 歩2（104m。もと5）→ はかり資料館 13:58（30→25）→ 歩7（502m。もと5）→ 時計博物館 14:30（45→35）→
 *   歩7（455m。もと10）→ 松本市立博物館 15:12（60→40）→ 歩8（551m。もと10）→ 松本城 16:00〜16:55（80→55）→ 歩18（1,327m）で松本駅のまわりの宿
 * 2日目（終わり 16:30 はもとのまま）: 宿 → 歩24（1,782m）→ 旧開智学校 9:00 … 穂高駅前 13:00〜13:50（昼食）→ 歩8（588m。もと5、メモは「約3分」）→ 穂高神社 13:58（45→42）→
 *   タクシー15（OSRM 6.3、もとのまま）→ 大王わさび農場 14:55〜16:30 → タクシー12（OSRM 6.7）で穂高駅
 * 点: はかり資料館＝地理院「中央三丁目4番21号」（いまはバス停の点。OSM に資料館の点はない）／
 *   旧司祭館＝地理院「開智二丁目6番24号」（住所は内閣府の資料 cao.go.jp の松本市博物館条例。いまは OSM の案内板の点）／
 *   大王わさび農場＝OSM「大王わさび農場」attraction way 497524070（Nominatim。いまは農場の relation の面の中心）
 *   中町通りは、ほかのしおり（fa3afe40・760fe248・f7ff855f）と同じ点に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-112-f507e490.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f507e490-d079-42fb-bf98-12be010ccf3d";
const DAY1_ID = "85f4fb96-a8ce-4a85-b264-b633b8d95cfd";
const DAY2_ID = "1f68318d-e78b-4718-96fd-d9e958a02b59";
const KYUSEI = "e31d013b-25dd-4540-a022-b98d36a6b0f5";
const BIJUTSU = "8a26ac07-c264-4d9e-9bbc-de71b3e081ee";
const NAKA = "7d5e0d21-fc42-4e60-b37a-a4d807ca0c09";
const HAKARI = "4ddea9d4-e3ea-4ba3-bb11-f6b65fe01ef3";
const TOKEI = "7b08a0a3-ef15-4349-afb6-51f75438acd1";
const SHIHAKU = "a9863799-90a5-4fa0-a491-9ece75b12e23";
const JO = "a184d64b-4e40-4802-860f-f9b7c0fedee7";
const KAICHI = "3105b92d-f964-4736-8c5b-a115047b074d";
const SHISAI = "ac1ceea6-9465-4ca4-b37d-5324ed1bddfe";
const WASABI = "9d853d61-6607-4cee-9506-d64ea7ffe26e";
const EKIMAE = "614bb173-fb98-487a-b789-d96588d16227";
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

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [NAKA]: { from: [36.233593, 137.971324], to: [36.233799, 137.971459] },
  [HAKARI]: { from: [36.233875, 137.972692], to: [36.233871, 137.97261] },
  [SHISAI]: { from: [36.243147, 137.967681], to: [36.243145, 137.967743] },
  [WASABI]: { from: [36.338627, 137.909943], to: [36.338777, 137.909105] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KYUSEI]: [
    { from: "松本駅から歩いて約20分、あがたの森公園の中にある、", to: "松本駅に10時半ごろ着いたら、歩いておよそ23分。あがたの森公園の中にある、" },
    { from: "100年前の学び舎の空気を感じてみましょう。", to: "100年前の学び舎の空気を感じましょう。" },
  ],
  [BIJUTSU]: [{ from: "あがたの森から歩いて約10分。", to: "あがたの森から歩いて約8分。" }],
  [HAKARI]: [{ from: "中町通りの中ほどにある小さな資料館です。", to: "中町通りから歩いて約2分、通りの中ほどにある小さな資料館です。" }],
  [TOKEI]: [
    { from: "はかり資料館から歩いて約5分、", to: "はかり資料館から歩いて約7分、" },
    { from: "時を刻む道具の移り変わりをたどってみましょう。", to: "時を刻む道具の移り変わりをたどりましょう。" },
  ],
  [SHIHAKU]: [{ from: "時計博物館から歩いて約10分。", to: "時計博物館から歩いて約7分。" }],
  [JO]: [
    { from: "博物館から歩いて約10分。", to: "博物館から歩いて約8分。" },
    { from: "入場の時間は公式の案内で確かめてから向かいましょう。", to: "入場の時間は公式の案内で確かめてから向かいましょう。この夜は、歩いておよそ18分の松本駅のまわりの宿に泊まりましょう。" },
  ],
  [KAICHI]: [{ from: "松本駅から周遊バスで約13分、または歩いて約25分。", to: "松本駅のまわりの宿から歩いておよそ24分、2日目は旧開智学校から始めます。" }],
  [WASABI]: [
    { from: "穂高駅からタクシーで約10分。", to: "穂高神社からタクシーで約15分。" },
    { from: "帰りはタクシーで穂高駅へ戻ります。", to: "帰りはタクシーでおよそ12分の穂高駅へ戻ります。" },
  ],
  [EKIMAE]: [{ from: "JR大糸線の穂高駅のまわりで", to: "穂高駅のまわりで" }, { from: "午後は駅から歩いてすぐの穂高神社へ向かい", to: "午後は駅から歩いて約8分の穂高神社へ向かい" }],
};

const HOTAKA = "a32e439b-f7d6-488b-8b85-1ee9128bf0ee";
MEMO_EDITS[HOTAKA] = [
  { from: "穂高駅から歩いて約3分。", to: "穂高駅から歩いて約8分。" },
  { from: "静かに、敬意をもってお参りください。", to: "静かに、敬意をもってお参りしましょう。" },
];

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: KYUSEI, h: 10, m: 53, stay: 45, legs: [] },
  { id: BIJUTSU, h: 11, m: 46, stay: 70, legs: [walk(8)] },
  { id: NAKA, h: 13, m: 6, stay: 50, legs: [walk(10)] },
  { id: HAKARI, h: 13, m: 58, stay: 25, legs: [walk(2)] },
  { id: TOKEI, h: 14, m: 30, stay: 35, legs: [walk(7)] },
  { id: SHIHAKU, h: 15, m: 12, stay: 40, legs: [walk(7)] },
  { id: JO, h: 16, m: 0, stay: 55, legs: [walk(8)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots[0].id !== KAICHI || d2.spots[1].id !== SHISAI || d2.spots[d2.spots.length - 1].id !== WASABI) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
    }
    memos[id] = m;
  }
  for (const s of all) {
    const m = memos[s.id] ?? s.memo ?? "";
    for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "ホテル", "旅館"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
  }
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of DAY1) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = all.find((x) => x.id === p.id)!;
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）`);
    prevEnd = st + p.stay;
  }
  console.log("\n2日目（時刻はそのまま）");
  for (const s of d2.spots) console.log(`${hmOf(s.visitTime)}-${hm(s.visitTime!.getUTCHours() * 60 + s.visitTime!.getUTCMinutes() + s.stayDurationMin!)} ${s.name}`);
  console.log("穂高神社: 13:55（45分、walk5）→ 13:58（42分、walk8）。いま " + d2.spots.filter((s) => s.id === HOTAKA).map((s) => `${hmOf(s.visitTime)} ${s.stayDurationMin} ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin)}`).join());
  for (const [id, c] of Object.entries(COORDS)) console.log(`座標 ${all.find((x) => x.id === id)!.name}: ${c.from.join(",")} → ${c.to.join(",")}`);
  console.log("\n直したメモ:");
  for (const [id, m] of Object.entries(memos)) console.log(`■ ${all.find((x) => x.id === id)!.name}\n${m}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(
        DAY1_ID,
        DAY1.map((p) => ({
          id: p.id,
          data: {
            ...timeLegs(p.h, p.m, p.stay, p.legs),
            ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
            ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
          },
        })) as never,
        { tx }
      );
      await tx.spot.update({ where: { id: HOTAKA }, data: timeLegs(13, 58, 42, [walk(8)]) });
      for (const id of [KAICHI, SHISAI, EKIMAE, HOTAKA, WASABI])
        await tx.spot.update({
          where: { id },
          data: { ...(memos[id] !== undefined ? { memo: memos[id] } : {}), ...(COORDS[id] ? { lat: COORDS[id].to[0], lng: COORDS[id].to[1] } : {}) },
        });
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
