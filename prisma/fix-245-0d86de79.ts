/**
 * #245 0d86de79「万座毛、隆起珊瑚礁の大断崖を望む定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:20 で、昼食・帰りの一言がない。本文は「お越しいただきました」「おすすめです」などの案内の話し方
 * タイトルを内容に合わせて「万座毛の断崖から名護へ、ブセナの海と博物館・名護城跡をめぐる日帰りプラン」に変える（「隆起珊瑚礁」は出典の恩納村が「琉球石灰岩」と書くので使わない）
 * 恩納村・読谷村・本部町のしおり（2678aee0: 万座毛・真栄田岬・残波岬・おんなの駅・美ら海水族館・古宇利島など、043809ae: 真栄田岬）と行き先が重ならないよう、万座毛のあとは名護へ向かう。
 *   万座毛は 2678aee0 の本文（尚敬の名の由来・高さ約20mの断崖・天然記念物の植物群落）を読み、使っていない話で書いた
 * 車の旅（那覇空港の近くでレンタカーを借りて返す）:
 *   万座毛 9:30 → ブセナ海中公園 → 道の駅許田（昼食）→ 名護博物館 → 名護城跡 → ネオパークオキナワ 16:30 → 那覇空港
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   恩納村 https://www.vill.onna.okinawa.jp/about/information/1484719566/1484720229/ 万座毛（琉球石灰岩の断崖から東シナ海・海の色が変わる・県の名勝と天然記念物・2020年10月に周辺活性化施設）と、
 *     万座毛株式会社 https://www.manzamo.jp/manzamou.php （活性化施設は2020年10月2日開業・3階に無料展望デッキ・台風時は休館あり）
 *   ブセナ海中公園 https://www.busena-marinepark.com/ （熱帯魚がすむ海・海中展望塔で海の中を直接見る・グラス底ボートで海の上から見る・年中無休）
 *   たびよみ https://tabi-mag.jp/on0065/ 道の駅許田（沖縄県で第1号の道の駅・北部12市町村の特産品・沖縄そばのフードコートなど・3階に名護湾を眺める展望広場）
 *   名護市 https://www.city.nago.okinawa.jp/museum/2018071900752/ 名護博物館の常設展示（2階「名護・やんばるのくらしと自然」・民具と剥製を合わせた展示・鯨類の骨格・ケースを使わない展示・
 *     屋外に羽地の豪農「仲尾殿内」を参考にした古民家）と、検索結果の開館時間・休館日（月曜・毎月第4木曜など）
 *   沖縄県 https://www.pref.okinawa.jp/machizukuri/park/1012804.html 名護中央公園（名護城跡は県内有数の桜の名所で日本の桜の百選・頂上近くの展望台から市街地と東シナ海・緋寒桜の桜園）
 *   ネオパークオキナワ https://www.neopark.co.jp/ （東京ドーム約5個分・アマゾン、アフリカ、オセアニアなどの環境・約100種の動物・園内を走る鉄道）と検索結果の「フラミンゴの湖」
 * 座標: OSM — 万座毛 node 2004524873・名護城址 node 2004388163（API で名前つきを確かめた）／ブセナ海中公園 way 635044299・道の駅許田 way 459571092・名護博物館 way 1237210800・
 *   ネオパークオキナワ way 415712228（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-245-0d86de79.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0d86de79-d869-4906-9bbd-55f534a66241";
const DAY_ID = "5907ba53-307a-446b-8f1d-ee731372fc62";
const MANZAMO = "9ca5e93c-2fb5-4251-bb58-978e5647758f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });

const TITLE = "万座毛の断崖から名護へ、ブセナの海と博物館・名護城跡をめぐる日帰りプラン";
const DESCRIPTION =
  "琉球石灰岩の断崖から東シナ海を見渡す万座毛を歩き、ブセナの海中展望塔で熱帯の魚を見て、沖縄で最初の道の駅で昼食。午後は名護博物館でやんばるの暮らしと自然を知り、桜の名所・名護城跡の展望台とネオパークオキナワをめぐる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(MANZAMO, { h: 9, m: 30, stay: 50, legs: [], lat: 26.5050087, lng: 127.8502564, address: "沖縄県国頭郡恩納村",
    memo: "この旅は車でめぐります。那覇空港の近くでレンタカーを借りて、車で約70分。琉球石灰岩の断崖の上から東シナ海を見渡す景勝地で、県の名勝と天然記念物に指定されています。日の光や時間によって移り変わる海の色を眺めましょう。入口の施設の3階には、無料の展望デッキもあります。崖のふちには近づかず、柵の内側を歩きましょう。" }),
  cre("ブセナ海中公園", { h: 10, m: 45, stay: 60, legs: [car(25)], lat: 26.5398188, lng: 127.9358581, address: "沖縄県名護市字喜瀬1744-1",
    memo: "万座毛から海沿いを北へ、車で約25分。熱帯の魚が暮らす海に面した公園で、海の中に建つ海中展望塔から、窓ごしに海の中を直接のぞけます。船の底がガラスになったグラス底ボートに乗れば、海の上からも魚やサンゴを眺められます。ボートの運航は海の具合によって変わるので、公式の案内で確かめましょう。" }),
  cre("道の駅許田", { h: 11, m: 55, stay: 50, legs: [car(10)], lat: 26.5521328, lng: 127.9695154, address: "沖縄県名護市許田17-1",
    memo: "海中公園から車で約10分。沖縄県で最初にできた道の駅で、本島北部・やんばるの12の市町村の産物が集まります。フードコートでは沖縄そばなどを味わえるので、ここで昼食にしましょう。3階の展望広場からは、名護湾を眺められます。" }),
  cre("名護博物館", { h: 13, m: 5, stay: 60, legs: [car(20)], lat: 26.5979062, lng: 127.9879039, address: "沖縄県名護市大中4-20-50",
    memo: "道の駅から車で約20分、名護の町へ。「名護・やんばるのくらしと自然」をテーマに、昔の暮らしの道具と、生きものの剥製などを合わせて見せる博物館で、クジラの仲間の骨格もケースに入れずに展示しています。屋外には、羽地の豪農の屋敷を参考にした赤瓦の古民家もあります。休館日は公式の案内で確かめましょう。" }),
  cre("名護城跡", { h: 14, m: 15, stay: 45, legs: [car(10)], lat: 26.5887925, lng: 127.9934158, address: "沖縄県名護市名護",
    memo: "博物館から車で約10分、名護岳のふもとの名護中央公園へ。名護城跡は、県内でも有数の桜の名所として知られ、日本の桜の百選にも選ばれています。頂上近くの展望台からは、名護の町と東シナ海を見渡せます。坂道や階段が続くので、足元に気をつけて歩きましょう。" }),
  cre("ネオパークオキナワ", { h: 15, m: 20, stay: 70, legs: [car(20)], lat: 26.6117963, lng: 127.9910131, address: "沖縄県名護市",
    memo: "名護城跡から車で約20分。東京ドーム約5個分の広さに、アマゾンやアフリカ、オセアニアなどの自然を再現した動植物公園で、約100種の動物が、柵の少ない自然に近い環境で暮らしています。フラミンゴの群れる湖や、園内を一周する鉄道もあります。動物には近づきすぎず、決められたもののほかに食べ物を与えないようにしましょう。帰りは、車で約90分の那覇空港の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== MANZAMO) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "万座毛(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
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
