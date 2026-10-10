/**
 * #202 a295878b「東尋坊、柱状節理の大断崖を望む定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 東尋坊 1か所 09:30〜10:50 で、行き方・昼食の一言がなく、本文はツアーガイドの話し方（「皆様」「ご堪能ください」）
 * 車の旅（JR福井駅の近くでレンタカーを借りて返す。駅前のレンタカー https://www.ekiren.co.jp/office/detail/G01802 、#487 と同じ）
 *   東尋坊 9:00 → 雄島 → 越前松島 → 越前松島水族館 → 三国湊（昼食）→ 旧岸名家 → 瀧谷寺 → 坂井市龍翔博物館 16:30（東尋坊のほかは新規）
 *   雄島・三国湊・旧岸名家の本文は #487（0e1eeb5f、法✅企✅）で確かめた事実を使う
 * 本文の出典（坂井市公式観光ガイド さかい旅ナビ）: 東尋坊 https://kanko-sakai.com/spot/k001/ （国指定名勝・約1km・柱状節理は世界で3か所しかないといわれる・東尋坊観光遊覧船）／
 *   雄島 https://kanko-sakai.com/spot/k006/ ／越前松島 https://kanko-sakai.com/spot/k005/ ／越前松島水族館 https://kanko-sakai.com/spot/k021/ ／三国湊 https://kanko-sakai.com/spot/k007/ ／
 *   旧岸名家 https://www.city.fukui-sakai.lg.jp/kankou/kanko-bunka/kanko/rekishi/kishinake.html ／瀧谷寺 https://kanko-sakai.com/spot/k011/ ／坂井市龍翔博物館 https://kanko-sakai.com/spot/k013/
 * 開く時間（本文には書かない）: 遊覧船 9:00〜16:00（11〜3月は15:30まで）／水族館 9:00〜（冬は16:30まで）／瀧谷寺 冬は8:00〜16:30／龍翔博物館 9:00〜17:00（入館16:30まで）水曜休／旧岸名家 水曜休
 * 座標の出典: OSM — 東尋坊 viewpoint node 661995668／大湊神社（雄島）way 585913985／越前松島 relation 11668483／越前松島水族館 node 1420949924／旧岸名家 node 12416004754／
 *   瀧谷寺・龍泉院 way 423254538／みくに龍翔館（坂井市龍翔博物館）way 196969604。三国湊は #487 と同じ（国土地理院の住所検索 北本町4-6-55）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-202-a295878b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "a295878b-e036-44bb-a0a9-a44e5e4a8c0b";
const DAY_ID = "b64c98a3-b6a6-4d00-9954-fdfac622d3af";
const TOJINBO = "023fe9fd-8407-49ed-99c4-d1e2f3cdd2a9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const TOWN = "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";

const DESCRIPTION =
  "福井駅の近くでレンタカーを借りて、日本海の断崖・東尋坊から三国をめぐる日帰りプランです。柱状節理の東尋坊と雄島、越前松島と水族館で海辺の景色を楽しみ、北前船で栄えた三国湊の町並みで昼食。午後は旧岸名家や国宝・重要文化財の多い瀧谷寺、坂井市龍翔博物館で、三国の歴史にふれます。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  { id: TOJINBO, data: data({ h: 9, m: 0, stay: 75, mode: null, min: null, lat: 36.2378867, lng: 136.1256526, address: "福井県坂井市三国町安島",
    memo: "この旅は車でめぐります。JR福井駅の近くでレンタカーを借りて、車で約45分の東尋坊へ。日本海の荒波が打ち寄せる断崖が約1kmにわたって続く、国指定名勝です。このような広い柱状節理は、世界で3か所しかないといわれます。崖の上から海を見下ろすほか、東尋坊観光遊覧船に乗れば、海の上から断崖を見上げることもできます。遊覧船は荒れた天気の日は運休することがあります。柵のない場所も多いので、崖のふちには近づきすぎず、足元に十分気をつけましょう。" }) },
  cre("雄島", { h: 10, m: 25, stay: 40, mode: "car", min: 10, lat: 36.2506663, lng: 136.1197226, address: "福井県坂井市三国町安島",
    memo: "東尋坊から車で約10分、北の雄島へ。長さ224mの朱塗りの雄島橋を渡り、78段ある流紋岩の石段を上ると、大湊神社が静かにたたずんでいます。島全体がヤブニッケイの木々に覆われ、約1kmの遊歩道では、樹齢100年をこえる大木や、波に削られた崖など、東尋坊とは違った景色が楽しめます。荒れた天気の日や夕方以降の散策は控えましょう。崖や石段では足元に気をつけましょう。" + RESPECT }),
  cre("越前松島", { h: 11, m: 15, stay: 25, mode: "car", min: 10, lat: 36.2553073, lng: 136.1470239, address: "福井県坂井市三国町梶",
    memo: "雄島から車で約10分。小島が織りなす景色が宮城の松島に似ていることから名づけられた景勝地です。東尋坊と同じ柱状節理の岩が、扇岩や材木岩など変わった形の景色をつくっています。荒れた天気の日や夕方以降の散策は控え、岩場では足元に気をつけましょう。" }),
  cre("越前松島水族館", { h: 11, m: 45, stay: 70, mode: "walk", min: 5, lat: 36.2526485, lng: 136.1466764, address: "福井県坂井市三国町崎74-2-3",
    memo: "越前松島のすぐ横にある、松島の一部を利用した水族館です。「みて、ふれて、楽しく学べる」がテーマで、イルカショーやペンギンの散歩のほか、ガラス張りの水面の上に乗れる「さんごの海」の水槽や、ペンギンが泳ぐ姿を水中トンネルから見られるぺんぎん館があります。生き物にふれるときは、係の人の案内に従いましょう。" }),
  cre("三国湊", { h: 13, m: 10, stay: 60, mode: "car", min: 15, lat: 36.213871, lng: 136.148834, address: "福井県坂井市三国町北本町4-6-55",
    memo: "水族館から車で約15分、三国湊の町並みへ。江戸時代から明治のはじめにかけて、北前船の交易で栄えた港町で、格子戸の連なる町家や豪商の面影が残る商家が並びます。妻入りの屋根の正面に平入りの下屋がつく「かぐら建て」は、三国独特の建て方です。旧商家を改築した三国湊町家館では、昔の町の写真などを見ることができます。このあたりで昼食にしましょう。" + TOWN }),
  cre("旧岸名家", { h: 14, m: 15, stay: 35, mode: "walk", min: 5, lat: 36.2139348, lng: 136.1486944, address: "福井県坂井市三国町南本町4-6-54",
    memo: "町並みの中を歩いて約5分。三国湊で材木商を営んだ岸名惣助が代々住んだ町家で、この地域に特徴的な「かぐら建て」の建物です。1階には店の帳場や座敷、台所などがあり、2階には三国ゆかりの文化人の資料が展示されています。休館日は公式の案内で確かめましょう。" }),
  cre("瀧谷寺", { h: 15, m: 0, stay: 40, mode: "car", min: 10, lat: 36.2212186, lng: 136.146207, address: "福井県坂井市三国町滝谷1-7-15",
    memo: "三国湊から車で約10分。1375年に睿憲上人が開いた寺で、国宝や重要文化財を多く持ち、宝物殿には福井の地を治めた戦国武将の書状などが展示されています。柴田勝家が寄進した山門（鐘楼）や、本堂、観音堂などが重要文化財に指定され、築山式の池泉庭園は名勝に指定されています。" + RESPECT }),
  cre("坂井市龍翔博物館", { h: 15, m: 45, stay: 45, mode: "car", min: 5, lat: 36.2198953, lng: 136.151427, address: "福井県坂井市三国町緑ケ丘4-2-1",
    memo: "瀧谷寺から車で約5分。明治時代の「龍翔小学校」の外観を模した、日本海をのぞむ丘の上の五層八角形の洋風建築の博物館です。1981年に「みくに龍翔館」として開館し、2023年に坂井市龍翔博物館として新しくなりました。千石船の5分の1の模型や、高さ11mの三国祭の山車が見どころで、4階の展望室からは坂井市を見渡せます。休館日は公式の案内で確かめましょう。見学のあとは、車で約40分の福井駅へ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: true } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== TOJINBO) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? "東尋坊(既存)" : d.name} ${String(d.memo).length}字`);
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
