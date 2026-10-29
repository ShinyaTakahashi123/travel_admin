/**
 * 初日・最終日の見直し #144 43d3f547「伏見稲荷から平等院へ。朱と新緑に包まれる伏見・宇治めぐり」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・春。初日を11時ごろからにする。2日目は移動の時間が道のりと合っていなかったので、企画運営の指示（10/30「内容の誤りとして直す」）で直す
 * 座標: 低いけたの点が多く、OSM の点から160m〜1.35km 離れていたので、先に OSM の名前つきの地物に直し、その点で道のり（routing.openstreetmap.de の foot）を測った
 *   源氏物語ミュージアム → node 1422963059／宇治上神社 → way 332816179／三室戸寺 → way 1290236509／萬福寺（外す）／
 *   寺田屋 → way 149171918／十石舟 → node 1621849310「十石舟乗船場」（man_made=pier）／藤森神社 → way 368465614（約1.35km）／石峰寺 → node 679839853／
 *   伏見稲荷大社 → way 899425893「本殿」（いまの点は境内の外。landuse の中心は使わない）。平等院・興聖寺・月桂冠・長建寺・御香宮は OSM と同じ
 * 1日目（6か所 → 5か所）: JR宇治駅に11時ごろ → 歩いて約11分 → 平等院 11:11 → 源氏物語ミュージアム（このあと昼食）→ 三室戸寺 → 宇治上神社 → 興聖寺 15:45〜16:30
 *   三室戸寺は 11〜3月の最終受付 15:10・閉門16:00、4〜10月は最終受付15:40・16:30（banzokubiology.com ほか）。季節は春（3月も入る）なので、昼食のすぐあとに入れる
 *   萬福寺を外す（三室戸寺のあとでは受付16:30に間に合わない。タイトル・説明文に出てこない。写真1枚は表紙ではなく、スポットといっしょに外れる）
 *   歩き: 駅→平等院 845m・約11分、平等院→源氏 917m・約12分、源氏→三室戸寺 1,218m・約16分（その前に昼食45分）、三室戸寺→宇治上 1,507m・約20分、宇治上→興聖寺 803m・約11分
 *   滞在はどれも、もとより短い（平等院 60→50分、源氏 65→40分、三室戸寺 70→50分、宇治上 75→30分、興聖寺 55→45分）
 * 2日目（8か所のまま）: 寺田屋 9:00 → 十石舟 → 月桂冠大倉記念館 → 長建寺 → 御香宮神社（このあと昼食）→ 京阪で墨染 → 藤森神社 → 石峰寺 → 伏見稲荷大社 15:00〜16:30（終わりは今より遅くならない）
 *   歩き: 寺田屋→乗船場 487m・7分（5→7）、乗船場→月桂冠 43m・2分（10→2）、月桂冠→長建寺 735m・10分（3→10。濠川を橋で渡る）、長建寺→御香宮 1,241m・17分（15→17）、
 *     御香宮→藤森（伏見桃山駅へ414m・約6分＋京阪で墨染＋墨染駅から479m・約7分、あわせて約20分。15→20。その前に昼食45分）、藤森→石峰寺 2,183m・29分（5→29）、石峰寺→稲荷 468m・6分（5→6）
 *   もとは昼食の時間がなかったので、御香宮のあとに45分とる。伏見稲荷は「往復およそ90分」のメモに合わせて90分のまま。ほかの滞在は短くした
 * 文: 「〜てみてください」「ご利用ください」「飲まないでください」を直す（「ください」は祈りの一文だけ）。宿の一文を興聖寺へ
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-144-43d3f547.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "43d3f547-91a7-407f-8e80-c52a09458501";
const DAY1_ID = "6bbecd7f-c836-4d4f-9d8e-53e3110ab660";
const DAY2_ID = "e6e210c4-9906-490b-930e-349d0b35b3a6";
const BYODOIN = "e0ecdeb3-2b7e-4d8f-b4ee-6ff159d9deb6";
const GENJI = "911cd1e1-28ed-415d-bbb9-911f44681082";
const UJIGAMI = "9a417215-bb3e-4c5e-9eda-f54f72f785f6";
const KOSHOJI = "534a146f-9c81-42b3-95a4-44b95061a0b5";
const MIMUROTO = "719e3575-8e73-4880-b64d-25b7120d6fdd";
const MANPUKU = "cc049b3c-c18f-4198-83b7-b46bc456b920";
const TERADAYA = "1a127aaa-57cd-4bba-bc97-5e20a1209395";
const JIKKOKU = "61ad7edf-ef07-4a96-977b-c5f1434ccc04";
const GEKKEIKAN = "a9829837-55d3-4849-a067-46b6141960a7";
const CHOKENJI = "a07adae1-412d-4b4f-8498-a7625ecae02b";
const GOKONOMIYA = "605f90c8-0b56-44a3-b3a3-04abbfc8a099";
const FUJINOMORI = "33b4b898-0119-423f-bb7c-77e9c1e8b0a9";
const SEKIHOJI = "1f5124ca-e6d5-4053-9e62-c214fea49f64";
const INARI = "3dbaf111-c408-4273-ac47-12b4bb74ac09";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[]; gap?: number }[];
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [BYODOIN]: [
    { from: "『源氏物語』の舞台としても知られる、", to: "この旅は電車と歩きでめぐります。JR宇治駅に11時ごろ着いたら、歩いて約11分。『源氏物語』の舞台としても知られる、" },
    { from: "朝の静けさの中、池に姿を映す鳳凰堂の眺めを楽しんでみてください。", to: "池に姿を映す鳳凰堂の眺めを、ゆっくり楽しみましょう。" },
  ],
  [GENJI]: [{ from: "この後は、宇治橋界隈で昼食を済ませてから、宇治上神社へ向かいましょう。", to: "この後は、近くで昼食を済ませてから、歩いて三室戸寺へ向かいましょう。" }],
  [KOSHOJI]: [
    { from: "静かな境内を歩きながら、禅寺ならではの凛とした空気を感じてみてください。", to: "静かな境内を歩き、禅寺ならではの凛とした空気を感じましょう。" },
    { from: "参拝の際は、敬意を込めて手を合わせましょう。", to: "参拝の際は、敬意を込めて手を合わせましょう。この夜は、宇治の宿に泊まりましょう。" },
  ],
  [GEKKEIKAN]: [{ from: "車を運転する人は飲まないでください。", to: "車を運転する人は飲まないようにしましょう。" }],
  [INARI]: [{ from: "帰りは、JR稲荷駅や京阪伏見稲荷駅をご利用ください。", to: "帰りは、JR稲荷駅か京阪伏見稲荷駅から帰りましょう。" }],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: GENJI, from: [34.8916, 135.8069], to: [34.894103, 135.810169] },
  { id: UJIGAMI, from: [34.8912, 135.8098], to: [34.892053, 135.811457] },
  { id: MIMUROTO, from: [34.8965, 135.8214], to: [34.899781, 135.818701] },
  { id: TERADAYA, from: [34.9328, 135.7621], to: [34.930286, 135.759557] },
  { id: JIKKOKU, from: [34.9335, 135.7627], to: [34.928465, 135.761521] },
  { id: FUJINOMORI, from: [34.9622, 135.7695], to: [34.950184, 135.771701] },
  { id: SEKIHOJI, from: [34.9636, 135.7724], to: [34.96472, 135.774862] },
  { id: INARI, from: [34.9671, 135.7727], to: [34.967173, 135.773355] },
];

const DAY1_PLAN: Plan = [
  { id: BYODOIN, h: 11, m: 11, stay: 50, legs: [] },
  { id: GENJI, h: 12, m: 13, stay: 40, legs: [walk(12)] },
  { id: MIMUROTO, h: 13, m: 54, stay: 50, legs: [walk(16)], gap: 45 },
  { id: UJIGAMI, h: 15, m: 4, stay: 30, legs: [walk(20)] },
  { id: KOSHOJI, h: 15, m: 45, stay: 45, legs: [walk(11)] },
];
const DAY2_PLAN: Plan = [
  { id: TERADAYA, h: 9, m: 0, stay: 38, legs: [] },
  { id: JIKKOKU, h: 9, m: 45, stay: 41, legs: [walk(7)] },
  { id: GEKKEIKAN, h: 10, m: 28, stay: 35, legs: [walk(2)] },
  { id: CHOKENJI, h: 11, m: 13, stay: 20, legs: [walk(10)] },
  { id: GOKONOMIYA, h: 11, m: 50, stay: 30, legs: [walk(17)] },
  { id: FUJINOMORI, h: 13, m: 25, stay: 30, legs: [train(20, "京阪本線（伏見桃山→墨染）")], gap: 45 },
  { id: SEKIHOJI, h: 14, m: 24, stay: 30, legs: [walk(29)] },
  { id: INARI, h: 15, m: 0, stay: 90, legs: [walk(6)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [BYODOIN, GENJI, UJIGAMI, KOSHOJI, MIMUROTO, MANPUKU].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_PLAN.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  for (const ph of d1.spots.find((x) => x.id === MANPUKU)!.photos) {
    if (ph.url === it.thumbnailUrl) throw new Error("外すスポットの写真が表紙です");
    console.log(`外すスポットの写真（スポットといっしょに外れる）: ${ph.id}`);
  }
  const all = [...d1.spots, ...d2.spots];
  const memoOf = (id: string) => {
    let m = all.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const build = (plan: Plan) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  const days: [string, Plan][] = [
    ["1日目", DAY1_PLAN],
    ["2日目", DAY2_PLAN],
  ];
  for (const [label, plan] of days) {
    console.log(`\n${label}（直したあと）`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0) + (p.gap ?? 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${p.gap ? `（その前に昼食${p.gap}分）` : ""}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
      prevEnd = st + p.stay;
    }
  }
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log(`\n外すスポット: ${MANPUKU}（萬福寺）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, build(DAY1_PLAN) as never, { tx, remove: [MANPUKU] });
      await setDaySpotOrder(DAY2_ID, build(DAY2_PLAN) as never, { tx });
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
