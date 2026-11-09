/**
 * 初日・最終日の見直し #115 55a33667「熱海サンビーチと商店街、温泉街グルメを楽しむ1泊2日リラックス旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 歩きは routed-foot、タクシーは OSRM（もとの「車」は「レンタカーなど」だけで借りる・返す場所がなく、町なかを歩いたあとに車に乗るので、タクシーに。
 * もとの値が ×1.5＋5 の内側ならそのまま、新しい区間は切り上げ＋5）
 * 1日目: 熱海駅 10:30ごろ → 歩15（1,077m）→ 熱海サンビーチ 10:45（40→30）→ 歩10（533m、もとのまま）→ 親水公園・ムーンテラス 11:25（25→20）→
 *   歩6（408m。もと15）→ 熱海銀座商店街 11:51〜12:51（昼食、70→60）→ 歩8（531m、もとのまま）→ 起雲閣 12:59（90→60）→ 歩15（1,121m、もとのまま）→
 *   来宮神社 14:14（40→30）→ タクシー10（9.7、もとのまま）→ 伊豆山神社・走り湯 14:54（50→45）→ タクシー14（13.6、もとのまま）→ 姫の沢公園 15:53〜16:38（75→45）→
 *   タクシー14（8.9）で熱海駅のまわりの宿
 * 2日目（時刻はもとのまま。16:42 に出る）: 宿 → 歩8（558m）→ 旧日向別邸 9:00 → タクシー10 → 熱海梅園 10:40 → タクシー10 → MOA美術館 11:50（昼食。もとは梅園 10:40 で昼食）→
 *   タクシー10 → 熱海城 13:30 → タクシー2 → ACAO FOREST 14:27〜16:42 → タクシー13（8.0）で熱海駅
 *   MOA美術館の館内の食事処: 公式 https://www.moaart.or.jp/about/restaurant/（花の茶屋「日本料理」・そばの坊 など）
 * 点: サンビーチ＝OSM「熱海サンビーチ」node 6187615422（ほかのしおり 177ea052 と同じ）／ムーンテラス＝OSM「親水公園」node 5603023726（e7f63845 と同じ。いまは度分秒の0.1秒の形）／
 *   熱海銀座商店街＝OSM「銀座通り」way 113370621（Nominatim）／熱海梅園＝OSM「熱海梅園」garden way 564171834（Nominatim。177ea052 と同じ。いまは度分秒の0.1秒の形）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-115-55a33667.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "55a33667-b603-4efa-ad4f-2b5f8e8e2f47";
const DAY1_ID = "d4a4bab4-b8b8-4d72-b685-3f7456041a27";
const DAY2_ID = "6aa4dffb-1588-4f58-8415-ec4a90b643a4";
const SUN = "105f8c2c-1f6b-482c-b551-cd4967b13764";
const MOON = "c5706530-0b0c-41f5-95c1-5e08bc7db7c9";
const GINZA = "fd9b4413-f07e-4f40-b5ff-0f0ce42e891b";
const KIUN = "a9ac0ea8-9f86-4e66-930b-12c4d766589f";
const KINOMIYA = "02833b6f-21d5-46a8-a5fe-5f9641ac996b";
const IZUSAN = "8c9944a8-331b-4ee8-ab90-e2a498dd1ac2";
const HIME = "94782e31-435f-4cd1-b87a-a43d8e3f34eb";
const HYUGA = "e549660b-0300-44fa-87e7-d488c0a3b4d9";
const BAIEN = "1094b5e0-5abe-4b1b-ae8a-7770fb97f34a";
const MOA = "5e6f65ab-4e5c-48b0-b3ab-ae8b434f3efc";
const JO = "b6581430-f851-4675-bb8b-adac4fef24ec";
const ACAO = "3ccdc450-2f3d-45be-ba68-f8ea97abf3b1";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [SUN]: { from: [35.09808, 139.07669], to: [35.09824, 139.076861] },
  [MOON]: { from: [35.0955, 139.077], to: [35.094188, 139.075071] },
  [GINZA]: { from: [35.09631, 139.07167], to: [35.096824, 139.073636] },
  [BAIEN]: { from: [35.09725, 139.0605], to: [35.098272, 139.058957] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SUN]: [
    {
      from: "旅の始まりは熱海サンビーチです。熱海の町なかは歩いてめぐり、来宮神社のあとはレンタカーなどでめぐります。",
      to: "熱海駅に10時半ごろ着いたら、歩いておよそ15分、熱海サンビーチから旅を始めます。熱海の町なかは歩いてめぐり、来宮神社のあとはタクシーでめぐります。",
    },
    { from: "潮風を感じながらビーチ沿いを歩いてみてください。", to: "潮風を感じながらビーチ沿いを歩きましょう。" },
  ],
  [MOON]: [
    { from: "波打ち際の散策路を、のんびりと歩いてみてください。この後は、歩いておよそ15分、", to: "波打ち際の散策路を、のんびりと歩きましょう。この後は、歩いておよそ6分、" },
  ],
  [GINZA]: [
    { from: "親水公園・ムーンテラスから歩いておよそ15分、", to: "親水公園・ムーンテラスから歩いておよそ6分、" },
    { from: "ここで昼食にするのもおすすめです。", to: "ここで昼食にしましょう。" },
    { from: "昭和レトロな商店街の風情をゆっくりと味わってみてください。", to: "昭和レトロな商店街の風情をゆっくりと味わいましょう。" },
  ],
  [KIUN]: [{ from: "大正ロマンの雰囲気をゆっくりと味わってみてください。", to: "大正ロマンの雰囲気をゆっくりと味わいましょう。" }],
  [KINOMIYA]: [
    {
      from: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。この後は、車でおよそ10分、伊豆山神社・走り湯へ向かいましょう。",
      to: `${PRAY_TO}この後は、タクシーでおよそ10分、伊豆山神社・走り湯へ向かいましょう。タクシーは、前もって予約しておくと安心です。`,
    },
  ],
  [IZUSAN]: [
    { from: "来宮神社から車でおよそ10分、", to: "来宮神社からタクシーでおよそ10分、" },
    {
      from: "足元に気をつけながら参拝してください。静かに、敬意をもってお参りください。この後は、車でおよそ14分、",
      to: `足元に気をつけながら参拝しましょう。${PRAY_TO}この後は、タクシーでおよそ14分、`,
    },
  ],
  [HIME]: [
    { from: "伊豆山神社・走り湯から車でおよそ14分、", to: "伊豆山神社・走り湯からタクシーでおよそ14分、" },
    { from: "緑豊かな山あいの空気を、ゆっくりと味わってみてください。", to: "緑豊かな山あいの空気を、ゆっくりと味わいましょう。" },
    { from: "今夜はこの近くの宿でゆっくり休みましょう。", to: "この夜は、タクシーでおよそ14分の熱海駅のまわりの宿に泊まりましょう。" },
  ],
  [HYUGA]: [
    { from: "旅の2日目は旧日向別邸からスタートです。", to: "熱海駅のまわりの宿から歩いておよそ8分、2日目は旧日向別邸から。" },
    { from: "訪れる前に公式サイトで確かめてください。この後は、車でおよそ10分、", to: "訪れる前に公式サイトで確かめましょう。この後は、タクシーでおよそ10分、" },
  ],
  [BAIEN]: [
    { from: "旧日向別邸から車でおよそ10分、", to: "旧日向別邸からタクシーでおよそ10分、" },
    { from: "園の近くには食事処もあるので、ここで昼食にしましょう。この後は、車でおよそ10分、", to: "この後は、タクシーでおよそ10分、" },
  ],
  [MOA]: [
    { from: "熱海梅園から車でおよそ10分、", to: "熱海梅園からタクシーでおよそ10分、" },
    {
      from: "休館日は公式の案内で確かめてから訪れましょう。この後は、車でおよそ10分、熱海城へ向かいましょう。",
      to: "館内には日本料理やそばの店もあるので、ここで昼食にしましょう。休館日は公式の案内で確かめてから訪れましょう。この後は、タクシーでおよそ10分、熱海城へ向かいましょう。",
    },
  ],
  [JO]: [
    { from: "MOA美術館から車でおよそ10分、", to: "MOA美術館からタクシーでおよそ10分、" },
    { from: "この後は、車でおよそ2分、", to: "この後は、タクシーでおよそ2分、" },
  ],
  [ACAO]: [
    { from: "熱海城から車でおよそ2分、", to: "熱海城からタクシーでおよそ2分、" },
    { from: "歩きやすい靴でお越しください。", to: "歩きやすい靴で出かけましょう。" },
    { from: "お帰りは、駐車場に置いた車でご利用ください。", to: "帰りは、タクシーでおよそ13分の熱海駅へ向かいましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: SUN, h: 10, m: 45, stay: 30, legs: [] },
  { id: MOON, h: 11, m: 25, stay: 20, legs: [walk(10)] },
  { id: GINZA, h: 11, m: 51, stay: 60, legs: [walk(6)] },
  { id: KIUN, h: 12, m: 59, stay: 60, legs: [walk(8)] },
  { id: KINOMIYA, h: 14, m: 14, stay: 30, legs: [walk(15)] },
  { id: IZUSAN, h: 14, m: 54, stay: 45, legs: [taxi(10)] },
  { id: HIME, h: 15, m: 53, stay: 45, legs: [taxi(14)] },
];
const DAY2: Plan = [
  { id: HYUGA, h: 9, m: 0, stay: 90, legs: [] },
  { id: BAIEN, h: 10, m: 40, stay: 60, legs: [taxi(10)] },
  { id: MOA, h: 11, m: 50, stay: 90, legs: [taxi(10)] },
  { id: JO, h: 13, m: 30, stay: 55, legs: [taxi(10)] },
  { id: ACAO, h: 14, m: 27, stay: 135, legs: [taxi(2)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
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
    for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "車で", "ホテル", "旅館"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
  }
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）${p.stay > (s.stayDurationMin ?? 0) ? " ⚠滞在がもとより長い" : ""}`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n直したメモ:");
  for (const [id, m] of Object.entries(memos)) console.log(`■ ${all.find((x) => x.id === id)!.name}\n${m}`);
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx });
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
