/**
 * 初日・最終日の見直し #110 344b0e98「弘前城の桜とねぷたまつり、津軽の四季を楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 歩きは routed-foot、タクシーは OSRM（もとの「車」はレンタカーの話がないので、タクシーに。もとの値が ×1.5＋5 の内側ならそのまま、新しい区間は切り上げ＋5）
 * 1日目: 弘前駅 10:30ごろ → タクシー12（OSRM 6.5）→ 弘前公園 10:45（140→80）→ 歩12（866m）→ 弘前市立観光館 12:17（45→30）→ 歩2 → 旧弘前市立図書館 12:49（35→20）→
 *   歩4（231m）→【新】弘前市役所のまわり 13:13〜13:58（昼食。もとは1日目に昼食なし）→ 歩17（1,276m）→ 津軽藩ねぷた村 14:15（90→60）→ 歩4 → 仲町の武家屋敷 15:19（75→45）→
 *   歩15（1,121m。もとは車10）→ 弘前八幡宮 16:19〜16:49（45→30）→ タクシー10（OSRM 4.9）で弘前駅のまわりの宿
 * 2日目（終わり 16:34 はもとのまま）: 宿 → タクシー11（OSRM 5.5）→ 藤田記念庭園 9:00 → タクシー5（OSRM 2.4、もとのまま）→ 弘前れんが倉庫美術館 10:05（95→80）→ 歩2 →
 *   弘前昇天教会 11:27 → 歩2 →【新】土手町のまわり 11:49〜12:34（昼食。もとは2日目に昼食なし）→ 歩12（904m）→ 最勝院 12:46 → タクシー5 → 長勝寺・禅林街 13:51（90→70）→
 *   タクシー6 → 弘前教会 15:07 → タクシー9 → 弘前市りんご公園 15:36〜16:34（75→58）→ タクシー14（OSRM 8.8）で弘前駅
 * 点: 弘前公園＝OSM「弘前城」（天守の建物）way 757850283（いまは度分秒の0.1秒の形）／観光館＝OSM node 3015900933・図書館＝OSM node 4877219122（いまは2つが同じ点）／
 *   ねぷた村＝OSM node 12102755802／藤田記念庭園＝OSM「旧藤田家別邸 洋館」way 1347267061（いまは度分秒の秒の形。メモは高台の洋館）／
 *   昇天教会＝OSM node 1512752163（いまは約95mずれ）／長勝寺・禅林街＝OSM「禅林街」attraction way 647238950／弘前教会＝OSM way 1386319815／
 *   昼食＝バス停「市役所前」node 2905115196・「中土手町」node 2905115186（店ではない名前の点、まわりに食事処の点あり）。
 *   れんが倉庫美術館＝OSM relation 4656622（Nominatim）・最勝院＝OSM way 457548923（法務。地理院より OSM を先に）。美術館→昇天教会 195m・3分のため美術館 80→79。
 *   八幡宮（八幡町一丁目1番。OSM は境内の landuse だけ）・りんご公園（清水富田寺沢125番地。OSM は公園の面だけ）は地理院の番地のまま。入口は駅に10時33分ごろ（法務）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-110-344b0e98.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "344b0e98-7ff9-43b2-9761-48173f95ff21";
const DAY1_ID = "9256cb2f-d4c4-49d8-a3f6-83ca40d6f1e6";
const DAY2_ID = "084cd5db-8b50-4bf5-8b1e-a9b3439cd480";
const KOEN = "d449735d-2c92-4129-8990-07ec6011ea72";
const KANKO = "5f6b873f-d746-4702-afc3-ba3a9730044f";
const TOSHO = "a45a4573-e63b-4187-851e-c3a8c9c752fd";
const NEPUTA = "931321cb-5d7c-4052-884b-ea14efcf92f3";
const BUKE = "5a0540fc-f792-4304-adf5-ee821c8aa391";
const HACHI = "588131f8-ce00-40aa-9fb7-920e4f590d26";
const FUJITA = "6a40dd9b-d266-4102-b9e0-e1b283b7bade";
const RENGA = "19ed437a-15e9-43e0-a5bd-5d88863edef4";
const SHOTEN = "dd5d4bf3-aab0-48f6-9a81-497d30eb25d2";
const SAISHO = "3ed9d818-2b60-4984-b352-2a47ba50fc9d";
const CHOSHO = "3b0778b4-9b0a-4fef-a549-6ee9dd905b0b";
const KYOKAI = "027ad82a-fee6-4f3a-9983-7c9bf5c801bc";
const RINGO = "6f68be60-eef8-4667-b110-ee04677a916b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [KOEN]: { from: [40.608028, 140.463806], to: [40.607929, 140.463661] },
  [KANKO]: { from: [40.602921, 140.465607], to: [40.603124, 140.465319] },
  [TOSHO]: { from: [40.602921, 140.465607], to: [40.602702, 140.465844] },
  [NEPUTA]: { from: [40.611324, 140.469788], to: [40.611141, 140.469689] },
  [FUJITA]: { from: [40.604167, 140.460278], to: [40.603528, 140.461384] },
  [SHOTEN]: { from: [40.598648, 140.473816], to: [40.599376, 140.473232] },
  [CHOSHO]: { from: [40.599487, 140.456238], to: [40.598697, 140.453567] },
  [KYOKAI]: { from: [40.605469, 140.469666], to: [40.605382, 140.469538] },
  [RENGA]: { from: [40.598434, 140.472443], to: [40.597955, 140.472983] },
  [SAISHO]: { from: [40.596209, 140.46872], to: [40.596585, 140.468645] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const LUNCH1 = "new-shiyakusho";
const LUNCH2 = "new-dotemachi";
const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "弘前市役所のまわり",
    lat: 40.602791,
    lng: 140.464487,
    address: "青森県弘前市",
    memo: "旧弘前市立図書館から歩いておよそ4分。追手門に近い市役所のまわりには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ17分、津軽藩ねぷた村へ向かいましょう。",
  },
  [LUNCH2]: {
    name: "土手町のまわり",
    lat: 40.600377,
    lng: 140.473817,
    address: "青森県弘前市土手町",
    memo: "弘前昇天教会から歩いておよそ2分。弘前の中心の商店街・土手町のまわりには食事処も多いので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ12分、最勝院へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KOEN]: [
    { from: "本日は弘前公園からスタートです。", to: "JR弘前駅に10時33分ごろ着いたら、駅前からタクシーでおよそ12分、弘前公園から旅を始めます。" },
    { from: "訪れる前に公式サイトなどで確かめてみましょう。", to: "訪れる前に公式サイトなどで確かめましょう。" },
    { from: "見学を終えたら、歩いて弘前市立観光館へ向かいましょう。", to: "見学を終えたら、追手門から出て、歩いておよそ12分、弘前市立観光館へ向かいましょう。" },
  ],
  [KANKO]: [
    { from: "弘前公園を見学したら、歩いて弘前市立観光館へ向かいましょう。", to: "弘前公園から歩いておよそ12分、弘前市立観光館に着きます。" },
    { from: "見学を終えたら、歩いて旧弘前市立図書館へ向かいましょう。", to: "見学を終えたら、歩いておよそ2分、旧弘前市立図書館へ向かいましょう。" },
  ],
  [TOSHO]: [
    { from: "弘前市立観光館を見学したら、歩いて旧弘前市立図書館へ向かいましょう。", to: "弘前市立観光館から歩いておよそ2分、旧弘前市立図書館に着きます。" },
    { from: "見学を終えたら、歩いて津軽藩ねぷた村へ向かいましょう。", to: "見学を終えたら、歩いておよそ4分、市役所のまわりで昼食をとりましょう。" },
  ],
  [NEPUTA]: [
    { from: "旧弘前市立図書館を見学したら、歩いて津軽藩ねぷた村へ向かいましょう。", to: "弘前市役所のまわりから歩いておよそ17分、津軽藩ねぷた村に着きます。" },
    { from: "夏まつりの熱気を、季節を問わず感じてみましょう。見学を終えたら、歩いて仲町の武家屋敷へ向かいましょう。", to: "夏まつりの熱気を、季節を問わず感じましょう。見学を終えたら、歩いておよそ4分、仲町の武家屋敷へ向かいましょう。" },
  ],
  [BUKE]: [
    { from: "津軽藩ねぷた村を見学したら、歩いて仲町の武家屋敷へ向かいましょう。", to: "津軽藩ねぷた村から歩いておよそ4分、仲町の武家屋敷に着きます。" },
    { from: "見学を終えたら、車で弘前八幡宮へ向かいましょう。", to: "見学を終えたら、歩いておよそ15分、弘前八幡宮へ向かいましょう。" },
  ],
  [HACHI]: [
    { from: "仲町の武家屋敷を歩いたら、車で弘前八幡宮へ向かいましょう。", to: "仲町の武家屋敷から歩いておよそ15分、弘前八幡宮に着きます。" },
    { from: "静かに、敬意をもって参拝しましょう。", to: PRAY_TO },
    { from: "今夜はこの近くの宿にご宿泊ください。", to: "この夜は、タクシーでおよそ10分の弘前駅のまわりの宿に泊まりましょう。" },
  ],
  [FUJITA]: [
    { from: "本日は藤田記念庭園からスタートです。", to: "弘前駅のまわりの宿からタクシーでおよそ11分、2日目は藤田記念庭園から始めます。" },
    { from: "見学を終えたら、車で弘前れんが倉庫美術館へ向かいましょう。", to: "見学を終えたら、タクシーでおよそ5分、弘前れんが倉庫美術館へ向かいましょう。" },
  ],
  [RENGA]: [
    { from: "藤田記念庭園を見学したら、車で弘前れんが倉庫美術館へ向かいましょう。", to: "藤田記念庭園からタクシーでおよそ5分、弘前れんが倉庫美術館に着きます。" },
    { from: "見学を終えたら、歩いて弘前昇天教会へ向かいましょう。", to: "見学を終えたら、歩いておよそ3分、弘前昇天教会へ向かいましょう。" },
  ],
  [SHOTEN]: [
    { from: "弘前れんが倉庫美術館を見学したら、歩いて弘前昇天教会へ向かいましょう。", to: "弘前れんが倉庫美術館から歩いておよそ3分、弘前昇天教会に着きます。" },
    { from: "見学を終えたら、歩いて最勝院へ向かいましょう。", to: "見学を終えたら、歩いておよそ2分、土手町のまわりで昼食をとりましょう。" },
  ],
  [SAISHO]: [
    { from: "弘前昇天教会を見学したら、歩いて最勝院へ向かいましょう。", to: "土手町のまわりから歩いておよそ12分、最勝院に着きます。" },
    {
      from: "本堂もあわせて参拝し、静かに、敬意をもってお参りしましょう。見学を終えたら、車で長勝寺・禅林街へ向かいましょう。",
      to: `本堂もあわせてお参りしましょう。${PRAY_TO}この後は、タクシーでおよそ5分、長勝寺・禅林街へ向かいましょう。タクシーは、前もって予約しておくと安心です。`,
    },
  ],
  [CHOSHO]: [
    { from: "最勝院を参拝したら、車で長勝寺・禅林街へ向かいましょう。", to: "最勝院からタクシーでおよそ5分、長勝寺・禅林街に着きます。" },
    {
      from: "弘前藩の歴史を伝える、静かなお寺の町並みを、静かに、敬意をもって歩いてみましょう。見学を終えたら、車で弘前教会へ向かいましょう。",
      to: `弘前藩の歴史を伝える、お寺の町並みです。${PRAY_TO}津軽家の霊屋のまわりでは、静かに過ごしましょう。見学を終えたら、タクシーでおよそ6分、弘前教会へ向かいましょう。`,
    },
  ],
  [KYOKAI]: [
    { from: "長勝寺・禅林街を見学したら、車で弘前教会へ向かいましょう。", to: "長勝寺・禅林街からタクシーでおよそ6分、弘前教会に着きます。" },
    { from: "見学を終えたら、車で弘前市りんご公園へ向かいましょう。", to: "見学を終えたら、タクシーでおよそ9分、弘前市りんご公園へ向かいましょう。" },
  ],
  [RINGO]: [
    { from: "弘前教会を見学したら、車で弘前市りんご公園へ向かいましょう。", to: "弘前教会からタクシーでおよそ9分、弘前市りんご公園に着きます。" },
    {
      from: "弘前城の桜とねぷたまつり、津軽の四季を巡る旅、これで終わりです。",
      to: "弘前城の桜とねぷたまつり、津軽の四季を巡る旅、これで終わりです。見学を終えたら、タクシーでおよそ14分の弘前駅へ向かい、帰りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: KOEN, h: 10, m: 45, stay: 80, legs: [] },
  { id: KANKO, h: 12, m: 17, stay: 30, legs: [walk(12)] },
  { id: TOSHO, h: 12, m: 49, stay: 20, legs: [walk(2)] },
  { id: LUNCH1, h: 13, m: 13, stay: 45, legs: [walk(4)] },
  { id: NEPUTA, h: 14, m: 15, stay: 60, legs: [walk(17)] },
  { id: BUKE, h: 15, m: 19, stay: 45, legs: [walk(4)] },
  { id: HACHI, h: 16, m: 19, stay: 30, legs: [walk(15)] },
];
const DAY2: Plan = [
  { id: FUJITA, h: 9, m: 0, stay: 60, legs: [] },
  { id: RENGA, h: 10, m: 5, stay: 79, legs: [taxi(5)] },
  { id: SHOTEN, h: 11, m: 27, stay: 20, legs: [walk(3)] },
  { id: LUNCH2, h: 11, m: 49, stay: 45, legs: [walk(2)] },
  { id: SAISHO, h: 12, m: 46, stay: 60, legs: [walk(12)] },
  { id: CHOSHO, h: 13, m: 51, stay: 70, legs: [taxi(5)] },
  { id: KYOKAI, h: 15, m: 7, stay: 20, legs: [taxi(6)] },
  { id: RINGO, h: 15, m: 36, stay: 58, legs: [taxi(9)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KOEN, KANKO, TOSHO, NEPUTA, BUKE, HACHI].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [FUJITA, RENGA, SHOTEN, SAISHO, CHOSHO, KYOKAI, RINGO].join()) throw new Error("2日目の構成が想定と違います");
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
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "見学したら", "車で", "ホテル", "旅館"])
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
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
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
