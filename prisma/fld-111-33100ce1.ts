/**
 * 初日・最終日の見直し #111 33100ce1「日御碕神社と日御碕灯台、出雲の岬と絶景を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 歩きは routed-foot、車は OSRM（新しい区間・変わった区間は切り上げ＋5）。もとの「車」はレンタカーの話がないので、出雲市駅で借りて返す（手続き15分ずつ）
 * 1日目: 出雲市駅 10:30ごろ → レンタカー（手続き15分）→ 車24（OSRM 18.7）→ 日御碕神社 11:09（70→40）→ 歩3 → 経島 11:52 → 歩6（5.7）→ 日御碕の遊歩道 12:13 →
 *   歩4（3.6）→ 日御碕の集落 13:02〜14:02（昼食）→ 歩3（2.4）→ 日御碕灯台 14:05 → 車18（OSRM 12.1）→ 出雲文化伝承館 15:13（75→60）→
 *   車10（OSRM 4.7）→ 稲佐の浜 16:23〜16:58（60→35）→ 車8（OSRM 2.1）で神門通りのまわりの宿。
 *   日御碕ビジターセンターは外す（説明文にない。昼食の点にその建物を使う）
 * 2日目（終わり 16:36 はもとのまま）: 宿 → 歩10（733m）→ 出雲大社 9:00 → 歩5（324m）→ 神楽殿 10:05 → 歩3 → 宝物殿 10:28 → 歩5（330m）→ 命主社 11:08 →
 *   歩3（204m）→ 北島国造館 11:36〜12:11 → 歩12（864m）→ 神門通り 12:23〜13:43（昼食）→ 歩13（944m）→ 旧大社駅 13:56 → 車11（OSRM 5.3）→
 *   奉納山公園 15:02〜16:36（95→94。滞在はもとより長くしない。法務: 終わりは最後のスポットを出る時刻）→ 車18（OSRM 12.3）で出雲市駅、レンタカーを返す（15分）
 * 点: 日御碕神社・日御碕灯台は、ほかのしおり（21f198de など）と同じ点（OSM way 1219746865・454970181。いまは度分秒の形）／
 *   集落（昼食）＝OSM「日御碕ビジターセンター」way 1219250922（店ではない名前の点）／
 *   稲佐の浜＝ほかのしおり（bb5348fc）と同じ弁天島 islet way 463193216（メモに弁天島）／出雲大社＝ほかのしおり（bb5348fc など3本）と同じ way 52958212／
 *   神楽殿＝OSM way 412920137／宝物殿＝ほかのしおり（bb5348fc）と同じ way 404484666／
 *   北島国造館＝OSM「大門」way 413137877（Nominatim。出雲観光協会 https://izumo-kankou.gr.jp/4761 の北島国造館の案内に「O-mon」（1859年の正門）・心字池・亀山があり、OSM の大門・心字池（reservoir）・亀山会館が出雲大社の東どなりにそろう。公式の住所の杵築東194番地は、地理院の住所検索だと八雲山の中（いまの点、約650m北）で、筆の中心のため使わない）／
 *   奉納山公園＝OSM「奉納山」peak node 6329613324（メモは山頂の展望台。いまは公園の面の中心）
 * 奉納山の「標高75m」（OSM は73）と名前の由来の一文は出典が見つからないので外す。三瓶山の眺めは出雲市の資料（mitibiki.pdf）で確かめた
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-111-33100ce1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "33100ce1-b739-4342-826f-4de81880d252";
const DAY1_ID = "4a8e2c7e-8b0b-40a0-b001-324f41cfb3ab";
const DAY2_ID = "fc711947-e26d-45a2-9279-25807eb90f28";
const JINJA = "38e92149-165b-4f72-99de-8c35c5454f15";
const FUMI = "dfaa7a7d-d7c8-4985-bbb0-2ea416a35b26";
const YUHO = "f542a416-37a8-45b8-b1a7-35c2ba4eb89f";
const SHURAKU = "8ca9363d-6bfe-4570-a27b-b47916d7c50a";
const VC = "e354880b-3e03-45a5-a246-110bf4137254";
const TODAI = "5463a6b6-4c63-4dfe-9fb3-f4d31bff6340";
const DENSHO = "0142d1ea-d37a-4f0a-9d75-d8a0e9e777ae";
const INASA = "02f1daaa-b394-472c-93f8-a86116d24840";
const TAISHA = "37f1d050-347e-4869-a61d-a4b2d54f97e6";
const KAGURA = "03780a2d-9939-4313-b72b-ff4f5306e159";
const HOMOTSU = "0ea871a3-8453-4b28-abf8-ddc830764259";
const INOCHI = "848f7a92-b96e-429f-9ae2-8cb321d84976";
const KITA = "9e7c23a1-ddb8-4f2b-a36c-dee37c34a8ac";
const SHINMON = "0094d07d-e729-4467-a01a-257929ccbbcc";
const KYUEKI = "41fec130-b80c-4f78-b502-86b533886bec";
const HONO = "ccf0f433-8b9c-4cdb-b220-9d3b355896a3";
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
  [JINJA]: { from: [35.429556, 132.629306], to: [35.429558, 132.629416] },
  [TODAI]: { from: [35.433889, 132.629167], to: [35.433743, 132.629271] },
  [SHURAKU]: { from: [35.4324, 132.6296], to: [35.43262, 132.629739] },
  [INASA]: { from: [35.395781, 132.673612], to: [35.400296, 132.671897] },
  [TAISHA]: { from: [35.404007, 132.685482], to: [35.399803, 132.685151] },
  [KAGURA]: { from: [35.4015, 132.684427], to: [35.401531, 132.684427] },
  [HOMOTSU]: { from: [35.401066, 132.686099], to: [35.4011, 132.686085] },
  [KITA]: { from: [35.407349, 132.687164], to: [35.40088, 132.687102] },
  [HONO]: { from: [35.401395, 132.675946], to: [35.401624, 132.676319] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [JINJA]: [
    { from: "本日は日御碕神社からスタートです。", to: "出雲市駅に10時半ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ24分、日御碕神社から旅を始めます。" },
    { from: "「日が沈む聖地の宮」とも呼ばれるこの神社を、静かに、敬意をもってお参りしましょう。見学を終えたら、歩いて経島へ向かいましょう。", to: `「日が沈む聖地の宮」とも呼ばれる神社です。${PRAY_TO}見学を終えたら、歩いておよそ3分、経島へ向かいましょう。` },
  ],
  [FUMI]: [
    { from: "日御碕神社を参拝したら、歩いて経島へ向かいましょう。", to: "日御碕神社から歩いておよそ3分、経島を眺めます。" },
    { from: "見学を終えたら、日御碕の遊歩道を歩いて海岸沿いを進みましょう。", to: "見学を終えたら、歩いておよそ6分、日御碕の遊歩道へ向かいましょう。" },
  ],
  [YUHO]: [
    { from: "経島を眺めたら、日御碕の遊歩道を歩いて海岸沿いを進みましょう。", to: "経島から歩いておよそ6分、日御碕の遊歩道で海岸沿いを進みましょう。" },
    { from: "散策を終えたら、日御碕の集落へ向かいましょう。", to: "散策を終えたら、歩いておよそ4分、日御碕の集落へ向かいましょう。" },
  ],
  [SHURAKU]: [
    { from: "遊歩道を歩いたら、日御碕の集落を散策しましょう。", to: "遊歩道から歩いておよそ4分、日御碕の集落に着きます。" },
    { from: "ここで昼食をとるのがおすすめです。", to: "ここで昼食をとりましょう。" },
    { from: "見学を終えたら、日御碕ビジターセンターへ向かいましょう。", to: "食事を終えたら、歩いておよそ3分、日御碕灯台へ向かいましょう。" },
  ],
  [TODAI]: [
    { from: "日御碕ビジターセンターを見学したら、日御碕灯台へ向かいましょう。", to: "日御碕の集落から歩いておよそ3分、日御碕灯台に着きます。" },
    { from: "動きやすい服装と靴でお出かけください。", to: "動きやすい服装と靴で出かけましょう。" },
    { from: "見学を終えたら、車でおよそ23分の出雲文化伝承館へ向かいましょう。", to: "見学を終えたら、車でおよそ18分、出雲文化伝承館へ向かいましょう。" },
  ],
  [DENSHO]: [
    { from: "日御碕灯台を見学したら、車でおよそ23分の出雲文化伝承館へ向かいましょう。", to: "日御碕灯台から車でおよそ18分、出雲文化伝承館に着きます。" },
    { from: "見学を終えたら、車でおよそ9分の稲佐の浜へ向かいましょう。", to: "見学を終えたら、車でおよそ10分、稲佐の浜へ向かいましょう。" },
  ],
  [INASA]: [
    { from: "出雲文化伝承館を見学したら、車でおよそ9分の稲佐の浜へ向かいましょう。", to: "出雲文化伝承館から車でおよそ10分、稲佐の浜に着きます。" },
    { from: "今夜はこの近くの宿にご宿泊ください。", to: "この夜は、車でおよそ8分の、出雲大社の門前・神門通りのまわりの宿に泊まりましょう。" },
  ],
  [TAISHA]: [
    { from: "本日は出雲大社からスタートです。", to: "神門通りのまわりの宿から歩いておよそ10分、2日目は出雲大社から始めます。" },
    { from: "多くの人が訪れる祈りの場ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、歩いて神楽殿へ向かいましょう。", to: `${PRAY_TO}見学を終えたら、歩いておよそ5分、神楽殿へ向かいましょう。` },
  ],
  [KAGURA]: [
    { from: "出雲大社を参拝したら、歩いて神楽殿へ向かいましょう。", to: "出雲大社から歩いておよそ5分、神楽殿に着きます。" },
    { from: "見学を終えたら、歩いて宝物殿(神祜殿)へ向かいましょう。", to: "見学を終えたら、歩いておよそ3分、宝物殿(神祜殿)へ向かいましょう。" },
  ],
  [HOMOTSU]: [
    { from: "神楽殿を見学したら、歩いて宝物殿(神祜殿)へ向かいましょう。", to: "神楽殿から歩いておよそ3分、宝物殿(神祜殿)に着きます。" },
    { from: "見学を終えたら、歩いて命主社へ向かいましょう。", to: "見学を終えたら、歩いておよそ5分、命主社へ向かいましょう。" },
  ],
  [INOCHI]: [
    { from: "宝物殿を見学したら、歩いて命主社へ向かいましょう。", to: "宝物殿から歩いておよそ5分、命主社に着きます。" },
    { from: "静かに、敬意をもって参拝しましょう。見学を終えたら、歩いて北島国造館へ向かいましょう。", to: `${PRAY_TO}見学を終えたら、歩いておよそ3分、北島国造館へ向かいましょう。` },
  ],
  [KITA]: [
    { from: "命主社を参拝したら、歩いて北島国造館へ向かいましょう。", to: "命主社から歩いておよそ3分、北島国造館に着きます。" },
    { from: "静かに、敬意をもって歩いてみましょう。見学を終えたら、神門通りを歩いて旧大社駅へ向かいましょう。", to: `${PRAY_TO}見学を終えたら、歩いておよそ12分、神門通りへ向かいましょう。` },
  ],
  [SHINMON]: [
    { from: "北島国造館を参拝したら、神門通りを歩いて旧大社駅へ向かいましょう。", to: "北島国造館から歩いておよそ12分、神門通りに着きます。" },
    { from: "食べ歩きをしながら、ここで昼食をとるのもおすすめです。", to: "ここで昼食をとりましょう。" },
    { from: "見学を終えたら、歩いて旧大社駅へ向かいましょう。", to: "食事を終えたら、歩いておよそ13分、旧大社駅へ向かいましょう。" },
  ],
  [KYUEKI]: [
    { from: "神門通りを歩いたら、旧大社駅へ向かいましょう。", to: "神門通りから歩いておよそ13分、旧大社駅に着きます。" },
    { from: "見学を終えたら、車で奉納山公園へ向かいましょう。", to: "見学を終えたら、車でおよそ11分、奉納山公園へ向かいましょう。" },
  ],
  [HONO]: [
    { from: "旧大社駅を見学したら、車で奉納山公園へ向かいましょう。標高75mの小さな山に整備された公園で、", to: "旧大社駅から車でおよそ11分、奉納山公園に着きます。小高い山に整備された公園で、" },
    {
      from: "公園の名前は、中世の巡礼者たちがこの山に経文を納めたことに由来すると伝わります。山頂への道すがら、歌舞伎の創始者・出雲阿国を顕彰する「阿国塔」と、阿国の墓と伝わる場所もたずねてみましょう。静かに、敬意をもってお参りしましょう。",
      to: "山頂への道すがらには、歌舞伎の始まりとされる踊りを広めた出雲阿国をたたえる「於国塔」と、「出雲阿国終焉地之碑」があります。碑のまわりでは、静かに過ごしましょう。",
    },
    {
      from: "日御碕神社と日御碕灯台、出雲の岬と絶景を巡る旅、これで終わりです。",
      to: "見学を終えたら、車でおよそ18分の出雲市駅へ戻り、レンタカーを返しましょう（返す手続きに15分ほど）。日御碕神社と日御碕灯台、出雲の岬と絶景を巡る旅、これで終わりです。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: JINJA, h: 11, m: 9, stay: 40, legs: [] },
  { id: FUMI, h: 11, m: 52, stay: 15, legs: [walk(3)] },
  { id: YUHO, h: 12, m: 13, stay: 45, legs: [walk(6)] },
  { id: SHURAKU, h: 13, m: 2, stay: 60, legs: [walk(4)] },
  { id: TODAI, h: 14, m: 5, stay: 50, legs: [walk(3)] },
  { id: DENSHO, h: 15, m: 13, stay: 60, legs: [car(18)] },
  { id: INASA, h: 16, m: 23, stay: 35, legs: [car(10)] },
];
const DAY2: Plan = [
  { id: TAISHA, h: 9, m: 0, stay: 60, legs: [] },
  { id: KAGURA, h: 10, m: 5, stay: 20, legs: [walk(5)] },
  { id: HOMOTSU, h: 10, m: 28, stay: 35, legs: [walk(3)] },
  { id: INOCHI, h: 11, m: 8, stay: 25, legs: [walk(5)] },
  { id: KITA, h: 11, m: 36, stay: 35, legs: [walk(3)] },
  { id: SHINMON, h: 12, m: 23, stay: 80, legs: [walk(12)] },
  { id: KYUEKI, h: 13, m: 56, stay: 55, legs: [walk(13)] },
  { id: HONO, h: 15, m: 2, stay: 94, legs: [car(11)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } }, photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [JINJA, FUMI, YUHO, SHURAKU, VC, TODAI, DENSHO, INASA].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [TAISHA, KAGURA, HOMOTSU, INOCHI, KITA, SHINMON, KYUEKI, HONO].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const vc = all.find((x) => x.id === VC)!;
  if (vc.photos.length) throw new Error("ビジターセンターに写真があります");
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
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "見学したら", "ビジターセンター", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  console.log(`外すスポット: ${vc.name}（写真 ${vc.photos.length}枚）`);
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [VC] });
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
