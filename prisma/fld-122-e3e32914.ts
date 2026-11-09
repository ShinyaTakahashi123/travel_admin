/**
 * 初日・最終日の見直し #122 e3e32914「関門海峡の絶景とレトロ建築、門司港を満喫する旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 歩きは routed-foot、タクシーは OSRM（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 門司港駅 10:35ごろ → タクシー10（4.8）→ 関門海峡（人道入口）10:45（50→30）→ 歩2 → 和布刈神社 11:17（20→15）→ 歩11（763m。もと7）→ 和布刈公園 11:43（58→30）→
 *   歩10（459m、もとのまま）→ 関門橋 12:23（20→15）→ タクシー13（7.9。もと歩17、実測は 2,560m・34分）→ 旧大連航路上屋 12:51（30→20）→ 歩2 →
 *   関門海峡ミュージアム 13:13〜14:33（昼食と見学、100→80。すぐそばに OSM の食事処の点 Canal・たいむ亭・Bion）→ 歩12（866m。もと10）→ 旧門司税関 14:45（35→30）→
 *   歩2 → ブルーウィングもじ 15:17（30→25）→ 歩3（166m。もと2）→ 門司港レトロ展望室 15:45〜16:45 → 門司港レトロのまわりの宿
 * 2日目（16:36 に出るのはもとのまま）: 宿 → 歩7 → 旧大阪商船 9:00 → 歩5 → 旧門司三井倶楽部 9:40 → 歩7（497m。もと3）→ 大連友好記念館 10:32 → 歩9（606m。もと4）→ 門司港駅 11:11 →
 *   歩4 → 海峡プラザ 11:45〜12:45（昼食）→ 歩7（459m。もと5）→ 九州鉄道記念館 12:52 → 歩11（781m。もと7）→ 門司港レトロ地区 14:08 → 歩5（319m、もとのまま）→ 出光美術館 14:54 →
 *   歩12（854m。もと3）→ 三宜楼 15:56〜16:36（65→40）→ 歩8（540m）で門司港駅
 * 点（いまは4〜5けたの点が多い）: 人道入口＝OSM「関門トンネル人道入口」建物 way 90115760／和布刈神社＝way 687938048／和布刈公園＝OSM「和布刈塩水プール」way 269972046
 *   （メモに海水のプール。公園は relation の面）／関門橋＝OSM「関門橋」bridge way 1116301427 の門司側の node 6348825691（メモは橋のたもと）／ブルーウィングもじ＝bridge way 1226176317／
 *   旧大阪商船＝way 627252015／旧門司三井倶楽部＝way 627252021／大連友好記念館＝way 823695331（いまは約180m南東）／門司港駅＝relation 2532442／
 *   門司港レトロ地区＝#18 ba8c13f1 と同じ点（OSM「大連友好記念館」way 823695331 の値。企画運営）／出光美術館＝OSM「出光佐三記念美術館・出光美術館（門司）」node 1423757203／
 *   三宜楼＝地理院「清滝三丁目6番8号」（住所は福岡県観光連盟 https://www.crossroadfukuoka.jp/spot/11485。OSM になし。いまの点は約750m北東）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-122-e3e32914.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e3e32914-5c7e-4d4c-94ae-c0c0598cdaf1";
const DAY1_ID = "64047b45-2eee-47a8-8ddc-85700c32c936";
const DAY2_ID = "e68b849a-eff4-4632-87df-19f7fb22056b";
const JINDO = "07e38694-6cbe-4c2f-bc0f-7856a219c66d";
const MEKARI = "af38ac19-ad44-4af5-877f-475f0e0dd242";
const KOEN = "259e0e4b-fd6f-4294-b4a4-716ac0cee48b";
const BRIDGE = "38ca224e-556f-418f-9e6e-86de4abd1df3";
const DAIREN = "59abe17f-fd67-4302-bb22-95b2426bd7aa";
const MUSEUM = "a492444b-2df5-4fa2-8e0d-1d6cf7785128";
const ZEIKAN = "adbad3d7-a1c5-4c08-8567-a420b05f225b";
const BLUE = "396c9763-8f1b-462d-8793-1ca3f4920f19";
const TENBO = "0c2341b5-b316-4424-a9af-5adbf06a1763";
const OSAKA = "fca6e9ad-44b6-4e00-b808-0c8fc4b7e6cc";
const MITSUI = "62f28fa6-d7f5-490e-9e31-cd1b92420208";
const YUKO = "e2ef77a3-000d-4b05-b303-0006d1f46018";
const EKI = "e3b3c4e0-5742-413a-89b6-55081bcbaa91";
const PLAZA = "9520fdbd-7e2f-4375-b5de-f2f86e8461d1";
const TETSU = "7e6aae04-5d57-4e14-af0f-c17deea384c5";
const RETRO = "2b884dd1-0679-40f1-a66d-f74ea3da4b60";
const IDEMITSU = "75dc2bf8-e439-4425-b221-803a703a7cf1";
const SANGI = "1b6a16eb-986a-45e5-ab99-b1d501e71456";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [JINDO]: { from: [33.96066, 130.96229], to: [33.961287, 130.963047] },
  [MEKARI]: { from: [33.96066, 130.96229], to: [33.96066, 130.962289] },
  [KOEN]: { from: [33.9597, 130.9553], to: [33.960384, 130.965218] },
  [BRIDGE]: { from: [33.9556, 130.9564], to: [33.959241, 130.96376] },
  [BLUE]: { from: [33.9489, 130.9636], to: [33.947801, 130.962743] },
  [OSAKA]: { from: [33.9486, 130.9631], to: [33.946131, 130.962237] },
  [MITSUI]: { from: [33.9483, 130.9633], to: [33.945724, 130.962575] },
  [YUKO]: { from: [33.946945, 130.965561], to: [33.948072, 130.964174] },
  [EKI]: { from: [33.9469, 130.9622], to: [33.945116, 130.961475] },
  [RETRO]: { from: [33.9481, 130.9639], to: [33.948072, 130.964174] },
  [IDEMITSU]: { from: [33.9481, 130.9678], to: [33.94891, 130.965276] },
  [SANGI]: { from: [33.949703, 130.966965], to: [33.942993, 130.963791] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [JINDO]: [
    {
      from: "1日目は、海底の関門トンネルを歩いて渡れる、全国でも珍しい関門海峡人道入口からです。",
      to: "JR門司港駅に10時35分ごろ着いたら、駅前からタクシーでおよそ10分。1日目は、海底の関門トンネルを歩いて渡れる、全国でも珍しい関門海峡人道入口からです。",
    },
    { from: "全国でも珍しい体験をぜひ楽しんでください。", to: "全国でも珍しい体験を楽しみましょう。" },
  ],
  [MEKARI]: [
    { from: "関門海峡人道入口から歩いてすぐ、", to: "関門海峡人道入口から歩いておよそ2分、" },
    { from: "静かに、敬意をもってお参りください。", to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。" },
  ],
  [KOEN]: [
    { from: "和布刈神社から歩いておよそ5分、", to: "和布刈神社から歩いておよそ11分、" },
    { from: "対岸の下関の街並みを眺めながら楽しんでください。", to: "対岸の下関の街並みを眺めながら楽しみましょう。" },
  ],
  [BRIDGE]: [{ from: "続いては旧大連航路上屋へ向かいましょう。", to: "続いては、タクシーでおよそ13分、旧大連航路上屋へ向かいましょう。タクシーは、前もって予約しておくと安心です。" }],
  [DAIREN]: [{ from: "関門橋から歩いておよそ17分、", to: "関門橋のたもとからタクシーでおよそ13分、" }],
  [MUSEUM]: [{ from: "旧大連航路上屋から歩いてすぐ、", to: "旧大連航路上屋から歩いておよそ2分、" }],
  [ZEIKAN]: [{ from: "関門海峡ミュージアムから歩いておよそ10分、", to: "関門海峡ミュージアムから歩いておよそ12分、" }],
  [BLUE]: [{ from: "旧門司税関から歩いてすぐ、", to: "旧門司税関から歩いておよそ2分、" }],
  [TENBO]: [
    { from: "ブルーウィングもじから歩いてすぐ、", to: "ブルーウィングもじから歩いておよそ3分、" },
    { from: "関門海峡の全景をゆっくりと眺めてください。", to: "関門海峡の全景をゆっくりと眺めましょう。" },
    { from: "今夜はこの近くの宿でゆっくり休みましょう。", to: "この夜は、歩いておよそ7分の、門司港レトロのまわりの宿に泊まりましょう。" },
  ],
  [OSAKA]: [{ from: "2日目は、大正期のレトロな洋館、旧大阪商船からです。", to: "門司港レトロのまわりの宿から歩いておよそ7分、2日目は、大正期のレトロな洋館、旧大阪商船からです。" }],
  [MITSUI]: [{ from: "大正ロマンあふれる洋館建築を、ゆっくりと見学してください。", to: "大正ロマンあふれる洋館建築を、ゆっくりと見学しましょう。" }],
  [YUKO]: [{ from: "旧門司三井倶楽部から歩いておよそ3分、", to: "旧門司三井倶楽部から歩いておよそ7分、" }],
  [EKI]: [
    { from: "大連友好記念館から歩いておよそ4分、", to: "大連友好記念館から歩いておよそ9分、" },
    { from: "駅舎の佇まいを、ゆっくりと眺めてください。", to: "駅舎の佇まいを、ゆっくりと眺めましょう。" },
  ],
  [PLAZA]: [
    { from: "門司港駅から歩いておよそ3分、", to: "門司港駅から歩いておよそ4分、" },
    { from: "眺めのよいレストランも多いので、ここで昼食にするのもおすすめです。", to: "眺めのよいレストランも多いので、ここで昼食にしましょう。" },
  ],
  [TETSU]: [{ from: "門司港駅から歩いておよそ5分、", to: "海峡プラザから歩いておよそ7分、" }],
  [RETRO]: [{ from: "九州鉄道記念館から歩いておよそ7分、", to: "九州鉄道記念館から歩いておよそ11分、" }],
  [IDEMITSU]: [
    { from: "静かに作品と向き合うひとときを過ごしてください。", to: "静かに作品と向き合うひとときを過ごしましょう。" },
  ],
  [SANGI]: [
    { from: "出光美術館から歩いておよそ3分、", to: "出光美術館から歩いておよそ12分、" },
    { from: "この百畳間で締めくくってください。", to: "この百畳間で締めくくりましょう。" },
    { from: "お帰りは、歩いておよそ10分の門司港駅からご利用ください。", to: "見学を終えたら、歩いておよそ8分の門司港駅へ向かい、帰りましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: JINDO, h: 10, m: 45, stay: 30, legs: [] },
  { id: MEKARI, h: 11, m: 17, stay: 15, legs: [walk(2)] },
  { id: KOEN, h: 11, m: 43, stay: 30, legs: [walk(11)] },
  { id: BRIDGE, h: 12, m: 23, stay: 15, legs: [walk(10)] },
  { id: DAIREN, h: 12, m: 51, stay: 20, legs: [taxi(13)] },
  { id: MUSEUM, h: 13, m: 13, stay: 80, legs: [walk(2)] },
  { id: ZEIKAN, h: 14, m: 45, stay: 30, legs: [walk(12)] },
  { id: BLUE, h: 15, m: 17, stay: 25, legs: [walk(2)] },
  { id: TENBO, h: 15, m: 45, stay: 60, legs: [walk(3)] },
];
const DAY2: Plan = [
  { id: OSAKA, h: 9, m: 0, stay: 35, legs: [] },
  { id: MITSUI, h: 9, m: 40, stay: 45, legs: [walk(5)] },
  { id: YUKO, h: 10, m: 32, stay: 30, legs: [walk(7)] },
  { id: EKI, h: 11, m: 11, stay: 30, legs: [walk(9)] },
  { id: PLAZA, h: 11, m: 45, stay: 60, legs: [walk(4)] },
  { id: TETSU, h: 12, m: 52, stay: 65, legs: [walk(7)] },
  { id: RETRO, h: 14, m: 8, stay: 41, legs: [walk(11)] },
  { id: IDEMITSU, h: 14, m: 54, stay: 50, legs: [walk(5)] },
  { id: SANGI, h: 15, m: 56, stay: 40, legs: [walk(12)] },
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
    for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ、", "ホテル", "旅館"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
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
