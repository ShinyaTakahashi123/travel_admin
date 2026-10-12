/**
 * #177 5c3502b5「旧金毘羅大芝居「金丸座」と琴平の門前町、歴史ある芝居小屋1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 1か所 10:00〜10:50、2日目 1か所 09:30〜10:30 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「お楽しみいただけたことでしょう」）。
 * タイトルを内容に合わせて「金丸座と琴平の門前町、こんぴら参りと宇多津・多度津をめぐる1泊2日」に変える
 * 琴平町のほかのしおり（f6221e55・e9a900e3・d2cbf909）の本文を読み、使っていない話で書いた
 *   （金陵の郷: 1789年の白壁の酒蔵・くすのき広場、金丸座: 市立ちの仮設小屋から常小屋へ・富くじの開札場・移築復原・ブドウ棚とかけすじ、金刀比羅宮: 石段沿いの建物と宝物館・ロケ地、
 *    海洋博物館: 弁財船・操船の体験・屋外の巡視艇）。2日目の多度津・宇多津はほかのしおりにない（郷照寺は承認待ちの af26590b にあるが、使っていない話で書いた）。
 *   丸亀（8c8c6db8・e9a900e3）と善通寺（f6221e55・e9a900e3）は重なるので行かない。合田邸は内部の公開が不定期で、OSM にも点がないので入れない
 * もとの2日目の「琴平門前町」(fc59bd80) を1日目の昼食に移す
 * 電車と歩きの旅（JR琴平駅から。こんぴら温泉郷に泊まる）:
 *   1日目: 金陵の郷 9:30 → 旧金毘羅大芝居（金丸座）→ 琴平の門前町（昼食）→ 金刀比羅宮 → 琴平海洋博物館 16:30 → こんぴら温泉郷の宿
 *   2日目: 桃陵公園 9:30 → 郷照寺 → 宇夫階神社 → うたづ海ホタル（昼食）→ 復元塩田 → ゴールドタワー 16:30 → JR宇多津駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（香川県観光協会 うどん県旅ネット https://www.my-kagawa.jp/point/<番号>/）:
 *   73 金陵の郷（金刀比羅宮の参道口・寛政元年(1789)の白壁の酒蔵を復元・くすのき広場・歴史館と文化館で江戸時代の酒造りを人形と道具で再現）／72 金丸座（天保6年(1835)・年3回の市立ちの仮設小屋から
 *   常小屋へ・富籤の開札場を兼ねた・明治33年に金丸座・昭和45年に重要文化財・昭和47年から4年かけて移築復原・平成15年度の大改修でブドウ棚とかけすじを復原・公演のときは見学不可）／
 *   75 金刀比羅宮（海の神様・御本宮まで785段・大門、五人百姓、重要文化財の書院、旭社・宝物館に第一級の美術品・参道にうどんや土産物の店・映画のロケ地・表書院と宝物館は16:30まで）／
 *   74 琴平海洋博物館（表参道の脇・1階に弁財船・船舶模型や綿絵、世界地図・操船シミュレーター・屋外に巡視艇あらかぜ・入場は16:30まで）／78 こんぴら温泉郷／
 *   243 桃陵公園（桜1,500本・12個のベルのカリヨン・瀬戸内海の展望台・山を一周する遊歩道と文学碑）／319 郷照寺（第78番札所・行基の開創・厄除けうたづ大師・真言宗と時宗の両宗を奉ずる札所で唯一）／
 *   318 道の駅 うたづ臨海公園（瀬戸大橋の眺め・うたづ海ホタルにカフェ・復元塩田で入浜式の塩づくり体験は13:30〜15:00、要予約）／322 ゴールドタワー（高さ158m・金色のハーフミラー・展望フロアのソラキン）
 *   香川旅帖 https://www.my-kagawa.jp/blog/blog-20220318h 宇夫階神社（現在地に移って約1,200年といわれる・日本書紀に名・大己貴命・本殿は伊勢神宮外宮の別宮 多賀宮の旧正殿を復元、国の登録有形文化財・
 *   本殿裏の磐境は直径4m、高さ5.5m、推定300t以上）
 *   国土交通省 多言語解説文 https://www.mlit.go.jp/tagengo-db/R2-01900.html 宇多津の古街（室町時代以降の港町・細長い町家は1800年代半ば以降）
 *   多度津町 https://www.town.tadotsu.kagawa.jp/kanko_bunka_event/kanko/2615.html（桃陵公園でイノシシの目撃・近づかず静かに立ち去る）・/kanko/2245.html（園内で見つかった新品種「桃陵八重桜」）
 * 座標: OSM — 金陵の郷 way 566013323・旧金毘羅大芝居 way 570442011・金刀比羅宮 way 139583694・海の科学館 way 1160847109・桃陵公園 way 591281533・第78番札所 郷照寺 way 604212160・
 *   宇夫階神社 way 530446697・うたづ海ホタル way 561468605・復元塩田 way 563781536・プレイパークゴールドタワー way 454967176（Nominatim の中心）／鞘橋 node 6323396538（API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-177-5c3502b5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5c3502b5-0318-4f0d-bb31-797899970ef5";
const DAY1_ID = "b909e14a-b678-44dd-95be-5e7bb28fc9aa";
const DAY2_ID = "cdadba22-63f3-4dbd-a893-5d53792baae8";
const KANAMARU = "2c6091e9-44a5-4bb8-870f-196da00a9ba9";
const MONZEN = "fc59bd80-c193-4b26-844a-8b031bf940b7";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "金丸座と琴平の門前町、こんぴら参りと宇多津・多度津をめぐる1泊2日";
const DESCRIPTION =
  "1日目は、白壁の酒蔵の金陵の郷と、日本最古とされる芝居小屋・金丸座を見学し、門前町で讃岐うどんの昼食。午後は金刀比羅宮の石段を上り、こんぴら参りの船を伝える海洋博物館へ寄って、こんぴら温泉郷に泊まります。2日目は電車で多度津の桃陵公園へ。宇多津の古い港町で郷照寺と宇夫階神社にお参りし、塩田とゴールドタワーをめぐる1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("金陵の郷", { h: 9, m: 30, stay: 40, legs: [], lat: 34.1878263, lng: 133.8184797, address: "香川県仲多度郡琴平町623",
    memo: "この旅は電車と歩きでめぐります。JR琴平駅から歩いて約10分。金刀比羅宮の参道の入り口にある酒蔵の資料館で、酒造りを始めたころの寛政元年（1789年）の白壁の蔵を、そのままの姿に復元しています。大きな楠がそびえる「くすのき広場」を囲む「歴史館」と「文化館」では、江戸時代の酒造りの工程を、人形と当時の道具で再現しています。" }),
  upd(KANAMARU, { h: 10, m: 20, stay: 60, legs: [walk(10)], lat: 34.184617, lng: 133.8180025, address: "香川県仲多度郡琴平町1241",
    memo: "金陵の郷から歩いて約10分。天保6年（1835年）に建てられた芝居小屋で、今残る芝居小屋としては日本最古とされます。もとは年に3回の市が立つたびに仮の小屋で歌舞伎などを上演していましたが、こんぴら参りがさかんになるにつれて常設の小屋が求められ、富くじの抽選の場も兼ねて建てられました。昭和45年に国の重要文化財となり、昭和47年から4年かけて今の場所へ移されました。平成15年度の修理では、調べてわかった跡をもとに、「ブドウ棚」や「かけすじ」と呼ばれる舞台の仕掛けが復原されています。公演のある時期は見学できないので、公式の案内で確かめましょう。" }),
  upd(MONZEN, { h: 11, m: 30, stay: 50, legs: [walk(10)], lat: 34.1856427, lng: 133.8216501, address: "香川県仲多度郡琴平町",
    memo: "金丸座から歩いて約10分。金倉川に架かる鞘橋のあたりから、金刀比羅宮へ向かう表参道にかけて、土産物やうどんの店が並ぶ門前町です。ここで讃岐うどんの昼食にしましょう。午後は長い石段を上るので、しっかり食べて、ひと休みしておきましょう。" }),
  cre("金刀比羅宮", { h: 12, m: 30, stay: 160, legs: [walk(10)], lat: 34.1839885, lng: 133.8093897, address: "香川県仲多度郡琴平町892-1",
    memo: "門前町から表参道を歩いて約10分で、石段の上り口へ。古くから「こんぴらさん」と呼ばれ、海の神様として信仰を集めてきた神社です。御本宮までは785段の石段が続き、その途中には大門や五人百姓の店、国の重要文化財の書院や旭社が並びます。宝物館には、第一級の美術品や文化財が並んでいます。境内は、いくつもの映画のロケ地にもなりました。表書院や宝物館の入館の時間は、公式の案内で確かめましょう。石段は長いので、体調に合わせて無理をせず、休みながら上りましょう。" + PRAY }),
  cre("琴平海洋博物館", { h: 15, m: 30, stay: 60, legs: [walk(20)], lat: 34.1863214, lng: 133.8178117, address: "香川県仲多度郡琴平町953",
    memo: "石段を下り、表参道の脇へ歩いて約20分。海の守り神のこんぴらさんにちなむ、船と海の博物館です。1階には、江戸時代にこんぴら参りの人たちが乗った弁財船が展示され、各階には船の模型や船の機械、江戸時代の後半の絵や世界地図などが並びます。船を操る体験の装置もあり、屋外には実物の巡視艇も置かれています。この日は、近くのこんぴら温泉郷の宿に泊まりましょう。宿のお風呂では、ほかの人を写さず、長湯を避けて、こまめに水分をとりましょう。" }),
];

const DAY2: X[] = [
  cre("桃陵公園", { h: 9, m: 30, stay: 50, legs: [], lat: 34.2679395, lng: 133.7450241, address: "香川県仲多度郡多度津町桃山",
    memo: "宿からJR琴平駅へ歩き、土讃線で約15分の多度津駅へ。駅から歩いて約20分。瀬戸内海を見渡す丘の公園で、春には町の花でもある桜が約1,500本咲きます。園内で見つかった新しい品種の桜は「桃陵八重桜」と名づけられました。12個のベルが童謡を奏でる時計「カリヨン」や展望台があり、山を一周する遊歩道には、多度津ゆかりの文人たちの文学碑が並びます。園内ではイノシシが見かけられたこともあるので、出会ったら近づかず、ゆっくりと離れましょう。" }),
  cre("郷照寺", { h: 11, m: 10, stay: 35, legs: [walk(20), train(10, "JR予讃線"), walk(20)], lat: 34.3066897, lng: 133.8242113, address: "香川県綾歌郡宇多津町1435",
    memo: "桃陵公園から多度津駅へ戻り、予讃線で約10分の宇多津駅へ。駅から南へ歩いて約20分（あわせて約50分）。四国八十八ヶ所の第78番札所で、奈良時代に行基が開いたと伝えられます。弘法大師が自らの像を刻んで厄除けを願ったことから、「厄除けうたづ大師」として信仰を集めるようになったといわれます。また、真言宗と時宗の両方を奉ずる、四国の札所でただ一つの寺とされます。寺のある宇多津の「古街」は、室町時代から港町として栄えた地区で、1800年代の半ば以降に建てられた細長い町家が、今も通り沿いに残っています。町並みには今も人が暮らしているので、静かに歩きましょう。" + PRAY }),
  cre("宇夫階神社", { h: 11, m: 55, stay: 30, legs: [walk(10)], lat: 34.3081603, lng: 133.8206563, address: "香川県綾歌郡宇多津町",
    memo: "郷照寺から古街を歩いて約10分。宇多津の氏神で、今の場所に移って約1,200年になるといわれ、日本書紀にも名が見られる神社です。大己貴命をまつり、本殿は、伊勢神宮の外宮の別宮・多賀宮の旧正殿を受けて復元したもので、国の登録有形文化財です。本殿の裏には、直径約4m、高さ約5.5mの巨石「磐境」があり、古代の祭りの跡と伝えられます。" + PRAY }),
  cre("うたづ海ホタル（昼食）", { h: 12, m: 45, stay: 40, legs: [walk(20)], lat: 34.3134855, lng: 133.8078604, address: "香川県綾歌郡宇多津町浜一番丁4",
    memo: "宇夫階神社から海の方へ歩いて約20分。道の駅になっている宇多津臨海公園の中の施設で、特産品の売り場やカフェがあります。瀬戸大橋を眺めながら、ここで昼食にしましょう。宇多津の名産の塩や、古代米を使った料理もあります。" }),
  cre("復元塩田", { h: 13, m: 30, stay: 90, legs: [walk(5)], lat: 34.313252, lng: 133.807464, address: "香川県綾歌郡宇多津町浜一番丁4",
    memo: "うたづ海ホタルから歩いてすぐ。昔ながらの入浜式の塩田を復元した場所で、海水から塩をつくる体験ができます。体験は時間が決まっていて予約が要るので、公式の案内で確かめましょう。公園には海沿いの遊歩道もあり、瀬戸大橋がよく見えます。岸壁では、海に近づきすぎないようにしましょう。" }),
  cre("ゴールドタワー", { h: 15, m: 10, stay: 80, legs: [walk(10)], lat: 34.3114161, lng: 133.8084225, address: "香川県綾歌郡宇多津町浜一番丁8-1",
    memo: "塩田から歩いて約10分。外壁に金色のハーフミラーを使った、高さ158mの展望塔です。展望フロアの「ソラキン」では、きらめく光と金魚を組み合わせた水槽や、緑と熱帯魚の空間を、瀬戸内の景色とともに楽しめます。上から、午後に歩いた塩田や瀬戸大橋を眺めてみましょう。帰りは、歩いて約8分のJR宇多津駅へ向かいましょう。" }),
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
  if (
    it.days.length !== 2 ||
    it.days[0].id !== DAY1_ID ||
    it.days[1].id !== DAY2_ID ||
    it.days[0].spots.map((s) => s.id).join() !== KANAMARU ||
    it.days[1].spots.map((s) => s.id).join() !== MONZEN
  )
    throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.spot.update({ where: { id: MONZEN }, data: { dayId: DAY1_ID, orderNo: 901 } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2, { tx });
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
