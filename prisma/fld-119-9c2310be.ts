/**
 * 初日・最終日の見直し #119 9c2310be「萩城跡指月公園と笠山、城下町の武家屋敷と椿の名所を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 歩きは routed-foot、車は OSRM（もとの値が ×1.5＋5 の内側ならそのまま、新しい区間・外れる区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 東萩駅 10:35ごろ → タクシー10（4.3）→ 萩城跡指月公園 10:45（80→50）→ 歩7（527m。もと5）→ 旧厚狭毛利家萩屋敷長屋 11:42（25→20）→ 歩14（989m。もと10）→
 *   菊ヶ浜 12:16（30→20）→ 歩15（566m、もとのまま）→ 萩博物館 12:51〜14:11（館内のレストランで昼食、90→80。公式 https://hagimuseum.jp/ の「レストラン／ショップ」「萩の素材とおいしさにこだわったオリジナルメニュー」）→ 歩6（381m。もと5）→ 堀内の武家屋敷町 14:17（40→30）→
 *   歩17（1,262m。もと5）→ 口羽家住宅 15:04（35→30）→ 歩20（1,440m。もと15）→ 平安古の武家屋敷町 15:54（40→20）→ 歩5（61m、もとのまま）→
 *   旧田中別邸 16:19〜16:49（50→30）→ タクシー9（3.8）で東萩駅のまわりの宿
 * 2日目（16:30 に出るのはもとのまま）: 宿 → レンタカー（手続き15分）→ 車7（1.8）→ 萩反射炉 9:13（決まり369の②。滞在はどれも、もとのまま）→ 車5 → 恵美須ヶ鼻造船所跡 9:43 →
 *   車10 → 明神池 10:28 → 車5 → 笠山 11:03〜12:13 → 車10（4.9）→【新】道の駅萩しーまーと 12:23〜13:13（昼食。もとは笠山と東光寺のあいだの移動の中に昼食）→
 *   車9（3.5）→ 東光寺 13:22 → 歩10（728m）→ 吉田松陰誕生地 14:12 → 歩10で東光寺の駐車場＋車8（2.5。もと車10）→ 松陰神社・松下村塾 14:55 → 歩10（367m、もとのまま）→
 *   伊藤博文旧宅・別邸 15:55〜16:30 → 歩いて松陰神社の駐車場へ戻り、車8（2.8）で東萩駅、レンタカーを返す（15分）
 * 点: 旧厚狭毛利家萩屋敷長屋＝地理院「堀内85番地」（いまは OSM の案内板 node 6441846405。OSM に建物の名前の点がない）／菊ヶ浜＝OSM「菊ヶ浜海水浴場」beach way 576015913 の node 5525756405
 *   （いまは道の上の点）／堀内の武家屋敷町＝OSM「北乃総門址」historic=memorial node 6441846380（いまは「堀内」の地名の点。北の総門は旧益田家物見矢倉のそば
 *   https://tabi-mag.jp/ya0163/「北の総門近くには、旧益田家物見矢倉、旧繁沢家長屋門、萩博物館があります。」）／平安古の武家屋敷町＝平安古の鍵曲の地理院「平安古町143番地」
 *   （国交省 多言語解説 https://www.mlit.go.jp/tagengo-db/en/R2-00350.html「143 Hiyako」。いまは「平安古町」の地名の点）／明神池＝OSM「明神池」pond relation 17478722 の
 *   node 4317097882（いまは道の上の点）／昼食＝OSM「道の駅萩シーマート」建物 way 384631416（Nominatim。OSM の食事処の点「道の駅萩しーまーと」node 4247866953 がある）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-119-9c2310be.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9c2310be-66b4-4b74-a67f-481c454404a5";
const DAY1_ID = "b7b0b609-7d3e-4a43-93a0-ec3fd728ce37";
const DAY2_ID = "33701db1-425d-413c-80db-2dbdedffac0f";
const SHIGETSU = "77936615-ce1d-4870-b2d6-f9bd24facc85";
const ASA = "5ec65aa2-49d9-40c2-ba61-a849f0f3103b";
const KIKU = "1f181640-2bf4-4d55-b403-fe3913fbdd15";
const HAKU = "5f1cab85-33cf-4330-9915-c72cc827d46d";
const HORI = "03ab7e74-d86f-4328-b1fa-4ad3e3a4bda1";
const KUCHIBA = "025e94f3-8618-4412-a9e5-a31afc1f96ae";
const HIYAKO = "b83c0065-271a-449f-959f-729faa762e94";
const TANAKA = "fb15e4ab-8b5c-42ba-b0e9-9dd988058415";
const HANSHA = "163cacba-a375-40b6-8f7c-3628538bb8fc";
const EBISU = "7963bc84-d8ab-4b62-9424-f4b24ceebe54";
const MYOJIN = "8d4df71e-d4e6-42e4-9e11-87a24d27c4fd";
const KASA = "1fef8683-736d-4137-a22b-ba2af04c235a";
const TOKO = "77fd3e0c-a9c1-45ce-be44-f4d7d16cf9a9";
const TANJO = "5e5e50a0-a6e1-4a72-8165-49c261ac2462";
const SHOIN = "04759158-729a-4e58-9fab-5887c8bfbf72";
const ITO = "798bba88-f8e3-47d6-99c1-ba752755caf6";
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
  [ASA]: { from: [34.415074, 131.382403], to: [34.414738, 131.382309] },
  [KIKU]: { from: [34.418052, 131.393495], to: [34.417193, 131.391089] },
  [HORI]: { from: [34.414543, 131.384959], to: [34.414692, 131.391834] },
  [HIYAKO]: { from: [34.406438, 131.388655], to: [34.404247, 131.388748] },
  [MYOJIN]: { from: [34.448967, 131.409119], to: [34.448827, 131.408711] },
};

const PRAY_FROM = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const LUNCH = "new-seamart";
const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH]: {
    name: "道の駅萩しーまーと（昼食）",
    lat: 34.426191,
    lng: 131.414413,
    address: "山口県萩市椿東",
    memo: "笠山から車でおよそ10分。道の駅萩しーまーとには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、車でおよそ9分、東光寺へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHIGETSU]: [{ from: "旅の始まりは萩城跡・指月公園へ。", to: "JR東萩駅に10時35分ごろ着いたら、駅前からタクシーでおよそ10分、萩城跡・指月公園から旅を始めます。" }],
  [ASA]: [{ from: "指月公園の入口近くにある、", to: "指月公園から歩いておよそ7分、入口近くにある、" }],
  [KIKU]: [{ from: "長屋から歩いて、日本海に面した菊ヶ浜へ。", to: "長屋から歩いておよそ14分、日本海に面した菊ヶ浜へ。" }],
  [HAKU]: [
    { from: "菊ヶ浜から歩いて萩博物館へ。", to: "菊ヶ浜から歩いておよそ15分、萩博物館へ。" },
    { from: "館内にはレストランもあるので、ここで昼食にするのもよいでしょう。", to: "館内にはレストランもあるので、ここで昼食にしましょう。" },
  ],
  [HORI]: [{ from: "博物館を出て、堀内の武家屋敷町を歩きましょう。", to: "萩博物館から歩いておよそ6分、復元された北の総門のあたりから、堀内の武家屋敷町を歩きましょう。" }],
  [KUCHIBA]: [{ from: "堀内の南にある口羽家住宅へ。", to: "北の総門のあたりから歩いておよそ17分、堀内の南にある口羽家住宅へ。" }],
  [HIYAKO]: [{ from: "口羽家住宅から歩いて、", to: "口羽家住宅から歩いておよそ20分、" }],
  [TANAKA]: [
    { from: "平安古の町並みの中にある、", to: "平安古の鍵曲から歩いておよそ5分、町並みの中にある、" },
    { from: "今夜は萩に泊まります。", to: "この夜は、タクシーでおよそ9分の東萩駅のまわりの宿に泊まりましょう。" },
  ],
  [HANSHA]: [
    {
      from: "2日目は車（レンタカーなど）で、萩の東の笠山のほうへめぐりましょう。",
      to: "2日目は車で、萩の東の笠山のほうへめぐりましょう。東萩駅のまわりの宿を出て、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ7分、萩反射炉に着きます。",
    },
  ],
  [EBISU]: [{ from: "反射炉から車ですぐの恵美須ヶ鼻造船所跡へ。", to: "反射炉から車でおよそ5分、恵美須ヶ鼻造船所跡へ。" }],
  [MYOJIN]: [{ from: "車で笠山のふもとにある明神池へ。", to: "恵美須ヶ鼻造船所跡から車でおよそ10分、笠山のふもとにある明神池へ。" }],
  [KASA]: [
    { from: "明神池から車で笠山へ。", to: "明神池から車でおよそ5分、笠山へ。" },
    { from: "このあと、ふもとの越ヶ浜のあたりで昼食にしましょう。", to: "このあと、車でおよそ10分の道の駅萩しーまーとで昼食にしましょう。" },
  ],
  [TOKO]: [
    { from: "昼食のあとは、車で萩の東の松本地区にある東光寺へ。", to: "道の駅萩しーまーとから車でおよそ9分、萩の東の松本地区にある東光寺へ。" },
    { from: PRAY_FROM, to: `墓所のまわりでは、静かに過ごしましょう。${PRAY_TO}` },
  ],
  [TANJO]: [{ from: "東光寺から歩いて、吉田松陰誕生地へ。", to: "東光寺から歩いておよそ10分、吉田松陰誕生地へ。" }],
  [SHOIN]: [
    { from: "東光寺の駐車場へ戻り、車で松陰神社へ。", to: "歩いておよそ10分で東光寺の駐車場へ戻り、車でおよそ8分、松陰神社へ。" },
    { from: PRAY_FROM, to: PRAY_TO },
  ],
  [ITO]: [
    { from: "松陰神社から歩いて、伊藤博文旧宅へ。", to: "松陰神社から歩いておよそ10分、伊藤博文旧宅へ。" },
    {
      from: "帰りは、レンタカーを返す場所まで安全運転で。",
      to: "見学を終えたら、歩いておよそ10分で松陰神社の駐車場へ戻り、車でおよそ8分の東萩駅でレンタカーを返しましょう（返す手続きに15分ほど）。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: SHIGETSU, h: 10, m: 45, stay: 50, legs: [] },
  { id: ASA, h: 11, m: 42, stay: 20, legs: [walk(7)] },
  { id: KIKU, h: 12, m: 16, stay: 20, legs: [walk(14)] },
  { id: HAKU, h: 12, m: 51, stay: 80, legs: [walk(15)] },
  { id: HORI, h: 14, m: 17, stay: 30, legs: [walk(6)] },
  { id: KUCHIBA, h: 15, m: 4, stay: 30, legs: [walk(17)] },
  { id: HIYAKO, h: 15, m: 54, stay: 20, legs: [walk(20)] },
  { id: TANAKA, h: 16, m: 19, stay: 30, legs: [walk(5)] },
];
const DAY2: Plan = [
  { id: HANSHA, h: 9, m: 13, stay: 25, legs: [] },
  { id: EBISU, h: 9, m: 43, stay: 35, legs: [car(5)] },
  { id: MYOJIN, h: 10, m: 28, stay: 30, legs: [car(10)] },
  { id: KASA, h: 11, m: 3, stay: 70, legs: [car(5)] },
  { id: LUNCH, h: 12, m: 23, stay: 50, legs: [car(10)] },
  { id: TOKO, h: 13, m: 22, stay: 40, legs: [car(9)] },
  { id: TANJO, h: 14, m: 12, stay: 25, legs: [walk(10)] },
  { id: SHOIN, h: 14, m: 55, stay: 50, legs: [walk(10), car(8)] },
  { id: ITO, h: 15, m: 55, stay: 35, legs: [walk(10)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [HANSHA, EBISU, MYOJIN, KASA, TOKO, TANJO, SHOIN, ITO].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "レンタカーなど", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
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
