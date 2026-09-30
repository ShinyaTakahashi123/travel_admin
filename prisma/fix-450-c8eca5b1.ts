/**
 * #450 c8eca5b1（松江 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 1か所（堀川めぐり 09:30〜10:40）。城 → 堀川めぐり → 城の北の塩見縄手へ、バスと歩きでめぐる（戻らない）
 *   松江城（新規）9:00〜10:10 →（歩き5分）松江歴史館（新規）10:15〜11:10 →（歩き5分）堀川めぐり 11:15〜12:10 →（歩き10分）塩見縄手（新規・昼食）12:20〜13:25
 *   →（歩き2分）武家屋敷（新規）13:27〜14:05 →（歩き3分）小泉八雲旧居（新規）14:08〜14:45 →（歩き1分）小泉八雲記念館（新規）14:46〜15:50 →（歩き5分）明々庵（新規）15:55〜16:30
 *   閉まる時刻: 松江城 8:30〜17:00（10〜3月、受付16:30）、歴史館 9:00〜17:00・月曜休館、堀川めぐり 9:00〜16:00（10〜2月）、武家屋敷・八雲旧居・記念館 9:00〜17:00（10〜3月、受付16:30）、
 *   明々庵 9:00〜17:00（10〜3月、最終受付16:40）。本文に時刻・曜日は書かない
 *   もとの本文は案内役の話し言葉で、確かめられない数（堀川3.7km、17の橋、からくり橋4つ、山陰で唯一など）もあったので、開いたページの事実だけで書き直す
 * 本文の出典: しまね観光ナビ https://www.kankou-shimane.com/destination/20247 （松江城）・20318（松江歴史館）・20454（塩見縄手）・20783（武家屋敷）・20565（小泉八雲旧居）・21166（小泉八雲記念館）・20621（明々庵）、
 *   国宝松江城 https://www.matsue-castle.jp/userguide/ 、松江観光協会 https://www.kankou-matsue.jp/kankou/desc/?cat=%E8%A6%B3%E5%85%89%E6%96%BD%E8%A8%AD&spot=27614 （堀川めぐり）・spot=27888（明々庵）
 * 座標の出典: OSM（松江城 way 299654325／松江歴史館 way 311398093／堀川遊覧船 大手前広場乗船場 node 1562515522／塩見縄手公園 way 1082685009（塩見縄手の通りの中ほど）／
 *   武家屋敷 way 317466193／小泉八雲旧居 way 317465587／小泉八雲記念館 way 317465585／明々庵 way 1081159332）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-450-c8eca5b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c8eca5b1-b460-490d-943b-33fab6a68230";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION = "国宝・松江城の天守に上り、松江歴史館で城下町の成り立ちを学んだら、堀川めぐりの舟で城を囲む堀をめぐります。午後は塩見縄手を歩き、武家屋敷、小泉八雲旧居と記念館、不昧ゆかりの茶室・明々庵へ。「水の都」松江の城下町を、水の上と歩きで楽しむプランです。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== "松江堀川めぐり") throw new Error("構成が想定と違います");
  const hori = day.spots[0];

  const order = [
    { create: { name: "松江城", visitTime: t(9, 0), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.475098, lng: 133.050762, address: "島根県松江市殿町",
      memo: "この旅はバスと歩きでめぐります。JR松江駅からぐるっと松江レイクラインバスで約10分、「国宝松江城（大手前）」で降りて松江城へ。松江開府の祖・堀尾吉晴が慶長12年（1607年）から5年をかけて完成させた城で、堀尾2代、京極1代、松平10代の居城でした。全国に現存する12天守の一つで、2015年に国宝に指定されています。最上階の天狗の間からは、松江の市街地や宍道湖を360度見渡せます。天守の中では足元に気をつけましょう。" } },
    { create: { name: "松江歴史館", visitTime: t(10, 15), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.475224, lng: 133.053506, address: "島根県松江市殿町279",
      memo: "松江城から東へ歩いて、堀川沿いに建つ松江歴史館へ。武家屋敷風の外観の博物館で、常設の基本展示室では、松江城と城下町の形成や、松江藩の歴史・文化、城下の人々の暮らしを、資料や映像、模型で紹介しています。館内の喫茶では、松江城の天守や日本庭園を眺めながら、抹茶と和菓子を味わえます。休館日は公式の案内で確かめましょう。" } },
    { id: hori.id, data: { visitTime: t(11, 15), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.473781, lng: 133.052743, address: "島根県松江市殿町（大手前広場乗船場）",
      memo: "歴史館の近く、大手前広場の乗船場から、ぐるっと松江堀川めぐりの舟へ。築城のときに造られた、松江城を囲む堀川を、約50分かけてゆっくりとめぐります。春は桜、夏は風鈴船、秋は紅葉、冬はこたつ船と、季節ごとに違う風情が楽しめます。荒天の日は運休やコースの変更があるので、公式の案内で確かめましょう。舟の乗り降りでは足元に気をつけましょう。" } },
    { create: { name: "塩見縄手", visitTime: t(12, 20), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.478792, lng: 133.049674, address: "島根県松江市北堀町",
      memo: "舟を降りたら、城の北側の塩見縄手へ歩きます。武家屋敷風の家が堀に面して軒を連ね、松江で最も城下町らしいたたずまいを残すといわれる通りで、小泉八雲記念館前から明々庵の入口までの約500mは、昭和48年（1973年）に松江市の「伝統美観地区」に指定されています。名前は、通りのほぼ中央に松江藩中老・塩見小兵衛の屋敷があったことにちなみ、「縄手」は細く延びる一本道のことです。このあたりで昼食にしましょう。" } },
    { create: { name: "武家屋敷", visitTime: t(13, 27), stayDurationMin: 38, transitMode: "walk", transitDurationMin: 2, transitLine: null, lat: 35.478593, lng: 133.05069, address: "島根県松江市北堀町305",
      memo: "塩見縄手のほぼ中央にある武家屋敷へ。江戸時代初期から、松江藩の中級から上級の藩士が屋敷替えで入れ替わり住んだところで、280年以上たった建物が昔の姿をよく残し、松江市の文化財に指定されています。客間を中心とした表側と裏側とで造りや材料を分け、公私の区別の厳しさを伝えています。入口の長屋門は、武家奉公人の部屋として使われていました。" } },
    { create: { name: "小泉八雲旧居（ヘルン旧居）", visitTime: t(14, 8), stayDurationMin: 37, transitMode: "walk", transitDurationMin: 3, transitLine: null, lat: 35.479225, lng: 133.049374, address: "島根県松江市北堀町315",
      memo: "武家屋敷から歩いて、小泉八雲旧居へ。「怪談」で知られる小泉八雲が、明治24年（1891年）6月から11月までの5か月間、妻のセツと暮らした旧松江藩士の武家屋敷です。『知られぬ日本の面影』の「日本の庭」の舞台となった、三方に庭が見える部屋などが当時のまま残され、書斎には愛用の机と椅子の複製が置かれていて、実際に座ってみることができます。" } },
    { create: { name: "小泉八雲記念館", visitTime: t(14, 46), stayDurationMin: 64, transitMode: "walk", transitDurationMin: 1, transitLine: null, lat: 35.479296, lng: 133.049142, address: "島根県松江市奥谷町322",
      memo: "旧居のとなりの小泉八雲記念館へ。『知られぬ日本の面影』や『怪談』などを通して、日本の文化や伝承を広く世界に紹介した小泉八雲（ラフカディオ・ハーン）の記念館です。八雲の生涯や考え方をグラフィックや映像で紹介し、遺愛品や初版本、直筆原稿などを展示しています。「再話」のコーナーでは、八雲が再話した山陰地方の怪談を聞くことができます。" } },
    { create: { name: "明々庵", visitTime: t(15, 55), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.478821, lng: 133.05227, address: "島根県松江市北堀町278",
      memo: "記念館から塩見縄手を歩き、松江城を望む高台の明々庵へ。安永8年（1779年）に、松江藩7代藩主・治郷（不昧）の指図で建てられた茶室で、島根県の文化財に指定されています。茅葺の入母屋に掛けられた「明々庵」の額は不昧の直筆です。庭を望む茶室では、抹茶と不昧ゆかりの和菓子をいただけます。上り坂では足元に気をつけましょう。水の都・松江の城下町をめぐる旅を、ここで締めくくりましょう。帰りは、塩見縄手のバス停からレイクラインバスで松江駅へ。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 松江城 9:00 → 歴史館 10:15 → 堀川めぐり 11:15〜12:10 → 塩見縄手（昼食）12:20〜13:25 → 武家屋敷 13:27 → 八雲旧居 14:08 → 八雲記念館 14:46 → 明々庵 15:55〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
