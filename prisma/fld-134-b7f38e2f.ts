/**
 * 初日・最終日の見直し #134 b7f38e2f「岩手銀行赤レンガ館と小岩井農場、歴史と牧場を楽しむ盛岡1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（8か所）: 盛岡城跡公園 9:20 → もりおか歴史文化館 → 上の橋と紺屋町（昼食）→ 岩手銀行赤レンガ館 → 啄木・賢治青春館 → もりおか町家物語館 → 鉈屋町と大慈清水 → 盛岡八幡宮 15:55〜16:30
 * 直した初日（8か所のまま）: JR盛岡駅に11時ごろ → 歩いて約20分で盛岡城跡公園 11:20 → … → 盛岡八幡宮 16:35〜16:55
 *   どこも外さない（説明文に全部出てくる）。移動の時間は延ばさず、滞在を短くした
 *   （公園 45→30分、歴史文化館 50→40分、上の橋と紺屋町 75→60分（昼食つき 12:45〜）、赤レンガ館 45→35分、青春館 40→30分、町家物語館 40→30分、鉈屋町 40→30分、八幡宮 35→20分）
 *   閉まる時刻（決まり7）: 岩手銀行赤レンガ館 10:00〜17:00・入館16:30まで・火曜休み（rurubu.jp/andmore/spot/80002557）→ 13:55 に着く。
 *     もりおか町家物語館 9:00〜19:00・最終入場18:30（盛岡市の告知 city.morioka.iwate.jp/_res/projects/default_project/_page_/001/039/515/230201matiya02.pdf）→ 15:50 に出る
 * 座標（itinerary-rules 7章）:
 *   盛岡城跡公園 → OSM way 51481168「岩手公園」（leisure=park）／もりおか歴史文化館 → way 464456072（tourism=museum）／岩手銀行赤レンガ館 → way 427693421（法務 10/29）／
 *   盛岡八幡宮 → way 706913531（amenity=place_of_worship）／上丸牛舎（小岩井農場資料館）→ way 1037153828「小岩井農場資料館」（tourism=museum）／
 *   小岩井農場まきば園 → way 83329662／啄木新婚の家 → OSM になし。地理院の住所検索「盛岡市中央通三丁目17番」の点
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-134-b7f38e2f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b7f38e2f-129c-43ae-9313-9fe104e78005";
const DAY1_ID = "e82210ff-c962-44ba-b8fd-e6b3a9745f45";
const PARK = "3476f85a-635c-49e6-bb45-3fe87084a664";
const REKISHI = "264ae5e5-ab37-42b7-bc84-f1b9930fdf0f";
const KAMINOHASHI = "207c2c70-bc85-4f48-9c87-39c4571552c6";
const AKARENGA = "41a824ab-e302-4d0c-8f89-f95f411862bb";
const SEISHUN = "3ea03787-9757-44a6-ad96-f17be89cef77";
const MACHIYA = "9c141113-a1f0-4085-b019-9acdeb21b04a";
const NATAYA = "985a74ba-19ee-4c99-b817-91b61a6ff35e";
const HACHIMAN = "14164821-3a23-4246-80ff-9b90d5690c65";
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
  [PARK]: [{ from: "JR盛岡駅から開運橋を渡り、歩いて約20分で盛岡城跡公園へ。", to: "JR盛岡駅に11時ごろ着いたら、開運橋を渡り、歩いて約20分で盛岡城跡公園へ。" }],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: PARK, from: [39.700545, 141.151421], to: [39.700615, 141.151634] },
  { id: REKISHI, from: [39.70103, 141.152606], to: [39.701044, 141.152617] },
  // 法務 10/29: 赤レンガ館は OSM way 427693421「岩手銀行赤レンガ館」から約10m離れていた
  { id: AKARENGA, from: [39.700602, 141.155165], to: [39.700685, 141.155126] },
  { id: HACHIMAN, from: [39.695347, 141.16411], to: [39.695348, 141.164015] },
  { id: "bdc55648-6946-4b18-9f6d-f1a16f36c366", from: [39.752617, 141.01317], to: [39.752631, 141.013172] },
  { id: "eac43c17-5dce-47ab-8d2e-c87c96fc7493", from: [39.75282, 141.018362], to: [39.752786, 141.019067] },
  { id: "e5a2b1e2-4429-4b9f-b79b-3b38b7b5fb16", from: [39.706341, 141.141571], to: [39.706238, 141.141174] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: PARK, h: 11, m: 20, stay: 30, legs: [] },
  { id: REKISHI, h: 11, m: 55, stay: 40, legs: [walk(5)] },
  { id: KAMINOHASHI, h: 12, m: 45, stay: 60, legs: [walk(10)] },
  { id: AKARENGA, h: 13, m: 55, stay: 35, legs: [walk(10)] },
  { id: SEISHUN, h: 14, m: 35, stay: 30, legs: [walk(5)] },
  { id: MACHIYA, h: 15, m: 20, stay: 30, legs: [walk(15)] },
  { id: NATAYA, h: 15, m: 55, stay: 30, legs: [walk(5)] },
  { id: HACHIMAN, h: 16, m: 35, stay: 20, legs: [walk(10)] },
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
  console.log(`\n説明文は変えない: ${it.description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
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
