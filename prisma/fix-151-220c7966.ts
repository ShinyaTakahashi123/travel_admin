/**
 * #151 220c7966「塩屋埼灯台と勿来関、いわきの海沿い絶景と歌枕の地1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは各日1か所（10:00〜10:50 / 09:30〜10:20）で、昼食と宿・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「お楽しみください」）
 * 勿来関の座標（36.88399,140.78685）は JR勿来駅の位置だったので、勿来の関公園の中の点に直す
 * 車の旅（JRいわき駅前でレンタカーを借り、2日目にいわき駅で返す。いわき湯本温泉に泊まる）:
 *   1日目: 草野心平記念文学館 9:30 → 飯野八幡宮 → いわき駅前（昼食）→ 大國魂神社 → 甲塚古墳 → 塩屋埼灯台 → いわき震災伝承みらい館 16:30 → 湯本の宿
 *   2日目: 勿来の関公園 9:30 → 勿来関文学歴史館 → 小名浜港（昼食）→ 三崎公園 → いわき市考古資料館 → いわき市立美術館 16:30 → いわき駅
 * タイトル・季節はそのまま、説明文は書き直す
 * いわきのほかのしおり（24469e72 水族館・d7672ba8 ハワイアンズ）の本文を読み、使っていない話で書いた（塩屋埼灯台は初点灯の年・日本一の高さ・ひばり灯台の愛称・歌碑を使わず、
 *   光の届く距離と灯台50選、映画と震災からの復旧）。白水阿弥陀堂は公式の事実のほとんどを d7672ba8 が使っているので入れない。草野心平生家は OSM に点がない（GSI も大字まで）ので入れない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   museum.or.jp/museum/1179（草野心平記念文学館: 心平の故郷にある文学館・心平の詩に出てくる阿武隈山系の山々を眺められる・地球と同化したような建物・音や光で詩人の世界を体感・文学プラザで詩をつくれる・月曜休館）／
 *   kankou-iwaki.or.jp/spot/10015（飯野八幡宮: 康平6年に源頼義が石清水八幡を勧請して戦勝祈願・本殿、若宮八幡神社本殿、仮殿、神楽殿、唐門、楼門、宝蔵が国の重要文化財・400年続く流鏑馬は作占いのためといわれる・いわき駅から車で約6分）／
 *   /spot/10064（大國魂神社: 大国主命・延喜式内磐城七社の筆頭・創建年は未詳・周辺の甲塚古墳と推定樹齢1,000年の大杉・社殿は延宝8年で市の有形文化財）／
 *   /spot/10094（甲塚古墳: 6世紀後半と推定・直径37m、高さ約8.2mの円墳・冑を伏せた形から甲塚・国指定史跡・駐車場なし）／
 *   tohokukanko.jp/attractions/detail_1006536.html（塩屋埼灯台: 全国でも珍しい登ることのできる灯台・日本の灯台50選・高さ27m・毎15秒に1閃光・光達距離約40km・夕日の時間帯がおすすめ）／
 *   city.iwaki.lg.jp/www/contents/1481507493705/（塩屋埼灯台: 田中きよ氏の体験記が昭和32年に映画化・震災で灯塔やガラス、通路が破損・同年11月に再点灯・平成26年2月に一般公開を再開）／
 *   city.iwaki.lg.jp/www/contents/1586220344924/（いわき震災伝承みらい館: 令和2年5月30日に開館・旧豊間中学校の黒板などの実物・解体直前の校内のVR・地震・津波・原発事故のパネル・語り部の講話・月曜休館・入館16:30まで）／
 *   city.iwaki.lg.jp/www/contents/1001000001287/（勿来の関公園: 奥州三古関のひとつ・桜の名所の風致公園・紀貫之や小野小町が詠んだ歌枕・吹風殿と文学歴史館）／
 *   kankou-iwaki.or.jp/spot/10040（勿来関文学歴史館: 紀貫之、小野小町、和泉式部、西行法師などが詠んだ・歌人たちの作品と宿場町の再現、ゆかりの文学・歴史資料・源義家の銅像・寝殿造を再現した吹風殿・第3水曜休館）／
 *   kankou-iwaki.or.jp/spot/10272（三崎公園: 小名浜港の東の海上46mの台地・総面積70万㎡・海に突き出た展望台の潮見台・約200本のソメイヨシノ）／
 *   /spot/10036（いわき市考古資料館: 市内の遺跡から出土した約1,500点・縄文時代から江戸時代までの器・国史跡中田横穴の金や銀メッキの道具・3万年前の市内で最も古い道具の石斧・第3火曜休館）／
 *   /spot/10044（いわき市立美術館: 約2,300点・戦後の現代美術と地域ゆかりの美術・建築としての評価・入口にヘンリー・ムーアの彫刻・月曜休館・いわき駅から歩いて約15分）
 * 座標: OSM — 草野心平記念文学館 node 267616237（museum）・飯野八幡宮 node 4189362378（place_of_worship）・いわき駅 node 7899197762（railway=station）・甲塚古墳 node 12800012414（archaeological_site）・
 *   塩屋埼灯台 way 358960917（lighthouse）・みらい館 way 1029402268（museum）・三崎公園 way 477076896（park）・いわき市美術館 way 112004696（museum）（way は Nominatim の中心）／
 *   勿来の関公園は公園の点がないので、園内の源義家像 node 10293485258（artwork）・勿来関文学歴史館 node 2502326140（museum）・小名浜港は小名浜3号埠頭 node 3718531266／
 *   大國魂神社・考古資料館は OSM に名前つきの点がないので、国土地理院の番地の点（平菅波宮前26番地・常磐藤原町手這50番地）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-151-220c7966.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "220c7966-7d85-4c62-85d1-4a047bd57338";
const DAY1_ID = "bd98e016-b5ad-41ff-ae92-671df737a24f";
const DAY2_ID = "4008f651-1e59-487a-a77e-3d69843d58b4";
const SHIOYA = "6df725a1-cfca-4a2d-9d93-a7d0cdb9a5fe";
const NAKOSO = "e33d375c-e24b-4820-b86b-2434e66ad92b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "詩人・草野心平の文学館から、源頼義ゆかりの飯野八幡宮、古い社と古墳をめぐり、のぼれる塩屋埼灯台と震災伝承みらい館へ。2日目は、多くの歌人が詠んだ歌枕・勿来の関と文学歴史館、海を見下ろす三崎公園、考古資料館と美術館をたどる、車でめぐるいわきの海と文学の1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("草野心平記念文学館", { h: 9, m: 30, stay: 70, legs: [], lat: 37.1290363, lng: 140.8326483, address: "福島県いわき市小川町高萩下タ道1-39",
    memo: "この旅は車でめぐります。JRいわき駅前でレンタカーを借りて、車で約20分。詩人・草野心平の故郷、いわきの小川町に建つ文学館で、心平の詩にも出てくる阿武隈の山々を眺められます。大地と一つになったような形の建物の中で、音や光を使って心平の生涯と作品を紹介しています。文学プラザには、自分で詩をつくれるコーナーもあります。休館日は公式の案内で確かめましょう。" }),
  cre("飯野八幡宮", { h: 11, m: 0, stay: 40, legs: [car(20)], lat: 37.0603435, lng: 140.882108, address: "福島県いわき市平字八幡小路84",
    memo: "文学館から車で約20分、平の町へ。平安時代の康平6年（1063年）、源頼義が奥州へ向かう際に、石清水八幡をこの地に迎えて戦いの勝利を祈ったのが始まりと伝わる神社です。本殿や楼門、唐門をはじめ7棟の建物が国の重要文化財です。秋の例祭では、400年にわたって続くとされる流鏑馬が奉納されます。" + PRAY }),
  cre("いわき駅前（昼食）", { h: 11, m: 45, stay: 50, legs: [car(5)], lat: 37.0582102, lng: 140.8921829, address: "福島県いわき市平",
    memo: "八幡宮から車で約5分。駅のまわりで昼食にしましょう。" }),
  cre("大國魂神社", { h: 12, m: 47, stay: 38, legs: [car(12)], lat: 37.052441, lng: 140.938644, address: "福島県いわき市平菅波宮前26",
    memo: "駅前から車で約12分。大国主命をまつる神社で、延喜式に記された磐城の七つの社の筆頭にあげられています。建てられた年はわかっていませんが、近くの古墳や、樹齢1,000年と推定される大杉が、その古さを物語ります。今の社殿は延宝8年（1679年）に建てられたもので、市の有形文化財です。" + PRAY }),
  cre("甲塚古墳", { h: 13, m: 30, stay: 20, legs: [walk(5)], lat: 37.0532592, lng: 140.9419298, address: "福島県いわき市平荒田目甲塚",
    memo: "古墳には駐車場がないので、神社から歩いて約5分。6世紀後半につくられたと考えられる、直径37m、高さ約8.2mの円墳で、国の史跡です。かぶとを伏せたような形から「甲塚」と呼ばれています。古い時代のお墓なので、静かに外から眺めましょう。" }),
  upd(SHIOYA, { h: 14, m: 10, stay: 65, legs: [walk(5), car(15)], lat: 36.9950756, lng: 140.9817531, address: "福島県いわき市平薄磯宿崎34",
    memo: "大國魂神社に戻り、車で約15分、薄磯の海辺へ。中に入って上までのぼれる、全国でも珍しい灯台で、「日本の灯台50選」に選ばれています。15秒ごとに1回白く光り、その光は約40km先の海まで届きます。昭和32年（1957年）には、灯台で暮らした田中きよさんの体験記が映画になり、灯台が広く知られるきっかけになりました。東日本大震災では灯台も壊れましたが、その年の11月には再び明かりがともりました。このあたりは震災の津波に襲われた場所でもあるので、静かに歩きましょう。参観の時間は公式の案内で確かめましょう。" }),
  cre("いわき震災伝承みらい館", { h: 15, m: 18, stay: 72, legs: [car(3)], lat: 36.9994581, lng: 140.9785698, address: "福島県いわき市薄磯3-11",
    memo: "灯台から車で約3分。東日本大震災の記憶と教訓を伝えるために、令和2年（2020年）に開かれた施設です。津波で被災した旧豊間中学校の黒板などの実物や、解体される前の校舎の様子を再現したVRの映像、地震・津波・原発事故とその後を伝える展示があり、市内の語り部による講話も開かれています。亡くなった方々をしのびながら、静かに見学しましょう。休館日は公式の案内で確かめましょう。今夜は、車で約30分のいわき湯本温泉の宿に泊まります。" }),
];

const DAY2: X[] = [
  upd(NAKOSO, { h: 9, m: 30, stay: 45, legs: [], lat: 36.8685714, lng: 140.7809077, address: "福島県いわき市勿来町関田長沢",
    memo: "この日も車でめぐります。いわき湯本温泉の宿から車で約30分、茨城県との境に近い勿来へ。「奥州三古関」の一つ・勿来の関があったとされる地で、紀貫之や小野小町、和泉式部、西行など、多くの歌人が歌に詠んだ歌枕です。公園には、平安時代の武将・源義家の像や、勿来の関にちなむ歌の碑が並ぶ「詩歌の古道」、寝殿造を再現した「吹風殿」があり、春には桜の名所としても親しまれています。" }, "勿来の関公園"),
  cre("勿来関文学歴史館", { h: 10, m: 18, stay: 47, legs: [walk(3)], lat: 36.8667823, lng: 140.7804, address: "福島県いわき市勿来町関田長沢6-1",
    memo: "公園の中を歩いて約3分。勿来の関を詠んだ歌人たちの作品をはじめ、昔の宿場町を再現した展示や、この地にゆかりのある文学と歴史の資料を紹介する館です。館のそばには、「吹風をなこその関とおもへども」で始まる歌を詠んだと伝わる源義家の像も立っています。休館日は公式の案内で確かめましょう。" }),
  cre("小名浜港（昼食）", { h: 11, m: 35, stay: 50, legs: [car(30)], lat: 36.941964, lng: 140.8963985, address: "福島県いわき市小名浜",
    memo: "文学歴史館から車で約30分。港のまわりで昼食にしましょう。" }),
  cre("三崎公園", { h: 12, m: 33, stay: 52, legs: [car(8)], lat: 36.9397634, lng: 140.9230013, address: "福島県いわき市小名浜下神白字大作93",
    memo: "港から車で約8分。小名浜港の東、海から46mの高さの台地に広がる、約70万㎡の公園です。海に突き出た展望台「潮見台」からは、太平洋を足もとに見下ろせます。春には約200本のソメイヨシノが咲きます。崖の上なので、柵の外には出ないようにしましょう。" }),
  cre("いわき市考古資料館", { h: 13, m: 50, stay: 65, legs: [car(25)], lat: 36.994965, lng: 140.824951, address: "福島県いわき市常磐藤原町手這50-1",
    memo: "三崎公園から車で約25分。いわき市内の遺跡から出土した約1,500点の土器などを収め、縄文時代から江戸時代までの器を並べる資料館です。国の史跡・中田横穴から出た金や銀のめっきの道具や、約3万年前のものとされる、市内でいちばん古い道具の石斧が見どころです。休館日は公式の案内で確かめましょう。" }),
  cre("いわき市立美術館", { h: 15, m: 15, stay: 75, legs: [car(20)], lat: 37.0517627, lng: 140.8895943, address: "福島県いわき市平字堂根町4-4",
    memo: "資料館から車で約20分、平の町へ。戦後の国内外の現代美術と、いわきにゆかりのある美術を中心に、約2,300点の作品を収める美術館で、建物そのものも建築として評価されています。入口では、ヘンリー・ムーアの横たわる人の彫刻が迎えてくれます。休館日は公式の案内で確かめましょう。帰りは、いわき駅まで車で約5分、レンタカーを返しましょう。" }),
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
  const ids = it.days.map((d) => d.id + ":" + d.spots.map((s) => s.id).join());
  if (ids.join("|") !== `${DAY1_ID}:${SHIOYA}|${DAY2_ID}:${NAKOSO}`) throw new Error("構成が想定と違います");
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
