/**
 * 初日・最終日の見直し #48 79db7413「大沼公園まで足をのばす、自然とグルメの函館たっぷり1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a）
 * 1泊2日・初日はレンタカー、2日目は歩き。初日を11時ごろからにする。2日目はもとから 16:32 に終わる（終わりは今より遅くしない）
 * 初日: 函館駅に10時半ごろ → 手続き15分＋車40（OSRM 25.5分、もとの40は ×1.5＋5 の内でそのまま）→ 大沼国定公園 11:25〜12:55（大島の路の散策と昼食、100→90）→
 *   歩4（foot 286m・3.8分、もとは7）→ 遊覧船 12:59〜13:49（55→50）→ 車30（OSRM 23.7分＋駐車）→ 五稜郭公園 14:19〜（ここから先はもとの時刻）→
 *   奉行所 15:17 → 歩7（foot 486m・6.5分、もとは5）→ 五稜郭タワー 15:59〜16:44。帰りの車 15→12（OSRM 6.5分、もとは ×1.5＋5 を超える）
 *   鹿部間歇泉は外す: 遊覧船→鹿部 OSRM 26.3分・鹿部→五稜郭 48.8分で、11時からでは17時に収まらないため（説明文・タイトルにない。写真なし）
 *   遊覧船は4月〜11月ごろの運航（大沼遊船の公式 https://www.onuma-parks.com/）で、冬（12〜3月）に乗れないので季節から冬を外す（rules 110）
 *   遊覧船のメモ「3つの湖沼をめぐる」は誤り（大沼と小沼をめぐる約30分、livejapan・visit-hokkaido detail_10298）
 * 2日目: 昼食が金森赤レンガ倉庫 10:15〜11:25 で 11:30 より前だったため、まちづくりセンターと金森の順を入れかえる（金森 10:59〜12:09 で昼食）。
 *   歩き: 摩周丸→まちづくり 19（foot 1,397m）、まちづくり→金森 6、金森→北方 8、領事館→公会堂 4、公会堂→元町 7、ハリストス→八幡坂 2、八幡坂→文学館 6。
 *   終わりを今より遅くしないため、公会堂 40→35、文学館 45→35（文学館 15:57〜16:32）。帰りは末広町の電停（歩1）から市電で函館駅前まで約8分
 * 座標: 大沼国定公園 = 大沼公園駅の点だったので、メモに書く西大島橋（way 41374371）に。五稜郭公園 = 公園の中心だったので一の橋（way 955948102、bb3ae76a と同じ）に。
 *   金森赤レンガ倉庫 = 案内板の node 10607546564 だったので、倉庫の node 2476094422（ほかのしおりと同じ）に。八幡坂 = 道の線の点だったので node 5329294424（tourism=attraction、78eab247 と同じ）に
 * タイトル・説明文は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-048-79db7413.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "79db7413-b6dd-4645-9d32-cd073bccbed2";
const DAY1_ID = "9c1c54b3-a645-489f-8300-e96e5716c5e8";
const DAY2_ID = "113d5e7b-42b6-4a8c-9efc-bfceadad0f1e";
const ONUMA = "2d668ab4-8cc2-486d-8da8-b24204cdc9d1";
const YUURAN = "59f4c5a8-93d2-4055-8efb-43d9904275c8";
const SHIKABE = "31275fea-f279-4777-9bd7-c2035648ba4e";
const GORYO = "849aa78d-244c-4c89-9cda-b2ecea426c0a";
const BUGYO = "41ad2048-0738-4f11-9db0-c242484be10a";
const TOWER = "5643fbc4-b394-4fd8-8023-7020cd10bb60";
const ASAICHI = "ab2ad9e9-555d-4165-844e-d717ffc575a6";
const MASHU = "e900d1d0-b125-4051-945c-d7fdc076b105";
const KANEMORI = "3fbf089f-5d6b-4bc0-a75a-bafd247e6279";
const MACHI = "66d87ea8-21ad-40bf-995e-172a93a7ac75";
const HOPPO = "ffe6b250-593e-4676-b15d-3af62d271b32";
const EIKOKU = "21c3ca15-55c0-47a3-a27a-2dd3c9d462cd";
const KOKAIDO = "e2749998-f8fc-44f0-8b56-1d7c2292b159";
const MOTOMACHI = "cf27c130-c0b4-458a-ae96-1c59d95a52ed";
const YOHANE = "a89f2f1f-8019-4b77-b4be-bc4aadc684de";
const HARISU = "e90b1f2b-5cbb-4bdf-87bd-81135eb18358";
const HACHIMAN = "98591881-da51-46b8-b250-52059e1d9be3";
const BUNGAKU = "7506d9bb-5616-4d56-9a25-4d9b2cde6cac";
const SEASONS_FROM = ["spring", "summer", "autumn", "winter"];
const SEASONS_TO = ["spring", "summer", "autumn"];
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

// [いまの値, 直した値]（OSM の値）
const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [ONUMA]: { from: [41.98085, 140.67008], to: [41.984945, 140.674114] },
  [GORYO]: { from: [41.7969, 140.757156], to: [41.795602, 140.754953] },
  [KANEMORI]: { from: [41.766307, 140.716844], to: [41.766184, 140.716449] },
  [HACHIMAN]: { from: [41.764723, 140.712741], to: [41.763794, 140.711773] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [ONUMA]: [
    {
      from: "函館駅前でレンタカーを借りて、大沼国定公園まで車でおよそ40分。",
      to: "函館駅に10時半ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、大沼国定公園まで車でおよそ40分。",
    },
    { from: "全国で13番目・道南唯一の国定公園として", to: "全国で13番目の国定公園として" },
    {
      from: "この後は、歩いておよそ7分、遊覧船の乗り場へ向かいましょう。",
      to: "公園広場から西大島橋を渡り、2つの島を歩く「大島の路」は約15分の散策路で、橋を渡って左手の岸からは駒ヶ岳が正面に見えます。大沼公園駅から公園広場にかけては食事のできる店が集まっているので、ここで昼食にしましょう。この後は、歩いておよそ4分、遊覧船の乗り場へ向かいましょう。",
    },
  ],
  [YUURAN]: [
    { from: "大沼国定公園から歩いておよそ7分、", to: "大沼国定公園から歩いておよそ4分、" },
    {
      from: "大沼・小沼・蓴菜沼という3つの湖沼をめぐる遊覧船で、湖上から駒ヶ岳や、大小126もの島々を眺められます。",
      to: "大沼と小沼をめぐる約30分の遊覧船で、湖上から駒ヶ岳や、湖に浮かぶ島々を眺められます。",
    },
    { from: "この後は、車でおよそ22分、鹿部間歇泉へ向かいましょう。", to: "この後は、車でおよそ30分、五稜郭公園へ向かいましょう。" },
  ],
  [GORYO]: [
    { from: "鹿部間歇泉から車でおよそ40分、", to: "大沼の遊覧船の乗り場から車でおよそ30分、" },
    { from: "桜の名所としても親しまれています。", to: "桜の名所としても親しまれています。堀に架かる一の橋を渡って、郭の中を歩いてみましょう。" },
  ],
  [BUGYO]: [{ from: "この後は、歩いておよそ5分、五稜郭タワーへ向かいましょう。", to: "この後は、歩いておよそ7分、五稜郭タワーへ向かいましょう。" }],
  [TOWER]: [
    { from: "五稜郭公園とセットで訪れたい展望タワーです。", to: "箱館奉行所から歩いておよそ7分、五稜郭タワーに着きます。五稜郭公園とセットで訪れたい展望タワーです。" },
    {
      from: "見学を終えたら、車でおよそ15分の函館駅前でレンタカーを返し、函館市内の宿へ向かいましょう。",
      to: "見学を終えたら、車でおよそ12分の函館駅前でレンタカーを返しましょう。この夜は、函館駅のまわりの宿に泊まりましょう。",
    },
  ],
  [ASAICHI]: [
    { from: "函館の朝を活気づける、海産物と農産物の市場です。", to: "函館駅前から歩いておよそ5分、函館朝市に着きます。函館の朝を活気づける、海産物と農産物の市場です。" },
    { from: "大沼・鹿部の自然を満喫した翌朝は", to: "大沼の自然を満喫した翌朝は" },
  ],
  [MASHU]: [
    {
      from: "この後は、歩いておよそ11分、金森赤レンガ倉庫へ向かいましょう。",
      to: "この後は、歩いておよそ19分、函館市地域交流まちづくりセンターへ向かいましょう。",
    },
  ],
  [MACHI]: [
    { from: "金森赤レンガ倉庫から歩いておよそ4分、", to: "青函連絡船記念館摩周丸から歩いておよそ19分、" },
    { from: "この後は、歩いておよそ8分、函館市北方民族資料館へ向かいましょう。", to: "この後は、歩いておよそ6分、金森赤レンガ倉庫へ向かいましょう。" },
  ],
  [KANEMORI]: [
    { from: "金森赤レンガ倉庫は、赤レンガ造りの倉庫群です。", to: "函館市地域交流まちづくりセンターから歩いておよそ6分、金森赤レンガ倉庫に着きます。赤レンガ造りの倉庫群です。" },
    { from: "食事処も多いので、ここで昼食にしましょう。", to: "食事処も多いので、買い物を楽しんだら、ここで昼食にしましょう。" },
    {
      from: "この後は、歩いておよそ4分、函館市地域交流まちづくりセンターへ向かいましょう。",
      to: "この後は、歩いておよそ8分、函館市北方民族資料館へ向かいましょう。",
    },
  ],
  [HOPPO]: [{ from: "函館市地域交流まちづくりセンターから歩いておよそ8分、", to: "金森赤レンガ倉庫から歩いておよそ8分、" }],
  [EIKOKU]: [{ from: "この後は、歩いておよそ3分、旧函館区公会堂へ向かいましょう。", to: "この後は、歩いておよそ4分、旧函館区公会堂へ向かいましょう。" }],
  [KOKAIDO]: [
    { from: "旧イギリス領事館から歩いておよそ3分、", to: "旧イギリス領事館から歩いておよそ4分、" },
    { from: "この後は、歩いておよそ5分、カトリック元町教会へ向かいましょう。", to: "この後は、歩いておよそ7分、カトリック元町教会へ向かいましょう。" },
  ],
  [MOTOMACHI]: [{ from: "旧函館区公会堂から歩いておよそ5分、", to: "旧函館区公会堂から歩いておよそ7分、" }],
  [HARISU]: [{ from: "この後は、歩いておよそ3分、八幡坂へ向かいましょう。", to: "この後は、歩いておよそ2分、八幡坂へ向かいましょう。" }],
  [HACHIMAN]: [
    { from: "函館ハリストス正教会から歩いておよそ3分、", to: "函館ハリストス正教会から歩いておよそ2分、" },
    { from: "この後は、歩いておよそ3分、函館市文学館へ向かいましょう。", to: "この後は、歩いておよそ6分、函館市文学館へ向かいましょう。" },
  ],
  [BUNGAKU]: [
    { from: "八幡坂から歩いておよそ3分、", to: "八幡坂から歩いておよそ6分、" },
    {
      from: "函館駅へ向かい、帰りの電車や飛行機に乗りましょう。",
      to: "歩いてすぐ（約1分）の末広町の電停から市電に乗り、函館駅前まで約8分。帰りの電車や飛行機に乗りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const PLAN: Plan = [
  { id: ONUMA, h: 11, m: 25, stay: 90, legs: [] },
  { id: YUURAN, h: 12, m: 59, stay: 50, legs: [walk(4)] },
  { id: GORYO, h: 14, m: 19, stay: 55, legs: [car(30)] },
  { id: BUGYO, h: 15, m: 17, stay: 35, legs: [walk(3)] },
  { id: TOWER, h: 15, m: 59, stay: 45, legs: [walk(7)] },
];
const DAY2: Plan = [
  { id: ASAICHI, h: 8, m: 30, stay: 50, legs: [] },
  { id: MASHU, h: 9, m: 24, stay: 40, legs: [walk(4)] },
  { id: MACHI, h: 10, m: 23, stay: 30, legs: [walk(19)] },
  { id: KANEMORI, h: 10, m: 59, stay: 70, legs: [walk(6)] },
  { id: HOPPO, h: 12, m: 17, stay: 45, legs: [walk(8)] },
  { id: EIKOKU, h: 13, m: 5, stay: 35, legs: [walk(3)] },
  { id: KOKAIDO, h: 13, m: 44, stay: 35, legs: [walk(4)] },
  { id: MOTOMACHI, h: 14, m: 26, stay: 20, legs: [walk(7)] },
  { id: YOHANE, h: 14, m: 48, stay: 20, legs: [walk(2)] },
  { id: HARISU, h: 15, m: 9, stay: 25, legs: [walk(1)] },
  { id: HACHIMAN, h: 15, m: 36, stay: 15, legs: [walk(2)] },
  { id: BUNGAKU, h: 15, m: 57, stay: 35, legs: [walk(6)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  if (it.seasons.join() !== SEASONS_FROM.join()) throw new Error("季節が想定と違います");
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [ONUMA, YUURAN, SHIKABE, GORYO, BUGYO, TOWER].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [ASAICHI, MASHU, KANEMORI, MACHI, HOPPO, EIKOKU, KOKAIDO, MOTOMACHI, YOHANE, HARISU, HACHIMAN, BUNGAKU].join())
    throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
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
  const show = (label: string, plan: Plan, spots: typeof d1.spots) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", PLAN, d1.spots);
  show("2日目（直したあと）", DAY2, d2.spots);
  console.log("\n外す: 鹿部間歇泉（1日目）");
  console.log(`季節: ${SEASONS_FROM.join(",")} → ${SEASONS_TO.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) => ({
      id: p.id,
      data: {
        ...timeLegs(p.h, p.m, p.stay, p.legs),
        ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}),
        ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
      },
    }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx, remove: [SHIKABE] });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: SEASONS_TO as never } });
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
