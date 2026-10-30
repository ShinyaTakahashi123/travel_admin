/**
 * 初日・最終日の見直し #108 206f3ee6「天赦園と九島、宇和島藩主の庭園と離島風景を楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 14時ごろ）
 * 歩きは routed-foot、タクシーは OSRM（もとの値は ×1.5＋5 の内側ならそのまま。外のものは切り上げ＋5）
 * 1日目（全部歩き）: 宇和島駅 10:30ごろ → 歩20（1,508m）→ 天赦園 10:50（50→40）→ 歩2 → 伊達博物館 11:32（45→40）→ 歩9（687m）→
 *   【新】堀端通りのまわり 12:21〜13:06（昼食）→ 歩11（813m）→ 宇和津彦神社 13:17（30→25）→ 歩5 → 等覚寺 13:47（30→25）→ 歩5 → 大隆寺 14:17（30→25）→
 *   歩20（1,526m）→ 桑折氏武家長屋門 15:02（45→30）→ 歩17（1,244m）→ 和霊神社 15:49〜16:34 → 歩11 で宇和島駅のまわりの宿
 *   木屋旅館（営業中の宿の名前。決まり329）・宇和島市立歴史資料館は外す（説明文にない。11時からでは収まらない。写真なし）
 * 2日目: 宿 → タクシー11（OSRM 5.7。もとの14は ×1.5＋5 を超える）→ 九島 9:30 → タクシー14（OSRM 6.2、もとのまま）→ 樺崎砲台跡 10:54 → 歩12 →
 *   きさいや広場 11:31〜12:21（昼食）→ 歩14＋JR予讃線（宇和島 12:46発の普通→卯之町 13:07着、JR西日本 https://timetable.jr-odekake.net/line-timetable/2470 ）＋歩6 →
 *   開明学校 13:12 → 歩4（299m）→ 卯之町の町並み 13:56 → 歩7（506m。もと15）→ 愛媛県歴史文化博物館 14:33〜16:23 → 歩14（1,066m）で卯之町駅
 *   （列車の時刻で決まるため、終わりがもとの16:31より8分早い。企画運営に相談）
 * 2日目の追加: 列車の時刻で決まり16:23で16:30に届かないため（企画運営 B、決まり369の③）、開明学校のとなりの【新】宇和民具館 13:53〜14:18（25分。法務）を足し、歴史文化博物館を 110→93 にして 16:31（もとと同じ）に。
 *   公式 西予市観光 https://seiyojikan.jp/wp/wp-content/uploads/2024/04/9075644204c434d121d9c6cf2f474bdf.pdf （9:00〜17:00、最終入館16:30、月曜休館、卯之町3-106、約6,000点）。点は OSM node 1423733858
 * 点: 天赦園＝OSM「天赦園」relation 18396899 の Nominatim の値（法務。案内板の点は施設に使わない）／卯之町の町並み＝OSM「卯之町の町並み」node 4957764221（いまは宇和先哲記念館の点）／
 *   九島＝「九島大橋」way 377516088 の九島側の端の node 3808905190（いまは島の relation の中心。メモは橋のたもとから展望所へ）／
 *   堀端通りのまわり＝OSM バス停「堀端町」node 3152604934（店ではない名前の点、まわりに食堂の点あり）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-108-206f3ee6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "206f3ee6-3b59-4e27-abaf-3f510b24a63c";
const DAY1_ID = "3b5e7d2d-f0fb-4cde-9431-5bdeee52a8c1";
const DAY2_ID = "d6eed5f5-16a4-4561-b948-92a6f70bbe2c";
const TENSHA = "fb50bb22-9324-4e5c-857f-d4820cb63c08";
const DATE = "b8a305c2-150a-4a8a-bb1c-f688cfceb807";
const UWATSU = "b40a5b7e-400d-4891-a168-d99e399cbaa1";
const TOKAKU = "12d23e81-bec0-446e-9bce-d7ad75299c02";
const DAIRYU = "1eec161c-4a55-42d1-86f0-375cae9fb3f4";
const KIYA = "2532a72f-d264-438c-aeb8-1020fc813a94";
const KORI = "f667c40d-f918-4703-a1bf-17b9605df8c0";
const SHIRYO = "2743561f-64c2-4bac-9ffc-d0c4a7ed8299";
const WAREI = "00bd99d5-a2ef-4636-aabe-517f5defcca7";
const KUSHIMA = "a0df5c5f-2ec3-47a3-ad4f-4f5da9bc3250";
const KABA = "335d55e4-5e12-443f-a61c-9aa0c6a88b35";
const KISAIYA = "559f7433-8d9a-4c42-a37a-2729760f35b8";
const KAIMEI = "d62c0fac-bf50-4302-adda-6c259dc1ed46";
const MACHI = "eb2027e0-4cb6-4501-b9de-439c0b710af4";
const REKIHAKU = "e642a880-c390-4581-a99a-de3749f637f5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [TENSHA]: { from: [33.215514, 132.561125], to: [33.215605, 132.561214] },
  [MACHI]: { from: [33.362861, 132.515465], to: [33.363184, 132.514605] },
  [KUSHIMA]: { from: [33.229497, 132.520415], to: [33.226402, 132.534112] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const LUNCH = "new-horibata";
const MINGU = "new-mingu";
const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH]: {
    name: "堀端通りのまわり",
    lat: 33.217847,
    lng: 132.567549,
    address: "愛媛県宇和島市",
    memo: "伊達博物館から歩いておよそ9分。宇和島の町なかで、まわりには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ11分、宇和津彦神社へ向かいましょう。",
  },
  [MINGU]: {
    name: "宇和民具館",
    lat: 33.363916,
    lng: 132.513942,
    address: "愛媛県西予市宇和町卯之町3-106",
    memo: "開明学校から歩いておよそ1分、となりの宇和民具館にも立ち寄りましょう。1850年から1950年ごろまでの、宇和町の祭りや暮らし、商いにかかわる道具およそ6,000点を集めた民具館です。月曜日は休館なので、開館日と時間を公式の案内で確かめましょう。この後は、歩いておよそ3分、卯之町の町並みへ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TENSHA]: [
    { from: "宇和島藩2代藩主・伊達宗利が", to: "JR宇和島駅に10時半ごろ着いたら、歩いておよそ21分で天赦園に着きます。宇和島藩2代藩主・伊達宗利が" },
      ],
  [DATE]: [
    { from: "この後は、歩いておよそ18分、宇和津彦神社へ向かいましょう。", to: "この後は、歩いておよそ9分、堀端通りのまわりへ向かいましょう。" },
  ],
  [UWATSU]: [
    { from: "伊達博物館から歩いておよそ18分、", to: "堀端通りのまわりから歩いておよそ11分、" },
    { from: "静かに、敬意をもってお参りください。", to: PRAY_TO },
  ],
  [TOKAKU]: [{ from: "境内では静かに、敬意をもってお参りください。", to: PRAY_TO }],
  [DAIRYU]: [
    { from: "境内では静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "この後は、歩いておよそ12分、木屋旅館へ向かいましょう。", to: "この後は、歩いておよそ20分、桑折氏武家長屋門へ向かいましょう。" },
  ],
  [KORI]: [
    { from: "木屋旅館から歩いておよそ6分、", to: "大隆寺から歩いておよそ20分、" },
    { from: "この後は、歩いておよそ20分、宇和島市立歴史資料館へ向かいましょう。", to: "この後は、歩いておよそ17分、和霊神社へ向かいましょう。" },
  ],
  [WAREI]: [
    { from: "宇和島市立歴史資料館から歩いておよそ18分、", to: "桑折氏武家長屋門から歩いておよそ17分、" },
    { from: "境内では静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "今夜は宇和島市内の宿に泊まります。", to: "この夜は、歩いておよそ11分の宇和島駅のまわりの宿に泊まりましょう。" },
  ],
  [KUSHIMA]: [{ from: "宇和島駅からタクシーでおよそ14分、九島に着きます。", to: "宇和島駅のまわりの宿からタクシーでおよそ11分、九島大橋を渡って九島に着きます。" }],
  [KISAIYA]: [
    { from: "ここで昼食にするのもよいでしょう。", to: "ここで昼食をとりましょう。" },
    {
      from: "この後は、宇和島駅まで歩いておよそ15分、そこからJR予讃線の特急宇和海でおよそ20分、卯之町駅へ向かいましょう。",
      to: "この後は、宇和島駅まで歩いておよそ14分、そこからJR予讃線の列車でおよそ21分、卯之町駅へ向かいましょう。列車の本数は多くないので、時刻を公式の案内で確かめましょう。",
    },
  ],
  [KAIMEI]: [
    { from: "きさいや広場から宇和島駅・特急宇和海を乗り継いで、", to: "きさいや広場から宇和島駅・JR予讃線を乗り継いで、" },
    { from: "この後は、歩いてすぐ、卯之町の町並みを歩いてみましょう。", to: "この後は、歩いてすぐの宇和民具館へ向かいましょう。" },
  ],
  [MACHI]: [
    { from: "開明学校から歩いてすぐ、", to: "宇和民具館から歩いておよそ3分、" },
    { from: "この後は、歩いておよそ15分、愛媛県歴史文化博物館へ向かいましょう。", to: "この後は、歩いておよそ7分、愛媛県歴史文化博物館へ向かいましょう。" },
  ],
  [REKIHAKU]: [
    { from: "卯之町の町並みから歩いておよそ15分、", to: "卯之町の町並みから歩いておよそ7分、" },
    { from: "この後は、歩いておよそ12分、卯之町駅へ向かい、松山方面への列車で帰りましょう。", to: "見学を終えたら、歩いておよそ14分、卯之町駅へ向かい、松山方面への列車で帰りましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: TENSHA, h: 10, m: 51, stay: 40, legs: [] },
  { id: DATE, h: 11, m: 34, stay: 40, legs: [walk(3)] },
  { id: LUNCH, h: 12, m: 23, stay: 45, legs: [walk(9)] },
  { id: UWATSU, h: 13, m: 19, stay: 25, legs: [walk(11)] },
  { id: TOKAKU, h: 13, m: 49, stay: 25, legs: [walk(5)] },
  { id: DAIRYU, h: 14, m: 19, stay: 25, legs: [walk(5)] },
  { id: KORI, h: 15, m: 4, stay: 30, legs: [walk(20)] },
  { id: WAREI, h: 15, m: 51, stay: 45, legs: [walk(17)] },
];
const DAY2: Plan = [
  { id: KUSHIMA, h: 9, m: 30, stay: 70, legs: [] },
  { id: KABA, h: 10, m: 54, stay: 25, legs: [taxi(14)] },
  { id: KISAIYA, h: 11, m: 31, stay: 50, legs: [walk(12)] },
  { id: KAIMEI, h: 13, m: 12, stay: 40, legs: [train(51, "JR予讃線")] },
  { id: MINGU, h: 13, m: 53, stay: 25, legs: [walk(1)] },
  { id: MACHI, h: 14, m: 21, stay: 30, legs: [walk(3)] },
  { id: REKIHAKU, h: 14, m: 58, stay: 93, legs: [walk(7)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [TENSHA, DATE, UWATSU, TOKAKU, DAIRYU, KIYA, KORI, SHIRYO, WAREI].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [KUSHIMA, KABA, KISAIYA, KAIMEI, MACHI, REKIHAKU].join()) throw new Error("2日目の構成が想定と違います");
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
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "木屋旅館", "歴史資料館", "宇和海", "ホテル", "旅館"])
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
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n外す: 木屋旅館・宇和島市立歴史資料館（1日目、写真なし）");
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [KIYA, SHIRYO] });
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
