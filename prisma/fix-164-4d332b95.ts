/**
 * #164 4d332b95「彦根城と佐和山城跡。国宝天守と石田三成の山城をめぐる1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 09:30〜14:00 / 2か所 09:30〜11:00 で、「今夜は…ご宿泊いただきます」「お出かけください」の案内の話し方が残っていた
 * 歩きと近江鉄道の旅（JR・近江鉄道の彦根駅から。彦根に泊まる）:
 *   1日目: 彦根城 9:30 → 夢京橋キャッスルロード（昼食）→ 鳥居本宿 → 伊藤忠兵衛記念館 → 豊郷小学校旧校舎群 16:35 → 彦根の宿
 *   2日目: 龍潭寺 9:30 → 井伊神社 → 佐和山城跡 → 彦根駅前（昼食）→ 千代神社 → 足軽組屋敷の辻番所 → 開国記念館 → 玄宮園 16:35 → 彦根駅
 * 玄宮園は1日目から2日目へ移す。タイトル・季節はそのまま、説明文は書き直す
 * 埋木舎は冬（12月20日〜2月末）が休館なので入れない（季節は四季）
 * 彦根のほかのしおり（ebe67d3c・11c84229・77b83773）の本文を読み、使っていない場所を足した（鳥居本宿・伊藤忠兵衛記念館・豊郷小学校旧校舎群・井伊神社・千代神社・辻番所・開国記念館はほかのしおりにない）。
 *   もとの彦根城・玄宮園・キャッスルロード・龍潭寺・佐和山城跡の本文は、このしおりのもとの文を生かし、つなぎと案内の話し方だけ直した
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   鳥居本宿 city.hikone.lg.jp/kakuka/kanko_bunka/2/5/2326.html（中山道の江戸から63番目の宿場・本陣1、脇本陣2、旅籠35・江戸期から胃薬を製造販売してきた家の建物が最初の曲がり角に残る・合羽の古い看板・
 *   北入口の松並木・昭和6年の近江鉄道の駅舎）／伊藤忠兵衛記念館 itochu.co.jp/ja/about/history/memorial.html（初代忠兵衛が暮らし二代忠兵衛が生まれた旧邸・二代は総合商社の基盤を築いた・炊事場、帳場、奥の間・
 *   愛用品と資料の展示・10:00〜16:00、月曜休館）／豊郷小学校旧校舎群 biwako-visitors.jp/spot/detail/26785/（昭和12年・ヴォーリズの設計・近江商人の古川鉄治郎の寄附・鉄筋コンクリート、水洗トイレ、暖房、内線電話・
 *   「東洋一の小学校」「白亜の教育殿堂」と呼ばれた・月曜休館）と town.toyosato.shiga.jp/0000000277.html（2・3階の保存教室、講堂と酬徳記念図書館）／
 *   井伊神社 hikoneshi.com/sightseeing/articles/ii-jinja（天保13年に12代藩主井伊直亮が始祖井伊共保の750回忌に井伊谷の八幡宮から分霊して龍潭寺の参道脇にまつった・直政と直孝もまつる・傷みのため覆いがあり中は見られない）／
 *   佐和山城跡 hikoneshi.com/sightseeing/article/sawayama（開門9:00〜17:00、冬は16:00、開門時間中に下山・山頂から彦根城と琵琶湖・清凉寺や龍潭寺の所有地、火の使用禁止、ごみは持ち帰り）／
 *   千代神社 hikoneshi.com/sightseeing/articles/chiyojinja（天宇受売命と猿田彦命・芸能の始祖神・井伊家の保護のもと産土神・三間社流造の本殿は国の重要文化財・京町2-9-33）／
 *   辻番所 hikoneshi.com/sightseeing/article/tsujibansho（間口1間、奥行2間、4畳余りの小屋・見張り窓が2方向の通りに2か所・通りはくいちがい・土日祝のみ内部公開）／
 *   開国記念館 city.hikone.lg.jp/kakuka/kanko_bunka/8/2_1/3/4584.html（昭和35年に井伊直弼の没後100年を記念して市民の浄財で建設・佐和口多聞櫓を再現・「城下町400年の歴史」「旧井伊神社 祖に頼り子に残し」の展示・8:30〜17:00）
 * 座標: OSM — 彦根城 way 209262408（historic=castle）・玄宮園 way 585543133（garden）・夢京橋キャッスルロード way 180831396（道）・千代神社 way 1453286757・辻番所 way 1462011359（「旧彦根藩足軽組屋敷 善利組 辻番所」）・
 *   豊郷小学校旧校舎群 way 239775634（community_centre）・彦根駅 way 265187813（Nominatim の中心）／龍潭寺 node 4389652283・井伊神社 node 4389648516（place_of_worship）・佐和山 node 4309380563（peak）・
 *   「中山道 鳥居本宿」node 5903411786（attraction）・伊藤忠兵衛記念館 node 5892433290・開国記念館 node 582761736（museum）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-164-4d332b95.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4d332b95-a3a0-4e2a-bdc0-092b71868765";
const DAY1_ID = "b5661720-9aaf-48e7-a84d-47cde767efd8";
const DAY2_ID = "ef77a379-e77b-4d4f-87a3-3fb3ed3ab1ad";
const CASTLE = "77be1a52-9182-4042-b3b2-906240a4381d";
const GENKYU = "3b2b87c3-8c62-48c2-91a8-f6c50cce72e5";
const STREET = "b0dd5b9d-45cf-47ca-8c55-1d6ef858c318";
const RYOTAN = "d79aa97d-dd06-4408-a26f-0b5021b1aad3";
const SAWAYAMA = "0e6545ef-9c6c-40b8-b9d9-e07fb2a0db4a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "国宝の天守がそびえる彦根城と城下の通りから、近江鉄道で中山道の鳥居本宿、近江商人の町・豊郷の伊藤忠兵衛記念館とヴォーリズ設計の旧校舎へ。2日目は井伊家の菩提寺・龍潭寺から石田三成の佐和山城跡に登り、城下の神社や足軽屋敷の辻番所、開国記念館、玄宮園をめぐる、天守の城と山城、城下町をたどる1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(CASTLE, { h: 9, m: 30, stay: 105, legs: [], lat: 35.2771014, lng: 136.2517174, address: "滋賀県彦根市金亀町1-1",
    memo: "この旅は歩きと近江鉄道でめぐります。JR彦根駅から外堀沿いを歩いて約15分。徳川四天王の一人・井伊直政の遺志を継いだ子の直継が、慶長9年（1604年）、彦根山に築城を始めました。徳川家康の全国動員による天下普請として進められ、大坂の陣での中断をはさんで、元和8年（1622年）、およそ20年をかけて完成しました。天守は、大津城の天守を移して組み直したと伝えられ、形の違う破風を組み合わせた、変化に富む外観が特徴です。今に残る12の天守の一つで、天守が国宝に指定された5つの城の一つにも数えられます。天守からは琵琶湖や城下町を見渡せます。天守の中の階段は急なので、手すりにつかまり、足元に気をつけましょう。工事で見学できる範囲が変わることがあるので、公式の案内で確かめましょう。" }),
  upd(STREET, { h: 11, m: 30, stay: 50, legs: [walk(15)], lat: 35.2710421, lng: 136.251558, address: "滋賀県彦根市本町1丁目",
    memo: "彦根城から外堀に架かる京橋へ歩いて約15分。京橋から南へ続く通りで、白壁と黒い格子戸の町家風の建物が並び、城下町の風情を再現した商店街です。橋を渡ってすぐの四番町スクエアは、かつての市場の商店街を、大正ロマンを思わせるガス灯や洋風の建物の町並みに整え直した一画です。このあたりで昼食にしましょう。今も人が暮らし、商いをしている通りなので、静かに歩きましょう。" }, "夢京橋キャッスルロード（昼食）"),
  cre("鳥居本宿", { h: 12, m: 45, stay: 75, legs: [walk(15), train(5, "近江鉄道（彦根→鳥居本）"), walk(5)], lat: 35.2874852, lng: 136.2854869, address: "滋賀県彦根市鳥居本町",
    memo: "彦根駅へ歩いて、近江鉄道で1駅の鳥居本駅へ、歩いて約5分（あわせて約25分）。中山道を江戸から数えて63番目の宿場で、本陣が1軒、脇本陣が2軒、旅籠が35軒ありました。宿場の最初の曲がり角には、江戸時代から胃の薬をつくり売ってきた家の堂々とした建物が今も残り、軒先には、雨合羽を売っていた家の古い看板が下がります。北の入口には松並木が続き、昭和6年（1931年）に建てられた鳥居本駅の駅舎も見どころです。今も人が暮らしている町なので、静かに歩きましょう。" }),
  cre("伊藤忠兵衛記念館", { h: 14, m: 30, stay: 45, legs: [walk(5), train(20, "近江鉄道（鳥居本→豊郷）"), walk(5)], lat: 35.1979751, lng: 136.227716, address: "滋賀県犬上郡豊郷町八目128-1",
    memo: "鳥居本駅から近江鉄道で豊郷駅へ行き、歩いて約5分（あわせて約30分）。近江商人の初代伊藤忠兵衛が暮らし、のちに総合商社の土台を築いた二代忠兵衛が生まれた家です。炊事場や帳場、奥の間など、当時の暮らしの場が残され、二人の愛用品や資料が展示されています。開館の時間と休館日は公式の案内で確かめましょう。" }),
  cre("豊郷小学校旧校舎群", { h: 15, m: 25, stay: 70, legs: [walk(10)], lat: 35.2036085, lng: 136.2325671, address: "滋賀県犬上郡豊郷町",
    memo: "記念館から歩いて約10分。昭和12年（1937年）に、近江商人の古川鉄治郎の寄付で建てられ、建築家ヴォーリズが設計した小学校の校舎です。鉄筋コンクリートの建物に、水洗トイレや暖房、内線電話など当時の最先端の設備をそなえ、「東洋一の小学校」とも呼ばれました。2階と3階の教室は当時のまま残され、講堂や図書館の建物も見られます。休館日は公式の案内で確かめましょう。帰りは、豊郷駅から近江鉄道で彦根へ戻り、今夜は彦根の宿に泊まります。" }),
];

const DAY2: X[] = [
  upd(RYOTAN, { h: 9, m: 30, stay: 45, legs: [], lat: 35.2827945, lng: 136.2664548, address: "滋賀県彦根市古沢町1104",
    memo: "この日も歩いてめぐります。宿から佐和山のふもとへ。彦根藩主・井伊家の菩提寺で、徳川四天王の一人・井伊直政が、慶長5年（1600年）、遠江（今の静岡県）にあった一族ゆかりの龍潭寺の住職を招き、佐和山城下のこの地に開いたと伝えられます。江戸幕府の茶道役も務めた作庭家・小堀遠州が手がけたと伝わる庭は、裏山の佐和山を景色に取り入れた枯山水です。本堂には達磨大師の像や置物が数多く納められ、地元では古くから「だるま寺」として親しまれています。" + PRAY }),
  cre("井伊神社", { h: 10, m: 17, stay: 13, legs: [walk(2)], lat: 35.283818, lng: 136.2663953, address: "滋賀県彦根市古沢町",
    memo: "龍潭寺の参道のわき。天保13年（1842年）、12代藩主・井伊直亮が、井伊家の始祖・井伊共保の750回忌にあたって、遠江の井伊谷の八幡宮から神を分けてまつったのが始まりとされる神社で、直政と直孝もまつられています。社殿は傷みが激しいため覆いがかけられ、中を見ることはできません。" + PRAY }),
  upd(SAWAYAMA, { h: 10, m: 50, stay: 50, legs: [walk(20)], lat: 35.2796309, lng: 136.2694022, address: "滋賀県彦根市古沢町",
    memo: "龍潭寺の境内の奥にある登城口から、山道を約20分登った先に広がる山城の跡です。関ヶ原の戦いで西軍の中心となった石田三成が、天正18年（1590年）から城主となり、5層の天守を構えた立派な城だったと伝えられます。三成が関ヶ原の戦いに敗れたのち、彦根城の築城にともなって廃城となり、石垣や建物の多くが彦根城へ運ばれました。今は石垣の一部と石碑が残り、山頂からは彦根城や琵琶湖を見渡せます。山は寺の土地なので、火は使わず、ごみは持ち帰りましょう。登城口の門が開いている時間の中で下山するきまりなので、時間に気をつけましょう。山道は足場の悪いところもあるので、歩きやすい靴で足元に気をつけましょう。" }),
  cre("彦根駅前（昼食）", { h: 12, m: 20, stay: 50, legs: [walk(20), walk(20)], lat: 35.2721572, lng: 136.2639159, address: "滋賀県彦根市",
    memo: "佐和山を下りて龍潭寺へ戻り、彦根駅まで歩いて約20分（あわせて約40分）。駅のまわりで昼食にしましょう。" }),
  cre("千代神社", { h: 13, m: 25, stay: 25, legs: [walk(15)], lat: 35.2679886, lng: 136.2557854, address: "滋賀県彦根市京町2-9-33",
    memo: "彦根駅から西へ歩いて約15分。芸能の祖の神とされる天宇受売命と、猿田彦命をまつる神社で、今も俳優など芸の道に携わる人が、上達を祈りに訪れます。井伊家に守られ、この地の守り神として信仰を集めてきました。三間社流造の本殿は国の重要文化財です。" + PRAY }),
  cre("足軽組屋敷の辻番所", { h: 14, m: 0, stay: 30, legs: [walk(10)], lat: 35.2681417, lng: 136.2495963, address: "滋賀県彦根市芹橋2丁目",
    memo: "千代神社から西へ歩いて約10分、彦根藩の足軽が住んだ組屋敷の町へ。辻番所は、間口1間・奥行き2間、4畳あまりの小さな番所で、2つの通りに向けて見張りの窓が2つあります。まわりの通りは見通しがきくよう、わざと食い違いになっています。中を見られる日は限られるので、公式の案内で確かめましょう。今も人が暮らしている町なので、静かに歩きましょう。" }),
  cre("開国記念館", { h: 14, m: 50, stay: 40, legs: [walk(20)], lat: 35.2753394, lng: 136.2553264, address: "滋賀県彦根市",
    memo: "辻番所から北へ歩いて約20分、彦根城の佐和口へ。井伊直弼の没後100年を記念して、昭和35年（1960年）に市民の寄付で建てられた建物で、彦根城の佐和口多聞櫓の姿を再現しています。城下町の400年の歴史や、朝に訪れた井伊神社にまつわる展示があります。展示替えの休館は公式の案内で確かめましょう。" }),
  upd(GENKYU, { h: 15, m: 40, stay: 55, legs: [walk(10)], lat: 35.2783831, lng: 136.2540432, address: "滋賀県彦根市金亀町3",
    memo: "開国記念館から堀に沿って北へ歩いて約10分。4代藩主・井伊直興が延宝5年（1677年）につくり、文化10年（1813年）には11代藩主・直中の隠居所として整えられた大名庭園です。琵琶湖や近江八景に見立てた景色を取り入れた池泉回遊式の庭で、池に浮かぶ島々や橋、水面に映る彦根城の天守が見どころです。となりの楽々園とあわせて「玄宮楽々園」として国の名勝に指定されています。帰りは、彦根駅まで歩いて約20分です。" }),
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
  if (ids.join("|") !== `${DAY1_ID}:${CASTLE},${GENKYU},${STREET}|${DAY2_ID}:${RYOTAN},${SAWAYAMA}`) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.spot.update({ where: { id: GENKYU }, data: { dayId: DAY2_ID, orderNo: 901 } });
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
