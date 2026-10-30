/**
 * 初日・最終日の見直し #116 c4f58fdd「田沢湖の伝説と乳頭温泉郷の湯めぐりを楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 車は OSRM、歩きは routed-foot（もとの値が ×1.5＋5 の内側ならそのまま、新しい区間・外れる区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 田沢湖駅 10:30ごろ → レンタカー（手続き15分）→ 車22（16.3。もと15）→ たつこ像 11:07（40→20）→ 車10（5.9）→ 御座石神社 11:37（60→15）→ 歩15（785m・10.5）→
 *   たつこの鏡岩 12:07（55→25）→ 歩15で御座石神社の車＋車8（2.4。法務）→ 姫観音像 12:55（60→15）→ 車9（3.2）→【新】田沢湖畔 13:19〜14:09（昼食。バス停「田沢湖畔」node 6813397693、
 *   まわりに田沢湖レストハウス・おみやげプラザ・田沢湖グリーンガーデン・いろり などの食事処の点。企画運営: もとは姫観音像で昼食）→ 車17（11.4）→ アルパこまくさ 14:26（90→72）→ 車12（6.7。もと25）→
 *   乳頭温泉郷 15:50〜16:30（40）→ 乳頭温泉郷の宿
 * 2日目（16:45 に出る。もとは 16:50）: 宿 → 車39（OSRM 34.0、抱返り神社の近くの駐車場 way 473481118 まで）＋歩24（1,779m）→ 抱返り渓谷（回顧の滝）9:30（95→50）→
 *   歩24＋車18（12.6）→ 角館樺細工伝承館 11:02（60→40）→ 歩17（1,265m）→【新】外町のまわり 11:59〜12:49（昼食。もとは伝承館の文に「昼食をとってから見学するのもよいでしょう」）→
 *   歩4（265m）→ 新潮社記念文学館 12:53（80→70）→ 歩16（1,197m。もと12）→ 桧木内川堤 14:19（70→50）→ 歩6（399m。もと5）→ 角館武家屋敷通り 15:15〜16:45（90）→
 *   歩4（261m）で伝承館のまわりの車 → 車8（2.8）で角館駅、レンタカーを返す（15分）
 *   （もとの「車でおよそ50分」は回顧の滝の点まで。OSRM は滝の点を約550m離れた道に寄せて 37.6分などと出るので、駐車場までの車と遊歩道の歩きに分けた）
 * 点: 乳頭温泉郷＝OSM バス停「乳頭温泉郷 大釜温泉」node 14168693101（いまは県道の上の点。OSM にはほかに温泉郷の名前の点がない）／
 *   桧木内川堤＝「桜並木ポケットパーク」node 7454945415（#114 と同じ点、法務 10/30）／外町（昼食）＝OSM「旧角館製糸工場」way 1106089254（#114 と同じ点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-116-c4f58fdd.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c4f58fdd-c24a-481e-bf8a-7cca2332f728";
const DAY1_ID = "739aa665-b7b0-497e-aa93-13372711a12b";
const DAY2_ID = "c1ebc995-ab6e-43ab-a513-8c2fc27bf0d8";
const TATSUKO = "4699a6b3-f7cf-4dc9-925b-fdb0456713ac";
const GOZA = "4224154a-7eaf-4e17-809e-805380df8019";
const KAGAMI = "6e95e3f7-ee3c-4231-8874-bcc0b0b57eb6";
const HIME = "4cff4e2e-58bc-4f6b-903a-08803d087804";
const ALPA = "a6791594-77bb-46cd-a3a0-139e5b0bafd2";
const NYUTO = "406c5fca-d90a-4d88-aac4-cda4064d23ab";
const DAKI = "4a753758-ea89-4502-9fe3-2898e0ba9ff2";
const KABA = "f60ebc8a-dd66-4885-81a8-99a19452ba17";
const BUNGAKU = "dcefb997-5810-4d54-af98-c0f0ce801c5e";
const HINOKI = "b26e7e38-8a8c-4c25-8331-1da2d58e4ffa";
const BUKE = "470ead58-c938-4803-83b7-310d45bca076";
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
  [NYUTO]: { from: [39.803725, 140.791423], to: [39.804844, 140.796649] },
  [HINOKI]: { from: [39.599654, 140.558631], to: [39.599657, 140.55985] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const LUNCH = "new-tomachi";
const LUNCH1 = "new-kohan";
const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "田沢湖畔（昼食）",
    lat: 39.73066,
    lng: 140.699382,
    address: "秋田県仙北市田沢湖",
    memo: "姫観音像から車でおよそ9分。湖の東岸の田沢湖畔には食事処が集まっているので、ここで昼食をとりましょう。食事を終えたら、車でおよそ17分、田沢湖高原のアルパこまくさへ向かいましょう。",
  },
  [LUNCH]: {
    name: "外町のまわり（昼食）",
    lat: 39.590672,
    lng: 140.565288,
    address: "秋田県仙北市角館町",
    memo: "角館樺細工伝承館から歩いておよそ17分。かつての商人の町・外町のまわりには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ4分、新潮社記念文学館へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TATSUKO]: [
    {
      from: "JR田沢湖駅前でレンタカーを借りて、車でおよそ15分、",
      to: "JR田沢湖駅に10時半ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車でおよそ22分、",
    },
  ],
  [GOZA]: [{ from: "ほかの参拝者の迷惑にならないよう、敬意を持ってお参りしましょう。", to: PRAY_TO }],
  [KAGAMI]: [{ from: "この後は、山道を下りて車でおよそ20分、姫観音像へ向かいましょう。", to: "この後は、山道を歩いておよそ15分で御座石神社の車に戻り、車でおよそ8分、姫観音像へ向かいましょう。" }],
  [HIME]: [
    { from: "たつこの鏡岩から車でおよそ20分、姫観音像に着きます。", to: "たつこの鏡岩から歩いておよそ15分で御座石神社の車に戻り、車でおよそ8分、姫観音像に着きます。" },
    {
      from: "田沢湖の湖畔には食事処もあるので、ここで昼食にしましょう。この後は、車でおよそ40分、田沢湖高原のアルパこまくさへ向かいましょう。",
      to: "この後は、車でおよそ9分、湖の東岸の田沢湖畔で昼食にしましょう。",
    },
  ],
  [ALPA]: [
    { from: "姫観音像から車でおよそ40分、", to: "田沢湖畔から車でおよそ17分、" },
    { from: "この後は、車でおよそ25分、", to: "この後は、車でおよそ12分、" },
  ],
  [NYUTO]: [
    { from: "アルパこまくさから車でおよそ25分、", to: "アルパこまくさから車でおよそ12分、" },
    { from: "今夜はこの近くの宿に泊まりましょう。", to: "この夜は、乳頭温泉郷の宿に泊まりましょう。" },
  ],
  [DAKI]: [
    {
      from: "宿を出発し、車でおよそ50分、抱返り渓谷に着きます。",
      to: "宿を出発し、車でおよそ39分で抱返り渓谷の駐車場へ。抱返り神社の近くから遊歩道を歩いておよそ24分で、回顧の滝に着きます。",
    },
    { from: "この後は、車でおよそ18分、角館の町なかへ向かいましょう。", to: "この後は、遊歩道を歩いておよそ24分で駐車場に戻り、車でおよそ18分、角館の町なかへ向かいましょう。" },
  ],
  [KABA]: [
    { from: "抱返り渓谷から車でおよそ18分、", to: "抱返り渓谷の駐車場から車でおよそ18分、" },
    { from: "角館の市街には食事処も多いので、ここで昼食をとってから見学するのもよいでしょう。", to: "" },
    { from: "この後は、歩いておよそ10分、新潮社記念文学館へ向かいましょう。", to: "この後は、車を伝承館のまわりにとめたまま、歩いておよそ17分、外町で昼食にしましょう。" },
  ],
  [BUNGAKU]: [
    { from: "角館樺細工伝承館から歩いておよそ10分、", to: "外町から歩いておよそ4分、" },
    { from: "この後は、歩いておよそ12分、", to: "この後は、歩いておよそ16分、" },
  ],
  [HINOKI]: [
    { from: "新潮社記念文学館から歩いておよそ12分、", to: "新潮社記念文学館から歩いておよそ16分、" },
    { from: "この後は、歩いておよそ5分、", to: "この後は、歩いておよそ6分、" },
  ],
  [BUKE]: [
    { from: "桧木内川堤から歩いておよそ5分、", to: "桧木内川堤から歩いておよそ6分、" },
    {
      from: "JR角館駅前でレンタカーを返して、秋田新幹線こまちで帰りましょう。",
      to: "見学を終えたら、歩いておよそ4分で伝承館のまわりにとめた車に戻り、車でおよそ8分のJR角館駅前でレンタカーを返しましょう（返す手続きに15分ほど）。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: TATSUKO, h: 11, m: 7, stay: 20, legs: [] },
  { id: GOZA, h: 11, m: 37, stay: 15, legs: [car(10)] },
  { id: KAGAMI, h: 12, m: 7, stay: 25, legs: [walk(15)] },
  { id: HIME, h: 12, m: 55, stay: 15, legs: [walk(15), car(8)] },
  { id: LUNCH1, h: 13, m: 19, stay: 50, legs: [car(9)] },
  { id: ALPA, h: 14, m: 26, stay: 72, legs: [car(17)] },
  { id: NYUTO, h: 15, m: 50, stay: 40, legs: [car(12)] },
];
const DAY2: Plan = [
  { id: DAKI, h: 9, m: 30, stay: 50, legs: [] },
  { id: KABA, h: 11, m: 2, stay: 40, legs: [walk(24), car(18)] },
  { id: LUNCH, h: 11, m: 59, stay: 50, legs: [walk(17)] },
  { id: BUNGAKU, h: 12, m: 53, stay: 70, legs: [walk(4)] },
  { id: HINOKI, h: 14, m: 19, stay: 50, legs: [walk(16)] },
  { id: BUKE, h: 15, m: 15, stay: 90, legs: [walk(6)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [TATSUKO, GOZA, KAGAMI, HIME, ALPA, NYUTO].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [DAKI, KABA, BUNGAKU, HINOKI, BUKE].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "こまち", "新幹線", "ホテル", "旅館"])
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
