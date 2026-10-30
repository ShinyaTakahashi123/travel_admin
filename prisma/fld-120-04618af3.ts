/**
 * 初日・最終日の見直し #120 04618af3「角島大橋と元乃隅神社、下関近郊の絶景ドライブ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 車は OSRM、歩きは routed-foot（もとの値が ×1.5＋5 の内側ならそのまま、新しい区間・外れる区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 新下関駅 10:30ごろ → レンタカー（手続き15分）→ 車60（39.6、もとのまま）→ 角島大橋 11:45（35→25）→ 車10（5.0）→
 *   【新】しおかぜの里角島のまわり 12:20〜13:10（昼食。OSM「しおかぜの里角島」node 4674657021（法務・企画運営）。山口県観光 https://yamaguchi-tourism.jp/blog/detail_163.html
 *   「レストラン フレッシュしおかぜの里 … 下関市豊北町大字角島853-4（しおかぜの里角島内）」。もとは大浜の文に「このあたりには食事処もある」だけ）→ 車8（2.7）→
 *   角島灯台 13:18（70→40）→ 歩3 → 夢崎波公園 14:01（45→20）→ 歩3で灯台の車＋車7（1.5。もと歩13。灯台に車をとめているため）→ 角島大浜海水浴場 14:31（65→30）→
 *   車13（7.7。もと5）→ 牧崎 15:14（70→30）→ 車21（15.9。もと14）→ 土井ヶ浜遺跡・人類学ミュージアム 16:05（65→30）→ 車4（2.6）→ 道の駅北浦街道ほうほく 16:39〜16:59（35→20）
 * 2日目（16:39 に出るのはもとのまま）: 宿 → 車35 → 東後畑棚田 9:30 → 車11（5.8。もと4）→ 元乃隅神社 10:31（60→55）→ 歩2 → 龍宮の潮吹き 11:28（25→20）→ 車12（6.8。もと5）→
 *   千畳敷 12:00（55→30）→ 車23（17.2）→【新】仙崎駅のまわり 12:53〜13:43（昼食。バス停「仙崎駅前」node 3498204585。まわりに OSM の食事処の点 きらく・よ志乃・江戸屋・
 *   すし楽・浜屋 など。もとは青海島の文に「このあたりには食事処もある」だけ）→ 歩6（394m）→ 金子みすゞ記念館 13:49 → 歩10（711m）→ 青海島（青海島観光汽船の乗り場）14:49（90→50。乗り場から島を望み、観光船は「時間があれば」。一周およそ1時間20分＝山口県観光 https://yamaguchi-tourism.jp/spot/detail_13625.html、企画運営）→
 *   歩7で仙崎駅前の車＋車12（6.8）→ 長門湯本温泉 15:58〜16:39（55→41）→ 車70（50.6、もとのまま）で新下関駅、レンタカーを返す（15分）
 *   （みすゞ記念館と青海島の順を入れ替え。青海島はメモの観光船の乗り場の点にして、仙崎から歩いて回る）
 * 点: 角島大橋＝OSM「角島大橋」bridge way 1556044332（Nominatim）／夢崎波公園＝OSM「夢崎波の公園」park way 669623168 の node 6270746753（いまは道の上の点）／
 *   牧崎＝OSM「牧崎風の公園」attraction node 6405781188（いまは「牧崎」の地名の点）／青海島＝OSM「青海島觀光汽船」ferry_terminal node 6334563355（いまは島の道の上の点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-120-04618af3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "04618af3-ab4f-45eb-9a75-fe1e12e8ed7e";
const DAY1_ID = "be007d86-542a-4a9d-8f68-05e9c78b5da2";
const DAY2_ID = "3b43a329-1c13-409f-a01b-b8bf835351c8";
const BRIDGE = "e2db154b-9945-49dd-b34d-8c611d7d029e";
const TODAI = "452ec41e-f082-4903-baeb-6bd247bb6ef0";
const YUME = "241f6213-642b-41ea-9bf8-3ee842a710a6";
const OHAMA = "cccebc89-449b-43da-bbce-4c7c5c546d63";
const MAKI = "83bb885c-c46f-4ded-bc3d-f2184f43ff11";
const DOI = "c438e45e-936c-470b-bc05-54a73886f3d2";
const HOHOKU = "2c0983b2-23d7-4567-b3e3-ae1badc50d09";
const HIGASHI = "7b5ca788-2b28-4b48-91d4-1ac5d45509d9";
const MOTO = "c37f20cd-66c2-4f5e-9199-5fa614a179f9";
const SHIO = "2cf9f54e-f03e-43fa-beb2-3169695703b4";
const SENJO = "ff39b8c2-1ebe-4af1-a3d1-dca4722ce11a";
const OMI = "dbba3243-1618-4425-a1b3-5e1f09e66111";
const MISUZU = "248bbe5a-b519-4b65-bdf9-4f346ef02b3d";
const YUMOTO = "e7ba654b-8a16-446d-99e7-b95eab9749a7";
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
  [BRIDGE]: { from: [34.352375, 130.887219], to: [34.351329, 130.889031] },
  [YUME]: { from: [34.353843, 130.840813], to: [34.353826, 130.841718] },
  [MAKI]: { from: [34.374024, 130.867046], to: [34.371906, 130.870148] },
  [OMI]: { from: [34.418009, 131.193623], to: [34.388788, 131.203122] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const LUNCH1 = "new-shiokaze";
const LUNCH2 = "new-senzaki";
const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "しおかぜの里角島のまわり（昼食）",
    lat: 34.35449,
    lng: 130.858584,
    address: "山口県下関市豊北町大字角島",
    memo: "角島大橋から車でおよそ10分。島の中ほどにあるしおかぜの里角島には食事処もあるので、ここで昼食をとりましょう。食事を終えたら、車でおよそ8分、角島灯台へ向かいましょう。",
  },
  [LUNCH2]: {
    name: "仙崎駅のまわり（昼食）",
    lat: 34.388212,
    lng: 131.19863,
    address: "山口県長門市仙崎",
    memo: "千畳敷から車でおよそ23分。仙崎駅のまわりには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、車をとめたまま、歩いておよそ6分、金子みすゞ記念館へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [BRIDGE]: [
    { from: "新下関駅前でレンタカーを借り、車でおよそ1時間、", to: "JR新下関駅に10時半ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車でおよそ1時間、" },
    { from: "この後は、車でおよそ8分、角島灯台へ向かいましょう。", to: "この後は、車でおよそ10分、しおかぜの里角島のまわりで昼食にしましょう。" },
  ],
  [TODAI]: [{ from: "角島大橋から車でおよそ8分、", to: "しおかぜの里角島のまわりから車でおよそ8分、" }],
  [YUME]: [
    { from: "この後は、歩いておよそ13分、角島大浜海水浴場へ向かいましょう。", to: "この後は、歩いておよそ3分で角島灯台にとめた車に戻り、車でおよそ7分、角島大浜海水浴場へ向かいましょう。" },
  ],
  [OHAMA]: [
    { from: "夢崎波公園から歩いておよそ13分、", to: "夢崎波公園から歩いておよそ3分で車に戻り、車でおよそ7分、" },
    { from: "このあたりには食事処もあるので、昼食をとりましょう。", to: "" },
    { from: "この後は、車でおよそ5分、牧崎へ向かいましょう。", to: "この後は、車でおよそ13分、牧崎へ向かいましょう。" },
  ],
  [MAKI]: [
    { from: "角島大浜海水浴場から車でおよそ5分、", to: "角島大浜海水浴場から車でおよそ13分、" },
    { from: "この後は、車でおよそ14分、", to: "この後は、車でおよそ21分、" },
  ],
  [DOI]: [
    { from: "牧崎から車でおよそ14分、", to: "牧崎から車でおよそ21分、" },
    { from: "弥生時代の人々の暮らしに、思いをめぐらせながら、静かに見学しましょう。", to: "弥生時代の人々の暮らしに、思いをめぐらせながら、静かに見学しましょう。墓地の遺跡のまわりでは、静かに過ごしましょう。" },
  ],
  [HIGASHI]: [{ from: "この後は、車でおよそ3分、元乃隅神社へ向かいましょう。", to: "この後は、車でおよそ11分、元乃隅神社へ向かいましょう。" }],
  [MOTO]: [
    { from: "東後畑棚田から車でおよそ3分、", to: "東後畑棚田から車でおよそ11分、" },
    { from: "日本海を望む絶景を眺めてみましょう。", to: "日本海を望む絶景を眺めましょう。" },
    { from: "今も参拝の対象となっている神社ですので、境内では静かに、敬意を持ってお参りしましょう。", to: PRAY_TO },
  ],
  [SHIO]: [{ from: "この後は、車でおよそ5分、千畳敷へ向かいましょう。", to: "この後は、車でおよそ12分、千畳敷へ向かいましょう。" }],
  [SENJO]: [
    { from: "龍宮の潮吹きから車でおよそ5分、", to: "龍宮の潮吹きから車でおよそ12分、" },
    { from: "この後は、車でおよそ15分、青海島へ向かいましょう。", to: "この後は、車でおよそ23分、仙崎駅のまわりで昼食にしましょう。" },
  ],
  [MISUZU]: [
    { from: "青海島から車でおよそ6分、", to: "仙崎駅のまわりから歩いておよそ6分、" },
    { from: "ゆっくり味わってみましょう。", to: "ゆっくり味わいましょう。" },
    { from: "この後は、車でおよそ12分、長門湯本温泉へ向かいましょう。", to: "この後は、歩いておよそ10分、青海島観光汽船の乗り場へ向かいましょう。" },
  ],
  [OMI]: [
    { from: "千畳敷から車でおよそ15分、青海島に着きます。", to: "金子みすゞ記念館から歩いておよそ10分、青海島観光汽船の乗り場に着きます。" },
    {
      from: "自然研究路を歩いて景色を楽しむほか、観光船に乗って海上からその景観を眺めることもできます。",
      to: "乗り場からは青海島の姿を望めます。時間があれば、観光船に乗って海上からその景観を眺めることもできます（一周コースはおよそ1時間20分）。",
    },
    {
      from: "このあたりには食事処もあるので、昼食をとりましょう。静かに景色を楽しみましょう。この後は、車でおよそ6分、金子みすゞ記念館へ向かいましょう。",
      to: "静かに景色を楽しみましょう。この後は、歩いておよそ7分で仙崎駅のまわりにとめた車に戻り、車でおよそ12分、長門湯本温泉へ向かいましょう。",
    },
  ],
  [YUMOTO]: [
    { from: "金子みすゞ記念館から車でおよそ12分、", to: "青海島観光汽船の乗り場から歩いておよそ7分で車に戻り、車でおよそ12分、" },
    { from: "ゆっくり湯につかってみましょう。", to: "ゆっくり湯につかりましょう。" },
    {
      from: "見学を終えたら、車でおよそ1時間10分、新下関駅でレンタカーを返し、",
      to: "見学を終えたら、車でおよそ1時間10分の新下関駅でレンタカーを返し（返す手続きに15分ほど）、",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: BRIDGE, h: 11, m: 45, stay: 25, legs: [] },
  { id: LUNCH1, h: 12, m: 20, stay: 50, legs: [car(10)] },
  { id: TODAI, h: 13, m: 18, stay: 40, legs: [car(8)] },
  { id: YUME, h: 14, m: 1, stay: 20, legs: [walk(3)] },
  { id: OHAMA, h: 14, m: 31, stay: 30, legs: [walk(3), car(7)] },
  { id: MAKI, h: 15, m: 14, stay: 30, legs: [car(13)] },
  { id: DOI, h: 16, m: 5, stay: 30, legs: [car(21)] },
  { id: HOHOKU, h: 16, m: 39, stay: 20, legs: [car(4)] },
];
const DAY2: Plan = [
  { id: HIGASHI, h: 9, m: 30, stay: 50, legs: [] },
  { id: MOTO, h: 10, m: 31, stay: 55, legs: [car(11)] },
  { id: SHIO, h: 11, m: 28, stay: 20, legs: [walk(2)] },
  { id: SENJO, h: 12, m: 0, stay: 30, legs: [car(12)] },
  { id: LUNCH2, h: 12, m: 53, stay: 50, legs: [car(23)] },
  { id: MISUZU, h: 13, m: 49, stay: 50, legs: [walk(6)] },
  { id: OMI, h: 14, m: 49, stay: 50, legs: [walk(10)] },
  { id: YUMOTO, h: 15, m: 58, stay: 41, legs: [walk(7), car(12)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [BRIDGE, TODAI, YUME, OHAMA, MAKI, DOI, HOHOKU].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [HIGASHI, MOTO, SHIO, SENJO, OMI, MISUZU, YUMOTO].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）${s.stayDurationMin != null && p.stay > s.stayDurationMin ? " ⚠滞在がもとより長い" : ""}`);
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
    plan.map((p) =>
      NEW[p.id]
        ? {
            create: {
              name: NEW[p.id].name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: NEW[p.id].lat,
              lng: NEW[p.id].lng,
              address: NEW[p.id].address,
              memo: NEW[p.id].memo,
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
