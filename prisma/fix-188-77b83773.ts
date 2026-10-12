/**
 * #188 77b83773「彦根城の紅葉とライトアップ、じっくり型の彦根1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 2か所 10:00〜19:00（玄宮園を18:00の夜に訪ねる）、2日目 1か所 09:30〜10:30 で、昼食の一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。
 *   9時〜17時の決まりに合わせて夜の玄宮園はやめ、タイトルの「ライトアップ」を外して、紅葉の寺社をめぐる内容にした。
 *   夢京橋キャッスルロードの写真は「彦根城と桜」の写真（Hikone_Castle_and_Sakura）で、通りの写真ではないので外す。キャッスルロードは1日目へ移す
 * #248（11c84229、彦根城・玄宮園・宗安寺・キャッスルロード・龍潭寺・長寿院・天寧寺）と書き分ける: 彦根の町は午前だけにして、#248 の行き先（宗安寺・龍潭寺・長寿院・天寧寺）は使わず、
 *   午後と2日目は車で湖東三山（西明寺・金剛輪寺・百済寺）と永源寺、多賀大社へ。彦根城・玄宮園・キャッスルロードは、#248 と彦根のほかの2本（4d332b95・ebe67d3c）が使っていない話で書いた
 *   （彦根城: 太鼓門櫓・西の丸三重櫓・馬屋、玄宮園: 4つの中島と楽々園、キャッスルロード: 招き猫の言い伝え）。埋木舎・湖東三山・永源寺・多賀大社はほかのしおりにない
 * 1日目は歩き、午後から車（JR彦根駅の近くでレンタカーを借りて返す。彦根に泊まる）:
 *   1日目: 彦根城 9:30 → 玄宮園 → 埋木舎 → 夢京橋キャッスルロード（昼食）→ 西明寺 → 金剛輪寺 16:30 → 彦根の宿
 *   2日目: 永源寺 9:30 → 百済寺 → 多賀大社の門前（昼食）→ 多賀大社 → 彦根城博物館 16:35 → 彦根駅
 * タイトルを「彦根城と湖東三山の紅葉、永源寺と多賀大社もめぐる1泊2日」に、季節は秋のまま、説明文は書き直す
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   hikonecastle.com/about.html 彦根城公式（太鼓門櫓: 本丸表口をかためる櫓門、合図の太鼓・西の丸三重櫓: 搦め手からの敵に備えた守りの要・馬屋: 馬21頭、城内に残る馬屋は全国で彦根城だけ・
 *   玄宮園: 池泉に大小4つの中島、さまざまな橋で回遊・楽々園: 延宝5年に直興が造営した下屋敷・埋木舎: 井伊直弼が青春時代を過ごした舎）／
 *   yumekyobashi.jp 夢京橋キャッスルロード（招き猫の街・2代藩主井伊直孝が鷹狩りの帰りに豪徳寺の門前で猫に招かれた）／
 *   saimyouji.com 西明寺（834年、仁明天皇・三修上人・国宝の本堂と三重塔・信長の焼き討ちを逃れた仏像・江戸中期の蓬萊庭は国の名勝、紅葉と苔）／
 *   kongourinji.jp と /precinct 金剛輪寺（国宝の本堂大悲閣は弘安11年（1288）・参道の千体地蔵・血染めのもみじ・拝観は16:30まで）／
 *   eigenji-t.jp と /about/ 永源寺（康安元年（1361）佐々木六角氏頼が寂室元光禅師に帰依して創建・臨済宗永源寺派大本山・僧俗二千人あまり・明応と永禄に焼失・紅葉ライトアップ・参拝時間は季節で変動）／
 *   hyakusaiji.jp/about/・/precincts/ 百済寺（推古14年（606）聖徳太子の勅願・近江最古の仏教寺院・湖東の小叡山・元亀4年（1573）信長の焼き討ち・慶安3年（1650）本堂、仁王門、赤門を再建・
 *   昭和15年（1940）喜見院の庭園・紅葉の名所）／taga-kankou.com/eat_buy/ 多賀観光協会（糸切餅の店、食事の店）／tagataisya.or.jp/about/ 多賀大社（伊邪那岐大神・伊邪那美大神・お多賀さん・
 *   延命長寿、縁結び、厄除け・元正天皇としでの木の杓子「お多賀杓子」・秀吉が米一万石を奉納、太閤橋と奥書院庭園・秋の奥書院の紅葉）と奥書院庭園の拝観中止のお知らせ／
 *   hikone-castle-museum.jp/about/・/collection/ 彦根城博物館（表御殿跡・井伊家伝来の約4万5千点、収蔵9万1千件超・朱色の甲冑・直忠の能面と能装束・湖東焼・直亮の楽器・国宝彦根屏風・入館16:30まで）
 * 座標: OSM — 彦根城 way 209262408（historic=castle）・玄宮園 way 585543133・夢京橋キャッスルロード way 180831396・西明寺 way 183559737・金剛輪寺 way 183561240・百済寺 way 183562887・
 *   絵馬通り way 123676161・多賀大社 way 263769633・彦根城博物館 way 363244231（Nominatim の中心）／埋木舎 node 582527746（museum）・永源寺 node 1939667916（place_of_worship）（API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-188-77b83773.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "77b83773-6635-47f0-a22b-ec99cf45b91e";
const DAY1_ID = "2c6b06c6-2bfd-434b-b50e-fa061487cc27";
const DAY2_ID = "700c33db-968b-42e4-8415-6aa2190fd7ba";
const CASTLE = "59906d9e-c817-4fe8-a032-95da5cf2ee71";
const GENKYUEN = "34559022-5293-46a2-8ba8-2c2925d7842c";
const CASTLEROAD = "d495ec46-12a9-4483-9427-a42fbf3f303a";
const REMOVE_PHOTOS = ["9c133763-03f0-47c6-b88f-8ef6e2fff9db"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "彦根城と湖東三山の紅葉、永源寺と多賀大社もめぐる1泊2日";
const DESCRIPTION =
  "1日目は彦根城と玄宮園、井伊直弼が若いころを過ごした埋木舎を歩き、夢京橋キャッスルロードで昼食。午後は車で湖東三山の西明寺と金剛輪寺へ。2日目は永源寺と百済寺の古刹をめぐり、多賀大社の門前で昼食をとってお参りし、彦根城博物館で締めくくる、紅葉の季節の1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(CASTLE, { h: 9, m: 30, stay: 100, legs: [], lat: 35.2771014, lng: 136.2517174, address: "滋賀県彦根市金亀町1-1",
    memo: "1日目の午前は歩いてめぐります。JR彦根駅から歩いて約15分。天守へ向かう途中の太鼓門櫓は、本丸の表口を固める門で、城の中に合図を送る太鼓を置いたことからその名がついたといわれます。西の丸の三重櫓は、城の裏手から攻めてくる敵に備えた守りの要でした。表門の近くに残る馬屋には、藩主などの馬21頭がつながれていたといわれ、城の中に残る馬屋は全国でも彦根城だけとされる珍しい建物です。天守の階段は急なので、手すりにつかまって上り下りしましょう。" }),
  upd(GENKYUEN, { h: 11, m: 15, stay: 45, legs: [walk(5)], lat: 35.2783831, lng: 136.2540432, address: "滋賀県彦根市金亀町",
    memo: "彦根城から歩いて約5分。池の中に大小4つの島を築き、形のちがう橋をいくつも架けて、ぐるりと自由にめぐれるようにした大名庭園です。となりの楽々園は、4代藩主・井伊直興が延宝5年（1677年）につくったと伝わる下屋敷のあとです。池のまわりの道は水辺に近いので、足元に気をつけましょう。" }),
  cre("埋木舎", { h: 12, m: 7, stay: 30, legs: [walk(7)], lat: 35.2756183, lng: 136.2565319, address: "滋賀県彦根市尾末町",
    memo: "玄宮園から堀ばたを歩いて約7分。のちに幕府の大老となる井伊直弼が、青春時代を過ごした屋敷です。堀に面した静かな屋敷で、若き日の直弼の暮らしをしのべます。公開の日と時間は公式の案内で確かめましょう。" }),
  upd(CASTLEROAD, { h: 12, m: 50, stay: 50, legs: [walk(13)], lat: 35.2710421, lng: 136.251558, address: "滋賀県彦根市本町1丁目",
    memo: "埋木舎から堀に架かる京橋を渡って歩いて約13分。「招き猫の街」を名のる通りで、2代藩主・井伊直孝が鷹狩りの帰りに、江戸の豪徳寺の門前で猫に招かれたという言い伝えにちなんでいます。食事の店が並ぶので、ここで昼食にしましょう。今も人が暮らす通りなので、静かに歩きましょう。" }, "夢京橋キャッスルロード（昼食）"),
  cre("西明寺", { h: 14, m: 25, stay: 60, legs: [walk(15), car(30)], lat: 35.1833433, lng: 136.28475, address: "滋賀県犬上郡甲良町池寺",
    memo: "午後は車でめぐります。キャッスルロードから彦根駅へ歩いて約15分、駅の近くでレンタカーを借りて、車で約30分（あわせて約45分）。834年に仁明天皇の願いで三修上人が開いたと伝わる天台宗の寺で、本堂と三重塔は国宝です。本堂の奥には、戦国時代の焼き討ちを逃れた仏像がまつられています。江戸時代の中ごろにつくられた「蓬萊庭」は国の名勝で、苔と秋の紅葉が美しい庭です。" + PRAY }),
  cre("金剛輪寺", { h: 15, m: 35, stay: 55, legs: [car(10)], lat: 35.1612816, lng: 136.2830436, address: "滋賀県愛知郡愛荘町松尾寺874",
    memo: "西明寺から車で約10分。鎌倉時代の弘安11年（1288年）に建てられた本堂「大悲閣」は国宝で、本堂へ続く参道には、全国の人々が願いを込めて納めた千体地蔵が並びます。秋には境内のもみじが深い赤に染まり、「血染めのもみじ」として知られます。本堂までは坂道を上るので、足元に気をつけましょう。拝観の時間は公式の案内で確かめましょう。" + PRAY + "この日は、車で約30分の彦根へ戻り、宿に泊まりましょう。" }),
];

const DAY2: X[] = [
  cre("永源寺", { h: 9, m: 30, stay: 70, legs: [], lat: 35.0805847, lng: 136.3199926, address: "滋賀県東近江市永源寺高野町",
    memo: "宿から車で約50分。南北朝時代の康安元年（1361年）、近江の守護・佐々木六角氏頼が、高僧・寂室元光に深く帰依して伽藍を建てたのが始まりの、臨済宗永源寺派の大本山です。開山のころには、その徳を慕って二千人あまりの人々が集まったといわれます。戦乱で二度にわたって伽藍が焼け落ちましたが、今も山あいに禅の道場が続いています。秋には紅葉のライトアップも行われます。参拝の時間は季節で変わるので、公式の案内で確かめましょう。" + PRAY }),
  cre("百済寺", { h: 10, m: 55, stay: 80, legs: [car(15)], lat: 35.1268273, lng: 136.2915123, address: "滋賀県東近江市百済寺町",
    memo: "永源寺から車で約15分。推古14年（606年）に聖徳太子の願いで開かれたと伝わり、近江で最も古い寺の一つとされます。のちに天台宗となって「湖東の小叡山」と呼ばれるほど栄えました。戦国時代の焼き討ちで全山を失いましたが、江戸時代の慶安3年（1650年）に本堂や仁王門、朱塗りの赤門などが建て直されました。本坊の喜見院には昭和15年（1940年）につくられた庭園があり、紅葉の名所としても知られます。参道には石段があるので、足元に気をつけましょう。" + PRAY }),
  cre("多賀大社の門前（昼食）", { h: 12, m: 45, stay: 50, legs: [car(30)], lat: 35.2247696, lng: 136.2893544, address: "滋賀県犬上郡多賀町多賀",
    memo: "百済寺から車で約30分、多賀大社へ続く絵馬通りへ。まわりには名物の糸切餅の店や食事の店があるので、ここで昼食にしましょう。今も人が暮らす町なので、静かに歩きましょう。" }),
  cre("多賀大社", { h: 13, m: 37, stay: 90, legs: [walk(2)], lat: 35.2253779, lng: 136.2904718, address: "滋賀県犬上郡多賀町多賀604",
    memo: "門前から歩いてすぐ。伊邪那岐大神と伊邪那美大神をまつり、「お多賀さん」の名で親しまれる神社です。命の親神であることから、延命長寿や縁結び、厄除けの神として信仰を集めてきました。病の元正天皇に、しでの木の杓子を添えて強飯を差し上げたところ、たちまち治ったという言い伝えから、「お多賀杓子」が知られています。豊臣秀吉が母の病が治るよう祈って米一万石を納め、太閤橋や奥書院庭園はその奉納でつくられたと伝わります。秋には奥書院の紅葉も見事です。奥書院庭園は拝観が休みの日もあるので、公式の案内で確かめましょう。" + PRAY }),
  cre("彦根城博物館", { h: 15, m: 35, stay: 60, legs: [car(20), walk(8)], lat: 35.2756156, lng: 136.2535668, address: "滋賀県彦根市金亀町",
    memo: "多賀大社から車で約20分、彦根城のそばの駐車場から歩いて約8分（あわせて約28分）。代々の藩主・井伊家に伝わった約4万5千点の美術工芸品や古文書を中心に、9万1千件をこえる資料を収める博物館です。戦場を朱色でいろどった甲冑、15代井伊直忠が集めた能面と能装束、12代井伊直亮が集めた楽器、江戸時代の後期に彦根で焼かれた湖東焼などを見られ、国宝の彦根屏風も収蔵品の一つです。入館の時間と休館日は公式の案内で確かめましょう。帰りは、車で彦根駅へ戻り、車を返しましょう。" }),
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
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    it.days.length !== 2 ||
    it.days[0].id !== DAY1_ID ||
    it.days[1].id !== DAY2_ID ||
    it.days[0].spots.map((s) => s.id).join() !== [CASTLE, GENKYUEN].join() ||
    it.days[1].spots.map((s) => s.id).join() !== CASTLEROAD
  )
    throw new Error("構成が想定と違います");
  const cr = it.days[1].spots[0].photos;
  if (cr.map((p) => p.id).join() !== REMOVE_PHOTOS.join() || cr.some((p) => p.url === it.thumbnailUrl)) throw new Error("外す写真が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.photo.deleteMany({ where: { id: { in: REMOVE_PHOTOS } } });
      await tx.spot.update({ where: { id: CASTLEROAD }, data: { dayId: DAY1_ID, orderNo: 901 } });
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
