/**
 * 初日・最終日の見直し #136 441b998a「日曜市とはりまや橋、土佐の街なかカルチャーを楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（6か所）: 日曜市 9:00 → 県立文学館 → ひろめ市場（昼食）→ 龍馬の生まれたまち記念館 → 自由民権記念館 → 横山隆一記念まんが館 16:05〜16:50
 * 直した初日（6か所のまま）: JR高知駅に11時ごろ → 路面電車ではりまや橋、歩いて追手筋 → 日曜市 11:15 → ひろめ市場（昼食 12:15〜）→ 県立文学館 → 龍馬の生まれたまち記念館 → 自由民権記念館 → まんが館 16:23〜16:53
 *   どこも外さない（説明文に全部出てくる）。日曜市のすぐ南のひろめ市場を先にして、文学館をそのあとにする
 *   道のり（OSRM。一方通行で車は遠回りになるので、歩きは少し短く見た）: 日曜市→ひろめ市場 約0.4〜0.7km（歩き5分）、ひろめ市場→文学館 約0.5km（歩き8分）、文学館→龍馬の生まれたまち記念館 約1.5km（歩き20分）
 *   日曜市: 4〜9月 5:00〜17:00、10〜3月 5:30〜16:00（高知市の資料 city.kochi.kochi.jp/uploaded/attachment/158885.pdf）→ 12:10 まで。
 *     「朝のうちに訪れるのがおすすめ」は、11時台から歩く形に合わせて直す。説明文の「朝から歩き」も直す
 *   閉まる時刻（決まり7）: 自由民権記念館 9:30〜17:00（rurubu.jp/andmore/spot/80037119）→ 15:23 に着く。
 *     まんが館 9:00〜18:00（kfca.jp のチラシ）→ 16:53 に出る。どちらも月曜休みで、日曜の初日は開いている
 *   移動の時間は延ばさず、滞在を短くした（日曜市 100→55分、ひろめ市場 75→55分、文学館 50→35分、龍馬 60→45分、自由民権 60→40分、まんが館 45→30分）
 * 座標（itinerary-rules 7章）: 日曜市 → OSM node 4972945421「日曜市」（Su 05:30-17:00）／
 *   はりまや橋（2日目）→ node 5099545223「はりまや橋」（tourism=attraction。いまは電停の点）／桂浜（2日目）→ way 44407519「桂浜」（natural=beach）
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-136-441b998a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "441b998a-82ce-43fd-849a-ee82c277dd46";
const DAY1_ID = "c56a49e0-4fb8-4b5c-bf0c-ac9ccfa49c27";
const NICHIYO = "0a70734e-31a2-4051-9201-c83ccccce215";
const BUNGAKU = "e46bf57e-6f3d-412a-bc0d-298152891433";
const HIROME = "a2594bca-8484-4bef-9a15-e2f9c2264482";
const RYOMA = "ecfac065-fb63-4b58-bbed-609d3ec3dcd1";
const JIYU = "a15806e4-d752-4646-9f56-b97c86a08af9";
const MANGA = "bbf05237-7163-4c77-abac-35d382a48ec1";
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

const DESC_FROM = "300年以上の歴史をもつ土佐の日曜市を朝から歩き、県立文学館を訪ねて、好きな店の料理を持ち寄るひろめ市場で昼食を。";
const DESC_TO = "300年以上の歴史をもつ土佐の日曜市を歩き、好きな店の料理を持ち寄るひろめ市場で昼食にしてから、県立文学館へ。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [NICHIYO]: [
    {
      from: "元禄3年（1690年）以来、",
      to: "この旅は路面電車・バスと歩きでめぐります。JR高知駅に11時ごろ着いたら、路面電車ではりまや橋へ行き、西へ歩いて追手筋へ（あわせて約15分）。元禄3年（1690年）以来、",
    },
    { from: "午後になると片付けを始める店も多いので、朝のうちに訪れるのがおすすめです。", to: "午後になると片付けを始める店も多いので、お昼すぎまでにひと通り歩いておきましょう。" },
  ],
  [HIROME]: [{ from: "文学館から歩いて約10分。", to: "日曜市から歩いて約5分。" }],
  [BUNGAKU]: [{ from: "日曜市から歩いて約10分。", to: "ひろめ市場から歩いて約8分。" }],
  [RYOMA]: [{ from: "ひろめ市場から歩いて約15分。", to: "文学館から歩いて約20分。" }],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: NICHIYO, from: [33.561589, 133.538374], to: [33.561655, 133.538244] },
  { id: "a5f61cac-28a0-4dad-9100-7eb9b37e2ab3", from: [33.5596, 133.542365], to: [33.559943, 133.542648] },
  { id: "b001646f-716b-4c46-a790-43ca21b203e4", from: [33.497159, 133.575425], to: [33.497108, 133.574456] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: NICHIYO, h: 11, m: 15, stay: 55, legs: [] },
  { id: HIROME, h: 12, m: 15, stay: 55, legs: [walk(5)] },
  { id: BUNGAKU, h: 13, m: 18, stay: 35, legs: [walk(8)] },
  { id: RYOMA, h: 14, m: 13, stay: 45, legs: [walk(20)] },
  { id: JIYU, h: 15, m: 23, stay: 40, legs: [train(25, "とさでん交通 路面電車")] },
  { id: MANGA, h: 16, m: 23, stay: 30, legs: [train(20, "とさでん交通 路面電車")] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [NICHIYO, BUNGAKU, HIROME, RYOMA, JIYU, MANGA].join()) throw new Error("1日目の構成が想定と違います");
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const description = (it.description ?? "").replace(DESC_FROM, DESC_TO);
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
  console.log(`\n説明文（直したあと）: ${description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const c of COORDS) await tx.spot.update({ where: { id: c.id }, data: { lat: c.to[0], lng: c.to[1] } });
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
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
