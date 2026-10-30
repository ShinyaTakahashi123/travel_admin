/**
 * 初日・最終日の見直し #41 c898c3d9「偕楽園と水戸城下、大洗の海をめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 18:38、#37〜#44 は制作補助2）
 * 歩きは routed-foot、車は routed-car（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: JR水戸駅 10:33ごろ → レンタカー（手続き15分）＋車10（偕楽園下有料駐車場 OSM way 269144784 まで 2.6km、もとのまま）＋歩7（470m）→ 偕楽園 11:05（70）→ 歩5（312m、もとのまま）→ 常磐神社 12:20（35→20）→ 歩8（574m）→
 *   【新】偕楽園・常磐神社前のまわり 12:48〜13:28（昼食。バス停 node 4973154973。OSM の食事処「門の前」node 13227097600（約100m）・「ラヴィプロヴァンソ」node 3124852840（約120m）。
 *   もとは歴史館 12:00〜 の「周辺には食事処も多い」）→ 歩7（511m）で駐車場の車＋車10（1.8km。企画運営 10/30）→ 茨城県立歴史館 13:45（55→40）→ 車12（3.2km）→ 弘道館 14:37〜15:32（55。夏だけのしおりで、夏は 9時～17時
 *   https://www.pref.ibaraki.jp/bugai/koho/kenmin/hibari/hibari-site/hibari202302/2tokusyu03.html「9時～17時（2月11日～）」。閉館の前に余裕をとるため、大手門・芸術館より前にした）→ 歩3（206m。もとは車8）→
 *   水戸城跡（大手門）15:35（40→27）→ 歩3で弘道館の車＋車8（1.6km）→ 水戸芸術館 16:13〜16:58（45）→ 車30（17.4km）で大洗磯前神社のまわりの宿（OSM で神社から200m内に宿の点7）
 *   外したもの: 徳川ミュージアム（50）・千波湖（45）。どちらもタイトル・説明文になく、2日目にも入らない
 * 2日目（16:32 に出るのはもとのまま）: 宿 → 歩5 → 大洗磯前神社 9:30（40）→ 歩5で宿の車＋車10（2.7km、もとのまま）→ アクアワールド 10:25（90）→ 車8（3.7km、もとのまま）→
 *   大洗マリンタワー 12:03（80→30）→ 歩2（83m）→【新】大洗マリンタワーのまわり 12:35〜13:15（昼食。バス停 node 5273639705。まわり300m内に OSM の食事処の点30ほど。
 *   もとはタワーの「展望レストランで昼食をとることもできます」で、公式のページで確かめられないので消す）→ 歩2で車＋車6（558m、もとのまま）→ 大洗わくわく科学館 13:23（90）→
 *   車8（1.4km、もとのまま）→ 大洗サンビーチ 15:01〜16:31（90）→ 車35（14.8km、もとのまま）で水戸駅、レンタカーを返す（15分）
 * 点: 茨城県立歴史館＝OSM「歴史館」tourism=museum way 91530804（Nominatim 36.3790051,140.4504411。いまは約140m北東）。ほかは OSM の値のまま
 *   （水戸城跡（大手門）はメモの「大手橋」way 90583998 の値を6けたにした点）
 * 歴史館の「旧水戸農業高等学校本館」は復元（https://rekishikan-ibk.jp/guide/nogyoko/「この建物は旧校舎本館を復元したものです。」「本館（明治33年（1900）建築）」）なので「保存した」を直す
 * 芸術館の「伝統から創造へ」は公式 https://www.arttowermito.or.jp/tower/ になく、公式の「三重らせんが空に向かって上昇していくデザインは、無限に発展する水戸を象徴しています。」にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-041-c898c3d9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c898c3d9-c137-4c2b-98b2-574493f1a572";
const DAY1_ID = "d2d37308-c774-4640-ad2a-5e884af14a33";
const DAY2_ID = "7aa235f4-c221-4944-8102-b0e68044394f";
const KAIRAKU = "bd205e9d-ec09-423e-97dd-5958d9de6c00";
const TOKIWA = "a708fb25-8dbd-47bd-ae3f-1dfdfbd6c2db";
const TOKUGAWA = "a49f42e7-7f85-42b8-9d2d-2f6ff37a7e4d";
const REKISHI = "5e245d5f-e102-4475-a8ad-7916f3104cda";
const SENBA = "974d9cfa-8bb2-4a95-9e7e-803b8ee8c77e";
const GEIJUTSU = "197e80f9-abfc-4e35-bd4f-4fe1e3240730";
const OTEMON = "702b1edf-cc5a-46d4-8ef2-31f621942857";
const KODOKAN = "19ccc65a-5d12-45e4-832e-f10fa71668c7";
const ISOSAKI = "d0600d48-d80a-49da-9d04-a7793e239fe3";
const AQUA = "8389248f-a2ac-4ffe-94b1-78b362b459c8";
const TOWER = "358d0de4-a078-4d3e-a6a3-48bee85c1002";
const WAKUWAKU = "ff24c5b4-c064-4a5a-a4b7-e8952533eee9";
const BEACH = "38c1d7c2-5875-4399-83b5-5b69eec982b2";
const LUNCH1 = "new-kairakuen";
const LUNCH2 = "new-marinetower";
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
  [REKISHI]: { from: [36.379932, 140.451584], to: [36.3790051, 140.4504411] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "偕楽園・常磐神社前のまわり（昼食）",
    lat: 36.3746115,
    lng: 140.456935,
    address: "茨城県水戸市常磐町1丁目",
    memo: "常磐神社から歩いておよそ8分。偕楽園の東門のまわりには、食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ7分で偕楽園の下の駐車場にとめた車に戻り、車でおよそ10分、茨城県立歴史館へ向かいましょう。",
  },
  [LUNCH2]: {
    name: "大洗マリンタワーのまわり（昼食）",
    lat: 36.3110057,
    lng: 140.5702454,
    address: "茨城県東茨城郡大洗町港中央",
    memo: "大洗マリンタワーから歩いておよそ2分。タワーのまわりには、食堂やカフェなどの食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ2分でタワーのそばにとめた車に戻り、車でおよそ6分、大洗わくわく科学館へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KAIRAKU]: [
    {
      from: "JR水戸駅前でレンタカーを借りて、車でおよそ10分、偕楽園に着きます。",
      to: "JR水戸駅に10時30分ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車でおよそ10分の偕楽園の下の駐車場に車をとめ、歩いておよそ7分、偕楽園に着きます。",
    },
  ],
  [TOKIWA]: [
    { from: "ほかの参拝者の迷惑にならないよう、敬意を持ってお参りしましょう。", to: PRAY_TO },
    { from: "この後は、歩いておよそ12分、徳川ミュージアムへ向かいましょう。", to: "この後は、歩いておよそ8分、偕楽園・常磐神社前のまわりで昼食にしましょう。" },
  ],
  [REKISHI]: [
    { from: "徳川ミュージアムから車でおよそ8分、", to: "偕楽園・常磐神社前のまわりから、歩きと車であわせておよそ17分、" },
    { from: "明治時代の学校建築を保存した旧水戸農業高等学校本館", to: "明治時代の校舎を復元した旧水戸農業高等学校本館" },
    { from: "周辺には食事処も多いので、ここで昼食にしましょう。", to: "" },
    { from: "この後は、車でおよそ10分、千波湖へ向かいましょう。", to: "この後は、車でおよそ12分、弘道館へ向かいましょう。" },
  ],
  [KODOKAN]: [
    { from: "水戸城跡から車でおよそ8分、", to: "茨城県立歴史館から車でおよそ12分、" },
    { from: "見学してみましょう。今夜は大洗の宿に泊まりましょう。", to: "見学しましょう。この後は、車をとめたまま、歩いておよそ3分、水戸城跡の大手門へ向かいましょう。" },
  ],
  [OTEMON]: [
    { from: "水戸芸術館から車でおよそ10分、", to: "弘道館から歩いておよそ3分、" },
    { from: "この後は、車でおよそ8分、弘道館へ向かいましょう。", to: "この後は、歩いておよそ3分で弘道館のそばにとめた車に戻り、車でおよそ8分、水戸芸術館へ向かいましょう。" },
  ],
  [GEIJUTSU]: [
    { from: "天に向かって伸びる形は、「伝統から創造へ」を象徴しているとされています。", to: "稜線をたどると、三重らせんが空に向かって上昇していくデザインで、無限に発展する水戸を象徴しているとされています。" },
    { from: "千波湖から車でおよそ10分、", to: "水戸城跡の大手門から、歩きと車であわせておよそ11分、" },
    { from: "この後は、車でおよそ10分、水戸城跡へ向かいましょう。", to: "見学を終えたら、この夜は、車でおよそ30分の大洗磯前神社のまわりの宿に泊まりましょう。" },
  ],
  [ISOSAKI]: [
    { from: "平安時代の斉衡3年(856)、", to: "大洗磯前神社のまわりの宿を出て、歩いておよそ5分、大洗磯前神社から2日目を始めます。平安時代の斉衡3年(856)、" },
    { from: "今も多くの人が参拝する神社です。境内や神磯の鳥居の前では、ほかの参拝者への敬意を持ってお参りしましょう。", to: PRAY_TO },
    { from: "続いては、大洗の海の生き物に出会える水族館へ向かいましょう。", to: "この後は、歩いておよそ5分で宿にとめた車に戻り、車でおよそ10分、アクアワールド茨城県大洗水族館へ向かいましょう。" },
  ],
  [AQUA]: [{ from: "大洗磯前神社から車でおよそ10分、", to: "大洗磯前神社から、歩きと車であわせておよそ15分、" }],
  [TOWER]: [
    { from: "タワー内の展望レストランで昼食をとることもできます。", to: "" },
    { from: "この後は、車でおよそ6分、大洗わくわく科学館へ向かいましょう。", to: "この後は、歩いておよそ2分、タワーのまわりで昼食にしましょう。" },
  ],
  [WAKUWAKU]: [{ from: "大洗マリンタワーから車でおよそ6分、", to: "大洗マリンタワーのまわりから、歩きと車であわせておよそ8分、" }],
  [BEACH]: [
    { from: "海岸沿いの遊歩道を歩いてみましょう。", to: "海岸沿いの遊歩道を歩きましょう。" },
    { from: "大洗を満喫したら、車で水戸駅まで戻り(およそ35分)、レンタカーを返して、特急で帰りましょう。", to: "見学を終えたら、車でおよそ35分の水戸駅でレンタカーを返し（返す手続きに15分ほど）、電車で帰りましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: KAIRAKU, h: 11, m: 5, stay: 70, legs: [] },
  { id: TOKIWA, h: 12, m: 20, stay: 20, legs: [walk(5)] },
  { id: LUNCH1, h: 12, m: 48, stay: 40, legs: [walk(8)] },
  { id: REKISHI, h: 13, m: 45, stay: 40, legs: [walk(7), car(10)] },
  { id: KODOKAN, h: 14, m: 37, stay: 55, legs: [car(12)] },
  { id: OTEMON, h: 15, m: 35, stay: 27, legs: [walk(3)] },
  { id: GEIJUTSU, h: 16, m: 13, stay: 45, legs: [walk(3), car(8)] },
];
const DAY2: Plan = [
  { id: ISOSAKI, h: 9, m: 30, stay: 40, legs: [] },
  { id: AQUA, h: 10, m: 25, stay: 90, legs: [walk(5), car(10)] },
  { id: TOWER, h: 12, m: 3, stay: 30, legs: [car(8)] },
  { id: LUNCH2, h: 12, m: 35, stay: 40, legs: [walk(2)] },
  { id: WAKUWAKU, h: 13, m: 23, stay: 90, legs: [walk(2), car(6)] },
  { id: BEACH, h: 15, m: 1, stay: 90, legs: [car(8)] },
];
const REMOVE1 = [TOKUGAWA, SENBA];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KAIRAKU, TOKIWA, TOKUGAWA, REKISHI, SENBA, GEIJUTSU, OTEMON, KODOKAN].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [ISOSAKI, AQUA, TOWER, WAKUWAKU, BEACH].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const id of REMOVE1) console.log(`外す: ${all.find((x) => x.id === id)!.name}`);
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ", "ホテル", "旅館", "締めくくり", "徳川ミュージアム", "千波湖"])
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
