/**
 * 初日・最終日の見直し #56 2b09beea「琉球王国の歴史を感じる、那覇の「今」を巡る旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目）
 * 歩きは routed-foot、タクシーは OSRM の切り上げ＋5（バスの時刻に頼らない）。ゆいレール 那覇空港→牧志 16分（https://www.yui-rail.co.jp/routemap/nahakuko/?t=timetable の標準時間）
 * 1日目: 那覇空港駅 10:30ごろ → ゆいレール16 → 牧志駅 → 歩9（648m）→ 壺屋やちむん通り 11:00 → 歩6（379m）→ 平和通り商店街 12:04（40→39）→ 歩2（144m）→
 *   第一牧志公設市場 12:45〜13:35（昼食。2階の飲食店街）→ 歩27（2,026m）→ 対馬丸記念館 14:02 → 歩4（286m）→ 波上宮 14:56 → 歩10（691m）→
 *   波の上ビーチ 15:41（55→25）→ 歩12（844m）→ 福州園 16:18〜16:58（50→40）
 *   奥武山公園は外す（壺屋・対馬丸から歩いて約30分ずつ。タイトル・説明文にない）。市場・平和通り・壺屋の順を逆にして、市場で昼食
 * 2日目（終わり 16:34 はもとのまま）: 宿（福州園のまわり）→ タクシー10（OSRM 4.2）→ 崇元寺石門 9:00 → 歩13（932m。もと10）→ 沖縄県立博物館・美術館 9:43 →
 *   歩22（1,575m。もと10）→ 国際通り 11:35（昼食）→ タクシー14（OSRM 9.0。もとはバス12）→ 識名園 12:47 → タクシー9（OSRM 3.4。もとはバス8）→
 *   首里金城町石畳道 14:11 → 歩11（819m、上り。もと5）→ 首里城公園 15:03〜16:34（115→91）→ 首里駅まで歩13（987m）
 * 点: 第一牧志公設市場＝OSM marketplace way 533600878（いまは 4けたの丸めた点）／平和通り＝way 48289716 の node 2206746122／
 *   壺屋やちむん通り＝OSM「壺屋やちむん通り」way 104798533 の Nominatim の点（#22 と同じ点、法務）／波の上ビーチ＝浜の way 51392303 の node 1105892368（いまは4けたの丸めた点）／
 *   崇元寺石門＝OSM「旧崇元寺石門」way 1031630878（いまは540mずれた丸めた点）／博物館＝OSM way 104013354（いまは700mずれた丸めた点）／
 *   国際通り＝way 1005199589 の node 1560591120／識名園＝地理院の番地（真地421番地。OSM は庭園全体の way だけ）／
 *   首里金城町石畳道＝way 124868413 の node 9180021930／首里城公園＝OSM「首里城」historic=castle node 4828423125
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-056-2b09beea.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2b09beea-4deb-45cc-bae3-41ba5f80df2c";
const DAY1_ID = "9a0f1268-45a3-408d-8e9e-0d28ea9dc39c";
const DAY2_ID = "47abe577-5c0e-4b8f-bcf7-17c2177d0415";
const ICHI = "a31fe523-af37-4ca0-adcb-a7c7bf606b20";
const HEIWA = "b86214de-1347-4e4a-abf1-8b5ca7ac0e21";
const TSUBO = "bafb85b0-f818-454e-8d16-de3f42ba5d8f";
const OU = "ffda7890-a7bf-41de-9d61-c81c6d31c22c";
const TSUSHIMA = "e4088ac5-5f9d-496e-9852-e6c0cbc50d8f";
const NAMI = "7650a24f-e250-4063-a6b8-47c2b9c22de0";
const BEACH = "36e4272c-e48a-42a2-8001-67552a3410e2";
const FUKU = "75a5f18c-878a-47b9-8796-f5237b66a880";
const SOGEN = "ea22af0d-2b43-45a9-a0a4-bf62d7d5b6cf";
const HAKU = "1c500289-7790-41f3-89d2-1cf7d65d5cc0";
const KOKU = "80ac9bf7-c0d0-476f-ab80-055bbc795110";
const SHIKINA = "e9ec11a1-248a-422d-a77a-0463d207575c";
const KINJO = "70aa8614-85d1-4916-84af-364e85c711d5";
const SHURI = "6d596df2-544d-45d5-a85a-ce252f6cc4f3";
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
  [ICHI]: { from: [26.2144, 127.6873], to: [26.214546, 127.688288] },
  [HEIWA]: { from: [26.214979, 127.688766], to: [26.214588, 127.688871] },
  [TSUBO]: { from: [26.212461, 127.69236], to: [26.212911, 127.691807] },
  [BEACH]: { from: [26.2225, 127.6767], to: [26.221489, 127.671996] },
  [SOGEN]: { from: [26.2211, 127.6845], to: [26.220336, 127.690595] },
  [HAKU]: { from: [26.2211, 127.6889], to: [26.227159, 127.693718] },
  [KOKU]: { from: [26.2158, 127.6893], to: [26.21619, 127.687927] },
  [SHIKINA]: { from: [26.204071, 127.715733], to: [26.203968, 127.716248] },
  [KINJO]: { from: [26.2145, 127.7188], to: [26.214591, 127.714431] },
  [SHURI]: { from: [26.217, 127.7192], to: [26.217001, 127.719373] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TSUBO]: [
    {
      from: "平和通りから歩いておよそ8分、壺屋(つぼや)やちむん通りに着きます。",
      to: "那覇空港駅に10時半ごろ着いたら、ゆいレールでおよそ16分の牧志駅へ。駅から歩いておよそ9分、壺屋(つぼや)やちむん通りに着きます。",
    },
    { from: "お気に入りの器を探しながら、昔ながらの路地の雰囲気もあわせて楽しんでみてください。この先は奥武山公園へ向かいます。", to: "お気に入りの器を探しながら、昔ながらの路地の雰囲気もあわせて楽しみましょう。この後は、歩いておよそ6分、平和通り商店街へ向かいましょう。" },
  ],
  [HEIWA]: [
    { from: "第一牧志公設市場から歩いておよそ3分、平和通り商店街に着きます。", to: "壺屋やちむん通りから歩いておよそ6分、平和通り商店街に着きます。" },
    { from: "地元の暮らしが感じられる通りを歩いてみてください。この後は、壺屋やちむん通りへ向かいましょう。", to: "地元の暮らしが感じられる通りを歩いてみましょう。この後は、歩いておよそ2分、第一牧志公設市場へ向かいましょう。" },
  ],
  [ICHI]: [
    { from: "ゆいレール牧志駅から徒歩約5分、「県民の台所」とも呼ばれる第一牧志公設市場から、旅を始めます。", to: "平和通り商店街から歩いておよそ2分、「県民の台所」とも呼ばれる第一牧志公設市場に着きます。" },
    { from: "調理してもらって味わうことができるんです。", to: "調理してもらって味わうことができます。" },
    { from: "まずはここで那覇の食文化を感じてから、歩いてすぐの平和通り商店街へ向かいましょう。", to: "ここで、那覇の食文化を感じながら昼食をとりましょう。食事を終えたら、歩いておよそ27分、海のそばの対馬丸記念館へ向かいましょう。" },
  ],
  [TSUSHIMA]: [
    { from: "ビーチへ向かう前に、少し足を止めて訪れたいのが対馬丸記念館です。", to: "第一牧志公設市場から歩いておよそ27分、対馬丸記念館に着きます。" },
    { from: "館内では、犠牲になった子どもたちに思いを寄せながら、静かに見学しましょう。", to: "館内では、犠牲になった子どもたちに思いを寄せましょう。慰霊の場でもあるので、静かに、敬意をもって見学しましょう。この後は、歩いておよそ4分、波上宮へ向かいましょう。" },
  ],
  [NAMI]: [
    { from: "対馬丸記念館から歩いておよそ3分、", to: "対馬丸記念館から歩いておよそ4分、" },
    { from: "境内では静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "この後は、この神社の名の由来にもなった波の上ビーチへ向かいましょう。", to: "この後は、歩いておよそ10分、この神社の名の由来にもなった波の上ビーチへ向かいましょう。" },
  ],
  [BEACH]: [{ from: "海風に吹かれながらひと休みしたら、続いては福州園へ向かいましょう。", to: "海風に吹かれながらひと休みしたら、歩いておよそ12分、福州園へ向かいましょう。" }],
  [FUKU]: [
    { from: "波の上ビーチから歩いておよそ8分、", to: "波の上ビーチから歩いておよそ12分、" },
    { from: "久米の歴史に思いを馳せながら、1日目の旅を締めくくってください。今夜はこの近くの宿でゆっくり休みましょう。", to: "久米の歴史に思いを馳せながら、1日目の旅を締めくくりましょう。この夜は、福州園のまわりの宿に泊まりましょう。" },
  ],
  [SOGEN]: [
    { from: "2日目最初に訪れるのは崇元寺石門です。", to: "宿からタクシーでおよそ10分、2日目は崇元寺石門から始めます。" },
    { from: "静かに、敬意をもって見学してください。ここから沖縄県立博物館・美術館へ向かい、", to: "静かに、敬意をもって見学しましょう。ここから歩いておよそ13分、沖縄県立博物館・美術館へ向かい、" },
  ],
  [HAKU]: [
    { from: "次に訪れるのは、通称「おきみゅー」", to: "崇元寺石門から歩いておよそ13分、次に訪れるのは、通称「おきみゅー」" },
    { from: "見学のあとは、再び国際通りへ戻って那覇の中心部を歩きましょう。", to: "見学のあとは、歩いておよそ22分、再び国際通りへ戻って那覇の中心部を歩きましょう。" },
  ],
  [KOKU]: [
    { from: "那覇でも有数のにぎわいを見せる国際通りに戻ってきました。", to: "沖縄県立博物館・美術館から歩いておよそ22分、那覇でも有数のにぎわいを見せる国際通りに戻ってきました。" },
    { from: "歴史散策の合間に、お土産探しや食べ歩きで、ここを昼食にするのもおすすめです。次は車で識名園へ向かい、琉球王家の庭園を訪ねましょう。", to: "お土産探しをしながら、通りの食事処で昼食をとりましょう。この後は、タクシーでおよそ14分、識名園へ向かい、琉球王家の庭園を訪ねましょう。タクシーは、前もって予約しておくと安心です。" },
  ],
  [SHIKINA]: [
    { from: "国際通りからバスでおよそ12分、", to: "国際通りからタクシーでおよそ14分、" },
    { from: "緑豊かな庭園を、池のまわりをめぐりながらのんびりと散策してみてください。この後はバスで、首里金城町石畳道へ向かいましょう。", to: "緑豊かな庭園を、池のまわりをめぐりながらのんびりと散策しましょう。この後は、タクシーでおよそ9分、首里金城町石畳道へ向かいましょう。タクシーは、前もって予約しておくと安心です。" },
  ],
  [KINJO]: [
    { from: "識名園からバスでおよそ8分、", to: "識名園からタクシーでおよそ9分、" },
    { from: "この石畳を上りきった先が、いよいよ今日最後の目的地、首里城公園です。", to: "この石畳を上りきり、歩いておよそ11分で、いよいよ今日最後の目的地、首里城公園です。" },
  ],
  [SHURI]: [
    { from: "旅の最後は首里城公園です。", to: "首里金城町石畳道から歩いておよそ11分、旅の最後は首里城公園です。" },
    { from: "出かける前に公式の案内で確かめてください。", to: "出かける前に公式の案内で確かめましょう。" },
    {
      from: "1泊2日の那覇の旅を締めくくってください。お帰りは、ゆいレール首里駅(徒歩15分)、または首里城下町線バス「首里城前」バス停(徒歩1分)からご利用ください。",
      to: "1泊2日の那覇の旅を締めくくりましょう。見学を終えたら、歩いておよそ13分のゆいレール首里駅から帰りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: TSUBO, h: 11, m: 0, stay: 58, legs: [] },
  { id: HEIWA, h: 12, m: 4, stay: 39, legs: [walk(6)] },
  { id: ICHI, h: 12, m: 45, stay: 50, legs: [walk(2)] },
  { id: TSUSHIMA, h: 14, m: 2, stay: 50, legs: [walk(27)] },
  { id: NAMI, h: 14, m: 56, stay: 35, legs: [walk(4)] },
  { id: BEACH, h: 15, m: 41, stay: 25, legs: [walk(10)] },
  { id: FUKU, h: 16, m: 18, stay: 40, legs: [walk(12)] },
];
const DAY2: Plan = [
  { id: SOGEN, h: 9, m: 0, stay: 30, legs: [] },
  { id: HAKU, h: 9, m: 43, stay: 90, legs: [walk(13)] },
  { id: KOKU, h: 11, m: 35, stay: 58, legs: [walk(22)] },
  { id: SHIKINA, h: 12, m: 47, stay: 75, legs: [taxi(14)] },
  { id: KINJO, h: 14, m: 11, stay: 41, legs: [taxi(9)] },
  { id: SHURI, h: 15, m: 3, stay: 91, legs: [walk(11)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [ICHI, HEIWA, TSUBO, OU, TSUSHIMA, NAMI, BEACH, FUKU].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [SOGEN, HAKU, KOKU, SHIKINA, KINJO, SHURI].join()) throw new Error("2日目の構成が想定と違います");
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
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "奥武山", "バス", "んです", "ますよ", "ですね"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
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
  console.log("\n外す: 奥武山公園（1日目、写真1枚もいっしょに消える）");
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [OU] });
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
