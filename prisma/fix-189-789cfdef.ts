/**
 * #189 789cfdef「大歩危・小歩危、吉野川の渓谷を舟下りで楽しむプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 大歩危峡観光遊覧船の1か所だけ 09:30〜10:30 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「お楽しみください」）。
 *   説明文と本文の「2億年」は、三好市観光協会の遊覧船の案内（約1億年の時を刻んだ峡谷）と合わないので外す
 * 車の旅（JR阿波池田駅の近くでレンタカーを借りて返す）:
 *   祖谷のかずら橋 9:30 → ひの字渓谷 → 大歩危峡観光遊覧船（昼食と遊覧）→ 山城大歩危妖怪村（妖怪街道）→ 定福寺 → 杉の大スギ → 道の駅大杉 16:36 → 阿波池田駅
 * タイトルを「祖谷のかずら橋と大歩危峡の遊覧船、大豊の大杉もめぐる渓谷の日帰りプラン」に、季節は四季のまま、説明文は書き直す
 * 三好市のほかのしおり（e4f374cb: かずら橋・琵琶の滝・大歩危峡の遊覧船・道の駅大歩危・箸蔵寺・うだつの家、7133c8fe: 祖谷渓の小便小僧展望台・平家屋敷・落合集落ほか）の本文を読み、使っていない話で書いた
 *   （かずら橋: 夜のライトアップの間は渡れない、遊覧船: 乗った場所に戻る約30分・郷土料理、妖怪村: 怪遺産と藤川谷）。ひの字渓谷は小便小僧の話を使わず、秋の紅葉の話で書いた。
 *   大豊町（定福寺・杉の大スギ・道の駅大杉）はほかのしおりにない。豊楽寺薬師堂は OSM に点がなく、国土地理院でも番地の点が出ない（大字の点だけ）ので入れなかった
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（三好市観光協会 miyoshi-tourism.jp、大豊町観光協会 otoyo-kankou.com）:
 *   spot/46 祖谷のかずら橋（国指定重要有形民俗文化財・毎日19:00〜21:30ライトアップ、渡橋はできない）／spot/65 祖谷渓・ひの字渓谷（V字の深い渓谷・秋には谷底から峰まで全山紅葉、車からも眺められる）／
 *   spot/24284 大歩危峡まんなか・大歩危峡観光遊覧船（約30分、乗船場所と下船場所は同じ・約1億年の峡谷・両岸の切り立った岩壁、川風に揺れる木々・レストランで郷土料理・強風や増水で欠航あり）／
 *   spot/53 大歩危小歩危（結晶片岩が水蝕されてできた峡谷・国の天然記念物と名勝）／spot/154 山城大歩危妖怪村（妖怪街道・藤川谷・世界妖怪協会の怪遺産に認定）／
 *   otoyo-kankou.com/spot/culture/jyofukuji/ 定福寺（724年に行基が開山と伝わる・日本唯一と言われる六体の笑い地蔵・四国最古の聖徳太子像・土佐豊永万葉植物園）／
 *   /spot/nature/sugis-giant-cedar-tree/ 杉の大スギ（特別天然記念物・推定樹齢3000年・日本一の大杉・南大杉と北大杉、夫婦杉・南大杉は根回り約20m、高さ約60m・須佐之男命が植えたという伝説・八坂神社の境内）／
 *   /spot/gourmet/michinoeki-osugi/ 道の駅大杉（碁石茶・銀不老豆のお菓子・ゆず・地元の野菜）
 * 座標: OSM — かずら橋 way 258405234（highway=footway, name=かずら橋）・大歩危峡まんなか way 132681165（遊覧船とレストランの建物、Nominatim の中心）／
 *   ひの字渓谷 node 6003737088（tourism=viewpoint、name は英語の「Hi-no-Ji Bend Viewpoint」だけ）・妖怪街道 node 13439217201（tourism=attraction）・定福寺 node 9672058059（place_of_worship）・
 *   杉の大スギ node 4972946621（tourism=attraction）・道の駅大杉 node 262309907（highway=services）（API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-189-789cfdef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "789cfdef-1580-4fda-ada3-4bc8709e05a9";
const DAY1_ID = "c1005920-5394-404b-a1bd-c3ecea6a5d98";
const BOAT = "e238b0aa-33af-4309-a229-f480d44f97f1";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "祖谷のかずら橋と大歩危峡の遊覧船、大豊の大杉もめぐる渓谷の日帰りプラン";
const DESCRIPTION =
  "祖谷のかずら橋を渡り、紅葉の名所のひの字渓谷を眺めてから、大歩危峡で昼食と遊覧船を楽しみます。妖怪伝説の山城の里を歩き、高知県の大豊町へ足をのばして、笑い地蔵の定福寺と、樹齢約3000年とされる杉の大スギをたずねる、吉野川の渓谷の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("祖谷のかずら橋", { h: 9, m: 30, stay: 40, legs: [], lat: 33.8750942, lng: 133.8354225, address: "徳島県三好市西祖谷山村善徳",
    memo: "この旅は車でめぐります。JR阿波池田駅の近くでレンタカーを借りて、車で約1時間の西祖谷へ。山のつるで編まれた吊り橋で、国の重要有形民俗文化財です。夜は橋がライトアップされますが、その間は渡ることができないので、明るいうちに渡りましょう。足もとの板のすき間から川面が見え、歩くとよく揺れるので、両側のつなをしっかり持って、一歩ずつ進みましょう。" }),
  cre("ひの字渓谷", { h: 10, m: 35, stay: 20, legs: [car(25)], lat: 33.9090615, lng: 133.8185929, address: "徳島県三好市",
    memo: "かずら橋から車で約25分。エメラルドグリーンの祖谷川が、深いV字の谷をつくる祖谷渓の展望地です。秋には谷底から峰まで山全体が紅葉に染まり、車の窓からも眺められます。展望地は車の通る道に面しているので、車に気をつけて眺めましょう。" }),
  upd(BOAT, { h: 11, m: 25, stay: 90, legs: [car(30)], lat: 33.883966, lng: 133.7595759, address: "徳島県三好市山城町西宇1520-1",
    memo: "ひの字渓谷から車で約30分。吉野川に面した建物のレストランで、渓谷を眺めながら地元の食材を使った郷土料理の昼食にしましょう。食後は遊覧船へ。乗った場所へ戻ってくる約30分の船旅で、両岸にそびえる切り立った岩壁や、川風にゆれる木々、澄んだ流れを間近に眺められます。大歩危小歩危は、結晶片岩が水に削られてできた峡谷で、国の天然記念物と名勝に指定されています。風の強い日や川の水が多い日は運休することがあります。乗るときは係の人の案内に従いましょう。" }, "大歩危峡観光遊覧船（昼食と遊覧）"),
  cre("山城大歩危妖怪村（妖怪街道）", { h: 13, m: 5, stay: 30, legs: [car(10)], lat: 33.882146, lng: 133.7555949, address: "徳島県三好市山城町上名",
    memo: "遊覧船の乗り場から車で約10分。山城町上名の藤川谷に沿って、妖怪の伝説にちなむ「妖怪街道」が続きます。妖怪の言い伝えが多く残るこの地域は、世界妖怪協会から「怪遺産」に認められています。藤川谷が吉野川に流れこむあたりの谷の眺めも楽しめます。今も人が暮らす集落なので、家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。" }),
  cre("定福寺", { h: 14, m: 5, stay: 60, legs: [car(30)], lat: 33.7930811, lng: 133.7692502, address: "高知県長岡郡大豊町粟生",
    memo: "妖怪街道から車で約30分、県境をこえて高知県の大豊町へ。724年に行基が開いたと伝わる、千年をこえる歴史をもつ寺です。宝物殿には、日本でただ一つといわれる笑顔の「六体の笑い地蔵」や、四国で最も古いとされる聖徳太子像が収められています。寺のそばの土佐豊永万葉植物園は、このあたりで万葉集ゆかりの植物が数十種見つかったことから開かれた植物園です。宝物殿の公開は公式の案内で確かめましょう。" + PRAY }),
  cre("杉の大スギ", { h: 15, m: 30, stay: 40, legs: [car(25)], lat: 33.7546963, lng: 133.6623556, address: "高知県長岡郡大豊町杉794",
    memo: "定福寺から車で約25分。八坂神社の境内にそびえる、樹齢約3000年と推定される杉の巨木で、国の特別天然記念物です。根元でつながった南大杉と北大杉の2本からなり、「夫婦杉」とも呼ばれます。南大杉は根回り約20m、高さ約60mにもなり、日本一の大杉ともいわれます。須佐之男命が植えたという言い伝えも残ります。入れる時間は季節で変わるので、公式の案内で確かめましょう。" + PRAY }),
  cre("道の駅大杉", { h: 16, m: 16, stay: 20, legs: [walk(6)], lat: 33.7510315, lng: 133.6633179, address: "高知県長岡郡大豊町杉743-1",
    memo: "大スギから歩いて約6分。大豊町に伝わる珍しいお茶「碁石茶」や、ゆずを使った品、地元の野菜などが並ぶ道の駅です。旅のおみやげを選びましょう。帰りは、大豊インターチェンジから高速道路を通り、車で約30分のJR阿波池田駅へ戻って、車を返しましょう。" }),
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
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== BOAT) throw new Error("構成が想定と違います");
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
