/**
 * #487 0e1eeb5f（丸岡・三国・東尋坊 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 4か所 09:30〜14:25 で、昼食の一言がなく、丸岡城は天守の大規模修理中（令和8年3月〜令和9年11月予定）なのにふつうに見学できる書き方だった
 *   車の旅（福井駅の近くでレンタカーを借りて返す）。丸岡城と手紙の館から、三国湊の旧森田銀行本店・町並み（昼食）・旧岸名家・三國神社、雄島を歩いて、東尋坊で締めくくる（戻らない）
 *   雄島は「夕方以降の散策は控えて」（さかい旅ナビ）なので、東尋坊より先に回る
 *   丸岡城 9:20〜9:55 →（歩き5分）一筆啓上 日本一短い手紙の館（新規）10:00〜10:45 →（車25分）旧森田銀行本店（新規）11:10〜11:45 →（歩き5分）三国湊（昼食）11:50〜12:55
 *   →（歩き5分）旧岸名家（新規）13:00〜13:35 →（車10分）三國神社（新規）13:45〜14:15 →（車15分）雄島 14:30〜15:20 →（車10分）東尋坊 15:30〜16:30
 *   閉まる時刻: 丸岡城 8:30〜17:00、手紙の館 9:00〜17:00、旧森田銀行 9:00〜17:00、旧岸名家 9:00〜17:00（水曜休館）、町家館 9:00〜17:00。本文に時刻・曜日・料金は書かない
 *   車の時間は OSRM の道のり（福井駅→丸岡城 12.8km、手紙の館→旧森田銀行 16.1km、雄島→福井駅 29.0km）に、駐車の分を足した。駅前のレンタカー: https://www.ekiren.co.jp/office/detail/G01802 （西口から150m、8:00から）
 * 本文の出典: 丸岡城 https://maruoka-castle.jp/history/ ・ https://maruoka-castle.jp/ （北陸唯一の現存天守）・坂井市 https://www.city.fukui-sakai.lg.jp/bunka/maruokajyosyuri.html （大規模修理）・信濃毎日新聞 https://www.shinmai.co.jp/feature/matsumoto_castle/article/201903/28023199.html （寛永年間の建造）、
 *   手紙の館 http://www.city.fukui-sakai.lg.jp/bunka/kanko-bunka/kanko/bunka/tegami-no-yakata.html 、旧森田銀行本店 https://kanko-sakai.com/spot/k030/ 、三国湊 https://kanko-sakai.com/spot/k007/ ・町家館 https://www.city.fukui-sakai.lg.jp/kankou/kanko-bunka/kanko/annaijo/minato-machiya.html 、
 *   旧岸名家 https://www.city.fukui-sakai.lg.jp/kankou/kanko-bunka/kanko/rekishi/kishinake.html 、三國神社 https://kanko-sakai.com/spot/k023/ 、雄島 https://kanko-sakai.com/spot/k006/ 、東尋坊 https://kanko-sakai.com/spot/k001/
 * 座標の出典: OSM（丸岡城 way 181455166／一筆啓上 日本一短い手紙の館 way 648657914／旧森田銀行本店 node 12416004739／旧岸名家 node 12416004754／三國神社 node 1420945040／大湊神社 way 585913985／東尋坊 viewpoint node 661995668）、
 *   三国湊は町家館の住所（地理院の住所検索 北本町4-6-55 36.213871,136.148834。もとの座標と同じ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-487-0e1eeb5f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0e1eeb5f-0d86-43b1-9bf5-585210b3c15f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const TOWN = "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";

const DESCRIPTION = "北陸で唯一の現存天守とされる丸岡城と手紙の館から、北前船で栄えた三国湊へ。旧森田銀行本店や旧岸名家、三國神社をめぐって昼食をとり、神の島・雄島を歩いて、柱状節理の大断崖・東尋坊で締めくくる、車でめぐる坂井市の日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["丸岡城", "三国湊", "東尋坊", "雄島（大湊神社）"].join()) throw new Error("構成が想定と違います");
  const [castle, minato, tojinbo, oshima] = day.spots;

  const order = [
    { id: castle.id, data: { visitTime: t(9, 20), stayDurationMin: 35, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.1523586, lng: 136.2721252, address: "福井県坂井市丸岡町霞町",
      memo: "この旅は車でめぐります。JR福井駅の近くでレンタカーを借りて、車で約20分の丸岡城へ。天正4年（1576年）に織田信長の家臣・柴田勝豊が築いたとされる城で、天守は北陸で唯一の現存天守とされます。調査で、今の天守は江戸時代のはじめの寛永年間に建てられたことがわかりました。昭和23年の福井地震で石垣もろとも倒れましたが、震災前と変わらない姿に修復されています。天守は大規模な修理のため、令和9年秋ごろまで足場や幕に覆われる期間があり、入れる範囲も限られるので、公式の案内で確かめましょう。坂道や石段では足元に気をつけましょう。" } },
    { create: mk({ name: "一筆啓上 日本一短い手紙の館", h: 10, m: 0, stay: 45, mode: "walk", min: 5, lat: 36.1536745, lng: 136.2749394, address: "福井県坂井市丸岡町霞町",
      memo: "城のすぐそばの、一筆啓上 日本一短い手紙の館へ。短い手紙のコンクール「一筆啓上賞」の作品を紹介するパネルや映像のコーナー、丸岡城の四季や坂井市の花々を映像で紹介する展望室があります。" }) },
    { create: mk({ name: "旧森田銀行本店", h: 11, m: 10, stay: 35, mode: "car", min: 25, lat: 36.2136, lng: 136.1495629, address: "福井県坂井市三国町南本町3-3-26",
      memo: "丸岡から車で三国湊へ向かい、旧森田銀行本店へ。三国の豪商・森田家が創業した銀行の本店として、1920年に建てられた建物です。外観は西洋の古典主義的なデザインで、中は木と白い漆喰を生かした広い吹き抜けになっていて、営業室の天井の漆喰の飾りが見どころです。休館日は公式の案内で確かめましょう。" }) },
    { id: minato.id, data: { visitTime: t(11, 50), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 36.213871, lng: 136.148834, address: "福井県坂井市三国町北本町4-6-55",
      memo: "銀行から三国湊の町並みを歩きます。江戸時代から明治のはじめにかけて、北前船の交易で栄えた港町で、格子戸の連なる町家や豪商の面影が残る商家が並びます。妻入りの屋根の正面に平入りの下屋がつく「かぐら建て」は、三国独特の建て方です。旧商家を改築した三国湊町家館では、昔の町の写真などを見ることができます。このあたりで昼食にしましょう。" + TOWN } },
    { create: mk({ name: "旧岸名家", h: 13, m: 0, stay: 35, mode: "walk", min: 5, lat: 36.2139348, lng: 136.1486944, address: "福井県坂井市三国町南本町4-6-54",
      memo: "町並みの中の旧岸名家へ。三国湊で材木商を営んだ岸名惣助が代々住んだ町家で、この地域に特徴的な「かぐら建て」の建物です。1階には店の帳場や座敷、台所などがあり、2階には三国ゆかりの文化人の資料が展示されています。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "三國神社", h: 13, m: 45, stay: 30, mode: "car", min: 10, lat: 36.2091743, lng: 136.1576406, address: "福井県坂井市三国町山王6-2-80",
      memo: "車で少し走って、三國神社へ。大山咋命と継体天皇をまつる神社で、京都の八坂神社の楼門を写したといわれる重厚な随神門や、樹齢約600年ともいわれる大ケヤキがあります。5月の三国祭では、山車がこの神社に奉納されます。" + RESPECT }) },
    { id: oshima.id, data: { visitTime: t(14, 30), stayDurationMin: 50, transitMode: "car", transitDurationMin: 15, transitLine: null, lat: 36.2506663, lng: 136.1197226, address: "福井県坂井市三国町安島",
      memo: "東尋坊の北の雄島へ。長さ224mの朱塗りの雄島橋を渡り、78段ある流紋岩の石段を上ると、大湊神社が静かにたたずんでいます。島全体がヤブニッケイの木々に覆われ、約1kmの遊歩道では、樹齢100年をこえる大木や、波に削られた崖など、東尋坊とは違った景色が楽しめます。荒れた天気の日や夕方以降の散策は控えましょう。崖や石段では足元に気をつけましょう。" + RESPECT } },
    { id: tojinbo.id, data: { visitTime: t(15, 30), stayDurationMin: 60, transitMode: "car", transitDurationMin: 10, transitLine: null, lat: 36.2378867, lng: 136.1256526, address: "福井県坂井市三国町安島",
      memo: "雄島から車で東尋坊へ。日本海に突き出す高さ20m以上の断崖が、約1kmにわたって続く国の名勝で、天然記念物にも指定されています。このような広い柱状節理は、世界で3か所しかないといわれます。柵のない場所も多いので、崖のふちには近づきすぎず、足元に十分気をつけましょう。北前船の港町と日本海の断崖をめぐる旅を、ここで締めくくりましょう。帰りは、車で約40分の福井駅へ戻り、車を返しましょう。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 丸岡城 9:20 → 手紙の館 10:00 →（車）旧森田銀行 11:10 → 三国湊（昼食）11:50 → 旧岸名家 13:00 →（車）三國神社 13:45 →（車）雄島 14:30 →（車）東尋坊 15:30〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
