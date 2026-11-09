/**
 * 初日・最終日の見直し #175 8ddcabc5「高千穂神社の夜神楽と国見ヶ丘の雲海、伝統と絶景の1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・車。初日を11時ごろからにする。2日目は 6:00 の雲海の例外のまま、移動の誤りを直す（終わりは今の 16:31 より遅くしない）
 * いまの初日（11か所）: 天岩戸神社(西本宮) 8:30 → 天安河原 → 東本宮 → 八大龍王水神 → 車でくしふる神社 → 四皇子峰 → 天真名井 → 荒立神社 → 高千穂神社（昼食 13:27）→ 資料館 → 天岩戸温泉 16:12〜16:47
 * 直した初日（9か所。企画運営 10/30: 町なかを先に回す順に入れ替え、点の出どころがない天真名井・天岩戸温泉を外す）:
 *   高千穂バスセンターに11時ごろ → レンタカー（手続きに15分ほど）→ 車7（OSRM 1.5分＋駐車）→ くしふる神社 11:22〜11:47 → 歩2（foot 148m）→ 四皇子峰 11:49〜12:04 →
 *   歩13（1,004m）→ 荒立神社 12:17〜12:37 → 歩11（くしふる神社の車まで 856m）＋車8（OSRM 2.8分＋駐車）→ 高千穂神社（昼食）12:56〜13:56 → 車8（OSRM 2.2分＋駐車）→
 *   資料館 14:04〜14:34 → 車13（OSRM 7.1分＋駐車）→ 西本宮 14:47〜15:12 → 歩12（もとのまま）→ 天安河原 15:24〜15:44 → 歩16（1,207m、もと10）→ 東本宮 16:00〜16:15 →
 *   歩14（1,057m、もと9）→ 八大龍王水神 16:29〜16:44（宿の一文。西本宮の車まで foot 1,557m・約20分）
 *   滞在はどれも、もとより短い。天真名井は、くしふる神社のメモで紹介（tabi-mag。樹齢の数字は公式で確かめられないので書かない、企画運営）
 * 2日目（石垣の村は点が地理院の大字の中心だけなので外す。企画運営 10/30）:
 *   国見ヶ丘 6:00〜7:10（宿から車17＝OSRM 11.5分＋駐車）→ いったん宿に戻って朝食・チェックアウト → 秋元神社 9:30〜10:25（宿から車28＝OSRM 22.8分＋駐車）→
 *   車23（OSRM 17.7分、もと40）→ あまてらす鉄道 10:48〜12:03 → 車6 → 水族館 12:09〜12:59 → 車19（OSRM 13.2分、もと35）→ 道の駅青雲橋（昼食）13:18〜14:18 →
 *   車19（OSRM 13.5分）→【足す】トンネルの駅 14:37〜15:07（決まり③。るるぶ: 神楽酒造の観光物産館、未完成に終わった九州横断鉄道のトンネルで焼酎を樽貯蔵、9〜17時）→
 *   車13（OSRM 7.1分）→ 高千穂の湯 15:20〜16:30（80→70、終わりを今より遅くしない）
 *   国見ヶ丘→秋元・秋元→鉄道・水族館→青雲橋はどれも OSRM×1.5＋5 を超えていた。石垣の村の滞在の分は、決まり①②が使えない（②は雲海の例外）ので③
 * 言葉: 「売店をのぞいてみるのもよいでしょう」「レンタカーの返却をすませてください」を直す
 * 座標: 高千穂神社 = way 757459506 の Nominatim、資料館 = node 1423885309、国見ヶ丘 = 地理院の地名「国見が丘」（OSM はキャンプ場の点だけ）、
 *   道の駅青雲橋 = 地理院の地名「道の駅「青雲橋」」（OSM に道の駅の点がない）、トンネルの駅 = node 5519514223「トンネルの駅」。ほかは OSM の値でそのまま
 * タイトル・説明文・季節は変えない（説明文に外した3か所は出てこない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-175-8ddcabc5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8ddcabc5-91a8-49bb-881a-d60a4d29dc93";
const DAY1_ID = "3b95e09a-479f-43fa-bd9b-a2b7eedd52e4";
const DAY2_ID = "81dd78ef-27d5-40fe-bd1c-b1a4b3ae6d6d";
const NISHI = "824e31a2-a85c-436c-9ecf-d0120869d528";
const YASUKAWARA = "94d83bc3-bd8f-4d33-8125-af2b643e6b58";
const HIGASHI = "24ae0f5d-0700-466e-9457-172f41f8911d";
const HACHIDAI = "eb273d00-0fa9-41ba-ae70-b6a3a03ac4c7";
const KUSHIFURU = "2300a618-706e-4238-a6c6-1b88ad299961";
const SHIOUJI = "9f89a687-2207-43d6-8350-cc840f95066c";
const MANAI = "98f253db-9f0b-49ac-8beb-ba94fbdabe12";
const ARATATE = "8cde9a92-770c-4ab5-bdd0-f600b019b69d";
const TJINJA = "9e6497dc-7a2c-467c-b9ad-432f310c001c";
const MUSEUM = "cf74e7fc-01a8-4ae1-b284-9dd7f35b605e";
const ONSEN = "7906b5c8-2c68-4b50-89f2-3219e074f2b8";
const KUNIMI = "a60f4bbc-0cd6-41c9-9144-42f84fc648a7";
const AKIMOTO = "54c2a9aa-ad46-4553-9aa2-a4bee1b3c5e4";
const TETSUDO = "2de1bc0a-f1c9-4f11-ad1d-c1c140d26666";
const SUIZOKU = "ce96d191-fcb9-4b9e-a493-691c9d7fd969";
const SEIUN = "2ce47b13-f551-4ae0-ba1a-87dfd2a704ab";
const ISHIGAKI = "c25f53e3-ac51-42dd-a7b9-c0a6e904193c";
const YU = "308f5c0b-5a92-4e33-b38b-569ef2e18779";
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
  [KUSHIFURU]: [
    {
      from: "八大龍王水神からは、車でおよそ15分です。",
      to: "この旅は車でめぐります。高千穂バスセンターに11時ごろ着いたら、近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ7分です。",
    },
    {
      from: "続いては、歩いておよそ3分の四皇子峰・高天原遥拝所へ向かいましょう。",
      to: "近くの神代川のほとりには、ケヤキの根元から水が湧く「天真名井」もあります。続いては、歩いておよそ2分の四皇子峰・高天原遥拝所へ向かいましょう。",
    },
  ],
  [SHIOUJI]: [
    { from: "槵觸神社からは歩いておよそ3分です。", to: "槵觸神社からは歩いておよそ2分です。" },
    { from: "続いては、歩いておよそ5分の天真名井へ向かいましょう。", to: "続いては、歩いておよそ13分の荒立神社へ向かいましょう。" },
  ],
  [ARATATE]: [
    { from: "天真名井からは歩いておよそ7分です。", to: "四皇子峰からは歩いておよそ13分です。" },
    { from: "続いては、車でおよそ6分の高千穂神社へ向かいましょう。", to: "続いては、くしふる神社の車まで歩いておよそ11分戻り、車でおよそ8分の高千穂神社へ向かいましょう。" },
  ],
  [TJINJA]: [
    { from: "荒立神社からは、車でおよそ6分です。", to: "くしふる神社の車から、車でおよそ8分です。" },
    { from: "続いては、車でおよそ5分の高千穂町歴史民俗資料館へ向かいましょう。", to: "続いては、車でおよそ8分の高千穂町歴史民俗資料館へ向かいましょう。" },
  ],
  [MUSEUM]: [
    { from: "高千穂神社からは、車でおよそ5分です。", to: "高千穂神社からは、車でおよそ8分です。" },
    { from: "これまでの1日で巡ってきた神話の舞台を、", to: "ここまでに巡ってきた神話の舞台を、" },
    { from: "続いては、車でおよそ15分の天岩戸温泉へ向かいましょう。", to: "続いては、車でおよそ13分の天岩戸神社(西本宮)へ向かいましょう。" },
  ],
  [NISHI]: [{ from: "高千穂バスセンター付近でレンタカーを借り、車でおよそ20分の天岩戸神社へ向かいます。", to: "資料館からは、車でおよそ13分の天岩戸神社です。" }],
  [YASUKAWARA]: [{ from: "続いては、歩いておよそ10分の天岩戸神社(東本宮)へ向かいましょう。", to: "続いては、歩いておよそ16分の天岩戸神社(東本宮)へ向かいましょう。" }],
  [HIGASHI]: [
    { from: "天安河原からは、来た道を戻って歩いておよそ10分です。", to: "天安河原からは、来た道を戻って歩いておよそ16分です。" },
    { from: "続いては、歩いておよそ9分の八大龍王水神へ向かいましょう。", to: "続いては、歩いておよそ14分の八大龍王水神へ向かいましょう。" },
  ],
  [HACHIDAI]: [
    { from: "東本宮からは歩いておよそ9分です。", to: "東本宮からは歩いておよそ14分です。" },
    {
      from: "続いては、車でおよそ15分の槵觸神社(くしふる神社)へ向かいましょう。ここからは車での移動になります。",
      to: "このあとは、西本宮の車まで歩いておよそ20分戻りましょう。この夜は、天岩戸のあたりの宿に泊まりましょう。",
    },
  ],
  [KUNIMI]: [
    { from: "2日目は、宿で朝食をすませてから、日の出前に出発します。", to: "2日目は、日の出前に宿を出て、車でおよそ17分の国見ヶ丘へ向かいます。" },
    { from: "続いては、車でおよそ40分の秋元神社へ向かいましょう。", to: "雲海を眺めたら、いったん宿に戻って朝食をとり、チェックアウトをすませましょう。" },
  ],
  [AKIMOTO]: [
    { from: "国見ヶ丘からは、車でおよそ40分です。", to: "朝食をすませたら、宿から車でおよそ28分です。" },
    { from: "続いては、車でおよそ40分の高千穂あまてらす鉄道へ向かいましょう。", to: "続いては、車でおよそ23分の高千穂あまてらす鉄道へ向かいましょう。" },
  ],
  [TETSUDO]: [
    { from: "秋元神社からは、車でおよそ40分です。", to: "秋元神社からは、車でおよそ23分です。" },
    { from: "出発までの時間は、駅舎内の売店をのぞいてみるのもよいでしょう。", to: "駅舎内には売店もあります。" },
  ],
  [SUIZOKU]: [{ from: "続いては、車でおよそ35分の道の駅青雲橋(青雲橋)へ向かいましょう。", to: "続いては、車でおよそ19分の道の駅青雲橋(青雲橋)へ向かいましょう。" }],
  [SEIUN]: [
    { from: "水族館からは、車でおよそ35分です。", to: "水族館からは、車でおよそ19分です。" },
    { from: "続いては、車でおよそ20分の石垣の村(戸川地区)へ向かいましょう。", to: "続いては、車でおよそ19分のトンネルの駅へ向かいましょう。" },
  ],
  [YU]: [
    { from: "石垣の村からは、車でおよそ40分です。", to: "トンネルの駅からは、車でおよそ13分です。" },
    { from: "レンタカーの返却をすませてください。", to: "レンタカーの返却をすませましょう。" },
  ],
};

const TUNNEL = {
  name: "トンネルの駅",
  lat: 32.731291,
  lng: 131.29868,
  address: "宮崎県西臼杵郡高千穂町大字下野2221-2",
  memo: "道の駅青雲橋からは、車でおよそ19分です。トンネルの駅は、未完成に終わった九州横断鉄道のトンネルを使って、焼酎を樽で貯蔵している観光物産館です。お酒は20歳から。車を運転する人は飲まないようにしましょう。休みの日は公式の案内で確かめましょう。続いては、車でおよそ13分の高千穂の湯へ向かいましょう。",
  h: 14,
  m: 37,
  stay: 30,
  legs: [car(19)] as Leg[],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KUSHIFURU, h: 11, m: 22, stay: 25, legs: [] },
  { id: SHIOUJI, h: 11, m: 49, stay: 15, legs: [walk(2)] },
  { id: ARATATE, h: 12, m: 17, stay: 20, legs: [walk(13)] },
  { id: TJINJA, h: 12, m: 56, stay: 60, legs: [walk(11), car(8)] },
  { id: MUSEUM, h: 14, m: 4, stay: 30, legs: [car(8)] },
  { id: NISHI, h: 14, m: 47, stay: 25, legs: [car(13)] },
  { id: YASUKAWARA, h: 15, m: 24, stay: 20, legs: [walk(12)] },
  { id: HIGASHI, h: 16, m: 0, stay: 15, legs: [walk(16)] },
  { id: HACHIDAI, h: 16, m: 29, stay: 15, legs: [walk(14)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KUNIMI, h: 6, m: 0, stay: 70, legs: [] },
  { id: AKIMOTO, h: 9, m: 30, stay: 55, legs: [car(28)] },
  { id: TETSUDO, h: 10, m: 48, stay: 75, legs: [car(23)] },
  { id: SUIZOKU, h: 12, m: 9, stay: 50, legs: [car(6)] },
  { id: SEIUN, h: 13, m: 18, stay: 60, legs: [car(19)] },
  { id: YU, h: 15, m: 20, stay: 70, legs: [car(13)] },
];
const DAY1_NOW = [NISHI, YASUKAWARA, HIGASHI, HACHIDAI, KUSHIFURU, SHIOUJI, MANAI, ARATATE, TJINJA, MUSEUM, ONSEN];
const DAY2_NOW = [KUNIMI, AKIMOTO, TETSUDO, SUIZOKU, SEIUN, ISHIGAKI, YU];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: TJINJA, from: [32.706444, 131.302306], to: [32.706671, 131.301892] },
  { id: MUSEUM, from: [32.715633, 131.303314], to: [32.715212, 131.303322] },
  { id: KUNIMI, from: [32.718562, 131.277823], to: [32.719555, 131.277956] },
  { id: SEIUN, from: [32.66058, 131.388469], to: [32.66064, 131.388496] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1_NOW.join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_NOW.join()) throw new Error("2日目の構成が想定と違います");
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
  const show = (label: string, rows: Row[], gapOk: number[] = []) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    rows.forEach((p, i) => {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const bad = prevEnd >= 0 && st - prevEnd !== min && !gapOk.includes(i);
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${bad ? " ⚠" : ""})`} ${p.name}（もと ${p.orig}）`);
      for (const e of p.edits) console.log(`  → ${e}`);
      prevEnd = st + p.stay;
    });
  };
  const rowsOf = (plan: typeof PLAN, spots: typeof d1.spots): Row[] =>
    plan.map((p) => {
      const s = spots.find((x) => x.id === p.id)!;
      return { ...p, name: s.name, orig: `${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分`, edits: (MEMO_EDITS[p.id] ?? []).map((e) => e.to) };
    });
  show("1日目（直したあと）", rowsOf(PLAN, d1.spots));
  const rows2 = rowsOf(DAY2, d2.spots);
  rows2.splice(5, 0, { ...TUNNEL, orig: "足す", edits: [TUNNEL.memo] });
  // 秋元神社の前は、国見ヶ丘から宿に戻って朝食・チェックアウトをする時間（メモに書いてある）
  show("2日目（直したあと）", rows2, [1]);
  console.log(`\n外す: 天真名井・天岩戸温泉（1日目）、石垣の村（2日目）`);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const item = (p: (typeof PLAN)[number]) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
  const create = (x: typeof TUNNEL) => ({
    create: { name: x.name, visitTime: t(x.h, x.m), stayDurationMin: x.stay, transitLegs: { create: legsCreate(x.legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, PLAN.map(item) as never, { tx, remove: [MANAI, ONSEN] });
      await setDaySpotOrder(DAY2_ID, [...DAY2.slice(0, 5).map(item), create(TUNNEL), item(DAY2[5])] as never, { tx, remove: [ISHIGAKI] });
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
