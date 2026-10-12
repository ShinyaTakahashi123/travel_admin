/**
 * #136 e47d75dfの直し。もとはDay1が堂ヶ島の1か所(10:00〜11:30)、
 * Day2が下田公園の1か所(09:30〜10:30)のみで、両日とも4か所未満、
 * 終始案内役の話し方。
 * Day1(西伊豆)に黄金崎・黄金崎クリスタルパーク・大田子海岸・
 * 三四郎島のトンボロ・沢田公園露天風呂・室岩洞・伊豆の長八美術館・
 * なまこ壁通りを追加し9か所に。
 * Day2(南伊豆)に唐人お吉記念館・了仙寺・下田海中水族館・
 * 下田ロープウェイ(寝姿山)・龍宮窟・石廊崎を追加し7か所に。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DOGASHIMA_MEMO =
  "大田子海岸から車でおよそ8分、堂ヶ島に着きます。入り組んだ入り江と、大小さまざまな島々が織りなす景観から、「伊豆の松島」とも呼ばれる西伊豆を代表する景勝地です。見どころの一つ「天窓洞」は、凝灰岩でできた海食洞で、洞内の天井が幾度もの陥没によって崩れ落ち、直径10数メートルほどの穴が開いたことからこの名前がついたと伝えられています。南側からの入り口は幅が広く、奥行きはおよそ147メートルにも及び、遊覧船に乗って洞窟内から見上げると、天井の穴からまるで天窓のように光が差し込む、幻想的な景色を楽しめます。昭和10年(1935)には国の天然記念物に指定され、一帯は国の名勝にも指定されています。遊覧船に乗って、自然が生み出した神秘の洞窟を眺めましょう。この後は、歩いておよそ7分、三四郎島のトンボロへ向かいましょう。";

const KOGANEZAKI_MEMO =
  "黄金崎に着きます。夕日を受けると、黄褐色の岩肌が金色に輝くことから、この名がついたと伝えられています。小説家・三島由紀夫の『獣の戯れ』にも「平滑な一枚の黄金の板のやうに見える」と記された景勝地で、先端の展望台からは富士山を望むこともできます。静かに景色を楽しみましょう。この後は、車でおよそ5分、黄金崎クリスタルパークへ向かいましょう。";

const CRYSTALPARK_MEMO =
  "黄金崎から車でおよそ5分、黄金崎クリスタルパークに着きます。平成9年(1997)に開館した、現代ガラスの専門美術館です。世界的に知られるガラス作家の作品を常設展示するほか、企画展やサンドブラスト・ステンドグラスなどのガラス工芸体験もできます。ガラスの美しさをゆっくり楽しみましょう。この後は、車でおよそ8分、大田子海岸へ向かいましょう。";

const OTAGO_MEMO =
  "黄金崎クリスタルパークから車でおよそ8分、大田子海岸に着きます。「日本の夕陽百選」に数えられる海岸で、沖には「めがねっちょ」と呼ばれる奇岩や、田子島が浮かんでいます。春分・秋分のころには、沈む夕日がこの奇岩と重なる光景が見られるといわれています。静かに景色を楽しみましょう。この後は、車でおよそ8分、堂ヶ島へ向かいましょう。";

const TOMBOLO_MEMO =
  "堂ヶ島から歩いておよそ7分、三四郎島のトンボロに着きます。沖合いに浮かぶ伝兵衛島・中ノ島・沖ノ瀬島・高島の4つの島をまとめて三四郎島と呼び、見る角度によって3つに見えたり4つに見えたりすることが名の由来とされています。春から夏の時期の干潮時には、幅およそ30mの砂州が現れ、一番手前の伝兵衛島まで歩いて渡ることができます。この珍しい現象は「トンボロ」と呼ばれ、天然記念物に指定されています。干潮の時間によっては現れないこともあります。静かに景色を楽しみましょう。この後は、歩いておよそ6分、沢田公園露天風呂へ向かいましょう。";

const SAWADA_MEMO =
  "三四郎島のトンボロから歩いておよそ6分、沢田公園露天風呂に着きます。波打ち際の高台に立つ露天風呂で、夕暮れには海や小島が赤く染まる景色が広がります。この一帯の白い地層は、海底火山から噴き出したものが隆起してできたとされ、「伊豆半島ジオパーク」の見どころの一つにもなっています。湯につかりながら、海を眺めてゆっくり過ごしましょう。この後は、車でおよそ8分、室岩洞へ向かいましょう。";

const MUROIWADO_MEMO =
  "沢田公園露天風呂から車でおよそ8分、室岩洞に着きます。江戸城の石垣にも使われたという伊豆石を切り出していた、人の手で掘られた石切り場の跡です。全長およそ180mの遊歩道が整備され、石を切り出す様子を伝える彫像や、湧き水がたまった小さな池も見られます。足元に気をつけて歩きましょう。この後は、車でおよそ5分、伊豆の長八美術館へ向かいましょう。";

const CHOHACHI_MEMO =
  "室岩洞から車でおよそ5分、伊豆の長八美術館に着きます。文化12年(1815)に松崎で生まれた左官職人・入江長八は、鏝を使って漆喰を盛り上げながら彩色する「漆喰鏝絵」や、漆喰で彫像をつくる「漆喰彫刻」という技法を究め、「伊豆の長八」として名をはせました。館内には、長八の作品がおよそ60点展示されています。精緻な作品を、ゆっくり眺めましょう。この後は、歩いておよそ3分、なまこ壁通りへ向かいましょう。";

const NAMAKO_MEMO =
  "伊豆の長八美術館から歩いておよそ3分、なまこ壁通りに着きます。四角い平瓦を斜めに並べ、継ぎ目を漆喰でかまぼこ状に盛り上げてつなぐ「なまこ壁」の町家が残る、松崎町のシンボルの一つです。薬問屋だった近藤家の本宅と倉庫が、なまこ壁仕上げになっています。今も人が暮らしている町なので、静かに歩きましょう。見学を終えたら、宿へ向かいましょう。";

const SHIMODAPARK_MEMO =
  "宿を出て、車で下田公園に着きます。嘉永7年(1854)、ペリー率いるアメリカ海軍の黒船が来航し、日本で最初に開港した港の一つとなった下田の歴史を伝える公園です。園内の開国広場には、開港100周年を記念して昭和28年(1953)に建てられた開国記念碑があり、幕末の開国に尽力した内外の先人をしのぶ「黒船祭」の主な会場としても使われています。昭和9年(1934)に始まったこの黒船祭は、世界平和と国際親善を願って、今も毎年開催されています。6月には、園内で咲き誇るあじさいにあわせて「あじさい祭」も開催され、花の名所としても親しまれています。静かに、園内を歩いてみましょう。この後は、歩いておよそ7分、唐人お吉記念館へ向かいましょう。";

const OKICHI_MEMO =
  "下田公園から歩いておよそ7分、唐人お吉記念館に着きます。宝福寺の境内にある記念館で、下田出身の女性・お吉(本名・斎藤きち)にまつわる品々を展示しています。お吉は、安政4年(1857)、日本に駐在した初代アメリカ総領事・ハリスの身の回りの世話をすることになった女性で、幕末から明治にかけての開国の時代を象徴する人物として知られています。記念館には、お吉が使ったというかんざしなどの遺品が残されています。静かに見学しましょう。この後は、歩いておよそ8分、了仙寺へ向かいましょう。";

const RYOSENJI_MEMO =
  "唐人お吉記念館から歩いておよそ8分、了仙寺に着きます。1635年、下田奉行・今村正長が創建したと伝えられる寺です。嘉永7年(1854)、日米和親条約の細則を定めた下田条約が、この本堂で結ばれました。国の史跡に指定されています。境内には、ペリー艦隊の水兵が行進したという「ペリーロード」の入口もあります。このあたりには食事処も多いので、ここで昼食をとりましょう。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ10分、下田海中水族館へ向かいましょう。";

const AQUA_MEMO =
  "了仙寺から歩いておよそ10分、下田海中水族館に着きます。昭和42年(1967)に開館した水族館で、入り江を仕切った海に、円形の建物を浮かべているのが特徴です。この建物は、黒船来航の地にちなんで「ペリー号」と名づけられました。当時は「世界唯一の海に浮かぶ海中水族館」と呼ばれていたとされ、ガラス窓越しに、ありのままの海をのぞくことができます。イルカやアシカ、アザラシ、ペンギンなど、伊豆の海を再現した展示で、さまざまな生き物を観察できます。見学を終えたら、歩いておよそ20分、下田ロープウェイへ向かいましょう。";

const ROPEWAY_MEMO =
  "下田海中水族館から歩いておよそ20分、下田ロープウェイの駅に着きます。ロープウェイで登った山頂には、寝姿山山頂公園があります。晴れた日には、黒船が来航した下田港や伊豆七島まで見渡せる、伊豆三大絶景の一つとされる眺めが広がります。公園内には、縁結びの祠として知られる愛染堂もあります。花々が四季を通じて楽しめる公園を、ゆっくり歩いてみましょう。この後は、車でおよそ10分、龍宮窟へ向かいましょう。";

const RYUGU_MEMO =
  "下田ロープウェイから、車でおよそ10分、龍宮窟に着きます。太平洋の波が地層の弱い部分を削ってできた海食洞で、浸食が進んで天井が崩落し、直径40mほどの天窓のような開口部が開いたと伝えられています。上から見下ろすと、その開口部がハート形に見えることから、恋愛のパワースポットとして人気を集めています。下に降りる遊歩道もあり、間近で海食洞を見ることもできます。足元に気をつけて歩きましょう。この後は、車でおよそ15分、石廊崎へ向かいましょう。";

const IROUZAKI_MEMO =
  "龍宮窟から、車でおよそ15分、石廊崎に着きます。伊豆半島の最南端に位置する岬で、海抜およそ60mの断崖に石廊埼灯台が立っています。明治4年(1871)、「日本の灯台の父」と呼ばれるイギリス人技師・ブラントンの設計で、日本で最初の洋式木造灯台だったとされ、初点灯しました。昭和7年(1932)の暴風で壊れ、翌年にコンクリート造りに建て替えられました。灯台からさらに進むと、断崖にへばりつくように石室神社が鎮座しています。静かに、敬意を持ってお参りしましょう。見学を終えたら、車でおよそ35分、下田駅へ向かい、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e47d75df%'`);
  const itinId = rows[0].id;
  const dogashima = await findSpotInItinerary(itinId, { spotName: "堂ヶ島" });
  const shimodapark = await findSpotInItinerary(itinId, { spotName: "下田公園" });

  console.log("day1:", dogashima.dayId, "day2:", shimodapark.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      { create: { name: "黄金崎", lat: 34.8429695, lng: 138.7612334, visitTime: t(9, 0), stayDurationMin: 25, memo: KOGANEZAKI_MEMO } },
      {
        create: {
          name: "黄金崎クリスタルパーク", lat: 34.8441124, lng: 138.7684162, visitTime: t(9, 30), stayDurationMin: 50, memo: CRYSTALPARK_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
        },
      },
      {
        create: {
          name: "大田子海岸", lat: 34.8088572, lng: 138.7659231, visitTime: t(10, 28), stayDurationMin: 25, memo: OTAGO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
      {
        id: dogashima.id,
        data: {
          visitTime: t(11, 1), stayDurationMin: 80, memo: DOGASHIMA_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "三四郎島のトンボロ", lat: 34.78021, lng: 138.766185, visitTime: t(12, 28), stayDurationMin: 35, memo: TOMBOLO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        create: {
          name: "沢田公園露天風呂", lat: 34.7769504, lng: 138.7656752, visitTime: t(13, 9), stayDurationMin: 80, memo: SAWADA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
        },
      },
      {
        create: {
          name: "室岩洞", lat: 34.751049, lng: 138.7685222, visitTime: t(14, 37), stayDurationMin: 30, memo: MUROIWADO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "伊豆の長八美術館", lat: 34.7487946, lng: 138.7765772, visitTime: t(15, 12), stayDurationMin: 40, memo: CHOHACHI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
        },
      },
      {
        create: {
          name: "なまこ壁通り", lat: 34.7501205, lng: 138.7778131, visitTime: t(15, 55), stayDurationMin: 35, memo: NAMAKO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
    ];
    await setDaySpotOrder(dogashima.dayId, day1, { tx });

    const day2: SpotOrderItem[] = [
      { id: shimodapark.id, data: { visitTime: t(9, 30), stayDurationMin: 60, memo: SHIMODAPARK_MEMO } },
      {
        create: {
          name: "唐人お吉記念館", lat: 34.676431, lng: 138.943055, visitTime: t(10, 37), stayDurationMin: 30, memo: OKICHI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        create: {
          name: "了仙寺", lat: 34.6721798, lng: 138.9416489, visitTime: t(11, 15), stayDurationMin: 35, memo: RYOSENJI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "下田海中水族館", lat: 34.6661667, lng: 138.9460634, visitTime: t(12, 0), stayDurationMin: 80, memo: AQUA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "下田ロープウェイ", lat: 34.6790026, lng: 138.948986, visitTime: t(13, 40), stayDurationMin: 60, memo: ROPEWAY_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] },
        },
      },
      {
        create: {
          name: "龍宮窟", lat: 34.6422393, lng: 138.9152567, visitTime: t(14, 50), stayDurationMin: 35, memo: RYUGU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "石廊崎", lat: 34.6019509, lng: 138.8460475, visitTime: t(15, 40), stayDurationMin: 50, memo: IROUZAKI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
        },
      },
    ];
    await setDaySpotOrder(shimodapark.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
