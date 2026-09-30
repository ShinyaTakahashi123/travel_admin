/**
 * #449 c599bbfc（伊万里・大川内山 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 1か所（大川内山 09:30〜11:10）。午前は大川内山、午後は路線バスで伊万里駅へ戻り、町を歩く
 *   大川内山 9:20〜10:15 →（歩き5分）伊万里・有田焼伝統産業会館（新規）10:20〜11:20 →（歩き5分）鍋島藩窯公園（新規）11:25〜12:05
 *   →（路線バス30分）伊万里・鍋島ギャラリー（新規・昼食）12:35〜13:35 →（歩き10分）伊万里市陶器商家資料館（新規）13:45〜14:25
 *   →（歩き10分）伊萬里神社（新規）14:35〜15:20 →（歩き10分）伊万里市歴史民俗資料館（新規）15:30〜16:30、帰りは伊万里駅まで歩く
 *   閉まる時刻: 伝統産業会館 9:00〜17:00、ギャラリー・陶器商家資料館・歴史民俗資料館 10:00〜17:00（月曜休館）。本文に時刻・曜日は書かない
 *   もとの本文は案内役の話し言葉だったので、開いたページの事実だけで書き直す
 * 本文の出典: 伊万里鍋島焼協同組合 https://imari-ookawachiyama.com/ ・/access/ 、あそぼーさが https://www.asobo-saga.jp/spots/detail/6f1d92bf-01fe-44ed-aaf9-59a1c55b40d7 （大川内山・伊万里駅から車で15分、バスあり）・
 *   /spots/detail/0811cae0-5d61-4040-9a3b-10f4e559bb00 （伊万里・鍋島ギャラリー）・/spots/detail/767c311b-f616-4556-aa3e-8dcfe8aca1b6 （伊萬里神社）、
 *   伊万里市観光協会 https://imari-kankou.com/course/ookawachiyama_halfdaycourse/ （藩窯橋・関所跡・藩窯公園）・/course/machinaka_halfday/ （ギャラリー・相生橋）、
 *   伊万里市 https://www.city.imari.lg.jp/4483.htm （伝統産業会館）・/21160.htm （陶器商家資料館）・/6538.htm （歴史民俗資料館）、伊萬里神社 https://imari-jinja.jp/ 、
 *   伊万里陶磁器工業協同組合 https://imari-toujiki.or.jp/about-the-hall/
 * 座標の出典: OSM（大川内山 way 260195961／伊万里・有田焼伝統産業会館 node 7254755076／鍋島藩窯公園 way 1219538226／伊万里・鍋島ギャラリー node 1423798549／
 *   伊萬里神社 way 958202793／伊万里市歴史民俗資料館 node 1423798584）。陶器商家資料館は OSM に点がないので、地理院の住所検索（伊万里町甲555番地）33.274479,129.876144
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-449-c599bbfc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c599bbfc-3cff-41f4-b6ea-5fd8de9c9068";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "鍋島藩の御用窯が置かれた「秘窯の里」大川内山で、窯元通りや伊万里・有田焼伝統産業会館、鍋島藩窯公園をめぐり、午後は伊万里の町へ。駅ビルの伊万里・鍋島ギャラリー、陶器商家資料館、伊萬里神社、歴史民俗資料館をたずね、焼き物の里と積み出しの港町の歴史を歩いてたどるプランです。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== "大川内山") throw new Error("構成が想定と違います");
  const okawachi = day.spots[0];

  const order = [
    { id: okawachi.id, data: { visitTime: t(9, 20), stayDurationMin: 55, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.234176, lng: 129.894288, address: "佐賀県伊万里市大川内町",
      memo: "この旅は路線バスと歩きでめぐります。JR筑肥線・松浦鉄道の伊万里駅から大川内山までは車で約15分の道のりで、路線バスも通っています。バスの本数は少ないので、時刻は前もって確かめましょう。大川内山は、江戸時代に佐賀藩（鍋島家）の御用窯が置かれ、朝廷や将軍家への献上品として最高峰の磁器「鍋島焼」が作られた地です。三方を険しい山に囲まれ、人の行き来は関所で管理されていたため、陶工の高い技術を守るのに向いていました。鍋島焼の伝統は明治4年（1871年）の廃藩置県でいったん途絶えましたが、その後復興され、今も30軒ほどの窯元が軒を連ねています。窯元通りを歩いたら、鍋島焼のモザイクタイルと壺で飾られた鍋島藩窯橋や、陶工が外に出ることを許されなかった時代の関所跡も見てみましょう。" } },
    { create: { name: "伊万里・有田焼伝統産業会館", visitTime: t(10, 20), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 33.236243, lng: 129.892139, address: "佐賀県伊万里市大川内町丙221-2",
      memo: "窯元通りから歩いて、伊万里・有田焼伝統産業会館へ。伊万里焼・有田焼の振興の拠点として、資料の展示や後継者の育成に使われている会館です。絵付体験もでき、10名以上のときは予約が必要です。" } },
    { create: { name: "鍋島藩窯公園", visitTime: t(11, 25), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 33.234088, lng: 129.891634, address: "佐賀県伊万里市大川内町",
      memo: "会館から歩いて、鍋島藩窯があったエリアの鍋島藩窯公園へ。10室もあった江戸時代の登り窯の跡「清源下古窯跡」や、江戸初期の大きな登り窯だった「お経石古窯跡」、登り窯で使われた耐火れんが（トンバイ）でつくったトンバイ橋、陶片とトンバイでモザイク画のようにつくった大壁画、再現された登り窯などが見られます。石段や坂道では足元に気をつけましょう。見学のあとは、路線バスで伊万里駅へ戻ります。" } },
    { create: { name: "伊万里・鍋島ギャラリー", visitTime: t(12, 35), stayDurationMin: 60, transitMode: "bus", transitDurationMin: 30, transitLine: "路線バス", lat: 33.271881, lng: 129.876212, address: "佐賀県伊万里市新天町622-13（伊万里駅ビル西ビル2階）",
      memo: "大川内山から路線バスで伊万里駅へ戻り、駅ビルの西ビル2階にある伊万里・鍋島ギャラリーへ。伊万里駅ビルの新築にあわせて平成15年（2003年）に開かれた、やきもの専門のステーションミュージアムです。江戸時代に作られた伊万里市所蔵の鍋島焼などを見ながら、古伊万里と伊万里焼の違いや、献上品だった鍋島焼について知ることができます。休館日は公式の案内で確かめましょう。見学のあとは、駅のまわりで昼食にしましょう。" } },
    { create: { name: "伊万里市陶器商家資料館", visitTime: t(13, 45), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 33.274479, lng: 129.876144, address: "佐賀県伊万里市伊万里町甲555-1",
      memo: "駅から歩いて、伊万里市陶器商家資料館へ。江戸時代の姿のまま残されてきた陶器商家・旧犬塚家を、伊万里市が資料館として公開しているもので、「うなぎの寝床」と呼ばれる町家の造りです。館内では古伊万里が展示されています。近くの相生橋のたもとからは、江戸時代に肥前の磁器が積み出され、「古伊万里」の名で全国各地へ、ヨーロッパへは「OLD IMARI」として海を渡りました。休館日は公式の案内で確かめましょう。" } },
    { create: { name: "伊萬里神社", visitTime: t(14, 35), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 33.276484, lng: 129.881955, address: "佐賀県伊万里市立花町83",
      memo: "資料館から歩いて、伊萬里神社へ。770年から鎮座すると伝わり、伊万里の鬼門を守る神社とされています。霊菓の祖とされる田道間守命が、不老長寿の霊菓「非時香菓」を得て日本に帰りついた最初の場所が、神社のある岩栗山だったという言い伝えから、境内にはお菓子の神さま「中嶋神社」があります。伊万里出身の製菓王・森永太一郎の像も建っています。" + RESPECT } },
    { create: { name: "伊万里市歴史民俗資料館", visitTime: t(15, 30), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 33.27971, lng: 129.878474, address: "佐賀県伊万里市松島町73-1",
      memo: "神社から歩いて、伊万里市歴史民俗資料館へ。古墳時代から中世・近世にかけての郷土の遺物や古文書などを保存・公開していて、古唐津の陶片や江戸時代初期の古伊万里も展示されています。休館日は公式の案内で確かめましょう。秘窯の里と、古伊万里の積み出しで栄えた町をめぐる旅を、ここで締めくくりましょう。帰りは、伊万里駅まで歩いて戻ります。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 大川内山 9:20 → 伝統産業会館 10:20 → 藩窯公園 11:25〜12:05 →（バス）鍋島ギャラリー 12:35〜13:35 → 陶器商家資料館 13:45 → 伊萬里神社 14:35 → 歴史民俗資料館 15:30〜16:30");
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
