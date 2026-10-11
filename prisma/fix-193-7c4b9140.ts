/**
 * #193 7c4b9140「定禅寺通りと大崎八幡宮、杜の都・仙台の街並みさんぽプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜11:20 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。移動も「車」だけでレンタカーの話がなかった
 * 地下鉄・路線バスと歩きの旅（地下鉄南北線の勾当台公園駅から。帰りは JR仙山線の北仙台駅か地下鉄の北仙台駅から）:
 *   定禅寺通 9:30 → 晩翠草堂 → 西公園 → 一番町の商店街（昼食）→ 大崎八幡宮 → 資福寺 → 輪王寺 → 青葉神社 16:30 → 北仙台駅
 * タイトルと季節はそのまま、説明文は書き直す
 * 仙台のほかのしおり（1d1afcce・af5a402c）の本文を読み、使っていない話で書いた（定禅寺通は名の由来・植樹の年・166本を使わず、西公園と勾当台公園を結ぶ約700mの並木と季節の催し、
 *   大崎八幡宮は造営の年と名工の話を使わず、権現造の典型として最古の社殿と彫刻の題材、輪王寺は庭園の格付けを使わず、創建の由来と池に映る三重塔）。晩翠草堂・西公園・一番町・資福寺・青葉神社はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   仙台市 city.sendai.jp/ryokuchihozen/kurashi/shizen/midori/reiwa100sen/aoba/jozenjidori.html 定禅寺通のケヤキ並木（約700m・4列・樹齢60年以上・西公園と勾当台公園を結ぶ・ジャズフェスティバルと光のページェント）／
 *   仙台観光国際協会 sentabi.jp/spots/5 晩翠草堂（土井晩翠が昭和24年から亡くなるまで住んだ・戦災で家と蔵書を失い、市民や教え子が建てた・遺品・「荒城の月」・月曜休館）／
 *   sentabi.jp/spots/25 西公園（明治8年開園、市内で最も歴史ある公園・かつて桜ヶ岡公園・桜の名所・蒸気機関車、こけし塔、芭蕉の句碑、彫刻、臥竜梅・明治元年創業の茶屋・秋のイチョウ）／
 *   sentabi.jp/sendai-areaguide-center 仙台市中心部エリア（一番町四丁目商店街などのアーケード・国分町は牛たんや炉端焼き発祥の地）／
 *   仙台市の指定・登録文化財 bunkazai.city.sendai.jp/shiteidb/c00001.html 大崎八幡宮（慶長12年に伊達政宗が造営・本殿と拝殿を石の間でつなぐ権現造の典型として最古・総漆塗、極彩色、飾金具・
 *   飛天、虎、猫、牡丹、蝶、象などの彫刻・国宝）／sentabi.jp/spots/122 資福寺（伊達政宗が城下の北に配した北山五山の一つ・仙台のあじさい寺、約1,000株・本堂前の竹林・季節の花）／
 *   sentabi.jp/spots/4 輪王寺（1441年に伊達家11代持宗が9代政宗の夫人・蘭庭明玉禅尼の願いで梁川に創建・1602年に17代政宗のときに今の地へ・回遊式庭園と池に映る三重塔・見学の目安20〜30分）／
 *   sentabi.jp/spots/62 青葉神社（明治7年に伊達家の旧臣らが創建・伊達政宗（武振彦命）をまつる・6棟が国の登録有形文化財・仙台・青葉まつり）
 * 座標: OSM — 定禅寺通 way 104117790・一番町四丁目商店街 way 104121819（highway=pedestrian）・大崎八幡宮 way 1023512304・資福寺 way 227110037・輪王寺 way 227110038・青葉神社 way 227110053・
 *   西公園 relation 16202585（Nominatim の中心）／晩翠草堂 node 4741215641（viewpoint、API で名前つき。国土地理院の大町一丁目2番2号の点から約17m）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-193-7c4b9140.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7c4b9140-57ad-4526-b415-385423403358";
const DAY1_ID = "62b733a0-79f0-40cf-8ba2-0f87b34b3e3b";
const JOZENJI = "d1fc4859-76af-4b24-be29-aa6527c4c76b";
const OSAKI = "55829e22-c1b3-40d3-8955-28c2b0d2b116";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "ケヤキ並木の定禅寺通から、土井晩翠の晩翠草堂、市内でいちばん古い西公園を歩き、一番町のアーケードで昼食。午後は国宝の大崎八幡宮にお参りし、伊達家ゆかりの寺社が並ぶ北山へ。あじさい寺の資福寺、三重塔の輪王寺、政宗をまつる青葉神社をめぐる、地下鉄とバスと歩きの仙台さんぽです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(JOZENJI, { h: 9, m: 30, stay: 30, legs: [], lat: 38.2656263, lng: 140.8691838, address: "宮城県仙台市青葉区国分町",
    memo: "この旅は地下鉄とバス、歩きでめぐります。地下鉄南北線の勾当台公園駅からすぐ。西公園と勾当台公園を結ぶ約700mの通りに、樹齢60年をこえるケヤキが4列に並ぶ並木道で、「杜の都」仙台を象徴する景色です。秋には街角で音楽を楽しむジャズフェスティバル、冬には並木を明かりで飾る「光のページェント」の舞台になります。" }, "定禅寺通"),
  cre("晩翠草堂", { h: 10, m: 10, stay: 25, legs: [walk(10)], lat: 38.2594465, lng: 140.8694658, address: "宮城県仙台市青葉区大町1-2-2",
    memo: "定禅寺通から歩いて約10分。「荒城の月」の作詞で知られる詩人・英文学者の土井晩翠が、晩年を過ごした家です。戦災で家と蔵書を失った晩翠のために、市民や教え子たちが建てたもので、晩翠の遺品などが展示され、当時の暮らしぶりにふれられます。休館日は公式の案内で確かめましょう。" }),
  cre("西公園", { h: 10, m: 47, stay: 40, legs: [walk(12)], lat: 38.2596865, lng: 140.8616506, address: "宮城県仙台市青葉区桜ケ岡公園",
    memo: "晩翠草堂から歩いて約12分。明治8年（1875年）に開かれた、市内で最も歴史のある公園で、かつては「桜ヶ岡公園」と呼ばれていました。園内には、蒸気機関車やこけしの塔、松尾芭蕉の句碑、伊達政宗ゆかりと伝わる梅「臥竜梅」などがあります。春は桜、秋はイチョウの黄葉が見どころです。" }),
  cre("一番町の商店街（昼食）", { h: 11, m: 45, stay: 50, legs: [walk(18)], lat: 38.2641534, lng: 140.8708422, address: "宮城県仙台市青葉区一番町4丁目",
    memo: "西公園から歩いて約18分。アーケードの商店街が続く仙台の中心部で、店やカフェが並びます。となりの国分町は、牛たんや炉端焼きが生まれた地とされ、仙台の味の店も多いので、このあたりで昼食にしましょう。" }),
  upd(OSAKI, { h: 13, m: 0, stay: 50, legs: [walk(5), bus(20, "仙台市営バス（勾当台公園方面→大崎八幡宮前）")], lat: 38.2716378, lng: 140.8448528, address: "宮城県仙台市青葉区八幡4-6-1",
    memo: "一番町からバス停へ歩いて約5分、路線バスで約20分の大崎八幡宮前へ（あわせて約25分）。慶長12年（1607年）に伊達政宗が造営した社殿は、本殿と拝殿を「石の間」でつなぐ権現造で、この形の典型としては最も古いものとされ、国宝です。全体に漆を塗り、鮮やかな色と飾り金具をほどこした桃山時代の建物で、彫刻には天女や虎、猫、牡丹、蝶、象などが組み合わされています。" + PRAY }),
  cre("資福寺", { h: 14, m: 20, stay: 30, legs: [walk(30)], lat: 38.2829354, lng: 140.8603579, address: "宮城県仙台市青葉区北山1-13-1",
    memo: "大崎八幡宮から東へ歩いて約30分。伊達政宗が城下の北の守りに置いた「北山五山」の一つで、「仙台のあじさい寺」として知られ、初夏には約1,000株のあじさいが咲きます。本堂の前には竹林があり、季節ごとにさまざまな花が境内をいろどります。" + PRAY }),
  cre("輪王寺", { h: 14, m: 55, stay: 50, legs: [walk(5)], lat: 38.2832133, lng: 140.8587279, address: "宮城県仙台市青葉区北山1-14-1",
    memo: "資福寺から歩いて約5分。1441年に、伊達家11代の持宗が、9代政宗の夫人・蘭庭明玉禅尼の願いを受けて、いまの福島県の梁川に開いた寺で、1602年に17代の伊達政宗のもとで今の地に移されました。花の咲く回遊式の庭園があり、池に三重塔が映る景色が見どころです。" + PRAY }),
  cre("青葉神社", { h: 15, m: 55, stay: 35, legs: [walk(10)], lat: 38.2828242, lng: 140.8628726, address: "宮城県仙台市青葉区青葉町7-1",
    memo: "輪王寺から歩いて約10分。明治7年（1874年）に伊達家の旧臣たちが建てた神社で、仙台藩祖・伊達政宗を「武振彦命」としてまつっています。本殿など6棟が国の登録有形文化財で、春の「仙台・青葉まつり」にゆかりの深い神社です。" + PRAY + "帰りは、歩いて約10分の北仙台駅から、地下鉄かJRで仙台駅へ戻りましょう。" }),
];

function show(label: string, DAY: X[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [JOZENJI, OSAKI].join()) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
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
