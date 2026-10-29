/**
 * 初日・最終日の見直し #158 fa4c2ce4「四万十川源流の森と一斗俵沈下橋、清流の源をたどる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（遠い場所の例外 itinerary-rules 62）。2日目は車の時間が道のりと合っていなかった1区間を直す
 * いまの初日（4か所）: 四万十川源流点 9:00 → 道の駅 布施ヶ坂（昼食）→ 天狗高原 → 梼原町歴史民俗資料館 15:30〜16:30
 * 直した初日（3か所）: JR高知駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車で約1時間（OSRM 55分＋駐車）→
 *   道の駅 布施ヶ坂 12:15（着いてすぐ昼食）→ 四万十川源流点 13:18 → 天狗高原 15:23〜16:33。宿は梼原の町（車で約40分）
 *   梼原町歴史民俗資料館を外す（天狗高原のあとに回ると着くのが16:50ごろで、開館の時刻に間に合わないおそれ。写真なし）
 *   車: 布施ヶ坂→源流点 OSRM 13分＋駐車で18分（もとの35分は OSRM×1.5＋5 を超え、所要時間の出典もないので直す。法務 10/30）。源流点の滞在は、碑から源流点まで登山道を片道25分ほど（tabi-mag.jp/ko0207）なので80分／源流点→天狗高原 OSRM 33分・山道なので45分（もとは布施ヶ坂経由で35＋45分）
 *   滞在はどれも、もとより短い（布施ヶ坂 55→45、源流点 90→80、天狗高原 115→70）
 *   「ください」を直す（源流点・布施ヶ坂）
 * 2日目: 岩本寺→久礼 OSRM 17分（21km、高速道路）・＋駐車で22分（40→22。もとの40分は OSRM×1.5＋5 を超える）。
 *   久礼 11:42、高知城 13:52、ひろめ市場 15:32〜16:12。終わりが16:30より早くなり、1か所目がすでに9:30なので、決まり③で「はりまや橋」を足す（企画運営 10/30）:
 *   ひろめ市場→はりまや橋 890m・12分（foot）、はりまや橋 16:24〜16:39。点は OSM node 5099545223「はりまや橋」。帰りの一文をはりまや橋に移し、ひろめ市場の「旅の最後に」を外す。
 *   最後のひろめ市場に帰りの一文がなかったので足す（高知駅の近くでレンタカーを返す）。「ください」を直す（久礼・ひろめ市場。岩本寺の「お参りください」は祈りの一文なのでそのまま）
 * 座標（itinerary-rules 7章）: 天狗高原 → メモにある node 6442420097「天狗ノ森」（山頂の点。いまの点は出どころがわからない）
 *   ほかは確かめたうえでそのまま（源流点＝node「四万十川源流之碑」、布施ヶ坂＝node「道の駅 布施ヶ坂」、一斗俵＝way「壱斗俵沈下橋」の上、
 *   岩本寺・久礼大正町市場・高知城・ひろめ市場＝OSM way の Nominatim の中心）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-158-fa4c2ce4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "fa4c2ce4-3769-458a-888f-3212199fd34a";
const DAY1_ID = "e8ba5b51-2071-4a25-a3be-a1243d205ca6";
const GENRYU = "6960109f-1c30-497b-b1af-081625b8d7d6";
const FUSE = "475b3a81-5052-47fd-a022-9f3c77d6a47b";
const TENGU = "8bf65be3-726c-42a9-8b60-385996e3bd61";
const YUSUHARA = "06d11f1d-a7a1-4f61-87d5-6321d759e820";
const ITTOHYO = "f20d8910-fe5b-4011-a24f-0c72877c5264";
const IWAMOTO = "96d7a3c0-98d6-4150-b070-227dd6571117";
const KURE = "9d8f8a10-7aab-4817-a4ce-b127cf138ef8";
const KOCHIJO = "79a8c7cb-9a06-4ed5-baa5-8fdc070a8ca1";
const HIROME = "cfef8787-189c-4319-a2bf-b559db44c001";
const ORIG_ORDER = [GENRYU, FUSE, TENGU, YUSUHARA];
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

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [FUSE]: [
    {
      from: "源流点から車で山を下り、国道197号沿いの道の駅へ。",
      to: "この旅は車でめぐります。JR高知駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約1時間、国道197号沿いの道の駅へ。",
    },
    { from: "食堂の営業時間は公式の案内で確かめてください。", to: "食堂の営業時間は公式の案内で確かめましょう。" },
  ],
  [GENRYU]: [
    { from: "津野町の不入山にある、四万十川の始まりの地点です。", to: "道の駅から車で約20分、林道を上ります。津野町の不入山にある、四万十川の始まりの地点です。" },
    { from: "森の中の遊歩道を歩いて源流点へ向かいましょう。", to: "森の中の遊歩道を片道25分ほど歩いて、源流点へ向かいましょう。" },
    { from: "足元に気をつけて歩いてください。", to: "足元に気をつけて歩きましょう。" },
  ],
  [TENGU]: [
    { from: "道の駅から車で山を上り、四国カルストの天狗高原へ。", to: "源流点から車で約45分、山道を上って四国カルストの天狗高原へ。" },
    { from: "高原は町より気温が低いので、上着を持って行きましょう。", to: "高原は町より気温が低いので、上着を持って行きましょう。この夜は、車で約40分の梼原の町の宿に泊まりましょう。" },
  ],
};
const DAY2_MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KURE]: [{ from: "店によって営業時間と定休日が違うので、公式の案内で確かめてください。", to: "店によって営業時間と定休日が違うので、公式の案内で確かめましょう。" }],
  [HIROME]: [
    { from: "旅の最後に高知の味を楽しみましょう。", to: "高知の味を楽しみましょう。" },
    { from: "車を運転する人は飲まないでください。", to: "車を運転する人は、お酒を飲まないようにしましょう。" },
  ],
};
const DAY2_ID = "4c5d41e1-bda1-451d-b35c-c62aa0a35464";
// 決まり③で足す（企画運営 10/30）。visitkochijapan.com/en/see-and-do/10027（高知市観光振興課）の内容だけで書く
const HARIMAYA = {
  name: "はりまや橋",
  lat: 33.559943,
  lng: 133.542648,
  address: "高知県高知市はりまや町1丁目",
  memo: "ひろめ市場から東へ歩いて約12分。高知の町の中ほどにある、朱色の小さな橋です。まわりは散策できる公園になっていて、かつて橋の下を流れていた川を、小さな流れで再現しています。よさこい節に歌われる恋の話の舞台としても知られます。帰りは、車に戻り、高知駅の近くでレンタカーを返しましょう。",
  h: 16,
  m: 24,
  stay: 15,
  legs: [walk(12)],
};
const DAY2_TIMES: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KURE, h: 11, m: 42, stay: 60, legs: [car(22)] },
  { id: KOCHIJO, h: 13, m: 52, stay: 90, legs: [car(70)] },
  { id: HIROME, h: 15, m: 32, stay: 40, legs: [walk(10)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [{ id: TENGU, from: [33.481939, 133.015609], to: [33.480686, 133.015395] }];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: FUSE, h: 12, m: 15, stay: 45, legs: [] },
  { id: GENRYU, h: 13, m: 18, stay: 80, legs: [car(18)] },
  { id: TENGU, h: 15, m: 23, stay: 70, legs: [car(45)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== ORIG_ORDER.join()) throw new Error("1日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const yus = d1.spots.find((s) => s.id === YUSUHARA)!;
  console.log(`\n外す: ${yus.name}（写真 ${yus.photos.length} 枚）`);
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), memo: apply(p.id, MEMO_EDITS[p.id]) } }));
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    console.log(`  ${apply(p.id, MEMO_EDITS[p.id])}`);
    prevEnd = st + p.stay;
  }
  // 2日目: 一斗俵 9:30〜10:10 → 車20 → 岩本寺 10:30〜11:20（もとのまま）→ 車22 → 久礼 11:42 → 車70 → 高知城 13:52 → 歩10 → ひろめ市場 15:32〜16:12
  const iwa = d2.spots.find((s) => s.id === IWAMOTO);
  if (!iwa || hmOf(iwa.visitTime) !== "10:30" || iwa.stayDurationMin !== 50 || d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [ITTOHYO, IWAMOTO, KURE, KOCHIJO, HIROME].join()) throw new Error("2日目の構成が想定と違います");
  console.log("\n2日目");
  let pe = 11 * 60 + 20;
  for (const p of DAY2_TIMES) {
    const st = p.h * 60 + p.m;
    const s = d2.spots.find((x) => x.id === p.id)!;
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs[0].mode}${p.legs[0].min} (前から${st - pe}分${st - pe !== p.legs[0].min ? " ⚠" : ""}) ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    pe = st + p.stay;
  }
  console.log(`${hm(HARIMAYA.h * 60 + HARIMAYA.m)}-${hm(HARIMAYA.h * 60 + HARIMAYA.m + HARIMAYA.stay)} walk${HARIMAYA.legs[0].min} (前から${HARIMAYA.h * 60 + HARIMAYA.m - pe}分) ${HARIMAYA.name}（足す）: ${HARIMAYA.memo}`);
  for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) console.log(`  2日目 ${all.find((s) => s.id === id)?.name}: …${apply(id, edits).slice(-90)}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [YUSUHARA] });
      await setDaySpotOrder(
        DAY2_ID,
        [
          ...d2.spots.map((s) => {
            const p = DAY2_TIMES.find((x) => x.id === s.id);
            return { id: s.id, data: { ...(p ? timeLegs(p.h, p.m, p.stay, p.legs) : {}), ...(DAY2_MEMO_EDITS[s.id] ? { memo: apply(s.id, DAY2_MEMO_EDITS[s.id]) } : {}) } };
          }),
          { create: { name: HARIMAYA.name, visitTime: t(HARIMAYA.h, HARIMAYA.m), stayDurationMin: HARIMAYA.stay, transitLegs: { create: legsCreate(HARIMAYA.legs) }, lat: HARIMAYA.lat, lng: HARIMAYA.lng, address: HARIMAYA.address, memo: HARIMAYA.memo } },
        ] as never,
        { tx }
      );
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
