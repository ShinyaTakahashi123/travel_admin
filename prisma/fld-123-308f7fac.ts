/**
 * 初日・最終日の見直し #123 308f7fac「阿蘇神社と一の宮門前町、火の国の信仰と参道グルメの1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 車は OSRM、歩きは routed-foot（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * もとは「車で」だけで借りる・返す場所がないので、阿蘇駅で借りて返す（手続き15分ずつ）
 * 1日目: 阿蘇駅 10:30ごろ → レンタカー（手続き15分）→ 車13（7.7）→ 阿蘇神社 10:58（45→35）→ 歩6（413m。もと5）→ 極楽寺 11:39（35→20）→
 *   歩6で阿蘇神社の車＋車21（18.4、もとのまま）→ 大観峰 12:26〜13:26（茶店で昼食、75→60。OSM「阿蘇大観峰茶店」restaurant way 413089463）→ 車31（29.0）→
 *   阿蘇火山博物館 13:57（70→45）→ 車16（10.2。もと8）→ 米塚 14:58（30→15）→ 車15（9.8。もと9）→ 草千里ヶ浜 15:28（55→40）→ 車28（20.3）→
 *   内牧温泉 16:36〜16:56（50→20）→ 内牧温泉の宿
 * 2日目（16:30 に出るのはもとのまま）: 宿 → 車16（10.7）→ 一の宮門前町 9:30（100）→ 車12（7.2）→ 道の駅阿蘇 11:22〜12:32（昼食、70。まわりに OSM の食事処の点3つ）→
 *   車21（15.2）→ 国造神社 12:53（35）→ 車16（12.9）→ 霜神社 13:44（40）→ 車20（14.1）→【新】仙酔峡 14:44〜15:14（企画運営。国交省 多言語解説
 *   https://www.mlit.go.jp/tagengo-db/common/001555895.pdf「海抜900メートル…中岳と高岳の登山道の入り口…5月と6月に5万本のミヤマキリシマツツジが咲き乱れ…
 *   火山灰を含む風が吹いてくることがあります」）→ 車14（8.7）→ アゼリア21長者乃湯 15:28〜16:30（80→62）→ 車12（6.1）で阿蘇駅、レンタカーを返す（15分）
 * 外す: 中通古墳群（企画運営 10/30。OSM・地理院の地名検索になく、地理院地図ではいまの点は住宅の中で古墳の記号もない。写真なし、タイトル・説明文に名前なし）
 * 点: 米塚＝OSM「米塚」peak node 2518325691（ほかのしおりと同じ）／一の宮門前町＝OSM「阿蘇門前町商店街｜門前仲町」way 1354414474（いまは4けたの点）／
 *   道の駅阿蘇＝OSM「道の駅あそ」rest_area way 436808993（いまは案内所の点）／霜神社＝OSM「霜宮神社」way 416540345／長者乃湯＝OSM public_bath way 412925637（いまは約270m南）／
 *   仙酔峡＝OSM 遊歩道 relation 21139468「Sensuikyo Gorge Trail」の起点の node 2509687512（駐車場のそば。廃止のロープウェイの駅の建物は使わない）
 *   内牧温泉・国造神社は、地理院の地名検索の値（「阿蘇内牧温泉」32.977225,131.042219・「国造神社」32.9894066780556,131.121677888889）そのままなので変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-123-308f7fac.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "308f7fac-0186-44e2-9eed-1f56ccc593c9";
const DAY1_ID = "4d271c0e-c2d2-4d38-847f-badb7096cdc4";
const DAY2_ID = "c402c415-a28f-4716-8252-f76ebcc4e76a";
const JINJA = "2eb1accb-9f61-484a-9506-de9e340e80a5";
const GOKU = "a43f8b04-7db6-4c01-a247-7dc2e43d2c7e";
const DAIKAN = "7854c8f1-4838-4bba-9aad-eaa30fa5d03b";
const KAZAN = "bb801bb6-df64-47e6-8dbd-8da6c8b7f1d1";
const KOME = "a89dd134-a8d2-4538-9121-135eec95401b";
const KUSA = "7c8fed28-e248-4190-ade3-e4d5220ecea5";
const UCHI = "b58863fa-ffd8-4ee0-9ff3-4af7fda70f34";
const MONZEN = "213c13de-ed80-4d4a-8c90-71f8a5304215";
const MICHI = "fe4728f4-adf1-4396-998d-da56e06a9832";
const KOKU = "a26cf907-320b-462e-86fc-4e6267a822a7";
const SHIMO = "660d4da5-6963-4592-a172-a95d686e3114";
const NAKA = "1a149511-aec9-4a2d-8eeb-f4def29046e2";
const CHOJA = "22cd9fc7-da49-41ae-ae1b-94eb0856262e";
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
  [KOME]: { from: [32.905591, 131.044417], to: [32.905646, 131.044407] },
  [MONZEN]: { from: [32.9481, 131.1178], to: [32.949247, 131.116757] },
  [MICHI]: { from: [32.937012, 131.080879], to: [32.936568, 131.081014] },

  [CHOJA]: { from: [32.926544, 131.109146], to: [32.928898, 131.109817] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const SENSUI = "new-sensuikyo";
const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [SENSUI]: {
    name: "仙酔峡",
    lat: 32.898896,
    lng: 131.102944,
    address: "熊本県阿蘇市一の宮町",
    memo: "霜神社から車でおよそ20分、海抜およそ900mの仙酔峡に着きます。中岳と高岳の登山道の入り口にあたる渓谷で、阿蘇カルデラとまわりの山々を見渡せます。5月から6月にかけてはミヤマキリシマが咲き、渓谷をピンクや紫に染めます。花の時期でなくても、古い溶岩に囲まれた渓谷の眺めを楽しみましょう。中岳から火山灰を含む風が吹いてくることがあるので、気になる方は気をつけましょう。火山の状況による規制は、出かける前に公式の情報を確かめましょう。見学を終えたら、車でおよそ14分、アゼリア21長者乃湯へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [JINJA]: [
    {
      from: "本日は阿蘇神社からスタートです。",
      to: "JR阿蘇駅に10時半ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ13分、阿蘇神社から旅を始めます。",
    },
    { from: "幾度もの試練を乗り越えて蘇った荘厳な社殿を、静かに、敬意をもってお参りしましょう。", to: `幾度もの試練を乗り越えて蘇った、荘厳な社殿です。${PRAY_TO}` },
    { from: "見学を終えたら、歩いて極楽寺へ向かいましょう。", to: "見学を終えたら、歩いておよそ6分、極楽寺へ向かいましょう。" },
  ],
  [GOKU]: [
    { from: "阿蘇神社を参拝したら、歩いて極楽寺へ向かいましょう。", to: "阿蘇神社から歩いておよそ6分、極楽寺に着きます。" },
    { from: "歴史を伝えるお寺を、静かに、敬意をもって歩いてみましょう。", to: PRAY_TO },
    { from: "見学を終えたら、車で大観峰へ向かいましょう。", to: "見学を終えたら、歩いておよそ6分で阿蘇神社のそばにとめた車に戻り、車でおよそ21分、大観峰へ向かいましょう。" },
  ],
  [DAIKAN]: [
    { from: "極楽寺を参拝したら、車で大観峰へ向かいましょう。", to: "極楽寺から歩いておよそ6分で車に戻り、車でおよそ21分、大観峰に着きます。" },
    { from: "展望所のそばには茶店もあり、阿蘇の景色を眺めながら昼食をとるのもおすすめです。", to: "展望所のそばには茶店もあるので、阿蘇の景色を眺めながら、ここで昼食をとりましょう。" },
    { from: "見学を終えたら、車で阿蘇火山博物館へ向かいましょう。", to: "見学を終えたら、車でおよそ31分、阿蘇火山博物館へ向かいましょう。" },
  ],
  [KAZAN]: [
    { from: "大観峰を見学したら、車で阿蘇火山博物館へ向かいましょう。", to: "大観峰から車でおよそ31分、阿蘇火山博物館に着きます。" },
    { from: "見学を終えたら、車でおよそ8分の米塚へ向かいましょう。", to: "見学を終えたら、車でおよそ16分、米塚へ向かいましょう。" },
  ],
  [KOME]: [
    { from: "阿蘇火山博物館を見学したら、車で米塚へ向かいましょう。", to: "阿蘇火山博物館から車でおよそ16分、米塚に着きます。" },
    { from: "見学を終えたら、車で草千里ヶ浜へ向かいましょう。", to: "見学を終えたら、車でおよそ15分、草千里ヶ浜へ向かいましょう。" },
  ],
  [KUSA]: [
    { from: "米塚を見学したら、車で草千里ヶ浜へ向かいましょう。", to: "米塚から車でおよそ15分、草千里ヶ浜に着きます。" },
    { from: "見学を終えたら、車で内牧温泉へ向かいましょう。", to: "見学を終えたら、車でおよそ28分、内牧温泉へ向かいましょう。" },
  ],
  [UCHI]: [
    { from: "草千里ヶ浜を見学したら、車で内牧温泉へ向かいましょう。", to: "草千里ヶ浜から車でおよそ28分、内牧温泉に着きます。" },
    { from: "今夜はこの近くの宿にご宿泊ください。", to: "この夜は、内牧温泉の宿に泊まりましょう。" },
  ],
  [MONZEN]: [
    { from: "旅の2日目は一の宮門前町からスタートです。", to: "内牧温泉の宿から車でおよそ16分、2日目は一の宮門前町から始めます。" },
    { from: "見学を終えたら、車で道の駅阿蘇へ向かいましょう。", to: "見学を終えたら、車でおよそ12分、道の駅阿蘇へ向かいましょう。" },
  ],
  [MICHI]: [
    { from: "一の宮門前町を散策したら、車で道の駅阿蘇へ向かいましょう。", to: "一の宮門前町から車でおよそ12分、道の駅阿蘇に着きます。" },
    { from: "ここで昼食をとるのもおすすめです。", to: "まわりには食事処もあるので、ここで昼食をとりましょう。" },
    { from: "見学を終えたら、車で国造神社へ向かいましょう。", to: "見学を終えたら、車でおよそ21分、国造神社へ向かいましょう。" },
  ],
  [KOKU]: [
    { from: "道の駅阿蘇を出たら、車で国造神社へ向かいましょう。", to: "道の駅阿蘇から車でおよそ21分、国造神社に着きます。" },
    { from: "阿蘇の開拓の歴史を伝える神社を、静かに、敬意をもって参拝しましょう。", to: `古墳のまわりでは、静かに過ごしましょう。${PRAY_TO}` },
    { from: "見学を終えたら、車で霜神社へ向かいましょう。", to: "見学を終えたら、車でおよそ16分、霜神社へ向かいましょう。" },
  ],
  [SHIMO]: [
    { from: "国造神社を参拝したら、車で霜神社へ向かいましょう。", to: "国造神社から車でおよそ16分、霜神社に着きます。" },
    { from: "静かに、敬意をもってお参りしましょう。見学を終えたら、車で中通古墳群へ向かいましょう。", to: `${PRAY_TO}見学を終えたら、車でおよそ20分、仙酔峡へ向かいましょう。` },
  ],
  [CHOJA]: [
    { from: "中通古墳群を見学したら、車でアゼリア21長者乃湯へ向かいましょう。", to: "仙酔峡から車でおよそ14分、アゼリア21長者乃湯に着きます。" },
    {
      from: "阿蘇神社と一の宮門前町、火の国の信仰と参道グルメの旅は、これで終わりです。",
      to: "阿蘇神社と一の宮門前町、火の国の信仰と参道グルメの旅は、これで終わりです。見学を終えたら、車でおよそ12分の阿蘇駅の近くでレンタカーを返しましょう（返す手続きに15分ほど）。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: JINJA, h: 10, m: 58, stay: 35, legs: [] },
  { id: GOKU, h: 11, m: 39, stay: 20, legs: [walk(6)] },
  { id: DAIKAN, h: 12, m: 26, stay: 60, legs: [walk(6), car(21)] },
  { id: KAZAN, h: 13, m: 57, stay: 45, legs: [car(31)] },
  { id: KOME, h: 14, m: 58, stay: 15, legs: [car(16)] },
  { id: KUSA, h: 15, m: 28, stay: 40, legs: [car(15)] },
  { id: UCHI, h: 16, m: 36, stay: 20, legs: [car(28)] },
];
const DAY2: Plan = [
  { id: MONZEN, h: 9, m: 30, stay: 100, legs: [] },
  { id: MICHI, h: 11, m: 22, stay: 70, legs: [car(12)] },
  { id: KOKU, h: 12, m: 53, stay: 35, legs: [car(21)] },
  { id: SHIMO, h: 13, m: 44, stay: 40, legs: [car(16)] },
  { id: SENSUI, h: 14, m: 44, stay: 30, legs: [car(20)] },
  { id: CHOJA, h: 15, m: 28, stay: 62, legs: [car(14)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } }, photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [MONZEN, MICHI, KOKU, SHIMO, NAKA, CHOJA].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const naka = all.find((x) => x.id === NAKA)!;
  if (naka.photos.length) throw new Error("中通古墳群に写真があります");
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
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [], photos: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "中通", "ロープウェイ", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
  console.log(`外すスポット: ${naka.name}（写真 ${naka.photos.length}枚）`);
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
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx, remove: [NAKA] });
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
