/**
 * 初日・最終日の見直し #173 ced5ac2b「蔵造りの町並みと喜多院、小江戸川越と比企の史跡をめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・電車と歩き。初日を11時ごろからにする。2日目はもとから 16:30 に終わり、移動もそのままでよい（文だけ直す）
 * いまの初日（9か所）: 川越八幡宮 9:05 → 蓮馨寺 → 熊野神社 → 時の鐘 → 一番街（昼食）11:15〜12:30 → 菓子屋横丁 → 氷川神社 → 本丸御殿 → 市立博物館 15:20〜16:30
 * 直した初日（9か所のまま、foot で測り直し）: 川越駅（東口）に11時ごろ → 歩7（519m）→ 川越八幡宮 11:07〜11:27 → 歩16（1,267m）→ 蓮馨寺 11:43〜11:58 → 歩3（166m）→
 *   熊野神社 12:01〜12:16 → 歩9（672m）→ 時の鐘 12:25〜12:40 → 歩1（58m）→ 一番街 12:41〜13:41（昼食）→ 歩4（240m）→ 菓子屋横丁 13:45〜14:10 → 歩15（1,125m）→
 *   氷川神社 14:25〜14:55 → 歩9（654m）→ 本丸御殿 15:04〜15:39 → 歩3（217m）→ 市立博物館 15:42〜16:32
 *   滞在はどれも、もとより短い（八幡宮 25→20、蓮馨寺 25→15、熊野 25→15、時の鐘 20→15、一番街 75→60、菓子屋 40→25、氷川 45→30、本丸 50→35、博物館 70→50）
 * 2日目: 時刻・移動はそのまま（foot: 百穴→松山城 383m・5分、蔵里→日枝 882m・12分、日枝→喜多院 248m・4分、喜多院→東照宮 262m・4分、東照宮→中院 331m・5分。どれも、もとの分以内）。
 *   1か所目に川越駅からの電車の時間（東武東上線 川越→東松山 各駅停車23分、ekitan）、中院の帰りの一文に川越駅までの分数（foot 1,402m・18分）
 * 座標（srccheck で出どころ不明 → OSM の値に。地理院の地名・番地とも合わない）:
 *   川越八幡宮・蓮馨寺・博物館・小江戸蔵里・仙波日枝神社・仙波東照宮・中院 = 各 way の Nominatim
 *   熊野神社 = 社殿の way 222840688（building=shrine）の Nominatim
 *   喜多院 = node 13082577559「徳川家光公誕生の間」（メモの誕生の間。境内全体の way は約190×240m）
 *   菓子屋横丁 = OSM に横丁そのものの点がないので、横丁の中ほどの菓子店の node 6390699253（メモに店名は書かない。itinerary-rules 366、法務 10/30）。一番街から foot 240m・4分、氷川神社まで 1,125m・15分
 *   松山城跡 = 地理院の地名「比企城館跡群松山城跡」の点（36.0371495711,139.4215495297。OSM は城跡全体の面だけで中に名前の点がないため、企画運営 10/30）
 *   時の鐘・一番街・氷川神社・本丸御殿・吉見百穴・箭弓稲荷神社は OSM の値と同じでそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-173-ced5ac2b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ced5ac2b-e034-4d4c-be65-467521eac189";
const DAY1_ID = "a75e85f0-2f16-4282-93d7-7532c172d0a6";
const DAY2_ID = "df0c025c-a004-4af0-9855-48770ea13a74";
const HACHIMAN = "5f02d387-862d-4d19-80cd-6ae81fe570f8";
const RENKEIJI = "e863f1b3-82e8-4431-82fb-27da1a3baec3";
const KUMANO = "7ace8953-ad61-492a-9bdb-47f6df76a2a4";
const KANE = "a83bd705-b63f-48a4-8a38-9974a67c9e22";
const ICHIBANGAI = "1fdddaa9-ba29-4678-8b36-1f3048825b23";
const KASHIYA = "d29b384b-6879-45d1-b496-47031ec19dbf";
const HIKAWA = "06f35366-9e43-4d4f-a88f-b7eb01b7a804";
const HONMARU = "ac103269-f259-4f14-b197-0b223666a7d8";
const MUSEUM = "2ca7d7d3-1843-4986-b8d6-c8c763dc6edb";
const HYAKUANA = "4d6a87fb-aae8-44f4-9efa-6deed9c0b407";
const MATSUYAMA = "b1c331fe-f60a-4610-9840-77e516c4b7ce";
const KURARI = "612ab446-d62b-4fd5-bd59-577ca19cbeae";
const HIE = "57baadd6-44cd-42b8-8752-4e9b1bcbabed";
const KITAIN = "f3429965-5877-4d7a-9cc8-6cc639898d69";
const TOSHOGU = "ec0d4beb-c36b-4237-9249-ccfe9f3191f9";
const NAKAIN = "18fd60c1-1f72-476f-8aa8-e3283117c5d2";
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
  [HACHIMAN]: [
    {
      from: "この旅は電車と歩きでめぐります。JR・東武東上線の川越駅東口から歩いて約6分で、川越八幡宮へ。",
      to: "この旅は電車と歩きでめぐります。JR・東武東上線の川越駅に11時ごろ着いたら、東口から歩いて約7分で、川越八幡宮へ。",
    },
  ],
  [RENKEIJI]: [{ from: "八幡宮から北へ歩いて、蓮馨寺へ。", to: "八幡宮から北へ歩いて約16分、蓮馨寺へ。" }],
  [KUMANO]: [{ from: "蓮馨寺のとなりの川越熊野神社へ。", to: "蓮馨寺から歩いて約3分、となりの川越熊野神社へ。" }],
  [KANE]: [{ from: "熊野神社から北へ歩いて、", to: "熊野神社から北へ歩いて約9分、" }],
  [ICHIBANGAI]: [{ from: "時の鐘から、蔵造りの商家が並ぶ一番街へ。", to: "時の鐘から歩いて約1分、蔵造りの商家が並ぶ一番街へ。" }],
  [KASHIYA]: [{ from: "一番街から歩いて菓子屋横丁へ。", to: "一番街から歩いて約4分、菓子屋横丁へ。" }],
  [HIKAWA]: [{ from: "菓子屋横丁から東へ歩いて、", to: "菓子屋横丁から東へ歩いて約15分、" }],
  [HONMARU]: [{ from: "氷川神社から南東へ歩いて、", to: "氷川神社から南東へ歩いて約9分、" }],
  [MUSEUM]: [{ from: "本丸御殿のとなりの川越市立博物館へ。", to: "本丸御殿から歩いて約3分、となりの川越市立博物館へ。" }],
  [HYAKUANA]: [{ from: "2日目は、東武東上線で東松山駅へ。", to: "2日目は、川越駅から東武東上線で約23分（各駅停車）の東松山駅へ。" }],
  [NAKAIN]: [
    {
      from: "帰りは、西武新宿線の本川越駅か、JR・東武東上線の川越駅まで歩いて戻ります。",
      to: "帰りは、西武新宿線の本川越駅か、JR・東武東上線の川越駅（歩いて約18分）まで歩いて戻ります。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: HACHIMAN, h: 11, m: 7, stay: 20, legs: [] },
  { id: RENKEIJI, h: 11, m: 43, stay: 15, legs: [walk(16)] },
  { id: KUMANO, h: 12, m: 1, stay: 15, legs: [walk(3)] },
  { id: KANE, h: 12, m: 25, stay: 15, legs: [walk(9)] },
  { id: ICHIBANGAI, h: 12, m: 41, stay: 60, legs: [walk(1)] },
  { id: KASHIYA, h: 13, m: 45, stay: 25, legs: [walk(4)] },
  { id: HIKAWA, h: 14, m: 25, stay: 30, legs: [walk(15)] },
  { id: HONMARU, h: 15, m: 4, stay: 35, legs: [walk(9)] },
  { id: MUSEUM, h: 15, m: 42, stay: 50, legs: [walk(3)] },
];
const DAY2_IDS = [HYAKUANA, MATSUYAMA, "1d4b12bf-e27a-4374-978b-8e8100feb931", KURARI, HIE, KITAIN, TOSHOGU, NAKAIN];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: HACHIMAN, from: [35.911247, 139.484679], to: [35.911243, 139.484553] },
  { id: RENKEIJI, from: [35.919392, 139.482063], to: [35.919453, 139.482149] },
  { id: KUMANO, from: [35.919011, 139.483239], to: [35.919126, 139.483096] },
  { id: KASHIYA, from: [35.924737, 139.481331], to: [35.924495, 139.481266] },
  { id: MUSEUM, from: [35.925871, 139.491499], to: [35.925852, 139.491508] },
  { id: MATSUYAMA, from: [36.036908, 139.421251], to: [36.03715, 139.42155] },
  { id: KURARI, from: [35.916212, 139.483775], to: [35.916236, 139.483777] },
  { id: HIE, from: [35.918126, 139.49063], to: [35.918205, 139.490621] },
  { id: KITAIN, from: [35.917801, 139.488985], to: [35.917995, 139.488484] },
  { id: TOSHOGU, from: [35.916616, 139.489756], to: [35.916626, 139.489798] },
  { id: NAKAIN, from: [35.914847, 139.490399], to: [35.914747, 139.490428] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_IDS.join()) throw new Error("2日目の構成が想定と違います");
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
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
    prevEnd = st + p.stay;
  }
  console.log("\n2日目（時刻はそのまま、文だけ）");
  for (const s of d2.spots) {
    console.log(`${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.name}`);
    for (const e of MEMO_EDITS[s.id] ?? []) console.log(`  → ${e.to}`);
  }
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items as never, { tx });
      for (const id of [HYAKUANA, NAKAIN]) await tx.spot.update({ where: { id }, data: { memo: apply(id, MEMO_EDITS[id]) } });
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
