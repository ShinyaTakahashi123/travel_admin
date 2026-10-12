/**
 * #150 20a8c441「リトルワールドと日本モンキーパーク、犬山の体験型テーマパーク1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは各日1か所（10:00〜12:00 / 09:30〜11:00）で、本文は案内の話し方（「皆様」「ご案内いたします」）
 * 企画運営の判断（案A、docs/content/20261011-kikaku-to-hojo2.md）: 2つのテーマパークは残し、開いている時間に合わせて朝と夕方に近くの場所を足す。説明文の「サルの動物園」は外し、遊園地として書く
 *   となりの日本モンキーセンター（動物園）は 10月19日から当面休園（j-monkey.jp/news/20260313notice.html）。遊園地は通常営業（japan-monkeypark.jp のお知らせ）
 *   リトルワールドは毎日10時開館・閉館と休館日は日によって違う、遊園地も日によって時間と休園日が違うので、「公式の案内で確かめましょう」と書く（日付・曜日は書かない）
 * 車の旅（名鉄犬山駅前でレンタカーを借りて返す。犬山に泊まる）:
 *   1日目: 大縣神社 9:30 → リトルワールド（本館展示）→ リトルワールド（昼食）→ リトルワールド（野外展示）→ 尾張冨士大宮浅間神社 16:30 → 犬山の宿
 *   2日目: 桃太郎神社 9:30 → 寂光院 → 犬山遊園駅前（昼食）→ 日本モンキーパーク → 東之宮古墳 16:30 → 犬山駅
 * タイトル・季節はそのまま、説明文は書き直す。犬山城・城下町・有楽苑・明治村・入鹿池（cd007650・531bd99f・4f2248ea）は使わない。足した場所はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   littleworld.jp/about/（1983年開館・本館は70以上の国と地域の約6,000点、進化・技術・言語・社会・価値の5つのテーマ・野外展示は23の国と地域の31棟、一周約2.5km、実在の家屋の移築か建材を輸入し大工を招いて復元・
 *   世界のグルメ、民族衣装の試着）と littleworld.jp/info/calendar/（開館は10:00、閉館と休館日は日による）／japan-monkeypark.jp（遊園地・30種類以上のアトラクション・大観覧車・営業時間は日による）／
 *   aichinow.pref.aichi.jp/spots/detail/177/（大縣神社: 尾張国の開拓の祖神・大縣大神・尾張の二宮・本宮山頂から今の地へ・寛文元年に2代藩主徳川光友が再興・三棟造、大縣造と呼ばれる他に類のない様式・昭和56年に国の重要文化財）／
 *   inuyama.gr.jp/experience/detail/19/（大宮浅間神社: 木花開耶姫命、子どもの守護神・20歳まで神の預け子とする習わし・東に入鹿池、西に濃尾平野を見下ろす尾張冨士に鎮座・天下の奇祭の石上げ祭）と
 *   inuyama.gr.jp/event/detail/4/（江戸時代に祭神が村人の夢に現れ本宮山より低いことを嘆いた背比べ伝説）／aichinow.pref.aichi.jp/spots/detail/178/（桃太郎神社: 犬山に伝わる桃太郎伝説・洗濯岩・浅野祥雲のコンクリート像・宝物館・犬山城から木曽川上流約3.3km）／
 *   inuyama.gr.jp/experience/detail/17/（寂光院: 白雉5年に孝徳天皇の勅願で道昭が七堂伽藍・約1,000本のモミジ、尾張のもみじでら・木曽川沿いから本堂まで約15分・四国八十八ヶ所の本尊と弘法大師の石仏・
 *   本堂脇の展望台から犬山城、小牧城、岐阜城、伊吹山、鈴鹿山脈・8:00〜17:00）／inuyama.gr.jp/experience/detail/22/（東之宮古墳: 白山平山（標高143m）の山頂・全長約72mの前方後方墳・愛知県下で最古級・1700年以上・
 *   三角縁神獣鏡などが出土し国の重要文化財・遊歩道と解説看板・常時開放・犬山遊園駅から徒歩15分）
 * 座標: OSM — 大縣神社 node 2438580425・桃太郎神社 node 2035809170・寂光院 node 2042502299（place_of_worship）・犬山遊園駅 node 8125180581（station）／
 *   大宮浅間神社 way 498258714・日本モンキーパーク way 243183188（park）・東之宮古墳 way 1549889316（archaeological_site）・野外民族博物館リトルワールド way 243023740（theme_park）（Nominatim の中心）。
 *   リトルワールドの中には名前つきの点がないので、本館展示・昼食・野外展示の3つとも園全体の点
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-150-20a8c441.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "20a8c441-9e14-4ed5-a2ed-667a9350e79f";
const DAY1_ID = "8b0faa98-65ba-4ce2-83d7-b3d230ddcf41";
const DAY2_ID = "8c5d5faa-6302-41ba-a604-61ed538c68bf";
const LW = "5f1617a3-53b8-4448-b910-252085c8f985";
const MP = "6780ceb8-e46a-4c46-9b32-8690fe8c7123";
const LW_PT = { lat: 35.3739815, lng: 137.0257062 };
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "尾張の二宮・大縣神社から、世界各地の家が並ぶ野外民族博物館リトルワールドへ。尾張冨士の大宮浅間神社にもお参りします。2日目は桃太郎伝説の桃太郎神社と、もみじの寺・寂光院をめぐり、遊園地の日本モンキーパークで遊んで、山の上の東之宮古墳へ。車でめぐる犬山の1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("大縣神社", { h: 9, m: 30, stay: 35, legs: [], lat: 35.330152, lng: 136.9669995, address: "愛知県犬山市宮山3",
    memo: "この旅は車でめぐります。名鉄犬山駅前でレンタカーを借りて、車で約20分。尾張の国を開いた祖先の神・大縣大神をまつる神社で、「尾張の二宮」として親しまれています。本宮山の山頂から今の場所にまつられて、長い歴史を重ねてきたと伝わります。本殿は、寛文元年（1661年）に尾張藩2代藩主・徳川光友が建て直したもので、「大縣造」と呼ばれる、ほかに例のない形とされ、国の重要文化財です。" + PRAY }),
  upd(LW, { h: 10, m: 20, stay: 70, legs: [car(15)], ...LW_PT, address: "愛知県犬山市今井成沢90-48",
    memo: "大縣神社から車で約15分。1983年に開かれた野外民族博物館で、開館は朝10時です。まず本館展示へ。70をこえる国と地域から集めた約6,000点の資料を、「進化・技術・言語・社会・価値」の5つのテーマで紹介していて、世界の人々の暮らしを広く見渡せます。閉館の時間と休館日は日によって違うので、公式の案内で確かめましょう。" }, "リトルワールド（本館展示）"),
  cre("リトルワールド（昼食）", { h: 11, m: 35, stay: 50, legs: [walk(5)], ...LW_PT, address: "愛知県犬山市今井成沢90-48",
    memo: "本館から園内へ歩いてすぐ。園内には世界各地の料理を味わえるところがあるので、ここで昼食にしましょう。" }),
  cre("リトルワールド（野外展示）", { h: 12, m: 30, stay: 180, legs: [walk(5)], ...LW_PT, address: "愛知県犬山市今井成沢90-48",
    memo: "昼食のあとは野外展示へ。一周約2.5kmの道に沿って、23の国と地域の31棟の建物が並びます。実際の家を移したり、建材を現地から取り寄せ、現地の大工を招いて建てたりして、復元したものです。民族衣装を着てみる体験もあります。一周すると長い道のりなので、歩きやすい靴で、ときどき休みながらめぐりましょう。" }),
  cre("尾張冨士大宮浅間神社", { h: 15, m: 45, stay: 45, legs: [car(15)], lat: 35.3445367, lng: 136.98443, address: "愛知県犬山市富士山3",
    memo: "リトルワールドから車で約15分。東に入鹿池、西に濃尾平野を見下ろす尾張冨士にまつられた神社で、子どもの守り神・木花開耶姫命をまつります。子どもを20歳まで神の「預け子」として、無事な成長を祈る習わしが伝わります。江戸時代に、祭神が村人の夢に現れて、となりの本宮山より低いことを嘆き、山頂に石を積み上げれば願いをかなえると告げたという「背比べ」の言い伝えがあり、「天下の奇祭」と呼ばれる石上げ祭のもとになっています。" + PRAY + "今夜は、犬山の宿に泊まります。" }),
];

const DAY2: X[] = [
  cre("桃太郎神社", { h: 9, m: 30, stay: 35, legs: [], lat: 35.4052849, lng: 136.9662459, address: "愛知県犬山市栗栖古屋敷",
    memo: "この日も車でめぐります。宿から、犬山城から木曽川を約3.3kmさかのぼったところへ。犬山に伝わる桃太郎伝説をまつる神社で、おばあさんが洗濯をしたという「洗濯岩」なども案内されています。境内には、コンクリート像の作家として知られる浅野祥雲がつくった、桃太郎伝説の像がたくさん並びます。宝物館の時間は公式の案内で確かめましょう。" + PRAY }),
  cre("寂光院", { h: 10, m: 25, stay: 45, legs: [car(5), walk(15)], lat: 35.3962939, lng: 136.9620095, address: "愛知県犬山市継鹿尾杉ノ段12",
    memo: "桃太郎神社から車で約5分、木曽川沿いから参道を歩いて約15分で本堂へ。白雉5年（654年）、孝徳天皇の願いで道昭和尚が建てたのが始まりと伝わる寺です。約1,000本のモミジがあり、「尾張のもみじでら」とも呼ばれます。参道には、四国八十八か所の本尊と弘法大師の石仏が並びます。本堂わきの展望台からは、犬山城や岐阜城、遠くの伊吹山まで見渡せます。参道は石段が続くので、足元に気をつけましょう。" + PRAY }),
  cre("犬山遊園駅前（昼食）", { h: 11, m: 35, stay: 50, legs: [walk(15), car(10)], lat: 35.3907595, lng: 136.9469197, address: "愛知県犬山市",
    memo: "参道を下り、車で約10分、名鉄犬山遊園駅のあたりへ（あわせて約25分）。駅のまわりで昼食にしましょう。" }),
  upd(MP, { h: 12, m: 30, stay: 180, legs: [car(5)], lat: 35.3908229, lng: 136.956519, address: "愛知県犬山市犬山官林26",
    memo: "駅前から車で約5分。小さな子どもも楽しめる乗り物が30種類以上そろう遊園地で、大観覧車もあります。乗り物に乗るときは、係の人の案内に従いましょう。営業の時間と休園日は日によって違うので、公式の案内で確かめましょう。となりのサルの動物園は、施設の整備のため休園しています。" }, "日本モンキーパーク（遊園地）"),
  cre("東之宮古墳", { h: 15, m: 50, stay: 40, legs: [car(5), walk(15)], lat: 35.3900617, lng: 136.9509085, address: "愛知県犬山市犬山北白山平6",
    memo: "遊園地から車で山のふもとへ行き、遊歩道を歩いて約15分。標高143mの白山平山の山頂にある、全長約72mの前方後方墳で、愛知県で最も古いものの一つとされます。つくられてから1700年以上たちますが、形がよく残っています。三角縁神獣鏡などの鏡が見つかり、国の重要文化財になっています。遊歩道には解説の看板があります。古い時代のお墓なので、静かに外から眺めましょう。帰りは、名鉄犬山駅まで車で約10分、レンタカーを返しましょう。" }),
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
  console.log(`対象: ${it.title} [${it.status}] 季節 ${it.seasons.join(",")}`);
  const ids = it.days.map((d) => d.id + ":" + d.spots.map((s) => s.id).join());
  if (ids.join("|") !== `${DAY1_ID}:${LW}|${DAY2_ID}:${MP}`) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
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
