/**
 * #73(満願寺と満願寺温泉、南小国の古刹と川沿いの湯を訪ねる1泊2日、
 * 357983ef)の初日を、docs/content/itinerary-rules.md(10/29仕様)と、
 * 企画運営の「遠い場所の初日」の方針に合わせて組み直す。最終日(Day2)は
 * 09:00開始・7か所・16:32終了で、1泊2日の決まり(16:30-17:00・4か所以上)
 * にすでに合うため時刻は変更しない(言葉づかい・座標・書き出しの直しのみ)。
 *
 * 【重要: 満願寺の座標が大きく間違っていた(法務の指摘で発覚)】もとの座標
 * 33.1372/131.1719は、実際の満願寺(黒川温泉のすぐ近く)から10km近く
 * 離れた場所だった。OSM生データで、住所つきの正しい点「立護山満願寺」
 * (node9061328648、amenity=place_of_worship、addr:quarter=満願寺)
 * 33.0760670/131.0960210を見つけ、これに直した。この点は「金比羅杉」
 * (node9061328649、本文にある巨杉)からも約400mで、本文の「志津川」も
 * 近くの川の名前(満願寺川(志津川))と一致した。座標を直した結果、周辺の
 * 移動時間もすべて測り直しが必要になった(もとの座標は奇妙な林道を通る
 * 不自然なルートしか無く、実際の町なかの道と大きくずれていた)。
 *
 * 【入口(遠い場所の初日)】説明文に駅名がなく、南小国町の完全な車めぐり。
 * いちばん近い大きな駅を調べたところ、由布院駅(大分県)が最も近く、
 * 正しい満願寺の座標でOSRM実測すると車およそ52分(国道210号・387号・
 * 442号などの主要道のみ、林道なし)。由布院駅10:30ごろ着+レンタカー
 * 手続き15分+車52分=11:37で、1か所目の時刻は10:45〜11:45の範囲に収まる
 * ため、「遠い場所の例外」は使わない。
 *
 * 【Day1の組み直し(企画運営の指示)】もとの1日目(満願寺→瀬の本高原→
 * 押戸石の丘→阿蘇神社→門前町商店街→大観峰→黒川温泉)は、満願寺(南小国)
 * から阿蘇神社(阿蘇市)まで車で約74分かかるほど大きく広がっており、
 * 11:37開始・16:30-17:00終了に到底収まらなかった。説明文にある見どころは
 * 満願寺だけなので、阿蘇神社・門前町商店街・大観峰は外し、1日目は
 * 南小国・黒川温泉のまわり(満願寺・瀬の本高原・押戸石の丘・黒川温泉)に
 * まとめた。外した3か所に写真・表紙の指定はなく、説明文にも登場しない
 * ことを確認済み。満願寺→瀬の本高原の移動(正しい座標でOSRM実測約15分)は、
 * もとの値(15分)とほぼ同じだったため変更なし。
 *
 * 押戸石の丘から黒川温泉までの区間(直接ではOSRM実測27分)に、公式の
 * 出所(熊本県「平成の名水百選」のPDF、南小国町公式サイト
 * town.minamioguni.lg.jp/kankou/tanoharu/meoto-daki.html)で確かめられる
 * 実在の見どころ「夫婦滝」(田の原川と小田川の合流点、男滝・女滝の2つの
 * 滝)を新たに1か所足した(押戸石の丘から21分、そこから黒川温泉まで7分で、
 * 直接の27分とほぼ変わらない寄り道)。これにより終了時刻を16:30-17:00に
 * 収めた(昼食は瀬の本高原12:37着で11:30〜13:30の範囲内)。
 *
 * 新しい時刻(Day1、11:37〜16:40、5か所): 満願寺11:37(45)→
 * 瀬の本高原12:37(30、昼食)→押戸石の丘13:27(45)→夫婦滝14:33(30、新規)→
 * 黒川温泉15:10(90)
 *
 * 【言葉づかい(しおり全体を確認)】「〜てみてください」がDay1に2か所・
 * Day2に5か所、ガイド口調の「ください」(祈りの一文以外)が押戸石の丘・
 * 満願寺温泉館・鍋ヶ滝・杖立温泉にあったため、すべて「〜しましょう」
 * などの決まりの言い方に直した。満願寺温泉館では、効き目をうたう言い方
 * (「旅の疲れをやさしくほぐしてくれます」)を削除し、営業時間を書かない
 * 休館日の一文に直した。黒川温泉の宿の一文も決まりの形に直した。杖立温泉
 * (旅の最後)の結びも、由布院駅へ戻りレンタカーを返す一文に直した
 * (OSRM実測、杖立温泉から由布院駅まで約46分)。
 *
 * 【Day2 1か所目の書き出し・満願寺温泉館の座標】満願寺温泉館の座標
 * (33.1355/131.1698)も、満願寺と同じく大きくずれていた。OSM生データの
 * 「Manganji Onsen」(node6947587095)33.0755359/131.0957715(満願寺の
 * 境内からすぐ近く)に直した。あわせて、前の晩の宿(黒川温泉)からの
 * 行き方(正しい座標でOSRM実測約10分。ウェブの紹介記事にある「黒川温泉
 * から車で10分ほど」とも一致)を書き出しに追加した。
 *
 * 【Day2 そのほかの座標】
 * - 道の駅小国ゆうステーション: Nominatim way1124059100の値
 *   33.1231535/131.0647738に直す(約8mの差)
 * - 下城の大イチョウ: 法務の指摘どおり、地理院の「大字下城」の中心点
 *   (33.167187/131.026199)になっていたため、OSMの木そのものの点
 *   node8707988717「下城大イチョウ」(natural=tree)33.1502718/
 *   131.0550277に直す(約3kmの差)。これにより、鍋ヶ滝→大イチョウ
 *   (8分→13分)・大イチョウ→杖立温泉(5分→7分)の移動時間も測り直し、
 *   下城の大イチョウ・杖立温泉の時刻を7分ずつ後ろにずらした(滞在は
 *   延ばさず、どちらも決まりの16:30-17:00の範囲内)。
 * - 北里柴三郎記念館: OSM・地理院のどちらにも番地までの点が見つからず、
 *   地理院の「大字北里」の中心(今の座標)は約2km離れた別の場所を指して
 *   いた。7章の最後の例外(企画運営が1件ずつ決める)により、記念館と
 *   「木魂館キャンプ場」(node14287593198)が同じ施設群「学びやの里」に
 *   あること(出典: 熊本日日新聞の記事)を根拠に、33.1409315/131.0910328
 *   に直す。
 *
 * 【夫婦滝の文、出典(法務の指摘に回答)】
 * - 「熊本県の『平成の名水百選』にも選ばれた」「侍と村娘にまつわる
 *   言い伝え」の両方とも、南小国町公式サイト(town.minamioguni.lg.jp/
 *   kankou/tanoharu/meoto-daki.html、夫婦滝の紹介ページ)に原文のまま
 *   ある(「田の原川と小田川が合流する地点でであり、侍と村娘にまつわる
 *   伝説が残されています。」「熊本県平成の名水百選にも認定されています。」)。
 *   環境省の「名水百選」とは別の、熊本県独自の「熊本県平成の名水百選」
 *   の呼び名もこのページの原文どおり。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-73-357983ef.ts
 *   反映: npm run prod -- npx tsx prisma/fix-73-357983ef.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "533914b0-13e4-4c74-b32b-8fd3a97a5ed9";

const MANGANJI_ID = "49f1923d-bca5-412b-9741-04da635b33b5"; // 満願寺
const SENOMOTO_ID = "7d5ad213-414f-413d-a5b8-022f111a81dc"; // 瀬の本高原
const OSHIDOISHI_ID = "f2fd7d3b-4063-43cb-90d7-8a4f70d263fd"; // 押戸石の丘
const ASOJINJA_ID = "3587435c-17c3-46c2-9bc5-e25baf68b1bc"; // 阿蘇神社(削除)
const MONZENCHO_ID = "15d842fd-97b8-48e1-87e9-e6926f4e6225"; // 門前町商店街(削除)
const DAIKANBO_ID = "a854e6d8-1a98-43f6-b431-795dc6451628"; // 大観峰(削除)
const KUROKAWA_ID = "2c1f6f97-a446-4825-a280-78cdac404a3d"; // 黒川温泉

const MANGANJI_ONSEN_ID = "dfc5bc54-680a-43af-b9fc-26bef21a68b0"; // 満願寺温泉館(Day2)
const KITASATO_ID = "7a5656e6-0d3b-4c81-a905-23a3288b4216"; // 北里柴三郎記念館(Day2)
const MICHINOEKI_ID = "14c3a825-2e00-4c25-b0f0-0d7384a5ee21"; // 道の駅小国ゆうステーション(Day2)
const SAKAMOTO_ID = "bf408f34-49ff-46bf-9e60-781b4b9ca576"; // 坂本善三美術館(Day2)
const NABEGATAKI_ID = "c0ecb5a4-f142-4ada-b02b-24fcc8b3ab9d"; // 鍋ヶ滝(Day2)
const ICHO_ID = "29d9b906-4b57-439b-8e8b-029a68bbe07b"; // 下城の大イチョウ(Day2)
const TSUETATE_ID = "89bb6701-2529-4312-8efc-807b1c876927"; // 杖立温泉(Day2)

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MANGANJI_FIND = "南小国町のシンボルともいえる古刹、満願寺からスタートです。";
const MANGANJI_REPLACE =
  "この旅は車でめぐります。由布院駅に10時30分ごろ着いたら、駅の近くでレンタカーを借りて(手続きに15分ほど)、車で約52分の満願寺へ。南小国町のシンボルともいえる古刹です。";

const SENOMOTO_FIND =
  "牧草地に放牧された牛の姿も、この高原ならではの風景です。爽やかな風を感じながら、大パノラマをゆっくりと眺めてみてください。この後は、車でおよそ20分、押戸石の丘へ向かいましょう。";
const SENOMOTO_REPLACE =
  "牧草地に放牧された牛の姿も、この高原ならではの風景です。高原には食事ができる場所もあるので、ここで昼食にしましょう。爽やかな風を感じながら、大パノラマをゆっくりと眺めましょう。この後は、車でおよそ20分、押戸石の丘へ向かいましょう。";

const OSHIDOISHI_FIND = "石を傷つけたり登ったりしないよう、大切に見学してください。この後は、車でおよそ30分、阿蘇神社へ向かいましょう。";
const OSHIDOISHI_REPLACE = "石を傷つけたり登ったりしないよう、大切に見学しましょう。この後は、車でおよそ21分、夫婦滝へ向かいましょう。";

const MEOTODAKI_MEMO =
  "押戸石の丘から車でおよそ21分、田の原川と小田川が合流する夫婦滝に着きます。向かって左側の滝が「男滝」、右側が「女滝」で、寄り添うように流れ落ちる2つの滝の姿が、夫婦滝という名前の由来になったと伝えられています。縁結びの滝として親しまれ、侍と村娘にまつわる言い伝えも残っています。熊本県の「平成の名水百選」にも選ばれた、清らかな水の流れです。足元に気をつけながら、滝の流れを眺めましょう。この後は、車でおよそ7分、黒川温泉へ向かいましょう。";

const KUROKAWA_FIND0 = "大観峰から車でおよそ33分、旅館が軒を連ねる黒川温泉に着きます。";
const KUROKAWA_REPLACE0 = "夫婦滝から車でおよそ7分、旅館が軒を連ねる黒川温泉に着きます。";
const KUROKAWA_FIND1 = "下駄の音が響く温泉街の情緒を楽しんでみてください。";
const KUROKAWA_REPLACE1 = "下駄の音が響く温泉街の情緒を楽しみましょう。";
const KUROKAWA_FIND2 = "今夜はこの近くの宿にご宿泊いただきます。";
const KUROKAWA_REPLACE2 = "この夜は、黒川温泉の宿に泊まりましょう。";

const MANGANJI_ONSEN_FIND0 = "満願寺温泉館から2日目がスタートします。志津川のほとりに湧く";
const MANGANJI_ONSEN_REPLACE0 = "黒川温泉の宿から車でおよそ10分、満願寺温泉館から2日目がスタートします。志津川のほとりに湧く";
const MANGANJI_ONSEN_FIND1 = "無色透明でクセのない湯は、旅の疲れをやさしくほぐしてくれます。";
const MANGANJI_ONSEN_REPLACE1 = "無色透明でクセのない湯です。";
const MANGANJI_ONSEN_FIND2 = "営業時間などは、事前に公式サイトでご確認ください。この後は、車でおよそ12分、北里柴三郎記念館へ向かいましょう。";
const MANGANJI_ONSEN_REPLACE2 = "休みの日は公式の案内で確かめましょう。この後は、車でおよそ18分、北里柴三郎記念館へ向かいましょう。";

const KITASATO_FIND0 = "満願寺温泉館から車でおよそ12分、";
const KITASATO_REPLACE0 = "満願寺温泉館から車でおよそ18分、";
const KITASATO_FIND1 = "じっくりと見学してみてください。この後は、車でおよそ10分、道の駅小国ゆうステーションへ向かいましょう。";
const KITASATO_REPLACE1 = "じっくりと見学しましょう。この後は、車でおよそ7分、道の駅小国ゆうステーションへ向かいましょう。";

const MICHINOEKI_FIND0 = "北里柴三郎記念館から車でおよそ10分、";
const MICHINOEKI_REPLACE0 = "北里柴三郎記念館から車でおよそ7分、";
const MICHINOEKI_FIND1 = "旅の中休みに、ゆっくりと立ち寄ってみてください。";
const MICHINOEKI_REPLACE1 = "旅の中休みに、ゆっくりと立ち寄りましょう。";

const SAKAMOTO_FIND = "静かな畳の展示室で、坂本善三の世界をゆっくりと味わってみてください。";
const SAKAMOTO_REPLACE = "静かな畳の展示室で、坂本善三の世界をゆっくりと味わいましょう。";

const NABEGATAKI_FIND = "シーズン中は混雑するため、事前予約が必要な場合があるので、訪れる前に公式サイトで予約してください。";
const NABEGATAKI_REPLACE = "シーズン中は混雑するため、事前予約が必要な場合があるので、訪れる前に公式サイトで確かめましょう。";

const ICHO_FIND0 = "鍋ヶ滝から車でおよそ8分、下城の大イチョウに着きます。";
const ICHO_REPLACE0 = "鍋ヶ滝から車でおよそ13分、下城の大イチョウに着きます。";
const ICHO_FIND1 = "悠久の時を重ねてきた巨木を、見上げてみてください。この後は、車でおよそ5分、杖立温泉へ向かいましょう。";
const ICHO_REPLACE1 = "悠久の時を重ねてきた巨木を、見上げましょう。この後は、車でおよそ7分、杖立温泉へ向かいましょう。";

const TSUETATE_FIND0 = "下城の大イチョウから車でおよそ5分、およそ1800年の歴史があると伝わる杖立温泉に着きます。";
const TSUETATE_REPLACE0 = "下城の大イチョウから車でおよそ7分、およそ1800年の歴史があると伝わる杖立温泉に着きます。";
const TSUETATE_FIND1 = "橋の上から山あいの温泉街を眺めながら、旅の締めくくりのひとときを過ごしてください。";
const TSUETATE_REPLACE1 = "橋の上から山あいの温泉街を眺めながら、旅の締めくくりのひとときを過ごしましょう。";
const TSUETATE_FIND2 = "お帰りは、駐車場に置いた車でご利用ください。";
const TSUETATE_REPLACE2 = "帰りは、車で約46分の由布院駅へ戻り、レンタカーを返しましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [manganji, senomoto, oshidoishi, kurokawa, manganjiOnsen, kitasato, michinoeki, sakamoto, nabegataki, icho, tsuetate] =
    await Promise.all([
      prisma.spot.findFirstOrThrow({ where: { id: MANGANJI_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: SENOMOTO_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: OSHIDOISHI_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: KUROKAWA_ID, dayId: DAY1_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: MANGANJI_ONSEN_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: KITASATO_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: MICHINOEKI_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: SAKAMOTO_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: NABEGATAKI_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: ICHO_ID } }),
      prisma.spot.findFirstOrThrow({ where: { id: TSUETATE_ID } }),
    ]);

  for (const [label, spot, find] of [
    ["満願寺", manganji, MANGANJI_FIND],
    ["瀬の本高原", senomoto, SENOMOTO_FIND],
    ["押戸石の丘", oshidoishi, OSHIDOISHI_FIND],
    ["黒川温泉(0)", kurokawa, KUROKAWA_FIND0],
    ["黒川温泉(1)", kurokawa, KUROKAWA_FIND1],
    ["黒川温泉(2)", kurokawa, KUROKAWA_FIND2],
    ["満願寺温泉館(0)", manganjiOnsen, MANGANJI_ONSEN_FIND0],
    ["満願寺温泉館(1)", manganjiOnsen, MANGANJI_ONSEN_FIND1],
    ["満願寺温泉館(2)", manganjiOnsen, MANGANJI_ONSEN_FIND2],
    ["北里柴三郎記念館(0)", kitasato, KITASATO_FIND0],
    ["北里柴三郎記念館(1)", kitasato, KITASATO_FIND1],
    ["道の駅小国ゆうステーション(0)", michinoeki, MICHINOEKI_FIND0],
    ["道の駅小国ゆうステーション(1)", michinoeki, MICHINOEKI_FIND1],
    ["坂本善三美術館", sakamoto, SAKAMOTO_FIND],
    ["鍋ヶ滝", nabegataki, NABEGATAKI_FIND],
    ["下城の大イチョウ(0)", icho, ICHO_FIND0],
    ["下城の大イチョウ(1)", icho, ICHO_FIND1],
    ["杖立温泉(0)", tsuetate, TSUETATE_FIND0],
    ["杖立温泉(1)", tsuetate, TSUETATE_FIND1],
    ["杖立温泉(2)", tsuetate, TSUETATE_FIND2],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newManganjiMemo = manganji.memo!.replace(MANGANJI_FIND, MANGANJI_REPLACE);
  const newSenomotoMemo = senomoto.memo!.replace(SENOMOTO_FIND, SENOMOTO_REPLACE);
  const newOshidoishiMemo = oshidoishi.memo!.replace(OSHIDOISHI_FIND, OSHIDOISHI_REPLACE);
  const newKurokawaMemo = kurokawa
    .memo!.replace(KUROKAWA_FIND0, KUROKAWA_REPLACE0)
    .replace(KUROKAWA_FIND1, KUROKAWA_REPLACE1)
    .replace(KUROKAWA_FIND2, KUROKAWA_REPLACE2);

  const newManganjiOnsenMemo = manganjiOnsen
    .memo!.replace(MANGANJI_ONSEN_FIND0, MANGANJI_ONSEN_REPLACE0)
    .replace(MANGANJI_ONSEN_FIND1, MANGANJI_ONSEN_REPLACE1)
    .replace(MANGANJI_ONSEN_FIND2, MANGANJI_ONSEN_REPLACE2);
  const newKitasatoMemo = kitasato.memo!.replace(KITASATO_FIND0, KITASATO_REPLACE0).replace(KITASATO_FIND1, KITASATO_REPLACE1);
  const newMichinoekiMemo = michinoeki.memo!.replace(MICHINOEKI_FIND0, MICHINOEKI_REPLACE0).replace(MICHINOEKI_FIND1, MICHINOEKI_REPLACE1);
  const newSakamotoMemo = sakamoto.memo!.replace(SAKAMOTO_FIND, SAKAMOTO_REPLACE);
  const newNabegatakiMemo = nabegataki.memo!.replace(NABEGATAKI_FIND, NABEGATAKI_REPLACE);
  const newIchoMemo = icho.memo!.replace(ICHO_FIND0, ICHO_REPLACE0).replace(ICHO_FIND1, ICHO_REPLACE1);
  const newTsuetateMemo = tsuetate
    .memo!.replace(TSUETATE_FIND0, TSUETATE_REPLACE0)
    .replace(TSUETATE_FIND1, TSUETATE_REPLACE1)
    .replace(TSUETATE_FIND2, TSUETATE_REPLACE2);

  console.log("=== #73 Day1(初日)直す前→直した後 ===\n");
  console.log(`[1] 満願寺 (id=${manganji.id})  新visitTime: 11:37  新stay: 45  新座標: 33.0760670/131.0960210(OSM node「立護山満願寺」)`);
  console.log("  旧lat/lng:", manganji.lat, manganji.lng);
  console.log("  新memo:", newManganjiMemo);
  console.log(`[2] 瀬の本高原 (id=${senomoto.id})  新visitTime: 12:37  新stay: 30(昼食)`);
  console.log("  新memo:", newSenomotoMemo);
  console.log(`[3] 押戸石の丘 (id=${oshidoishi.id})  新visitTime: 13:27  新stay: 45`);
  console.log("  新memo:", newOshidoishiMemo);
  console.log(`[削除] 阿蘇神社・門前町商店街・大観峰 — 説明文に見どころが無く、時間に収まらないため外す`);
  console.log(`[4] 夫婦滝 (id=新規)  新visitTime: 14:33  新stay: 30(新規)  座標: 33.0846793/131.1137762(OSM node「夫婦滝」)`);
  console.log("  新memo:", MEOTODAKI_MEMO);
  console.log(`[5] 黒川温泉 (id=${kurokawa.id})  新visitTime: 15:10  新stay: 90(無変更、〜16:40)`);
  console.log("  新memo:", newKurokawaMemo);
  console.log(
    "\nDay1 新しい時刻: 満願寺11:37(45)→瀬の本高原12:37(30、昼食)→押戸石の丘13:27(45)→夫婦滝14:33(30、新規)→黒川温泉15:10(90、〜16:40)"
  );
  console.log("\nDay2(最終日)は09:00開始・7か所。北里柴三郎記念館・下城の大イチョウの座標訂正にともない、2・3・6・7番目の時刻を測り直した(滞在は延ばさず、16:42終了)。");

  console.log("\n=== Day2 言葉づかい・座標・書き出しの直し ===");
  console.log(`[満願寺温泉館] (id=${manganjiOnsen.id})  新座標: 33.0755359/131.0957715(OSM node「Manganji Onsen」)`);
  console.log("  旧lat/lng:", manganjiOnsen.lat, manganjiOnsen.lng);
  console.log("  新memo:", newManganjiOnsenMemo);
  console.log(`[北里柴三郎記念館] (id=${kitasato.id})  新visitTime: 10:28  新座標: 33.1409315/131.0910328(企画運営の例外、同じ施設群「木魂館キャンプ場」node14287593198)`);
  console.log("  旧lat/lng:", kitasato.lat, kitasato.lng);
  console.log("  新memo:", newKitasatoMemo);
  console.log(`[道の駅小国ゆうステーション] (id=${michinoeki.id})  新visitTime: 11:25  新座標: 33.1231535/131.0647738(Nominatim way1124059100)`);
  console.log("  旧lat/lng:", michinoeki.lat, michinoeki.lng);
  console.log("  新memo:", newMichinoekiMemo);
  console.log(`[坂本善三美術館] (id=${sakamoto.id})  新visitTime: 12:28`);
  console.log("  新memo:", newSakamotoMemo);
  console.log(`[鍋ヶ滝] (id=${nabegataki.id})  新visitTime: 13:37`);
  console.log("  新memo:", newNabegatakiMemo);
  console.log(`[下城の大イチョウ] (id=${icho.id})  新visitTime: 14:30  新座標: 33.1502718/131.0550277(OSM node「下城大イチョウ」natural=tree)`);
  console.log("  旧lat/lng:", icho.lat, icho.lng);
  console.log("  新memo:", newIchoMemo);
  console.log(`[杖立温泉] (id=${tsuetate.id})  新visitTime: 15:12(〜16:42)`);
  console.log("  新memo:", newTsuetateMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: manganji.id, data: { visitTime: T(11, 37), stayDurationMin: 45, memo: newManganjiMemo, lat: 33.076067, lng: 131.096021 } },
      { id: senomoto.id, data: { visitTime: T(12, 37), stayDurationMin: 30, memo: newSenomotoMemo } },
      { id: oshidoishi.id, data: { visitTime: T(13, 27), stayDurationMin: 45, memo: newOshidoishiMemo } },
      {
        create: {
          name: "夫婦滝",
          lat: 33.0846793,
          lng: 131.1137762,
          visitTime: T(14, 33),
          stayDurationMin: 30,
          memo: MEOTODAKI_MEMO,
          stampCategory: "water",
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 21 }] },
        },
      },
      {
        id: kurokawa.id,
        data: {
          visitTime: T(15, 10),
          memo: newKurokawaMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
        },
      },
    ],
    { remove: [ASOJINJA_ID, MONZENCHO_ID, DAIKANBO_ID] }
  );

  await prisma.spot.update({
    where: { id: MANGANJI_ONSEN_ID },
    data: { memo: newManganjiOnsenMemo, lat: 33.0755359, lng: 131.0957715 },
  });
  await prisma.spot.update({
    where: { id: KITASATO_ID },
    data: {
      memo: newKitasatoMemo,
      lat: 33.1409315,
      lng: 131.0910328,
      visitTime: T(10, 28),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 18 }] },
    },
  });
  await prisma.spot.update({
    where: { id: MICHINOEKI_ID },
    data: {
      memo: newMichinoekiMemo,
      lat: 33.1231535,
      lng: 131.0647738,
      visitTime: T(11, 25),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
    },
  });
  await prisma.spot.update({ where: { id: SAKAMOTO_ID }, data: { memo: newSakamotoMemo, visitTime: T(12, 28) } });
  await prisma.spot.update({ where: { id: NABEGATAKI_ID }, data: { memo: newNabegatakiMemo, visitTime: T(13, 37) } });
  await prisma.spot.update({
    where: { id: ICHO_ID },
    data: {
      memo: newIchoMemo,
      lat: 33.1502718,
      lng: 131.0550277,
      visitTime: T(14, 30),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 13 }] },
    },
  });
  await prisma.spot.update({
    where: { id: TSUETATE_ID },
    data: {
      memo: newTsuetateMemo,
      visitTime: T(15, 12),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
    },
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
