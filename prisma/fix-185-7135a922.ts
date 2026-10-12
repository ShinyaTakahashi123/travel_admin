/**
 * #185 7135a922「越前松島水族館、東尋坊近くの海の生き物と出会うプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 越前松島水族館の1か所だけ 09:30〜11:10 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様、本日ご案内するのは」「お楽しみください」）で、リニューアルの年月も入っていた
 * 車の旅（JR芦原温泉駅の近くでレンタカーを借りて返す）:
 *   越前松島水族館 9:30 → 越前松島 → 東尋坊（昼食と散策）→ 東尋坊観光遊覧船 → 荒磯遊歩道 → 雄島 16:30 → 芦原温泉駅
 * タイトルを内容に合わせて「越前松島水族館から東尋坊・雄島へ、三国の海と生き物に出会う日帰りプラン」にする。季節は四季のまま
 * 三国の海辺のほかのしおり（a295878b・76714b9f・be7a0462・cc834a5c・5e4fe4d0・0e1eeb5f）の本文を読み、使っていない話で書いた
 *   （水族館: みずだこ館・ゴマフアザラシの食事・ウミガメの餌やり・ドクターフィッシュとネコザメ、越前松島: 不思議地形の小径、東尋坊: 溶岩の年代・大池・夕陽とグリーンフラッシュ・門前の海鮮、
 *    遊覧船: ライオン岩・ろうそく岩・軍艦岩、荒磯遊歩道: 文人の碑とハマダイコン、雄島: 磁石岩と手つかずの自然）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（ふくいドットコム＝福井県観光連盟の公式サイト、坂井市）:
 *   fuku-e.com/spot/detail_1459.html 越前松島水族館（見て・触れて・楽しく学べる体験型・サメや巨大なタコ、ドクターフィッシュにふれる・ウミガメや魚に餌・アザラシ、カワウソ、マンボウ・年中無休）／
 *   fuku-e.com/fukutabi/detail_558.html（日本唯一のミズダコ専門「みずだこ館」・ゴマフアザラシのお食事タイムで背中にふれる・おとなしいネコザメにふれる・ウミガメに小松菜・ペンギンの散歩）／
 *   city.fukui-sakai.lg.jp/kankou/kanko-bunka/kanko/shizen/matsushima.html 越前松島（東尋坊と同じ柱状節理の岩・一風変わった岩・散策路で小島に渡り洞穴をのぞく・越前松島自然探勝路、不思議地形の小径）／
 *   fuku-e.com/spot/detail_1476.html 東尋坊（約1kmの柱状節理・世界三大絶勝・国の天然記念物・日本の地質百選・日本の夕陽百選・年に数回のグリーンフラッシュ）と fuku-e.com/feature/detail_268.html
 *   （約1300〜1200万年前の溶岩・地殻変動と荒波・大池は高さ25m・手すりやフェンスがない・商店街の海鮮丼、イカの串焼き・約30分の東尋坊観光遊覧船、ライオン岩、ろうそく岩、軍艦岩）／
 *   fuku-e.com/spot/detail_1465.html 荒磯遊歩道（米ケ脇から東尋坊を経て雄島近くまで約4km・三国ゆかりの文人、詩人、俳人の碑・4月中旬〜5月中旬のハマダイコン）／
 *   fuku-e.com/spot/detail_1468.html と fuku-e.com/fukutabi/detail_669.html 雄島（越前海岸で最も大きな島・神の島・島全体が大湊神社の神域・方位磁石が狂う磁石岩・普通に歩けば20分ほど）と
 *   city.fukui-sakai.lg.jp/kankou/kanko-bunka/kanko/shizen/oshima.html（人の手が加えられていない神の島）
 * 座標: OSM — 越前松島水族館 node 1420949924（tourism=museum）・東尋坊 node 661995668（tourism=viewpoint）・東尋坊乗り場 node 5612669803（遊覧船の乗り場、ferry_terminal）は API で名前つき／
 *   越前松島 relation 11668483・荒磯遊歩道 way 162407879・雄島 relation 8273220 は Nominatim の中心
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-185-7135a922.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7135a922-0fcf-45b7-bcdc-3b421527da2e";
const DAY1_ID = "e4009774-ea63-4be8-8f54-40cc304aa4db";
const AQUARIUM = "b0c59569-07dd-4ffd-bb1c-edb2ce39bd60";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "越前松島水族館から東尋坊・雄島へ、三国の海と生き物に出会う日帰りプラン";
const DESCRIPTION =
  "越前松島水族館でミズダコやアザラシ、ウミガメに会い、となりの越前松島の岩場を歩きます。東尋坊で昼食をとって断崖をめぐり、遊覧船で海の上から奇岩を眺めます。午後は文人の碑が並ぶ荒磯遊歩道を歩き、神の島と呼ばれる雄島へ。三国の海辺を車でめぐる日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(AQUARIUM, { h: 9, m: 30, stay: 100, legs: [], lat: 36.2526485, lng: 136.1466764, address: "福井県坂井市三国町崎74-2-3",
    memo: "この旅は車でめぐります。JR芦原温泉駅の近くでレンタカーを借りて、車で約25分。「見て・触れて・楽しく学べる」体験型の水族館です。ミズダコだけを集めた「みずだこ館」は、日本でただ一つのミズダコ専門の館とされます。ゴマフアザラシが食事をする時間には、その背中にふれられることもあり、おとなしいネコザメやドクターフィッシュにさわれる水槽や、ウミガメに餌をあげられるコーナーもあります。カワウソやマンボウも暮らしています。生き物にふれるときや餌をあげるときは、係の人の案内に従い、やさしく接しましょう。" }),
  cre("越前松島", { h: 11, m: 13, stay: 30, legs: [walk(3)], lat: 36.2553073, lng: 136.1470239, address: "福井県坂井市三国町梶",
    memo: "水族館のとなりから歩いて約3分。東尋坊と同じ柱状節理の岩でできた海辺で、一風変わった形の岩があちこちに見られます。「不思議地形の小径」と名づけられた散策路をたどると、小さな島へ渡ったり、波がつくった洞穴をのぞいたりできます。岩場は滑りやすいので、波の高い日は近づかず、足元に気をつけましょう。" }),
  cre("東尋坊（昼食と散策）", { h: 11, m: 53, stay: 90, legs: [car(10)], lat: 36.2378867, lng: 136.1256526, address: "福井県坂井市三国町安島",
    memo: "越前松島から車で約10分。入り口の通りには、海鮮丼やイカの串焼きなどを出す店が並ぶので、まずここで昼食にしましょう。そのあと断崖へ。約1300万〜1200万年前に噴き出した溶岩が固まり、地殻の動きと日本海の荒波に削られてできた柱状節理の崖が、約1kmにわたって続きます。なかでも「大池」と呼ばれる入り江は、高さ約25mの崖に囲まれ、いちばんの迫力といわれます。夕日の名所としても知られ、年に数回、沈む太陽が一瞬緑色に光る「グリーンフラッシュ」が見られることもあるそうです。景観を守るため、崖には手すりや柵がありません。崖のふちには近づかず、風や雨の強い日は特に気をつけましょう。" }),
  cre("東尋坊観光遊覧船", { h: 13, m: 25, stay: 40, legs: [walk(2)], lat: 36.2379255, lng: 136.1258483, address: "福井県坂井市三国町安島",
    memo: "断崖の下の乗り場へ歩いて約2分。約30分かけて東尋坊のまわりの海をめぐる遊覧船で、崖の上からは見えないライオン岩やろうそく岩、軍艦岩などの奇岩を、海の上から見上げられます。波の高い日は欠航や乗り場の変更があり、運航の日と時間は季節で変わるので、公式の案内で確かめましょう。乗るときは係の人の案内に従いましょう。" }),
  cre("荒磯遊歩道", { h: 14, m: 15, stay: 60, legs: [walk(10)], lat: 36.2432505, lng: 136.1290096, address: "福井県坂井市三国町安島",
    memo: "乗り場から崖の上の道を北へ歩いて約10分。米ケ脇から東尋坊を通り、雄島の近くまで約4km続く海沿いの散策路です。三国にゆかりのある作家や詩人、俳人たちの碑が道沿いにいくつも立ち、日本海を眺めながら、碑をたどって歩けます。春の終わりから初夏には、薄紫色のハマダイコンの花が道沿いを彩ります。碑をいくつか見ながら北へ歩いたら、同じ道を戻りましょう。海側の崖には近づかず、決められた道を歩きましょう。" }),
  cre("雄島", { h: 15, m: 30, stay: 60, legs: [walk(10), car(5)], lat: 36.2517537, lng: 136.1190402, address: "福井県坂井市三国町安島",
    memo: "東尋坊の駐車場へ歩いて戻り、車で約5分（あわせて約15分）。人の手がほとんど加えられていない自然が残る小さな島で、海の安全を祈る大湊神社がまつられています。島をめぐる道の途中には、方位磁石の針が狂うといわれる「磁石岩」があり、ふつうに歩けば20分ほどでひと回りできます。荒れた天気の日は渡るのを控え、崖や石段では足元に気をつけましょう。" + PRAY + "帰りは、車で約30分のJR芦原温泉駅へ戻り、車を返しましょう。" }),
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
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== AQUARIUM) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
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
