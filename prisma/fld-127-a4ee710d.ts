/**
 * 初日・最終日の見直し #127 a4ee710d「だるま絵付け体験と白衣大観音、高崎の伝統工芸を楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（7か所）: 少林山達磨寺 9:00 → 観音山公園 → 高崎白衣大観音（昼食）→ 洞窟観音・徳明園 → 高崎城址公園 → 高崎市役所21階展望ロビー → 高崎市美術館 15:28〜16:33
 * 直した初日（5か所）: 高崎駅に11時ごろ → レンタカーで少林山達磨寺 11:35 → 高崎白衣大観音（昼食）→ 洞窟観音・徳明園 → 高崎市美術館 → 高崎城址公園 16:07〜16:52 → 近くの宿
 *   入口と1か所目（企画運営 10/29）: 入口は高崎駅。駅前でレンタカーを借りて（約15分）、少林山まで車で約20分
 *     もとの本文の「車でおよそ30分」は、地図の経路（OSRM、約6.2km・約11分）より長すぎるので、約20分にした
 *   タイトルの「だるま絵付け」（少林山）と「白衣大観音」は残す
 *   観音山公園・高崎市役所21階展望ロビーは外す（2日目は今のままで入れる時間がない。タイトル・説明文に出てこない。写真なし）
 *   高崎市美術館と高崎城址公園の順番を入れかえる: 旧井上房一郎邸の邸内の公開は「午前10時～11時、午後2時～4時」なので、16時より前に着くようにした
 *     出典: city.takasaki.gunma.jp/site/art-museum/2494.html（邸内公開時間・庭園は12〜2月は入園16:30まで）・museum.or.jp/museum/1699（美術館 10:00〜18:00、入館は閉館の30分前まで）
 *   移動: 白衣大観音→洞窟観音は、もと「歩いて12分」だったが、車を観音の駐車場に置いたまま次に車で移動することになるので、車で約5分（OSRM 約1.7km・約4分）にした（決まり8）
 *     洞窟観音→美術館は車で約12分（もとの洞窟観音→城址公園と同じ道のり）、美術館→城址公園は車で約5分（直線で約560m）
 *   移動の時間は延ばさず、滞在を短くした（少林山 100→75分、城址公園 50→45分、美術館 65→45分）
 * 「静かに、敬意をもってお参りください。」は法務の決まった一文なので、そのまま（企画運営 10/29）
 * 説明文・タイトルは変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-127-a4ee710d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "a4ee710d-7872-4fb5-8bb1-6b7b796cdcbd";
const DAY1_ID = "efaeeb7a-33bc-45ad-8270-21d23a4a11cb";
const SHORIN = "0de37f7d-3bdf-4988-a085-efdc6bf3bdea";
const PARK = "e7d8983b-2ba9-4177-910a-2c9fa44a9d08";
const KANNON = "7b6b803f-5c90-40bc-82fd-c420186cb136";
const DOKUTSU = "3e9ae704-e249-4054-83d9-9f993534f747";
const CASTLE = "5bb13d1c-eccd-4186-af01-414eac510365";
const CITYHALL = "30199ce9-e91a-49ef-bbf9-f2c3ed3267b1";
const MUSEUM = "642ffaf9-6125-421f-97ec-0ccf41aa02ad";
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


const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHORIN]: [
    {
      from: "高崎さんぽの1日目は、少林山達磨寺からスタートです。高崎駅前でレンタカーを借り、車でおよそ30分の道のりです。",
      to: "この旅は車でめぐります。高崎駅に11時ごろ着いたら、駅前でレンタカーを借りて、車でおよそ20分の少林山達磨寺から旅を始めます。",
    },
    { from: "見学を終えたら、車でおよそ15分の観音山公園へ向かいましょう。", to: "見学を終えたら、車でおよそ15分の高崎白衣大観音へ向かいましょう。" },
  ],
  [KANNON]: [
    { from: "観音山公園からは、歩いておよそ8分です。", to: "少林山達磨寺からは、車でおよそ15分です。" },
    { from: "続いては、歩いておよそ12分の洞窟観音・徳明園へ向かいましょう。", to: "続いては、車でおよそ5分の洞窟観音・徳明園へ向かいましょう。" },
  ],
  [DOKUTSU]: [
    { from: "高崎白衣大観音からは、歩いておよそ12分です。", to: "高崎白衣大観音からは、車でおよそ5分です。" },
    { from: "続いては、車でおよそ12分の高崎城址公園へ向かいましょう。", to: "続いては、車でおよそ12分の高崎市美術館(旧井上房一郎邸)へ向かいましょう。" },
  ],
  [MUSEUM]: [
    { from: "高崎市役所21階展望ロビーからは、歩いておよそ8分です。", to: "洞窟観音・徳明園からは、車でおよそ12分です。" },
    { from: "あわせて見学できます。", to: "あわせて見学できます。邸の中を見られる時間は限られているので、公式の案内で確かめましょう。" },
    {
      from: "だるまの絵付けから、洋館建築まで、高崎が育んだものづくりと文化に触れる1日目は、ここで終わりです。今夜はこの近くの宿に泊まり、旅の疲れを癒やします。",
      to: "見学を終えたら、車でおよそ5分の高崎城址公園へ向かいましょう。",
    },
  ],
  [CASTLE]: [
    { from: "洞窟観音・徳明園からは、車でおよそ12分です。", to: "高崎市美術館からは、車でおよそ5分です。" },
    {
      from: "続いては、歩いてすぐの高崎市役所21階展望ロビーへ向かいましょう。",
      to: "だるまの絵付けから、観音山の祈りの場、城下町の歴史まで、高崎が育んだものづくりと文化に触れる1日目は、ここで終わりです。今夜はこの近くの宿に泊まります。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: SHORIN, h: 11, m: 35, stay: 75, legs: [] },
  { id: KANNON, h: 13, m: 5, stay: 65, legs: [car(15)] },
  { id: DOKUTSU, h: 14, m: 15, stay: 50, legs: [car(5)] },
  { id: MUSEUM, h: 15, m: 17, stay: 45, legs: [car(12)] },
  { id: CASTLE, h: 16, m: 7, stay: 45, legs: [car(5)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [SHORIN, PARK, KANNON, DOKUTSU, CASTLE, CITYHALL, MUSEUM].join()) throw new Error("1日目の構成が想定と違います");
  for (const s of d1.spots.filter((x) => x.id === PARK || x.id === CITYHALL)) if (s.photos.length) throw new Error(`外すスポットに写真があります: ${s.name}`);
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  console.log(`\n外すスポット: ${PARK}（観音山公園）・${CITYHALL}（高崎市役所21階展望ロビー）`);
  console.log(`\n説明文は変えない: ${it.description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [PARK, CITYHALL] }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
