/**
 * #326 草津温泉(冬)。D1 4か所13:00〜16:25(開始遅い・終了窓外)、
 * D2 2か所09:30〜13:30(4か所未満・終了早い)を、D1 6か所09:30〜16:33、
 * D2 4か所09:30〜16:35に組み直す。
 *
 * D1に追加: 御座之湯(江戸・明治の共同湯を再現した日帰り温泉)・
 * 草津熱帯圏(熱帯の動植物園)。熱乃湯の「湯もみと踊りショー」の実際の
 * 上演時刻(9:30/10:00/10:30/15:30/16:00/16:30、1回20分、
 * kusatsu-onsen.ne.jp系の複数サイトで確認)にあわせ、熱乃湯を1番目の
 * スポットにして9:30開始とした。
 *
 * D2に追加: 道の駅 草津運動茶屋公園(ベルツ記念館)・草津ガラス蔵
 * (とんぼ玉創作体験)。既存2スポットの過剰な丁寧語(「ご案内するのは」
 * 「本日最後にご案内するのは」)も直した。移動手段は、既存の大滝乃湯→
 * スキー場のbus/15をcar/15に変更し(itinerary-audit「車と公共交通が
 * 混在」を避けるため)、1日を通してcarで統一した。
 *
 * 座標の出典(いずれもNominatim名称一致、またはGSI住所検索):
 * - 御座之湯: 36.622339,138.5959788(Nominatim, way 954786837)
 * - 草津熱帯圏: 36.6225511,138.604275(Nominatim, way 954648883)
 * - 道の駅草津運動茶屋公園: 36.6147932,138.5901789(Nominatim, node
 *   8866262926)
 * - 草津ガラス蔵2号館: 36.623199,138.593445(GSI住所検索「群馬県草津町
 *   草津483番地」、2号館の住所483-1に対応)
 *
 * 事実確認(いずれも直接開いて確認):
 * - kusatsu-onsen.ne.jp/kankou/1090.php: 御座之湯は江戸・明治の共同湯
 *   を再現。「木之湯」「石之湯」の2浴室、湯畑源泉と万代源泉、2階に
 *   45畳の広間
 * - ja.wikipedia.org「道の駅草津運動茶屋公園」: 標高1,231m、全国の
 *   道の駅で道の駅美ヶ原高原に次いで2番目の高さ。2階のベルツ記念館は
 *   ドイツ人医師エルヴィン・フォン・ベルツの功績を紹介。国道を挟んだ
 *   両施設はエレベーター付きの展望歩道橋で結ばれる。高山植物園は夏期
 *   限定のため本文では触れていない
 * - WebSearch複数サイト: 草津熱帯圏は高さ15mのドームに250種1,000頭、
 *   カピバラ・ワニ・ナマケモノ・キツネザル等、爬虫類の飼育展示数は
 *   国内でも有数
 * - co-trip.jp等: 草津ガラス蔵2号館のとんぼ玉創作体験は制作15〜20分、
 *   冷却に1時間ほど(その間1号館・3号館を見学可能)
 *
 * 自己チェック: 草津温泉スキー場の既存の記述「日本で最初にリフトを
 * 導入した地としても知られる」に言い切りヘッジ(itinerary-audit「言い切り?」)
 * が無かったため、「とされる」に直した(「とも伝えられる」は正規表現
 * /と伝え/に一致しないため、一度目の修正では検出が消えなかった)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already1 = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "御座之湯" } });
  const already2 = await prisma.spot.findFirst({ where: { dayId: day2.id, name: "草津ガラス蔵" } });

  const yubatake = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "湯畑" } });
  const netsunoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "熱乃湯（湯もみショー）" } });
  const kousenji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "光泉寺" } });
  const nishinokawara = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "西の河原公園・露天風呂" } });

  const otakinoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "大滝乃湯" } });
  const skijo = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "草津温泉スキー場" } });

  // Day1
  const netsunoyuMemo =
    "草津温泉のシンボル・湯畑のほど近くに立つ熱乃湯では、草津温泉名物「湯もみと踊りショー」が1日に何度か上演されています。草津の源泉は50度近い高温のため、水で薄めると温泉の効能が薄れるとされることから、江戸時代、長さおよそ180センチの板で湯をかき混ぜて冷ます「湯もみ」の技法が生み出されました。「チョイナ、チョイナ」のかけ声で知られる草津節などの湯もみ唄にあわせて実演されるこのショーは、昭和35年(1960)に始まって以来、草津温泉を代表する名物として親しまれています。建物は平成27年(2015)、大正ロマンを思わせる姿へと生まれ変わりました。息の合ったかけ声とともに湯気を巻き上げる湯もみの迫力を、間近で眺めてみましょう。続いては、歩いておよそ2分の御座之湯へ向かいましょう。";

  const yubatakeMemo =
    "御座之湯からは歩いておよそ2分です。湯畑は、毎分およそ4,000リットルもの高温の湯が湧き出す、草津のシンボルです。冬場は気温が下がる分、立ちのぼる湯けむりがいっそう濃く見え、雪化粧した湯畑はひときわ幻想的な表情を見せてくれます。湯畑に架けられた7本の木樋は、高温の源泉を冷ましながら湯の花を採る、江戸時代から伝わる知恵の結晶で、現在の湯畑の姿は昭和50年(1975)、芸術家・岡本太郎がデザインと監修を手がけて整えられたものです。夜にはライトアップも行われ、雪との組み合わせはまた格別の美しさです。この冬ならではの湯けむりを、じっくりと眺めてみましょう。続いては、歩いておよそ5分の光泉寺へ向かいましょう。";

  const kousenjiMemo =
    "湯畑からは歩いておよそ5分です。光泉寺は、湯畑を見下ろす高台に立つ寺です。養老5年(721)、高僧・行基が温泉で人々の病を癒やそうと薬師堂を建てたのが始まりと伝えられ、正治2年(1200)には、この地を治めていた湯本氏によって、温泉の守り神・白根明神の別当寺として再建されました。雪に包まれた境内から見下ろす湯畑は、湯けむりの白さと雪の白さが重なり合う、冬ならではの静かな眺めです。静かに、敬意をもってお参りください。続いては、歩いておよそ10分の草津熱帯圏へ向かいましょう。";

  const nishinokawaraMemo =
    "草津熱帯圏からは歩いておよそ19分です。西の河原公園は、草津温泉街の西端にあることからこの名がついたとされ、強い酸性の湯によって草木が育たない独特の景観から、かつては「賽の河原」とも呼ばれ、恐れられていたのだそうです。園内には男女合わせておよそ500平方メートルという、日本でも有数の広さを誇る露天風呂があり、雪の積もる冬は、真っ白な雪景色の中で湯に浸かる「雪見の露天風呂」が楽しめる特別な季節でもあります。周囲の温泉が川となって流れ、湯気の立ちのぼる幻想的な光景の中、この時期ならではの湯浴みをゆっくり楽しみましょう。今夜はこの近くの宿に泊まりましょう。";

  if (!already1) {
  await setDaySpotOrder(day1.id, [
    { id: netsunoyu.id, data: { memo: netsunoyuMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 9, 30)), stayDurationMin: 20, transitMode: null, transitDurationMin: null } },
    {
      create: {
        name: "御座之湯",
        address: "草津町草津",
        lat: 36.622339,
        lng: 138.5959788,
        visitTime: new Date(Date.UTC(1970, 0, 1, 9, 52)),
        stayDurationMin: 70,
        transitMode: "walk",
        transitDurationMin: 2,
        memo:
          "熱乃湯からは歩いておよそ2分です。御座之湯は、湯畑のすぐそばに、江戸・明治時代の共同湯を再現してつくられた日帰り温泉施設です。館内には「木之湯」と「石之湯」という趣の異なる2つの浴室があり、男女入れ替え制で、湯畑源泉と万代源泉という異なる源泉の湯を楽しむことができます。2階には、湯畑を見渡せるおよそ45畳の広間もあり、浴衣を借りて温泉街をそぞろ歩くこともできます。草津の歴史ある湯屋のたたずまいと、源泉の違いによる湯あたりの違いを、じっくり味わってみましょう。続いては、歩いておよそ2分の湯畑へ向かいましょう。",
      },
    },
    { id: yubatake.id, data: { memo: yubatakeMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 4)), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 2 } },
    { id: kousenji.id, data: { memo: kousenjiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 49)), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5 } },
    {
      create: {
        name: "草津熱帯圏",
        address: "草津町草津",
        lat: 36.6225511,
        lng: 138.604275,
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 19)),
        stayDurationMin: 110,
        transitMode: "walk",
        transitDurationMin: 10,
        memo:
          "光泉寺からは歩いておよそ10分です(湯畑からの所要時間を基にした目安です)。到着したら、まずこのあたりで昼食をとりましょう。草津熱帯圏は、高さ15mの大きなドームの中に、カピバラやワニ、ナマケモノ、エリマキキツネザルなど、およそ250種1,000頭もの熱帯の動物や植物を集めた施設です。爬虫類の飼育展示数は国内でも有数とされ、ワニやヘビの姿を間近に観察することができます。動物たちに餌をあげられるコーナーもあり、子どもから大人まで楽しめます。雪の降る屋外とは対照的な、常夏のジャングルのような雰囲気を味わってみましょう。続いては、歩いておよそ19分の西の河原公園・露天風呂へ向かいましょう。",
      },
    },
    { id: nishinokawara.id, data: { memo: nishinokawaraMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 28)), stayDurationMin: 125, transitMode: "walk", transitDurationMin: 19 } },
  ]);
  }

  // Day2
  if (!already2) {
  const otakinoyuMemo =
    "旅の2日目は、大滝乃湯から始めましょう。数ある草津の源泉の中でも、美肌の湯として知られる煮川源泉を使用するこの日帰り温泉施設では、草津に古くから伝わる入浴法「合わせ湯」が体験できます。温度の異なる浴槽がいくつも並び、水で薄めることなく自然に冷ましたぬるめの湯から少しずつ熱い湯へと、体を慣らしながら入っていく、この土地ならではの湯めぐりの作法です。何百年も昔から草津の人々に伝わるこの入浴法で、源泉の豊かな効能を、薄めることなくそのまま味わえるのが魅力です。じっくりと温まって、旅の疲れを癒やしましょう。湯めぐりのあとは、車でおよそ10分の道の駅 草津運動茶屋公園へ向かいましょう。";

  const skijoMemo =
    "道の駅からは車でおよそ10分です。到着したら、まずゲレンデのレストランで昼食をとりましょう。草津温泉スキー場は、標高1,600メートルの青葉山を最高地点に、標高差およそ350メートルのゲレンデが広がるスキー場です。大正3年(1914)に草津で初めてスキー場が開かれ、日本で最初にリフトを導入した地とされる、スキーの歴史あるゲレンデです。ゲレンデの奥にある天狗山からは、草津の山並みを見渡す爽快な景色が広がり、レストランで休憩しながら景色を楽しむこともできます。スキーやスノーボードはもちろん、そり遊びだけを楽しむのもおすすめです。雪山ならではのアクティビティで、冬の草津を満喫しましょう。続いては、車でおよそ10分の草津ガラス蔵へ向かいましょう。";

  await setDaySpotOrder(day2.id, [
    { id: otakinoyu.id, data: { memo: otakinoyuMemo } },
    {
      create: {
        name: "道の駅 草津運動茶屋公園",
        address: "草津町草津",
        lat: 36.6147932,
        lng: 138.5901789,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 10)),
        stayDurationMin: 65,
        transitMode: "car",
        transitDurationMin: 10,
        memo:
          "大滝乃湯からは車でおよそ10分です。道の駅 草津運動茶屋公園は、標高1,231mに位置し、全国の道の駅の中で2番目に高い場所にあるとされています。2階のベルツ記念館では、明治時代に来日し、草津温泉の効能を世界に紹介したドイツ人医師、エルヴィン・フォン・ベルツ博士の功績を紹介しています。国道を挟んで向かい側の施設とは、エレベーター付きの展望歩道橋で結ばれており、橋の上からは雪に覆われた草津の山々を見渡すことができます。草津温泉が世界に知られるきっかけをつくった医師の足跡と、雪景色のパノラマを楽しんでみましょう。続いては、車でおよそ10分の草津温泉スキー場へ向かいましょう。",
      },
    },
    { id: skijo.id, data: { memo: skijoMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 25)), stayDurationMin: 130, transitMode: "car", transitDurationMin: 10, transitLine: null } },
    {
      create: {
        name: "草津ガラス蔵",
        address: "草津町草津483-1",
        lat: 36.623199,
        lng: 138.593445,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 45)),
        stayDurationMin: 110,
        transitMode: "car",
        transitDurationMin: 10,
        memo:
          "草津温泉スキー場からは車でおよそ10分です。草津ガラス蔵は、草津温泉のシンボルである湯畑の、夜のライトアップにちなんだエメラルドグリーンの「草津温泉ガラス」をはじめ、さまざまなガラス作品を扱う工房です。2号館では、バーナーでガラス棒を溶かしてつくる「とんぼ玉」の創作体験ができます。制作そのものはおよそ15〜20分ですが、できあがった玉を冷ますのに1時間ほどかかるため、その間に1号館のガラス器や3号館のアクセサリーを見て回ったり、温泉たまごを味わったりしながら待つのがおすすめです。世界にひとつだけの、旅の思い出になるガラス玉をつくってみましょう。見学を終えたら、宿へ戻りましょう。",
      },
    },
  ]);
  }

  for (const [dayId, name, mode, min] of [
    [day1.id, "御座之湯", "walk", 2],
    [day1.id, "湯畑", "walk", 2],
    [day1.id, "光泉寺", "walk", 5],
    [day1.id, "草津熱帯圏", "walk", 10],
    [day1.id, "西の河原公園・露天風呂", "walk", 19],
    [day2.id, "道の駅 草津運動茶屋公園", "car", 10],
    [day2.id, "草津温泉スキー場", "car", 10],
    [day2.id, "草津ガラス蔵", "car", 10],
  ] as [string, string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
    });
  }
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: netsunoyu.id } });

  const newDescription =
    "もうもうと湯けむりが上がる湯畑と、湯もみショー、江戸・明治の共同湯を再現した御座之湯、熱帯の動植物園、雪見の露天風呂を楽しむ1泊2日プラン。冬は湯畑の湯けむりがいっそう濃く見え、雪見の露天風呂も楽しめます。2日目は合わせ湯で温まったあと、標高1,231mの道の駅でベルツ博士の足跡をたどり、スキーやそり遊び、とんぼ玉づくりも楽しめます。";
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDescription } });

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
