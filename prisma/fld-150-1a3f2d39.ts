/**
 * 初日・最終日の見直し #150 1a3f2d39「櫛田神社と中洲屋台、博多の伝統と活気を巡る旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。企画運営 10/30「A」: 説明文の書き直し、2日目の移動の誤りと短い行き方の書き出し、重なった文・「ください」・宿の一文・座標まで直す。
 *   2日目のメモの中身を厚くするのは範囲外（チェックリストに「2日目のメモが薄い（あとで書き足し）」）
 * 座標（itinerary-rules 7章。名前のある地物、なければ地理院の番地）:
 *   櫛田神社 → way 45779975／博多町家ふるさと館 → OSM になし。地理院「上川端町6番」／川端通商店街 → node 5001667124「川端商店街」／住吉神社 → way 45779271（約370m）／
 *   キャナルシティ博多 → way 751001483／天神 → node 3555317380（place=quarter）／アクロス福岡 → way 33111546（約250m）／
 *   福岡城跡 → node 4968414505「大天守台跡」（公園の中心は使わない）／大濠公園 → 池の中の way 210616055「浮見堂」（法務 10/30。町の名前の点・公園の中心は使わない）／福岡タワー → way 772670439／
 *   福岡市博物館 → way 210616030（約540m）／能古島 → 島の中心ではなく、メモの「花と自然」のアイランドパークの node 13264962470「アイランドパーク チケット売り場」
 * 1日目（7か所のまま）: JR博多駅に11時ごろ → 歩いて約17分 → 櫛田神社 11:17 → ふるさと館 → 川端通商店街 → キャナルシティ（昼食 12:45〜）→ 住吉神社 → 天神 → アクロス福岡 15:44〜16:30
 *   昼食を13:30までにするため、キャナルシティを住吉神社の前にする
 *   歩き（道のり。routing.openstreetmap.de の foot）: 駅→櫛田 1,246m・17分、櫛田→ふるさと館 271m・4分、ふるさと館→川端 257m・4分、川端→キャナル 356m・5分、キャナル→住吉 740m・10分、
 *     住吉→天神 1,660m・22分、天神→アクロス 523m・7分
 * 2日目（5か所のまま。終わりは16:30で今と同じ）: 移動を道のりに直し、昼食を足す
 *   福岡城跡（大天守台跡）→大濠公園（浮見堂）1,438m・19分（5→19）、大濠公園→福岡タワー（大濠公園駅へ 628m・9分＋地下鉄空港線で西新 5分＋西新駅から 1,761m・24分＝38分。15→38）、
 *   福岡タワーのあとに昼食45分、タワー→博物館 666m・9分（5→9）、
 *   博物館→能古島（もとは「train20」）: 博物館北口から西鉄バスで能古渡船場（車で3.8km、約12分）＋市営渡船 約10分（待ちを入れて15分）＋島のバスでアイランドパーク（車で2.9km、約15分）＝あわせて約50分
 *   滞在はどれも、もとより短い（福岡城跡 70→51分、大濠 70→52分、タワー 70→50分、博物館 70→50分、能古島 125→88分）
 * 文: 重なった書き出しを、前のスポットからの時間の文に直す。「ください」2か所、「ランチや休憩にもぴったり」、宿の一文
 * 説明文: 実際の行き先に合わせて1日目を書き直す（タイトルの櫛田神社・中洲の屋台を入れる）
 * タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-150-1a3f2d39.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "1a3f2d39-810f-4662-a2c0-b1751331a3ed";
const DAY1_ID = "157e6384-0e31-4241-973d-322fd0c5476e";
const DAY2_ID = "1e0fa076-b82d-463a-b220-11da57d9df58";
const KUSHIDA = "ecf87309-2f85-4c0f-abdc-815d102365fd";
const FURUSATO = "58514bfc-e60a-442a-bf17-a550ec338f40";
const KAWABATA = "a4677605-6abc-41b7-a580-7eccc0f763bb";
const SUMIYOSHI = "719d6a93-2d0b-42db-ac2e-11d5546b3d62";
const CANAL = "4dc1e7d6-0f9a-4c83-8456-197e2b9cb29c";
const TENJIN = "dbdcf308-4d35-4c4a-9137-a7c095644834";
const ACROS = "bceddf90-7db7-405e-9dc5-db49412a9a0e";
const CASTLE = "1e1d67b3-2350-43c2-8c6d-dc7a735a4e82";
const OHORI = "2043350e-d546-4623-b78d-e11001cb5864";
const TOWER = "296bf0be-1dfb-4bb7-ab03-7db93a456566";
const MUSEUM = "921c2d13-e8f3-47cd-a49a-229983ebee1c";
const NOKO = "5185f70d-3e29-477e-b2eb-c41eb5606a5f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[]; gap?: number }[];
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const DESC_FROM = "1日目はベイサイドプレイス博多や博多駅、住吉神社、川端通商店街、天神を巡り、";
const DESC_TO =
  "1日目は博多の総鎮守・櫛田神社から、博多町家ふるさと館、川端通商店街、キャナルシティ博多、住吉神社、天神とアクロス福岡を歩き、日が暮れると屋台が並ぶ中洲の川沿いへ。";
const DESC_FROM2 = "2日目は福岡城跡の舞鶴公園から";
const DESC_TO2 = "2日目は福岡城跡の舞鶴公園から";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KUSHIDA]: [
    {
      from: "本日は、博多の総鎮守・櫛田神社からスタートです。",
      to: "この旅は歩きと地下鉄・バス・船でめぐります。JR博多駅に11時ごろ着いたら、歩いて約17分。博多の総鎮守・櫛田神社からスタートです。",
    },
  ],
  [KAWABATA]: [{ from: "商店街を歩いたら、歩いて住吉神社へ向かいましょう。", to: "商店街を歩いたら、歩いてキャナルシティ博多へ向かいましょう。" }],
  [CANAL]: [
    { from: "住吉神社を参拝したら、歩いてキャナルシティ博多へ向かいましょう。", to: "川端通商店街から歩いて約5分。" },
    { from: "個性的な外観の建物が立ち並ぶ館内には飲食店も多く、ランチや休憩にもぴったりです。", to: "個性的な外観の建物が立ち並ぶ館内には飲食店も多いので、ここで昼食にしましょう。" },
    { from: "見学を終えたら、歩いて天神へ向かいましょう。", to: "昼食のあとは、歩いて住吉神社へ向かいましょう。" },
  ],
  [SUMIYOSHI]: [
    { from: "川端通商店街を歩いたら、歩いて住吉神社へ向かいましょう。", to: "キャナルシティ博多から歩いて約10分。" },
    { from: "参拝を終えたら、歩いてキャナルシティ博多へ向かいましょう。", to: "参拝を終えたら、歩いて天神へ向かいましょう。" },
  ],
  [TENJIN]: [{ from: "キャナルシティ博多を出たら、歩いて天神へ向かいましょう。", to: "住吉神社から歩いて約22分。" }],
  [ACROS]: [
    { from: "天神を歩いたら、歩いてアクロス福岡へ向かいましょう。", to: "天神から歩いて約7分。" },
    // 企画運営 10/30: 説明文・タイトルの中洲の屋台とつなぐ。アクロス福岡→中洲の清流公園あたり 963m（routing.openstreetmap.de の foot）
    { from: "日が暮れると、中洲の川沿いには屋台がずらりと並びます。", to: "日が暮れると、アクロス福岡から歩いて13分ほどの中洲の川沿いに、屋台がずらりと並びます。" },
    { from: "現地や公式の案内で確かめてください。", to: "現地や公式の案内で確かめましょう。" },
    { from: "飲んだら運転はしないでください。", to: "飲んだら運転はしないようにしましょう。" },
    { from: "博多の伝統と活気を巡る本日の旅は、ここまでです。", to: "この夜は、博多の宿に泊まりましょう。" },
  ],
  // 2日目: 短い行き方の書き出しを足す（中身は今回は範囲外）
  [CASTLE]: [{ from: "黒田長政が築いた城の跡地。", to: "2日目は、地下鉄空港線の大濠公園駅から歩いて、福岡城跡の大天守台跡へ。黒田長政が築いた城の跡地。" }],
  [OHORI]: [{ from: "大きな池を中心に整備された、市民の憩いの都市公園。", to: "福岡城跡から歩いて約19分。大きな池を中心に整備された、市民の憩いの都市公園。" }],
  [TOWER]: [
    {
      from: "海浜タワーとしては日本一の高さとされる、",
      to: "大濠公園駅から地下鉄空港線で西新駅へ行き、歩いて約24分（あわせて約38分）。海浜タワーとしては日本一の高さとされる、",
    },
    { from: "夕暮れ時には美しく輝きます。", to: "夕暮れ時には美しく輝きます。タワーのまわりで昼食にしましょう。" },
  ],
  [MUSEUM]: [{ from: "国宝「金印」を収蔵する、", to: "福岡タワーから歩いて約9分。国宝「金印」を収蔵する、" }],
  [NOKO]: [
    {
      from: "フェリーで10分。",
      to: "博物館北口のバス停から西鉄バスで能古渡船場へ行き、市営渡船で約10分、島のバスでのこのしまアイランドパークへ（あわせて約50分）。船とバスの時刻は、公式の案内で確かめましょう。帰りは、船で姪浜へ戻りましょう。",
    },
  ],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: KUSHIDA, from: [33.593357, 130.411011], to: [33.59307, 130.410684] },
  { id: FURUSATO, from: [33.593704, 130.410461], to: [33.593712, 130.409622] },
  { id: KAWABATA, from: [33.5928, 130.4106], to: [33.592553, 130.410226] },
  { id: SUMIYOSHI, from: [33.5878, 130.4103], to: [33.585754, 130.413435] },
  { id: CANAL, from: [33.589966, 130.411606], to: [33.589672, 130.411141] },
  { id: TENJIN, from: [33.5906, 130.3986], to: [33.590323, 130.399839] },
  { id: ACROS, from: [33.589542, 130.403717], to: [33.591488, 130.402445] },
  { id: CASTLE, from: [33.5883, 130.3806], to: [33.584368, 130.383077] },
  { id: OHORI, from: [33.5878, 130.3789], to: [33.58778, 130.375592] },
  { id: TOWER, from: [33.5933, 130.3511], to: [33.593274, 130.351486] },
  { id: MUSEUM, from: [33.5928, 130.3486], to: [33.589734, 130.353073] },
  { id: NOKO, from: [33.622399, 130.305875], to: [33.63153, 130.301762] },
];

const DAY1_PLAN: Plan = [
  { id: KUSHIDA, h: 11, m: 17, stay: 30, legs: [] },
  { id: FURUSATO, h: 11, m: 51, stay: 25, legs: [walk(4)] },
  { id: KAWABATA, h: 12, m: 20, stay: 20, legs: [walk(4)] },
  { id: CANAL, h: 12, m: 45, stay: 65, legs: [walk(5)] },
  { id: SUMIYOSHI, h: 14, m: 0, stay: 30, legs: [walk(10)] },
  { id: TENJIN, h: 14, m: 52, stay: 45, legs: [walk(22)] },
  { id: ACROS, h: 15, m: 44, stay: 46, legs: [walk(7)] },
];
const DAY2_PLAN: Plan = [
  { id: CASTLE, h: 9, m: 0, stay: 51, legs: [] },
  { id: OHORI, h: 10, m: 10, stay: 52, legs: [walk(19)] },
  { id: TOWER, h: 11, m: 40, stay: 50, legs: [walk(9), train(5, "福岡市地下鉄空港線（大濠公園→西新）"), walk(24)] },
  { id: MUSEUM, h: 13, m: 24, stay: 50, legs: [walk(9)], gap: 45 },
  {
    id: NOKO,
    h: 15,
    m: 2,
    stay: 88,
    legs: [walk(6), bus(12, "西鉄バス（博物館北口→能古渡船場）"), other(15, "福岡市営渡船（姪浜→能古）"), bus(15, "西鉄バス（能古渡船場→アイランドパーク）")],
  },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KUSHIDA, FURUSATO, KAWABATA, SUMIYOSHI, CANAL, TENJIN, ACROS].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_PLAN.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const desc0 = it.description ?? "";
  if (desc0.split(DESC_FROM).length !== 2 || desc0.split(DESC_FROM2).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const description = desc0.replace(DESC_FROM, DESC_TO).replace(DESC_FROM2, DESC_TO2);
  const all = [...d1.spots, ...d2.spots];
  const memoOf = (id: string) => {
    let m = all.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const build = (plan: Plan) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  const days: [string, Plan][] = [
    ["1日目", DAY1_PLAN],
    ["2日目", DAY2_PLAN],
  ];
  for (const [label, plan] of days) {
    console.log(`\n${label}（直したあと）`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0) + (p.gap ?? 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${p.gap ? `（その前に昼食${p.gap}分）` : ""}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
      prevEnd = st + p.stay;
    }
  }
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log(`\n説明文（直したあと）: ${description}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, build(DAY1_PLAN) as never, { tx });
      await setDaySpotOrder(DAY2_ID, build(DAY2_PLAN) as never, { tx });
      for (const c of COORDS) await tx.spot.update({ where: { id: c.id }, data: { lat: c.to[0], lng: c.to[1] } });
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
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
