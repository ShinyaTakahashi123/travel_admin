/**
 * 初日・最終日の見直し #147 e457b7bb「屋島とサンポート高松、絶景の古戦場と港町を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は移動の時間が道のりと合っていなかったので、企画運営の指示（10/30「内容の誤りとして直す」）で直す
 * 座標（先に名前つきの地物に直し、その点で道のり（routing.openstreetmap.de の foot）を測った）:
 *   屋島寺 → OSM way 422803840「第84番札所 屋島寺」（いまの点は約440m北）／四国村ミウゼアム → メモにある node 4627926289「四国村ギャラリー」（村の中心は使わない）／
 *   高松城跡 → node 2381052708「高松城」／北浜alley → node 4987423328「北浜アリー」／県立ミュージアム → node 1423745215／
 *   高松中央商店街 → node 6385471242「高松丸亀町壱番街前ドーム広場」／栗林公園 → メモにある北門の node 13329557001「北門入園券売場」（公園の中心は使わない）
 *   談古嶺（碑 node 11770603068）・やしまーる・獅子の霊巌・せとしるべ・サンポート高松（高松シンボルタワー way 250706903）は OSM と同じ。
 *   源平屋島古戦場は OSM に史跡の点がなく、いまの点はバス停「祈り岩・与一公園前」node 7351172862 と同じなので、そのまま
 * 1日目（6か所のまま）: 琴電屋島駅に11時ごろ → 屋島山上シャトルバス（あわせて約20分）→ 屋島寺 11:20 → 談古嶺 → やしまーる → 獅子の霊巌（昼食 12:59〜）→ 四国村 → 古戦場 15:44〜16:30
 *   歩き: 屋島寺→談古嶺 712m・9分、談古嶺→やしまーる 707m・9分、やしまーる→獅子の霊巌 31m・1分
 *   四国村→古戦場: もとの「歩いて約20分」は道のり3.2km・約43分で合わない。車の道のり3.1km（OSRM）でタクシー約10分にする（#137・#145 と同じ）
 *   滞在はどれも、もとより短い（屋島寺 60→35分、談古嶺 30→15分、やしまーる 60→30分、獅子の霊巌 70→60分、四国村 90→60分、古戦場 60→46分）
 * 2日目（7か所のまま。終わりは16:49で今より遅くならない）: 移動を道のりに直す
 *   サンポート→せとしるべ 1,298m・16分（15→16）、せとしるべ→高松城 1,626m・20分（15→20）、高松城→北浜 1,178m・15分（10→15）、北浜→ミュージアム 519m・7分（10→7）、
 *   ミュージアム→商店街 671m・9分（15→9）、商店街→栗林公園北門 2,077m・27分（20→27）。県立ミュージアムの滞在を 90→80分に
 * 文: つなぎの文の分数を合わせる。栗林公園の「確かめてください」→「確かめましょう」。説明文の「旅の足は電車・バス・徒歩です。」に「（一部タクシー）」を足す
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-147-e457b7bb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e457b7bb-1646-40b7-b126-22c06d29f51d";
const DAY1_ID = "1e0c10ef-4ceb-4fd0-81e7-cfdc2e7a9877";
const DAY2_ID = "3bf0a847-bffb-41fb-b1e3-f4e8a68ddc03";
const YASHIMAJI = "7c83c1f9-6034-4978-934e-7f4764e61d02";
const DANKOREI = "6d479c8b-194c-4f40-b0cd-8612c2d0866d";
const YASHIMARU = "77aa95a6-0eef-41ad-90bf-9ab1c66cf88e";
const SHISHI = "95740a56-c7dd-4093-a84a-219521cec295";
const SHIKOKUMURA = "9f841346-eb13-499c-8a79-e2309a68e72f";
const KOSENJO = "46a0ef25-8976-4862-9fc3-e63d4cb252cb";
const SUNPORT = "2035000b-7968-496a-85ca-0fab4365acaa";
const SETOSHIRUBE = "ab0d4f3a-001d-4572-b924-06fe2323276b";
const TAKAMATSUJO = "87865654-988e-46ff-866b-554fcbb741bd";
const KITAHAMA = "09931e00-3b6f-4cf4-a152-89b9d8c83cdf";
const MUSEUM = "64264d77-b9c5-41ba-b300-8e74c2e270b0";
const SHOTENGAI = "5b992dd3-da2b-46e4-b565-f772bddc719b";
const RITSURIN = "aa4d1284-feaa-423b-abef-9852de44857d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const taxi = (min: number) => ({ mode: "taxi" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const DESC_FROM = "旅の足は電車・バス・徒歩です。";
const DESC_TO = "旅の足は電車・バス・徒歩（一部タクシー）です。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [YASHIMAJI]: [
    {
      from: "琴電屋島駅から屋島山上シャトルバスで山上へ。",
      to: "この旅は電車・バスと歩き（一部タクシー）でめぐります。琴電屋島駅に11時ごろ着いたら、屋島山上シャトルバスで山上へ（あわせて約20分）。",
    },
  ],
  [DANKOREI]: [{ from: "屋島寺から歩いて約10分", to: "屋島寺から歩いて約9分" }],
  [YASHIMARU]: [{ from: "談古嶺から歩いて約10分。", to: "談古嶺から歩いて約9分。" }],
  [KOSENJO]: [{ from: "四国村から歩いて約20分、", to: "四国村からタクシーで約10分（タクシーは、前もって呼んでおきましょう）、" }],
  [SETOSHIRUBE]: [{ from: "サンポートから海沿いの防波堤を歩いて約15分", to: "サンポートから海沿いの防波堤を歩いて約16分" }],
  [TAKAMATSUJO]: [{ from: "せとしるべから歩いて約15分。", to: "せとしるべから歩いて約20分。" }],
  [KITAHAMA]: [{ from: "高松城跡から歩いて約10分", to: "高松城跡から歩いて約15分" }],
  [MUSEUM]: [{ from: "北浜alleyから歩いて約10分。", to: "北浜alleyから歩いて約7分。" }],
  [SHOTENGAI]: [{ from: "県立ミュージアムから歩いて約15分。", to: "県立ミュージアムから歩いて約9分。" }],
  [RITSURIN]: [
    { from: "商店街を南へ歩いて約20分", to: "商店街を南へ歩いて約27分" },
    { from: "公式の案内で確かめてください。", to: "公式の案内で確かめましょう。" },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: YASHIMAJI, from: [34.361336, 134.101131], to: [34.357381, 134.101154] },
  { id: SHIKOKUMURA, from: [34.345848, 134.108584], to: [34.345565, 134.108837] },
  { id: TAKAMATSUJO, from: [34.35003, 134.05039], to: [34.350028, 134.050386] },
  { id: KITAHAMA, from: [34.35099, 134.05668], to: [34.350992, 134.056681] },
  { id: MUSEUM, from: [34.349659, 134.053332], to: [34.349722, 134.05329] },
  { id: SHOTENGAI, from: [34.34601, 134.05054], to: [34.346015, 134.050537] },
  { id: RITSURIN, from: [34.330333, 134.044403], to: [34.332144, 134.043387] },
  // 法務 10/30: 古戦場はバス停 node 7351172862「祈り岩・与一公園前」の値そのものに（7章(b)）
  { id: KOSENJO, from: [34.35281, 134.12213], to: [34.352815, 134.122128] },
];

const DAY1_PLAN: Plan = [
  { id: YASHIMAJI, h: 11, m: 20, stay: 35, legs: [] },
  { id: DANKOREI, h: 12, m: 4, stay: 15, legs: [walk(9)] },
  { id: YASHIMARU, h: 12, m: 28, stay: 30, legs: [walk(9)] },
  { id: SHISHI, h: 12, m: 59, stay: 60, legs: [walk(1)] },
  { id: SHIKOKUMURA, h: 14, m: 34, stay: 60, legs: [bus(35, "屋島山上シャトルバス（山上→琴電屋島駅。駅から徒歩約10分）")] },
  { id: KOSENJO, h: 15, m: 44, stay: 46, legs: [taxi(10)] },
];
const DAY2_PLAN: Plan = [
  { id: SUNPORT, h: 9, m: 0, stay: 45, legs: [] },
  { id: SETOSHIRUBE, h: 10, m: 1, stay: 30, legs: [walk(16)] },
  { id: TAKAMATSUJO, h: 10, m: 51, stay: 60, legs: [walk(20)] },
  { id: KITAHAMA, h: 12, m: 6, stay: 60, legs: [walk(15)] },
  { id: MUSEUM, h: 13, m: 13, stay: 80, legs: [walk(7)] },
  { id: SHOTENGAI, h: 14, m: 42, stay: 60, legs: [walk(9)] },
  { id: RITSURIN, h: 16, m: 9, stay: 40, legs: [walk(27)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1_PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_PLAN.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const description = (it.description ?? "").replace(DESC_FROM, DESC_TO);
  const all = [...d1.spots, ...d2.spots];
  const memoOf = (id: string) => {
    let m = all.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const build = (plan: Plan) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  const days: [string, Plan][] = [
    ["1日目", DAY1_PLAN],
    ["2日目", DAY2_PLAN],
  ];
  for (const [label, plan] of days) {
    console.log(`\n${label}（直したあと）`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
      prevEnd = st + p.stay;
    }
  }
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log(`\n説明文（直したあと）: ${description}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, build(DAY1_PLAN) as never, { tx });
      await setDaySpotOrder(DAY2_ID, build(DAY2_PLAN) as never, { tx });
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
