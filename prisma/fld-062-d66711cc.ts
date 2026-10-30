/**
 * 初日・最終日の見直し #62 d66711cc「しまなみ海道サイクリング、来島海峡から大三島を渡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目）
 * 自転車は routed-bike の時間（そのまま）、歩きは routed-foot、タクシーは OSRM
 * 1日目: 今治駅 11:00ごろ → タクシー15（OSRM 6.7、もとのまま）→ 今治糸山レンタサイクル 11:16 → 自転車56（7,012m）→ 道の駅よしうみいきいき館 12:32〜13:32（昼食）→
 *   自転車35（5,429m。routed-bike は23分だが坂を見込まないため、標高約300mの上りの分を足す。企画運営）→ 亀老山展望公園 14:07 → 自転車45（11,497m）→
 *   村上海賊ミュージアム 15:32〜16:42 → 宮窪のまわりの宿。糸山の20分に自転車を借りる手続き（15分ほど）を含む
 *   順番を「糸山→亀老山→道の駅」から「糸山→道の駅（昼食）→亀老山」に（11時からでは亀老山のあとの昼食が13:30をすぎるため）。入口は11時ごろ（決まり369の②）
 *   開山公園は外す（説明文にない。11時からでは収まらない。写真なし）。宿は伯方島から宮窪に（開山を外したため。OSM に宮窪の宿 way 747841863）
 * 2日目（終わり 16:30 はもとのまま）: 宿（宮窪）→ 自転車79（21,946m。もとは伯方島から50）→ 大山祇神社 9:30 → 歩2（147m。もと5）→ 大山祇神社宝物館 10:22 →
 *   自転車19（7,394m。もと45）→ 道の駅多々羅しまなみ公園 11:26〜12:21（昼食・自転車を返す）→ 歩6（416m）→
 *   【新】上浦歴史民俗資料館（村上三島記念館）12:27〜12:47（公式 https://www.city.imabari.ehime.jp/museum/santou/ 。自転車の時間を測り直すと2日目が16:02に終わり
 *   16:30に届かないため。決まり369の③）〜13:14（47）→ 歩9（693m）→ 多々羅大橋 13:23 → タクシー22（OSRM 16.1。もとはバス2本の乗りつぎだったが、
 *   島内の路線バスの時刻表が公式で見つからないため。企画運営）→ 今治市伊東豊雄建築ミュージアム 14:20 →
 *   歩10（705m。もと5）→ ところミュージアム大三島 15:30〜16:30
 * 点: 亀老山展望公園＝OSM viewpoint「亀老山展望公園」node 4680152767（いまは公園の way の中心）／多々羅大橋＝橋の歩道の way 123283517 の大三島側の端の node 1054347314
 *   （いまは橋の way の中心で海の上。メモは「橋のたもとから見上げる」）／村上三島記念館＝OSM node 1423730119
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-062-d66711cc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d66711cc-25fd-406e-b98d-3155df878f5c";
const DAY1_ID = "2b382220-405a-4a2b-b036-9d66cb595354";
const DAY2_ID = "409eeefe-ec10-480a-9261-c457a025d269";
const ITO = "76631b32-9eaa-422b-ad4c-15509450d8d5";
const KIRO = "8e0ad333-c0c6-4a0c-b8fb-defdce582f02";
const YOSHI = "ed6b3338-65af-4fb5-81f6-c5d48c6267ff";
const MURA = "714e22bb-280e-4a7e-9c0f-f3b8206af80b";
const KAI = "7967e5a9-aded-4225-9817-a1e6f88b5ddd";
const OYAMA = "6be7c7b1-87b2-4338-93d5-2c2712781cff";
const HOU = "d5b46eba-0f41-4977-af48-415c14557373";
const TATARA = "554e3fe6-0977-4e15-af12-ac3cced08fad";
const BRIDGE = "e744e586-8b19-449a-bfe7-5a5ededc0fe3";
const ITOM = "16858c3d-dbf1-4ab5-a8a3-08b495cd2b8f";
const TOKO = "9c2bc75e-e6cf-42b0-9b38-ee9972fcf095";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bike = (min: number) => ({ mode: "other" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [KIRO]: { from: [34.120124, 133.034111], to: [34.11993, 133.033502] },
  [BRIDGE]: { from: [34.259805, 133.064794], to: [34.257707, 133.054704] },
};

const KINEN = "new-kinenkan";
const KINEN_SPOT = {
  name: "上浦歴史民俗資料館（村上三島記念館）",
  lat: 34.255642,
  lng: 133.053595,
  memo: "道の駅から歩いて約6分。上浦の歴史や民俗の資料を紹介する資料館で、村上三島の作品も展示している記念館です。月曜日（祝日の場合は翌日）と年末年始は休館なので、公式の案内で確かめましょう。この後は、歩いて約9分、多々羅大橋のたもとへ向かいましょう。",
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [ITO]: [
    { from: "JR今治駅からタクシーで約15分の糸山へ。", to: "JR今治駅に11時ごろ着いたら、タクシーで約15分の糸山へ。" },
    {
      from: "自転車で走るときは、ヘルメットをかぶり、車に気をつけて走りましょう。",
      to: "自転車を借りる手続きには、15分ほどかかります。自転車で走るときは、ヘルメットをかぶり、車に気をつけて走りましょう。ここから来島海峡大橋を渡り、自転車で約56分、大島の道の駅よしうみいきいき館へ向かいましょう。",
    },
  ],
  [YOSHI]: [
    { from: "亀老山から坂を下って、自転車で約30分。", to: "糸山から来島海峡大橋を渡って、自転車で約56分。" },
    { from: "下り坂はスピードを出しすぎないように気をつけましょう。", to: "この後は、自転車で約35分、大島の南の山の上の亀老山展望公園へ向かいましょう。" },
  ],
  [KIRO]: [
    { from: "来島海峡大橋を自転車で渡り、大島の南の山を上って約1時間10分。", to: "道の駅から、大島の南の山を自転車で上って約35分。" },
    {
      from: "山道は急な上り坂が続くので、無理をせず、自転車を押して歩くのもよいでしょう。",
      to: "山道は急な上り坂が続くので、無理をせず、ときには自転車を押して歩きましょう。帰りの下り坂は、スピードを出しすぎないように気をつけましょう。この後は、自転車で約45分、宮窪の村上海賊ミュージアムへ向かいましょう。",
    },
  ],
  [MURA]: [
    { from: "道の駅から大島の島内を北東へ、自転車で約50分の宮窪へ。", to: "亀老山から大島の島内を北東へ、自転車で約45分の宮窪へ。" },
    { from: "休館日は公式の案内で確かめましょう。", to: "休館日は公式の案内で確かめましょう。この夜は、宮窪のまわりの宿に泊まりましょう。" },
  ],
  [OYAMA]: [
    {
      from: "伯方島の宿から大三島橋を渡り、自転車で約50分の大三島・宮浦へ。",
      to: "宮窪の宿から伯方・大島大橋と大三島橋を渡り、自転車で約79分の大三島・宮浦へ。朝の出発が早くなるので、宿を出る時刻を前もって決めておきましょう。",
    },
  ],
  [HOU]: [{ from: "境内から歩いて約5分。", to: "境内から歩いて約2分。" }],
  [TATARA]: [
    { from: "宮浦から自転車で約45分、", to: "宮浦から自転車で約19分、" },
    {
      from: "（返せる場所と時間は公式の案内で確かめましょう）。",
      to: "（返せる場所と時間は公式の案内で確かめましょう）。食事を終えたら、歩いて約6分、上浦歴史民俗資料館（村上三島記念館）へ向かいましょう。",
    },
  ],
  [BRIDGE]: [
    { from: "道の駅から歩いて約15分。", to: "上浦歴史民俗資料館から歩いて約9分。" },
    { from: "歩道を歩くときは、自転車に気をつけましょう。", to: "歩道を歩くときは、自転車に気をつけましょう。この後は、タクシーで約22分、伊東豊雄建築ミュージアムへ向かいましょう。" },
  ],
  [ITOM]: [
    {
      from: "橋から大三島バスストップへ歩き、路線バスで宮浦港へ行き、宗方港行きのバスに乗り換えて、ところミュージアムで降りて歩いてすぐ（あわせて約45分）。",
      to: "多々羅大橋のたもとから、タクシーで約22分。",
    },
    { from: "バスの本数は多くないので、時刻を公式の時刻表で確かめましょう。", to: "タクシーは、前もって予約しておくと安心です。" },
  ],
  [TOKO]: [
    { from: "伊東豊雄建築ミュージアムから歩いて約5分。", to: "伊東豊雄建築ミュージアムから歩いて約10分。" },
    {
      from: "帰りは、ところミュージアムのバス停から路線バスで宮浦港へ行き、今治駅へ向かうバスに乗り換えましょう。",
      to: "帰りは、ところミュージアムのバス停から路線バスで宮浦港へ行き、今治駅へ向かうバスに乗り換えましょう。バスの本数は多くないので、時刻を公式の案内で確かめましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: ITO, h: 11, m: 16, stay: 20, legs: [] },
  { id: YOSHI, h: 12, m: 32, stay: 60, legs: [bike(56)] },
  { id: KIRO, h: 14, m: 7, stay: 40, legs: [bike(35)] },
  { id: MURA, h: 15, m: 32, stay: 70, legs: [bike(45)] },
];
const DAY2: Plan = [
  { id: OYAMA, h: 9, m: 30, stay: 50, legs: [] },
  { id: HOU, h: 10, m: 22, stay: 45, legs: [walk(2)] },
  { id: TATARA, h: 11, m: 26, stay: 55, legs: [bike(19)] },
  { id: KINEN, h: 12, m: 27, stay: 47, legs: [walk(6)] },
  { id: BRIDGE, h: 13, m: 23, stay: 35, legs: [walk(9)] },
  { id: ITOM, h: 14, m: 20, stay: 60, legs: [taxi(22)] },
  { id: TOKO, h: 15, m: 30, stay: 60, legs: [walk(10)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [ITO, KIRO, YOSHI, MURA, KAI].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [OYAMA, HOU, TATARA, BRIDGE, ITOM, TOKO].join()) throw new Error("2日目の構成が想定と違います");
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
  all.push({ ...KINEN_SPOT, id: KINEN, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "開山", "伯方島の宿", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  console.log(`新しいスポット: ${KINEN_SPOT.name}（${KINEN_SPOT.lat},${KINEN_SPOT.lng}）\n  ${KINEN_SPOT.memo}`);
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
  console.log("\n外す: 開山公園（1日目、写真なし）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) =>
      p.id === KINEN
        ? {
            create: {
              name: KINEN_SPOT.name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: KINEN_SPOT.lat,
              lng: KINEN_SPOT.lng,
              address: "愛媛県今治市上浦町井口7505",
              memo: KINEN_SPOT.memo,
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [KAI] });
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
