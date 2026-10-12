/**
 * #239 0c07189d「堀切峠のドライブと道の駅フェニックス、日南海岸の絶景1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 堀切峠 10:00〜10:40・2日目 道の駅フェニックス 9:30〜10:20 の各1か所で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内」「お楽しみください」）。
 * 日南海岸のほかのしおり（af30d135・1d72e477・d6c081e8: 青島・堀切峠・道の駅フェニックス・サンメッセ日南・鵜戸神宮・飫肥城下町・道の駅なんごう）と
 *   行き先がなるべく重ならないように、日南海岸を南へ、油津・串間・都井岬までたどり、帰りに飫肥の個々の施設に寄る形にした（企画運営と相談、2026-10-11）。
 *   重なる堀切峠・道の駅フェニックス・道の駅なんごうは、ほかのしおりの本文を読んで、使っていない話で書いた
 * タイトルを内容に合わせて「堀切峠から都井岬の野生馬へ、油津と飫肥をめぐる日南海岸ドライブ1泊2日」に変える
 * 車の旅（宮崎空港の近くでレンタカーを借りて返す）:
 *   1日目 堀切峠 9:00 → 道の駅フェニックス（2日目から移す）→ 堀川運河 → 油津赤レンガ館 → 道の駅くしま（昼食）→ 旧吉松家住宅 → 幸島 → 御崎神社 15:50 → 串間の宿
 *   2日目 都井岬灯台 9:00 → 都井岬（御崎馬）→ 道の駅なんごう（昼食）→ 小村記念館 → 豫章館 → 松尾の丸 → 飫肥城歴史資料館 16:30 → 宮崎空港
 *   都井岬観光交流館 PAKALAPAKA は OSM に点がない（旧ホテルの跡地。OSM の「うまの館」は別の建物）ので、昼食は道の駅なんごうにした
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   宮崎市観光協会 https://www.miyazaki-city.tourism.or.jp/spot/10006 堀切峠（国道220号・波状岩と太平洋・フェニックス）／
 *     https://www.miyazaki-city.tourism.or.jp/spot/10005 道の駅フェニックス（約20本のフェニックス・ジャカランダ、ブーゲンビリア・マンゴーや日向夏のソフトクリーム）
 *   日南市観光協会 https://www.kankou-nichinan.jp/tourisms/<番号>/ — 316 堀川運河（飫肥杉の運搬・1683年着工、1686年完成・伊東祐実の命・28か月・延長1450m）／
 *     310 夢見橋（樹齢120年の飫肥杉と飫肥石・金属を使わない木組み）／314 油津赤レンガ館（大正11年・油津の豪商の家の人が建てた煉瓦造2階建ての倉庫・アーチ天井の通路）／
 *     277 道の駅なんごう（地元で水揚げされるマグロやカツオの料理のレストラン）／252 小村寿太郎記念館（外務大臣を2度・1905年ポーツマス条約・令和4年3月に新しく）／
 *     355 豫章館（藩主の住まいになった武家屋敷・南側の庭は九州でも有数・名前は大きな楠から）／344 松尾の丸（江戸時代初期の上級武士の暮らしを再現・昭和54年・樹齢100年を超える杉・蒸し風呂）／
 *     300 飫肥城歴史資料館（伊東家・1588年から明治4年まで飫肥を治めた・甲冑や刀剣・プロジェクションマッピングやCGで町並み）
 *   串間市 https://www.city.kushima.lg.jp/enjoy/touristspots/ — cat6/post-27 道の駅くしま（ぶりにこだわった料理の食事処）／cat2/post-19 旧吉松家住宅（主屋など5件が国の登録有形文化財・休館日あり）／
 *     cat2/post-20 幸島（野生のニホンザル約100頭・1953年に小猿がサツマイモを小川で洗い始めた「イモ洗い」）／cat2/post-16 都井岬灯台（九州で唯一参観できる灯台・強風や台風のときは参観できない）／
 *     cat2/post-15 御崎馬（近づかない・後ろから近づかない）／cat2/post-18 ソテツ自生地（約3,000本・北限）
 *   みやざき観光ナビ https://www.kanko-miyazaki.jp/spot/1023 御崎神社（都井岬の先の断崖の中腹・綿津見神・航海安全・ソテツ・鳥居から本殿まで下りの階段）／
 *     https://www.kanko-miyazaki.jp/spot/1002 都井岬（日南海岸国定公園の南端・江戸時代に放たれた馬）／
 *     https://www.kanko-miyazaki.jp/feature/toimisaki-guide （馬から5〜10m以上離れる・えさを与えない）、串間市 cat2/post-15（300年以上、繁殖を自然に任せる）
 *   たびよみ https://tabi-mag.jp/mz0057/ （幸島は石波海岸の沖合約200m・対岸から島を望む・サルに近づかない、えさは厳禁）
 * 座標: OSM — 堀切峠 node 6697181787（Horikiri Pass）・御崎神社 node 3895288758・旧吉松家住宅 node 6060323304・小村記念館 node 1423870026・都井岬 node 6337163474（node は API で名前つきを確かめた）／
 *   道の駅フェニックス way 436887076・堀川運河 relation 13614511・道の駅くしま way 915136279・幸島 relation 8399663・都井岬灯台 way 181212469・道の駅なんごう way 436646833・
 *   豫章館 way 399803041・松尾の丸 way 399448847・飫肥城歴史資料館 way 399448850（Nominatim の中心）／国土地理院の番地の点 — 油津赤レンガ館（油津一丁目9番3号）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-239-0c07189d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0c07189d-03ef-438f-9d27-1cc1a01a262e";
const DAY1 = "3c847a03-5d67-4730-801c-4edfe926f37f";
const DAY2 = "4cb22477-20b1-4be0-b926-b776e08a376e";
const HORIKIRI = "f3e35b62-e7fb-4bfe-867e-e194d395dc69";
const PHOENIX = "73e4fb5b-1b9d-42ec-9a54-b72492fd8608";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "堀切峠から都井岬の野生馬へ、油津と飫肥をめぐる日南海岸ドライブ1泊2日";
const DESCRIPTION =
  "堀切峠から日南海岸を南へ。油津の堀川運河と赤れんがの倉庫、串間の旧家の屋敷やサルの島・幸島をめぐり、都井岬で灯台と野生の御崎馬に会います。帰りは飫肥で、明治の外交官の記念館や武家屋敷を訪ねる、レンタカーの1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type Item = ReturnType<typeof upd> | ReturnType<typeof cre>;

const D1: Item[] = [
  upd(HORIKIRI, { h: 9, m: 0, stay: 30, legs: [], lat: 31.7766693, lng: 131.4822108, address: "宮崎県宮崎市内海",
    memo: "この旅は車でめぐります。宮崎空港の近くでレンタカーを借りて、海沿いを南へ車で約30分。日南海岸を南へたどる旅の入り口になる峠で、高台から、波の形のように筋の入った岩が海岸線に沿って続くようすと、その先の太平洋を見渡せます。道沿いはフェニックスの並木です。車の行き来が多いので、車は駐車場に停め、道を渡るときは気をつけましょう。" }),
  upd(PHOENIX, { h: 9, m: 35, stay: 30, legs: [car(5)], lat: 31.7688886, lng: 131.478289, address: "宮崎県宮崎市内海381-1",
    memo: "峠から車で約5分。海を見下ろす高台の道の駅で、約20本のフェニックスに、ジャカランダやブーゲンビリアが加わって、南の国らしい庭になっています。売店には宮崎の産物が並び、日向夏の味のソフトクリームもあります。ここから先は、油津まで海沿いの道を走ります。" }),
  cre("堀川運河", { h: 10, m: 55, stay: 45, legs: [car(50)], lat: 31.588042, lng: 131.403606, address: "宮崎県日南市油津",
    memo: "道の駅から海沿いを南へ、車で約50分の油津へ。江戸時代、飫肥藩が飫肥杉を港まで運ぶためにつくった運河で、藩主・伊東祐実の命で天和3年（1683年）に掘り始め、28か月かけて貞享3年（1686年）に完成しました。長さは約1,450mあります。運河にかかる夢見橋は、樹齢120年の飫肥杉と飫肥石を使い、くぎなどの金属を使わない木組みで造られた屋根つきの橋です。水辺では足元に気をつけましょう。" }),
  cre("油津赤レンガ館", { h: 11, m: 45, stay: 20, legs: [walk(5)], lat: 31.583591, lng: 131.402863, address: "宮崎県日南市油津1-9-3",
    memo: "運河から歩いて約5分。大正11年（1922年）に、油津の豪商の家の人が建てた、れんが造り2階建ての倉庫です。中は、アーチ形の天井の通路をはさんで2つの部屋に分かれ、部屋の入口もアーチ形で、大正時代のモダンな雰囲気が残ります。開いている時間は公式の案内で確かめましょう。" }),
  cre("道の駅くしま", { h: 12, m: 55, stay: 50, legs: [walk(5), car(45)], lat: 31.4625979, lng: 131.2279344, address: "宮崎県串間市大字西方",
    memo: "車へ歩いて戻り、南へ車で約45分（あわせて約50分）の串間へ。串間の産物が集まる道の駅で、食事処では、地元のぶりにこだわった料理を味わえます。ここで昼食にしましょう。" }),
  cre("旧吉松家住宅", { h: 13, m: 50, stay: 40, legs: [car(5)], lat: 31.4640207, lng: 131.2290872, address: "宮崎県串間市大字西方5509-イ",
    memo: "道の駅から車で約5分。串間の旧家・吉松家の屋敷で、主屋や蔵、表門と塀など5件が、国の登録有形文化財になっています。座敷や蔵を見てまわり、かつての暮らしぶりにふれましょう。休館日があるので、公式の案内で確かめましょう。" }),
  cre("幸島", { h: 14, m: 55, stay: 30, legs: [car(25)], lat: 31.4525768, lng: 131.375683, address: "宮崎県串間市大字市木",
    memo: "屋敷から車で約25分、石波の浜へ。沖合約200mに浮かぶ周囲約3.5kmの小さな島で、約100頭の野生のニホンザルが暮らしています。1953年に1頭の子ザルが、サツマイモについた土を小川で洗い始めると、ほかのサルたちもまねるようになった「イモ洗い」で、世界に知られるようになりました。対岸の浜から島を眺めましょう。サルを見かけても近づきすぎず、食べ物を与えないようにしましょう。" }),
  cre("御崎神社", { h: 15, m: 55, stay: 35, legs: [car(30)], lat: 31.3618306, lng: 131.3423991, address: "宮崎県串間市大納",
    memo: "幸島から車で約30分、都井岬へ。岬の先の断崖の中腹にある神社で、海の神・綿津見神をまつり、昔から漁や船の仕事をする人たちに、航海の安全の神として信仰されてきました。まわりには約3,000本のソテツが茂り、ここが自然に育つソテツの北の端とされています。鳥居から本殿までは下りの階段が続くので、足元に気をつけましょう。" + PRAY + "今夜は、車で約30分の串間の町の宿に泊まります。" }),
];

const D2: Item[] = [
  cre("都井岬灯台", { h: 9, m: 0, stay: 45, legs: [], lat: 31.3674145, lng: 131.3458054, address: "宮崎県串間市大納",
    memo: "串間の宿から、車で約30分の都井岬へ。白い灯台は、九州で唯一中を見学できる灯台とされ、上から日向灘と岬の草原を見渡せます。強い風や台風のときは入れないので、見学の時間とあわせて公式の案内で確かめましょう。" }),
  cre("都井岬", { h: 9, m: 50, stay: 60, legs: [car(5)], lat: 31.3670127, lng: 131.3417673, address: "宮崎県串間市大納",
    memo: "灯台から車で約5分。日南海岸国定公園の南の端にある岬で、広い草原に、国の天然記念物の野生の馬・御崎馬が暮らしています。江戸時代に放された馬の子孫で、300年以上、繁殖を自然に任せて生きてきました。馬に近づきすぎず（5〜10m以上はなれる）、食べ物を与えないようにしましょう。とくに後ろから近づくのはやめましょう。岬の道では馬が道に出てくることもあるので、車はゆっくり走りましょう。" }),
  cre("道の駅なんごう", { h: 11, m: 45, stay: 50, legs: [car(55)], lat: 31.5030142, lng: 131.3785752, address: "宮崎県日南市南郷町大字贄波3220-24",
    memo: "都井岬から海沿いを北へ、車で約55分。南郷の高台の道の駅で、レストランでは地元で水揚げされるマグロやカツオを使った料理を味わえます。ここで昼食にしましょう。" }),
  cre("小村記念館", { h: 13, m: 5, stay: 50, legs: [car(30)], lat: 31.6273269, lng: 131.3527356, address: "宮崎県日南市飫肥4-2-20-1",
    memo: "道の駅から車で約30分、飫肥の町へ（近くの駐車場に車を停めて歩きます）。明治時代に外務大臣を2度つとめた小村寿太郎の記念館で、小村は、日露戦争を終わらせた1905年のポーツマス条約を結んだ人物です。令和4年に新しくなり、映像や展示でその歩みをたどれます。" }),
  cre("豫章館", { h: 14, m: 0, stay: 45, legs: [walk(5)], lat: 31.627153, lng: 131.3512788, address: "宮崎県日南市飫肥9-1-1",
    memo: "記念館から歩いて約5分。飫肥藩の家臣の屋敷で、明治のはじめに藩主がここに移り住みました。名前は、屋敷にあった大きな楠にちなみます。南側の庭は、広さと手入れのよさで九州でも有数のものとされています。" }),
  cre("松尾の丸", { h: 14, m: 50, stay: 40, legs: [walk(5)], lat: 31.627951, lng: 131.3508104, address: "宮崎県日南市飫肥10-1-1",
    memo: "豫章館から歩いて約5分。江戸時代のはじめの上級武士の暮らしを再現した屋敷で、昭和54年に、樹齢100年を超える杉を使って建てられました。湯殿は、ヒノキを使った蒸し風呂のつくりで、今のサウナのようなしくみが見られます。" }),
  cre("飫肥城歴史資料館", { h: 15, m: 35, stay: 55, legs: [walk(5)], lat: 31.6281573, lng: 131.3513504, address: "宮崎県日南市飫肥10",
    memo: "松尾の丸から歩いてすぐ。天正16年（1588年）から明治のはじめまで飫肥を治めた伊東家ゆかりの品を展示する資料館で、戦国時代の甲冑や刀などが並び、映像で城下町の町並みも紹介しています。帰りは、車で約60分の宮崎空港の近くでレンタカーを返しましょう。" }),
];

function show(label: string, items: Item[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of items) {
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
  if (it.days.map((d) => d.id).join() !== [DAY1, DAY2].join() || it.days[0].spots.map((s) => s.id).join() !== HORIKIRI || it.days[1].spots.map((s) => s.id).join() !== PHOENIX)
    throw new Error("構成が想定と違います");
  show("1日目", D1);
  show("2日目", D2);
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.spot.update({ where: { id: PHOENIX }, data: { dayId: DAY1, orderNo: 901 } });
      await setDaySpotOrder(DAY1, D1, { tx });
      await setDaySpotOrder(DAY2, D2, { tx });
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
