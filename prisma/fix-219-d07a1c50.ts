/**
 * #219 d07a1c50「白谷雲水峡、もののけ姫の森と呼ばれる苔むす渓谷プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:00〜12:00 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「お楽しみください」）
 * 車の旅（宮之浦港でレンタカーを借りて返す）:
 *   白谷雲水峡 9:00〜12:00 → なごりの松原（宮之浦で昼食）→ 益救神社 → 屋久島環境文化村センター → 志戸子ガジュマル公園 → 一湊海水浴場 16:30 → 宮之浦港
 *   #231（縄文杉）とは重ならない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   白谷雲水峡 屋久島観光協会 https://yakukan.jp/spot/6985.html （標高600〜1,050m・弥生杉コース・奉行杉コース・太鼓岩往復コース・樹齢約3,000年の弥生杉・
 *     有名アニメ映画のモデルになった場所と言われる苔むす森・太鼓岩・警報発令中は入れない・増水時のコース制限）／
 *     屋久島町 https://www.town.yakushima.kagoshima.jp/kanko/kankospot/6/2632.html （宮之浦から車で約22分・弥生杉1時間・奉行杉3時間・太鼓岩4時間）／
 *     太鼓岩コース https://yakukan.jp/feature/taikoiwa-course.html （苔むす森を経由・往復4〜5時間）
 *   なごりの松原 屋久島町 /kanko/kankospot/5/2599.html （宮之浦港入口の松林・船を見送る地だったことが名の由来）・宮之浦の食事の店 屋久島観光協会 https://yakukan.jp/gourmet/ （宮之浦エリア）
 *   益救神社 屋久島町 /kanko/kankospot/5/2602.html （宮之浦川の河口付近・延喜式神名帳に日本最南端の式内社として記載・一品法壽大権現・町指定文化財の仁王像や手水鉢）
 *   屋久島環境文化村センター 屋久島観光協会 https://yakukan.jp/spot/6994.html （大型映像とパネル模型・屋久島の自然・文化・生活・9:00〜17:00 入館16:30・月曜休）
 *   志戸子ガジュマル公園 屋久島町 /kanko/kankospot/5/2606.html （志戸子集落の海岸近く・ガジュマルと熱帯植物・遊歩道10〜15分・8:30〜17:00・宮之浦から車で約10分）
 *   一湊海水浴場 屋久島町 /kanko/kankospot/4/2587.html （島の最北端の海水浴場・北側の岬に赤い鳥居の矢筈嶽神社・一湊漁港・遊泳は例年7月中旬〜8月下旬・宮之浦から約15分）
 * 座標: OSM — 白谷雲水峡の入り口 node 588973500（man_made=entrance）／なごりの松原 way 429217794（Nominatim の中心）／益救神社 way 1411750648（同）／
 *   環境文化村センター way 264162710（同）／志戸子ガジュマル公園 way 489172002（同）／一湊海水浴場 node 6520445049（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-219-d07a1c50.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d07a1c50-be6b-4572-952d-a25feeebf78d";
const DAY_ID = "0b3c4fee-0dbd-4551-b44f-7e8114b3ad67";
const SHIRATANI = "f32a0fae-e6ee-49a1-9c16-b7b3bce19aaa";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "宮之浦港でレンタカーを借りて、苔と原生林に包まれた白谷雲水峡を歩く日帰りプランです。午後は宮之浦の町で昼食をとり、益救神社や屋久島環境文化村センターで島の歴史と自然を学んだら、志戸子ガジュマル公園と島の北の一湊の浜をめぐります。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(SHIRATANI, { h: 9, m: 0, stay: 180, legs: [], lat: 30.3799862, lng: 130.5741989, address: "鹿児島県熊毛郡屋久島町宮之浦",
    memo: "この旅は車でめぐります。宮之浦港の近くでレンタカーを借りて、車で約22分。標高600〜1,050mに広がる自然休養林で、渓流と、シダや苔に覆われた原生林の中を歩けます。弥生杉コース（約1時間）、奉行杉コース（約3時間）、太鼓岩までの往復（約4時間）があり、ここでは奉行杉コースを歩く時間をとっています。樹齢約3,000年の弥生杉をはじめ多くの屋久杉が見られ、有名なアニメ映画のモデルになったといわれる「苔むす森」は、太鼓岩へ向かう道の途中にあります。警報が出ているときは入れず、川が増水すると歩けるコースが限られます。雨具と歩きやすい靴を用意し、天気を確かめて出かけましょう。" }),
  cre("なごりの松原", { h: 12, m: 25, stay: 50, legs: [{ mode: "car", min: 25 }], lat: 30.4302272, lng: 130.5693804, address: "鹿児島県熊毛郡屋久島町宮之浦",
    memo: "白谷雲水峡から車で約25分、宮之浦港の入口へ。港を望み、島を離れていく船の人々を見送った地だったことが名の由来とされる、松林の公園です。まわりの宮之浦の町には食事の店があるので、このあたりで昼食にしましょう。" }),
  cre("益救神社", { h: 13, m: 20, stay: 20, legs: [{ mode: "walk", min: 5 }], lat: 30.4270508, lng: 130.5721078, address: "鹿児島県熊毛郡屋久島町宮之浦277",
    memo: "なごりの松原から歩いて約5分、宮之浦川の河口のそばへ。古くは延喜式神名帳に、日本の最も南の式内社として記された神社で、山の信仰のご神体を祀っています。境内には、町の文化財の仁王像や手水鉢もあります。" + PRAY }),
  cre("屋久島環境文化村センター", { h: 13, m: 50, stay: 50, legs: [{ mode: "walk", min: 10 }], lat: 30.4312852, lng: 130.5689141, address: "鹿児島県熊毛郡屋久島町宮之浦823-1",
    memo: "益救神社から歩いて約10分。屋久島の自然と文化、暮らしを、大型の映像やパネル、模型で分かりやすく紹介する施設です。山や森を歩いたあとに、島のなりたちをあらためて学べます。休館日は公式の案内で確かめましょう。" }),
  cre("志戸子ガジュマル公園", { h: 14, m: 55, stay: 40, legs: [{ mode: "walk", min: 5 }, { mode: "car", min: 10 }], lat: 30.4483138, lng: 130.5204258, address: "鹿児島県熊毛郡屋久島町志戸子",
    memo: "センターから、車を停めたなごりの松原へ歩いて戻り、車で約10分、宮之浦の西の志戸子へ（あわせて約15分）。海岸の近くに、ガジュマルと熱帯の植物が茂る公園で、遊歩道を10〜15分ほど歩くと、ガジュマルの群生を見られます。根や枝が入り組んでいるので、足元に気をつけましょう。" }),
  cre("一湊海水浴場", { h: 15, m: 50, stay: 40, legs: [{ mode: "car", min: 15 }], lat: 30.4551458, lng: 130.4958699, address: "鹿児島県熊毛郡屋久島町一湊",
    memo: "志戸子から車で約15分、島の最も北にある浜へ。北側の岬には赤い鳥居の矢筈嶽神社があり、西側には一湊の漁港があります。泳げるのは例年夏の間だけで、監視の時間も決まっているので、海に入るときは公式の案内を確かめましょう。帰りは、車で約15分の宮之浦港へ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== SHIRATANI) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "白谷雲水峡(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
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
