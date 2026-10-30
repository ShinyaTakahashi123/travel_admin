/**
 * 初日・最終日の見直し #57 9da78e5d「由布岳登山と宇奈岐日女神社、由布院の自然をじっくり楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目。企画運営・法務 10/30 の判断）
 * 車の分数は OSRM（もとの値は ×1.5＋5 の内側ならそのまま。新しい区間は切り上げ＋5）。歩きは routed-foot
 * 1日目: 由布院駅 10:30ごろ → レンタカー（手続き15分）→ 車15（OSRM 7.1、もとのまま）→ 由布岳 11:00〜13:30（説明文どおり中腹の合野越までの往復。
 *   由布市の登山マップ https://www.city.yufu.oita.jp/wp-content/uploads/2020/12/yufudake-map.pdf 2ページ目: 正面登山口→ゲート15分・ゲート→合野越30分。
 *   往復約1時間半＋お弁当の昼食・休み。もとは9:00からの山頂往復270分）→ 車7（OSRM 1.6）→ 狭霧台 13:37 → 車11（OSRM 6.0）→
 *   【新】クアージュゆふいん 14:13〜15:43（由布院温泉観光協会 https://yufuin.gr.jp/spot/spot-1284/ 。火口乃泉の代わり）→ 車9（OSRM 3.4）→
 *   佛山寺 15:52〜16:37 → 車9（OSRM 3.5）で由布院駅のまわりへ、レンタカーを返す
 *   塚原温泉 火口乃泉は外す: いまの点は地理院の大字「湯布院町塚原」の中心で、OSM にも地理院の番地（塚原1235）にも施設の点がない（企画運営 10/30）
 * 2日目（終わり 16:59 はもとのまま）: 宿（由布院駅のまわり）→ 歩20（1,496m）→ 金鱗湖 9:00 → 歩3 → 天祖神社 9:43 → 歩3 → 下ん湯 10:11 →
 *   歩11（818m）→ COMICO 11:02（70→64）→ 歩3 → 湯の坪街道 12:09（80→70、昼食）→ 歩18（1,325m）→ ステンドグラス美術館 13:37 → 歩8 →
 *   宇奈岐日女神社 14:25（55→49）→ 歩13（942m）→ 大杵社 15:27 → 歩17（1,293m）→ 由布院駅 16:24〜16:59
 * 点: 由布岳＝OSM「由布岳登山口前」way 160898589（合野越は OSM・地理院になし。法務の勧めで1件ずつの例外として企画運営に確認）／
 *   クアージュゆふいん＝OSM way 412391838／下ん湯＝OSM node 352889243（いまは約600m離れた湯の坪のあたり）／
 *   湯の坪街道＝way 115820610「湯之坪街道」の node 1307432196（いまは「湯の坪温泉」という浴場の way の点）／宇奈岐日女神社＝OSM way 412349256（いまは約420mずれ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-057-9da78e5d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9da78e5d-1fdd-415d-bd06-46c13d62d732";
const DAY1_ID = "c97e04b8-3bbf-4669-8d5e-3cc54a2e754a";
const DAY2_ID = "7c3fcb3f-f642-48f0-b319-98321106c477";
const YUFU = "69721923-fc0b-4561-838d-058c86d33375";
const KAKO = "63c311f4-dbb4-4986-b001-a4d3cb2a43d4";
const SAGIRI = "7d90400b-674b-4c5b-b80b-20ae3680a9ff";
const BUSSAN = "b04b820c-1d41-4ffc-b0f0-cb223d769b73";
const KIN = "5785b024-02b9-4153-8d87-7203deb6c494";
const TENSO = "8b8c7b99-b4b8-47df-a851-a5dcaf766e32";
const SHITA = "7b198e40-b3fc-4aef-b311-fb89b37ccbe4";
const COMICO = "22e8bfb7-cda8-482b-b021-96341d56c57d";
const YUNO = "054de543-f6ed-4f0b-947d-e3c1bc79da14";
const SG = "a0939deb-5b91-4175-8e38-296457aaf49d";
const UNA = "060f2f99-7dd9-418f-8170-4be97e309de8";
const OKI = "f3e6c417-4ffb-46a3-b790-29bb7fc1a32e";
const EKI = "05a8be08-4a18-428e-a291-fbea8fda7822";
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
  [YUFU]: { from: [33.2828, 131.3903], to: [33.264924, 131.396595] },
  [SHITA]: { from: [33.265853, 131.362328], to: [33.267266, 131.369088] },
  [YUNO]: { from: [33.266092, 131.363212], to: [33.266612, 131.362732] },
  [UNA]: { from: [33.2589, 131.3617], to: [33.256858, 131.365493] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

// 1日目に足す温泉（火口乃泉の代わり）
const KUA = "new-kua";
const KUA_SPOT = {
  name: "クアージュゆふいん",
  lat: 33.261273,
  lng: 131.359916,
  memo:
    "狭霧台からは、車でおよそ11分です。クアージュゆふいん(湯布院健康温泉館)は、ドイツ式の温泉療養を体験できる温泉施設です。水着を着て入る「バーデゾーン」では、運動浴やジャグジー、打たせ湯などを試すことができ、男女別の大浴場と露天風呂もあります。登山の汗を流して、ゆっくり休みましょう。休館日があるので、出かける前に公式の案内で確かめましょう。ほかの入浴客が写らないよう撮影は控え、長湯を避けて水分をとりながら過ごしましょう。続いては、車でおよそ9分の佛山寺へ向かいましょう。",
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [YUFU]: [
    { from: "由布院駅前でレンタカーを借り、車でおよそ15分の由布岳正面登山口へ向かいます。", to: "由布院駅に10時半ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車でおよそ15分の由布岳正面登山口へ向かいます。" },
    {
      from: "標高およそ780mの正面登山口から山頂までは、岩場や急な斜面もある本格的な登山で、往復の標準的な所要時間はおよそ4〜5時間です。登山靴などの装備を整え、事前に天気予報を確かめたうえで、下山の時刻に余裕を持った計画で臨みましょう。山頂やお気に入りの場所でお弁当を広げ、昼食をとるのもよいでしょう。神々しさすら感じる稜線を仰ぎ見ながら、由布院のシンボルの懐深くへと分け入ってみてください。続いては、車でおよそ6分の塚原温泉 火口乃泉へ向かいましょう。",
      to: "このしおりでは、正面登山口から中腹の合野越(ごうやごし)までを往復します。由布市の登山マップでは、登山口からゲートまでおよそ15分、ゲートから合野越までおよそ30分とされています。登山靴などの装備を整え、事前に天気予報を確かめましょう。山の上は天気が変わりやすいので、雨具や上着も用意し、決められた登山道を歩きましょう。合野越のあたりでお弁当を広げ、昼食をとりましょう。神々しさすら感じる稜線を仰ぎ見ながら、由布院のシンボルの懐へと分け入ってみましょう。登山口に戻ったら、車でおよそ7分の狭霧台へ向かいましょう。",
    },
  ],
  [SAGIRI]: [
    { from: "塚原温泉 火口乃泉からは、車でおよそ10分です。", to: "由布岳の正面登山口からは、車でおよそ7分です。" },
    { from: "今日歩いてきた由布岳の稜線を振り返りながら", to: "今日歩いてきた由布岳を振り返りながら" },
    { from: "続いては、車でおよそ5分の佛山寺へ向かいましょう。", to: "続いては、車でおよそ11分のクアージュゆふいんへ向かいましょう。" },
  ],
  [BUSSAN]: [
    { from: "狭霧台からは、車でおよそ5分です。", to: "クアージュゆふいんからは、車でおよそ9分です。" },
    { from: "今も祈りが続く山寺ですので、境内では静かに、敬意をもってお参りください。", to: "今も祈りが続く山寺ですので、静かに、敬意をもってお参りしましょう。" },
    {
      from: "今夜はこの近くの宿に泊まり、旅の疲れを癒やします。",
      to: "見学を終えたら、車でおよそ9分の由布院駅のまわりでレンタカーを返しましょう(返す手続きに15分ほど)。この夜は、由布院駅のまわりの宿に泊まりましょう。",
    },
  ],
  [KIN]: [
    { from: "金鱗湖は、大分川の源流の一つとなっている小さな池です。", to: "由布院駅のまわりの宿から歩いておよそ20分、金鱗湖に着きます。金鱗湖は、大分川の源流の一つとなっている小さな池です。" },
    { from: "続いては、歩いてすぐの天祖神社へ向かいましょう。", to: "続いては、歩いておよそ3分の天祖神社へ向かいましょう。" },
  ],
  [TENSO]: [
    { from: "金鱗湖からは歩いてすぐです。", to: "金鱗湖からは歩いておよそ3分です。" },
    { from: "湖と杜に包まれた静かな境内で、今も祈りが続く場ですので、静かに、敬意をもってお参りください。", to: `湖と杜に包まれた静かな境内です。${PRAY_TO}` },
    { from: "続いては、歩いておよそ9分の下ん湯へ向かいましょう。", to: "続いては、歩いておよそ3分の下ん湯へ向かいましょう。" },
  ],
  [SHITA]: [
    { from: "天祖神社からは歩いておよそ9分です。", to: "天祖神社からは歩いておよそ3分です。" },
    { from: "続いては、歩いてすぐのCOMICO ART MUSEUM YUFUINへ向かいましょう。", to: "続いては、歩いておよそ11分のCOMICO ART MUSEUM YUFUINへ向かいましょう。" },
  ],
  [COMICO]: [{ from: "下ん湯からは歩いてすぐです。", to: "下ん湯からは歩いておよそ11分です。" }],
  [YUNO]: [
    { from: "このあたりの飲食店で昼食をとるとよいでしょう。", to: "このあたりの飲食店で昼食をとりましょう。" },
    { from: "続いては、歩いておよそ10分の由布院ステンドグラス美術館へ向かいましょう。", to: "続いては、歩いておよそ18分の由布院ステンドグラス美術館へ向かいましょう。" },
  ],
  [SG]: [
    { from: "湯の坪街道からは歩いておよそ10分です。", to: "湯の坪街道からは歩いておよそ18分です。" },
    { from: "続いては、歩いておよそ5分の宇奈岐日女神社へ向かいましょう。", to: "続いては、歩いておよそ8分の宇奈岐日女神社へ向かいましょう。" },
  ],
  [UNA]: [
    { from: "由布院ステンドグラス美術館からは歩いておよそ5分です。", to: "由布院ステンドグラス美術館からは歩いておよそ8分です。" },
    {
      from: "昨日仰いだ由布岳の神々しさとあわせて、由布院盆地を見守り続けてきた神社の静けさを、静かに、敬意をもってお参りください。",
      to: `昨日仰いだ由布岳の神々しさとあわせて、由布院盆地を見守り続けてきた神社の静けさを感じましょう。${PRAY_TO}`,
    },
    { from: "続いては、歩いておよそ9分の大杵社へ向かいましょう。", to: "続いては、歩いておよそ13分の大杵社へ向かいましょう。" },
  ],
  [OKI]: [
    { from: "宇奈岐日女神社からは歩いておよそ9分です。", to: "宇奈岐日女神社からは歩いておよそ13分です。" },
    { from: "大切に祀られている神像ですので、静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "続いては、歩いておよそ14分の由布院駅へ向かいましょう。", to: "続いては、歩いておよそ17分の由布院駅へ向かいましょう。" },
  ],
  [EKI]: [{ from: "大杵社からは歩いておよそ14分です。", to: "大杵社からは歩いておよそ17分です。" }],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: YUFU, h: 11, m: 0, stay: 150, legs: [] },
  { id: SAGIRI, h: 13, m: 37, stay: 25, legs: [car(7)] },
  { id: KUA, h: 14, m: 13, stay: 90, legs: [car(11)] },
  { id: BUSSAN, h: 15, m: 52, stay: 45, legs: [car(9)] },
];
const DAY2: Plan = [
  { id: KIN, h: 9, m: 0, stay: 40, legs: [] },
  { id: TENSO, h: 9, m: 43, stay: 25, legs: [walk(3)] },
  { id: SHITA, h: 10, m: 11, stay: 40, legs: [walk(3)] },
  { id: COMICO, h: 11, m: 2, stay: 64, legs: [walk(11)] },
  { id: YUNO, h: 12, m: 9, stay: 70, legs: [walk(3)] },
  { id: SG, h: 13, m: 37, stay: 40, legs: [walk(18)] },
  { id: UNA, h: 14, m: 25, stay: 49, legs: [walk(8)] },
  { id: OKI, h: 15, m: 27, stay: 40, legs: [walk(13)] },
  { id: EKI, h: 16, m: 24, stay: 35, legs: [walk(17)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  if (it.description?.includes("火口乃泉")) throw new Error("説明文に火口乃泉があります");
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [YUFU, KAKO, SAGIRI, BUSSAN].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [KIN, TENSO, SHITA, COMICO, YUNO, SG, UNA, OKI, EKI].join()) throw new Error("2日目の構成が想定と違います");
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
  all.push({ ...KUA_SPOT, id: KUA, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "火口乃泉", "歩いてすぐ", "山頂まで"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  console.log(`新しい温泉: ${KUA_SPOT.name}（${KUA_SPOT.lat},${KUA_SPOT.lng}）\n  ${KUA_SPOT.memo}`);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n外す: 塚原温泉 火口乃泉（1日目、写真なし）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) =>
      p.id === KUA
        ? {
            create: {
              name: KUA_SPOT.name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: KUA_SPOT.lat,
              lng: KUA_SPOT.lng,
              address: "由布市湯布院町川上2863",
              memo: KUA_SPOT.memo,
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [KAKO] });
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
