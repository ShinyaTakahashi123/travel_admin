/**
 * #326の続き。企画運営2026-10-01 02:11の5点 + 法務2026-10-01 02:11の4点。
 *
 * 企画運営:
 * 1) 草津ガラス蔵はガラスを売る店のため、スポットから外した。
 * 2) 水増し(決まりA): 草津熱帯圏110分→75分(昼食込み)、草津温泉スキー場
 *    130分→40分に短縮(この旅はスキーをする前提ではないため、ゲレンデ・
 *    天狗山の眺めのみに)。浮いた時間は実在の行き先で埋めた: 白旗源泉
 *    (湯畑のすぐそば、源頼朝発見の伝説が残る古い源泉)・温泉図書館
 *    (バスターミナル3階、平成27年開設)・道の駅の滞在を延長・西の河原
 *    通り(食べ歩きの通り、店名は出さない)。
 * 3) 2日目の移動をcarから、歩き・バスに戻した。大滝乃湯→スキー場は、
 *    もとのデータにあった実在の路線名「路線バス（天狗山方面）」を復元。
 *    車を借りる場面は書いていない(そもそも車は使わない)。
 * 4) 入浴の一文: 御座之湯・大滝乃湯にあるか確認し、無かったため追加。
 *    大滝乃湯の「美肌の湯として知られる」は外した。
 * 5) 1日目の最後(西の河原公園)に宿の一言は既にあり。2日目の最後
 *    (西の河原通り)に、草津温泉バスターミナルから長野原草津口駅へ
 *    戻る一言を追加した(実在の路線バスの行き先、3・4番のりば)。
 *
 * 法務:
 * - 効能の言い方を削除: 熱乃湯「水で薄めると温泉の効能が薄れるとされる
 *   ことから」、大滝乃湯「美肌の湯として知られる」「源泉の豊かな効能を、
 *   薄めることなくそのまま味わえるのが魅力です」
 * - 入浴する3か所(御座之湯・西の河原露天風呂・大滝乃湯)に「浴場では
 *   ほかの入浴客を撮らず、施設の決まりに従いましょう。草津の湯は熱めな
 *   ので、長湯を避けて、こまめに水分をとりましょう。」を追加
 * - 草津熱帯圏の餌やりに「餌は決められた場所で、決められたものだけを
 *   あげましょう。」を追加
 * - 草津ガラス蔵は店のため、企画運営の指摘どおりスポットから外した
 *
 * 座標の出典(いずれもNominatim名称一致):
 * - 白旗の湯: 36.6225925,138.5962772(way 954786834)
 * - 温泉図書館(草津温泉バスターミナル): 36.6205241,138.5963667(way
 *   604747035)
 * - 西の河原通り: 36.6235141,138.5937706(way 303901745)
 *
 * 事実確認(いずれも直接開いて確認):
 * - 白旗の湯は源頼朝発見の伝説が残る草津でも古い源泉の一つ(複数の
 *   観光サイトで確認)
 * - 温泉図書館は平成27年(2015)開設、バスターミナル3階、草津温泉の
 *   歴史資料を収蔵(bushikaku.net)
 * - 草津温泉バスターミナル3・4番のりばは長野原草津口駅行きの路線バス
 *   (各駅停車・急行)
 *
 * 自己チェック: 実行後の再確認で、光泉寺と草津温泉スキー場のvisitTimeを
 * 更新し忘れ、時刻の計算が合わなくなっていたのを発見。このファイルには
 * 修正を反映済みだが、白旗の湯が既に存在するためday1側はもう実行されず
 * (already1ガード)、当てた臨時パッチがスコープなし検索で誤って別の
 * しおり(#384)の同名スポットを書き換える事故につながった。最終的な
 * 光泉寺の直しはfix-326c-89522173.ts(itineraryIdで絞った形)で適用、
 * #384側の復旧はfix-384c-e4b7d41b.tsで対応した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326b-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";
const BATH_NOTE =
  "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。草津の湯は熱めなので、長湯を避けて、こまめに水分をとりましょう。";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already1 = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "白旗の湯" } });
  const already2 = await prisma.spot.findFirst({ where: { dayId: day2.id, name: "温泉図書館" } });

  const netsunoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "熱乃湯（湯もみショー）" } });
  const gozanoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "御座之湯" } });
  const yubatake = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "湯畑" } });
  const kousenji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "光泉寺" } });
  const nettaiken = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "草津熱帯圏" } });
  const nishinokawara = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "西の河原公園・露天風呂" } });

  const otakinoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "大滝乃湯" } });
  const skijo = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "草津温泉スキー場" } });
  const michinoeki = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "道の駅 草津運動茶屋公園" } });
  const garasugura = await prisma.spot.findFirst({ where: { dayId: day2.id, name: "草津ガラス蔵" } });

  if (!already1) {
    const netsunoyuMemo =
      "草津温泉のシンボル・湯畑のほど近くに立つ熱乃湯では、草津温泉名物「湯もみと踊りショー」が1日に何度か上演されています。草津の源泉は50度近い高温のため、江戸時代、長さおよそ180センチの板で湯をかき混ぜて冷ます「湯もみ」の技法が生み出されました。「チョイナ、チョイナ」のかけ声で知られる草津節などの湯もみ唄にあわせて実演されるこのショーは、昭和35年(1960)に始まって以来、草津温泉を代表する名物として親しまれています。建物は平成27年(2015)、大正ロマンを思わせる姿へと生まれ変わりました。息の合ったかけ声とともに湯気を巻き上げる湯もみの迫力を、間近で眺めてみましょう。続いては、歩いておよそ2分の御座之湯へ向かいましょう。";

    const gozanoyuMemo =
      "熱乃湯からは歩いておよそ2分です。御座之湯は、湯畑のすぐそばに、江戸・明治時代の共同湯を再現してつくられた日帰り温泉施設です。館内には「木之湯」と「石之湯」という趣の異なる2つの浴室があり、男女入れ替え制で、湯畑源泉と万代源泉という異なる源泉の湯を楽しむことができます。2階には、湯畑を見渡せるおよそ45畳の広間もあり、浴衣を借りて温泉街をそぞろ歩くこともできます。" +
      BATH_NOTE +
      "草津の歴史ある湯屋のたたずまいを、じっくり味わってみましょう。続いては、歩いておよそ2分の湯畑へ向かいましょう。";

    const kousenjiMemo =
      "白旗源泉からは歩いておよそ3分です。光泉寺は、湯畑を見下ろす高台に立つ寺です。養老5年(721)、高僧・行基が温泉で人々の病を癒やそうと薬師堂を建てたのが始まりと伝えられ、正治2年(1200)には、この地を治めていた湯本氏によって、温泉の守り神・白根明神の別当寺として再建されました。雪に包まれた境内から見下ろす湯畑は、湯けむりの白さと雪の白さが重なり合う、冬ならではの静かな眺めです。静かに、敬意をもってお参りください。続いては、歩いておよそ10分の草津熱帯圏へ向かいましょう。";

    const nettaikenMemo =
      "光泉寺からは歩いておよそ10分です(湯畑からの所要時間を基にした目安です)。到着したら、まずこのあたりで昼食をとりましょう。草津熱帯圏は、高さ15mの大きなドームの中に、カピバラやワニ、ナマケモノ、エリマキキツネザルなど、およそ250種1,000頭もの熱帯の動物や植物を集めた施設です。爬虫類の飼育展示数は国内でも有数とされ、ワニやヘビの姿を間近に観察することができます。動物たちに餌をあげられるコーナーもあり、子どもから大人まで楽しめます。餌は決められた場所で、決められたものだけをあげましょう。雪の降る屋外とは対照的な、常夏のジャングルのような雰囲気を味わってみましょう。続いては、歩いておよそ19分の西の河原公園・露天風呂へ向かいましょう。";

    const nishinokawaraMemo =
      "草津熱帯圏からは歩いておよそ19分です。西の河原公園は、草津温泉街の西端にあることからこの名がついたとされ、強い酸性の湯によって草木が育たない独特の景観から、かつては「賽の河原」とも呼ばれ、恐れられていたのだそうです。園内には男女合わせておよそ500平方メートルという、日本でも有数の広さを誇る露天風呂があり、雪の積もる冬は、真っ白な雪景色の中で湯に浸かる「雪見の露天風呂」が楽しめる特別な季節でもあります。" +
      BATH_NOTE +
      "周囲の温泉が川となって流れ、湯気の立ちのぼる幻想的な光景の中、この時期ならではの湯浴みをゆっくり楽しみましょう。今夜はこの近くの宿に泊まりましょう。";

    await setDaySpotOrder(day1.id, [
      { id: netsunoyu.id, data: { memo: netsunoyuMemo } },
      { id: gozanoyu.id, data: { memo: gozanoyuMemo } },
      { id: yubatake.id, data: {} },
      {
        create: {
          name: "白旗の湯",
          address: "草津町草津",
          lat: 36.6225925,
          lng: 138.5962772,
          visitTime: new Date(Date.UTC(1970, 0, 1, 11, 45)),
          stayDurationMin: 20,
          transitMode: "walk",
          transitDurationMin: 1,
          memo:
            "湯畑からは歩いてすぐです。白旗の湯は、湯畑のすぐそばに湧く、草津でも指折りの古い源泉の一つです。鎌倉幕府を開いた源頼朝がこの地を訪れた際に見つけたという言い伝えがあり、源氏の旗にちなんで名づけられたとされています。今も白く濁った湯が湧き出す様子を間近に眺めることができ、地元の人々にも長く親しまれてきた共同浴場です。草津の温泉文化を支えてきた、昔ながらの源泉の風景を眺めてみましょう。続いては、歩いておよそ3分の光泉寺へ向かいましょう。",
        },
      },
      { id: kousenji.id, data: { memo: kousenjiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 8)), transitDurationMin: 3 } },
      { id: nettaiken.id, data: { memo: nettaikenMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 38)), stayDurationMin: 75 } },
      { id: nishinokawara.id, data: { memo: nishinokawaraMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 12)), stayDurationMin: 140 } },
    ]);
  }

  if (!already2) {
    const otakinoyuMemo =
      "旅の2日目は、大滝乃湯から始めましょう。数ある草津の源泉の中でも、煮川源泉を使用するこの日帰り温泉施設では、草津に古くから伝わる入浴法「合わせ湯」が体験できます。温度の異なる浴槽がいくつも並び、水で薄めることなく自然に冷ましたぬるめの湯から少しずつ熱い湯へと、体を慣らしながら入っていく、この土地ならではの湯めぐりの作法です。何百年も昔から草津の人々に伝わるこの入浴法で、源泉の湯にじっくりと浸かることができます。" +
      BATH_NOTE +
      "じっくりと温まって、旅の疲れを癒やしましょう。湯めぐりのあとは、路線バス(天狗山方面)でおよそ15分の草津温泉スキー場へ向かいましょう。";

    const skijoMemo =
      "大滝乃湯からは、路線バス(天狗山方面)でおよそ15分です。草津温泉スキー場は、標高1,600メートルの青葉山を最高地点に、標高差およそ350メートルのゲレンデが広がるスキー場です。大正3年(1914)に草津で初めてスキー場が開かれ、日本で最初にリフトを導入した地とされる、スキーの歴史あるゲレンデです。ゲレンデの奥にある天狗山からは、草津の山並みを見渡す爽快な景色が広がります。雪をまとったゲレンデと、その向こうに連なる山々の眺めを、しばらく楽しんでみましょう。続いては、同じ路線バスで草津温泉バスターミナルへ戻り、歩いてすぐの温泉図書館へ向かいましょう。";

    await setDaySpotOrder(day2.id, [
      { id: otakinoyu.id, data: { memo: otakinoyuMemo } },
      { id: skijo.id, data: { memo: skijoMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 15)), stayDurationMin: 40, transitMode: "bus", transitDurationMin: 15, transitLine: "路線バス（天狗山方面）" } },
      {
        create: {
          name: "温泉図書館",
          address: "草津町草津",
          lat: 36.6205241,
          lng: 138.5963667,
          visitTime: new Date(Date.UTC(1970, 0, 1, 12, 10)),
          stayDurationMin: 35,
          transitMode: "bus",
          transitDurationMin: 15,
          transitLine: "路線バス（天狗山方面）",
          memo:
            "スキー場からは、同じ路線バスで草津温泉バスターミナルまで戻ります(およそ15分)。温泉図書館は、バスターミナルの3階にある小さな図書館です。平成27年(2015)に開設され、草津温泉の歴史にまつわる本や資料を集めています。バスの待ち時間を使って、腰を落ち着けて本を読むこともできます。窓の外に目をやれば、行き交うバスの様子も眺められます。温泉の歴史に思いを巡らせながら、ひと休みしてみましょう。続いては、歩いておよそ15分の道の駅 草津運動茶屋公園へ向かいましょう。",
        },
      },
      {
        id: michinoeki.id,
        data: {
          memo:
            "温泉図書館からは歩いておよそ15分です。到着したら、まずこのあたりで昼食をとりましょう。道の駅 草津運動茶屋公園は、標高1,231mに位置し、全国の道の駅の中で2番目に高い場所にあるとされています。2階のベルツ記念館では、明治時代に来日し、日本各地の温泉を研究したドイツ人医師、エルヴィン・フォン・ベルツ博士の足跡を紹介しています。国道を挟んで向かい側の施設とは、エレベーター付きの展望歩道橋で結ばれており、橋の上からは雪に覆われた草津の山々を見渡すことができます。日本の温泉研究にゆかりの深い医師の足跡と、雪景色のパノラマを楽しんでみましょう。続いては、歩いておよそ15分の西の河原通りへ向かいましょう。",
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 0)),
          stayDurationMin: 90,
          transitMode: "walk",
          transitDurationMin: 15,
          transitLine: null,
        },
      },
      {
        create: {
          name: "西の河原通り",
          address: "草津町草津",
          lat: 36.6235141,
          lng: 138.5937706,
          visitTime: new Date(Date.UTC(1970, 0, 1, 14, 45)),
          stayDurationMin: 108,
          transitMode: "walk",
          transitDurationMin: 15,
          memo:
            "道の駅からは歩いておよそ15分です。西の河原通りは、湯畑から西の河原公園へと続く、草津温泉街のメインストリートです。通り沿いには、温泉まんじゅうや温泉たまご、ご当地ソフトクリームなどを売る店が軒を連ねており、食べ歩きをしながらそぞろ歩くのにぴったりの通りです。旅の最後に、雪の残る温泉街の風情を眺めながら、ゆっくりと歩いてみましょう。見学を終えたら、草津温泉バスターミナルまで歩いて戻り、路線バスで長野原草津口駅へ向かいましょう。",
        },
      },
    ], garasugura ? { remove: [garasugura.id] } : undefined);
  }

  for (const [dayId, name, mode, min, line] of [
    [day1.id, "御座之湯", "walk", 2, null],
    [day1.id, "湯畑", "walk", 2, null],
    [day1.id, "白旗の湯", "walk", 1, null],
    [day1.id, "光泉寺", "walk", 3, null],
    [day1.id, "草津熱帯圏", "walk", 10, null],
    [day1.id, "西の河原公園・露天風呂", "walk", 19, null],
    [day2.id, "草津温泉スキー場", "bus", 15, "路線バス（天狗山方面）"],
    [day2.id, "温泉図書館", "bus", 15, "路線バス（天狗山方面）"],
    [day2.id, "道の駅 草津運動茶屋公園", "walk", 15, null],
    [day2.id, "西の河原通り", "walk", 15, null],
  ] as [string, string, string, number, string | null][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min, transitLine: line ?? undefined },
    });
  }

  const newDescription =
    "もうもうと湯けむりが上がる湯畑と、湯もみショー、江戸・明治の共同湯を再現した御座之湯、熱帯の動植物園、雪見の露天風呂を楽しむ1泊2日プランです。冬は湯畑の湯けむりがいっそう濃く見え、雪見の露天風呂も楽しめます。2日目は合わせ湯で温まったあと、ゲレンデや天狗山の雪景色を眺め、標高1,231mの道の駅でベルツ博士の足跡をたどりながら、のんびり過ごします。";
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDescription } });

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
