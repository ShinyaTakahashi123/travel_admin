/**
 * #180 62be3b8a「中禅寺湖と華厳の滝、奥日光の絶景自然を満喫する1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 2か所 10:30〜12:40、2日目 2か所 09:30〜11:50 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。
 *   もとの本文は da0eae0b・8912b8d0 とほぼ同じ文（中禅寺湖の標高と「人造湖を除く…日本一」など）があったので、4か所ともすべて書き直す
 * 日光のほかのしおり（da0eae0b: 華厳滝・中禅寺湖・立木観音・竜頭ノ滝・戦場ヶ原・小田代ヶ原・湯滝・湯ノ湖・光徳牧場・湯元温泉、8912b8d0・3b74d624・4bc90090）の本文を読み、使っていない話で書いた
 *   （華厳滝: 日光四十八滝・イワツバメ・凍る十二滝、竜頭ノ滝: 約210mの渓流瀑と竜のヒゲ・トウゴクミツバツツジ、戦場ヶ原: 400ヘクタール・350種の植物・泉門池、湯ノ湖: 原生林と一周1時間、
 *    立木観音: 坂東三十三観音の18番・波之利大黒天・写経や数珠づくり）。二荒山神社中宮祠・イタリアと英国の大使館別荘記念公園・湯元のビジターセンターと温泉寺・日光自然博物館はほかのしおりにない。
 *   明智平ロープウェイは2027年8月末までリニューアル工事で運休なので入れない
 * 遊覧船・大使館別荘記念公園・温泉寺は冬に休むので、季節は春・夏・秋にする
 * バス・船と歩きの旅（東武日光駅・JR日光駅からバス。中禅寺温泉に泊まる）:
 *   1日目: 華厳滝 9:30 → 日光二荒山神社中宮祠 → 中禅寺湖のほとり（昼食）→ 中禅寺湖遊覧船 → イタリア大使館別荘記念公園 → 英国大使館別荘記念公園 → 日光山中禅寺 立木観音 16:31 → 中禅寺温泉の宿
 *   2日目: 日光山輪王寺 温泉寺 9:30 → 日光湯元ビジターセンター → 湯ノ湖 → 戦場ヶ原展望台（昼食）→ 戦場ヶ原 → 竜頭ノ滝 → 日光自然博物館 16:30 → 東武日光駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（日光市観光協会 日光旅ナビ https://www.nikko-kankou.org/spot/<番号>）:
 *   5 華厳滝（日光四十八滝・中禅寺湖の水が高さ約97mの岸壁を落ちる・エレベーターで観瀑台・初夏にイワツバメ・冬に十二滝の小滝が凍ってブルーアイス）／128 日光二荒山神社中宮祠（中禅寺湖の北岸・男体山のふもと・
 *   山頂の奥宮と市内の本社の中間で中宮祠）／12 中禅寺湖（周囲約25km・最大水深163m・約2万年前に男体山の溶岩で渓谷がせき止められた・明治から昭和初期は外国人の避暑地）／601 中禅寺湖遊覧船
 *   （1周の航路で乗り降り自由・2019年に大使館別荘記念公園桟橋・4月中旬〜11月）／1115 英国大使館別荘記念公園（2016年開館・国際避暑地の原点・アーネスト・サトウが建てた山荘・2階の広縁からの眺め・紅茶とスコーンの喫茶）／
 *   137 立木観音（坂東三十三観音の18番・立木観音や波之利大黒天・写経、写仏、数珠づくり）／16 中禅寺温泉（源泉は湯元温泉で昭和26年に引き湯・12km余り）／1399 温泉寺（勝道上人が見つけたとされる温泉・
 *   薬師瑠璃光如来・境内に入浴場があるめずらしい寺・写経・冬は閉湯）／692 日光湯元ビジターセンター（平成6年に環境庁が開設・パネル、映像、はく製、鳥の鳴き声）／13 湯ノ湖（三岳の噴火で湯川がせき止められた・
 *   周囲約3km・一周1時間ほど・広葉樹と針葉樹の原生林・冬は周回歩道を閉鎖）／10 戦場ヶ原（男体山と赤城山の神の争いの神話・400ヘクタール・350種の植物・野鳥・ラムサール条約・自然研究路）／127 泉門池
 *   （湧き水の池・マガモ）／6 竜頭ノ滝（溶岩の上を約210m・幅約10mの階段状の岩場・左右の流れが竜のヒゲ・トウゴクミツバツツジ）
 *   日光旅ナビ グルメ一覧 https://www.nikko-kankou.org/product/list?areaIds=2（中禅寺湖畔や戦場ヶ原の食事処）
 *   日光自然博物館 https://www.nikko-nsm.co.jp/italy.html イタリア大使館別荘記念公園（昭和3年の別荘・平成9年まで歴代大使・アントニン・レーモンドの設計・杉皮張り・副邸は国際避暑地歴史館）／
 *   https://www.nikko-nsm.co.jp/nnm.html 日光自然博物館（奥日光の自然の映像展示・奈良時代からの歴史とアーネスト・サトウ・入館は閉館30分前まで）
 * 座標: OSM — 華厳滝 node 3324186408・明治天皇御製碑 node 6703590553・竜頭ノ滝 node 2722740185・戦場ヶ原展望台 node 2722740213・船の駅中禅寺 node 4114497017（node は API で名前つき）／
 *   二荒山神社中宮祠 way 416440805・イタリア大使館別荘記念公園 way 1389305574・英国大使館別荘記念公園 way 1389302762・中禅寺 way 418292724・日光山温泉寺 way 416445771・
 *   日光湯元ビジターセンター way 416445209・湯ノ湖 relation 10415494・戦場ヶ原 way 505705293・栃木県立日光自然博物館 way 416440460（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-180-62be3b8a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "62be3b8a-f393-4595-b524-bf4e5fc2e9ed";
const DAY1_ID = "63755d73-2d79-46e2-8012-4255fcd056a5";
const DAY2_ID = "6df4f1e2-596d-4184-aba4-d528286c4723";
const KEGON = "cc82836a-12c1-49cd-9198-e2d4b34ac48e";
const LAKE = "cd3ed8c8-faa8-4625-83f9-9a56e3b988e4";
const RYUZU = "b71cef7a-bfec-4643-8fa7-ba86f9b0e3c8";
const SENJO = "a7c6bebf-3108-4010-bd3b-fa7e624d0140";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BEAR = "クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";
const VOLCANO = "出かける前に火山の情報を確かめましょう。";

const DESCRIPTION =
  "1日目は、華厳滝と男体山のふもとの二荒山神社中宮祠から、遊覧船で中禅寺湖を渡り、国際避暑地の歴史を伝えるイタリアと英国の大使館別荘記念公園、立木観音をめぐって中禅寺温泉に泊まります。2日目は湯元の温泉寺とビジターセンター、湯ノ湖を歩き、戦場ヶ原の湿原と竜頭ノ滝、日光自然博物館をめぐる、バスと船の1泊2日です。";
const SEASONS = ["spring", "summer", "autumn"];

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(KEGON, { h: 9, m: 30, stay: 50, legs: [], lat: 36.7380094, lng: 139.5019683, address: "栃木県日光市中宮祠",
    memo: "この旅はバスと船、歩きでめぐります。東武日光駅かJR日光駅から中禅寺温泉行きのバスでいろは坂を上り、約50分。バス停から歩いて約5分。日光四十八滝といわれるほど滝の多い日光で、もっともよく知られる滝で、中禅寺湖から流れ出た水が、高さ約97mの岩壁を一気に落ちていきます。エレベーターで下りた観瀑台からは、滝つぼを間近に見られます。初夏には滝のまわりをイワツバメが飛び交い、冬には「十二滝」と呼ばれる細い小滝が凍って、滝全体が青い氷に彩られます。" }),
  cre("日光二荒山神社中宮祠", { h: 10, m: 38, stay: 40, legs: [walk(18)], lat: 36.741673, lng: 139.4876272, address: "栃木県日光市中宮祠2484",
    memo: "華厳滝から湖沿いに西へ歩いて約18分。中禅寺湖の北岸、男体山のふもとに建つ神社です。男体山の山頂にある奥宮と、日光の町にある本社のあいだにあることから「中宮祠」と呼ばれています。湖を前に、男体山を背にした景色の中で、静かにお参りしましょう。男体山は火山なので、" + VOLCANO + PRAY }),
  cre("中禅寺湖のほとり（昼食）", { h: 11, m: 28, stay: 50, legs: [walk(10)], lat: 36.7392318, lng: 139.4966822, address: "栃木県日光市中宮祠",
    memo: "中宮祠から湖沿いに東へ歩いて約10分。中禅寺湖の北のほとりには、湖を眺めながら食事のできる店が点在しているので、ここで昼食にしましょう。中禅寺湖は周囲約25km、いちばん深い所は163mあり、約2万年前に男体山の噴火で流れ出た溶岩が谷をせき止めて、もとの形ができたといわれます。" }),
  upd(LAKE, { h: 12, m: 23, stay: 50, legs: [walk(5)], lat: 36.739198, lng: 139.4927888, address: "栃木県日光市中宮祠2478",
    memo: "昼食の後、湖畔の「船の駅中禅寺」へ歩いて約5分。湖をひと回りする遊覧船に乗り、湖の上から男体山や湖岸の景色を眺めましょう。1周のうちは乗り降りが自由なので、南岸の「大使館別荘記念公園」の桟橋で降ります。明治から昭和のはじめにかけて、中禅寺湖のほとりは外国人の避暑地としてにぎわいました。船に乗るときは、係の人の案内に従いましょう。" }, "中禅寺湖遊覧船"),
  cre("イタリア大使館別荘記念公園", { h: 13, m: 16, stay: 60, legs: [walk(3)], lat: 36.7253514, lng: 139.4851692, address: "栃木県日光市中宮祠2482",
    memo: "桟橋から歩いて約3分。昭和3年にイタリア大使館の別荘として建てられ、平成9年まで歴代の大使が使った建物を、床板や建具、家具をできるだけ生かして復元した公園です。設計は建築家のアントニン・レーモンドで、内と外の壁には、模様を変えながら杉の皮が張られています。副邸は、湖でのヨットや鱒釣りなどの避暑の暮らしを伝える「国際避暑地歴史館」になっています。休館日は公式の案内で確かめましょう。" }),
  cre("英国大使館別荘記念公園", { h: 14, m: 21, stay: 60, legs: [walk(5)], lat: 36.7266745, lng: 139.4860057, address: "栃木県日光市中宮祠2482",
    memo: "イタリア大使館別荘から湖沿いに歩いて約5分。英国の外交官アーネスト・サトウが建てた山荘で、のちに英国大使館の別荘となりました。奥日光が国際的な避暑地となる始まりの建物で、2016年に記念公園として公開されました。館内では、避暑地の歴史や英国の文化が紹介され、2階の広縁からは、サトウが愛した湖畔の景色が広がります。紅茶やスコーンを味わえる喫茶もあります。" }),
  cre("日光山中禅寺 立木観音", { h: 15, m: 41, stay: 50, legs: [walk(20)], lat: 36.731187, lng: 139.4916925, address: "栃木県日光市中宮祠2578",
    memo: "英国大使館別荘から湖沿いに歌ヶ浜を歩いて約20分。坂東三十三観音の18番目の札所で、本尊の立木観音のほか、「波之利大黒天」など特徴のある仏像がまつられています。写経や写仏、数珠づくりの体験もできます。拝観の時間は公式の案内で確かめましょう。" + PRAY + "この日は、中禅寺温泉の宿に泊まりましょう。中禅寺温泉のお湯は、湯元温泉から12km余りを引いてきたものです。宿のお風呂では、ほかの人を写さず、長湯を避けて、こまめに水分をとりましょう。" }),
];

const DAY2: X[] = [
  cre("日光山輪王寺 温泉寺", { h: 9, m: 30, stay: 30, legs: [], lat: 36.8084302, lng: 139.4233962, address: "栃木県日光市湯元2559",
    memo: "中禅寺温泉から湯元温泉行きのバスで、約30分の湯元温泉へ。バス停から歩いて約2分。日光を開いた勝道上人が見つけたとされる温泉のそばに建つ寺で、薬師瑠璃光如来をまつっています。境内に湯船がある、全国でもめずらしいお寺で、写経の体験もできます。冬は湯が閉じられるので、公式の案内で確かめましょう。" + PRAY }),
  cre("日光湯元ビジターセンター", { h: 10, m: 5, stay: 40, legs: [walk(5)], lat: 36.804872, lng: 139.4227932, address: "栃木県日光市湯元",
    memo: "温泉寺から歩いて約5分。平成6年に環境庁が開いた施設で、パネルや映像、はく製、鳥の鳴き声などで、奥日光の自然を学べます。季節ごとのガイドツアーの案内もあります。このあと歩く湯ノ湖や戦場ヶ原の見どころを、ここで確かめておきましょう。" }),
  cre("湯ノ湖", { h: 10, m: 48, stay: 60, legs: [walk(3)], lat: 36.8005882, lng: 139.4236986, address: "栃木県日光市湯元",
    memo: "ビジターセンターから湖岸へ歩いて約3分。三岳の噴火で湯川がせき止められてできた、周囲約3kmの湖で、三方を山に囲まれた静かな湖です。湖岸の散策路は1時間ほどでひと回りでき、ノリウツギやダケカンバなどの広葉樹と、コメツガやウラジロモミなどの針葉樹の原生林の中を歩きます。湖岸では足元に気をつけましょう。" + BEAR }),
  cre("戦場ヶ原展望台（昼食）", { h: 12, m: 3, stay: 50, legs: [bus(15, "東武バス（湯元温泉→三本松）")], lat: 36.7771996, lng: 139.4502222, address: "栃木県日光市中宮祠",
    memo: "湯元温泉からバスで約15分の三本松へ。戦場ヶ原を見渡す展望台のそばには、地元の食材を使った食事を出す茶屋などが並んでいるので、ここで昼食にしましょう。展望台からは、湿原の向こうに男体山が見えます。" }),
  upd(SENJO, { h: 13, m: 8, stay: 90, legs: [walk(15)], lat: 36.7788869, lng: 139.4426741, address: "栃木県日光市中宮祠",
    memo: "三本松から赤沼へ歩き、木道の自然研究路へ（約15分）。中禅寺湖をめぐって男体山の神と赤城山の神が争った「戦場」だったという神話が、名前の由来といわれる湿原です。かつての湖が湿原になったもので、広さは約400ヘクタール、約350種の植物が育ち、野鳥が多いことでも知られます。研究路の先の泉門池は、湧き水がつくった池で、マガモが泳ぐ姿をよく見かけます。木道からは外れず、野鳥には近づきすぎず、食べ物を与えないようにしましょう。" + BEAR }),
  upd(RYUZU, { h: 14, m: 48, stay: 30, legs: [bus(5, "東武バス（赤沼→竜頭の滝）"), walk(5)], lat: 36.7588804, lng: 139.4514868, address: "栃木県日光市中宮祠",
    memo: "赤沼からバスで約5分、歩いて約5分。男体山の噴火でできた溶岩の上を、約210mにわたって流れ下る滝で、幅約10mの階段状の岩場を水が勢いよく流れます。滝つぼの近くで大きな岩が流れを二つに分け、その様子が竜の頭に、左右の流れが竜のヒゲに見えるといわれます。初夏には、赤紫色のトウゴクミツバツツジが咲きます。岩場には近づきすぎないようにしましょう。" }),
  cre("日光自然博物館", { h: 15, m: 33, stay: 57, legs: [bus(15, "東武バス（竜頭の滝→中禅寺温泉）")], lat: 36.7385879, lng: 139.5001194, address: "栃木県日光市中宮祠2480-1",
    memo: "竜頭の滝からバスで約15分の中禅寺温泉で降りてすぐ。奥日光の自然と歴史を伝える博物館で、水の流れや湿原の風景、生きものを大きな画面の映像で見せる展示や、奈良時代から始まる奥日光の歴史、英国のアーネスト・サトウとのかかわりを描いた映像があります。2日間に歩いた場所をふり返りましょう。入館は閉館の30分前までなので、時間に気をつけましょう。帰りは、となりのバス停から東武日光駅・JR日光駅行きのバスに乗りましょう。" }),
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
    it.days[0].spots.map((s) => s.id).join() !== [KEGON, LAKE].join() ||
    it.days[1].spots.map((s) => s.id).join() !== [RYUZU, SENJO].join()
  )
    throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}\n季節: ${SEASONS.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: SEASONS as never } });
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
