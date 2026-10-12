/**
 * #243 0cfa8e34「熊本城と桜の馬場城彩苑、定番の熊本城下町日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:00 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「お楽しみください」）。
 *   「日本三名城の一つに数えられています」「官軍に負けたのではない…」の逸話は出典で確かめていないので書かない
 * 令和8年（2026年）7月の熊本地震のあと、熊本城は8月13日に天守閣と特別見学通路の公開を再開した。9月18日時点で熊本城・城彩苑の桜の小路と観光案内所・熊本博物館は営業、
 *   熊本城ミュージアム わくわく座は休館。長塀は2016年の地震のあと解体して保存中、小泉八雲熊本旧居・旧細川刑部邸は休館なので使わない
 * 熊本市のほかのしおり（ea38491a・17f065fd: 熊本城・加藤神社・伝統工芸館・城彩苑・熊本博物館・県立美術館・水前寺など）の本文を読み、
 *   使っていない話（武者返しと西南戦争の籠城、博物館の蒸気機関車とプラネタリウム）で書き、午後はタイトルの「城下町」にあわせて新町・古町を歩く
 * 歩きと市電の旅（JR熊本駅から市電で城へ、帰りは古町から熊本駅へ）:
 *   熊本城 9:30 → 熊本博物館 → 桜の馬場 城彩苑（昼食・桜の小路）→ 古城堀端公園 → 船場菅原神社 → 古町 16:30 → 熊本駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   熊本城公式 https://castle.kumamoto-guide.jp/history/ （武者返し・明治10年の西南戦争で50日あまりの籠城・天守は戦の直前に焼失し昭和35年に再建・平成28年の地震のあと令和3年3月に復旧）／
 *     https://castle.kumamoto-guide.jp/news/detail/1459 （令和8年熊本地震のあとの開園情報・9月18日時点）
 *   熊本日日新聞 https://kumanichi.com/articles/2023937 （2026年8月13日に、地震の前に公開していた天守閣や特別見学通路の公開を再開・一部は立ち入りを止めている）
 *   熊本博物館 https://kumamoto-city-museum.jp/exhibition/246 （昭和15年から豊肥線を30年以上走った蒸気機関車69665号機・プラネタリウム前の反射望遠鏡）／
 *     https://kumamoto-city-museum.jp/162/170 （9:00〜17:00・月曜休館・プラネタリウムは別料金）と検索結果（古代から現代まで約4,100点・地下にプラネタリウム）
 *   熊本市観光ガイド https://kumamoto-guide.jp/spots/detail/221 新町・古町の町並み（加藤清正が築城とともに造った町・新町は短冊形の町割で武家屋敷と町人町が混在・
 *     古町は碁盤目の「一町一寺」の町割で坪井川の荷揚げ場をもつ問屋の物流拠点・町屋を改装したカフェやレストラン）／
 *     https://kumamoto.guide/look/detail/367 新町（古城堀端公園は清正の築城前の隈本城の堀跡と石垣・船場菅原神社はたぬきの像が多く並ぶ）／
 *     https://kumamoto.guide/look/detail/366 古町（明八橋は明治8年の石橋で新町との境・西村邸は大正6年、国登録有形文化財、両側をレンガの防火壁で囲む油商の建物）
 * 座標: OSM — 天守閣 way 331477851・桜の馬場城彩苑 way 660865516・古城堀端公園 way 489068398・船場菅原神社 way 1038112997・明八橋 way 138837904（Nominatim の中心）／
 *   熊本市立熊本博物館 node 1423808453（API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-243-0cfa8e34.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0cfa8e34-a999-46a7-9b4c-3e13528e41ab";
const DAY_ID = "910714fe-d99d-4314-a5ac-4be14f54b494";
const CASTLE = "ae1a3c97-0607-464a-a695-a15adff99aba";
const JOSAIEN = "8b1b0244-ca16-4eea-8ebf-aeaee6a2bfcc";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "武者返しの石垣が残る熊本城で、地震からの復旧の歩みを見て、熊本博物館で熊本の歴史をたどり、桜の馬場 城彩苑で昼食。午後は加藤清正がつくった城下町・新町と古町を歩き、堀の跡や石橋、古い商家をめぐる日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(CASTLE, { h: 9, m: 30, stay: 100, legs: [], lat: 32.8062169, lng: 130.7058363, address: "熊本県熊本市中央区本丸1-1",
    memo: "JR熊本駅から市電に乗り、熊本城・市役所前で降りて、歩いて天守閣へ（あわせて約30分）。熊本城の石垣は「武者返し」と呼ばれ、下のほうはゆるやかで登れそうに見えますが、上に行くほど反りが強くなり、登れないつくりになっています。明治10年（1877年）の西南戦争では、50日あまりにわたる籠城戦の舞台となりました。天守閣は、その戦いの直前に焼け、昭和35年に再建されたものです。平成28年（2016年）の地震で大きな被害を受け、令和3年に復旧しましたが、令和8年（2026年）7月の地震で、石垣などが再び傷みました。今は天守閣と特別見学通路が公開されています。地震のあと、復旧の工事が続き、立ち入りが止められている所もあるので、柵の内側には入らず、見学できる範囲は公式の案内で確かめましょう。石段や見学通路では、足元に気をつけましょう。" }),
  cre("熊本博物館", { h: 11, m: 25, stay: 70, legs: [walk(15)], lat: 32.808624, lng: 130.6993427, address: "熊本県熊本市中央区古京町3-2",
    memo: "天守閣から城の西側の三の丸へ、歩いて約15分。古代から今までの熊本の歩みを、約4,100点の資料でたどれる博物館です。屋外には、昭和15年から30年以上、豊肥線で貨物を引いて走った蒸気機関車が置かれています。地下にはプラネタリウムもあり、投映の時間は公式の案内で確かめましょう。休館日も公式の案内で確かめてから訪れましょう。" }),
  upd(JOSAIEN, { h: 12, m: 50, stay: 60, legs: [walk(15)], lat: 32.8035571, lng: 130.703562, address: "熊本県熊本市中央区二の丸1-1",
    memo: "博物館から城の南側へ、歩いて約15分。熊本城のふもとの観光施設で、食事やおみやげの店が並ぶ「桜の小路」で昼食にしましょう。観光案内所では、町歩きの相談もできます。熊本城ミュージアム わくわく座は、地震のため休館しているので、再開は公式の案内で確かめましょう。" }),
  cre("古城堀端公園", { h: 14, m: 0, stay: 25, legs: [walk(10)], lat: 32.8013982, lng: 130.6991575, address: "熊本県熊本市中央区古城町",
    memo: "城彩苑から西へ歩いて約10分、城下町・新町へ。新町は、加藤清正が城とともにつくった町で、細長い区画に武家屋敷と町人の町が入りまじっていました。この公園には、清正が熊本城を築く前の隈本城の堀の跡と石垣が残っています。今も人が暮らす町なので、静かに歩きましょう。" }),
  cre("船場菅原神社", { h: 14, m: 35, stay: 20, legs: [walk(10)], lat: 32.7977286, lng: 130.6985675, address: "熊本県熊本市中央区新町2丁目",
    memo: "公園から南へ歩いて約10分。新町の中にある小さな神社で、境内にはたくさんのたぬきの像が並んでいます。" + PRAY }),
  cre("古町", { h: 15, m: 5, stay: 85, legs: [walk(10)], lat: 32.7979748, lng: 130.6967088, address: "熊本県熊本市中央区西唐人町",
    memo: "神社から歩いて約10分。新町との境の坪井川にかかる明八橋は、明治8年に架けられた石の橋です。橋を渡った古町は、火事を防ぎ、守りにも備えて碁盤の目に区切られた町で、1つの町に1つの寺を置く「一町一寺」の町割りが今も残ります。坪井川の荷揚げ場をもつ問屋が並んだ物流の町で、大正6年に油を商う店として建てられ、両側をれんがの防火壁で囲んだ西村邸（国の登録有形文化財）などの古い商家や、寺の並ぶ通りを歩きましょう。今も人が暮らし、商いをしている町なので、静かに歩きましょう。帰りは、歩いて約15分のJR熊本駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [CASTLE, JOSAIEN].join()) throw new Error("構成が想定と違います");
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
