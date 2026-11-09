/**
 * 初日・最終日の見直し #169 7ffb8f61「波戸岬と七ツ釜の絶景、東松浦半島と唐津をめぐるドライブ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目はもとから14:00に終わっていた（1泊2日の最終日は16:30〜17:00）ので、決まり②・③で直す（企画運営 10/30）
 * いまの初日（6か所）: 七ツ釜 9:00 → 呼子大橋 → 風の見える丘公園 → 田島神社 →（呼子で昼食）→ 波戸岬 → 玄海海中展望塔 15:15〜16:30
 * 直した初日（6か所のまま）: JR唐津駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車で約20分（OSRM 16分＋駐車）→ 七ツ釜 11:36 → 車14（OSRM 9分＋駐車）で呼子へ、
 *   呼子の町で昼食 → 呼子大橋 13:10 → 風の見える丘公園 13:35 → 田島神社 14:00 → 車18（OSRM 13分＋駐車）→ 波戸岬 14:48 → 歩8 → 玄海海中展望塔 15:56〜16:31（入館16:30まで）
 *   車: 七ツ釜→呼子 20→14、田島神社→波戸岬 25→18（どちらも OSRM×1.5＋5 を超えていた）。歩き 波戸岬→展望塔 579m・8分（5→8）
 *   滞在はどれも、もとより短い（七ツ釜 50→30、呼子大橋 30→20、風の見える丘 30→20、田島 40→30、波戸岬 90→60、展望塔 75→35）
 *   昼食の文を田島神社から七ツ釜の終わりへ移す（時刻に合わせる）。波戸岬の「おすすめ」を直す
 * 2日目: 棚田→唐津城 OSRM 22分＋駐車で27分（40→27）、唐津城→唐津神社 foot 1,436m・20分（15→20）。決まり②で棚田を 9:30 に、決まり③で旧高取邸と鏡山展望台を足す:
 *   棚田 9:30 → 車27 → 唐津城 10:37 → 歩15（1,064m）→【足す】旧高取邸 11:52（国の重要文化財。休館日は公式の案内で）→ 歩9（603m）→ 唐津神社 12:51〜13:21（このあと町なかで昼食）→
 *   車15 → 虹の松原 14:36 → 車11（OSRM 6分＋駐車）→【足す】鏡山展望台 15:32〜16:32 → 帰りは唐津駅へ車で約15分（OSRM 11分＋α）、レンタカーを返す
 *   旧高取邸: 唐津城の南西の海沿い、高取伊好の旧宅・国の重要文化財・大広間棟に能舞台（gltjp・panasonic の建築の記事 ほか）。点は OSM way 1161705831「旧高取家住宅」
 *   鏡山展望台: 標高約284mの鏡山の山頂、虹の松原・唐津の町・唐津湾を見渡せる（林野庁九州森林管理局の虹の松原のページ・gltjp ほか）。点は OSM node 6419027089「鏡山展望台」
 *   1か所目に宿からの行き方（展望塔→棚田 OSRM 13分＋駐車）、虹の松原の「旅を締めくくりましょう」を鏡山展望台へ移す。説明文の2日目の並びを足した2か所に合わせる
 * 昼食は移動の中に入れず、昼食のスポットを立てる（法務 10/30）: 初日「呼子の町で昼食」12:17〜13:07（点＝通りの way 185535394「朝市通り」の Nominatim。店・案内板の点は使わない）、
 *   2日目「唐津の町なかで昼食」13:29〜14:14（点＝通りの way 184749448「中町通り」の Nominatim。唐津神社から foot 579m・8分）。車は唐津城のそばに置いたまま歩くので、虹の松原へは歩き20分（foot 1,521m）＋車11分。
 *   初日は波戸岬 60→55分、2日目は鏡山展望台 60→55分で、展望塔 16:32・鏡山 16:36 に出る
 * 座標: 今の点はどれも OSM の値（node・way の Nominatim）と同じで、そのまま
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-169-7ffb8f61.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7ffb8f61-d19a-40e0-bb07-3e43d3908ca2";
const DAY1_ID = "b349b945-082d-4ac4-a1c7-c2b43c5a6b15";
const DAY2_ID = "208cbe9a-4ad8-4f7f-9840-2dbc91c44df4";
const NANATSUGAMA = "ac7ada7b-6308-4914-9935-9e598d39c937";
const YOBUKO = "1c884beb-715d-499c-8de1-671de5960b0c";
const KAZE = "821b810e-60cc-460d-8da8-24b8fc738c19";
const TASHIMA = "08582c3e-a3f8-47b4-b93f-d0e57a40b81e";
const HADO = "c9b5c06f-53dd-4d8f-bf39-ad32d35a62d9";
const KAICHU = "bb8db80b-d36f-469b-ac0c-6fe52df0db1d";
const TANADA = "734b3547-c197-4215-8ec3-956d6ba34567";
const KARATSUJO = "48e12b50-7cea-443a-a768-a1d2fedaac22";
const KARATSUJINJA = "b159dc57-c268-4a7a-b3f7-a0849383c8a4";
const NIJINOMATSUBARA = "15e58957-04f2-4d12-9bc7-feb719b8a4fa";
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

const DESC_FROM = "2日目は浜野浦の棚田から唐津へ向かい、唐津城と唐津神社、虹の松原へ。";
const DESC_TO = "2日目は浜野浦の棚田から唐津へ向かい、唐津城と旧高取邸、唐津神社、虹の松原をめぐって、鏡山展望台へ。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [NANATSUGAMA]: [
    {
      from: "旅の始まりは七ツ釜へ。",
      to: "この旅は車でめぐります。JR唐津駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約20分。旅の始まりは七ツ釜へ。",
    },
    {
      from: "岸の上から眺めるときは、崖に近づきすぎないようにしましょう。",
      to: "岸の上から眺めるときは、崖に近づきすぎないようにしましょう。このあと、車で呼子の町へ向かいましょう。",
    },
  ],
  [YOBUKO]: [{ from: "七ツ釜から車で呼子へ。", to: "昼食のあと、呼子の町から車で約9分。" }],
  [TASHIMA]: [{ from: "このあと、呼子の町で昼食にしましょう。", to: "" }],
  [HADO]: [
    { from: "呼子から車で波戸岬へ。", to: "田島神社から車で約18分、波戸岬へ。" },
    { from: "夕日が沈む時間帯の景色もおすすめです。", to: "夕日が沈む時間帯の景色でも知られます。" },
  ],
  [TANADA]: [{ from: "2日目は玄海町の浜野浦の棚田へ。", to: "2日目は、宿から車で約18分、玄海町の浜野浦の棚田へ。" }],
  [KARATSUJO]: [{ from: "浜野浦の棚田から車で唐津へ。", to: "浜野浦の棚田から車で約27分、唐津へ。" }],
  [KARATSUJINJA]: [
    { from: "唐津城から歩いて約15分、町の中心にある唐津神社へ。", to: "旧高取邸から歩いて約9分、町の中心にある唐津神社へ。" },
    { from: "このあと、町なかで昼食にしましょう。", to: "このあと、歩いて約8分の町なかで昼食にしましょう。" },
  ],
  [NIJINOMATSUBARA]: [
    { from: "唐津湾に沿って、", to: "昼食のあと、唐津城のそばの車まで歩いて約20分、車で約11分。唐津湾に沿って、" },
    { from: "松原の緑と海を眺めながら、旅を締めくくりましょう。", to: "松原の緑と海を眺めましょう。" },
  ],
};

const TAKATORI = {
  name: "旧高取邸",
  lat: 33.454336,
  lng: 129.97216,
  address: "佐賀県唐津市北城内5-40",
  memo: "唐津城から歩いて約15分。唐津城の南西、海のそばに建つ、炭鉱の経営で財をなした高取伊好の旧宅で、国の重要文化財です。和と洋を取り入れた近代の建物で、大広間棟には能舞台もあります。休館日は公式の案内で確かめましょう。",
  h: 11,
  m: 52,
  stay: 50,
  legs: [walk(15)] as Leg[],
};
const KAGAMIYAMA = {
  name: "鏡山展望台",
  lat: 33.43076,
  lng: 130.017936,
  address: "佐賀県唐津市鏡",
  memo: "虹の松原から車で約11分。唐津市の東にある、標高約284mの鏡山の山頂にある展望台で、虹の松原や唐津の町、唐津湾を見渡せます。松原と海の景色を眺めながら、旅を締めくくりましょう。帰りは、車で約15分の唐津駅へ戻り、レンタカーを返しましょう。",
  h: 15,
  m: 41,
  stay: 55,
  legs: [car(11)] as Leg[],
};

const LUNCH1 = {
  name: "呼子の町で昼食",
  lat: 33.537418,
  lng: 129.895166,
  address: "佐賀県唐津市呼子町呼子",
  memo: "七ツ釜から車で約11分。呼子の朝市通りのあたりで、昼食にしましょう。",
  h: 12,
  m: 17,
  stay: 50,
  legs: [car(11)] as Leg[],
};
const LUNCH2 = {
  name: "唐津の町なかで昼食",
  lat: 33.447726,
  lng: 129.969923,
  address: "佐賀県唐津市京町",
  memo: "唐津神社から歩いて約8分。中町通りのあたりで、昼食にしましょう。",
  h: 13,
  m: 29,
  stay: 45,
  legs: [walk(8)] as Leg[],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: NANATSUGAMA, h: 11, m: 36, stay: 30, legs: [] },
  { id: YOBUKO, h: 13, m: 16, stay: 20, legs: [car(9)] },
  { id: KAZE, h: 13, m: 41, stay: 20, legs: [car(5)] },
  { id: TASHIMA, h: 14, m: 6, stay: 30, legs: [car(5)] },
  { id: HADO, h: 14, m: 54, stay: 55, legs: [car(18)] },
  { id: KAICHU, h: 15, m: 57, stay: 35, legs: [walk(8)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: TANADA, h: 9, m: 30, stay: 40, legs: [] },
  { id: KARATSUJO, h: 10, m: 37, stay: 60, legs: [car(27)] },
  { id: KARATSUJINJA, h: 12, m: 51, stay: 30, legs: [walk(9)] },
  { id: NIJINOMATSUBARA, h: 14, m: 45, stay: 45, legs: [walk(20), car(11)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  if (!it.description || it.description.split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  type Row = { name: string; h: number; m: number; stay: number; legs: Leg[]; orig?: string; edits?: string[] };
  const rows1: Row[] = PLAN.map((p) => {
    const s = d1.spots.find((x) => x.id === p.id)!;
    return { ...p, name: s.name, orig: `${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分`, edits: (MEMO_EDITS[p.id] ?? []).map((e) => e.to || "（消す）" + e.from) };
  });
  rows1.splice(1, 0, { ...LUNCH1, orig: "足す", edits: [LUNCH1.memo] });
  const rows2: Row[] = [];
  for (const p of DAY2) {
    const s = d2.spots.find((x) => x.id === p.id)!;
    rows2.push({ ...p, name: s.name, orig: `${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分`, edits: (MEMO_EDITS[p.id] ?? []).map((e) => e.to) });
    if (p.id === KARATSUJO) rows2.push({ ...TAKATORI, orig: "足す", edits: [TAKATORI.memo] });
    if (p.id === KARATSUJINJA) rows2.push({ ...LUNCH2, orig: "足す", edits: [LUNCH2.memo] });
  }
  rows2.push({ ...KAGAMIYAMA, orig: "足す", edits: [KAGAMIYAMA.memo] });
  const show = (label: string, rows: Row[]) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const r of rows) {
      const st = r.h * 60 + r.m;
      const min = r.legs.reduce((a, l) => a + l.min, 0);
      console.log(`${hm(st)}-${hm(st + r.stay)} ${r.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${r.name}（もと ${r.orig}）`);
      for (const e of r.edits ?? []) console.log(`  → ${e}`);
      prevEnd = st + r.stay;
    }
  };
  show("1日目（直したあと）", rows1);
  show("2日目（直したあと）", rows2);
  console.log(`\n説明文: …${DESC_FROM} → …${DESC_TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const item = (p: (typeof PLAN)[number]) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
  const create = (x: typeof TAKATORI) => ({
    create: { name: x.name, visitTime: t(x.h, x.m), stayDurationMin: x.stay, transitLegs: { create: legsCreate(x.legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(DESC_FROM, DESC_TO) } });
      await setDaySpotOrder(DAY1_ID, [item(PLAN[0]), create(LUNCH1), ...PLAN.slice(1).map(item)] as never, { tx });
      await setDaySpotOrder(DAY2_ID, [item(DAY2[0]), item(DAY2[1]), create(TAKATORI), item(DAY2[2]), create(LUNCH2), item(DAY2[3]), create(KAGAMIYAMA)] as never, { tx });
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
