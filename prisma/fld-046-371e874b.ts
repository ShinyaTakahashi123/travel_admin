/**
 * 初日・最終日の見直し #46 371e874b「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a）。組み方は企画運営 10/30 の判断どおり
 * 1泊2日・車。初日を11時ごろからにする。2日目はもとから 16:33 に終わる（終わりは今より遅くしない）
 * 直した初日（9か所＋昼食。初日の「銀山温泉街」は2日目の1か所目と同じ場所なので外す）:
 *   JR大石田駅に11時ごろ → レンタカー（手続きに15分ほど）→ 車10（OSRM 4.4分＋駐車）→ 芭蕉・清風歴史資料館 11:25〜11:50 → 歩8 → 養泉寺 11:58〜12:13 → 歩10（736m）→
 *   【足す】尾花沢の町なかで昼食 12:23〜13:08（点＝通りの way 110271734「東根尾花沢線」）→ 歩4（資料館の車まで）＋車11（OSRM 5.4分＋駐車）→ 徳良湖 13:23〜13:43 →
 *   車12（OSRM 10.9分、もとのまま）→ 十分一番所跡 13:55〜14:05 → 車8（もとのまま）→ 白銀公園 14:13〜14:53 → 歩1（70m、もと8）→ 延沢銀山遺跡 14:54〜15:09 →
 *   歩2（99m、もと10）→ 大正ロマンの旅館の町並み 15:11〜15:31 → 歩4（259m）→ しろがね湯 15:35〜16:25 → 歩2（101m、もと3）→ 和楽足湯 16:27〜16:42（宿の一文）
 *   町並みのスポット名から宿の名前を外し（itinerary-rules 329）、メモも宿の名前を出さない書き方に。バラ公園の開園時間は「公式の案内で」に（法務 10/30）
 *   滞在はどれも、もとより短い（芭蕉 40→25、養泉寺 30→15、徳良湖 45→20、十分一 15→10、白銀 65→40、延沢 25→15、町並み 35→20、しろがね湯 70→50、足湯 20→15）
 *   白銀公園の「ここで昼食」は、11時始まりだと13:30を過ぎるので消して、尾花沢で昼食のスポットを立てる
 * 2日目（昼食のスポットを足す。東沢バラ公園は公式で 10〜15時・11〜3月は冬季休業なので、15時までに回れるよう最上徳内記念館の前へ）:
 *   銀山温泉街 9:00〜9:40 → 車25（もとのまま）→ 西光寺 10:05〜10:25 → 歩3 → 資料館 10:28〜11:08 → 歩6（469m、もと5）→ 高野一栄宅跡 11:14〜11:29 → 歩2 → 舟役所跡 11:31〜11:46 →
 *   歩4 → 乗舩寺 11:50〜12:05 → 歩9（642m）→【足す】大石田の町なかで昼食 12:14〜12:59（点＝通りの way 111180022「尾花沢大石田線」）→ 歩14（西光寺のそばの車まで 1,088m）＋車16（OSRM 10.7分＋駐車）→
 *   林崎居合神社 13:29〜13:44 → 車12（OSRM 6.6分＋駐車）→ 東沢バラ公園 13:56〜14:41 → 車10（OSRM 4.7分＋駐車）→ 最上徳内記念館 14:51〜15:31 → 車12（OSRM 6.2分＋駐車）→ 東根城跡 15:43〜16:33
 *   滞在はどれも、もと以下（銀山 40、西光寺 25→20、資料館 60→40、高野 20→15、舟役所 25→15、乗舩寺 25→15、居合 25→15、バラ 45、徳内 40、東根 60→50）。
 *   冬（11〜3月）はバラ公園に寄らず、居合神社→徳内記念館（車8）で、東根城跡には約1時間早く着く。資料館の「そば屋…昼食に立ち寄ってみましょう」は昼食のスポットへ移す。
 *   帰りの一文に山形空港まで車でおよそ15分（OSRM 9.8分＋駐車）
 * 座標（4けたの丸めは全部直す）: 徳良湖＝way 1060953680「徳良湖 こども広場」（もとは湖の way の中心＝水の上）、十分一番所跡＝node 5055334526、延沢銀山遺跡＝node 13290027986「疎水坑口」
 *   （メモの坑口、企画運営）、町並み＝通りに面した店の node 5055307525（メモに店名は出さない。宿の way は使わない、法務 10/30）、和楽足湯＝node 11576588614、銀山温泉街＝node 3489717993「銀山温泉 案内所」、東沢バラ公園＝node 4175153490
 *   「Rose Garden Higashizawa」（もとは約600m の公園の way の中心）。ほかは OSM の値でそのまま
 * タイトル・説明文・季節は変えない（季節の冬は外さない、企画運営。説明文に外した「銀山温泉街」の言い残しはない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-046-371e874b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";
const DAY1_ID = "f089c1db-d483-4928-b8cc-a757c19ea52e";
const DAY2_ID = "b245ca88-af15-4cfd-9271-bacbf3d35879";
const BASHO = "4e0bbee4-f770-40d1-acce-9e2c8d56cf4b";
const YOSENJI = "1034491a-09a1-44a6-8891-1a4b236f53c8";
const TOKURAKO = "a42f17d2-2f35-47ce-8abd-680a7ac865e6";
const JUBUNICHI = "a7b08d14-55b9-47fb-9daa-97e9f2b3826c";
const SHIROGANE = "8cf3c392-aa39-4c8e-8567-e9e641eced85";
const NOBESAWA = "a985e9db-c7c3-4e06-98a3-e30690483fb3";
const MACHINAMI = "1deb073e-49f2-4aa8-a41c-2411948df60c";
const SHIROGANEYU = "de3d53b6-f897-4137-9349-34a1bbee2331";
const ASHIYU = "25a2365f-a533-475c-9c10-8c31327f7a51";
const ONSENGAI1 = "217b25aa-6004-4730-a271-2531e38315f7";
const ONSENGAI2 = "5742c320-c44a-4230-b341-47171cf90dd8";
const SAIKOJI = "32c95cba-ed5e-4b98-b665-d67a6fcf96ed";
const SHIRYOKAN = "ff4f54e1-c390-40ff-8509-82a7d5933da6";
const TAKANO = "2a9bd26b-7700-472e-ba80-6d62e62dffb3";
const FUNEYAKUSHO = "b60a8894-f854-4659-a52a-371626542079";
const JOSENJI = "5fa9fbc7-13af-460b-8c60-81f4fa35485d";
const IAI = "f97846f5-bf7d-48d6-9bb3-f878da89af01";
const TOKUNAI = "54ab6857-da76-42d6-9224-f126f202cde4";
const ROSE = "ca9157fc-82ab-46f4-99c4-a1d51b71c000";
const HIGASHINE = "267b2f64-90e4-4e8e-b19e-9e355c0fca4b";
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

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [BASHO]: [
    {
      from: "芭蕉・清風歴史資料館は、江戸時代の豪商・",
      to: "この旅は車でめぐります。JR大石田駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ10分。芭蕉・清風歴史資料館は、江戸時代の豪商・",
    },
  ],
  [YOSENJI]: [{ from: "養泉寺は、天台宗の寺院です。", to: "芭蕉・清風歴史資料館から歩いて約8分。養泉寺は、天台宗の寺院です。" }],
  [TOKURAKO]: [
    { from: "徳良湖は、1919年に", to: "昼食のあと、資料館のそばの車まで歩いて約4分、車でおよそ11分。徳良湖は、1919年に" },
    { from: "湖を一周する遊歩道が整備されているので、のんびりと歩いてみましょう。", to: "湖を一周する遊歩道が整備されているので、湖畔のこども広場のあたりから、のんびりと歩いてみましょう。" },
  ],
  [SHIROGANE]: [{ from: " 公園の入り口周辺には飲食店もあるので、ここで昼食をとりましょう。", to: "" }],
  [NOBESAWA]: [{ from: "延沢銀山遺跡は、国の史跡に", to: "白銀の滝から歩いて約1分。延沢銀山遺跡は、国の史跡に" }],
  [MACHINAMI]: [
    { from: "大正ロマンの旅館の町並みは、銀山川の両岸", to: "延沢銀山遺跡の坑口から歩いて約2分。大正ロマンの旅館の町並みは、銀山川の両岸" },
    {
      from: "本館が国の登録有形文化財に登録されている能登屋旅館や、2006年に建築家・隈研吾の設計で改装された藤屋など、",
      to: "本館が国の登録有形文化財に登録されている木造の旅館や、2006年に建築家・隈研吾の設計で改装された旅館など、",
    },
  ],
  [SHIROGANEYU]: [{ from: "しろがね湯は、銀山温泉に今も残る", to: "町並みから歩いて約4分。しろがね湯は、銀山温泉に今も残る" }],
  [ASHIYU]: [
    { from: "しろがね湯からは徒歩3分ほどです。", to: "しろがね湯からは徒歩2分ほどです。" },
    { from: "歩き疲れた足を休めましょう。", to: "歩き疲れた足を休めましょう。この夜は、銀山温泉の宿に泊まりましょう。" },
  ],
  [ONSENGAI2]: [{ from: "旅の2日目、朝の銀山温泉街を歩いてみましょう。", to: "旅の2日目、宿を出て、朝の銀山温泉街を歩いてみましょう。" }],
  [SAIKOJI]: [{ from: "西光寺は、時宗の寺院で、", to: "銀山温泉から車でおよそ25分、大石田へ。西光寺は、時宗の寺院で、" }],
  [SHIRYOKAN]: [
    { from: "大石田町立歴史民俗資料館は、最上川舟運で", to: "西光寺から歩いて約3分。大石田町立歴史民俗資料館は、最上川舟運で" },
    { from: "昔ながらのそば屋が並んでいるので、昼食に立ち寄ってみましょう。", to: "昔ながらのそば屋が並んでいます。" },
  ],
  [TAKANO]: [{ from: "高野一栄は、大石田で", to: "資料館から歩いて約6分。高野一栄は、大石田で" }],
  [FUNEYAKUSHO]: [{ from: "最上川舟役所跡は、江戸時代に", to: "高野一栄宅跡から歩いて約2分。最上川舟役所跡は、江戸時代に" }],
  [JOSENJI]: [{ from: "乗舩寺は、慶長元年", to: "舟役所跡から歩いて約4分。乗舩寺は、慶長元年" }],
  [IAI]: [{ from: "林崎居合神社は、居合", to: "昼食のあと、西光寺のそばの車まで歩いて約14分、車でおよそ16分。林崎居合神社は、居合" }],
  [ROSE]: [
    { from: "東沢バラ公園は、1956年に", to: "林崎居合神社から車でおよそ12分。東沢バラ公園は、1956年に" },
    {
      from: "11月から3月は冬季休業のため、この時期は立ち寄れません。",
      to: "開いている時間は公式の案内で確かめましょう。11月から3月は冬季休業のため、この時期はここに寄らず、次の最上徳内記念館へ向かいましょう。",
    },
  ],
  [TOKUNAI]: [{ from: "最上徳内記念館は、江戸時代の", to: "東沢バラ公園から車でおよそ10分（冬は林崎居合神社から車でおよそ8分）。最上徳内記念館は、江戸時代の" }],
  [HIGASHINE]: [
    { from: "東沢バラ公園からは車で12分ほどです。", to: "最上徳内記念館からは車で12分ほどです。" },
    { from: " 見学を終えたら、車で山形市街・山形空港方面へ戻りましょう。", to: "帰りは、車でおよそ15分の山形空港や、山形市街の方面へ戻り、レンタカーを返しましょう。" },
  ],
};

const LUNCH1 = {
  name: "尾花沢の町なかで昼食",
  lat: 38.603853,
  lng: 140.403882,
  address: "山形県尾花沢市",
  memo: "養泉寺から歩いて約10分。尾花沢の町なかで、昼食にしましょう。",
  h: 12,
  m: 23,
  stay: 45,
  legs: [walk(10)] as Leg[],
};
const LUNCH2 = {
  name: "大石田の町なかで昼食",
  lat: 38.584352,
  lng: 140.375077,
  address: "山形県北村山郡大石田町",
  memo: "乗舩寺から歩いて約9分。そば処として知られる大石田の町なかで、昼食にしましょう。",
  h: 12,
  m: 14,
  stay: 45,
  legs: [walk(9)] as Leg[],
};

type P = { id: string; h: number; m: number; stay: number; legs: Leg[] };
const MACHINAMI_NAME = "大正ロマンの旅館の町並み";
const PLAN: P[] = [
  { id: BASHO, h: 11, m: 25, stay: 25, legs: [] },
  { id: YOSENJI, h: 11, m: 58, stay: 15, legs: [walk(8)] },
  { id: TOKURAKO, h: 13, m: 23, stay: 20, legs: [walk(4), car(11)] },
  { id: JUBUNICHI, h: 13, m: 55, stay: 10, legs: [car(12)] },
  { id: SHIROGANE, h: 14, m: 13, stay: 40, legs: [car(8)] },
  { id: NOBESAWA, h: 14, m: 54, stay: 15, legs: [walk(1)] },
  { id: MACHINAMI, h: 15, m: 11, stay: 20, legs: [walk(2)] },
  { id: SHIROGANEYU, h: 15, m: 35, stay: 50, legs: [walk(4)] },
  { id: ASHIYU, h: 16, m: 27, stay: 15, legs: [walk(2)] },
];
const DAY2: P[] = [
  { id: ONSENGAI2, h: 9, m: 0, stay: 40, legs: [] },
  { id: SAIKOJI, h: 10, m: 5, stay: 20, legs: [car(25)] },
  { id: SHIRYOKAN, h: 10, m: 28, stay: 40, legs: [walk(3)] },
  { id: TAKANO, h: 11, m: 14, stay: 15, legs: [walk(6)] },
  { id: FUNEYAKUSHO, h: 11, m: 31, stay: 15, legs: [walk(2)] },
  { id: JOSENJI, h: 11, m: 50, stay: 15, legs: [walk(4)] },
  { id: IAI, h: 13, m: 29, stay: 15, legs: [walk(14), car(16)] },
  { id: ROSE, h: 13, m: 56, stay: 45, legs: [car(12)] },
  { id: TOKUNAI, h: 14, m: 51, stay: 40, legs: [car(10)] },
  { id: HIGASHINE, h: 15, m: 43, stay: 50, legs: [car(12)] },
];
const DAY1_NOW = [BASHO, YOSENJI, TOKURAKO, JUBUNICHI, SHIROGANE, NOBESAWA, MACHINAMI, SHIROGANEYU, ASHIYU, ONSENGAI1];
const DAY2_NOW = [ONSENGAI2, SAIKOJI, SHIRYOKAN, TAKANO, FUNEYAKUSHO, JOSENJI, IAI, TOKUNAI, ROSE, HIGASHINE];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: TOKURAKO, from: [38.596539, 140.440583], to: [38.599981, 140.436895] },
  { id: JUBUNICHI, from: [38.57558, 140.51602], to: [38.57558, 140.516019] },
  { id: NOBESAWA, from: [38.5674, 140.5328], to: [38.568602, 140.532162] },
  { id: MACHINAMI, from: [38.5694, 140.5313], to: [38.569232, 140.531884] },
  { id: ASHIYU, from: [38.57007, 140.53049], to: [38.570065, 140.53049] },
  { id: ONSENGAI2, from: [38.5697, 140.5311], to: [38.570419, 140.530069] },
  { id: ROSE, from: [38.483265, 140.40415], to: [38.483082, 140.404382] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1_NOW.join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_NOW.join()) throw new Error("2日目の構成が想定と違います");
  if ((it.description ?? "").includes("銀山温泉街")) console.log("※説明文に「銀山温泉街」があります（確かめる）");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  for (const [id, edits] of Object.entries(MEMO_EDITS)) apply(id, edits);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  type Row = { h: number; m: number; stay: number; legs: Leg[]; name: string; orig: string; edits: string[] };
  const show = (label: string, rows: Row[]) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of rows) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${p.name}（もと ${p.orig}）`);
      for (const e of p.edits) console.log(`  → ${e}`);
      prevEnd = st + p.stay;
    }
  };
  const rowsOf = (plan: P[], spots: typeof d1.spots): Row[] =>
    plan.map((p) => {
      const s = spots.find((x) => x.id === p.id)!;
      return { ...p, name: s.name, orig: `${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分`, edits: (MEMO_EDITS[p.id] ?? []).map((e) => e.to || "（消す）" + e.from) };
    });
  const rows1 = rowsOf(PLAN, d1.spots);
  rows1.splice(2, 0, { ...LUNCH1, orig: "足す", edits: [LUNCH1.memo] });
  const rows2 = rowsOf(DAY2, d2.spots);
  rows2.splice(6, 0, { ...LUNCH2, orig: "足す", edits: [LUNCH2.memo] });
  show("1日目（直したあと）", rows1);
  show("2日目（直したあと）", rows2);
  console.log("\n外す: 銀山温泉街（1日目。2日目の1か所目と同じ場所）");
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const item = (p: P) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}), ...(p.id === MACHINAMI ? { name: MACHINAMI_NAME } : {}) } });
  const create = (x: typeof LUNCH1) => ({
    create: { name: x.name, visitTime: t(x.h, x.m), stayDurationMin: x.stay, transitLegs: { create: legsCreate(x.legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, [...PLAN.slice(0, 2).map(item), create(LUNCH1), ...PLAN.slice(2).map(item)] as never, { tx, remove: [ONSENGAI1] });
      await setDaySpotOrder(DAY2_ID, [...DAY2.slice(0, 6).map(item), create(LUNCH2), ...DAY2.slice(6).map(item)] as never, { tx });
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
