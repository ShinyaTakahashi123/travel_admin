/**
 * 初日・最終日の見直し #47 c97e2205「大仏さまと鹿、ならまちの町家。奈良の魅力を巡る旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a）
 * 1泊2日・電車・バスと歩き。初日を11時ごろからにする。2日目はもとから 16:31 に終わる（終わりは今より遅くしない）
 * もとは両日とも昼食・宿・帰りの一文がなく、座標は4けたの丸めや数百m違う点が多かった（般若寺 417m、唐招提寺 363m、平城宮跡は大極殿から約1km など）
 * 直した初日（8か所＋昼食。foot で測り直し）: 近鉄 大和西大寺駅に11時ごろ → 歩14（1,060m）→ 平城宮跡（第一次大極殿）11:14〜11:39 → 歩38（3,014m、もと20）→ 唐招提寺 12:17〜12:42 →
 *   歩11（863m）→【足す】西ノ京駅のあたりで昼食 12:53〜13:38（点＝バス停 node 1498189541「西ノ京駅」、362）→ 歩8（604m）→ 薬師寺 13:46〜14:16 → バス20（もとのまま）→ 元興寺 14:36〜15:01 →
 *   歩6 → ならまち格子の家 15:07〜15:22 → 歩7（548m、もと5）→ 今西家書院 15:29〜15:44 → 歩11（845m、もと7）→ 猿沢池（采女神社）15:55〜16:10 → 歩12（956m、もと10）→ 奈良国立博物館 16:22〜16:52（宿の一文）
 *   滞在はどれも、もとより短い（平城宮跡 50→25、唐招提寺 41→25、薬師寺 58→30、元興寺 67→25、格子 20→15、今西 25→15、猿沢池 20→15、博物館 90→30）。博物館は入館の締め切り前（16:30まで）に着く
 * 2日目（昼食のスポットを足す。終わりはもとと同じ16:31）: 春日大社（中門）9:00〜9:40 → 歩12（896m、もと10）→ 奈良公園（飛火野）9:52〜10:22 → 歩14（1,117m、もと5）→ 依水園 10:36〜11:10 →
 *   歩11（836m、もと5）→ 東大寺（大仏殿）11:21〜12:21 → 歩8（638m、もと5）→ 二月堂 12:29〜12:49 → 歩3（236m、もと8）→ 手向山八幡宮 12:52〜13:12 → 歩8（618m）→
 *   【足す】東大寺のあたりで昼食 13:20〜14:05（点＝案内板 node 3576148275「東大寺」）→ 歩11（846m。もとは手向山からバス12）→ 転害門 14:16〜14:36 → 歩15（1,127m、もと7）→ 北山十八間戸 14:51〜15:09 →
 *   歩7（558m）→ 般若寺 15:16〜16:31
 *   滞在はどれも、もと以下（春日 58→40、奈良公園 50→30、依水園 41→34、東大寺 84→60、二月堂 20、手向山 25→20、転害門 20、十八間戸 18、般若寺 75）
 *   1か所目に近鉄奈良駅から歩いて約26分（2,042m）、帰りの一文に般若寺のバス停まで約5分（366m）
 * 言葉: 祈りの一文でない「巡ってみてください」「拝観してください」「確かめてください」「味わってください」「眺めてみてください」「思いをはせてください」「散策してください」を「〜しましょう」に
 * 座標（メモに出てくる建物の点に）: 平城宮跡＝way 105145325「第一次大極殿」、唐招提寺＝way 293510586「金堂」、薬師寺＝way 293509277「東塔」、元興寺＝way 218642880（境内）の Nominatim（#15 奈良と同じ点にそろえる、法務 10/30）、
 *   猿沢池＝way 347480942「采女神社」（池の中心は水の上）、博物館＝way 921353198、春日大社＝way 1123268906「中門」（#15 は境内の way 1134481286 の中心＝約770×1,470m なので、#15 を中門にそろえるよう企画運営に伝えた）、奈良公園＝way 454304200「飛火野」、依水園＝way 97082272、
 *   東大寺＝way 43558119「大仏殿」、二月堂＝way 354993353（もとの点は依水園のそばで約700m違う）、手向山＝way 1134669588、転害門＝way 195840408、般若寺＝way 398722152「楼門」（メモの国宝の楼門）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-047-c97e2205.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c97e2205-85f0-449e-bb08-a071bc7a534e";
const DAY1_ID = "c7ef03a7-2bb7-47c1-91d3-de2176843dd7";
const DAY2_ID = "9773ee8f-d27a-4422-aa19-555b88c41248";
const HEIJO = "d149f341-11a8-4b47-9429-f6a16b921c12";
const TOSHODAIJI = "cdf26587-1731-4e47-b608-c84ffccf85ed";
const YAKUSHIJI = "5348a484-2281-4bb1-a91a-90cecd0639d7";
const GANGOJI = "59724769-d151-4d74-8f51-cfe136c643dd";
const KOSHI = "8fb74935-c56e-4482-b033-469e143ce689";
const IMANISHI = "d11fb06b-7dc3-4e20-9116-0eef204bb612";
const SARUSAWA = "262d9c06-cdd5-4af9-a96c-aff1c531df11";
const HAKUBUTSUKAN = "0145ea2a-5a23-4189-88dd-0346f13b8cd7";
const KASUGA = "b8f3d177-bfd1-4ae7-8532-ec37d3a7b51d";
const NARAKOEN = "5fab1708-1384-43ae-b3f3-96bb8a41f5bf";
const ISUIEN = "804a176f-5e40-4345-b6c1-3b45bdce239c";
const TODAIJI = "a0399fba-33d1-447f-afd6-862123a835ed";
const NIGATSUDO = "bb4341ef-0822-4fcb-b1df-395014f5681d";
const TAMUKEYAMA = "f7dbfca7-8509-4ce0-a35a-8e4d98c230d4";
const TEGAIMON = "7a1b4ebc-a504-4849-8942-4f41f288801f";
const KITAYAMA = "4fcf1204-c2e2-4d60-adde-60350e5a897d";
const HANNYAJI = "9750b971-6676-4edf-a0c7-3e2677af3d92";
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
  [HEIJO]: [
    {
      from: "1日目は、奈良時代の都の中心、平城宮跡歴史公園からです。",
      to: "この旅は電車・バスと歩きでめぐります。近鉄の大和西大寺駅に11時ごろ着いたら、歩いて約14分、第一次大極殿のあたりへ。1日目は、奈良時代の都の中心、平城宮跡歴史公園からです。",
    },
    { from: "興味のある場所を選んで巡ってみてください。", to: "興味のある場所を選んで巡ってみましょう。" },
  ],
  [TOSHODAIJI]: [
    { from: "平城宮跡歴史公園から歩いておよそ20分、", to: "平城宮跡歴史公園から歩いておよそ38分（近鉄で大和西大寺駅から西ノ京駅に向かう方法もあります）、" },
    { from: "静かに、敬意をもって拝観してください。続いては薬師寺へ向かいましょう。", to: "静かに、敬意をもって拝観しましょう。このあと、歩いておよそ11分の西ノ京駅のあたりで昼食にしましょう。" },
  ],
  [YAKUSHIJI]: [
    { from: "唐招提寺から歩いておよそ15分、", to: "昼食のあと、西ノ京駅から歩いておよそ8分、" },
    { from: "静かに、敬意をもって拝観してください。", to: "静かに、敬意をもって拝観しましょう。" },
  ],
  [GANGOJI]: [{ from: "静かに、敬意をもって拝観してください。", to: "静かに、敬意をもって拝観しましょう。" }],
  [IMANISHI]: [
    { from: "ならまち格子の家から歩いておよそ5分、", to: "ならまち格子の家から歩いておよそ7分、" },
    { from: "事前に公式で確かめてください。", to: "事前に公式の案内で確かめましょう。" },
  ],
  [SARUSAWA]: [{ from: "今西家書院から歩いておよそ7分、", to: "今西家書院から歩いておよそ11分、" }],
  [HAKUBUTSUKAN]: [
    { from: "猿沢池から歩いておよそ10分、", to: "猿沢池から歩いておよそ12分、" },
    { from: "奈良の仏教美術の奥深さを味わってください。", to: "奈良の仏教美術の奥深さを味わいましょう。入館の締め切りは閉館の少し前なので、公式の案内で確かめましょう。この夜は、奈良の宿に泊まりましょう。" },
  ],
  [KASUGA]: [{ from: "2日目は、世界遺産にも登録されている春日大社からです。", to: "2日目は、近鉄奈良駅から歩いて約26分、世界遺産にも登録されている春日大社からです。" }],
  [NARAKOEN]: [{ from: "春日大社から歩いておよそ10分、", to: "春日大社から歩いておよそ12分、" }],
  [ISUIEN]: [{ from: "奈良公園から歩いておよそ5分、", to: "奈良公園の飛火野から歩いておよそ14分、" }],
  [TODAIJI]: [
    { from: "依水園から歩いておよそ5分、", to: "依水園から歩いておよそ11分、" },
    { from: "堂々とした姿を眺めてみてください。", to: "堂々とした姿を眺めてみましょう。" },
  ],
  [NIGATSUDO]: [{ from: "東大寺の大仏殿から歩いておよそ5分、", to: "東大寺の大仏殿から歩いておよそ8分、" }],
  [TAMUKEYAMA]: [
    { from: "二月堂から歩いておよそ8分、", to: "二月堂から歩いておよそ3分、" },
    { from: "続いては転害門へ向かいましょう。", to: "このあと、歩いておよそ8分の東大寺のあたりで昼食にしましょう。" },
  ],
  [TEGAIMON]: [
    { from: "手向山八幡宮からバスでおよそ12分、", to: "昼食のあと、歩いておよそ11分、" },
    { from: "この後は、歩いておよそ7分、北山十八間戸へ向かいましょう。", to: "この後は、歩いておよそ15分、北山十八間戸へ向かいましょう。" },
  ],
  [KITAYAMA]: [
    { from: "転害門から歩いておよそ7分、", to: "転害門から歩いておよそ15分、" },
    { from: "その歴史に思いをはせてください。", to: "その歴史に思いをはせましょう。" },
  ],
  [HANNYAJI]: [
    {
      from: "2日間の旅の締めくくりに境内をゆっくりと散策してください。",
      to: "2日間の旅の締めくくりに境内をゆっくりと散策しましょう。帰りは、歩いて約5分の般若寺のバス停から、バスで近鉄奈良駅やJR奈良駅の方面へ戻りましょう。",
    },
  ],
};

const LUNCH1 = {
  name: "西ノ京駅のあたりで昼食",
  lat: 34.669319,
  lng: 135.782999,
  address: "奈良県奈良市西ノ京町",
  memo: "唐招提寺から歩いて約11分。西ノ京駅のあたりで、昼食にしましょう。",
  h: 12,
  m: 53,
  stay: 45,
  legs: [walk(11)] as Leg[],
};
const LUNCH2 = {
  name: "東大寺のあたりで昼食",
  lat: 34.687499,
  lng: 135.839814,
  address: "奈良県奈良市雑司町",
  memo: "手向山八幡宮から歩いて約8分。東大寺のあたりで、昼食にしましょう。",
  h: 13,
  m: 20,
  stay: 45,
  legs: [walk(8)] as Leg[],
};

type P = { id: string; h: number; m: number; stay: number; legs: Leg[] };
const PLAN: P[] = [
  { id: HEIJO, h: 11, m: 14, stay: 25, legs: [] },
  { id: TOSHODAIJI, h: 12, m: 17, stay: 25, legs: [walk(38)] },
  { id: YAKUSHIJI, h: 13, m: 46, stay: 30, legs: [walk(8)] },
  { id: GANGOJI, h: 14, m: 36, stay: 25, legs: [] },
  { id: KOSHI, h: 15, m: 7, stay: 15, legs: [walk(6)] },
  { id: IMANISHI, h: 15, m: 29, stay: 15, legs: [walk(7)] },
  { id: SARUSAWA, h: 15, m: 55, stay: 15, legs: [walk(11)] },
  { id: HAKUBUTSUKAN, h: 16, m: 22, stay: 30, legs: [walk(12)] },
];
const DAY2: P[] = [
  { id: KASUGA, h: 9, m: 0, stay: 40, legs: [] },
  { id: NARAKOEN, h: 9, m: 52, stay: 30, legs: [walk(12)] },
  { id: ISUIEN, h: 10, m: 36, stay: 34, legs: [walk(14)] },
  { id: TODAIJI, h: 11, m: 21, stay: 60, legs: [walk(11)] },
  { id: NIGATSUDO, h: 12, m: 29, stay: 20, legs: [walk(8)] },
  { id: TAMUKEYAMA, h: 12, m: 52, stay: 20, legs: [walk(3)] },
  { id: TEGAIMON, h: 14, m: 16, stay: 20, legs: [walk(11)] },
  { id: KITAYAMA, h: 14, m: 51, stay: 18, legs: [walk(15)] },
  { id: HANNYAJI, h: 15, m: 16, stay: 75, legs: [walk(7)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: HEIJO, from: [34.6851, 135.7956], to: [34.693933, 135.794242] },
  { id: TOSHODAIJI, from: [34.6772, 135.7889], to: [34.675565, 135.784831] },
  { id: YAKUSHIJI, from: [34.6689, 135.7867], to: [34.668135, 135.784696] },
  { id: GANGOJI, from: [34.6791, 135.832], to: [34.677632, 135.831319] },
  { id: SARUSAWA, from: [34.681436, 135.830949], to: [34.681848, 135.830213] },
  { id: HAKUBUTSUKAN, from: [34.6828, 135.8394], to: [34.683096, 135.838311] },
  { id: KASUGA, from: [34.6813, 135.8481], to: [34.681491, 135.848472] },
  { id: NARAKOEN, from: [34.6851, 135.843], to: [34.680739, 135.840835] },
  { id: ISUIEN, from: [34.687, 135.8408], to: [34.685466, 135.837919] },
  { id: TODAIJI, from: [34.6889, 135.8398], to: [34.689065, 135.839873] },
  { id: NIGATSUDO, from: [34.686146, 135.838135], to: [34.689275, 135.844268] },
  { id: TAMUKEYAMA, from: [34.687853, 135.844722], to: [34.687852, 135.844721] },
  { id: TEGAIMON, from: [34.691627, 135.835073], to: [34.691627, 135.835072] },
  { id: HANNYAJI, from: [34.701, 135.8317], to: [34.699729, 135.835592] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  // 薬師寺→元興寺のバス20分はもとのまま
  PLAN[3].legs = all.find((s) => s.id === GANGOJI)!.transitLegs.map((l) => ({ mode: l.transitMode as Leg["mode"], min: l.transitDurationMin ?? 0, line: l.transitLine ?? undefined }));
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
      return { ...p, name: s.name, orig: `${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分`, edits: (MEMO_EDITS[p.id] ?? []).map((e) => e.to) };
    });
  const rows1 = rowsOf(PLAN, d1.spots);
  rows1.splice(2, 0, { ...LUNCH1, orig: "足す", edits: [LUNCH1.memo] });
  const rows2 = rowsOf(DAY2, d2.spots);
  rows2.splice(6, 0, { ...LUNCH2, orig: "足す", edits: [LUNCH2.memo] });
  show("1日目（直したあと）", rows1);
  show("2日目（直したあと）", rows2);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const item = (p: P) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } });
  const create = (x: typeof LUNCH1) => ({
    create: { name: x.name, visitTime: t(x.h, x.m), stayDurationMin: x.stay, transitLegs: { create: legsCreate(x.legs) }, lat: x.lat, lng: x.lng, address: x.address, memo: x.memo },
  });
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, [...PLAN.slice(0, 2).map(item), create(LUNCH1), ...PLAN.slice(2).map(item)] as never, { tx });
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
