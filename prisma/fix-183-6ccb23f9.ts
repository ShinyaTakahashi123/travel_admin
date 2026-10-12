/**
 * #183 6ccb23f9「山寺の千段石段と門前そば、山形の信仰と味を楽しむ日帰り旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:21 で、帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「申します」）。
 *   もとの「山寺（立石寺）」の点は山寺駅の点だったので、OSM の「宝珠山立石寺」の点に変える。
 *   山寺日枝神社は OSM に点がない（境内の中）ので、スポットとしては外し、立石寺の本文で紹介する
 * タイトルを内容に合わせて「山寺の石段と門前、将棋と広重の町・天童をめぐる日帰り旅」に変える
 * 山形のほかのしおり（b461a3e0: 立石寺・山寺芭蕉記念館、ec2b0e8d・44c030d6 ほか）の本文を読み、使っていない話で書いた
 *   （立石寺: 根本中堂のブナ・不滅の法灯・仁王門・奥の院と大仏殿・開山堂と五大堂・日枝神社の大イチョウと山王祭の言い伝え。芭蕉の句の文は引かない）。
 *   天童（将棋資料館・広重美術館・舞鶴山）はほかのしおりにない
 * 電車と歩きの旅（JR山形駅から仙山線。帰りはJR天童駅）:
 *   宝珠山立石寺 9:30 → 山寺の門前（昼食）→ 天童市将棋資料館 → 広重美術館 → 天童公園（舞鶴山）16:30 → 天童駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   国土交通省 多言語解説文 https://www.mlit.go.jp/tagengo-db/R3-00492.html 宝珠山立石寺（千段以上の石段・延暦寺の分院・山寺駅から店舗や食事処を過ぎて入り口・根本中堂・不滅の法灯・
 *     仁王門は山の中間・奥の院の納経堂と大仏殿の高さ4.8mの阿弥陀如来・開山堂・五大堂から渓谷を一望）／R3-00489 根本中堂（1356年に斯波兼頼が再建・日本最古のブナの建造物といわれる・重要文化財・
 *     不滅の法灯は延暦寺と互いに灯し直して1,200年以上）／R3-00496 五大堂（断崖に突き出す・五大明王）／R3-00506 日枝神社（山王権現・円仁が植えたとされる樹齢1000年の銀杏は天然記念物・
 *     山王祭は雨が吉兆という言い伝え）
 *   天童市観光情報サイト https://www.city.tendo.yamagata.jp/tourism/shogi/shisetsu.html 天童市将棋資料館（JR天童駅に隣接・将棋の伝来、世界の将棋、駒の制作工程、駒工人の作品・第3月曜休館）／
 *     /tourism/shogi/syougikoma.html（天童の将棋駒は全国の約9割以上といわれる・江戸時代後期に吉田大八が藩士に駒づくりを奨励）／/tourism/sightseeing/bijitukan.html 広重美術館
 *     （天童藩士や藩医と交遊・献金や借金の御礼に肉筆画を描いてもらった「天童広重」・200〜300幅といわれる・平成9年4月開館・火曜休館）／/tourism/sightseeing/maizuruyama.html 天童公園（舞鶴山）
 *     （町のシンボル・山頂の展望広場から月山や朝日連峰、最上川・約2,000本の桜・人間将棋）
 * 座標: OSM — 宝珠山立石寺 node 4849389041・山寺駅 見晴台 node 7626256222・天童市将棋博物館 node 5004395222・広重美術館 node 5004638023・天童公園（舞鶴公園）node 4756057235（node は API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-183-6ccb23f9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6ccb23f9-c0e0-445c-a1fa-12d985c20efd";
const DAY_ID = "fee3c594-1a48-40f5-a55a-7fdc86a66e6e";
const RISSHAKUJI = "eba6e58b-c511-4ec9-a7d3-4f79ad4d9590";
const HIE = "5086b751-f5e3-46c6-8207-4396e39e8aa3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "山寺の石段と門前、将棋と広重の町・天童をめぐる日帰り旅";
const DESCRIPTION =
  "千段を超える石段を上って山寺（立石寺）の根本中堂や奥の院、五大堂をめぐり、門前で昼食。午後は電車で天童へ移り、将棋の駒の町の歩みを伝える将棋資料館、天童藩とゆかりのある広重の肉筆画を集めた美術館、町を見下ろす舞鶴山をめぐる日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(RISSHAKUJI, { h: 9, m: 30, stay: 130, legs: [], lat: 38.3118627, lng: 140.4347915, address: "山形県山形市山寺4456-1",
    memo: "この旅は電車と歩きでめぐります。JR山形駅から仙山線で約20分の山寺駅へ。駅から門前の店の並ぶ道を歩いて約10分。比叡山延暦寺の分院として開かれた寺で、最初に迎える総本堂・根本中堂は、1356年に初代山形城主の斯波兼頼が建て直したもので、ブナでつくられた建物としては日本最古といわれます。堂の中の「不滅の法灯」は、延暦寺と互いに灯し直しながら、1,200年以上ともされ続けてきました。そばの日枝神社は山寺の守護神をまつり、開山の僧が植えたとされる大イチョウがそびえます。千段を超える石段を上ると、山の中ほどに仁王門、その先に奥の院の納経堂と大仏殿、開山堂があり、断崖に突き出た五大堂からは、山寺の境内と谷を見渡せます。芭蕉の蝉の句にちなむ「せみ塚」も参道の途中にあります。石段は長く急なので、休みながら、足元に気をつけて上りましょう。" + PRAY }, "宝珠山立石寺（山寺）"),
  cre("山寺の門前（昼食）", { h: 11, m: 50, stay: 50, legs: [walk(10)], lat: 38.3098852, lng: 140.4350761, address: "山形県山形市山寺",
    memo: "石段を下りて、山寺駅のほうへ歩いて約10分。駅から登り口までの道には、店や食事処が並んでいるので、ここで昼食にしましょう。駅のそばの見晴台からは、さっき上った山寺の岩山と、五大堂の姿を見上げられます。" }),
  cre("天童市将棋資料館", { h: 13, m: 20, stay: 50, legs: [walk(5), train(35, "JR仙山線・奥羽本線（山寺→羽前千歳→天童）")], lat: 38.3601761, lng: 140.3697206, address: "山形県天童市本町1-1-1",
    memo: "山寺駅から仙山線に乗り、羽前千歳駅で奥羽本線に乗りかえて天童駅へ（乗りかえをふくめて約35分）。資料館は駅のとなりにあります。天童は将棋の駒づくりで知られる町で、全国の駒の約9割以上がここでつくられるといわれます。江戸時代の後半、天童藩の吉田大八が、暮らしに困った藩士に駒づくりをすすめたことが、今の駒づくりのきっかけといわれます。館内では、将棋の伝わり方や世界の将棋、駒ができるまでの工程、職人の作品などを見られます。休館日は公式の案内で確かめましょう。" }),
  cre("広重美術館", { h: 14, m: 30, stay: 50, legs: [walk(20)], lat: 38.3596563, lng: 140.3804346, address: "山形県天童市鎌田本町1-2-1",
    memo: "将棋資料館から東へ歩いて約20分、天童温泉の町なかへ。江戸時代の後半、天童藩は財政が苦しく、お金を出してくれた人への御礼に、藩士や藩医と交流のあった浮世絵師・歌川広重に肉筆画を描いてもらいました。この作品群は「天童広重」と呼ばれ、200〜300幅描かれたといわれます。広重の生誕200年にあたる平成9年に開かれた美術館です。休館日は公式の案内で確かめましょう。" }),
  cre("天童公園（舞鶴山）", { h: 15, m: 40, stay: 50, legs: [walk(20)], lat: 38.3537011, lng: 140.3757292, address: "山形県天童市天童",
    memo: "広重美術館から南へ歩いて約20分。町の中ほどにある小高い山の公園で、市民に親しまれています。山頂の展望広場からは、月山や朝日連峰、最上川を見渡せます。約2,000本の桜があり、春には桜の下で、天童桜まつりの「人間将棋」が行われます。坂道では足元に気をつけましょう。帰りは、歩いて約15分のJR天童駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [RISSHAKUJI, HIE].join()) throw new Error("構成が想定と違います");
  if (it.days[0].spots.find((s) => s.id === HIE)!.photos.length) throw new Error("日枝神社に写真があります");
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
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { tx, remove: [HIE] });
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
