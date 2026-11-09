/**
 * 初日・最終日の見直し #114 7f8fb644「武家屋敷の内部見学と伝統工芸体験、角館じっくり1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 歩きは routed-foot（もとの値が実測より短い区間は切り上げに直す）
 * 1日目: 角館駅 10:30ごろ → 歩17（1,232m）→ 角館武家屋敷通り 10:47（30→25）→ 歩3 → 河原田家 11:15（37→30）→ 歩7 → 石黒家 11:52（28→25）→ 歩2 → 青柳家 12:19（50→40）→
 *   歩18（1,331m。もと15）→ 外町 13:17〜14:07（昼食、50）→ 歩17（1,265m。もと15）→ 樺細工伝承館 14:24（90→75）→ 歩11（823m。もと10）→ 古城山 15:50〜16:50（83→60）→
 *   歩30（2,214m）で角館駅のまわりの宿
 * 2日目（16:30 に出るのはもとのまま）: 宿 → 歩13（960m）→ 天寧寺 9:30 → 歩7（462m。もと3）→ 松庵寺 10:02 → 歩7（471m。もと6）→ 成就院薬師堂 10:31 → 歩4（228m。もと2）→
 *   常光院 10:59 → 歩13（906m。もと10）→ 神明社 11:45 → 歩14（1,022m。もと12）→ 角館駅前 12:19〜13:09（昼食）→ 歩10 → 新潮社記念文学館 13:19 →
 *   歩19（1,417m。もと15）→ 平福記念美術館 14:48 → 歩5（「桜並木ポケットパーク」まで 320m・4.3分）→ 桧木内川堤 15:53〜16:30（53→37）→ 歩22（1,622m）で角館駅
 *   （桧木内川堤のいまの点は堤の上の道で、OSM の道のつながりのため平福記念美術館からの道のりが 2.5km に出る。法務: 点を堤の入口の「桜並木ポケットパーク」node 7454945415 にして、そこから測る）
 * 点: 武家屋敷通り＝ほかのしおり（c10810bd・c4f58fdd）と同じ点／外町（昼食）＝OSM「旧角館製糸工場」way 1106089254（Nominatim。いまは「安藤醸造 仕入水」の湧き水の点で、店の名前の点）／
 *   古城山＝OSM「古城山城跡」historic=castle node 2598309170（いまは公園の面の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-114-7f8fb644.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7f8fb644-170d-4331-b1f5-239e7f103e0c";
const DAY1_ID = "440b1525-7548-4966-bb3f-a11e5bd7d55c";
const DAY2_ID = "64bf226e-791f-43a6-a37d-9fab2a4b8792";
const BUKE = "a6f5acab-f55c-4586-a30e-5cb6d4ea8894";
const KAWARADA = "c7eb470b-f05d-40ac-925d-edf26c463237";
const ISHIGURO = "cfde7388-1905-44b3-b6bf-fb20b8d639c2";
const AOYAGI = "695824ba-a33f-417a-925f-0de78c425662";
const TOMACHI = "046b334a-1d43-4ea9-82dd-e37efacbc2af";
const KABA = "72c5278c-6f95-4aad-9c0c-17cddfe9469e";
const KOJO = "431b521b-c81f-46f6-82ee-470429b2661d";
const TENNEI = "05fbe1a5-ec72-4e0e-b469-a68eacc5ba8e";
const SHOAN = "8800f2a9-4a7e-4c07-9b8f-62dbc81d5ef0";
const YAKUSHI = "e813910e-0068-47d9-8a02-09a45eeafa54";
const JOKO = "ae283755-aa79-40bc-8a5d-fc3a21684a03";
const SHINMEI = "59e2cab1-c12f-4cde-8d5c-ab68dd1a56dc";
const EKIMAE = "8ed7c482-068c-4dd0-8d62-bd8cc377b212";
const BUNGAKU = "5357f90f-9966-45f5-b6d8-5ea80a5ca706";
const HIRAFUKU = "5298287f-8604-4fd3-ae50-8529a3b44ab2";
const HINOKI = "bebfcee5-42aa-40d5-a21a-422288f2a799";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [BUKE]: { from: [39.598991, 140.561868], to: [39.597831, 140.562157] },
  [TOMACHI]: { from: [39.590584, 140.564077], to: [39.590672, 140.565288] },
  [KOJO]: { from: [39.605446, 140.561965], to: [39.604747, 140.56092] },
  [HINOKI]: { from: [39.599654, 140.558631], to: [39.599657, 140.55985] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [BUKE]: [{ from: "JR角館駅から歩いて約20分。", to: "JR角館駅に10時半ごろ着いたら、歩いておよそ17分。" }],
  [AOYAGI]: [{ from: "石黒家から歩いてすぐ。", to: "石黒家から歩いて約2分。" }],
  [TOMACHI]: [{ from: "青柳家から南へ歩いて約15分。", to: "青柳家から南へ歩いて約18分。" }],
  [KABA]: [
    { from: "外町から北へ歩いて約15分。", to: "外町から北へ歩いて約17分。" },
    { from: "樺細工の手しごとにふれてみましょう", to: "樺細工の手しごとにふれましょう" },
  ],
  [KOJO]: [
    { from: "伝承館から北へ歩いて約10分。", to: "伝承館から北へ歩いて約11分。" },
    { from: "山頂まで歩いて上ってみましょう。", to: "山頂まで歩いて上りましょう。" },
    { from: "この日は、角館の町の宿に泊まりましょう。", to: "この夜は、歩いておよそ30分の角館駅のまわりの宿に泊まりましょう。" },
  ],
  [TENNEI]: [
    { from: "宿から外町の方へ。", to: "角館駅のまわりの宿から歩いておよそ13分、2日目は外町の天寧寺から。" },
    { from: "今も地元の人々がお参りしています。", to: "今も地元の人々がお参りしています。墓所のまわりでは、静かに過ごしましょう。" },
  ],
  [SHOAN]: [
    { from: "天寧寺から歩いて約3分。", to: "天寧寺から歩いて約7分。" },
    { from: "境内には直武の墓もあります。", to: "境内には直武の墓もあります。墓のまわりでは、静かに過ごしましょう。" },
  ],
  [YAKUSHI]: [{ from: "松庵寺から歩いて約6分。", to: "松庵寺から歩いて約7分。" }],
  [JOKO]: [{ from: "薬師堂から歩いてすぐ。", to: "薬師堂から歩いて約4分。" }],
  [SHINMEI]: [{ from: "常光院から南へ歩いて約10分。", to: "常光院から南へ歩いて約13分。" }],
  [EKIMAE]: [{ from: "神明社から歩いて約12分、", to: "神明社から歩いて約14分、" }],
  [HIRAFUKU]: [{ from: "文学館から北へ歩いて約15分。", to: "文学館から北へ歩いて約19分。" }],
  [HINOKI]: [
    { from: "川風を受けながら堤を歩いてみましょう。", to: "川風を受けながら堤を歩きましょう。" },
    { from: "帰りは、角館駅まで歩いて約20分です。", to: "帰りは、角館駅まで歩いて約22分です。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: BUKE, h: 10, m: 47, stay: 25, legs: [] },
  { id: KAWARADA, h: 11, m: 15, stay: 30, legs: [walk(3)] },
  { id: ISHIGURO, h: 11, m: 52, stay: 25, legs: [walk(7)] },
  { id: AOYAGI, h: 12, m: 19, stay: 40, legs: [walk(2)] },
  { id: TOMACHI, h: 13, m: 17, stay: 50, legs: [walk(18)] },
  { id: KABA, h: 14, m: 24, stay: 75, legs: [walk(17)] },
  { id: KOJO, h: 15, m: 50, stay: 60, legs: [walk(11)] },
];
const DAY2: Plan = [
  { id: TENNEI, h: 9, m: 30, stay: 25, legs: [] },
  { id: SHOAN, h: 10, m: 2, stay: 22, legs: [walk(7)] },
  { id: YAKUSHI, h: 10, m: 31, stay: 24, legs: [walk(7)] },
  { id: JOKO, h: 10, m: 59, stay: 33, legs: [walk(4)] },
  { id: SHINMEI, h: 11, m: 45, stay: 20, legs: [walk(13)] },
  { id: EKIMAE, h: 12, m: 19, stay: 50, legs: [walk(14)] },
  { id: BUNGAKU, h: 13, m: 19, stay: 70, legs: [walk(10)] },
  { id: HIRAFUKU, h: 14, m: 48, stay: 60, legs: [walk(19)] },
  { id: HINOKI, h: 15, m: 53, stay: 37, legs: [walk(5)] },
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
    for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ。", "ホテル", "旅館"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
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
