/**
 * 初日・最終日の見直し #165 73d0b93a「西湖・本栖湖も。五つの湖を巡る富士五湖のんびりドライブ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は車の時間が道のりより長すぎた2区間を直し、終わりが早くなるので決まり③で大石公園を足す（企画運営 10/30）
 * いまの初日（6か所）: 新倉山浅間公園 9:30 → 花の都公園 → 忍野八海（昼食）→ 長池親水公園 → 河口浅間神社 → 産屋ヶ崎 15:52〜16:30
 * 直した初日（6か所のまま。どれも説明文にあるので外さない）: 河口湖駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車で約15分 →
 *   新倉山浅間公園 11:30 → 花の都公園 12:35 → 忍野八海（昼食 13:15〜14:15）→ 長池親水公園 14:35 → 河口浅間神社 15:30 → 産屋ヶ崎 16:09〜16:34
 *   車: もとの値が OSRM 以上で ×1.5＋5 以内なのでそのまま。河口浅間神社→産屋ヶ崎だけ OSRM 4分＋駐車で 9分（12→9）
 *   滞在はどれも、もとより短い（新倉山 60→40、花の都 60→30、忍野 80→60、長池 30→15、河口浅間 45→30、産屋ヶ崎 38→25）
 * 2日目: 鳴沢氷穴→西湖野鳥の森 OSRM 5分＋駐車で 10分（13→10）、根場→精進湖 OSRM 8分＋駐車で 13分（20→13）。滞在は変えない。
 *   本栖湖→世界遺産センター OSRM 19分＋駐車で24分（35→24。もとは ×1.5＋5 を超える）。終わりが16:09になるので、決まり③で河口湖の北岸の大石公園を足す（16:26〜16:41）。
 *   大石公園のメモは山梨県の公式観光サイト（yamanashi-kankou.jp/kankou/spot/p_8334.html）の事実だけ。帰りの一文を世界遺産センターから大石公園へ移す。
 *   説明文の「富士山世界遺産センターで締めくくる」を「富士山世界遺産センターに寄って、河口湖の大石公園で締めくくる」に（最後の行き先が変わるため）
 * 座標（itinerary-rules 7章）: 新倉山浅間公園 → 公園の面の中心をやめ、メモにある node 6859319785「展望デッキ」／花の都公園 → 公園の面をやめ、同じ名前の建物 way 182494796／
 *   長池親水公園・世界遺産センターは今の値のまま（公園 way 182491499 の Nominatim 値＝湖沿いの細長い公園で中心が歩ける道の上、センター＝OSM relation 17259559 の Nominatim 値。法務 10/30）／
 *   大石公園（足す）→ 公園の中の node 2290171630「河口湖自然生活館」（公園の面の中心は使わない）
 *   西湖野鳥の森公園は、自然保護区の面の Nominatim 値のまま（中に名前の点がなく、地理院も大字だけ。企画運営の例外 10/30）
 *   ほかは確かめたうえでそのまま（忍野八海・産屋ヶ崎・富岳風穴・鳴沢氷穴・根場・精進湖（他手合浜）・本栖湖＝OSM node、河口浅間神社＝way）
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-165-73d0b93a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "73d0b93a-5979-41c5-8d67-3cdf7bbbf1da";
const DAY1_ID = "ad81b529-2934-48c9-99d6-296f4cee19e2";
const DAY2_ID = "eda82995-2f3b-4536-9c3f-ad73abe492bf";
const ARAKURA = "9c078f26-9a3c-480f-a240-d8c3777f7c92";
const HANANOMIYAKO = "e680b5fa-8618-4904-a924-047e684f09d8";
const OSHINO = "464dbc58-3067-468a-b7f4-c9ab55a5b9ca";
const NAGAIKE = "bb51d79f-3462-46d4-8876-5ed8a8d529d2";
const KAWAGUCHI_SENGEN = "63710773-ccfe-444d-8c8d-238479758e4c";
const UBUYAGASAKI = "f6f2b5e9-9e7e-4861-a732-5b6a9c505fe7";
const FUGAKU = "ad06008d-80fc-4146-a823-bc476a75017b";
const NARUSAWA = "83d70ab9-983f-4159-b26b-1b428b8191fc";
const YACHO = "69291d4b-62a3-4842-a1d7-547d841a3f00";
const NENBA = "706b0eee-2f3f-464f-a18e-9b8e2d6b6627";
const SHOJI = "9369374b-9ac4-49df-9363-ebedde33a434";
const MOTOSU = "9ad4bccb-35f7-437f-a19b-26e60473ffb9";
const CENTER = "e6caea9a-2352-4548-b8f3-19593b314371";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const DESC_FROM = "本栖湖をたずね、富士山世界遺産センターで締めくくる、";
const DESC_TO = "本栖湖をたずね、富士山世界遺産センターに寄って、河口湖の大石公園で締めくくる、";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [ARAKURA]: [
    {
      from: "富士急行線の河口湖駅の近くでレンタカーを借りて、車で約15分。",
      to: "富士急行線の河口湖駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約15分。",
    },
  ],
  [UBUYAGASAKI]: [{ from: "河口浅間神社から車で約12分。", to: "河口浅間神社から車で約9分。" }],
  [YACHO]: [{ from: "鳴沢氷穴から車で約13分、", to: "鳴沢氷穴から車で約10分、" }],
  [SHOJI]: [{ from: "根場から車で約20分。", to: "根場から車で約13分。" }],
  [CENTER]: [
    { from: "本栖湖から車で約35分、", to: "本栖湖から車で約24分、" },
    { from: "帰りは、車で約5分の河口湖駅へ戻り、車を返しましょう。", to: "見学を終えたら、車で河口湖の北岸の大石公園へ向かいましょう。" },
  ],
};

const OISHI = {
  name: "大石公園",
  lat: 35.523108,
  lng: 138.745372,
  address: "山梨県南都留郡富士河口湖町大石2585",
  memo: "山梨県立富士山世界遺産センターから車で約17分。河口湖の北岸にある公園で、湖をはさんで富士山を眺められます。園内の全長350mの「花街道」には季節ごとの花が咲き、湖と富士山を眺めながら歩けます。帰りは、車で約15分の河口湖駅へ戻り、レンタカーを返しましょう。",
  h: 16,
  m: 26,
  stay: 15,
  legs: [car(17)],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: ARAKURA, h: 11, m: 30, stay: 40, legs: [] },
  { id: HANANOMIYAKO, h: 12, m: 35, stay: 30, legs: [car(25)] },
  { id: OSHINO, h: 13, m: 15, stay: 60, legs: [car(10)] },
  { id: NAGAIKE, h: 14, m: 35, stay: 15, legs: [car(20)] },
  { id: KAWAGUCHI_SENGEN, h: 15, m: 30, stay: 30, legs: [car(40)] },
  { id: UBUYAGASAKI, h: 16, m: 9, stay: 25, legs: [car(9)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: FUGAKU, h: 9, m: 30, stay: 40, legs: [] },
  { id: NARUSAWA, h: 10, m: 17, stay: 30, legs: [car(7)] },
  { id: YACHO, h: 10, m: 57, stay: 30, legs: [car(10)] },
  { id: NENBA, h: 11, m: 37, stay: 90, legs: [car(10)] },
  { id: SHOJI, h: 13, m: 20, stay: 30, legs: [car(13)] },
  { id: MOTOSU, h: 14, m: 5, stay: 40, legs: [car(15)] },
  { id: CENTER, h: 15, m: 9, stay: 60, legs: [car(24)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: ARAKURA, from: [35.500487, 138.80082], to: [35.501351, 138.801562] },
  { id: HANANOMIYAKO, from: [35.439554, 138.852855], to: [35.438735, 138.851835] },
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
  const show = (label: string, plan: typeof PLAN, spots: typeof d1.spots) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
    return prevEnd;
  };
  show("1日目（直したあと）", PLAN, d1.spots);
  const end = show("2日目（直したあと）", DAY2, d2.spots);
  const ost = OISHI.h * 60 + OISHI.m;
  console.log(`${hm(ost)}-${hm(ost + OISHI.stay)} car${OISHI.legs[0].min} (前から${ost - end}分) ${OISHI.name}（足す）: ${OISHI.memo}`);
  console.log(`\n説明文: …${DESC_FROM} → …${DESC_TO}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: typeof PLAN) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(DESC_FROM, DESC_TO) } });
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx });
      await setDaySpotOrder(
        DAY2_ID,
        [
          ...items(DAY2),
          { create: { name: OISHI.name, visitTime: t(OISHI.h, OISHI.m), stayDurationMin: OISHI.stay, transitLegs: { create: legsCreate(OISHI.legs) }, lat: OISHI.lat, lng: OISHI.lng, address: OISHI.address, memo: OISHI.memo } },
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
