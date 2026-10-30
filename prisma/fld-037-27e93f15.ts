/**
 * 初日・最終日の見直し #37 27e93f15「金鱗湖の朝霧と由布院温泉、別府の地獄めぐりへ 冬の湯どころ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 18:38、#37〜#44 は制作補助2）
 * 歩きは routed-foot、車は OSRM（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 由布院駅 10:45（30→20）→ 歩11（817m。もと10）→ COMICO ART MUSEUM 11:16（60→40）→ 歩9（590m、もとのまま）→ 湯の坪街道 12:05（60→30）→ 歩8（574m。もと2）→
 *   天祖神社 12:43（25→20）→ 歩8（557m。もと7）→ 由布院フローラルヴィレッジ 13:11〜14:01（昼食、90→50。まわりに OSM の食事処・カフェの点が24）→ 歩23（1,721m。もと15）→
 *   宇奈岐日女神社 14:24（40→30）→ 歩8（590m。もと5）→ 由布院ステンドグラス美術館 15:02（50→40）→ 歩18（1,333m。もと16）→ 大杵社 16:00〜16:30（40→30）→
 *   歩17（1,293m）で由布院駅のまわりの宿
 * 2日目（16:35 に出るのはもとのまま。もとは 7:00 始まりで、決まりの 8:30〜9:30 に合わせて 8:30 に）: 宿 → 歩20（1,496m）→ 金鱗湖 8:30（65→35）→ 歩1 → 下ん湯 9:06（25→20）→
 *   歩20で由布院駅＋レンタカー（手続き15分）＋車11（5.6）＝46（もとは「手続きを含めて38」）→ 狭霧台 10:12（45→25）→ 車9（6.3）→ アルテジオ 10:46（55→35）→
 *   車28（22.5。もと40）→ 明礬温泉 湯の花小屋 11:49（25→20）→ 車8（3.7）→ 海地獄 12:17（30）→ 歩5（355m。もと2）→ 鬼石坊主地獄 12:52（15）→ 歩11（826m。もと8）→
 *   地獄蒸し工房鉄輪 13:18〜14:08（昼食、50）→ 歩6（419m。もと5）→ かまど地獄 14:14（20）→ 歩2 → 鬼山地獄 14:36（20）→ 歩2 → 白池地獄 14:58（20→15）→
 *   歩9（642m）で海地獄の車＋車10（4.3。もと車5）→ 血の池地獄 15:32（35→25）→ 歩5 → 龍巻地獄 16:02〜16:35（45→33）→ 歩2で車＋車15（9.6）で別府駅、レンタカーを返す（15分）
 * 点: 湯の坪街道＝OSM「湯之坪街道」way 414647390（いまは宿の食事処の点）／フローラルヴィレッジ＝OSM「湯布院フローラルビレッジ」attraction way 1323836250（いまは別の店の建物）／
 *   金鱗湖＝pond way 162781794 の node 1746033237（ほかのしおり 9da78e5d と同じ。いまは度分秒の秒の形）／海地獄・鬼石坊主地獄・龍巻地獄＝OSM の spring の way
 *   （418202285・417893190・1359597113。いまは券売所・駐車場の点。鬼石・龍巻はほかのしおり 9c656920 と同じ）
 * アルテジオのメモの宿の名前（決まり329）を外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-037-27e93f15.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "27e93f15-8dbe-4e72-81d5-7bcde9231b4e";
const DAY1_ID = "ede500a0-2990-4990-8871-ef29d2056d90";
const DAY2_ID = "2700c2c5-2075-490a-a502-d17a1d4f004a";
const EKI = "ed65cc48-464e-4b14-aa61-a8adb46d4426";
const COMICO = "f941000c-0be8-4cd8-8c48-a807b3b86fc0";
const YUNO = "e1497db9-5d65-4abd-8f4c-774bbf45b22e";
const TENSO = "dce8d43f-6ac7-4390-a8ca-6bc28ff37717";
const FLORAL = "4cca95e3-f128-4b90-99f6-c3d04c362c42";
const UNAGI = "7add311e-aa32-4415-b20f-8691f7da20be";
const STAIN = "bdb2e3bf-f55e-4c65-8b9d-498f9594fb4d";
const OKI = "bfabbeec-a1f9-445e-ad23-474e80e76877";
const KIN = "7133984e-afce-4a38-a4c0-551ce9018f51";
const SHITA = "564db84b-cef1-4048-b295-6d7e5cabe533";
const SAGIRI = "2b3fcdbc-ca21-46b1-a0d1-27fb0c7ef97a";
const ARTE = "99d00c45-5eb0-4614-8c05-ecb69c412cde";
const YUNOHANA = "72056d2e-17a9-4f5b-bcc7-d135a88cfa8c";
const UMI = "596d7172-5a7c-4c12-91ac-cf3758cace64";
const ONI = "e24b33bb-15a9-43bf-a141-3ad5cf9d3cdb";
const MUSHI = "a5c73cf4-07f2-4a07-9a01-1a4ce7ddf1b7";
const KAMADO = "13af711a-5379-4917-821c-bb0c51207a46";
const ONIYAMA = "ebaa09b1-2241-4ec7-9155-1f892107e59a";
const SHIRA = "e2f25a9b-a10a-48a2-af77-6267c3032686";
const CHI = "2b9f84d2-b507-48ce-ae1f-0c4180a77018";
const TATSU = "14c356b3-fc47-4930-a295-a4b31cddeab7";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [YUNO]: { from: [33.26603, 131.36861], to: [33.268085, 131.366221] },
  [FLORAL]: { from: [33.267345, 131.365128], to: [33.267514, 131.365641] },
  [KIN]: { from: [33.266667, 131.369167], to: [33.267207, 131.368854] },
  [UMI]: { from: [33.315888, 131.469683], to: [33.31683, 131.468733] },
  [ONI]: { from: [33.31539, 131.470055], to: [33.315183, 131.469033] },
  [TATSU]: { from: [33.327579, 131.480755], to: [33.326992, 131.479438] },
};

const PRAY_FROM = "静かに、敬意をもってお参りください。";
const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [EKI]: [
    { from: "1日目は、建築家・磯崎新氏が設計した由布院駅からです。", to: "JR由布院駅に10時45分ごろ着いたら、1日目は、建築家・磯崎新氏が設計した由布院駅の駅舎からです。" },
    { from: "この後は、歩いておよそ10分、", to: "この後は、歩いておよそ11分、" },
  ],
  [COMICO]: [{ from: "由布院駅から歩いておよそ10分、", to: "由布院駅から歩いておよそ11分、" }],
  [TENSO]: [
    { from: "湯の坪街道から歩いておよそ2分、", to: "湯の坪街道から歩いておよそ8分、" },
    { from: PRAY_FROM, to: PRAY_TO },
    { from: "この後は、歩いておよそ7分、", to: "この後は、歩いておよそ8分、" },
  ],
  [FLORAL]: [
    { from: "天祖神社から歩いておよそ7分、", to: "天祖神社から歩いておよそ8分、" },
    { from: "ゆっくりと散策してみてください。", to: "ゆっくりと散策しましょう。" },
    { from: "軽食を楽しめるお店もあるので、ここでお昼をとるのもおすすめです。", to: "軽食を楽しめるお店もあるので、ここで昼食をとりましょう。" },
  ],
  [UNAGI]: [
    { from: "由布院フローラルヴィレッジから歩いておよそ15分、", to: "由布院フローラルヴィレッジから歩いておよそ23分、" },
    { from: PRAY_FROM, to: PRAY_TO },
  ],
  [STAIN]: [
    { from: "宇奈岐日女神社から歩いておよそ5分、", to: "宇奈岐日女神社から歩いておよそ8分、" },
    { from: "この後は、歩いておよそ16分、", to: "この後は、歩いておよそ18分、" },
  ],
  [OKI]: [
    { from: "由布院ステンドグラス美術館から歩いておよそ16分、", to: "由布院ステンドグラス美術館から歩いておよそ18分、" },
    { from: PRAY_FROM, to: PRAY_TO },
    { from: "今夜は由布院の宿でゆっくりお休みください。", to: "この夜は、歩いておよそ17分の由布院駅のまわりの宿に泊まりましょう。" },
  ],
  [KIN]: [
    { from: "2日目は金鱗湖からです。", to: "由布院駅のまわりの宿から歩いておよそ20分、2日目は金鱗湖からです。" },
    { from: "湖畔を、ゆっくりと歩いてみてください。", to: "湖畔を、ゆっくりと歩きましょう。" },
  ],
  [SHITA]: [
    { from: "金鱗湖のほとりから歩いてすぐ、", to: "金鱗湖のほとりから歩いておよそ1分、" },
    { from: "湯につかってひとときを過ごしてみてください。", to: "湯につかってひとときを過ごしましょう。" },
    {
      from: "この後は、由布院駅の近くでレンタカーを借りて、車で狭霧台へ向かいましょう。",
      to: "この後は、歩いておよそ20分で由布院駅へ戻り、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ11分、狭霧台へ向かいましょう。",
    },
  ],
  [SAGIRI]: [{ from: "下ん湯から、レンタカーの手続きを含めておよそ38分、", to: "下ん湯から、レンタカーの手続きを含めておよそ46分、" }],
  [ARTE]: [
    { from: "宿「山荘無量塔」の敷地内にある美術館で、", to: "美術館で、" },
    { from: "この後は、車でおよそ40分、", to: "この後は、車でおよそ28分、" },
  ],
  [YUNOHANA]: [
    { from: "由布院空想の森アルテジオから車でおよそ40分、", to: "由布院空想の森アルテジオから車でおよそ28分、" },
    { from: "暮らしにふれてみてください。", to: "暮らしにふれましょう。" },
  ],
  [UMI]: [{ from: "この後は、歩いておよそ2分、鬼石坊主地獄へ向かいましょう。", to: "この後は、歩いておよそ5分、鬼石坊主地獄へ向かいましょう。" }],
  [ONI]: [
    { from: "海地獄から歩いておよそ2分、", to: "海地獄から歩いておよそ5分、" },
    { from: "この後は、歩いておよそ8分、", to: "この後は、歩いておよそ11分、" },
  ],
  [MUSHI]: [
    { from: "鬼石坊主地獄から歩いておよそ8分、", to: "鬼石坊主地獄から歩いておよそ11分、" },
    { from: "蒸し布や器具を扱ってください。", to: "蒸し布や器具を扱いましょう。" },
    { from: "この後は、歩いておよそ5分、", to: "この後は、歩いておよそ6分、" },
  ],
  [KAMADO]: [
    { from: "地獄蒸し工房鉄輪から歩いておよそ5分、", to: "地獄蒸し工房鉄輪から歩いておよそ6分、" },
    { from: "この後は、歩いてすぐ、", to: "この後は、歩いておよそ2分、" },
  ],
  [ONIYAMA]: [
    { from: "かまど地獄から歩いてすぐ、", to: "かまど地獄から歩いておよそ2分、" },
    { from: "生態展示を楽しんでみてください。", to: "生態展示を楽しみましょう。" },
  ],
  [SHIRA]: [
    { from: "この後は、車でおよそ5分、血の池地獄へ向かいましょう。", to: "この後は、歩いておよそ9分で海地獄にとめた車に戻り、車でおよそ10分、血の池地獄へ向かいましょう。" },
  ],
  [CHI]: [{ from: "白池地獄から車でおよそ5分、", to: "白池地獄から歩いておよそ9分で車に戻り、車でおよそ10分、" }],
  [TATSU]: [
    { from: "噴出の瞬間を待ってみてください。", to: "噴出の瞬間を待ちましょう。" },
    {
      from: "帰りは車で別府駅・大分空港方面へ向かい、レンタカーを返却しましょう。",
      to: "見学を終えたら、歩いておよそ2分で血の池地獄の駐車場の車に戻り、車でおよそ15分の別府駅の近くでレンタカーを返しましょう（返す手続きに15分ほど）。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: EKI, h: 10, m: 45, stay: 20, legs: [] },
  { id: COMICO, h: 11, m: 16, stay: 40, legs: [walk(11)] },
  { id: YUNO, h: 12, m: 5, stay: 30, legs: [walk(9)] },
  { id: TENSO, h: 12, m: 43, stay: 20, legs: [walk(8)] },
  { id: FLORAL, h: 13, m: 11, stay: 50, legs: [walk(8)] },
  { id: UNAGI, h: 14, m: 24, stay: 30, legs: [walk(23)] },
  { id: STAIN, h: 15, m: 2, stay: 40, legs: [walk(8)] },
  { id: OKI, h: 16, m: 0, stay: 30, legs: [walk(18)] },
];
const DAY2: Plan = [
  { id: KIN, h: 8, m: 30, stay: 35, legs: [] },
  { id: SHITA, h: 9, m: 6, stay: 20, legs: [walk(1)] },
  { id: SAGIRI, h: 10, m: 12, stay: 25, legs: [walk(20), other(15, "レンタカーの手続き"), car(11)] },
  { id: ARTE, h: 10, m: 46, stay: 35, legs: [car(9)] },
  { id: YUNOHANA, h: 11, m: 49, stay: 20, legs: [car(28)] },
  { id: UMI, h: 12, m: 17, stay: 30, legs: [car(8)] },
  { id: ONI, h: 12, m: 52, stay: 15, legs: [walk(5)] },
  { id: MUSHI, h: 13, m: 18, stay: 50, legs: [walk(11)] },
  { id: KAMADO, h: 14, m: 14, stay: 20, legs: [walk(6)] },
  { id: ONIYAMA, h: 14, m: 36, stay: 20, legs: [walk(2)] },
  { id: SHIRA, h: 14, m: 58, stay: 15, legs: [walk(2)] },
  { id: CHI, h: 15, m: 32, stay: 25, legs: [walk(9), car(10)] },
  { id: TATSU, h: 16, m: 2, stay: 33, legs: [walk(5)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  console.log(`下ん湯→狭霧台のもとの移動: ${all.find((x) => x.id === SAGIRI)!.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}(${l.transitLine ?? ""})`).join("+")}`);
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
  for (const s of all) {
    const m = memos[s.id] ?? s.memo ?? "";
    for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ、", "無量塔", "ホテル", "旅館"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
  }
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）${p.stay > (s.stayDurationMin ?? 0) ? " ⚠滞在がもとより長い" : ""}`);
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
