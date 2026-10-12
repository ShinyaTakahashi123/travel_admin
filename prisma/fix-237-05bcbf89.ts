/**
 * #237 05bcbf89「巌門と和倉温泉、能登金剛の絶景と海辺の名湯を楽しむ1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 巌門 10:00〜10:50・2日目 和倉温泉 9:30〜10:30 の各1か所で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「お楽しみください」）。
 *   和倉温泉の写真は旅館の建物（Kagaya）を写したもので、宿の名前が出るので外す
 * 車の旅（金沢駅の近くでレンタカーを借りて返す）。令和6年能登半島地震のあと、営業を確かめられた所だけでつくった:
 *   1日目 旧福浦灯台 9:15 → 巌門（遊覧船）→ 機具岩 → 道の駅とぎ海街道（昼食）→ 世界一長いベンチ → 妙成寺 → 氣多大社 → 千里浜なぎさドライブウェイ 16:30 → 和倉温泉に泊まる
 *   2日目 のとじま水族館 9:00 → 石川県能登島ガラス美術館 → 能登食祭市場（昼食）→ 花嫁のれん館 → 一本杉通り → 和倉温泉 16:30 → 金沢駅
 *   七尾城跡は本丸の一部しか通れない・七尾美術館は休館（七尾市の施設の状況）、ヤセの断崖は地震で崩れたので入れない
 *   遊覧船は冬（12月〜3月中旬）は休むので、季節を春・夏・秋にする
 *   能登のほかのしおりはなく、同じ名前のスポットの本文と重ならない（samename で確かめた）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   能登金剛遊覧船 巌門クルーズ https://ganmon.jp/ （幅6m・高さ15m・奥行60mの洞門・約20分のクルーズ・地震で被災した船2隻の修繕を終えた・12月〜3月中旬は冬季休業）
 *   ほっと石川旅ねっと（石川県公式）https://www.hot-ishikawa.jp/ —
 *     spot/detail_21876 旧福浦灯台（現存する日本最古の木造灯台・白い壁と日本海）／文春オンライン https://bunshun.jp/articles/-/72830?page=2 （1876年建造）／
 *     spot/detail_6100 能登金剛（福浦港から関野鼻までの海岸・巌門は最大の見どころ・鷹の巣岩）／
 *     spot/detail_6279 機具岩（高さ16mと12mの岩をしめ縄で結ぶ・織物の神が山賊に襲われ機具を海に投げた伝説・西向きで夕日の名所）／志賀町観光協会 https://shika-guide.jp/spot/id/1166/ （大きい岩が女岩、小さい岩が男岩）／
 *     道の駅とぎ海街道 公式 https://togi-michinoeki.com/ （震災後の仮設の復興商店街・弁当、ピザ、海産物の店・不定休）、feature/detail_449（海鮮丼などの食事・ベンチまで歩いてすぐ）／
 *     spot/detail_5677 世界一長いベンチ（全長460.9m・1989年にギネスブックに掲載・増穂浦の海岸を見下ろす・約830人のボランティアが1987年に造った・日本海に沈む夕日を見てほしい）／
 *     spot/detail_6477 本山妙成寺（1294年開山・北陸の日蓮宗の本山・前田家5代にわたる10棟の重要文化財・池泉式と枯山水の庭）、feature/detail_449（北陸随一の五重塔）／
 *     spot/detail_5091 氣多大社（能登國一宮・大己貴命・国の天然記念物「入らずの森」に年に一度神職だけが入る・万葉集に大伴家持の参拝）／
 *     spot/detail_5818 千里浜なぎさドライブウェイ（国内唯一の波打ち際を車で走れる海岸・砂が細かく湿って締まっている・波が高いと通行止め・石川みち情報ネットで確かめる）／
 *     spot/detail_6111 のとじま水族館（1,600トンのジンベエザメの水槽・22mのイルカのトンネル・2025年3月22日に全面再開）／
 *     ほっと石川旅ねっとの検索結果の 石川県能登島ガラス美術館（世界各国の現代ガラス作家の造形作品を中心に400点近く）・Tokyo Art Beat の展覧会情報（9:00〜17:00・休館日あり）／
 *     feature/detail_255 能登の現状（能登食祭市場: 1階の物販と2階の洋食・海鮮丼・ラーメンの3店が営業・定休日あり／和倉温泉総湯は通常営業）／
 *     spot/detail_19929 花嫁のれん館（旧加賀藩の領地で幕末の頃から続く婚礼の風習・明治から平成ののれん・令和7年4月から通常の時間で営業）／
 *     spot/detail_18423 一本杉通り（七尾駅前の仙対橋から450m・600年以上の歴史・寄棟造りの町家・国登録有形文化財・語り部処）／
 *     spot/detail_6802 和倉温泉（1,200年の歴史・湯っ足りパークの足湯から能登島大橋と七尾湾）、spot/detail_10943 和倉温泉総湯（通常営業）
 * 座標: OSM — 旧福浦灯台 way 1127602302・千里浜 way 945966459・のとじま水族館 way 523178334・能登食祭市場 way 289138158・花嫁のれん館 way 1221261693・和倉温泉総湯 way 289203309（いずれも Nominatim の中心）／
 *   巌門 node 13898741717・機具岩 node 5674010341・世界一長いベンチ node 8780199517・妙成寺 node 3379900779・気多大社 node 2466304476・石川県能登島ガラス美術館 node 1420933547（node は API で名前つきを確かめた）／
 *   道の駅とぎ海街道 way 729487218（Nominatim の中心）／国土地理院の番地の点 — 一本杉通り（一本杉町1番地、通りの仙対橋側）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-237-05bcbf89.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "05bcbf89-5126-4f05-a15e-28b6d6a0f283";
const DAY1 = "c0eed546-ee12-4ff5-8b78-b5dddd8be887";
const DAY2 = "2194f791-6e0b-45fa-afb9-f1457af52fee";
const GANMON = "f5d07825-8510-4a8a-a7df-e30802150382";
const WAKURA = "06e9a90a-082c-4c7e-9048-3e9249cafd9d";
const WAKURA_PHOTO = "388feee0-cf08-47cd-9932-e99c291c3f12";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "能登金剛の海岸を車でめぐり、巌門の洞門を遊覧船から間近に眺め、羽咋の古い寺と神社、波打ち際を走る千里浜へ。2日目は能登島の水族館とガラス美術館、七尾の古い通りを歩き、和倉温泉の足湯で締めくくる、レンタカーの1泊2日です。";
const SEASONS = ["spring", "summer", "autumn"];

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type Item = ReturnType<typeof upd> | ReturnType<typeof cre>;

const D1: Item[] = [
  cre("旧福浦灯台", { h: 9, m: 15, stay: 30, legs: [], lat: 37.083166, lng: 136.723132, address: "石川県羽咋郡志賀町福浦港マ176",
    memo: "この旅は車でめぐります。金沢駅の近くでレンタカーを借りて、のと里山海道を北へ、車で約75分。能登金剛の南の入り口・福浦港の岬に立つ、明治9年（1876年）に建てられた灯台で、今に残る木造の灯台では日本で最も古いとされています。白い壁の小さな灯台と、その向こうに広がる日本海を眺めましょう。岬の先は足元が悪いところもあるので、気をつけて歩きましょう。" }),
  upd(GANMON, { h: 9, m: 50, stay: 60, legs: [car(5)], lat: 37.0937969, lng: 136.7270637, address: "石川県羽咋郡志賀町富来牛下",
    memo: "灯台から車で約5分。荒波が岩をけずってできた洞門で、幅約6m、高さ約15m、奥行き約60mの大きな穴が海に向かって開いています。断崖と奇岩が続く能登金剛の中でも、いちばんの見どころとされる場所です。春から秋は約20分の遊覧船が出ていて、海の上から洞門や鷹の巣岩などの岩を間近に見られます（冬のあいだは運休します。運航は公式の案内で確かめましょう）。地震で傷んだ船も直され、海に戻っています。岩場や階段は滑りやすいので、足元に気をつけましょう。" }),
  cre("機具岩", { h: 11, m: 0, stay: 30, legs: [car(10)], lat: 37.1225513, lng: 136.7268758, address: "石川県羽咋郡志賀町七海",
    memo: "巌門から海沿いを北へ、車で約10分。高さ16mと12mの二つの岩が寄り添って海に立ち、しめ縄で結ばれています。大きいほうが女岩、小さいほうが男岩とされます。能登に機織りを伝えた女神が、山賊に襲われて背負っていた機具を海に投げると、それが岩になったという伝説が残ります。岩は西を向いているので、夕日の名所としても知られています。駐車場は小さいので、ゆずりあって停めましょう。" }),
  cre("道の駅とぎ海街道", { h: 11, m: 35, stay: 50, legs: [car(5)], lat: 37.1401985, lng: 136.7248392, address: "石川県羽咋郡志賀町富来領家町",
    memo: "機具岩から車で約5分。地震で大きな被害を受けたあと、地元の店が仮設の商店街として集まり、営業を続けている道の駅です。海の幸を使った料理やお弁当などがあるので、ここで昼食にしましょう。店ごとに休みや営業の時間が違うので、公式の案内で確かめましょう。" }),
  cre("世界一長いベンチ", { h: 12, m: 30, stay: 25, legs: [walk(5)], lat: 37.1395496, lng: 136.7245548, address: "石川県羽咋郡志賀町富来領家町",
    memo: "道の駅から歩いて約5分。増穂浦の海岸沿いの高台に続く、長さ460.9mのベンチで、平成元年（1989年）に世界一長いベンチとしてギネスブックに載りました。「日本海に沈む夕日を見てほしい」という地元の人たちの思いから、約830人のボランティアの手で造られました。好きなところに腰をかけて、海を眺めてひと休みしましょう。" }),
  cre("妙成寺", { h: 13, m: 35, stay: 50, legs: [walk(5), car(35)], lat: 36.9540632, lng: 136.7766599, address: "石川県羽咋市滝谷町ヨ-1",
    memo: "車へ歩いて戻り、海沿いを南へ車で約35分（あわせて約40分）。鎌倉時代の永仁2年（1294年）に開かれた、北陸の日蓮宗の本山です。加賀藩の前田家が5代にわたって建てた10棟の建物が国の重要文化財で、中でも五重塔は、寺のシンボルとして親しまれています。池のまわりを歩く庭と、石を組んだ枯山水の庭もあわせて見てまわりましょう。" + PRAY }),
  cre("氣多大社", { h: 14, m: 35, stay: 50, legs: [car(10)], lat: 36.9260885, lng: 136.7675036, address: "石川県羽咋市寺家町ク1",
    memo: "妙成寺から車で約10分。能登国の一宮とされる神社で、大己貴命（大国主命）をまつり、縁結びの神社として信仰を集めてきました。奈良時代に大伴家持がお参りしたことが、万葉集に記されています。社殿の後ろには「入らずの森」と呼ばれる森があり、国の天然記念物に指定されていて、年に一度の神事のときに神職だけが入るとされています。森には立ち入らず、外から眺めましょう。" + PRAY }),
  cre("千里浜なぎさドライブウェイ", { h: 15, m: 40, stay: 50, legs: [car(15)], lat: 36.8773577, lng: 136.7616552, address: "石川県羽咋市千里浜町",
    memo: "氣多大社から車で約15分。砂浜の波打ち際を、ふつうの車で走ることができる海岸の道で、国内ではここだけといわれています。砂の粒が細かく、ほどよく湿って固く締まっているため、車が沈まずに走れるそうです。波が高い日などは通れなくなるので、「石川みち情報ネット」で確かめてから向かいましょう。海の近くを走りすぎず、ゆっくり進み、浜を歩く人に気をつけましょう。今夜は、車で約60分の和倉温泉の宿に泊まります（宿の営業は、あらかじめ確かめておきましょう）。" }),
];

const D2: Item[] = [
  cre("のとじま水族館", { h: 9, m: 0, stay: 100, legs: [], lat: 37.148723, lng: 136.9821597, address: "石川県七尾市能登島曲町15部40",
    memo: "和倉の宿から能登島大橋を渡って、車で約25分。能登島にある水族館で、1,600トンの水槽を泳ぐジンベエザメや、長さ22mのトンネル水槽を泳ぐイルカを、すぐそばで見られます。地震のあと、令和7年に全館での営業を再開しました。イルカのショーやペンギンのお散歩などの時間は、公式の案内で確かめましょう。水槽のガラスはたたかないようにしましょう。" }),
  cre("石川県能登島ガラス美術館", { h: 10, m: 55, stay: 50, legs: [car(15)], lat: 37.1371238, lng: 136.996581, address: "石川県七尾市能登島向田町125-10",
    memo: "水族館から車で約15分。島の緑の中に建つ、ひときわ目をひく建物の美術館で、世界のさまざまな国の現代ガラス作家による造形作品を中心に、400点近くを収めています。展示替えや休館の日があるので、公式の案内で確かめましょう。" }),
  cre("能登食祭市場", { h: 12, m: 20, stay: 50, legs: [car(35)], lat: 37.0489585, lng: 136.9688619, address: "石川県七尾市府中町員外13-1",
    memo: "能登島から橋を渡って、車で約35分の七尾港へ。能登の海の幸や特産品が集まる道の駅で、1階では海産物などの品が並び、2階には洋食や海鮮丼、ラーメンの店があります。ここで昼食にしましょう。休みの日があるので、公式の案内で確かめましょう。" }),
  cre("花嫁のれん館", { h: 13, m: 20, stay: 45, legs: [walk(10)], lat: 37.0468198, lng: 136.9618812, address: "石川県七尾市馬出町",
    memo: "食祭市場から歩いて約10分（車は市場の駐車場に置いて歩きます）。旧加賀藩の領地で、幕末のころから続く婚礼の風習「花嫁のれん」を伝える館で、明治から平成にかけて使われた色あざやかなのれんを見られます。花嫁の衣装を着てのれんをくぐる体験は、予約が必要です。" }),
  cre("一本杉通り", { h: 14, m: 6, stay: 54, legs: [walk(1)], lat: 37.046272, lng: 136.964188, address: "石川県七尾市一本杉町",
    memo: "のれん館を出ると、すぐ一本杉通りです。七尾駅前の御祓川にかかる仙対橋から続く約450mの通りで、600年以上の歴史があるとされます。寄棟造りの町家が並び、国の登録有形文化財の建物もあります。店先の「語り部処」では、店の人から町の歴史や品物の話を聞けることもあります。今も人が暮らし、商いをしている通りなので、静かに歩きましょう。" }),
  upd(WAKURA, { h: 15, m: 25, stay: 65, legs: [walk(10), car(15)], lat: 37.0886667, lng: 136.9165445, address: "石川県七尾市和倉町ワ6-2",
    memo: "通りを歩いて市場の駐車場へ戻り、車で約15分（あわせて約25分）。1,200年の歴史があるとされ、北陸でただひとつの海の温泉といわれる温泉地です。日帰りの湯の和倉温泉総湯で湯につかったり、海沿いの湯っ足りパークで、能登島大橋と七尾湾を眺めながら足湯でひと休みしたりしましょう。足湯では、ほかの人を写さないようにし、掲示の案内に従いましょう。総湯の休みの日は、公式の案内で確かめましょう。帰りは、車で約80分の金沢駅の近くでレンタカーを返しましょう。" }),
];

function show(label: string, items: Item[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of items) {
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
  if (it.days.map((d) => d.id).join() !== [DAY1, DAY2].join() || it.days[0].spots.map((s) => s.id).join() !== GANMON || it.days[1].spots.map((s) => s.id).join() !== WAKURA)
    throw new Error("構成が想定と違います");
  if (!it.days[1].spots[0].photos.some((p) => p.id === WAKURA_PHOTO)) throw new Error("和倉温泉の写真が見つかりません");
  show("1日目", D1);
  show("2日目", D2);
  console.log(`\n説明文: ${DESCRIPTION}\n季節: ${SEASONS.join(",")}\n和倉温泉の写真（旅館の建物）を外す: ${WAKURA_PHOTO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: SEASONS } });
      await tx.photo.delete({ where: { id: WAKURA_PHOTO } });
      await setDaySpotOrder(DAY1, D1, { tx });
      await setDaySpotOrder(DAY2, D2, { tx });
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
