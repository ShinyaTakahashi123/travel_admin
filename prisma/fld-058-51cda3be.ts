/**
 * 初日・最終日の見直し #58 51cda3be「花と丘の絶景を巡る、富良野・美瑛のフォトジェニック旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目）
 * 車の分数は OSRM（もとの値は ×1.5＋5 の内側ならそのまま。道のりより短いもの・新しい区間は切り上げ＋5）。歩きは routed-foot
 * 1日目: 富良野駅 10:30ごろ → レンタカー（手続き15分）→ 車14（OSRM 8.7。もとは「中富良野駅から徒歩」で車の旅と合わない）→ ファーム富田 10:59（10:30＋15＋14、法務）→
 *   車26（OSRM 20.6、もとの20は道のりより短い）→ 拓真館 12:15 → 車10 → 四季彩の丘 13:15〜14:22（昼食。公式 https://shikisainooka.jp/ に園内のレストラン）→
 *   車28（OSRM 22.4、もと15）→ 美瑛の丘（パッチワークの路）14:50（84→62）→ 車18 → 北西の丘展望公園 16:10〜16:55（45のまま）→ 車10 で美瑛駅のまわりの宿
 *   ケンとメリーの木は外す（説明文にない。11時からでは収まらない。写真1枚も外れる）
 * 2日目（終わり 16:30 はもとのまま）: 宿 → 車13（OSRM 7.4）→ 三愛の丘展望公園 9:00（58→40）→ 車30 → 白ひげの滝 10:10 → 車7 → 青い池 10:58（58→45）→
 *   車9（OSRM 3.2）→【新】道の駅びえい「白金ビルケ」11:52〜12:27（昼食。https://www.visit-hokkaido.jp/spot/detail_10368.html 美瑛小麦のハンバーガー店）→
 *   車56（OSRM 50.5。もとは青い池から65）→ 麓郷の森 13:23 → 車33（OSRM 27.2、もとの20は道のりより短い）→ 風のガーデン 14:37 → 歩11（851m）→
 *   ニングルテラス 15:43〜16:30（70→47）→ 車14（OSRM 8.8）で富良野駅、レンタカーを返す
 * 点: ファーム富田＝OSM「ファーム富田」tourism=attraction node 5603040029（いまは花畑の way の中心）／四季彩の丘＝way 369100684 の node 5810723022（いまは約2.6km離れた丸めた点）／
 *   北西の丘展望公園＝OSM viewpoint「北西の丘」node 826197399（いまは公園の way の中心。メモはピラミッド型の展望台）／三愛の丘展望公園＝viewpoint「三愛の丘」node 828838610（同）／
 *   青い池＝池の way 303771940 の node 4869908985（いまは池の中心）／ニングルテラス＝OSM node 4607790389（いまは丸めた点）／白金ビルケ＝OSM services way 673344704。
 *   風のガーデンは OSM・地理院に点がなく、公式（受付はホテルから徒歩約2分、送迎車で片道約4分。営業 2026年は4/25〜10/12 https://www.princehotels.co.jp/ski/furano/kaze_no_garden_infor/ ）に合わせ、
 *   いまの新富良野プリンスホテルの点のまま（1件ずつの例外として確認）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-058-51cda3be.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "51cda3be-9832-4e7b-ac74-42bb780ebb89";
const DAY1_ID = "247d8d25-0b4c-493e-938c-05e886670c54";
const DAY2_ID = "4d603678-1f9c-4005-8fb8-891cdc3ba057";
const TOMITA = "9ff2fb29-8bb4-4764-b39e-e243469b727a";
const TAKU = "5b93110d-f4f6-4efb-93ad-6665c5636bf5";
const SHIKI = "13577c2d-4cd3-4804-a5e9-9396cb565c5a";
const PATCH = "a748d767-73c1-487f-a0c0-3aff0f57d80a";
const HOKU = "6e08566d-a89e-475d-99cd-b8c3bbad659f";
const KEN = "8ba1a824-4669-4505-ba57-73a41b8bf7e3";
const SANAI = "540daa36-d0eb-49c9-8aa1-3ecc30b1b8ec";
const SHIRA = "c01534dc-01a0-48ec-b691-62ec590e325d";
const AOI = "d856f50f-6249-4ad1-b030-b445e2ab1587";
const ROKU = "79b8f6c9-ad7d-49c4-aec2-50921654be2d";
const KAZE = "119cf6f3-f263-4a1c-9e3c-4aea9f0de373";
const NING = "53efefcb-272e-4429-b23c-5ef8b129423d";
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
  [TOMITA]: { from: [43.417298, 142.425477], to: [43.41796, 142.427787] },
  [SHIKI]: { from: [43.5464, 142.4869], to: [43.528404, 142.467338] },
  [HOKU]: { from: [43.60494, 142.457985], to: [43.60519, 142.45661] },
  [SANAI]: { from: [43.556945, 142.478368], to: [43.557239, 142.47816] },
  [AOI]: { from: [43.49349, 142.614098], to: [43.493322, 142.614637] },
  [NING]: { from: [43.3167, 142.375], to: [43.323431, 142.356339] },
};

// 2日目に足す昼食の場所
const LUNCH = "new-birke";
const LUNCH_SPOT = {
  name: "道の駅びえい「白金ビルケ」",
  lat: 43.503288,
  lng: 142.597034,
  memo:
    "青い池から車でおよそ9分、道の駅びえい「白金ビルケ」に着きます。青い池に近い白金の道の駅で、美瑛の小麦を使ったハンバーガーの店などがあります。ここで昼食をとりましょう。食事を終えたら、車でおよそ56分、富良野の麓郷の森へ向かいましょう。",
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TOMITA]: [
    {
      from: "JR中富良野駅から徒歩約10分、この旅の最初に訪れるのは",
      to: "JR富良野駅に10時半ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車でおよそ14分。この旅の最初に訪れるのは",
    },
    {
      from: "案内図で今の時期に見られる花畑を確認してから歩き始めるのがおすすめです。",
      to: "案内図で今の時期に見られる花畑を確かめてから歩き始めましょう。この後は、車でおよそ26分、美瑛の拓真館へ向かいましょう。",
    },
  ],
  [TAKU]: [
    { from: "ファーム富田から丘の道を進むと見えてくるのが、", to: "ファーム富田から車でおよそ26分、丘の道を進むと見えてくるのが、" },
    { from: "写真を撮りながらゆっくり歩いてみてください。", to: "写真を撮りながらゆっくり歩いてみましょう。この後は、車でおよそ10分、四季彩の丘へ向かいましょう。" },
  ],
  [SHIKI]: [
    { from: "丘をさらに進むと現れるのが、", to: "拓真館から車でおよそ10分、丘をさらに進むと現れるのが、" },
    {
      from: "次はこの丘の連なりそのものを楽しむ、パッチワークの路へと向かいます。",
      to: "園内のレストランで、花畑を眺めながら昼食をとりましょう。この後は、車でおよそ28分、丘の連なりそのものを楽しむパッチワークの路へ向かいましょう。",
    },
  ],
  [PATCH]: [
    { from: "ここから続く道のりそのものが、", to: "四季彩の丘から車でおよそ28分、ここから続く道のりそのものが、" },
    {
      from: "このパッチワークの丘の中には、CMをきっかけに有名になった一本の木もあるので、次はその木を探しに向かいましょう。",
      to: "この後は、車でおよそ18分、北西の丘展望公園へ向かいましょう。",
    },
  ],
  [HOKU]: [
    {
      from: "売店では、地元の農産物やコーヒーなども取り扱っています。",
      to: "売店では、地元の農産物やコーヒーなども取り扱っています。この夜は、車でおよそ10分の美瑛駅のまわりの宿に泊まりましょう。",
    },
  ],
  [SANAI]: [
    { from: "2日目の朝、最初に立ち寄るのは", to: "美瑛駅のまわりの宿から車でおよそ13分、2日目の朝、最初に立ち寄るのは" },
    { from: "足元にも目を向けてみてください。", to: "足元にも目を向けてみましょう。" },
    {
      from: "とは別の場所なので、目的地を間違えないよう気をつけて向かってください。",
      to: "とは別の場所です。この後は、車でおよそ30分、白ひげの滝へ向かいましょう。",
    },
  ],
  [SHIRA]: [
    { from: "三愛の丘から山側へ向かう途中、", to: "三愛の丘から車でおよそ30分、山側へ向かう途中、" },
    { from: "色のつながりをより実感できるはずです。", to: "色のつながりをより実感できるはずです。この後は、車でおよそ7分、青い池へ向かいましょう。" },
  ],
  [AOI]: [
    { from: "白ひげの滝で見た青みがかった流れの、その行き着く先にあるのが青い池です。", to: "白ひげの滝から車でおよそ7分。白ひげの滝で見た青みがかった流れの、その行き着く先にあるのが青い池です。" },
    {
      from: "これまで巡ってきた景色の集大成として写真におさめてみてください。",
      to: "これまで巡ってきた景色の集大成として写真におさめましょう。この後は、車でおよそ9分、道の駅びえい「白金ビルケ」へ向かいましょう。",
    },
  ],
  [ROKU]: [
    { from: "青い池から車で1時間ほど、山あいの道を抜けて着くのが、", to: "道の駅びえい「白金ビルケ」から車でおよそ56分、山あいの道を抜けて着くのが、" },
    { from: "訪れる際は時期を確認してから向かうようにしてください。", to: "訪れる際は時期を確かめてから向かいましょう。この後は、車でおよそ33分、風のガーデンへ向かいましょう。" },
  ],
  [KAZE]: [
    { from: "麓郷の森からは車で20分ほどです。", to: "麓郷の森からは車でおよそ33分です。受付はホテルから歩いて約2分のところにあり、そこから送迎車で庭園へ向かいます。営業は春から秋の初めまでなので、出かける前に公式の案内で営業期間を確かめましょう。" },
    { from: "花々の間の小径をゆっくり歩いてみてください。", to: "花々の間の小径をゆっくり歩いてみましょう。見学を終えたら、歩いておよそ11分、ニングルテラスへ向かいましょう。" },
  ],
  [NING]: [
    { from: "2日間のフォトジェニックな旅の締めくくりは、", to: "風のガーデンから歩いておよそ11分、2日間のフォトジェニックな旅の締めくくりは、" },
    {
      from: "旅を締めくくってください。",
      to: "旅を締めくくりましょう。見学を終えたら、車でおよそ14分の富良野駅の近くでレンタカーを返し(返す手続きに15分ほど)、帰りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: TOMITA, h: 10, m: 59, stay: 50, legs: [] },
  { id: TAKU, h: 12, m: 15, stay: 50, legs: [car(26)] },
  { id: SHIKI, h: 13, m: 15, stay: 67, legs: [car(10)] },
  { id: PATCH, h: 14, m: 50, stay: 62, legs: [car(28)] },
  { id: HOKU, h: 16, m: 10, stay: 45, legs: [car(18)] },
];
const DAY2: Plan = [
  { id: SANAI, h: 9, m: 0, stay: 40, legs: [] },
  { id: SHIRA, h: 10, m: 10, stay: 41, legs: [car(30)] },
  { id: AOI, h: 10, m: 58, stay: 45, legs: [car(7)] },
  { id: LUNCH, h: 11, m: 52, stay: 35, legs: [car(9)] },
  { id: ROKU, h: 13, m: 23, stay: 41, legs: [car(56)] },
  { id: KAZE, h: 14, m: 37, stay: 55, legs: [car(33)] },
  { id: NING, h: 15, m: 43, stay: 47, legs: [walk(11)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  if (it.description?.includes("ケンとメリー")) throw new Error("説明文にケンとメリーの木があります");
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [TOMITA, TAKU, SHIKI, PATCH, HOKU, KEN].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [SANAI, SHIRA, AOI, ROKU, KAZE, NING].join()) throw new Error("2日目の構成が想定と違います");
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
  all.push({ ...LUNCH_SPOT, id: LUNCH, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "ケンとメリー", "徒歩", "んです", "ますよ", "ですね"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  console.log(`新しい昼食の場所: ${LUNCH_SPOT.name}（${LUNCH_SPOT.lat},${LUNCH_SPOT.lng}）\n  ${LUNCH_SPOT.memo}`);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n外す: ケンとメリーの木（1日目、写真1枚もいっしょに外れる）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) =>
      p.id === LUNCH
        ? {
            create: {
              name: LUNCH_SPOT.name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: LUNCH_SPOT.lat,
              lng: LUNCH_SPOT.lng,
              address: "上川郡美瑛町白金",
              memo: LUNCH_SPOT.memo,
            },
          }
        : {
            id: p.id,
            data: {
              ...timeLegs(p.h, p.m, p.stay, p.legs),
              ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
              ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
            },
          }
    );
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [KEN] });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
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
