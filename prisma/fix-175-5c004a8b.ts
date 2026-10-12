/**
 * #175 5c004a8b「豊橋公園（吉田城跡）、東三河の要衝を歩く定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:40 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」）。
 * タイトルを内容に合わせて「二川宿と吉田城跡、東海道の宿場と城下町・豊橋を歩く日帰りプラン」に変える
 * 豊橋市のほかのしおり（310ab81d: 表浜・渥美半島、218ccf2d: のんほいパーク）とは行き先が重ならない
 * 電車・市電と歩きの旅（JR豊橋駅から出て、市電で豊橋駅へ戻る）:
 *   二川宿本陣資料館 9:30 → 商家 駒屋 → 豊橋駅のまわり（昼食）→ 豊橋公園（吉田城跡）→ 豊橋市美術博物館 → 安久美神戸神明社 → 豊橋市公会堂 → 吉田宿本陣跡 16:35 → 豊橋駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   愛知県の観光サイト Aichi Now https://aichinow.pref.aichi.jp/spots/detail/127/ 二川宿（日本橋から33番目の宿場・江戸時代の町割りがほぼそのまま・本陣、旅籠屋、商家の3か所を見学できる日本で唯一の宿場町・
 *     本陣は1807年から1870年まで馬場家・上段の間・明治以後に取り壊された書院棟を復元・浮世絵刷りや双六の体験コーナー・旅籠屋「清明屋」は1817年の倉橋家の建物で大名行列のときは家老など上級武士の宿・
 *     駒屋は米穀商と質屋の田村家の遺構で8棟・平成27年から公開・月曜休み）／https://aichinow.pref.aichi.jp/spots/detail/216/ 吉田城（1564年に家康が攻略して酒井忠次を城主に・池田輝政が大城郭に改造・
 *     鉄櫓下の石垣は当時の最新技術といわれる・石垣刻印が60個近く、名古屋城の残石を転用したと考えられる・鉄櫓の内部公開は10:00〜15:00、月曜休み）
 *   豊橋観光コンベンション協会 https://www.honokuni.or.jp/toyohashi/spot/<番号>.html — 000084 吉田城（1505年の今橋城・昭和29年に鉄櫓を復興）／000061 安久美神戸神明社（社伝で940年、平将門の乱の平定のとき
 *     朱雀天皇が飽海荘を伊勢神宮に寄進・本殿などは国の登録有形文化財・鬼祭は国の重要無形民俗文化財）／000038 豊橋市公会堂（昭和6年・半球ドームと鷲・ロマネスク様式・国の登録有形文化財・今も催しに使われる）／
 *     000067 吉田宿と東海道（34番目の宿駅・吉田城の城下町・戦災などで面影はほとんど失われた・本陣跡は札木町）／/toyohashi/udon/ 豊橋カレーうどん（豊橋のうどん屋は自家製麺・器の底にひと工夫）
 *   豊橋市美術博物館 https://toyohashi-bihaku.jp/?page_id=79（昭和54年開館）・?page_id=91（月曜休館・コレクション展示は1階展示室4と2階）と、所蔵の分野（美術・歴史・陶磁器・考古・民俗）
 * 座標: OSM — 豊橋市二川宿本陣資料館 node 1424000363・商家 駒屋 node 4360738883・豊橋（駅）node 4919784418・豊橋公会堂 node 4394450601・吉田宿本陣跡 node 4394421760
 *   （node は API で名前つき）／鉄櫓 way 441731907・豊橋市美術博物館 way 248958241・安久美神戸神明社 relation 10408511（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-175-5c004a8b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5c004a8b-c733-46ac-8b7a-bea06ef7b68f";
const DAY_ID = "15612028-11a6-4edd-ad89-1fd6ff7c4395";
const PARK = "e0e5fb52-9811-407e-9456-a5ea0eff6b68";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "二川宿と吉田城跡、東海道の宿場と城下町・豊橋を歩く日帰りプラン";
const DESCRIPTION =
  "東海道の二川宿で、大名の泊まった本陣と庶民の旅籠屋、豪商の家を見学し、豊橋駅のまわりでご当地の豊橋カレーうどんの昼食。午後は市電で吉田城跡の豊橋公園へ向かい、鉄櫓と美術博物館、鬼祭で知られる安久美神戸神明社、昭和の公会堂、吉田宿の本陣跡を歩いてめぐる日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  cre("二川宿本陣資料館", { h: 9, m: 30, stay: 80, legs: [], lat: 34.7232613, lng: 137.4498905, address: "愛知県豊橋市二川町中町65",
    memo: "この旅は電車と市電、歩きでめぐります。JR豊橋駅から東海道線で約6分の二川駅で降り、旧東海道を東へ歩いて約15分。二川宿は江戸の日本橋から33番目の宿場で、江戸時代の町割りがほぼそのまま残ります。資料館の隣には、江戸時代の後半から明治のはじめまで本陣を務めた馬場家の建物が残り、大名が休んだ「上段の間」や、復元された書院棟を見学できます。東隣の旅籠屋「清明屋」は1817年に建てられた建物で、大名行列が泊まるときには、家老など身分の高い武士の宿にもなりました。資料館には、浮世絵刷りや双六で江戸時代の旅を知る体験のコーナーもあります。宿場の通りには今も人が暮らしているので、静かに歩きましょう。休館日は公式の案内で確かめましょう。" }),
  cre("商家 駒屋", { h: 10, m: 55, stay: 35, legs: [walk(5)], lat: 34.7232537, lng: 137.4525703, address: "愛知県豊橋市二川町新橋町21",
    memo: "本陣資料館から旧東海道を東へ歩いて約5分。江戸時代に二川宿で米や穀物の商いと質屋を営んだ田村家の店と住まいで、主屋や離れ座敷、茶室、いくつもの土蔵など8棟が残ります。平成27年から公開され、本陣・旅籠屋・商家の3つがそろって見られる宿場は、日本でここだけとされます。" }),
  cre("豊橋駅のまわり（昼食）", { h: 11, m: 57, stay: 50, legs: [walk(18), train(6, "JR東海道線"), walk(3)], lat: 34.7630551, lng: 137.3821758, address: "愛知県豊橋市花田町",
    memo: "駒屋から二川駅まで歩き、東海道線で豊橋駅へ戻って、あわせて約27分。駅のまわりには食事のできる店が集まっているので、ここで昼食にしましょう。豊橋のうどん屋は麺を自分の店で打つことで知られ、ご当地の「豊橋カレーうどん」は、器の底にひと工夫があるのが特徴です。" }),
  upd(PARK, { h: 13, m: 0, stay: 70, legs: [train(10, "豊橋鉄道 市内線（市電）"), walk(3)], lat: 34.7707016, lng: 137.3929254, address: "愛知県豊橋市今橋町3",
    memo: "駅前から市電に乗って約10分の豊橋公園前で降り、歩いて約3分（あわせて約13分）。豊橋公園は吉田城の跡で、城は1505年に築かれた今橋城が始まりです。1564年に徳川家康が城を攻め取って酒井忠次を城主とし、のちに池田輝政が大きな城に造り替えました。豊川のほとりの鉄櫓は昭和29年に建て直されたもので、その下の輝政のころの石垣は、当時の新しい技術で積まれたといわれます。石垣には、工事を受け持った大名や家臣の印といわれる刻印が、60個近く見つかっています。鉄櫓の中の公開の時間と休みの日は、公式の案内で確かめましょう。" }),
  cre("豊橋市美術博物館", { h: 14, m: 13, stay: 70, legs: [walk(3)], lat: 34.7693722, lng: 137.3948539, address: "愛知県豊橋市今橋町3-1",
    memo: "鉄櫓から公園の中を歩いて約3分。昭和54年に開館した、豊橋公園の中にある美術と歴史の博物館です。絵画などの美術品のほか、歴史、陶磁器、考古、民俗の資料を集めていて、1階と2階には、その所蔵品を紹介する展示室があります。休館日は公式の案内で確かめましょう。" }),
  cre("安久美神戸神明社", { h: 15, m: 26, stay: 30, legs: [walk(3)], lat: 34.7679481, lng: 137.3946627, address: "愛知県豊橋市八町通3-17",
    memo: "美術博物館から歩いて約3分。社伝では、平安時代の940年、平将門の乱がしずまったときに、朝廷がこの地を伊勢神宮の領地として納め、土地の繁栄を祈ったのが始まりとされます。本殿や拝殿、神楽殿などは国の登録有形文化財です。赤鬼と天狗がかけ合う神事で知られる「鬼祭」は、国の重要無形民俗文化財に指定されています。" + PRAY }),
  cre("豊橋市公会堂", { h: 15, m: 59, stay: 15, legs: [walk(3)], lat: 34.7680885, lng: 137.3922478, address: "愛知県豊橋市八町通",
    memo: "神明社から西へ歩いて約3分。昭和6年に建てられたロマネスク様式の建物で、屋上の半球のドームと、翼を広げた鷲の像が目印です。国の登録有形文化財で、今も講演会や式典などに使われています。外から建物の姿を眺めましょう。" }),
  cre("吉田宿本陣跡", { h: 16, m: 19, stay: 16, legs: [walk(5)], lat: 34.7667081, lng: 137.3896816, address: "愛知県豊橋市札木町",
    memo: "公会堂から西へ歩いて約5分。吉田は東海道の34番目の宿場で、吉田城の城下町としてもにぎわいました。戦災などで当時の面影はほとんど失われましたが、札木の通りに本陣の跡が示されています。朝に見た二川宿の本陣と比べながら歩きましょう。帰りは、近くの札木から市電に乗って、豊橋駅へ戻りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== PARK) throw new Error("構成が想定と違います");
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
