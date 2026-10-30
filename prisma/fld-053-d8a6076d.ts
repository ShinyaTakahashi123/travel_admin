/**
 * 初日・最終日の見直し #53 d8a6076d「厳美渓と猊鼻渓、平泉近くの渓谷美を巡る舟下り1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a。企画運営・法務 10/30 の判断）
 * タクシーの分数は OSRM（決まりの ×1.5＋5 を超えるか、道のりより短いものだけ直す）
 * 1日目: 一ノ関駅 10:30ごろ → タクシー15（OSRM 9.4＋5。バスの時刻に頼らないため、企画運営）→ 厳美渓 10:45〜11:55（昼食）→ 歩8（606m）→
 *   一関市博物館 12:03 → タクシー8（OSRM 2.9＋5、もとの12は ×1.5＋5 を超える）→ 達谷窟毘沙門堂 13:11 → タクシー18（OSRM 9.2、もとのまま）→
 *   骨寺村荘園交流館 14:29 → タクシー21（OSRM 15.6＋5）→ 釣山公園 15:50〜16:30 → 一ノ関駅まで歩いて約22分（1,625m）
 *   祭畤大橋(落橋)展望の丘・旧沼田家武家住宅は外す（11時からでは収まらない。タイトル・説明文にない。写真なし）
 * 2日目: 大船渡線は一ノ関 7:18発の次が 10:16発→猊鼻渓 10:51着（駅探 https://ekitan.com/transit/section/sf-655/st-900?dt=20261031&tm=0800 、企画運営）→
 *   猊鼻渓 10:55〜12:25（入口の例外と同じ考え方）→ 歩2 → 東山和紙紙すき館 12:27（昼食）→ タクシー5 → 石と賢治のミュージアム 13:27 → タクシー8 → 幽玄洞 14:35 →
 *   タクシー18 → 芦東山記念館 15:53〜16:30（60→37。入館16:30まで、閉館の時刻が確かめられないため16:30に出る、企画運営）→ タクシーで一ノ関駅まで約33分（OSRM 27.4＋5）。終わりは 16:30（もとの 16:44 より前）
 *   千厩酒のくら交流施設は外す（タイトル・説明文にない。写真なし）
 * 点: 達谷窟毘沙門堂 = 地理院の地名「達谷窟」38.968135,141.057914（いまの点は大字「平泉」の中心。OSM に寺の点がない）
 *   猊鼻渓は猊鼻渓駅の点のまま、メモを駅からの書き方に（決まり361）。東山和紙紙すき館は地理院の番地の点（東山町長坂町390番地）でそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-053-d8a6076d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d8a6076d-89b4-422f-8250-8c1865110376";
const DAY1_ID = "09673cf9-50ab-4c1d-a149-b56b58483139";
const DAY2_ID = "4e5cd192-dadb-4f73-9fa1-3c0c28095e10";
const GEMBI = "ce330f96-059c-4645-8c25-7668cdc56b2f";
const HAKU = "029a9a10-13c9-41c0-80d2-d5067a24af69";
const TAKKOKU = "9106b5d0-f0f1-4d70-8eb8-7862febed45a";
const HONE = "79646973-4273-4732-bc5d-7a98c87cc39e";
const MATSURU = "20f45f0d-2857-4466-a611-abe76fb975dd";
const TSURI = "925ecc55-fd42-493e-aa73-3667265e8298";
const NUMATA = "e66726d1-68de-4d75-a781-7cd6e02c5706";
const GEIBI = "ed08d03b-57dc-402a-b1fe-49bac6aef24c";
const WASHI = "1f56ead1-a482-4bef-a8cc-192940cb7322";
const KENJI = "740fc202-f196-4b86-b200-ffd5c0364406";
const YUGEN = "3f3a0ae6-876f-439f-8576-efa248cfaa0d";
const ASHI = "068a45a8-4115-4636-a5a8-696abf4ea2d8";
const SEN = "f7ef7270-1fb7-4a6c-8a96-7f6921191719";
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

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [TAKKOKU]: { from: [38.988693, 141.072357], to: [38.968135, 141.057914] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [GEMBI]: [
    { from: "一ノ関駅からバスでおよそ20分、厳美渓に着きます。", to: "一ノ関駅に10時半ごろ着いたら、駅前からタクシーでおよそ15分、厳美渓に着きます。" },
    { from: "「空飛ぶだんご」という名物もあります。", to: "「空飛ぶだんご」という名物もあります。渓谷沿いの茶屋や食事処で、昼食にしましょう。" },
  ],
  [HAKU]: [
    { from: "この後は、タクシーでおよそ12分、達谷窟毘沙門堂へ向かいましょう。", to: "この後は、タクシーでおよそ8分、達谷窟毘沙門堂へ向かいましょう。" },
    { from: "この先は路線バスの便が少ないため、タクシーを利用します。", to: "この先は路線バスの便が少ないため、タクシーを利用します。タクシーは、前もって予約しておくと安心です。" },
  ],
  [TAKKOKU]: [
    { from: "一関市博物館からタクシーでおよそ12分、", to: "一関市博物館からタクシーでおよそ8分、" },
    {
      from: "今も信仰の場として大切にされているので、静かに、敬意をもってお参りください。この付近には食事ができる店もあるので、昼食にするとよいでしょう。",
      to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
    },
  ],
  [HONE]: [{ from: "この後は、タクシーでおよそ15分、祭畤大橋(落橋)展望の丘へ向かいましょう。", to: "この後は、タクシーでおよそ21分、一関の市街地の釣山公園へ向かいましょう。" }],
  [TSURI]: [
    { from: "祭畤大橋(落橋)展望の丘からタクシーでおよそ30分、一関の市街地に戻り、", to: "骨寺村荘園交流館からタクシーでおよそ21分、一関の市街地に戻り、" },
    { from: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。", to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。" },
    { from: "この後は、歩いておよそ11分、旧沼田家武家住宅へ向かいましょう。", to: "この夜は、歩いておよそ22分の一ノ関駅のまわりの宿に泊まりましょう。" },
  ],
  [GEIBI]: [
    {
      from: "一ノ関駅からJR大船渡線でおよそ30分、猊鼻渓に着きます。",
      to: "一ノ関駅からJR大船渡線でおよそ35分、猊鼻渓駅に着いたら、歩いてすぐの舟乗り場から猊鼻渓の舟下りに出かけましょう。列車の本数が少ないので、時刻を公式の案内で確かめましょう。",
    },
  ],
  [WASHI]: [
    { from: "ここで昼食にするとよいでしょう。", to: "ここで昼食にしましょう。" },
    { from: "この先は路線バスの便が少ないため、タクシーを利用します。", to: "この先は路線バスの便が少ないため、タクシーを利用します。東山のあたりはタクシーの台数が少ないこともあるので、前もって予約しておくと安心です。" },
  ],
  [ASHI]: [
    {
      from: "この後は、タクシーでおよそ16分、千厩酒のくら交流施設へ向かいましょう。",
      to: "渓谷の舟下りから一関の歴史までをめぐった1泊2日は、これで終わりです。見学を終えたら、タクシーでおよそ33分の一ノ関駅へ向かい、帰りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: GEMBI, h: 10, m: 45, stay: 70, legs: [] },
  { id: HAKU, h: 12, m: 3, stay: 60, legs: [walk(8)] },
  { id: TAKKOKU, h: 13, m: 11, stay: 60, legs: [car(8)] },
  { id: HONE, h: 14, m: 29, stay: 60, legs: [car(18)] },
  { id: TSURI, h: 15, m: 50, stay: 40, legs: [car(21)] },
];
const DAY2: Plan = [
  { id: GEIBI, h: 10, m: 55, stay: 90, legs: [] },
  { id: WASHI, h: 12, m: 27, stay: 55, legs: [walk(2)] },
  { id: KENJI, h: 13, m: 27, stay: 60, legs: [car(5)] },
  { id: YUGEN, h: 14, m: 35, stay: 60, legs: [car(8)] },
  { id: ASHI, h: 15, m: 53, stay: 37, legs: [car(18)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [GEMBI, HAKU, TAKKOKU, HONE, MATSURU, TSURI, NUMATA].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [GEIBI, WASHI, KENJI, YUGEN, ASHI, SEN].join()) throw new Error("2日目の構成が想定と違います");
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
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "祭畤", "沼田", "千厩", "バス"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n外す: 祭畤大橋(落橋)展望の丘・旧沼田家武家住宅（1日目）、千厩酒のくら交流施設（2日目）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) => ({
      id: p.id,
      data: {
        ...timeLegs(p.h, p.m, p.stay, p.legs),
        ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
        ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
      },
    }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [MATSURU, NUMATA] });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx, remove: [SEN] });
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
