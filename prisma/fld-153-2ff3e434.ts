/**
 * 初日・最終日の見直し #153 2ff3e434「甲斐善光寺と藤村記念館、甲府のもうひとつの歴史散歩1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・車。初日を11時ごろからにする（最終日は1泊2日なので時刻は今のまま）。#150 と同じ範囲（重なった文・「ください」・おすすめ・宿／帰りの一文・座標）も直す
 * いまの初日（6か所）: 甲斐善光寺 9:00 → 酒折宮 → 舞鶴城公園 → 県立美術館 → 県立文学館 → 県立考古博物館 14:53〜16:33（昼食の一文がない）
 * 直した初日（6か所のまま）: JR甲府駅に11時ごろ → 駅の近くでレンタカー（手続き15分ほど）→ 車で約10分 → 甲斐善光寺 11:25 → 酒折宮 → 舞鶴城公園 →
 *   甲府駅のまわりで昼食（13:20〜）→ 県立美術館 → 県立文学館 → 県立考古博物館 16:03〜16:30
 *   どこも外さない。車の時間はもとのまま（OSRM＋駐車の範囲に入る）。駅→善光寺は OSRM 4分→約10分
 *   考古博物館は 9:00〜17:00・入館16:30まで（16:03 に着く）
 *   滞在はどれも、もとより短い（善光寺 60→45分、酒折宮 45→30分、舞鶴城 60→30分、美術館 100→60分、文学館 50→30分、考古博物館 100→27分）
 * 文: 前のメモの終わりと同じ書き出し（「〇〇を見学したら、車で〜へ向かいましょう。」）を「〇〇から車で約N分。」に。「ご宿泊ください」「飲まないでください」
 *   「お出かけください」「心がけてください」「…のもおすすめです」を直す。2日目の最後に帰りの一文
 * 座標（itinerary-rules 7章）: 善光寺 way 168133506／酒折宮 way 226990067（約110m）／舞鶴城公園 → メモにある way 226826581「稲荷櫓」（公園の中心は使わない）／
 *   美術館 way 251145786（約150m）／文学館 way 251145788（約120m）／2日目 藤村記念館 way 226733915・甲州夢小路 way 226737900・大泉寺 way 226825157・
 *   信玄ミュージアム way 793329998（#132 と同じ点）・武田神社 way 226949641・積翠寺 way 226955431
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-153-2ff3e434.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2ff3e434-34a4-49d4-9f72-98240f94ce28";
const DAY1_ID = "02c4e262-4916-4748-872e-970e9fa133a7";
const ZENKOJI = "bc64d9c2-b970-40bf-9600-078839c65877";
const SAKAORI = "44a06ff9-784f-4dac-a37d-d8c5982e8987";
const MAIZURU = "b34e61e4-6b6d-4054-8de6-322fc283536c";
const BIJUTSU = "be4466c7-5315-4573-8c73-81c66e036005";
const BUNGAKU = "f198bc39-b85b-43b5-af17-0b7cf7f5ef96";
const KOKO = "c2fdb7f0-9320-4dc6-b6ce-8de3f36133ea";
const TOSON = "4bedf9b1-9030-4b56-83f3-77f728fecbd0";
const YUMEKOJI = "903c794c-2327-4690-a251-90e957963015";
const DAISENJI = "d0df46e1-f31d-4ef3-9e41-688093aca4de";
const SHINGEN = "ad8630b7-aedd-4176-8495-c032177a0aa9";
const TAKEDA = "f564d747-e46f-4978-a72c-96300ab149aa";
const SEKISUIJI = "9310014a-4603-4000-a5cb-c21b26374095";
const YOGAI = "ea99b41e-8a2c-4fd5-938c-2ab4cd77ca7f";
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
  [ZENKOJI]: [
    {
      from: "武田信玄が川中島の戦いのさなか、",
      to: "この旅は車でめぐります。JR甲府駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約10分。武田信玄が川中島の戦いのさなか、",
    },
  ],
  [SAKAORI]: [{ from: "甲斐善光寺を参拝したら、車で酒折宮へ向かいましょう。", to: "甲斐善光寺から車で約3分。" }],
  [MAIZURU]: [
    { from: "酒折宮を参拝したら、車で舞鶴城公園へ向かいましょう。", to: "酒折宮から車で約7分。" },
    { from: "見学を終えたら、車で山梨県立美術館へ向かいましょう。", to: "見学を終えたら、甲府駅のまわりで昼食にしてから、車で山梨県立美術館へ向かいましょう。" },
  ],
  [BIJUTSU]: [{ from: "舞鶴城公園を見学したら、車で山梨県立美術館へ向かいましょう。", to: "甲府駅のまわりから車で約8分。" }],
  [BUNGAKU]: [{ from: "山梨県立美術館を見学したら、歩いて山梨県立文学館へ向かいましょう。", to: "山梨県立美術館から歩いて約3分。" }],
  [KOKO]: [
    { from: "山梨県立文学館を見学したら、車で山梨県立考古博物館へ向かいましょう。", to: "山梨県立文学館から車で約17分。" },
    { from: "今夜はこの近くの宿にご宿泊ください。", to: "この夜は、甲府の宿に泊まりましょう。" },
  ],
};
const DAY2_MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [YUMEKOJI]: [
    { from: "藤村記念館を見学したら、歩いて甲州夢小路へ向かいましょう。", to: "藤村記念館から歩いて約2分。" },
    { from: "車を運転する人は、試飲もふくめてお酒を飲まないでください。", to: "車を運転する人は、試飲もふくめてお酒を飲まないようにしましょう。" },
    {
      from: "レトロな町並みを歩きながら、地元の食材を使った料理を味わえるお店で、昼食をとるのもおすすめです。",
      to: "レトロな町並みには、地元の食材を使った料理を味わえるお店もあります。",
    },
  ],
  [DAISENJI]: [{ from: "甲州夢小路を見学したら、車で大泉寺へ向かいましょう。", to: "甲州夢小路から車で約5分。" }],
  // 企画運営 10/30: 2日目の昼食の一文（12:31〜13:31。館内に食事のできるカフェがある。tabelog.com/yamanashi/A1901/A190101/19010969/）
  [SHINGEN]: [
    { from: "大泉寺を見学したら、車で信玄ミュージアムへ向かいましょう。", to: "大泉寺から車で約4分。" },
    { from: "武田家の歴史を、じっくりとたどりましょう。", to: "武田家の歴史を、じっくりとたどりましょう。館内には食事のできるカフェもあるので、このあたりで昼食にしましょう。" },
  ],
  [TAKEDA]: [{ from: "信玄ミュージアムを見学したら、歩いて武田神社へ向かいましょう。", to: "信玄ミュージアムから歩いて約3分。" }],
  [SEKISUIJI]: [{ from: "武田神社を参拝したら、車で積翠寺へ向かいましょう。", to: "武田神社から車で約8分。" }],
  [YOGAI]: [
    { from: "積翠寺を参拝したら、車で要害山の登山口へ向かいましょう。", to: "積翠寺から車で約3分、要害山の登山口へ。" },
    { from: "歩きやすい靴でお出かけください。", to: "歩きやすい靴で出かけましょう。" },
    { from: "暗くなる前に下山するよう心がけてください。", to: "暗くなる前に下山するよう心がけましょう。" },
    { from: "甲斐善光寺と藤村記念館、甲府のもうひとつの歴史散歩は、これで終わりです。", to: "帰りは、車で甲府駅へ戻りましょう。" },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: ZENKOJI, from: [35.666, 138.592917], to: [35.665931, 138.592895] },
  { id: SAKAORI, from: [35.660152, 138.596115], to: [35.661029, 138.596589] },
  { id: MAIZURU, from: [35.664619, 138.569717], to: [35.665984, 138.572021] },
  { id: BIJUTSU, from: [35.661633, 138.537735], to: [35.660283, 138.537471] },
  { id: BUNGAKU, from: [35.66048, 138.53804], to: [35.660174, 138.539335] },
  { id: TOSON, from: [35.6675, 138.5686], to: [35.667814, 138.570054] },
  { id: YUMEKOJI, from: [35.667618, 138.570145], to: [35.666857, 138.571393] },
  { id: DAISENJI, from: [35.675903, 138.580048], to: [35.676997, 138.580891] },
  { id: SHINGEN, from: [35.685463, 138.576904], to: [35.685253, 138.577136] },
  { id: TAKEDA, from: [35.68697, 138.576736], to: [35.686703, 138.57739] },
  { id: SEKISUIJI, from: [35.702633, 138.591904], to: [35.701962, 138.591431] },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[]; gap?: number }[] = [
  { id: ZENKOJI, h: 11, m: 25, stay: 45, legs: [] },
  { id: SAKAORI, h: 12, m: 13, stay: 30, legs: [car(3)] },
  { id: MAIZURU, h: 12, m: 50, stay: 30, legs: [car(7)] },
  { id: BIJUTSU, h: 14, m: 13, stay: 60, legs: [car(8)], gap: 45 },
  { id: BUNGAKU, h: 15, m: 16, stay: 30, legs: [walk(3)] },
  { id: KOKO, h: 16, m: 3, stay: 27, legs: [car(17)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0) + (p.gap ?? 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${p.gap ? `（その前に昼食${p.gap}分）` : ""}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + apply(p.id, MEMO_EDITS[p.id]) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) console.log(`\n2日目 ${all.find((s) => s.id === id)?.name}: ${apply(id, edits).slice(0, 40)}…${apply(id, edits).slice(-40)}`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log("\n2日目は時刻を変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      for (const [id, edits] of Object.entries(DAY2_MEMO_EDITS)) await tx.spot.update({ where: { id }, data: { memo: apply(id, edits) } });
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
