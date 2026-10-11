/**
 * #186 73d0b93a「西湖・本栖湖も。五つの湖を巡る富士五湖のんびりドライブ1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 2か所 09:30〜16:15（間が4時間あく）、2日目 本栖湖の1か所 09:30〜10:30 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「お疲れ様でございました」）。
 *   タイトルの「五つの湖」に合わせ、山中湖・河口湖・西湖・精進湖・本栖湖をすべてめぐるようにした。西湖いやしの里根場は2日目へ移す
 * 車の旅（富士急行線の河口湖駅の近くでレンタカーを借りて返す。河口湖のあたりに泊まる）:
 *   1日目: 新倉山浅間公園 9:30 → 山中湖花の都公園 → 忍野八海（昼食と散策）→ 長池親水公園 → 河口浅間神社 → 産屋ヶ崎 16:30 → 宿
 *   2日目: 富岳風穴 9:30 → 鳴沢氷穴 → 西湖野鳥の森公園 → 西湖いやしの里根場（昼食と散策）→ 精進湖（他手合浜）→ 本栖湖 → 山梨県立富士山世界遺産センター 16:30 → 河口湖駅
 * タイトルと季節はそのまま、説明文は書き直す
 * 富士五湖のほかのしおり（5c281775・62195fcc）の本文を読み、使っていない話で書いた
 *   （新倉山: 世界に知られる眺めと季節の彩り（忠霊塔の建立年や四天王寺の話、神社の創建は書かない）、忍野八海: 名水百選と天然記念物、根場: 手仕事の体験と砂防資料館（台風の年と棟数は書かない））。
 *   花の都公園・長池親水公園・河口浅間神社・産屋ヶ崎・富岳風穴・鳴沢氷穴・野鳥の森公園・精進湖・本栖湖・山梨県の世界遺産センターはほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（山梨県の観光公式サイト「富士の国やまなし」yamanashi-kankou.jp ほか）:
 *   kankou/spot/p1_4919.html 新倉山浅間公園（富士山と五重塔（忠霊塔）の世界的に知られる眺め・春の桜、秋のモミジや桜の紅葉）／
 *   course/nature/001.html（花の都公園: 標高1000mの高原、約30万㎡、屋外のお花畑と温室「ふらら」、清流の里・忍野八海: 八つの湧水池、全国名水百選、新富岳百景、国の天然記念物）／
 *   viewpoint/pub/pvp038.html 長池親水公園（山中湖の北岸、さえぎるものがない、山頂に太陽が重なる）／kankou/spot/p1_4445.html 河口浅間神社（864年の大噴火を鎮めるため翌年に浅間大神をまつって建立・
 *   世界遺産の構成資産・縁結びの神木）／kankou/spot/p1_3446.html 産屋ヶ崎（木花開耶姫命が出産したという伝説・逆さ富士）／kankou/spot/p1_4903.html 富岳風穴（青木ヶ原の溶岩洞穴で最も巨大な自然洞穴の一つ・
 *   全長201m、高さ8.7mの横穴・平均3℃・氷柱・玄武岩の壁が音を吸う）／kankou/spot/p1_4854.html 鳴沢氷穴（国指定天然記念物・タテ穴環状形・全長153m）／kankou/spot/p1_4611.html 西湖野鳥の森公園
 *   （ヤマガラ、ホオジロ、メジロなど何十種類もの野鳥）／saikoiyashinosatonenba.jp 西湖いやしの里根場（富士山を望む西湖の畔に茅葺屋根の家々・手仕事の体験・郷土の味・砂防資料館）／
 *   viewpoint/pub/pvp049.html 精進湖（世界遺産の構成資産・富士五湖で一番小さい・本栖湖と剗の海に9世紀の噴火の溶岩・子抱き富士）／kankou/spot/p1_4614.html 本栖湖（最も深く透明度が高い・
 *   北岸は好展望地・1000円札の裏の逆さ富士は中ノ倉峠から岡田紅陽が撮影・秋の紅葉）と viewpoint/pub/pvp048.html（中之倉峠まで徒歩30分ほど）／kankou/spot/whc.html と fujisan-whc.jp
 *   山梨県立富士山世界遺産センター（平成28年開館・南館と北館・大人も子どもも楽しく学べる・南館は毎月第4火曜休館・12〜2月は16:30まで）
 * 座標: OSM — 新倉山浅間公園 way 765997878・花の都公園 way 1153654786・長池親水公園 way 182491499・河口浅間神社 way 261988148・西湖野鳥の森公園 way 1457054585・
 *   山梨県立富士山世界遺産センター relation 17259559（Nominatim の中心）／忍野八海 node 4717364293（attraction）・産屋ヶ崎神社 node 1215752577・富岳風穴 node 7398711915（cave_entrance）・
 *   鳴沢氷穴 node 1867165622（cave_entrance）・いやしの里 根場 node 6462637885（viewpoint）・他手合浜 node 11953177732（viewpoint）・千円札富士山のビューポイント node 3571951598（viewpoint）（API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-186-73d0b93a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "73d0b93a-5979-41c5-8d67-3cdf7bbbf1da";
const DAY1_ID = "ad81b529-2934-48c9-99d6-296f4cee19e2";
const DAY2_ID = "eda82995-2f3b-4536-9c3f-ad73abe492bf";
const ARAKURA = "9c078f26-9a3c-480f-a240-d8c3777f7c92";
const NENBA = "706b0eee-2f3f-464f-a18e-9b8e2d6b6627";
const MOTOSU = "9ad4bccb-35f7-437f-a19b-26e60473ffb9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BEAR = "クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";

const DESCRIPTION =
  "1日目は新倉山浅間公園で五重塔と富士山を眺め、山中湖の花の都公園へ。忍野八海で昼食をとり、長池親水公園から河口湖の河口浅間神社と産屋ヶ崎をめぐります。2日目は富岳風穴と鳴沢氷穴、西湖の野鳥の森公園といやしの里根場、精進湖の子抱き富士、本栖湖をたずね、富士山世界遺産センターで締めくくる、五つの湖をめぐるドライブです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(ARAKURA, { h: 9, m: 30, stay: 60, legs: [], lat: 35.5004871, lng: 138.80082, address: "山梨県富士吉田市新倉3353-1",
    memo: "この旅は車でめぐります。富士急行線の河口湖駅の近くでレンタカーを借りて、車で約15分。新倉山の中腹にある公園で、ふもとの神社から続く長い石段を上った先に、朱色の五重塔「忠霊塔」と富士山が重なって見える展望デッキがあります。この眺めは、日本を代表する景色として世界的に知られています。春は桜、秋はモミジや桜の紅葉が、雪をかぶりはじめた富士山と塔をいろどります。石段は急なので、足元に気をつけて上りましょう。忠霊塔は、戦争で亡くなった方々をしのぶ塔です。" + PRAY }),
  cre("山中湖花の都公園", { h: 10, m: 55, stay: 60, legs: [car(25)], lat: 35.4395538, lng: 138.8528547, address: "山梨県南都留郡山中湖村山中",
    memo: "新倉山浅間公園から車で約25分。山中湖の近く、標高約1000mの高原に広がる約30万㎡の公園で、富士山を背にした屋外のお花畑に、季節ごとの花が咲きます。全天候型の温室「フローラルドーム ふらら」や、水辺を楽しめる「清流の里」もあります。花の見ごろは季節で変わるので、公式の案内で確かめましょう。" }),
  cre("忍野八海（昼食と散策）", { h: 12, m: 5, stay: 80, legs: [car(10)], lat: 35.4602407, lng: 138.8327032, address: "山梨県南都留郡忍野村忍草",
    memo: "花の都公園から車で約10分。富士山からの湧き水がつくる8つの池が点在する里で、全国名水百選に選ばれ、国の天然記念物にも指定されています。池のまわりには食事の店も並ぶので、ここで昼食にしましょう。食後は、透き通った水をたたえる池をひとつずつめぐりましょう。池の水に手を入れたり、物を投げ入れたりしないようにしましょう。今も人が暮らす集落です。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。" }),
  cre("長池親水公園", { h: 13, m: 45, stay: 30, legs: [car(20)], lat: 35.4270205, lng: 138.8713601, address: "山梨県南都留郡山中湖村平野",
    memo: "忍野八海から車で約20分。山中湖の北岸にある公園で、湖の向こうにさえぎるものがなく、山頂からすそ野まで広がる富士山を正面に眺められます。風のない日には、湖面に富士山が映ることもあります。季節によっては夕方に、富士山の頂に太陽が重なる「ダイヤモンド富士」が見られる場所としても知られます。" }),
  cre("河口浅間神社", { h: 14, m: 55, stay: 45, legs: [car(40)], lat: 35.5311055, lng: 138.7750037, address: "山梨県南都留郡富士河口湖町河口",
    memo: "長池親水公園から車で約40分、河口湖の北側へ。864年（貞観6年）の富士山の大噴火を鎮めるため、翌年に富士山の神・浅間大神をまつって建てられたと伝わる神社で、世界遺産「富士山」の構成資産の一つです。境内には「七本杉」と呼ばれる杉の巨木がそびえ、縁結びの木としても親しまれています。" + PRAY }),
  cre("産屋ヶ崎", { h: 15, m: 52, stay: 38, legs: [car(12)], lat: 35.5128456, lng: 138.7661291, address: "山梨県南都留郡富士河口湖町浅川",
    memo: "河口浅間神社から車で約12分。河口湖に突き出た小さな岬で、富士山の神とされる木花開耶姫命がここで子を産んだという伝説から、この名がついたといわれます。岬には小さな神社がまつられ、湖をはさんで富士山を望めます。風のない晴れた日には、湖面に映る「逆さ富士」が見られることもあります。" + PRAY + "この日は、河口湖のあたりの宿に泊まりましょう。" }),
];

const DAY2: X[] = [
  cre("富岳風穴", { h: 9, m: 30, stay: 40, legs: [], lat: 35.477501, lng: 138.657503, address: "山梨県南都留郡富士河口湖町西湖青木ヶ原",
    memo: "宿から車で約25分。富士山の溶岩流がつくった森にある溶岩洞穴の一つで、最も大きな自然の洞穴の一つとされます。全長約201m、高さ約8.7mの横穴で、中は一年を通して平均3℃ほど。冬から春にかけては天然の氷柱が見られます。玄武岩の壁が音を吸い込み、声が響きにくい静かな空間です。中は寒く、滑りやすく天井の低い所もあるので、上着を持ち、頭上と足元に気をつけましょう。" }),
  cre("鳴沢氷穴", { h: 10, m: 17, stay: 30, legs: [car(7)], lat: 35.4747915, lng: 138.6665393, address: "山梨県南都留郡鳴沢村",
    memo: "富岳風穴から車で約7分。溶岩が流れ出たあとにできた全長約153mの洞穴で、国の天然記念物です。縦穴を下りると、輪のようにぐるりとめぐる道が続き、洞内のさまざまな表情を見ながら歩けます。中は寒く、狭くて低い所もあるので、頭上と足元に気をつけましょう。" }),
  cre("西湖野鳥の森公園", { h: 11, m: 0, stay: 30, legs: [car(13)], lat: 35.4981348, lng: 138.6525993, address: "山梨県南都留郡富士河口湖町西湖",
    memo: "鳴沢氷穴から車で約13分、西湖の西へ。深い森に囲まれた公園で、ヤマガラやホオジロ、メジロなど、何十種類もの野鳥がすんでいます。耳をすませて鳥の声を聞きながら、森の小道を歩きましょう。野鳥には近づきすぎず、餌を与えないようにしましょう。" + BEAR }),
  upd(NENBA, { h: 11, m: 40, stay: 90, legs: [car(10)], lat: 35.5045005, lng: 138.6614299, address: "山梨県南都留郡富士河口湖町西湖根場2710",
    memo: "野鳥の森公園から車で約10分。富士山を望む西湖のほとりに、茅葺き屋根の家々が並ぶ里です。家々では、陶芸やお香づくりなどの手仕事を、教わりながら体験できます。土地に伝わる素朴な味を出す食事処もあるので、ここで昼食にしましょう。里の中には、この地の土砂災害の歴史を伝える砂防資料館もあります。災害の歴史を伝える場所でもあるので、静かに見学しましょう。" }, "西湖いやしの里根場（昼食と散策）"),
  cre("精進湖（他手合浜）", { h: 13, m: 30, stay: 30, legs: [car(20)], lat: 35.4907505, lng: 138.604504, address: "山梨県南都留郡富士河口湖町精進",
    memo: "根場から車で約20分。富士五湖でいちばん小さな湖とされ、世界遺産「富士山」の構成資産の一つです。富士山の噴火でできた湖に、9世紀の噴火で溶岩が流れ込み、今の形になったといわれます。北岸の他手合浜からは、手前の大室山を富士山が抱いているように見えることから、「子抱き富士」と呼ばれる眺めが広がります。" }),
  upd(MOTOSU, { h: 14, m: 15, stay: 40, legs: [car(15)], lat: 35.474015, lng: 138.5757863, address: "山梨県南巨摩郡身延町中ノ倉",
    memo: "精進湖から車で約15分。富士五湖でもっとも深く、水の透明度も高いといわれる湖です。北岸は富士山を望む展望地で、富士山の写真で知られる岡田紅陽が、ここから歩いて30分ほどの中ノ倉峠で湖面に映る富士山を撮った写真は、千円札の裏の図柄に使われています。秋には湖畔が紅葉にいろどられます。峠への山道を歩くときは、" + BEAR }),
  cre("山梨県立富士山世界遺産センター", { h: 15, m: 30, stay: 60, legs: [car(35)], lat: 35.4858719, lng: 138.7706593, address: "山梨県南都留郡富士河口湖町船津6663-1",
    memo: "本栖湖から車で約35分、河口湖の南へ。富士山の世界遺産登録を受けて開かれた県の施設で、南館と北館の2つの建物で、富士山の信仰や文化、自然を、大人も子どもも楽しみながら学べます。旅でめぐった湖や神社が、富士山とどのように結びついているかを確かめられます。休館日と開館時間は公式の案内で確かめましょう。帰りは、車で約5分の河口湖駅へ戻り、車を返しましょう。" }),
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
    it.days[0].spots.map((s) => s.id).join() !== [ARAKURA, NENBA].join() ||
    it.days[1].spots.map((s) => s.id).join() !== MOTOSU
  )
    throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.spot.update({ where: { id: NENBA }, data: { dayId: DAY2_ID, orderNo: 901 } });
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
