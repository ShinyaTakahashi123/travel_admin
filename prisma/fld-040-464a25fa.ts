/**
 * 初日・最終日の見直し #40 464a25fa「オリーブ公園と二十四の瞳映画村、小豆島の風景と物語の1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 18:38、#37〜#44 は制作補助2）
 * 歩きは routed-foot、車は routed-car（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 土庄港 10:40ごろ → レンタカー（手続き15分）＋車8（1.9km）→ 土渕海峡 11:03（20）→ 歩3（189m）→ 迷路のまち 11:26（50→39）→ 歩5（334m。もと4）→
 *   西光寺 12:10（26→20）→ 歩8（574m）→ 土庄の町で昼食 12:38〜13:18（70→40。企画運営 10/30）（土庄町の飲食店一覧 https://www.town.tonosho.kagawa.jp/kanko/gourmet/1756.html の
 *   大衆食堂 川崎屋（渕崎甲1932-1、点から約330m）・ひよこ食堂（甲412-1、迷路のまちのそば）。もとは宝生院の後 11:30）→ 歩6（406m）で土渕海峡のそばの車＋車8（1.6km）→
 *   宝生院のシンパク 13:32（20→15）→ 車11（3.9km）→ 肥土山の農村歌舞伎舞台 13:58（40→25）→ 車3（1.2km、もとのまま）→ 中山の農村歌舞伎舞台 14:26（20→15）→
 *   歩4（269m。もと2）→ 中山千枚田 14:45（60→40）→ 歩4で中山の車＋車15（7.4km、もとのまま）→ 小豆島オリーブ公園 15:44〜16:54（80→70）→ 車11（3.3km）で草壁港のまわりの宿
 *   （OSM で草壁港のそばに宿の点2。宿の名前は書かない）
 * 2日目（16:30 に出るのはもとのまま）: 草壁港のまわりの宿 → 車15（9.8km、もとのまま）→ 二十四の瞳映画村 9:28（85。もと 9:30）→ 歩12（862m。もと8）→ 岬の分教場 11:05（40）→
 *   歩12で映画村の車＋車12（6.8km、もとのまま）→ 馬木で昼食 12:09〜12:49（75→40。企画運営 10/30。小豆島町のランチの一覧 https://www.town.shodoshima.lg.jp/kanko/eat/taberu/lunch/index.html の
 *   フォレスト酒蔵 MORIKUNIギャラリー（馬木甲1010番地1）https://www.town.shodoshima.lg.jp/kanko/eat/taberu/lunch/morikuni.html ・GEORGESgallery＋KOHIRAcafe（馬木甲881番地9）https://www.town.shodoshima.lg.jp/kanko/eat/taberu/lunch/kohira_cafe.html）→
 *   車6（875m）→ 醤の郷 12:55（65）→ 車5（2.1km、もとのまま）→ 観音寺 14:05（30）→ 歩6（431m。もと2）→ 坂手港 14:41（50）→ 歩6で観音寺の車＋車9（2.6km。もと3）→
 *   常光寺 15:46〜16:30（44）→ 車30（17.7km、もとのまま）で土庄港、レンタカーを返す（15分）
 * 点: 迷路のまち＝OSM「妖怪美術館02」tourism=museum way 966167850（Nominatim 34.4851942,134.1857019。いまの点と同じなので変えない。企画運営 10/30。
 *   メモに妖怪美術館を足す: https://meipam.net/「「迷路のまち」にはアートプロジェクトMeiPAMが運営する妖怪美術館…」「800体以上集まる妖怪の作品群」）／
 *   醤の郷＝OSM「Marukin Soy Sauce Factory」tourism=museum way 735146447（#03a50000 のマルキン醤油記念館と同じ点。いまは醤の郷現代美術館 node で、馬木の昼食と同じ点）／
 *   馬木で昼食＝バス停「馬木」node 11018087725／坂手港＝OSM「小豆島 坂手フェリーターミナル さかてらす」node 13923339111（メモに港の待合所。いまは place node「坂手」）
 *   マルキン醤油記念館: 香川県の登録有形文化財の一覧（マルキン記念館（旧醤油醸造工場））https://www.pref.kagawa.lg.jp/kenkyoui/bunka/culturalassets_16.html
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-040-464a25fa.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "464a25fa-3239-4466-9596-2038b66156a9";
const DAY1_ID = "322356ed-3fb4-4c5a-afe4-edc2b31855a8";
const DAY2_ID = "c9f825d6-5aa0-4e33-b608-cfcadc4977f3";
const DOBUCHI = "475a7cb2-3816-442b-b2ca-685e0df9a1d8";
const MEIRO = "1bb41625-c91d-418c-85bf-151db462cd0c";
const SAIKO = "ee187e47-5bc8-464e-9116-5e62e5ca0f62";
const SHINPAKU = "5af6a646-0989-40f9-94a1-7906003966dd";
const LUNCH1 = "7e80ec33-cb45-4ed0-bada-8de970e80bc9";
const HITO = "f863fef2-dbf3-42c2-82f2-b1d5e0fd9308";
const NAKA = "1dc9fcd2-e459-4250-8894-3c09cd5449b7";
const SENMAI = "a9c00aa8-a798-4bac-b495-768102f5ba97";
const OLIVE = "7ee6c0c2-74d0-4247-a57c-b488619beedc";
const EIGA = "2bb6bbba-0c95-486d-aa76-d61a269702ad";
const BUN = "184d9316-9710-4046-a242-29d898890e53";
const UMAKI = "9a580a3f-c59f-4fe7-966a-c7bf6fe37e6b";
const HISHIO = "0f40bb7c-a378-4644-bf63-ca82a56e0eb7";
const KANNON = "bda8cc22-89db-4c56-a0c3-d8158a523945";
const SAKATE = "43b58603-6d08-42c0-95a7-c811187f4299";
const JOKO = "b621bc48-f76d-496b-974c-ac41f80f2233";
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
  [UMAKI]: { from: [34.474685, 134.317926], to: [34.4745993, 134.3186695] },
  [HISHIO]: { from: [34.474685, 134.317926], to: [34.467083, 134.319388] },
  [SAKATE]: { from: [34.458986, 134.321725], to: [34.4559196, 134.3207305] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_SET: Record<string, string> = {
  [LUNCH1]:
    "西光寺から歩いておよそ8分、お昼は土庄の町で食事をとりましょう。町のまわりには、大衆食堂などの食事処があります。食事を終えたら、歩いておよそ6分で土渕海峡のそばにとめた車に戻り、車でおよそ8分、宝生院のシンパクへ向かいましょう。",
  [UMAKI]:
    "岬の分教場から、歩きと車であわせておよそ24分、お昼は馬木地区で食事をとりましょう。醤油蔵の立ち並ぶ馬木のまわりには、食事のできる店もあります。食事を終えたら、車でおよそ6分、醤の郷のマルキン醤油記念館へ向かいましょう。",
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [DOBUCHI]: [
    { from: "フェリーで土庄港に着いたら、レンタカーを借りて、小豆島の旅は土渕海峡から始まります。", to: "フェリーで土庄港に10時40分ごろ着いたら、港の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ8分、土渕海峡から旅を始めます。" },
    { from: "両岸を行き来してみましょう。", to: "両岸を行き来しましょう。" },
    { from: "見学を終えたら、歩いて迷路のまちへ向かいましょう。", to: "見学を終えたら、車をとめたまま、歩いておよそ3分、迷路のまちへ向かいましょう。" },
  ],
  [MEIRO]: [
    { from: "現代アートの作品が路地のあちこちに点在しています。", to: "現代アートの作品が路地のあちこちに点在しています。路地の中には、妖怪の作品を集めた妖怪美術館もあります。" },
    { from: "土渕海峡から歩いてすぐ、", to: "土渕海峡から歩いておよそ3分、" },
    { from: "見学を終えたら、歩いて西光寺へ向かいましょう。", to: "見学を終えたら、歩いておよそ5分、西光寺へ向かいましょう。" },
  ],
  [SAIKO]: [
    { from: "迷路のまちから歩いて4分ほど、", to: "迷路のまちから歩いておよそ5分、" },
    { from: "見学を終えたら、車で宝生院のシンパクへ向かいましょう。", to: "見学を終えたら、歩いておよそ8分、土庄の町で昼食にしましょう。" },
  ],
  [SHINPAKU]: [
    { from: "西光寺から車でおよそ5分、", to: "土庄の町から、歩きと車であわせておよそ14分、" },
    { from: "境内の大切な木ですので、静かに、敬意をもって見学しましょう。", to: "宝生院の境内に立つ木です。" + PRAY_TO },
    { from: "見学を終えたら、車で土庄の町へ戻り、昼食をとりましょう。", to: "見学を終えたら、車でおよそ11分、肥土山の農村歌舞伎舞台へ向かいましょう。" },
  ],
  [HITO]: [
    { from: "土庄の町から車でおよそ14分、", to: "宝生院のシンパクから車でおよそ11分、" },
    { from: "今も祈りが続く神社ですので、静かに、敬意をもって見学しましょう。", to: PRAY_TO },
    { from: "見学を終えたら、車で中山の農村歌舞伎舞台へ向かいましょう。", to: "見学を終えたら、車でおよそ3分、中山の農村歌舞伎舞台へ向かいましょう。" },
  ],
  [NAKA]: [
    { from: "今も祈りが続く神社の境内ですので、静かに、敬意をもって見学しましょう。", to: PRAY_TO },
    { from: "見学を終えたら、歩いて中山千枚田へ向かいましょう。", to: "見学を終えたら、車をとめたまま、歩いておよそ4分、中山千枚田へ向かいましょう。" },
  ],
  [SENMAI]: [
    { from: "中山農村歌舞伎舞台から歩いてすぐ、", to: "中山の農村歌舞伎舞台から歩いておよそ4分、" },
    { from: "見学を終えたら、車で小豆島オリーブ公園へ向かいましょう。", to: "見学を終えたら、歩いておよそ4分で中山の舞台のそばにとめた車に戻り、車でおよそ15分、小豆島オリーブ公園へ向かいましょう。" },
  ],
  [OLIVE]: [
    { from: "中山千枚田から車でおよそ15分、", to: "中山千枚田から、歩きと車であわせておよそ19分、" },
    { from: "見学を終えたら、今夜はこの近くの宿に宿泊します。", to: "見学を終えたら、この夜は、車でおよそ11分の草壁港のまわりの宿に泊まりましょう。" },
  ],
  [EIGA]: [
    { from: "宿から車でおよそ15分、", to: "草壁港のまわりの宿を出て、車でおよそ15分、" },
    { from: "見学を終えたら、歩いて岬の分教場へ向かいましょう。", to: "見学を終えたら、車をとめたまま、歩いておよそ12分、岬の分教場へ向かいましょう。" },
  ],
  [BUN]: [
    { from: "映画村から歩いて8分ほど、", to: "映画村から歩いておよそ12分、" },
    { from: "見学を終えたら、車で馬木へ向かいましょう。", to: "見学を終えたら、歩いておよそ12分で映画村にとめた車に戻り、車でおよそ12分、馬木へ向かいましょう。" },
  ],
  [HISHIO]: [
    { from: "次に訪れるのは醤の郷です。", to: "馬木から車でおよそ6分、次に訪れるのは醤の郷です。" },
    { from: "蔵の中を見学できる記念館や", to: "蔵の中を見学できるマルキン醤油記念館や" },
    { from: "のんびりと歩いてみましょう。", to: "のんびりと歩きましょう。" },
    { from: "見学を終えたら、車で観音寺へ向かいましょう。", to: "見学を終えたら、車でおよそ5分、観音寺へ向かいましょう。" },
  ],
  [KANNON]: [
    { from: "感じてみましょう。", to: "感じましょう。" },
    { from: "見学を終えたら、歩いて坂手港へ向かいましょう。", to: "見学を終えたら、車をとめたまま、歩いておよそ6分、坂手港へ向かいましょう。" },
  ],
  [SAKATE]: [
    { from: "観音寺から歩いて2分ほど、", to: "観音寺から歩いておよそ6分、" },
    { from: "見学を終えたら、車で常光寺へ向かいましょう。", to: "見学を終えたら、歩いておよそ6分で観音寺のそばにとめた車に戻り、車でおよそ9分、常光寺へ向かいましょう。" },
  ],
  [JOKO]: [
    { from: "坂手港から車でおよそ3分、", to: "坂手港から、歩きと車であわせておよそ15分、" },
    { from: "ふれてみましょう。", to: "ふれましょう。" },
    { from: "見学を終えたら、車でおよそ30分、土庄港のレンタカー営業所へ戻り、返却してからフェリーで帰りましょう。", to: "見学を終えたら、車でおよそ30分の土庄港でレンタカーを返し（返す手続きに15分ほど）、フェリーで帰りましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: DOBUCHI, h: 11, m: 3, stay: 20, legs: [] },
  { id: MEIRO, h: 11, m: 26, stay: 39, legs: [walk(3)] },
  { id: SAIKO, h: 12, m: 10, stay: 20, legs: [walk(5)] },
  { id: LUNCH1, h: 12, m: 38, stay: 40, legs: [walk(8)] },
  { id: SHINPAKU, h: 13, m: 32, stay: 15, legs: [walk(6), car(8)] },
  { id: HITO, h: 13, m: 58, stay: 25, legs: [car(11)] },
  { id: NAKA, h: 14, m: 26, stay: 15, legs: [car(3)] },
  { id: SENMAI, h: 14, m: 45, stay: 40, legs: [walk(4)] },
  { id: OLIVE, h: 15, m: 44, stay: 70, legs: [walk(4), car(15)] },
];
const DAY2: Plan = [
  { id: EIGA, h: 9, m: 28, stay: 85, legs: [] },
  { id: BUN, h: 11, m: 5, stay: 40, legs: [walk(12)] },
  { id: UMAKI, h: 12, m: 9, stay: 40, legs: [walk(12), car(12)] },
  { id: HISHIO, h: 12, m: 55, stay: 65, legs: [car(6)] },
  { id: KANNON, h: 14, m: 5, stay: 30, legs: [car(5)] },
  { id: SAKATE, h: 14, m: 41, stay: 50, legs: [walk(6)] },
  { id: JOKO, h: 15, m: 46, stay: 44, legs: [walk(6), car(9)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [DOBUCHI, MEIRO, SAIKO, SHINPAKU, LUNCH1, HITO, NAKA, SENMAI, OLIVE].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [EIGA, BUN, UMAKI, HISHIO, KANNON, SAKATE, JOKO].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const memos: Record<string, string> = { ...MEMO_SET };
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
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ", "ホテル", "旅館", "締めくくり"])
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
