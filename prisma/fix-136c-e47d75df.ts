/**
 * #136 e47d75dfの直し(3回目)。企画運営・法務の指摘をまとめて反映。
 * ・黄金崎: 三島由紀夫(1970年没、著作権継続中)の引用を削除
 * ・車・宿のつながり(レンタカーの場所、宿の場所と移動時間)を追加
 * ・2日目の昼食を「ペリーロードのまわり」の独立スポットとして新設
 * ・龍宮窟の「パワースポット」表現を削除
 * ・安全の一文(トンボロの潮・堂ヶ島の遊覧船・断崖・温泉の入り方)を追加
 * ・座標4か所(三四郎島のトンボロ・沢田公園露天風呂・下田公園・
 *   下田ロープウェイ)をOSMの名前つきの点に修正
 * ・沢田公園露天風呂80→55分、石廊崎の文のつながりを修正
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KOGANEZAKI_MEMO =
  "修善寺駅前でレンタカーを借り、車でおよそ50分、黄金崎に着きます。夕日を受けると、黄褐色の岩肌が金色に輝くことから、この名がついたと伝えられています。小説家・三島由紀夫の小説『獣の戯れ』にも描かれた景勝地で、先端の展望台からは富士山を望むこともできます。崖のふちには近づかず、柵の内側から眺めましょう。静かに景色を楽しみましょう。この後は、車でおよそ5分、黄金崎クリスタルパークへ向かいましょう。";

const DOGASHIMA_MEMO =
  "大田子海岸から車でおよそ8分、堂ヶ島に着きます。入り組んだ入り江と、大小さまざまな島々が織りなす景観から、「伊豆の松島」とも呼ばれる西伊豆を代表する景勝地です。見どころの一つ「天窓洞」は、凝灰岩でできた海食洞で、洞内の天井が幾度もの陥没によって崩れ落ち、直径10数メートルほどの穴が開いたことからこの名前がついたと伝えられています。南側からの入り口は幅が広く、奥行きはおよそ147メートルにも及び、遊覧船に乗って洞窟内から見上げると、天井の穴からまるで天窓のように光が差し込む、幻想的な景色を楽しめます。昭和10年(1935)には国の天然記念物に指定され、一帯は国の名勝にも指定されています。遊覧船に乗るときは、係の人の案内に従いましょう。船に乗って、自然が生み出した神秘の洞窟を眺めましょう。このあたりには食事処も多いので、ここで昼食をとりましょう。この後は、歩いておよそ9分、三四郎島のトンボロへ向かいましょう。";

const TOMBOLO_MEMO =
  "堂ヶ島から歩いておよそ9分、三四郎島のトンボロに着きます。沖合いに浮かぶ伝兵衛島・中ノ島・沖ノ瀬島・高島の4つの島をまとめて三四郎島と呼び、見る角度によって3つに見えたり4つに見えたりすることが名の由来とされています。春から夏の時期の干潮時には、幅およそ30mの砂州が現れ、一番手前の伝兵衛島まで歩いて渡ることができます。この珍しい現象は「トンボロ」と呼ばれ、天然記念物に指定されています。潮が満ちてくると戻れなくなるので、潮の時間を確かめ、早めに戻りましょう。静かに景色を楽しみましょう。この後は、歩いておよそ14分、沢田公園露天風呂へ向かいましょう。";

const SAWADA_MEMO =
  "三四郎島のトンボロから歩いておよそ14分、沢田公園露天風呂に着きます。波打ち際の高台に立つ露天風呂で、夕暮れには海や小島が赤く染まる景色が広がります。この一帯の白い地層は、海底火山から噴き出したものが隆起してできたとされ、「伊豆半島ジオパーク」の見どころの一つにもなっています。ほかの入浴者を撮らないようにし、長湯は避けて、水分をとりながら入りましょう。湯につかりながら、海を眺めてゆっくり過ごしましょう。この後は、車でおよそ8分、室岩洞へ向かいましょう。";

const NAMAKO_MEMO =
  "伊豆の長八美術館から歩いておよそ3分、なまこ壁通りに着きます。四角い平瓦を斜めに並べ、継ぎ目を漆喰でかまぼこ状に盛り上げてつなぐ「なまこ壁」の町家が残る、松崎町のシンボルの一つです。薬問屋だった近藤家の本宅と倉庫が、なまこ壁仕上げになっています。今も人が暮らしている町なので、静かに歩きましょう。見学を終えたら、車でおよそ10分、松崎の宿へ向かいましょう。";

const SHIMODAPARK_MEMO =
  "松崎の宿を出て、車でおよそ45分、下田公園のそばに車を止めます。嘉永7年(1854)、ペリー率いるアメリカ海軍の黒船が来航し、日本で最初に開港した港の一つとされる下田の歴史を伝える公園です。園内の開国広場には、開港100周年を記念して昭和28年(1953)に建てられた開国記念碑があり、幕末の開国に尽力した内外の先人をしのぶ「黒船祭」の主な会場としても使われています。昭和9年(1934)に始まったこの黒船祭は、世界平和と国際親善を願って、今も毎年開催されています。6月には、園内で咲き誇るあじさいにあわせて「あじさい祭」も開催され、花の名所としても親しまれています。静かに、園内を歩いてみましょう。この後は、歩いておよそ14分、唐人お吉記念館へ向かいましょう。";

const OKICHI_MEMO =
  "下田公園から歩いておよそ14分、唐人お吉記念館に着きます。宝福寺の境内にある記念館で、下田出身の女性・お吉(本名・斎藤きち)にまつわる品々を展示しています。お吉は、安政4年(1857)、日本に駐在した初代アメリカ総領事・ハリスの身の回りの世話をすることになった女性で、幕末から明治にかけての開国の時代を象徴する人物として知られています。記念館には、お吉が使ったというかんざしなどの遺品が残されています。静かに見学しましょう。この後は、歩いておよそ8分、了仙寺へ向かいましょう。";

const RYOSENJI_MEMO =
  "唐人お吉記念館から歩いておよそ8分、了仙寺に着きます。1635年、下田奉行・今村正長が創建したと伝えられる寺です。嘉永7年(1854)、日米和親条約の細則を定めた下田条約が、この本堂で結ばれました。国の史跡に指定されています。境内には、ペリー艦隊の水兵が行進したという「ペリーロード」の入口もあります。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ6分、ペリーロードのまわりへ向かいましょう。";

const PERRYROAD_MEMO =
  "了仙寺から歩いておよそ6分、ペリーロードのまわりに着きます。開国期、ペリー艦隊の水兵が軍楽隊の演奏にあわせて行進したという石畳の小道で、今も食事処やみやげ物店が並んでいます。ここで昼食をとりましょう。食事を終えたら、歩いておよそ8分、下田海中水族館へ向かいましょう。";

const AQUA_MEMO =
  "ペリーロードのまわりから歩いておよそ8分、下田海中水族館に着きます。昭和42年(1967)に開館した水族館で、入り江を仕切った海に、円形の建物を浮かべているのが特徴です。この建物は、黒船来航の地にちなんで「ペリー号」と名づけられました。当時は「世界唯一の海に浮かぶ海中水族館」と呼ばれていたとされ、ガラス窓越しに、ありのままの海をのぞくことができます。イルカやアシカ、アザラシ、ペンギンなど、伊豆の海を再現した展示で、さまざまな生き物を観察できます。見学を終えたら、歩いておよそ20分、下田ロープウェイへ向かいましょう。";

const ROPEWAY_MEMO =
  "下田海中水族館から歩いておよそ20分、下田ロープウェイの駅に着きます。ロープウェイで登った山頂には、寝姿山山頂公園があります。晴れた日には、黒船が来航した下田港や伊豆七島まで見渡せる、伊豆三大絶景の一つとされる眺めが広がります。公園内には、縁結びの祠として知られる愛染堂もあります。花々が四季を通じて楽しめる公園を、ゆっくり歩いてみましょう。見学を終えたら、ロープウェイで下り、歩いて停めていた車に戻り、車でおよそ10分、龍宮窟へ向かいましょう。";

const RYUGU_MEMO =
  "下田ロープウェイから、車でおよそ10分、龍宮窟に着きます。太平洋の波が地層の弱い部分を削ってできた海食洞で、浸食が進んで天井が崩落し、直径40mほどの天窓のような開口部が開いたと伝えられています。上から見下ろすと、その開口部がハート形に見えます。下に降りる遊歩道もあり、間近で海食洞を見ることもできます。足元に気をつけて歩きましょう。この後は、車でおよそ15分、石廊崎へ向かいましょう。";

const IROUZAKI_MEMO =
  "龍宮窟から、車でおよそ15分、石廊崎に着きます。伊豆半島の最南端に位置する岬で、海抜およそ60mの断崖に石廊埼灯台が立っています。明治4年(1871)、「日本の灯台の父」と呼ばれるイギリス人技師・ブラントンの設計で初めて灯がともり、日本で最初の洋式木造灯台だったとされます。昭和7年(1932)の暴風で壊れ、翌年にコンクリート造りに建て替えられました。灯台からさらに進むと、断崖にへばりつくように石室神社が鎮座しています。崖のふちには近づかず、柵の内側から眺めましょう。静かに、敬意を持ってお参りしましょう。見学を終えたら、車でおよそ35分、下田駅へ向かい、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e47d75df%'`);
  const itinId = rows[0].id;

  const kogane = await findSpotInItinerary(itinId, { spotName: "黄金崎" });
  const dogashima = await findSpotInItinerary(itinId, { spotName: "堂ヶ島" });
  const tombolo = await findSpotInItinerary(itinId, { spotName: "三四郎島のトンボロ" });
  const sawada = await findSpotInItinerary(itinId, { spotName: "沢田公園露天風呂" });
  const namako = await findSpotInItinerary(itinId, { spotName: "なまこ壁通り" });
  const shimodapark = await findSpotInItinerary(itinId, { spotName: "下田公園" });
  const okichi = await findSpotInItinerary(itinId, { spotName: "唐人お吉記念館" });
  const ryosenji = await findSpotInItinerary(itinId, { spotName: "了仙寺" });
  const aqua = await findSpotInItinerary(itinId, { spotName: "下田海中水族館" });
  const ropeway = await findSpotInItinerary(itinId, { spotName: "下田ロープウェイ" });
  const ryugu = await findSpotInItinerary(itinId, { spotName: "龍宮窟" });
  const irouzaki = await findSpotInItinerary(itinId, { spotName: "石廊崎" });
  const muroiwado = await findSpotInItinerary(itinId, { spotName: "室岩洞" });
  const chohachi = await findSpotInItinerary(itinId, { spotName: "伊豆の長八美術館" });

  console.log("day1:", kogane.dayId, "day2:", shimodapark.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    // Day1: 既存スポットの更新のみ(新規スポットなし)
    await tx.spot.update({ where: { id: kogane.id }, data: { memo: KOGANEZAKI_MEMO } });
    await tx.spot.update({
      where: { id: dogashima.id },
      data: { memo: DOGASHIMA_MEMO, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] } },
    });
    await tx.spot.update({
      where: { id: tombolo.id },
      data: {
        lat: 34.785041, lng: 138.762092, stayDurationMin: 35, memo: TOMBOLO_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
      },
    });
    await tx.spot.update({
      where: { id: sawada.id },
      data: {
        lat: 34.777413, lng: 138.765646, visitTime: t(13, 19), stayDurationMin: 55, memo: SAWADA_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14 }] },
      },
    });
    await tx.spot.update({ where: { id: muroiwado.id }, data: { visitTime: t(14, 22), stayDurationMin: 35 } });
    await tx.spot.update({ where: { id: chohachi.id }, data: { visitTime: t(15, 2), stayDurationMin: 50 } });
    await tx.spot.update({
      where: { id: namako.id },
      data: { visitTime: t(15, 55), stayDurationMin: 45, memo: NAMAKO_MEMO },
    });

    // Day2: ペリーロードのまわり(昼食)を新設
    const day2: SpotOrderItem[] = [
      { id: shimodapark.id, data: { lat: 34.668429, lng: 138.945694, memo: SHIMODAPARK_MEMO } },
      {
        id: okichi.id,
        data: { visitTime: t(10, 44), memo: OKICHI_MEMO, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14 }] } },
      },
      { id: ryosenji.id, data: { visitTime: t(11, 22), memo: RYOSENJI_MEMO } },
      {
        create: {
          name: "ペリーロードのまわり", lat: 34.6690164, lng: 138.9416409, visitTime: t(12, 3), stayDurationMin: 55, memo: PERRYROAD_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
        },
      },
      {
        id: aqua.id,
        data: { visitTime: t(13, 6), stayDurationMin: 65, memo: AQUA_MEMO, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] } },
      },
      {
        id: ropeway.id,
        data: { lat: 34.678826, lng: 138.946113, visitTime: t(14, 31), stayDurationMin: 45, memo: ROPEWAY_MEMO },
      },
      { id: ryugu.id, data: { visitTime: t(15, 26), stayDurationMin: 30, memo: RYUGU_MEMO } },
      { id: irouzaki.id, data: { visitTime: t(16, 11), stayDurationMin: 45, memo: IROUZAKI_MEMO } },
    ];
    await setDaySpotOrder(shimodapark.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
