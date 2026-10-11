/**
 * #176 5c0f7bb4「厳島神社、海に浮かぶ朱塗りの大鳥居を望む定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:50 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「お楽しみいただけたことでしょう」）。
 *   大鳥居を「8代目」と書いていたが、宮島観光協会は「9代目にあたるとされ」なので直す
 * 宮島のほかのしおり（78026dc9・3155fabf・e0181f83）の本文を読み、使っていない話で書いた
 *   （厳島神社: 神の島ゆえ潮の満ち引きする所に建てた・廻廊の床板のすき間・客神社・鏡の池、宝物館: 能と舞楽の装束と面、千畳閣: 金箔の軒瓦・大鳥居再建の尺杖・天井の絵馬、
 *    紅葉谷公園: もみじの種類と色づくしくみ・庭園砂防の趣意書、弥山: 本堂の宗盛の梵鐘・求聞持堂・三鬼堂・平成25年の展望台、三笠浜: 大鳥居の大きさ・笠木の小石・千本杭・額）
 *   五重塔は令和8年12月まで工事中で見られないので、行き先にしない（千畳閣の本文で、公式の案内で確かめる一文にした）
 * 船・ロープウエーと歩きの旅（JR宮島口駅からフェリーで渡り、宮島桟橋から歩く）:
 *   厳島神社 9:30 → 宝物館 → 千畳閣（豊国神社）→ 表参道商店街（昼食）→ 紅葉谷公園 → 弥山本堂・三鬼堂 → 弥山展望台 → 三笠浜（大鳥居）16:50 → 宮島桟橋
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（宮島観光協会 https://www.miyajima.or.jp/sightseeing/<名前>.html）:
 *   ss_itsukushima 嚴島神社（島全体が神の島で、陸地では畏れ多いと潮の満ち引きする所に社殿・寝殿造・宗像三女神・廻廊は約260m・床板は1間に8枚で釘を使わず、すき間が波の力を弱める・
 *     釣灯籠は毛利氏の寄進が始まりといわれる・客神社は祭典がここから始まる・鏡の池は厳島八景の一つで潮が引くと丸い池が現れる）／ss_homotsukan 宝物館（国宝・重要文化財が約260点・平家納経、刀剣、
 *     鎧兜、能と舞楽の装束と面など・昭和8年の建物でコンクリートに漆）／ss_goju 豊国神社（857畳・軒瓦に金箔・大鳥居再建工事の尺杖・天井に絵馬・祭神は秀吉と清正・五重塔は令和8年12月まで工事中）／
 *     ss_street 表参道商店街（80店以上・牡蠣料理やアナゴ料理・もみじまんじゅう・杓子や宮島彫り）／ss_shamoji 大杓子（杓子発祥の地）／ss_momiji 紅葉谷公園（約700本、イロハカエデ約560本、
 *     オオモミジ約100本・アントシアニン・昭和20年の枕崎台風の土石流・岩石公園築造趣意書: 石材はほかの土地から運ばず現地のもの、庭園師に仕事をしてもらう）／ss_misen 弥山（本堂は806年弘法大師の開基・
 *     平宗盛が寄進した梵鐘は国の重要文化財・求聞持堂は日本三大道場・三鬼堂は日本唯一の鬼の神様・掲額は伊藤博文の直筆・弥山展望台は平成25年12月完成、スギ、360度、四国連山）／
 *     ss_ootorii 大鳥居（社殿から約160m・高さ16.6m・約60t・木造の鳥居で日本最大とされる・9代目とされ明治8年の再建・笠木と島木に約4tの小石・千本杭・主柱は楠・額は沖側と本社側で文字が違う）／
 *     ss_sunset 御笠浜（大鳥居と陸がいちばん近い所）
 *   宮島ロープウエー https://miyajima-ropeway.info/（紅葉谷線約10分・獅子岩線約4分・上り9:00〜16:00・下り16:30まで・特定日は乗車予約）
 * 座標: OSM — 厳島神社 way 1306168429・金鳥居の辻 way 1549344759・三笠浜 厳島神社入り江 way 1563153220・弥山本堂 way 142668872（name は英語の「Misen Honda Main Shrine」だけ）
 *   （Nominatim の中心）／厳島神社宝物館 node 1423629059・豊国神社 node 4198369467・紅葉谷公園 node 5152466741・弥山山頂展望台 node 520028211（node は API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-176-5c0f7bb4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5c0f7bb4-409e-465e-9231-1c33c54bc05f";
const DAY_ID = "af9318ba-1b4d-46ef-b9a6-7353439c9226";
const SHRINE = "111ea897-6dcb-4a8b-847c-f8d186f903b8";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "フェリーで宮島へ渡り、潮の満ち引きする浜に建つ厳島神社と宝物館、豊臣秀吉が建て始めた千畳閣をめぐって、表参道商店街で昼食。午後は紅葉谷公園からロープウエーで弥山へ上がり、本堂や三鬼堂、山頂の展望台からの眺めを楽しみ、最後は御笠浜から海に立つ大鳥居を眺める日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(SHRINE, { h: 9, m: 30, stay: 70, legs: [], lat: 34.2965274, lng: 132.3190065, address: "広島県廿日市市宮島町1-1",
    memo: "この旅は船とロープウエー、歩きでめぐります。JR宮島口駅の近くの桟橋からフェリーで約10分、宮島桟橋から海沿いを歩いて約12分。島のシカは野生の動物なので、近づきすぎず、食べ物を与えないようにしましょう。宮島は昔から島そのものが神としてあがめられ、陸地に建てるのは畏れ多いとして、社殿は潮の満ち引きする浜に建てられたといわれます。寝殿造の社殿をつなぐ廻廊は、東西あわせて約260m。床板は釘を使わずに敷かれ、板と板のすき間が、潮が高いときに押し寄せる波の力をやわらげます。神社の祭りは、摂社の中でいちばん大きい客神社から始まります。潮が引くと、廻廊の東側の海の中に、厳島八景の一つ「鏡の池」が丸く現れます。" + PRAY }),
  cre("厳島神社宝物館", { h: 10, m: 43, stay: 30, legs: [walk(3)], lat: 34.2949054, lng: 132.3186393, address: "広島県廿日市市宮島町",
    memo: "神社の出口から歩いて約3分。厳島神社には、国宝や重要文化財が約260点伝わり、ここではその一部を展示しています。平家一門が納めた「平家納経」をはじめ、刀剣や鎧兜のほか、今も神社に伝わる能や舞楽の装束と面も見られます。" }),
  cre("千畳閣（豊国神社）", { h: 11, m: 21, stay: 25, legs: [walk(8)], lat: 34.2973208, lng: 132.3202671, address: "広島県廿日市市宮島町",
    memo: "宝物館から神社の前を通って、丘の上へ歩いて約8分。豊臣秀吉が建て始めた大きな経堂で、857畳の畳を敷けるほどの広さがあります。軒の瓦には金箔が押されていて、完成していれば、桃山時代らしい豪華な建物になっていたと考えられています。中には大鳥居を建て直す工事で使われた長いものさし「尺杖」が置かれ、天井には多くの絵馬が掲げられています。今は秀吉と加藤清正をまつる神社です。隣の五重塔は、修理の工事で見られないことがあるので、公式の案内で確かめましょう。" + PRAY }),
  cre("表参道商店街（昼食）", { h: 11, m: 51, stay: 50, legs: [walk(5)], lat: 34.2974406, lng: 132.321619, address: "広島県廿日市市宮島町",
    memo: "千畳閣から石段を下りて約5分。厳島神社へ続く参道に、80以上の店が並ぶ商店街です。牡蠣やアナゴの料理を出す店も多いので、ここで昼食にしましょう。宮島は杓子が生まれた地ともいわれ、通りには杓子や宮島彫りなどの土産物、もみじまんじゅうの店も並びます。" }),
  cre("紅葉谷公園", { h: 13, m: 1, stay: 30, legs: [walk(20)], lat: 34.2938092, lng: 132.3250384, address: "広島県廿日市市宮島町紅葉谷",
    memo: "商店街から山の方へ歩いて約20分。弥山のふもとの谷に、イロハカエデ約560本、オオモミジ約100本などのもみじが茂る公園です。春から夏にかけて葉にためた養分が、霜の降りる秋にアントシアニンという色素に変わり、その量で紅葉の色の良し悪しが決まるといわれます。昭和20年の台風で山崩れが起きたあと、谷川は、石はほかの土地から運ばず、ここにある石を使い、庭師の手で仕上げるという方針で、庭園のような姿に整えられました。" }),
  cre("弥山本堂・三鬼堂", { h: 14, m: 15, stay: 25, legs: [walk(5), other(14, "宮島ロープウエー"), walk(25)], lat: 34.2780815, lng: 132.3197787, address: "広島県廿日市市宮島町",
    memo: "紅葉谷公園の奥の紅葉谷駅から、ロープウエーを乗り継いで約14分の獅子岩駅へ。そこから山道を歩いて約25分（あわせて約45分）。弥山本堂は、806年に弘法大師が開いたと伝わるお堂で、平宗盛が納めた平安時代の梵鐘は、国の重要文化財です。裏手の求聞持堂は、弘法大師が百日の修行をした場所とされ、真言密教の日本三大道場の一つといわれます。近くの三鬼堂は、日本でただ一つの鬼の神様をまつるお堂とされ、額は伊藤博文の筆によるものです。ロープウエーに乗るときは、係の人の案内に従いましょう。混み合う日は乗車の予約が要ることがあるので、公式の案内で確かめましょう。山道は石段や岩場が多いので、歩きやすい靴で、足元に気をつけましょう。" + PRAY }),
  cre("弥山展望台", { h: 14, m: 50, stay: 40, legs: [walk(10)], lat: 34.279702, lng: 132.3196462, address: "広島県廿日市市宮島町",
    memo: "本堂から山頂へ、石段を上って約10分。平成25年に完成した展望台で、屋上のまわりには宮島の雰囲気に合うようにスギが使われています。屋上からは360度の眺めが広がり、天気のよい日には四国の山々まで見えるとされます。下りのロープウエーの最終便の時刻を、公式の案内で確かめておきましょう。" }),
  cre("御笠浜（大鳥居）", { h: 16, m: 34, stay: 16, legs: [walk(30), other(14, "宮島ロープウエー"), walk(20)], lat: 34.2956475, lng: 132.3199903, address: "広島県廿日市市宮島町",
    memo: "展望台から獅子岩駅へ歩いて戻り、ロープウエーで紅葉谷駅へ下りて、神社の前の浜へ（あわせて約64分）。大鳥居は社殿から約160m沖に立ち、高さは約16.6m、重さは約60tで、木造の鳥居としては日本最大とされます。明治8年に建てられた、9代目にあたるとされる鳥居です。上の笠木と島木は箱の形で、中に約4tの小石を詰めて重しにし、根元は海の底に置かれているだけで、柱の下に打ち込んだ松の杭が、重い鳥居を安定させています。額の文字は、沖側と社殿側で違います。浜では、潮の満ち引きに気をつけましょう。帰りは、宮島桟橋まで歩いて約12分、フェリーで宮島口へ戻りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== SHRINE) throw new Error("構成が想定と違います");
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
