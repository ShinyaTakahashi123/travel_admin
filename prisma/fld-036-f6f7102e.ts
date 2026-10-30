/**
 * 初日・最終日の見直し #36 f6f7102e「福井城址と一乗谷朝倉氏遺跡、城下町と戦国の町をめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 20:2x、#36 は制作補助2。四季）
 * 歩きは routed-foot、車は routed-car（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目（歩き）: JR福井駅 10:40ごろ → 歩7（506m）→ 福井城址 10:47（40）→ 歩7（522m。もと5）→ 佐佳枝廼社 11:34（30→20）→ 歩8（566m）→ 福井駅前（昼食）12:02〜12:42（50→40。
 *   OSM の食事処の点が駅から250m内に36）→ 歩14（1,018m）→ 福井市立郷土歴史博物館 12:56（60）→ 歩3（179m）→ 養浩館庭園 13:59（60→50）→ 歩29（2,119m）→ 橘曙覧記念文学館 15:18（45→39）→
 *   歩4（243m。もと10で ×1.5＋5 の外）→ 足羽神社 16:01（30→25）→ 歩9（667m。もと10）→ 足羽山公園 16:35〜17:00（35→25）→ 歩29（2,159m）で福井駅のまわりの宿
 *   外したもの: 福井市中央公園（説明文になく、点も公園の面の中。企画運営 10/30）
 * 2日目（レンタカー。企画運営 10/30 案1。もとの「JR越美北線で約15分」は電車の名前があり、福井→一乗谷の始発が 9:40 着（Yahoo!路線 11/10）で 9:00 に着けないため）:
 *   福井駅のまわりの宿 → 福井駅でレンタカー（手続き15分）＋車16（9.6km）で博物館の駐車場＋歩3（156m）→ 一乗谷朝倉氏遺跡博物館 9:00（105）→ 歩7（473m）→
 *   【新】西山光照寺跡 10:52〜11:17（25。OSM node 3161039833 historic=yes）→ 歩14（1,165m）→ 一乗谷あさくら水の駅（昼食）11:31〜12:11（50→40。昼食は 11:30 から。企画運営 10/30）→
 *   歩11（904m）で博物館の駐車場の車＋車8（2.0km）で復原町並のそばの駐車場＋歩3（182m）→ 復原町並 12:33（80）→ 歩6（385m。もとは「すぐ」）→ 朝倉館跡・唐門 13:59（70）→
 *   歩3（214m）で車＋車19（15.1km）→【新】福井県立歴史博物館 15:31〜16:30（企画運営 10/30 b）→ 車9（2.9km）で福井駅、レンタカーを返す（15分）
 *   外したもの: 湯殿跡庭園・諏訪館跡庭園（OSM に名前のある物の点がなく、案内板と石碑だけ。企画運営 10/30 B: 朝倉館跡のメモに一文で入れる）
 * 点: 福井城址＝#e8a7f2d5 の福井城址と同じ点 36.065518,136.221064（同じ場所は同じ点。歩きは 491m・507m で 7・7 のまま）／養浩館庭園＝#38 と同じ way 210921872 の Nominatim の値（いまの点のまま。法務 10/30 20:39）／
 *   一乗谷朝倉氏遺跡博物館＝#38 と同じ「福井県立一乗谷朝倉氏遺跡博物館本館」way 1040457411 の Nominatim の値 36.01527,136.298271（法務 10/30 20:39）／
 *   復原町並＝案内板「復原町並地区」node 6707507351（名前のある物の点がなく、町並の中の案内板。企画運営の1件ずつの例外 10/30。いまの点は案内板「復原武家屋敷」）／
 *   朝倉館跡・唐門＝OSM「朝倉館跡」node 3161039841（historic=yes。企画運営 10/30）／福井県立歴史博物館＝OSM node 1420949546（tourism=museum）
 *   佐佳枝廼社・郷土歴史博物館・水の駅は Nominatim の値を6けたにしたいまの点、文学館・足羽神社・足羽山公園・福井駅は node と同じいまの点のまま
 * 文の出典: 一乗谷朝倉氏遺跡博物館 https://asakura-museum.pref.fukui.lg.jp/site/walk（西山光照寺跡「340体以上の石仏・石塔」「３mほどの大きな石仏をはじめ40体ほどの石仏が向い合うように並んでいます」、
 *   湯殿跡庭園「戦国時代の荒々しく勇壮な石組(いしぐみ)が残る庭園」、諏訪館跡庭園「戦国時代の池泉(ちせん)庭園では、日本でも第一級の豪華さを誇る庭園」）／
 *   福井市 https://www.city.fukui.lg.jp/kankou/bunka/bunkazai/r2teienhozonkatsuyou_d/fil/asakuraR2index.pdf（「朝倉館跡庭園、湯殿跡庭園、諏訪館跡庭園、南陽寺跡庭園の４庭園は、平成３年（1991）に特別名勝」）／
 *   水の駅 https://www.city.fukui.lg.jp/sigoto/nourin/nuoson/fukui-michinoeki.html（「福井名物「越前おろしそば」や「ソースかつ丼」などが味わえます。」）／
 *   福井県立歴史博物館 https://www.pref.fukui.lg.jp/muse/Cul-Hist/johsetsu/history.html（「時代ごとに福井の歴史を紹介しています。」）・johsetsu/syowa.html（「昭和30年代後半から昭和40年代」「当時の村や町のくらしを再現しています。」）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-036-f6f7102e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f6f7102e-84e3-426b-9fc7-2fe28a34481e";
const DAY1_ID = "18455e9f-0d28-47f8-bb82-ae11993a7ac4";
const DAY2_ID = "e5f99fab-98ae-444b-87fe-876b4e6d8d89";
const JOSHI = "2d6d313e-2164-4dcf-80a1-062d87d3ffcc";
const SAKAENO = "afc49abb-2cdb-4180-ac38-4d0f6a586c29";
const CHUO = "6b314605-3972-431c-a518-aac2349cb6f0";
const KYODO = "b24c3810-3157-41cd-93a7-e7fbe96a20f7";
const YOKOKAN = "a78a6492-e5c5-4af2-ae90-f0f52292cbd8";
const LUNCH1 = "3073b554-618c-4164-9352-19617cb2c2d2";
const AKEMI = "5ab9db56-162f-4f0b-ac46-5fcaa256b7d5";
const ASUWAJ = "99097ae6-6cfc-4d31-917c-7cd77bed2822";
const ASUWAP = "10943067-c53d-41ad-909d-a9c2c015bd9d";
const MUSEUM = "50e31802-3c8d-4d47-809b-3a06c43edc2b";
const MIZU = "0f866770-1cd2-4d22-8e8a-d042f34ee279";
const MACHI = "c2e9e342-7267-48c7-b239-c55d74814fb6";
const YAKATA = "035690ee-83c0-4af6-a430-b84e42d7b065";
const YUDONO = "b3e9ea2c-8943-43d1-9c10-eb9c0c01dea9";
const SUWA = "19e89941-95c7-4dcc-adf6-22c6626275dc";
const KOSHOJI = "new-koshoji";
const KENREKI = "new-kenreki";
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
  [JOSHI]: { from: [36.065242, 136.220703], to: [36.065518, 136.221064] },
  [MUSEUM]: { from: [36.015266, 136.298268], to: [36.01527, 136.298271] },
  [MACHI]: { from: [35.999318, 136.293964], to: [35.9987095, 136.2934249] },
  [YAKATA]: { from: [35.99972, 136.295253], to: [35.9995362, 136.2953748] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [KOSHOJI]: {
    name: "西山光照寺跡",
    lat: 36.0122779,
    lng: 136.2972687,
    address: "福井県福井市安波賀町",
    memo: "一乗谷朝倉氏遺跡博物館から歩いて約7分。戦国時代の寺院の跡で、これまでの発掘調査で、340体以上の石仏・石塔や、巨石を用いた石垣、本堂の跡などが見つかっています。寺院の跡には、3mほどの大きな石仏をはじめ、40体ほどの石仏が向かい合うように並んでいます。石仏のまわりでは、静かに過ごしましょう。",
  },
  [KENREKI]: {
    name: "福井県立歴史博物館",
    lat: 36.083048,
    lng: 136.222207,
    address: "福井県福井市大宮2-19-15",
    memo: "朝倉館跡から歩いて約3分で駐車場の車に戻り、車で約19分（あわせて約22分）。時代ごとに福井の歴史を紹介する歴史ゾーンと、昭和30年代後半から40年代の村や町のくらしを再現した「昭和のくらし」のコーナーがある博物館です。一乗谷で戦国の城下町を歩いたあとに、福井のその後の歩みもたどりましょう。休館日は公式の案内で確かめてから訪れましょう。見学を終えたら、車で約9分の福井駅でレンタカーを返しましょう（返す手続きに15分ほど）。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [JOSHI]: [{ from: "福井駅から歩いて約10分。", to: "JR福井駅に10時40分ごろ着いたら、歩いて約7分、福井城址から旅を始めます。1日目は歩いてめぐります。" }],
  [SAKAENO]: [
    { from: "福井城址から歩いて約5分。", to: "福井城址から歩いて約7分。" },
    { from: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。", to: PRAY_TO },
  ],
  [LUNCH1]: [
    { from: "養浩館庭園から歩いて約15分、福井駅のまわりで昼食にしましょう。", to: "佐佳枝廼社から歩いて約8分、福井駅のまわりで昼食にしましょう。" },
    { from: "福井名物のおろしそばやソースカツ丼を探してみるのもよいでしょう。", to: "" },
  ],
  [KYODO]: [{ from: "中央公園から歩いて約10分。", to: "福井駅前から歩いて約14分。" }],
  [YOKOKAN]: [
    { from: "郷土歴史博物館のとなりにある、", to: "郷土歴史博物館から歩いて約3分、となりにある" },
    { from: "ゆっくり歩いてみましょう。", to: "ゆっくり歩きましょう。" },
  ],
  [AKEMI]: [{ from: "福井駅から歩いて約20分、", to: "養浩館庭園から歩いて約29分、" }],
  [ASUWAJ]: [
    { from: "145段の愛宕坂を上って約10分。", to: "145段の愛宕坂を上って約4分。" },
    { from: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。", to: PRAY_TO },
  ],
  [ASUWAP]: [
    { from: "足羽神社から歩いて約10分。", to: "足羽神社から歩いて約9分。" },
    { from: "山の上から福井の町を眺めて、1日目を締めくくりましょう。帰りは福井駅まで歩いて約25分です。", to: "山の上から福井の町を眺めて、1日目を終えましょう。見学を終えたら、この夜は、歩いて約29分の福井駅のまわりの宿に泊まりましょう。" },
  ],
  [MUSEUM]: [
    {
      from: "福井駅からJR越美北線で約15分、一乗谷駅から歩いて約3分。",
      to: "2日目は車でめぐります。福井駅のまわりの宿を出て、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約16分の博物館の駐車場から歩いて約3分。",
    },
  ],
  [MIZU]: [
    { from: "博物館から歩いて約10分、", to: "西山光照寺跡から歩いて約14分、" },
    { from: "イートインスペースで越前おろしそばやソースカツ丼などの福井名物を味わえるので、", to: "飲食コーナーで、越前おろしそばやソースかつ丼などの福井名物を味わえるので、" },
  ],
  [MACHI]: [
    {
      from: "道の駅から谷あいの道を歩いて約35分（バスもあります）。",
      to: "道の駅から歩いて約11分で博物館の駐車場の車に戻り、車で約8分、復原町並のそばの駐車場から歩いて約3分（あわせて約22分）。",
    },
    { from: "屋敷や町屋をのぞいてみましょう。", to: "屋敷や町屋をのぞきましょう。" },
  ],
  [YAKATA]: [
    { from: "復原町並から歩いてすぐ。", to: "復原町並から歩いて約6分。" },
    {
      from: "広い館の跡に立って、往時の姿を思い描いてみましょう。",
      to: "館の跡の高台には、戦国時代の荒々しく勇壮な石組が残る湯殿跡庭園があります。近くの諏訪館跡庭園は、戦国時代の池泉庭園では日本でも第一級の豪華さを誇るとされ、この2つは、朝倉館跡庭園・南陽寺跡庭園とともに、平成3年（1991）に特別名勝に指定されています。広い館の跡に立って、往時の姿を思い描きましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: JOSHI, h: 10, m: 47, stay: 40, legs: [] },
  { id: SAKAENO, h: 11, m: 34, stay: 20, legs: [walk(7)] },
  { id: LUNCH1, h: 12, m: 2, stay: 40, legs: [walk(8)] },
  { id: KYODO, h: 12, m: 56, stay: 60, legs: [walk(14)] },
  { id: YOKOKAN, h: 13, m: 59, stay: 50, legs: [walk(3)] },
  { id: AKEMI, h: 15, m: 18, stay: 39, legs: [walk(29)] },
  { id: ASUWAJ, h: 16, m: 1, stay: 25, legs: [walk(4)] },
  { id: ASUWAP, h: 16, m: 35, stay: 25, legs: [walk(9)] },
];
const DAY2: Plan = [
  { id: MUSEUM, h: 9, m: 0, stay: 105, legs: [] },
  { id: KOSHOJI, h: 10, m: 52, stay: 25, legs: [walk(7)] },
  { id: MIZU, h: 11, m: 31, stay: 40, legs: [walk(14)] },
  { id: MACHI, h: 12, m: 33, stay: 80, legs: [walk(11), car(8), walk(3)] },
  { id: YAKATA, h: 13, m: 59, stay: 70, legs: [walk(6)] },
  { id: KENREKI, h: 15, m: 31, stay: 59, legs: [walk(3), car(19)] },
];
const REMOVE1 = [CHUO];
const REMOVE2 = [YUDONO, SUWA];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [JOSHI, SAKAENO, CHUO, KYODO, YOKOKAN, LUNCH1, AKEMI, ASUWAJ, ASUWAP].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [MUSEUM, MIZU, MACHI, YAKATA, YUDONO, SUWA].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const id of [...REMOVE1, ...REMOVE2]) console.log(`外す: ${all.find((x) => x.id === id)!.name}`);
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ", "ホテル", "旅館", "締めくくり", "中央公園", "越美北線", "バス"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」があります`));
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: REMOVE1 });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx, remove: REMOVE2 });
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
