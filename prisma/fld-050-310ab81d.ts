/**
 * 初日・最終日の見直し #50 310ab81d「表浜海岸とサーフィン文化、渥美半島と太平洋を望む1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a。企画運営の案 (A)）
 * 1泊2日・車。初日を11時ごろからにする。2日目は時刻を変えず、文だけ直す（9:30〜16:36）
 * 初日: JR豊橋駅に10時半ごろ → 手続き15分＋車18（OSRM 16.7分、もとの18はそのまま）→ 表浜海岸 11:03〜11:43（65→40）→ 車26（OSRM 22.1）→
 *   サンテパルクたはら 12:09〜13:19（95→70、昼食）→ 車9 → 太平洋ロングビーチ 13:28〜14:08（60→40）→ 車2 → 道の駅あかばね 14:10〜14:30 →
 *   車18（OSRM 12.1分で、もとの12分は道のりより短い。12.1→13＋駐車5）→ 恋路ヶ浜 14:48〜15:28（50→40）→ 車4 → 日出の石門 15:32〜16:02（35→30）→
 *   車5（OSRM 4.4）→ 伊良湖岬灯台 16:07〜16:50（58→43）
 * 表浜海岸の点: いまの点は海の上（OSM に何もない）。豊橋側の海岸に名前のある点がないため、海沿いの自転車道「田原豊橋自転車道線」（way 844922080）の中で
 *   砂浜にいちばん近い生の node 2012167738（34.663416,137.4078544、浜まで約160m）にし、メモでその道にふれる（法務・企画運営 10/30）
 * 椰子の実記念碑は別のスポットとしては外し、日出の石門のメモにまとめる（点の出どころがない。公式のページで碑の場所・年を確かめられないため、碑の場所と年は書かず「ゆかりの地」とする（法務 10/30）。出典 https://tabi-mag.jp/ai0430）
 * 文: 「〜てみてください」・「お帰りは」を直す。宿の一文を「この夜は、伊良湖岬の近くの宿に泊まりましょう。」に
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-050-310ab81d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "310ab81d-4d90-4732-9a8d-155a079a0c4c";
const DAY1_ID = "ca96bb69-f18e-407e-b819-ca027c8321ef";
const DAY2_ID = "124e6389-854c-4fc2-a4b4-5b0e904bf213";
const OMOTE = "d8b29933-539e-40b3-9231-c6efd6b53f60";
const SANTE = "3d0d2fcf-5572-4127-8180-475fd81352d0";
const LONG = "53d2ab75-aa4b-40dd-bd49-f0ac0e414727";
const AKABA = "c5f4e6ee-b688-4fd8-8474-ee1d9430fb4e";
const KOIJI = "8f39469f-b25a-4448-9c3c-9dedd5f7f0af";
const SEKIMON = "13e34f1c-546c-4450-9f82-14b577b9d8ca";
const YASHI = "0ab6274f-2b47-4612-8341-6b59b34032c1";
const TOUDAI = "9e8e5d6e-4a08-4dc3-af26-956864aa461f";
const PORTO = "107a7201-ab01-4534-8db2-1e281ea588ae";
const SHIRATANI = "4f2e4508-23b0-49a7-a3c4-a4b6f162807c";
const ZAO = "027b510c-56b5-41f9-af1b-539c5ab37102";
const HAKU = "738b1811-8829-465c-a4da-caec35b185f6";
const IWAYA = "7b93c68f-3663-47d4-a426-42ea1ef90461";
const FUMON = "adb791d0-cd43-4f32-8f6f-893162d906c2";
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

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [OMOTE]: { from: [34.6516, 137.4342], to: [34.663416, 137.407854] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [OMOTE]: [
    {
      from: "JR豊橋駅の近くでレンタカーを借りて、車でおよそ18分、表浜海岸に着きます。",
      to: "JR豊橋駅に10時半ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ18分、表浜海岸に着きます。海沿いを走る自転車道（田原豊橋自転車道線）のあたりから、砂浜と太平洋を眺めましょう。",
    },
  ],
  [AKABA]: [
    {
      from: "波と戯れるサーファーたちの姿を、しばし眺めてみてください。この後は、車でおよそ12分、恋路ヶ浜へ向かいましょう。",
      to: "波と戯れるサーファーたちの姿を、しばし眺めましょう。この後は、車でおよそ18分、恋路ヶ浜へ向かいましょう。",
    },
  ],
  [KOIJI]: [
    { from: "道の駅あかばねロコステーションから車でおよそ12分、", to: "道の駅あかばねロコステーションから車でおよそ18分、" },
    { from: "雄大な太平洋の景色を眺めながら歩いてみてください。", to: "雄大な太平洋の景色を眺めながら歩きましょう。" },
  ],
  [SEKIMON]: [
    {
      from: "この後は、歩いておよそ3分、椰子の実記念碑へ向かいましょう。",
      to: "伊良湖は、島崎藤村の詩『椰子の実』ゆかりの地としても知られています。民俗学者・柳田國男が伊良湖で拾った椰子の実の話を藤村に語ったことが、詩が生まれるきっかけになったと伝えられています。この後は、車でおよそ5分、伊良湖岬灯台へ向かいましょう。",
    },
  ],
  [TOUDAI]: [
    { from: "椰子の実記念碑から車でおよそ5分、", to: "日出の石門から車でおよそ5分、" },
    { from: "今夜はこの近くの宿に泊まります。", to: "この夜は、伊良湖岬の近くの宿に泊まりましょう。" },
  ],
  [HAKU]: [{ from: "城跡をあわせて散策してみてください。", to: "城跡もあわせて散策しましょう。" }],
  [FUMON]: [{ from: "お帰りは、車でおよそ23分、豊橋駅へ戻り、レンタカーを返しましょう。", to: "見学を終えたら、車でおよそ23分の豊橋駅へ戻り、車を返しましょう。" }],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const PLAN: Plan = [
  { id: OMOTE, h: 11, m: 3, stay: 40, legs: [] },
  { id: SANTE, h: 12, m: 9, stay: 70, legs: [car(26)] },
  { id: LONG, h: 13, m: 28, stay: 40, legs: [car(9)] },
  { id: AKABA, h: 14, m: 10, stay: 20, legs: [car(2)] },
  { id: KOIJI, h: 14, m: 48, stay: 40, legs: [car(18)] },
  { id: SEKIMON, h: 15, m: 32, stay: 30, legs: [car(4)] },
  { id: TOUDAI, h: 16, m: 7, stay: 43, legs: [car(5)] },
];
const DAY2_IDS = [PORTO, SHIRATANI, ZAO, HAKU, IWAYA, FUMON];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [OMOTE, SANTE, LONG, AKABA, KOIJI, SEKIMON, YASHI, TOUDAI].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_IDS.join()) throw new Error("2日目の構成が想定と違います");
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
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    for (const w of ["てみてください", "お帰りは", "椰子の実記念碑から"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
    memos[id] = m;
  }
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
    if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
    for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
    prevEnd = st + p.stay;
  }
  console.log("\n2日目（時刻はそのまま、文だけ）");
  for (const id of DAY2_IDS) for (const e of MEMO_EDITS[id] ?? []) console.log(`  ${d2.spots.find((x) => x.id === id)!.name} → ${e.to}`);
  console.log("\n外す: 椰子の実記念碑（1日目。日出の石門のメモにまとめる）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(
        DAY1_ID,
        PLAN.map((p) => ({
          id: p.id,
          data: {
            ...timeLegs(p.h, p.m, p.stay, p.legs),
            ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
            ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
          },
        })) as never,
        { tx, remove: [YASHI] }
      );
      for (const id of DAY2_IDS) if (memos[id] !== undefined) await tx.spot.update({ where: { id }, data: { memo: memos[id] } });
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
