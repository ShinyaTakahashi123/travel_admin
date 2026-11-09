/**
 * 初日・最終日の見直し #177 3bb9508b「坂の上の雲ミュージアムと子規記念博物館、松山文学散歩1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・電車と歩き。初日を11時ごろからにする。2日目はもとから 16:33 に終わる（移動の誤りだけ直し、終わりは今より遅くしない）
 * いまの初日（7か所）: 秋山兄弟生誕地 9:00 → 坂の上の雲ミュージアム → 萬翠荘 → 二之丸史跡庭園（このあたりで昼食）→ 松山城 13:06〜14:58 → 愚陀佛庵 → 子規堂 16:03〜16:33
 * 直した初日（7か所＋昼食。foot で測り直し）: 伊予鉄 松山市駅に11時ごろ → 歩20（1,595m）→ 秋山兄弟生誕地 11:20〜11:40 → 歩6（467m）→ ミュージアム 11:46〜12:41 →
 *   歩3（196m）→ 萬翠荘 12:44〜13:09 → 歩9（699m）→【足す】大街道で昼食 13:18〜14:03（点＝way 237265571「大街道」の Nominatim）→ 歩15（1,135m）→ 二之丸史跡庭園 14:18〜14:38 →
 *   歩13（1,032m、もと5）→ 松山城 14:51〜15:51 → 歩20（1,550m、もと15）→ 愚陀佛庵 16:11〜16:26 → 歩11（814m、もと10）→ 子規堂 16:37〜16:57
 *   滞在はどれも、もとより短い（秋山 35→20、ミュージアム 75→55、萬翠荘 50→25、二之丸 65→20、松山城 112→60、愚陀佛庵 40→15、子規堂 30→20）
 *   各スポットの頭に前からの分数。子規堂の「今夜は道後の宿でゆっくりお休みください。」を宿の一文の形に
 * 2日目: 宝厳寺→放生園 5→7（foot 496m）。終わりを今より遅くしないため、放生園→湯築城跡 5→9（湯築城跡の点を直したため、foot 663m）、放生園の滞在 65→59（湯築城跡 13:03 からはもとのまま、石手寺 15:33〜16:33）。
 *   ほかの歩きは foot で確かめ、どれももとの分以内（本館→伊佐爾波 360m・5分／10、伊佐爾波→宝厳寺 207m・3分／3、放生園→湯築 332m・5分／5、湯築→子規博 281m・4分／5、子規博→石手寺 993m・13分／20）。
 *   1か所目に道後温泉駅からの歩き（254m・約4分）、各スポットの頭に分数、帰りの一文に道後温泉駅まで歩いて約17分（1,315m）
 * 座標: 坂の上の雲ミュージアム = way 216404934、放生園 = node 2616104223「坊っちゃんカラクリ時計」（メモのカラクリ時計）、子規記念博物館 = node 1423739411（もとは出どころ不明・5〜12m）。
 *   湯築城跡 = node 2460130038「湯築城」（historic=castle。もとは案内板 node 3699302607 の点、法務 10/30）。湯築城→子規記念博物館 327m・5分（もとのまま）
 *   愚陀佛庵 = 地理院の番地「二番町四丁目6番」の点（OSM にない。メモは再建された愚陀佛庵を訪ねる内容なので、#8 と同じ点にそろえる。企画運営 10/30）。ほかは OSM の値でそのまま
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-177-3bb9508b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "3bb9508b-f70c-4cc0-ada9-d4648ecb6571";
const DAY1_ID = "f0917a68-b8f9-4e2c-92b0-ad765e0ff749";
const DAY2_ID = "c792f228-2d28-4db6-97fa-b2240e79bccb";
const AKIYAMA = "f9350f87-29e6-4bb2-abe3-9c05d846c386";
const SAKANOUE = "24c91431-6b42-40f6-a060-d59e7bb78447";
const BANSUISO = "c02d89c9-92ac-4d7c-96cd-839dd8d7525c";
const NINOMARU = "9c38e8d2-4def-4d29-829e-124cd077151f";
const CASTLE = "fe85c63b-c758-4dfb-bf7e-135b5bb7b5e1";
const GUDABUTSU = "ba790c13-1ffb-4901-a27f-447a0ccf99ac";
const SHIKIDO = "b356cc5b-9ae8-4c5e-a408-2b45505a8469";
const HONKAN = "6aff311f-8a65-4ad5-80bb-26d88108d5db";
const ISANIWA = "02bb909f-df4c-4749-969e-e74babb9b283";
const HOGONJI = "47303467-a131-4c58-90e3-2e75ec05a6ed";
const HOJOEN = "ef83bc44-b254-4874-b4c7-7db5a4dd4dbe";
const YUZUKI = "754365a3-8e17-4fc5-a93a-c71acd7eaa06";
const SHIKIHAKU = "0184358b-4e20-4652-8eb4-7248932993cc";
const ISHITEJI = "c780d153-214f-4095-abf2-1f86b157faa2";
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

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [AKIYAMA]: [{ from: "秋山兄弟生誕地は、", to: "この旅は電車と歩きでめぐります。伊予鉄の松山市駅に11時ごろ着いたら、歩いて約20分。秋山兄弟生誕地は、" }],
  [SAKANOUE]: [{ from: "坂の上の雲ミュージアムは、松山出身", to: "秋山兄弟生誕地から歩いて約6分。坂の上の雲ミュージアムは、松山出身" }],
  [BANSUISO]: [
    { from: "萬翠荘は、大正11年", to: "ミュージアムから歩いて約3分。萬翠荘は、大正11年" },
    { from: "美術館として公開されています。", to: "美術館として公開されています。このあと、歩いて約9分の大街道で昼食にしましょう。" },
  ],
  [NINOMARU]: [
    { from: "二之丸史跡庭園は、松山城の", to: "昼食のあと、大街道から歩いて約15分。二之丸史跡庭園は、松山城の" },
    { from: "大街道・銀天街の周辺には飲食店が多いので、この付近で昼食をとりましょう。", to: "" },
  ],
  [CASTLE]: [{ from: "松山城は、賤ヶ岳", to: "二之丸史跡庭園から歩いて約13分、本丸の天守へ。松山城は、賤ヶ岳" }],
  [GUDABUTSU]: [{ from: "愚陀佛庵は、夏目漱石", to: "松山城から歩いて約20分。愚陀佛庵は、夏目漱石" }],
  [SHIKIDO]: [
    { from: "子規堂は、正岡子規が", to: "愚陀佛庵から歩いて約11分。子規堂は、正岡子規が" },
    { from: " 今夜は道後の宿でゆっくりお休みください。", to: "この夜は、道後の宿に泊まりましょう。" },
  ],
  [HONKAN]: [{ from: "道後温泉本館は、明治27年", to: "2日目は、道後温泉本館から。伊予鉄の道後温泉駅からは歩いて約4分です。道後温泉本館は、明治27年" }],
  [ISANIWA]: [{ from: "伊佐爾波神社は、道後温泉を見下ろす", to: "道後温泉本館から歩いて約10分。伊佐爾波神社は、道後温泉を見下ろす" }],
  [HOGONJI]: [{ from: "宝厳寺は、時宗", to: "伊佐爾波神社から歩いて約3分。宝厳寺は、時宗" }],
  [HOJOEN]: [{ from: "宝厳寺からは歩いて5分ほどです。", to: "宝厳寺からは歩いて約7分です。" }],
  [YUZUKI]: [{ from: "湯築城跡は、道後公園内", to: "放生園から歩いて約9分。湯築城跡は、道後公園内" }],
  [SHIKIHAKU]: [{ from: "松山市立子規記念博物館は、近代", to: "湯築城跡から歩いて約5分。松山市立子規記念博物館は、近代" }],
  [ISHITEJI]: [
    { from: "石手寺は、四国八十八", to: "子規記念博物館から歩いて約20分。石手寺は、四国八十八" },
    {
      from: " 参拝を終えたら、バスや徒歩で松山市街・松山空港方面へ戻りましょう。",
      to: "帰りは、歩いて約17分の伊予鉄の道後温泉駅から、市内電車で松山市駅・JR松山駅の方面へ戻りましょう。",
    },
  ],
};

const LUNCH = {
  name: "大街道で昼食",
  lat: 33.838691,
  lng: 132.770102,
  address: "愛媛県松山市大街道",
  memo: "萬翠荘から歩いて約9分。大街道の商店街のあたりで、昼食にしましょう。",
  h: 13,
  m: 18,
  stay: 45,
  legs: [walk(9)] as Leg[],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: AKIYAMA, h: 11, m: 20, stay: 20, legs: [] },
  { id: SAKANOUE, h: 11, m: 46, stay: 55, legs: [walk(6)] },
  { id: BANSUISO, h: 12, m: 44, stay: 25, legs: [walk(3)] },
  { id: NINOMARU, h: 14, m: 18, stay: 20, legs: [walk(15)] },
  { id: CASTLE, h: 14, m: 51, stay: 60, legs: [walk(13)] },
  { id: GUDABUTSU, h: 16, m: 11, stay: 15, legs: [walk(20)] },
  { id: SHIKIDO, h: 16, m: 37, stay: 20, legs: [walk(11)] },
];
const DAY2_IDS = [HONKAN, ISANIWA, HOGONJI, HOJOEN, YUZUKI, SHIKIHAKU, ISHITEJI];
const HOJOEN_PLAN = { h: 11, m: 55, stay: 59, legs: [walk(7)] as Leg[] };
const YUZUKI_PLAN = { h: 13, m: 3, stay: 55, legs: [walk(9)] as Leg[] };

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: SAKANOUE, from: [33.841771, 132.769208], to: [33.841849, 132.769184] },
  { id: HOJOEN, from: [33.85071, 132.785463], to: [33.85071, 132.785462] },
  { id: GUDABUTSU, from: [33.839259, 132.76639], to: [33.839455, 132.766403] },
  { id: YUZUKI, from: [33.848289, 132.78526], to: [33.848088, 132.786775] },
  { id: SHIKIHAKU, from: [33.849667, 132.787167], to: [33.849701, 132.787045] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_IDS.join()) throw new Error("2日目の構成が想定と違います");
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
  const minOf = (d: Date | null | undefined) => (d ? d.getUTCHours() * 60 + d.getUTCMinutes() : 0);
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  const rows = PLAN.map((p) => ({ ...p, name: d1.spots.find((x) => x.id === p.id)!.name, orig: (() => { const s = d1.spots.find((x) => x.id === p.id)!; return `${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分`; })(), edits: (MEMO_EDITS[p.id] ?? []).map((e) => e.to || "（消す）" + e.from) }));
  rows.splice(3, 0, { id: "", ...LUNCH, orig: "足す", edits: [LUNCH.memo] });
  for (const p of rows) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${p.name}（もと ${p.orig}）`);
    for (const e of p.edits) console.log(`  → ${e}`);
    prevEnd = st + p.stay;
  }
  console.log("\n2日目");
  prevEnd = -1;
  for (const s of d2.spots) {
    const h = s.id === HOJOEN ? HOJOEN_PLAN : s.id === YUZUKI ? YUZUKI_PLAN : null;
    const st = h ? h.h * 60 + h.m : minOf(s.visitTime);
    const stay = h ? h.stay : s.stayDurationMin ?? 0;
    console.log(`${hm(st)}-${hm(st + stay)}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分)`} ${s.name}${h ? `（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分、歩き5→7）` : ""}`);
    for (const e of MEMO_EDITS[s.id] ?? []) console.log(`  → ${e.to}`);
    prevEnd = st + stay;
  }
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const item = (p: (typeof PLAN)[number]) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
  const create = (x: typeof LUNCH) => ({
    create: { name: x.name, visitTime: t(x.h, x.m), stayDurationMin: x.stay, transitLegs: { create: legsCreate(x.legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, [...PLAN.slice(0, 3).map(item), create(LUNCH), ...PLAN.slice(3).map(item)] as never, { tx });
      for (const id of DAY2_IDS) {
        if (id === HOJOEN) await tx.spot.update({ where: { id }, data: { ...timeLegs(HOJOEN_PLAN.h, HOJOEN_PLAN.m, HOJOEN_PLAN.stay, HOJOEN_PLAN.legs), memo: apply(id, MEMO_EDITS[id]) } });
        else if (id === YUZUKI) await tx.spot.update({ where: { id }, data: { ...timeLegs(YUZUKI_PLAN.h, YUZUKI_PLAN.m, YUZUKI_PLAN.stay, YUZUKI_PLAN.legs), memo: apply(id, MEMO_EDITS[id]) } });
        else if (MEMO_EDITS[id]) await tx.spot.update({ where: { id }, data: { memo: apply(id, MEMO_EDITS[id]) } });
      }
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
